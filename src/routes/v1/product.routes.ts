import { Router } from "express";
import { ProductController } from "../../controllers/product.controller";
import { container } from "../../config/container";

const router = Router();
const controller = container.resolve<ProductController>("productController");

router.get("/", (req, res) => controller.getProducts(req, res));

router.get("/full", (req, res) => controller.getProductFull(req, res)); // 🔥 antes de :id

router.get("/:id", (req, res) => controller.getProduct(req, res));

router.post("/", (req, res) => controller.createProduct(req, res));

router.put("/:id", (req, res) => controller.updateProduct(req, res));

router.delete("/:id", (req, res) => controller.deleteProduct(req, res));

export default router;