import { Response } from "express";
import { AuthRequest } from "../interfaces/authRequest.interface";
import { ICartService } from "../services/interfaces/ICartService";

export class CartController {

  constructor(
    private readonly cartService: ICartService
  ) {}

  // 🔥 Crear carrito manualmente (opcional)
  createCart = async (
    req: AuthRequest,
    res: Response   
  ) => {

    try {

      const user_id = req.user.id;

      const cart =
        await this.cartService.createCart(user_id);

      res.status(201).json(cart);

    } catch (error: any) {

      res.status(400).json({
        error: error.message
      });

    }

  };

  // 🔥 Agregar producto al carrito
  addItem = async (
    req: AuthRequest,
    res: Response
  ) => {

    try {

      const user_id = req.user.id;

      const {
        product_id,
        quantity
      } = req.body;

      const item =
        await this.cartService.addItem(
          user_id,
          product_id,
          quantity
        );

      res.status(201).json(item);

    } catch (error: any) {

      res.status(400).json({
        error: error.message
      });

    }

  };

  // 🔥 Obtener carrito del usuario autenticado
  getCart = async (
    req: AuthRequest,
    res: Response
  ) => {

    try {

      const user_id = req.user.id;

      const cart =
        await this.cartService.getCart(user_id);

      res.json(cart);

    } catch (error: any) {

      res.status(400).json({
        error: error.message
      });

    }

  };

  // 🔥 Checkout
  checkout = async (
    req: AuthRequest,
    res: Response
  ) => {

    try {

      const user_id = req.user.id;

      const order =
        await this.cartService.checkout(user_id);

      res.status(201).json(order);

    } catch (error: any) {

      res.status(400).json({
        error: error.message
      });

    }

  };

  // 🔥 Eliminar item del carrito
  removeItem = async (
    req: AuthRequest,
    res: Response
  ) => {

    try {

      const id = parseInt(req.params.id as string);

      if (isNaN(id)) {

        return res.status(400).json({
          error: "ID inválido"
        });

      }

      const item =
        await this.cartService.removeItem(id);

      res.json({
        message: "Item eliminado del carrito",
        item
      });

    } catch (error: any) {

      res.status(404).json({
        error: error.message
      });

    }

  };

}