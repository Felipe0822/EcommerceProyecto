export interface ICartService {

  createCart(user_id: number): Promise<any>;

  addItem(
    cart_id: number,
    product_id: number,
    quantity: number
  ): Promise<any>;

  getCart(cart_id: number): Promise<any>;

removeItem(id: number): Promise<any>;


  checkout(cart_id: number): Promise<any>;

}