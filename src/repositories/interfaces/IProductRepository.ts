export interface IProductRepository {

  findAll(): Promise<any[]>;

  findById(id: number): Promise<any | null>;

  create(
    name: string,
    price: number,
    stock: number,
    category_id: number
  ): Promise<any>;

  update(
    id: number,
    name: string,
    price: number,
    stock: number,
    category_id: number
  ): Promise<any | null>;

  delete(id: number): Promise<any | null>;

}