"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const product_service_1 = require("../src/services/product.service");
(0, vitest_1.describe)("ProductService", () => {
    (0, vitest_1.it)("debería obtener todos los productos", async () => {
        // 🔥 mock del repository
        const mockRepository = {
            findAll: vitest_1.vi.fn().mockResolvedValue([
                { id: 1, name: "Laptop" }
            ])
        };
        // 🔥 mock de API externa
        const mockExternal = {
            getProduct: vitest_1.vi.fn()
        };
        const service = new product_service_1.ProductService(mockRepository, mockExternal);
        const result = await service.getProducts();
        (0, vitest_1.expect)(result).toHaveLength(1);
        (0, vitest_1.expect)(mockRepository.findAll).toHaveBeenCalled();
    }),
        (0, vitest_1.it)("debería lanzar error si producto no existe", async () => {
            const mockRepository = {
                findById: vitest_1.vi.fn().mockResolvedValue(null)
            };
            const service = new product_service_1.ProductService(mockRepository, {});
            await (0, vitest_1.expect)(service.getProduct(1))
                .rejects
                .toThrow("Producto no encontrado");
        }),
        (0, vitest_1.it)("debería traer producto con datos externos", async () => {
            const mockRepository = {
                findById: vitest_1.vi.fn().mockResolvedValue({
                    id: 1,
                    name: "Laptop"
                })
            };
            const mockExternal = {
                getProduct: vitest_1.vi.fn().mockResolvedValue({
                    title: "Fake product"
                })
            };
            const service = new product_service_1.ProductService(mockRepository, mockExternal);
            const result = await service.getProductWithExternalData(1);
            (0, vitest_1.expect)(result.externalData).toBeDefined();
            (0, vitest_1.expect)(mockExternal.getProduct).toHaveBeenCalledWith(1);
        });
});
