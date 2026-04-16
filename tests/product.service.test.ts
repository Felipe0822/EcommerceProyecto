import { describe, it, expect, vi } from "vitest";
import { ProductService } from "../src/services/product.service";

describe("ProductService", () => {

it("debería obtener todos los productos", async () => {

    // 🔥 mock del repository
    const mockRepository = {
        findAll: vi.fn().mockResolvedValue([
        { id: 1, name: "Laptop" }
    ])
    };

    // 🔥 mock de API externa
    const mockExternal = {
        getProduct: vi.fn()
    };

    const service = new ProductService(
        mockRepository as any,
        mockExternal as any
    );

    const result = await service.getProducts();

    expect(result).toHaveLength(1);
    expect(mockRepository.findAll).toHaveBeenCalled();

}),

it("debería lanzar error si producto no existe", async () => {

const mockRepository = {
    findById: vi.fn().mockResolvedValue(null)
};

const service = new ProductService(
    mockRepository as any,
    {} as any
);

await expect(service.getProduct(1))
    .rejects
    .toThrow("Producto no encontrado");

}),

it("debería traer producto con datos externos", async () => {

const mockRepository = {
    findById: vi.fn().mockResolvedValue({
        id: 1,
        name: "Laptop"
    })
};

const mockExternal = {
    getProduct: vi.fn().mockResolvedValue({
        title: "Fake product"
    })
};

const service = new ProductService(
    mockRepository as any,
    mockExternal as any
);

const result = await service.getProductWithExternalData(1);

expect(result.externalData).toBeDefined();
expect(mockExternal.getProduct).toHaveBeenCalledWith(1);

});
});