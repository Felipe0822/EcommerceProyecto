import { Router } from "express";
import { CategoryController } from "../../controllers/category.controller";
import { container } from "../../config/container";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

const router = Router();

router.get("/", authMiddleware,
    requireRole(["CLIENT", "ADMIN"]), (req, res) => {
    const controller = container.resolve<CategoryController>("categoryController");
    controller.getCategories(req, res);
});
router.get("/:id", authMiddleware,
    requireRole(["CLIENT", "ADMIN"]), (req, res) => {
    const controller = container.resolve<CategoryController>("categoryController");
    controller.getCategory(req, res);
});

router.post("/", authMiddleware,
    requireRole(["ADMIN"]), (req, res) => {
    const controller = container.resolve<CategoryController>("categoryController");
    controller.createCategory(req, res);
});


router.put("/:id", authMiddleware,
    requireRole(["ADMIN"]), (req, res) => {
    const controller = container.resolve<CategoryController>("categoryController");
    controller.updateCategory(req, res);
});

router.delete("/:id", authMiddleware,
    requireRole(["ADMIN"]), (req, res) => {
    const controller = container.resolve<CategoryController>("categoryController");
    controller.deleteCategory(req, res);
});

export default router;