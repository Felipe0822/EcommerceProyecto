import { Router } from "express";
import productsRoutes from "./product.routes";
import categoryRoutes from "./category.routes";
import orderRoutes from "./order.routes";
import authRoutes from "./auth.routes";
import cartRoutes from "./cart.routes";

const router = Router();

router.use("/products", productsRoutes);
router.use("/categories", categoryRoutes);
router.use("/auth", authRoutes);
router.use("/orders",orderRoutes);
router.use("/cart", cartRoutes);

export default router;
