import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import { AuthService } from "../src/services/auth.service";
import { AuthRepository } from "../src/repositories/auth.repository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 🔥 mocks de librerías externas
vi.mock("bcryptjs");
vi.mock("jsonwebtoken");

describe("AuthService", () => {

  let authRepository: Mocked<AuthRepository>;
  let authService: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();

    // 🔥 SOLUCIÓN AL ERROR
    process.env.JWT_SECRET = "test-secret";

    authRepository = {
      createUser: vi.fn(),
      findUserByEmail: vi.fn(),
      findAllUsers: vi.fn(),
      findUserById: vi.fn(),
      updateUser: vi.fn(),
      deleteUser: vi.fn()
    } as unknown as Mocked<AuthRepository>;

    authService = new AuthService(authRepository);
  });

  // 🔹 REGISTER
  describe("register", () => {

    it("debería registrar usuario con contraseña encriptada", async () => {
      const userData = {
        name: "Juan",
        email: "juan@test.com",
        password: "123456",
        role_id: 1
      };

      vi.mocked(bcrypt.hash).mockResolvedValue("hashedPassword" as never);

      vi.mocked(authRepository.createUser).mockResolvedValue({
        id: 1,
        ...userData,
        password: "hashedPassword"
      });

      const result = await authService.register(userData);

      expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);

      expect(authRepository.createUser).toHaveBeenCalledWith({
        ...userData,
        password: "hashedPassword"
      });

      expect(result).toHaveProperty("id");
    });

  });

  // 🔹 LOGIN
  describe("login", () => {

    it("debería hacer login correctamente", async () => {
      const mockUser = {
        id: 1,
        name: "Juan",
        email: "juan@test.com",
        password: "hashedPassword",
        role: "ADMIN"
      };

      authRepository.findUserByEmail.mockResolvedValue(mockUser);

      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(jwt.sign).mockReturnValue("fakeToken" as never);

      const result = await authService.login("juan@test.com", "123456");

      expect(result.token).toBe("fakeToken");
      expect(result.user.email).toBe("juan@test.com");
    });

    it("debería lanzar error si usuario no existe", async () => {
      authRepository.findUserByEmail.mockResolvedValue(null);

      await expect(
        authService.login("no@test.com", "123")
      ).rejects.toThrow("Usuario no encontrado");
    });

    it("debería lanzar error si contraseña es incorrecta", async () => {
      const mockUser = {
        id: 1,
        password: "hashedPassword"
      };

      authRepository.findUserByEmail.mockResolvedValue(mockUser);

      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        authService.login("test@test.com", "wrong")
      ).rejects.toThrow("Contraseña incorrecta");
    });

  });

  // 🔹 getUsers
  describe("getUsers", () => {

    it("debería retornar todos los usuarios", async () => {
      const users = [{ id: 1 }, { id: 2 }];

      authRepository.findAllUsers.mockResolvedValue(users);

      const result = await authService.getUsers();

      expect(result).toEqual(users);
    });

  });

  // 🔹 getUserById
  describe("getUserById", () => {

    it("debería retornar usuario si existe", async () => {
      const user = { id: 1 };

      authRepository.findUserById.mockResolvedValue(user);

      const result = await authService.getUserById(1);

      expect(result).toEqual(user);
    });

    it("debería lanzar error si no existe", async () => {
      authRepository.findUserById.mockResolvedValue(null);

      await expect(
        authService.getUserById(999)
      ).rejects.toThrow("Usuario no encontrado");
    });

  });

  // 🔹 updateUser
  describe("updateUser", () => {

    it("debería actualizar usuario", async () => {
      const updated = { id: 1, name: "Nuevo" };

      authRepository.updateUser.mockResolvedValue(updated);

      const result = await authService.updateUser(1, {});

      expect(result).toEqual(updated);
    });

    it("debería lanzar error si no existe", async () => {
      authRepository.updateUser.mockResolvedValue(null);

      await expect(
        authService.updateUser(999, {})
      ).rejects.toThrow("Usuario no encontrado");
    });

  });

  // 🔹 deleteUser
  describe("deleteUser", () => {

    it("debería eliminar el usuario", async () => {
       const user = { id: 1 };

      authRepository.findUserById.mockResolvedValue(user);

      const result = await authService.deleteUser(1);

      expect(result);
    });

    it("debería lanzar error si no existe", async () => {
      authRepository.findUserById.mockResolvedValue(null);

      await expect(
        authService.deleteUser(999)
      ).rejects.toThrow("Usuario no encontrado");
    });

  });

});