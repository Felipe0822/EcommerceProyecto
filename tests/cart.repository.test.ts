import { describe, it, expect, vi, beforeEach } from "vitest";
import { CartRepository } from "../src/repositories/cart.repository";

vi.mock("../src/config/db", () => ({
  pool: {
    query: vi.fn(),
    connect: vi.fn()
  }
}));

import { pool } from "../src/config/db";

describe("CartRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createCart", () => {
    it("debería crear un carrito correctamente", async () => {
      const mockCart = { id: 1, user_id: 1 };

      vi.mocked(pool.query).mockResolvedValue({ rows: [mockCart] } as any);

      const repository = new CartRepository();
      const result = await repository.createCart(1);

      expect(result).toEqual(mockCart);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO carts"),
        [1]
      );
    });
  });

  describe("addItem", () => {
    it("debería agregar un item a un carrito existente", async () => {
      const mockCart = { id: 1, user_id: 1 };
      const mockItem = { id: 1, cart_id: 1, product_id: 2, quantity: 3 };

      vi.mocked(pool.query)
        .mockResolvedValueOnce({ rows: [mockCart] } as any) // getCartByUserId
        .mockResolvedValueOnce({ rows: [mockItem] } as any); // INSERT item

      const repository = new CartRepository();
      const result = await repository.addItem(1, 2, 3);

      expect(result).toEqual(mockItem);
      expect(pool.query).toHaveBeenCalledTimes(2);
    });

    it("debería crear un carrito y agregar el item si no existe", async () => {
      const mockCart = { id: 1, user_id: 1 };
      const mockItem = { id: 1, cart_id: 1, product_id: 2, quantity: 3 };

      vi.mocked(pool.query)
        .mockResolvedValueOnce({ rows: [] } as any) // getCartByUserId no encuentra
        .mockResolvedValueOnce({ rows: [mockCart] } as any) // createCart
        .mockResolvedValueOnce({ rows: [mockItem] } as any); // INSERT item

      const repository = new CartRepository();
      const result = await repository.addItem(1, 2, 3);

      expect(result).toEqual(mockItem);
      expect(pool.query).toHaveBeenCalledTimes(3);
    });
  });

  describe("getCart", () => {
    it("debería obtener un carrito con items", async () => {
      const mockCart = { id: 2, user_id: 2 };
      const mockItems = [
        { id: 1, product_id: 2, quantity: 1, name: "Producto", price: 100, subtotal: 100 }
      ];

      vi.mocked(pool.query)
        .mockResolvedValueOnce({ rows: [mockCart] } as any)
        .mockResolvedValueOnce({ rows: mockItems } as any);

      const repository = new CartRepository();
      const result = await repository.getCart(2);

      expect(result).toEqual({ ...mockCart, items: mockItems, total: 100 });
    });

    it("debería retornar null si el carrito no existe", async () => {
      vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as any);

      const repository = new CartRepository();
      const result = await repository.getCart(1);

      expect(result).toBeNull();
    });

    it("debería retornar carrito con items vacío si no hay items", async () => {
      const mockCart = { id: 1, user_id: 1 };

      vi.mocked(pool.query)
        .mockResolvedValueOnce({ rows: [mockCart] } as any)
        .mockResolvedValueOnce({ rows: [] } as any);

      const repository = new CartRepository();
      const result = await repository.getCart(1);

      expect(result).toEqual({ ...mockCart, items: [], total: 0 });
    });
  });

  describe("removeItem", () => {
    it("debería eliminar un item del carrito", async () => {
      const mockItem = { id: 1, cart_id: 1, product_id: 2, quantity: 3 };

      vi.mocked(pool.query).mockResolvedValue({ rows: [mockItem] } as any);

      const repository = new CartRepository();
      const result = await repository.removeItem(1);

      expect(result).toEqual(mockItem);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM cart_items"),
        [1]
      );
    });

    it("debería retornar undefined si el item no existe", async () => {
      vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any);

      const repository = new CartRepository();
      const result = await repository.removeItem(1);

      expect(result).toBeUndefined();
    });
  });

  describe("getCartByUserId", () => {
    

    it("debería retornar undefined si el usuario no tiene carrito", async () => {
      vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any);

      const repository = new CartRepository();
      const result = await repository.getCartByUserId(1);

      expect(result).toBeUndefined();
    });
  });

  describe("checkout", () => {


    it("debería hacer rollback si el carrito no existe", async () => {
      const mockClient = {
        query: vi.fn(),
        release: vi.fn()
      };

      vi.mocked(pool.connect).mockResolvedValue(mockClient as any);

      mockClient.query
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({ rows: [] } as any) // getCartByUserId no encuentra
        .mockResolvedValueOnce({}); // ROLLBACK

      const repository = new CartRepository();

      await expect(repository.checkout(1)).rejects.toThrow("Carrito no encontrado");

      expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
      expect(mockClient.release).toHaveBeenCalled();
    });

    it("debería hacer rollback si el carrito está vacío", async () => {
      const mockClient = {
        query: vi.fn(),
        release: vi.fn()
      };

      vi.mocked(pool.connect).mockResolvedValue(mockClient as any);

      const mockCart = { id: 1, user_id: 1 };

      mockClient.query
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({ rows: [mockCart] } as any) // getCartByUserId
        .mockResolvedValueOnce({ rows: [] } as any) // SELECT items vacío
        .mockResolvedValueOnce({}); // ROLLBACK

      const repository = new CartRepository();

      await expect(repository.checkout(1)).rejects.toThrow("Carrito no encontrado");

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
        .mockResolvedValueOnce({}) // BEGIN
        .mockRejectedValueOnce(new Error("Database error")); // Error en algún query

      const repository = new CartRepository();

      await expect(repository.checkout(1)).rejects.toThrow("Database error");

      expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
});