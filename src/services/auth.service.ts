import { IAuthService } from "./interfaces/IAuth.service";
import { IAuthRepository } from "../repositories/interfaces/IAuth.repository";
import { AuthRepository } from "../repositories/auth.repository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = "supersecret";

export class AuthService implements IAuthService {

  constructor(
      private readonly authRepository : IAuthRepository
      ){ }

  async register(data: any): Promise<any> {

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await this.authRepository.createUser({
      ...data,
      password: hashedPassword
    });
  }

  async login(email: string, password: string): Promise<any> {

    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new Error("Contraseña incorrecta");
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      SECRET,
      { expiresIn: "1h" }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

 async getUsers() {
    return this.authRepository.findAllUsers();
}

async getUserById(id: number) {

    const users = await this.authRepository.findUserById(id);

    if (!users) {
        throw new Error("Usuario no encontrado");
    }

    return users;
}

async updateUser(id: number, data: any) {

    const user = await this.authRepository.updateUser(id, data);

    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    return user;
}

async deleteUser(id: number) {

  const user = await this.authRepository.findUserById(id);

    if (!user) {
        throw new Error("Usuario no encontrado");
    }
    return user;
}
  
}