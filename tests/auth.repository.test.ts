import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthRepository } from "../src/repositories/auth.repository";

vi.mock("../src/config/db", () => ({
  pool: {
    query: vi.fn(),
  }
}));

import { pool } from "../src/config/db";

describe("AuthRepository", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 🔹 findUserByEmail
  describe("findUserByEmail", () => {

    it("debería retornar un usuario si existe", async () => {
      const mockUser = { id: 1, email: "test@test.com", role: "ADMIN" };

      vi.mocked(pool.query).mockResolvedValue({ rows: [mockUser] } as any);

      const repo = new AuthRepository();
      const result = await repo.findUserByEmail("test@test.com");

      expect(result).toEqual(mockUser);
    });

    it("debería retornar null si no existe", async () => {
      vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any);

      const repo = new AuthRepository();
      const result = await repo.findUserByEmail("no@test.com");

      expect(result).toBeNull();
    });

  });

  // 🔹 findUserById
  describe("findUserById", () => {

    it("debería retornar usuario por id", async () => {
      const mockUser = { id: 1, role: "CLIENT" };

      vi.mocked(pool.query).mockResolvedValue({ rows: [mockUser] } as any);

      const repo = new AuthRepository();
      const result = await repo.findUserById(1);

      expect(result).toEqual(mockUser);
    });

    it("debería retornar null si no existe", async () => {
      vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any);

      const repo = new AuthRepository();
      const result = await repo.findUserById(999);

      expect(result).toBeNull();
    });

  });

  // 🔹 findAllUsers
  describe("findAllUsers", () => {

    it("debería retornar todos los usuarios", async () => {
      const mockUsers = [
        { id: 1, role: "ADMIN" },
        { id: 2, role: "CLIENT" }
      ];

      vi.mocked(pool.query).mockResolvedValue({ rows: mockUsers } as any);

      const repo = new AuthRepository();
      const result = await repo.findAllUsers();

      expect(result).toEqual(mockUsers);
    });

    it("debería retornar array vacío si no hay usuarios", async () => {
      vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any);

      const repo = new AuthRepository();
      const result = await repo.findAllUsers();

      expect(result).toEqual([]);
    });

  });

  // 🔹 createUser
  describe("createUser", () => {

    it("debería crear un usuario correctamente", async () => {
      const newUser = {
        name: "Juan",
        email: "juan@test.com",
        password: "123456",
        role_id: 1
      };

      const mockResponse = {
        id: 1,
        name: "Juan",
        email: "juan@test.com",
        role_id: 1
      };

      vi.mocked(pool.query).mockResolvedValue({ rows: [mockResponse] } as any);

      const repo = new AuthRepository();
      const result = await repo.createUser(newUser);

      expect(result).toEqual(mockResponse);
    });

  });

  // 🔹 updateUser
  describe("updateUser", () => {

    it("debería actualizar un usuario", async () => {
      const updatedUser = {
        name: "Juan Updated",
        email: "juan@test.com",
        password: "123",
        role_id: 2
      };

      const mockResponse = { id: 1, ...updatedUser };

      vi.mocked(pool.query).mockResolvedValue({ rows: [mockResponse] } as any);

      const repo = new AuthRepository();
      const result = await repo.updateUser(1, updatedUser);

      expect(result).toEqual(mockResponse);
    });

    it("debería retornar undefined si no existe", async () => {
      vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any);

      const repo = new AuthRepository();
      const result = await repo.updateUser(999, {} as any);

      expect(result).toBeUndefined();
    });

  });

  // 🔹 deleteUser
  describe("deleteUser", () => {

    it("debería eliminar un usuario", async () => {
      const mockUser = {
        id: 1,
        name: "Juan",
        email: "juan@test.com",
        role_id: 1
      };

      vi.mocked(pool.query).mockResolvedValue({ rows: [mockUser] } as any);

      const repo = new AuthRepository();
      const result = await repo.deleteUser(1);

      expect(result).toEqual(mockUser);
    });

    it("debería retornar undefined si no existe", async () => {
      vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any);

      const repo = new AuthRepository();
      const result = await repo.deleteUser(999);

      expect(result).toBeUndefined();
    });

  });

});