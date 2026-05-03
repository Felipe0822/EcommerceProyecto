import {
  createContainer,
  asClass,
  InjectionMode
} from "awilix";
import { ProductController } from "../controllers/product.controller";
import { ProductService } from "../services/product.service";
import { ProductRepository } from "../repositories/product.repository";
import { OrderRepository } from "../repositories/order.repository";
import { CategoryRepository } from "../repositories/category.repository";
import { CategoryService } from "../services/category.service";
import { OrderService } from "../services/order.service";
import { CategoryController } from "../controllers/category.controller";
import { OrderController } from "../controllers/order.controller";
import { FakeStoreService } from "../external/fakeStore.service";
import { AuthRepository } from "../repositories/auth.repository";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";

export const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
});

container.register({
// Repository
categoryRepository: asClass(CategoryRepository).scoped(),
productRepository: asClass(ProductRepository).scoped(),
orderRepository: asClass(OrderRepository).scoped(),
authRepository: asClass(AuthRepository).scoped(),
// Servic
categoryService: asClass(CategoryService).scoped(),
productService: asClass(ProductService).scoped(),
orderService: asClass(OrderService).scoped(),
authService: asClass(AuthService).scoped(),
// External
fakeStore: asClass(FakeStoreService).scoped(),

// // Controller
categoryController: asClass(CategoryController).scoped(),
productController: asClass(ProductController).scoped(),
orderController: asClass(OrderController).scoped(),
authController: asClass(AuthController).scoped(),

});