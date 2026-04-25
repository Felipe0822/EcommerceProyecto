import { pool } from "../config/db";
import { IAuthRepository } from "./interfaces/IAuth.repository";
export class AuthRepository implements IAuthRepository {

  async findUserByEmail(email: string): Promise<any | null> {
    const result = await pool.query(
      `SELECT u.*, r.name as role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = $1`,
      [email]
    );

    return result.rows[0] || null;
  }

  async findUserById(id: number): Promise<any | null> {
    const result = await pool.query(
      `SELECT u.*, r.name as role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

async findAllUsers(): Promise<any[]> {
    const result = await pool.query(
      `SELECT u.*, r.name as role
       FROM users u
       JOIN roles r ON u.role_id = r.id`
    );

    return result.rows;
  }

  async createUser(user: any): Promise<any> {
    const { name, email, password, role_id } = user;

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role_id`,
      [name, email, password, role_id]
    );

    return result.rows[0];
  }

  async updateUser(id: number, user: any): Promise<any> {
    const { name, email, password, role_id } = user;

    const result = await pool.query(
      `UPDATE users
       SET name = $1, email = $2, password = $3, role_id = $4
       WHERE id = $5
       RETURNING id, name, email, role_id`,
      [name, email, password, role_id, id]
    );

    return result.rows[0];
  }

  async deleteUser(id: number): Promise<any> {
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING id, name, email, role_id`,
      [id]
    );

    return result.rows[0];
  }

}