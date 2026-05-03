import { Router } from "express";
import { ProductController } from "../../controllers/product.controller";
import { container } from "../../config/container";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

const router = Router();
const controller = container.resolve<ProductController>("productController");

router.get("/",
    authMiddleware,
    requireRole(["CLIENT", "ADMIN"]), 
    (req, res) => controller.getProducts(req, res));

router.get("/full", authMiddleware,
    requireRole(["CLIENT", "ADMIN"]), (req, res) => controller.getProductFull(req, res)); // 🔥 antes de :id

router.get("/:id", authMiddleware,
    requireRole(["CLIENT", "ADMIN"]), (req, res) => controller.getProduct(req, res));

router.post("/",
    authMiddleware,
    requireRole(["ADMIN"]),  (req, res) => controller.createProduct(req, res));

router.put("/:id",authMiddleware,
    requireRole(["ADMIN"]),  (req, res) => controller.updateProduct(req, res));

router.delete("/:id",authMiddleware,
    requireRole(["ADMIN"]),  (req, res) => controller.deleteProduct(req, res));

export default router;