import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { container } from "../config/container";

const router = Router();
const controller = container.resolve<CategoryController>("categoryController")

router.get("/", controller.getCategories);

router.get("/:id", controller.getCategory);

router.post("/", controller.createCategory);

router.put("/:id", controller.updateCategory);

router.delete("/:id", controller.deleteCategory);

export default router;