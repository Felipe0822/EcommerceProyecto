import { Router } from "express";
import { AuthController } from "../../controllers/auth.controller";
import { container } from "../../config/container";

const router = Router();

router.post("/", (req, res) => {
    const controller = container.resolve<AuthController>("authController");
    controller.register(req, res);
});

router.post("/", (req, res) => {
    const controller = container.resolve<AuthController>("authController");
    controller.login(req, res);
});

router.get("/", (req, res) => {
    const controller = container.resolve<AuthController>("authController");
    controller.getUsers(req, res);
});

router.get("/:id", (req, res) => {
    const controller = container.resolve<AuthController>("authController");
    controller.getUserById(req, res);
}); 

router.put("/:id", (req, res) => {
    const controller = container.resolve<AuthController>("authController");
    controller.updateUser(req, res);
});

router.delete("/:id", (req, res) => {
    const controller = container.resolve<AuthController>("authController");
    controller.deleteUser(req, res);
});

export default router;
