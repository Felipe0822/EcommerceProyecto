import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProductRepository } from "../src/repositories/product.repository";

vi.mock("../src/config/db", () => ({
  pool: {
    query: vi.fn()
  }
}));

import { pool } from "../src/config/db";

describe("ProductRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería obtener todos los productos", async () => {
    const mockProducts = [
      { id: 1, name: "Laptop", price: 1000, stock: 5, category_id: 1, category: "Electrónica" },
      { id: 2, name: "Mouse", price: 50, stock: 20, category_id: 1, category: "Electrónica" }
    ];

    vi.mocked(pool.query).mockResolvedValue({ rows: mockProducts } as any);

    const repository = new ProductRepository();
    const result = await repository.findAll();

    expect(result).toEqual(mockProducts);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("SELECT p.*, c.name as category")
    );
  });

  it("debería obtener un producto por id", async () => {
    const mockProduct = { id: 1, name: "Laptop", price: 1000, stock: 5, category_id: 1 };

    vi.mocked(pool.query).mockResolvedValue({ rows: [mockProduct] } as any);

    const repository = new ProductRepository();
    const result = await repository.findById(1);

    expect(result).toEqual(mockProduct);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM products WHERE id=$1",
      [1]
    );
  });

  it("debería retornar undefined si el producto no existe", async () => {
    vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any);

    const repository = new ProductRepository();
    const result = await repository.findById(999);

    expect(result).toBeUndefined();
  });

  it("debería crear un nuevo producto", async () => {
    const newProduct = { id: 3, name: "Teclado", price: 100, stock: 15, category_id: 1 };

    vi.mocked(pool.query).mockResolvedValue({ rows: [newProduct] } as any);

    const repository = new ProductRepository();
    const result = await repository.create("Teclado", 100, 15, 1);

    expect(result).toEqual(newProduct);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO products"),
      ["Teclado", 100, 15, 1]
    );
  });

  it("debería actualizar un producto existente", async () => {
    const updatedProduct = { id: 1, name: "Laptop Updated", price: 1200, stock: 3, category_id: 1 };

    vi.mocked(pool.query).mockResolvedValue({ rows: [updatedProduct] } as any);

    const repository = new ProductRepository();
    const result = await repository.update(1, "Laptop Updated", 1200, 3, 1);

    expect(result).toEqual(updatedProduct);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE products"),
      ["Laptop Updated", 1200, 3, 1, 1]
    );
  });

  it("debería retornar undefined al actualizar un producto que no existe", async () => {
    vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any);

    const repository = new ProductRepository();
    const result = await repository.update(999, "Laptop", 1000, 5, 1);

    expect(result).toBeUndefined();
  });

  it("debería eliminar un producto", async () => {
    const deletedProduct = { id: 1, name: "Laptop", price: 1000, stock: 5, category_id: 1 };

    vi.mocked(pool.query).mockResolvedValue({ rows: [deletedProduct] } as any);

    const repository = new ProductRepository();
    const result = await repository.delete(1);

    expect(result).toEqual(deletedProduct);
    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM products WHERE id=$1 RETURNING *",
      [1]
    );
  });

  it("debería retornar undefined al eliminar un producto que no existe", async () => {
    vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any);

    const repository = new ProductRepository();
    const result = await repository.delete(999);

    expect(result).toBeUndefined();
  });
});