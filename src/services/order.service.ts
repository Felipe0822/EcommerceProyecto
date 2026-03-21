import { IOrderRepository } from "../repositories/interfaces/IOrderRepository";
import { IOrderService } from "./interfaces/IOrderService";

export class OrderService implements IOrderService{

constructor(
    private readonly orderRepository: IOrderRepository
    ){ }

async createOrder(customer_name: string, items: any[]) {

if (!customer_name) {
    throw new Error("El nombre del cliente es obligatorio");
}

if (!items || items.length === 0) {
    throw new Error("El pedido no tiene productos");
}

  // ✅ SOLO UNA LLAMADA
return this.orderRepository.createOrderWithItems(
    customer_name,
    items
);
}
async getOrders() {
    return this.orderRepository.getOrders();
}   

async getOrder(id: number) {

const order = await this.orderRepository.getOrderWithItems(id);

if (!order) {
    throw new Error("Pedido no encontrado");
}

return order;
}

}