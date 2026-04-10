export interface IOrderRepository {

createOrderWithItems(
    customer_name: string,
    items: any[]
): Promise<any>;

getOrders(): Promise<any[]>;

getOrderWithItems(id: number): Promise<any | null>;

delete(id: number): Promise<any>;

}