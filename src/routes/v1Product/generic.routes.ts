import { Router } from "express";
import { container } from "../../config/container";
import { ProductController } from "../../controllers/product.controller";

const router=Router();


router.get("/", (req, res) => {
    const controller = container.resolve<ProductController>("productController");
    controller.getProducts(req, res);
});

router.get("/:id", (req, res) => {
    const controller = container.resolve<ProductController>("productController");
    controller.getProduct(req, res);
});


router.post("/", (req, res) => {
    const controller = container.resolve<ProductController>("productController");
    controller.getProducts(req, res);
});

router.put("/:id", (req, res) => {
    const controller = container.resolve<ProductController>("productController");
    controller.getProducts(req, res);
});

router.delete("/", (req, res) => {
    const controller = container.resolve<ProductController>("productController");
    controller.getProducts(req, res);
});

router.get("/:id:full", (req, res) => {
    const controller = container.resolve<ProductController>("productController");
    controller.getProductFull(req, res);
});
/*
router.get("/:id", controller.getProduct);

router.post("/", controller.createProduct);

router.put("/:id", controller.updateProduct);

router.delete("/:id", controller.deleteProduct);

router.get("/:id/full", controller.getProductFull);

export default router;*/