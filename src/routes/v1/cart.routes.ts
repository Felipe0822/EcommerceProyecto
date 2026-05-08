import { Router } from "express";
import { CartController } from "../../controllers/cart.controller";
import { container } from "../../config/container";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

const router = Router();

// 🔥 Obtener carrito de un usuario
router.get(
  "/",
  authMiddleware,
  requireRole(["CLIENT", "ADMIN"]),
  (req, res) => {
    const controller =
      container.resolve<CartController>(
        "cartController"
      );

    controller.getCart(req, res);
  }
);

router.post(
  "/items",
  authMiddleware,
  requireRole(["CLIENT", "ADMIN"]),
  (req, res) => {
    const controller =
      container.resolve<CartController>(
        "cartController"
      );

    controller.addItem(req, res);
  }
);

router.delete(
  "/items/:id",
  authMiddleware,
  requireRole(["CLIENT", "ADMIN"]),
  (req, res) => {
    const controller =
      container.resolve<CartController>(
        "cartController"
      );

    controller.removeItem(req, res);
  }
);

router.post(
  "/checkout",
  authMiddleware,
  requireRole(["CLIENT", "ADMIN"]),
  (req, res) => {
    const controller =
      container.resolve<CartController>(
        "cartController"
      );

    controller.checkout(req, res);
  }
);

export default router;