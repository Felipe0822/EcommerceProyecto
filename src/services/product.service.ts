import { IProductRepository } from "../repositories/interfaces/IProductRepository";
import { FakeStoreService } from "../external/fakeStore.service";
import { IProductService } from "./interfaces/IProductService";

export class ProductService implements IProductService {

constructor(
  private productRepository: IProductRepository,
  private fakeStore: FakeStoreService
) {}

async getProductWithExternalData(id: number) {

  const product = await this.productRepository.findById(id);

  if (!product) {
    throw new Error("Producto no encontrado");
  }

  let externalData = null;

  try {
    externalData = await this.fakeStore.getProduct(id);
  } catch (error) {
    // 🔥 importante: no romper tu API si falla la externa
    console.log("Error API externa:", error);
  }

  return {
    ...product,
    externalData
  };
}

async getProducts() {
    return this.productRepository.findAll();
}

async getProduct(id: number) {

    const product = await this.productRepository.findById(id);

    if (!product) {
    throw new Error("Producto no encontrado");
    }

    return product;
}

async createProduct(
    name: string,
    price: number,
    stock: number,
    category_id: number
) {

    if (!name || !price) {
    throw new Error("Datos inválidos");
    }

    return this.productRepository.create(name, price, stock, category_id);
}

async updateProduct(
    id: number,
    name: string,
    price: number,
    stock: number,
    category_id: number
) {

    const product = await this.productRepository.update(
    id,
    name,
    price,
    stock,
    category_id
    );

    if (!product) {
    throw new Error("Producto no encontrado");
    }

    return product;
}

async deleteProduct(id: number) {

    const product = await this.productRepository.delete(id);

    if (!product) {
    throw new Error("Producto no encontrado");
    }

    return product;
}

}