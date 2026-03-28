import { Router } from "express";
import { CategoryController } from "../../controllers/category.controller";
import { container } from "../../config/container";

const router = Router();

router.get("/", (req, res) => {
    const controller = container.resolve<CategoryController>("categoryController");
    controller.getCategories(req, res);
});
router.get("/:id", (req, res) => {
    const controller = container.resolve<CategoryController>("categoryController");
    controller.getCategory(req, res);
});

router.post("/", (req, res) => {
    const controller = container.resolve<CategoryController>("categoryController");
    controller.createCategory(req, res);
});


router.put("/:id", (req, res) => {
    const controller = container.resolve<CategoryController>("categoryController");
    controller.updateCategory(req, res);
});

router.delete("/:id", (req, res) => {
    const controller = container.resolve<CategoryController>("categoryController");
    controller.deleteCategory(req, res);
});

export default router;