export interface IProductService {

getProducts(): Promise<IProductService[]>;

getProduct(id: number): Promise<IProductService>;

getProductWithExternalData(id: number): Promise<IProductService>;

createProduct(
    name: string,
    price: number,
    stock: number,
    category_id: number
): Promise<IProductService>;

updateProduct(
    id: number,
    name: string,
    price: number,
    stock: number,
    category_id: number
): Promise<IProductService>;

deleteProduct(id: number): Promise<IProductService>;

}