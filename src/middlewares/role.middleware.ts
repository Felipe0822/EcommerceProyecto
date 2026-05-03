import { Request, Response, NextFunction } from "express";

export const requireRole = (roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {

    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "No autorizado" });
    }

    next();
  };
};