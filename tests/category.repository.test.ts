import { describe, it, expect, vi, beforeEach } from "vitest";
import { CategoryRepository } from "../src/repositories/category.repository";

vi.mock("../src/config/db", () => ({
  pool: {
    query: vi.fn()
  }
}));

import { pool } from "../src/config/db";

describe("CategoryRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería obtener todas las categorías", async () => {
    const mockCategories = [
      { id: 1, name: "Electrónica", description: "Dispositivos electrónicos" },
      { id: 2, name: "Ropa", description: "Prendas de vestir" }
    ];

    vi.mocked(pool.query).mockResolvedValue({ rows: mockCategories } as any);

    const repository = new CategoryRepository();
    const result = await repository.findAll();

    expect(result).toEqual(mockCategories);
    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM categories");
  });

  it("debería retornar array vacío si no hay categorías", async () => {
    vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any);

    const repository = new CategoryRepository();
    const result = await repository.findAll();

    expect(result).toEqual([]);
  });

  it("debería obtener una categoría por id", async () => {
    const mockCategory = { id: 1, name: "Electrónica", description: "Dispositivos electrónicos" };

    vi.mocked(pool.query).mockResolvedValue({ rows: [mockCategory] } as any);

    const repository = new CategoryRepository();
    const result = await repository.findById(1);

    expect(result).toEqual(mockCategory);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM categories WHERE id=$1",
      [1]
    );
  });

  it("debería retornar undefined si la categoría no existe", async () => {
    vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any);

    const repository = new CategoryRepository();
    const result = await repository.findById(999);

    expect(result).toBeUndefined();
  });

  it("debería crear una nueva categoría", async () => {
    const newCategory = { id: 3, name: "Libros", description: "Libros y literatura" };

    vi.mocked(pool.query).mockResolvedValue({ rows: [newCategory] } as any);

    const repository = new CategoryRepository();
    const result = await repository.create("Libros", "Libros y literatura");

    expect(result).toEqual(newCategory);
    expect(pool.query).toHaveBeenCalledWith(
      "INSERT INTO categories(name, description) VALUES($1,$2) RETURNING *",
      ["Libros", "Libros y literatura"]
    );
  });

  it("debería crear una categoría sin descripción", async () => {
    const newCategory = { id: 4, name: "Deportes", description: null };

    vi.mocked(pool.query).mockResolvedValue({ rows: [newCategory] } as any);

    const repository = new CategoryRepository();
    const result = await repository.create("Deportes", null as any);

    expect(result).toEqual(newCategory);
  });

  it("debería actualizar una categoría existente", async () => {
    const updatedCategory = { id: 1, name: "Electrónica Updated", description: "Electrónica y gadgets" };

    vi.mocked(pool.query).mockResolvedValue({ rows: [updatedCategory] } as any);

    const repository = new CategoryRepository();
    const result = await repository.update(1, "Electrónica Updated", "Electrónica y gadgets");

    expect(result).toEqual(updatedCategory);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE categories"),
      ["Electrónica Updated", "Electrónica y gadgets", 1]
    );
  });

  it("debería retornar undefined al actualizar una categoría que no existe", async () => {
    vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any);

    const repository = new CategoryRepository();
    const result = await repository.update(999, "Categoría", "Descripción");

    expect(result).toBeUndefined();
  });

  it("debería eliminar una categoría", async () => {
    const deletedCategory = { id: 1, name: "Electrónica", description: "Dispositivos electrónicos" };

    vi.mocked(pool.query).mockResolvedValue({ rows: [deletedCategory] } as any);

    const repository = new CategoryRepository();
    const result = await repository.delete(1);

    expect(result).toEqual(deletedCategory);
    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM categories WHERE id=$1 RETURNING *",
      [1]
    );
  });

  it("debería retornar undefined al eliminar una categoría que no existe", async () => {
    vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any);

    const repository = new CategoryRepository();
    const result = await repository.delete(999);

    expect(result).toBeUndefined();
  });
});