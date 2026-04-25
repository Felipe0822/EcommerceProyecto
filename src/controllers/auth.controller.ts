import { Request, Response } from "express";
import { IAuthService } from "../services/interfaces/IAuth.service";

export class AuthController {

  constructor(
    private readonly authService: IAuthService
  ) {}

  register = async (req: Request, res: Response) => {
    try {
      const { name, email, password, role_id } = req.body;

      const allowedFields = ["name", "email", "password", "role_id"];
      const receivedFields = Object.keys(req.body);
      const invalidFields = receivedFields.filter(
        field => !allowedFields.includes(field)
      );

      if (invalidFields.length > 0) {
        return res.status(400).json({
          error: `Campos inválidos: ${invalidFields.join(", ")}`
        });
      }

      // Validar campos requeridos
      if (!name || !email || !password || !role_id) {
        return res.status(400).json({
          error: "Los campos name, email, password y role_id son requeridos"
        });
      }

      const user = await this.authService.register(req.body);
      res.status(201).json(user);

    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Validar campos requeridos
      if (!email || !password) {
        return res.status(400).json({
          error: "Los campos email y password son requeridos"
        });
      }

      const result = await this.authService.login(email, password);
      res.status(200).json(result);

    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  };

  getUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.authService.getUsers();
      res.status(200).json(users);

    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const user = await this.authService.getUserById(id);
      res.status(200).json(user);

    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const allowedFields = ["name", "email", "password", "role_id"];
      const receivedFields = Object.keys(req.body);
      const invalidFields = receivedFields.filter(
        field => !allowedFields.includes(field)
      );

      if (invalidFields.length > 0) {
        return res.status(400).json({
          error: `Campos inválidos: ${invalidFields.join(", ")}`
        });
      }

      const user = await this.authService.updateUser(id, req.body);
      res.status(200).json(user);

    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

    deleteUser = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      await this.authService.deleteUser(id);
      res.status(200).json({ message: "Usuario eliminado correctamente" });

    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

}
