import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { container } from "../config/container";

const router = Router();
const controller = container.resolve<OrderController>("orderController");

router.post("/", controller.createOrder);

router.get("/", controller.getOrders);

router.get("/:id", controller.getOrder);


export default router;