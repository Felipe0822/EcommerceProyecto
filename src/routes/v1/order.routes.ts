import { Router } from "express";
import { OrderController } from "../../controllers/order.controller";
import { container } from "../../config/container";

const router = Router();

router.post("/", (req, res) => {
    const controller = container.resolve<OrderController>("orderController");
    controller.createOrder(req, res);
});

router.get("/", (req, res) => {
    const controller = container.resolve<OrderController>("orderController");
    controller.getOrders(req, res);
});

router.get("/:id", (req, res) => {
    const controller = container.resolve<OrderController>("orderController");
    controller.getOrder(req, res);
});

router.delete("/:id", (req, res) => {
    const controller = container.resolve<OrderController>("orderController");
    controller.deleteOrder(req, res);
});

export default router;