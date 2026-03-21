import { pool } from "../config/db";
import { IProductRepository } from "./interfaces/IProductRepository";

export class ProductRepository implements IProductRepository {

async findAll() {

    const result = await pool.query(`
    SELECT p.*, c.name as category
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    `);

    return result.rows;
}

async findById(id: number) {

    const result = await pool.query(
      "SELECT * FROM products WHERE id=$1",
    [id]
    );

    return result.rows[0];
}

async create(
    name: string,
    price: number,
    stock: number,
    category_id: number
) {

    const result = await pool.query(
    `INSERT INTO products(name, price, stock, category_id)
    VALUES($1,$2,$3,$4)
       RETURNING *`,
    [name, price, stock, category_id]
    );

    return result.rows[0];
}

async update(
    id: number,
    name: string,
    price: number,
    stock: number,
    category_id: number
) {

    const result = await pool.query(
    `UPDATE products
    SET name=$1, price=$2, stock=$3, category_id=$4
    WHERE id=$5
       RETURNING *`,
    [name, price, stock, category_id, id]
    );

    return result.rows[0];
}

async delete(id: number) {

    const result = await pool.query(
      "DELETE FROM products WHERE id=$1 RETURNING *",
    [id]
    );

    return result.rows[0];
}

}