import { describe, it, expect, vi, beforeEach } from "vitest";
import { OrderRepository } from "../src/repositories/order.repository";

vi.mock("../src/config/db", () => ({
  pool: {
    query: vi.fn(),
    connect: vi.fn()
  }
}));

import { pool } from "../src/config/db";

describe("OrderRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createOrderWithItems", () => {
    it("debería crear una orden con items exitosamente", async () => {
      const mockClient = {
        query: vi.fn(),
        release: vi.fn()
      };

      vi.mocked(pool.connect).mockResolvedValue(mockClient as any);

      mockClient.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: [{ id: 1, customer_name: "Juan", total: 0 }] }) // INSERT order
        .mockResolvedValueOnce({ rows: [{ price: 100 }] }) // SELECT product price
        .mockResolvedValueOnce({ rows: [] }) // INSERT order_item
        .mockResolvedValueOnce({ rows: [] }) // UPDATE total
        .mockResolvedValueOnce({ rows: [{ id: 1, customer_name: "Juan", total: 100 }] }) // SELECT updated order
        .mockResolvedValueOnce({ rows: [] }); // COMMIT

      const repository = new OrderRepository();
      const result = await repository.createOrderWithItems("Juan", [
        { product_id: 1, quantity: 1 }
      ]);

      expect(result).toEqual({ id: 1, customer_name: "Juan", total: 100 });
      expect(mockClient.release).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith("BEGIN");
      expect(mockClient.query).toHaveBeenCalledWith("COMMIT");
    });

    it("debería crear una orden con múltiples items", async () => {
      const mockClient = {
        query: vi.fn(),
        release: vi.fn()
      };

      vi.mocked(pool.connect).mockResolvedValue(mockClient as any);

      mockClient.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: [{ id: 2, customer_name: "María", total: 0 }] }) // INSERT order
        .mockResolvedValueOnce({ rows: [{ price: 100 }] }) // SELECT product 1 price
        .mockResolvedValueOnce({ rows: [] }) // INSERT order_item 1
        .mockResolvedValueOnce({ rows: [{ price: 50 }] }) // SELECT product 2 price
        .mockResolvedValueOnce({ rows: [] }) // INSERT order_item 2
        .mockResolvedValueOnce({ rows: [] }) // UPDATE total
        .mockResolvedValueOnce({ rows: [{ id: 2, customer_name: "María", total: 250 }] }) // SELECT updated order
        .mockResolvedValueOnce({ rows: [] }); // COMMIT

      const repository = new OrderRepository();
      const result = await repository.createOrderWithItems("María", [
        { product_id: 1, quantity: 1 },
        { product_id: 2, quantity: 4 }
      ]);

      expect(result).toEqual({ id: 2, customer_name: "María", total: 250 });
    });

    it("debería hacer rollback si un producto no existe", async () => {
      const mockClient = {
        query: vi.fn(),
        release: vi.fn()
      };

      vi.mocked(pool.connect).mockResolvedValue(mockClient as any);

      mockClient.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: [{ id: 3, customer_name: "Carlos", total: 0 }] }) // INSERT order
        .mockResolvedValueOnce({ rows: [] }) // SELECT product (no existe)
        .mockResolvedValueOnce({ rows: [] }); // ROLLBACK

      const repository = new OrderRepository();

      await expect(
        repository.createOrderWithItems("Carlos", [{ product_id: 999, quantity: 1 }])
      ).rejects.toThrow("Producto 999 no existe");

      expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
      expect(mockClient.release).toHaveBeenCalled();
    });

    it("debería hacer rollback si hay error en la transacción", async () => {
      const mockClient = {
        query: vi.fn(),
        release: vi.fn()
      };

      vi.mocked(pool.connect).mockResolvedValue(mockClient as any);

      mockClient.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockRejectedValueOnce(new Error("Database error")); // INSERT order fails

      const repository = new OrderRepository();

      await expect(
        repository.createOrderWithItems("Pedro", [{ product_id: 1, quantity: 1 }])
      ).rejects.toThrow("Database error");

      expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe("getOrders", () => {
    it("debería obtener todas las órdenes", async () => {
      const mockOrders = [
        { id: 1, customer_name: "Juan", total: 100, created_at: "2024-01-01" },
        { id: 2, customer_name: "María", total: 250, created_at: "2024-01-02" }
      ];

      vi.mocked(pool.query).mockResolvedValue({ rows: mockOrders } as any);

      const repository = new OrderRepository();
      const result = await repository.getOrders();

      expect(result).toEqual(mockOrders);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM orders ORDER BY created_at DESC")
      );
    });

    it("debería retornar array vacío si no hay órdenes", async () => {
      vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any);

      const repository = new OrderRepository();
      const result = await repository.getOrders();

      expect(result).toEqual([]);
    });
  });

  describe("getOrderWithItems", () => {
    it("debería obtener una orden con sus items", async () => {
      const mockOrder = { id: 1, customer_name: "Juan", total: 100 };
      const mockItems = [
        { id: 1, order_id: 1, product_id: 1, quantity: 1, price: 100, name: "Laptop" }
      ];

      vi.mocked(pool.query)
        .mockResolvedValueOnce({ rows: [mockOrder] } as any) // SELECT order
        .mockResolvedValueOnce({ rows: mockItems } as any); // SELECT items

      const repository = new OrderRepository();
      const result = await repository.getOrderWithItems(1);

      expect(result).toEqual({ ...mockOrder, items: mockItems });
      expect(pool.query).toHaveBeenCalledTimes(2);
    });

    it("debería retornar null si la orden no existe", async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as any);

      const repository = new OrderRepository();
      const result = await repository.getOrderWithItems(999);

      expect(result).toBeNull();
    });

    it("debería retornar orden con items vacío si no hay items", async () => {
      const mockOrder = { id: 2, customer_name: "María", total: 0 };

      vi.mocked(pool.query)
        .mockResolvedValueOnce({ rows: [mockOrder] } as any)
        .mockResolvedValueOnce({ rows: [] } as any);

      const repository = new OrderRepository();
      const result = await repository.getOrderWithItems(2);

      expect(result).toEqual({ ...mockOrder, items: [] });
    });
  });

  describe("delete", () => {
    it("debería eliminar una orden", async () => {
      const deletedOrder = { id: 1, customer_name: "Juan", total: 100 };

      vi.mocked(pool.query).mockResolvedValue({ rows: [deletedOrder] } as any);

      const repository = new OrderRepository();
      const result = await repository.delete(1);

      expect(result).toEqual(deletedOrder);
      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM orders WHERE id=$1 RETURNING *",
        [1]
      );
    });

    it("debería retornar undefined si la orden no existe", async () => {
      vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any);

      const repository = new OrderRepository();
      const result = await repository.delete(999);

      expect(result).toBeUndefined();
    });
  });
});