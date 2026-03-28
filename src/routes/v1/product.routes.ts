import { Router } from "express";
import { ProductController } from "../../controllers/product.controller";
import { container } from "../../config/container";

const router = Router();
const controller = container.resolve<ProductController>("productController");

router.get("/", (req, res) => {
  controller.getProducts(req, res);
});

router.get("/:id",(req, res)=>{
  controller.getProduct
})

router.post("/",(req, res)=>{
  controller.createProduct
})

router.get("/:id",(req, res)=>{
  controller.getProduct
})

router.put("/:id",(req, res)=>{
  controller.updateProduct
})

router.delete("/:id",(req, res)=>{
  controller.deleteProduct
})

router.get("/:full",(req, res)=>{
  controller.getProductFull
})

export default router;

