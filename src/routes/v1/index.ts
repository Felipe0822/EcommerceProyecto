import { Router } from "express";
import productsRoutes from "./product.routes";

const router = Router();

router.use("/products", productsRoutes);

export default router;
