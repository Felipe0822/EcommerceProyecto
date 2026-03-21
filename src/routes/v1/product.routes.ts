import { Router } from "express";
import { ProductController } from "../../controllers/product.controller";
import { container } from "../../config/container";

const router = Router();
// const controller = container.resolve<ProductController>("productController");

router.get("/", (req, res) => {
  const controller = container.resolve<ProductController>("productController");
  controller.getProducts(req, res);
});

export default router;

/*
router.get("/", (req, res) => {
  const controller = container.resolve<ProductController>("productController");
  controller.getProducts(req, res);
});

router.get("/:id",(req, res)=>{
  const controller=container.resolve<ProductController>("productController");
  controller.getProduct
})
  */
/*
router.get("/", controller.getProducts);

router.get("/:id", controller.getProduct);

router.post("/", controller.createProduct);

router.put("/:id", controller.updateProduct);

router.delete("/:id", controller.deleteProduct);

router.get("/:id/full", controller.getProductFull);

export default router;*/