import { describe, it, expect, vi } from "vitest";
import { ProductService } from "../src/services/product.service";

describe("ProductService", () => {
  it("debería obtener todos los productos", async () => {
    const mockRepository = {
      findAll: vi.fn().mockResolvedValue([
        { id: 1, name: "Laptop" }
      ])
    };

    const service = new ProductService(mockRepository as any, {} as any);

    const result = await service.getProducts();

    expect(result).toHaveLength(1);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });

  it("debería obtener un producto por id", async () => {
    const mockRepository = {
      findById: vi.fn().mockResolvedValue({ id: 1, name: "Laptop" })
    };

    const service = new ProductService(mockRepository as any, {} as any);

    const result = await service.getProduct(1);

    expect(result).toEqual({ id: 1, name: "Laptop" });
    expect(mockRepository.findById).toHaveBeenCalledWith(1);
  });

  it("debería lanzar error si el producto no existe", async () => {
    const mockRepository = {
      findById: vi.fn().mockResolvedValue(null)
    };

    const service = new ProductService(mockRepository as any, {} as any);

    await expect(service.getProduct(1)).rejects.toThrow("Producto no encontrado");
  });

  it("debería traer producto con datos externos", async () => {
    const mockRepository = {
      findById: vi.fn().mockResolvedValue({ id: 1, name: "Laptop" })
    };

    const mockExternal = {
      getProduct: vi.fn().mockResolvedValue({ title: "Fake product" })
    };

    const service = new ProductService(mockRepository as any, mockExternal as any);

    const result = await service.getProductWithExternalData(1);

    expect(result).toEqual({
      id: 1,
      name: "Laptop",
      externalData: { title: "Fake product" }
    });
    expect(mockExternal.getProduct).toHaveBeenCalledWith(1);
  });

  it("debería devolver externalData null si falla la API externa", async () => {
    const mockRepository = {
      findById: vi.fn().mockResolvedValue({ id: 1, name: "Laptop" })
    };

    const mockExternal = {
      getProduct: vi.fn().mockRejectedValue(new Error("Servicio no disponible"))
    };

    const service = new ProductService(mockRepository as any, mockExternal as any);

    const result = await service.getProductWithExternalData(1);

    expect(result).toEqual({
      id: 1,
      name: "Laptop",
      externalData: null
    });
    expect(mockExternal.getProduct).toHaveBeenCalledWith(1);
  });

  it("debería crear un producto válido", async () => {
    const mockRepository = {
      create: vi.fn().mockResolvedValue({ id: 1, name: "Laptop", price: 100, stock: 10, category_id: 2 })
    };

    const service = new ProductService(mockRepository as any, {} as any);

    const result = await service.createProduct("Laptop", 100, 10, 2);

    expect(result).toEqual({ id: 1, name: "Laptop", price: 100, stock: 10, category_id: 2 });
    expect(mockRepository.create).toHaveBeenCalledWith("Laptop", 100, 10, 2);
  });

  it("debería lanzar error si faltan datos al crear el producto", async () => {
    const mockRepository = {
      create: vi.fn()
    };

    const service = new ProductService(mockRepository as any, {} as any);

    await expect(service.createProduct("", 100, 10, 2)).rejects.toThrow("Datos inválidos");
    await expect(service.createProduct("Laptop", 0, 10, 2)).rejects.toThrow("Datos inválidos");
  });

  it("debería lanzar error si el precio es menor o igual a cero al crear el producto", async () => {
    const mockRepository = {
      create: vi.fn()
    };

    const service = new ProductService(mockRepository as any, {} as any);

    await expect(service.createProduct("Laptop", -1, 10, 2)).rejects.toThrow("El precio debe ser mayor a cero");
  });

  it("debería actualizar un producto existente", async () => {
    const mockRepository = {
      update: vi.fn().mockResolvedValue({ id: 1, name: "Laptop", price: 120, stock: 8, category_id: 2 })
    };

    const service = new ProductService(mockRepository as any, {} as any);

    const result = await service.updateProduct(1, "Laptop", 120, 8, 2);

    expect(result).toEqual({ id: 1, name: "Laptop", price: 120, stock: 8, category_id: 2 });
    expect(mockRepository.update).toHaveBeenCalledWith(1, "Laptop", 120, 8, 2);
  });

  it("debería lanzar error al actualizar un producto que no existe", async () => {
    const mockRepository = {
      update: vi.fn().mockResolvedValue(null)
    };

    const service = new ProductService(mockRepository as any, {} as any);

    await expect(service.updateProduct(1, "Laptop", 120, 8, 2)).rejects.toThrow("Producto no encontrado");
  });

  it("debería eliminar un producto existente", async () => {
    const mockRepository = {
      delete: vi.fn().mockResolvedValue({ id: 1, name: "Laptop" })
    };

    const service = new ProductService(mockRepository as any, {} as any);

    const result = await service.deleteProduct(1);

    expect(result).toEqual({ id: 1, name: "Laptop" });
    expect(mockRepository.delete).toHaveBeenCalledWith(1);
  });

  it("debería lanzar error al eliminar un producto que no existe", async () => {
    const mockRepository = {
      delete: vi.fn().mockResolvedValue(null)
    };

    const service = new ProductService(mockRepository as any, {} as any);

    await expect(service.deleteProduct(1)).rejects.toThrow("Producto no encontrado");
  });
});