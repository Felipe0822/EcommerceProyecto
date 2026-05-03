import { Request, Response } from "express";
import { IOrderService } from "../services/interfaces/IOrderService";

export class OrderController {

constructor(
    private readonly orderService: IOrderService
    ){ }


  createOrder = async (req: Request, res: Response) => {
    try {

      const { customer_name, items } = req.body;


      const order = await this.orderService.createOrder(customer_name,items);
        
      res.status(201).json(order);

    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getOrders = async (req: Request, res: Response) => {
    try {

      const orders = await this.orderService.getOrders();

      res.json(orders);

    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getOrder = async (req: Request, res: Response) => {
    try {

      const id = parseInt(req.params.id as string);

      if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const order = await this.orderService.getOrder(id);

      res.json(order);

    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };


  deleteOrder = async (req: Request, res: Response) => {
    try {
    const id = Number.parseInt(req.params.id as string);
    if (Number.isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
}

    const order = await this.orderService.deleteOrder(id);
  
    res.status(204).json({
        message: "Orden eliminada",
        order
    });

    } catch (error: any) {
    res.status(404).json({ error: error.message });
    }
};
}