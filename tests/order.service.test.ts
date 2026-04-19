import { describe, it, expect, vi } from "vitest";
import { OrderService } from "../src/services/order.service";

describe("OrderService", () => {
  it("debería obtener todos los pedidos", async () => {
    const mockRepository = {
      getOrders: vi.fn().mockResolvedValue([
        { id: 1, customer_name: "Juan", total: 100 }
      ])
    };

    const service = new OrderService(mockRepository as any);

    const result = await service.getOrders();

    expect(result).toEqual([{ id: 1, customer_name: "Juan", total: 100 }]);
    expect(mockRepository.getOrders).toHaveBeenCalled();
  });

  it("debería crear un pedido válido", async () => {
    const mockRepository = {
      createOrderWithItems: vi.fn().mockResolvedValue({
        id: 1,
        customer_name: "Juan",
        items: [{ product_id: 1, quantity: 2 }]
      })
    };

    const service = new OrderService(mockRepository as any);

    const order = await service.createOrder("Juan", [{ product_id: 1, quantity: 2 }]);

    expect(order).toEqual({
      id: 1,
      customer_name: "Juan",
      items: [{ product_id: 1, quantity: 2 }]
    });
    expect(mockRepository.createOrderWithItems).toHaveBeenCalledTimes(1);
    expect(mockRepository.createOrderWithItems).toHaveBeenCalledWith(
      "Juan",
      [{ product_id: 1, quantity: 2 }]
    );
  });

  it("debería lanzar error si falta el nombre del cliente al crear un pedido", async () => {
    const mockRepository = {
      createOrderWithItems: vi.fn()
    };

    const service = new OrderService(mockRepository as any);

    await expect(service.createOrder("", [{ product_id: 1, quantity: 2 }]))
      .rejects.toThrow("El nombre del cliente es obligatorio");
  });

  it("debería lanzar error si el pedido no tiene productos", async () => {
    const mockRepository = {
      createOrderWithItems: vi.fn()
    };

    const service = new OrderService(mockRepository as any);

    await expect(service.createOrder("Juan", [])).rejects.toThrow("El pedido no tiene productos");
    await expect(service.createOrder("Juan", null as any)).rejects.toThrow("El pedido no tiene productos");
  });

  it("debería obtener un pedido por id", async () => {
    const mockRepository = {
      getOrderWithItems: vi.fn().mockResolvedValue({
        id: 1,
        customer_name: "Juan",
        items: [{ product_id: 1, quantity: 2 }]
      })
    };

    const service = new OrderService(mockRepository as any);

    const result = await service.getOrder(1);

    expect(result).toEqual({
      id: 1,
      customer_name: "Juan",
      items: [{ product_id: 1, quantity: 2 }]
    });
    expect(mockRepository.getOrderWithItems).toHaveBeenCalledWith(1);
  });

  it("debería lanzar error si el pedido no existe", async () => {
    const mockRepository = {
      getOrderWithItems: vi.fn().mockResolvedValue(null)
    };

    const service = new OrderService(mockRepository as any);

    await expect(service.getOrder(1)).rejects.toThrow("Pedido no encontrado");
  });

  it("debería eliminar un pedido existente", async () => {
    const mockRepository = {
      delete: vi.fn().mockResolvedValue({ id: 1, customer_name: "Juan" })
    };

    const service = new OrderService(mockRepository as any);

    const result = await service.deleteOrder(1);

    expect(result).toEqual({ id: 1, customer_name: "Juan" });
    expect(mockRepository.delete).toHaveBeenCalledWith(1);
  });

  it("debería lanzar error al eliminar un pedido no existente", async () => {
    const mockRepository = {
      delete: vi.fn().mockResolvedValue(null)
    };

    const service = new OrderService(mockRepository as any);

    await expect(service.deleteOrder(1)).rejects.toThrow("Orden no encontrada");
  });
});