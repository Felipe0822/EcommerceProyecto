import { Router } from "express";
import { OrderController } from "../../controllers/order.controller";
import { container } from "../../config/container";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

const router = Router();

// 🔥 CREAR ORDEN (SOLO CLIENT)
router.post(
  "/",
  authMiddleware,
  requireRole(["CLIENT", "ADMIN"]),
  (req, res) => {
    const controller = container.resolve<OrderController>("orderController");
    controller.createOrder(req, res);
  }
);

// 🔥 VER ÓRDENES (ADMIN)
router.get(
  "/",
  authMiddleware,
  requireRole(["ADMIN", "CLIENT"]),
  (req, res) => {
    const controller = container.resolve<OrderController>("orderController");
    controller.getOrders(req, res);
  }
);

// 🔥 VER UNA ORDEN (CLIENT o ADMIN)
router.get(
  "/:id",
  authMiddleware,
  requireRole(["CLIENT", "ADMIN"]),
  (req, res) => {
    const controller = container.resolve<OrderController>("orderController");
    controller.getOrder(req, res);
  }
);

// 🔥 ELIMINAR ORDEN (ADMIN)
router.delete(
  "/:id",
  authMiddleware,
  requireRole(["ADMIN"]),
  (req, res) => {
    const controller = container.resolve<OrderController>("orderController");
    controller.deleteOrder(req, res);
  }
);

export default router;