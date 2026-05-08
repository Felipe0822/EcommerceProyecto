import { AwilixContainer } from "awilix";
import "express";

declare global {
  namespace Express {
    interface Request {
      scope: AwilixContainer;
    }
  }
}

declare module "express-serve-static-core" {

  interface Request {
    user?: any;
  }

}

export {};