import { describe, it, expect, vi } from "vitest";
import { CategoryService } from "../src/services/category.service";

describe("CategoryService", () => {
  it("debería obtener todas las categorías", async () => {
    const mockRepository = {
      findAll: vi.fn().mockResolvedValue([
        { id: 1, name: "Electrónica" }
      ])
    };

    const service = new CategoryService(mockRepository as any);

    const result = await service.getCategories();

    expect(result).toEqual([{ id: 1, name: "Electrónica" }]);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });

  it("debería obtener una categoría por id", async () => {
    const mockRepository = {
      findById: vi.fn().mockResolvedValue({ id: 1, name: "Electrónica" })
    };

    const service = new CategoryService(mockRepository as any);

    const result = await service.getCategory(1);

    expect(result).toEqual({ id: 1, name: "Electrónica" });
    expect(mockRepository.findById).toHaveBeenCalledWith(1);
  });

  it("debería lanzar error si la categoría no existe", async () => {
    const mockRepository = {
      findById: vi.fn().mockResolvedValue(null)
    };

    const service = new CategoryService(mockRepository as any);

    await expect(service.getCategory(1)).rejects.toThrow("Categoría no encontrada");
  });

  it("debería crear una categoría válida", async () => {
    const mockRepository = {
      create: vi.fn().mockResolvedValue({ id: 1, name: "Electrónica", description: "Dispositivos y accesorios" })
    };

    const service = new CategoryService(mockRepository as any);

    const result = await service.createCategory("Electrónica", "Dispositivos y accesorios");

    expect(result).toEqual({ id: 1, name: "Electrónica", description: "Dispositivos y accesorios" });
    expect(mockRepository.create).toHaveBeenCalledWith("Electrónica", "Dispositivos y accesorios");
  });

  it("debería lanzar error si falta el nombre al crear una categoría", async () => {
    const mockRepository = {
      create: vi.fn()
    };

    const service = new CategoryService(mockRepository as any);

    await expect(service.createCategory("", "Sin nombre")).rejects.toThrow("El nombre es obligatorio");
  });

  it("debería actualizar una categoría existente", async () => {
    const mockRepository = {
      update: vi.fn().mockResolvedValue({ id: 1, name: "Electrónica", description: "Dispositivos actualizados" })
    };

    const service = new CategoryService(mockRepository as any);

    const result = await service.updateCategory(1, "Electrónica", "Dispositivos actualizados");

    expect(result).toEqual({ id: 1, name: "Electrónica", description: "Dispositivos actualizados" });
    expect(mockRepository.update).toHaveBeenCalledWith(1, "Electrónica", "Dispositivos actualizados");
  });

  it("debería lanzar error al actualizar una categoría que no existe", async () => {
    const mockRepository = {
      update: vi.fn().mockResolvedValue(null)
    };

    const service = new CategoryService(mockRepository as any);

    await expect(service.updateCategory(1, "Electrónica", "Descripción"))
      .rejects.toThrow("Categoría no encontrada");
  });

  it("debería eliminar una categoría existente", async () => {
    const mockRepository = {
      delete: vi.fn().mockResolvedValue({ id: 1, name: "Electrónica" })
    };

    const service = new CategoryService(mockRepository as any);

    const result = await service.deleteCategory(1);

    expect(result).toEqual({ id: 1, name: "Electrónica" });
    expect(mockRepository.delete).toHaveBeenCalledWith(1);
  });

  it("debería lanzar error al eliminar una categoría que no existe", async () => {
    const mockRepository = {
      delete: vi.fn().mockResolvedValue(null)
    };

    const service = new CategoryService(mockRepository as any);

    await expect(service.deleteCategory(1)).rejects.toThrow("Categoría no encontrada");
  });
});