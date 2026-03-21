export interface IOrderService {

createOrder(
    customer_name: string,
    items: IOrderService[]
): Promise<IOrderService>;

getOrders(): Promise<IOrderService[]>;

getOrder(id: number): Promise<IOrderService>;

}