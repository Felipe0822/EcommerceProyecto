import { ICartRepository } from "../repositories/interfaces/ICartRepository";

export class CartService {

  constructor(
    private readonly cartRepository: ICartRepository
  ) {}

  async createCart(user_id: number) {
    return this.cartRepository.createCart(user_id);
  }

  async addItem(
    user_id: number,
    product_id: number,
    quantity: number
  ) {

    return this.cartRepository.addItem(
      user_id,
      product_id,
      quantity
    );

  }

  async getCart(user_id: number) {

    const cart =
      await this.cartRepository.getCartByUserId(user_id);

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    return this.cartRepository.getCart(cart.id);

  }

  async removeItem(id: number) {

    const item =
      await this.cartRepository.removeItem(id);

    if (!item) {
      throw new Error("Item no encontrado");
    }

    return item;

  }

  // 🔥 IMPORTANTE
  async checkout(user_id: number) {

    return this.cartRepository.checkout(user_id);

  }

}