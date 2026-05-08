import { pool } from "../config/db";
import { ICartRepository } from "./interfaces/ICartRepository";

export class CartRepository implements ICartRepository {

    
  async createCart(user_id: number) {

    const result = await pool.query(
      `INSERT INTO carts (user_id)
       VALUES ($1)
       RETURNING *`,
      [user_id]
    );

    return result.rows[0];
  }

  async addItem(
  user_id: number,
  product_id: number,
  quantity: number
) {

  // 🔥 buscar carrito del usuario
  let cart = await this.getCartByUserId(user_id);

  // 🔥 si no existe, crearlo
  if (!cart) {

    cart = await this.createCart(user_id);

  }

  // 🔥 insertar item usando cart.id
  const result = await pool.query(
    `INSERT INTO cart_items
    (cart_id, product_id, quantity)
    VALUES ($1, $2, $3)
    RETURNING *`,
    [
      cart.id, // ✅ NO user_id
      product_id,
      quantity
    ]
  );

  return result.rows[0];
}

  async getCart(cart_id: number) {

    const cartResult = await pool.query(
      `SELECT * FROM carts WHERE id = $1`,
      [cart_id]
    );

    if (cartResult.rows.length === 0) {
      return null;
    }

    const itemsResult = await pool.query(
      `
      SELECT
  ci.id,
  ci.product_id,
  ci.quantity,
  p.name,
  p.price,
  (ci.quantity * p.price) as subtotal
      FROM cart_items ci
      JOIN products p
      ON p.id = ci.product_id
      WHERE ci.cart_id = $1
      `,
      [cart_id]
    );

    const total = itemsResult.rows.reduce(
      (acc, item) => acc + Number(item.subtotal),
      0
    );

    return {
      ...cartResult.rows[0],
      items: itemsResult.rows,
      total
    };
  }

  async removeItem(id: number) {

  const result = await pool.query(
    `DELETE FROM cart_items
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
}

async getCartByUserId(user_id: number) {

  const result = await pool.query(
    `SELECT * FROM carts
     WHERE user_id = $1`,
    [user_id]
  );

  return result.rows[0];
}

async checkout(user_id: number) {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    // 🔥 buscar carrito del usuario
    const cart = await this.getCartByUserId(user_id);

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    // 🔥 traer items del carrito
    const itemsResult = await client.query(
      `
      SELECT
        ci.product_id,
        ci.quantity,
        p.price
      FROM cart_items ci
      JOIN products p
      ON p.id = ci.product_id
      WHERE ci.cart_id = $1
      `,
      [cart.id]
    );

    const items = itemsResult.rows;

    if (items.length === 0) {
      throw new Error("El carrito está vacío");
    }

    // 🔥 calcular total
    let total = 0;

    for (const item of items) {
      total += item.price * item.quantity;
    }

    // 🔥 traer nombre real del usuario
    const userResult = await client.query(
      `SELECT name FROM users WHERE id = $1`,
      [user_id]
    );

    if (userResult.rows.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    const customer_name = userResult.rows[0].name;

    // 🔥 crear orden
    const orderResult = await client.query(
      `
      INSERT INTO orders
      (customer_name, total)
      VALUES ($1, $2)
      RETURNING *
      `,
      [customer_name, total]
    );

    const order = orderResult.rows[0];

    // 🔥 insertar order_items
    for (const item of items) {

      await client.query(
        `
        INSERT INTO order_items
        (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
        `,
        [
          order.id,
          item.product_id,
          item.quantity,
          item.price
        ]
      );

    }

    // 🔥 limpiar carrito
    await client.query(
      `DELETE FROM cart_items WHERE cart_id = $1`,
      [cart.id]
    );

    await client.query("COMMIT");

    return order;

  } catch (error) {

    await client.query("ROLLBACK");
    throw error;

  } finally {

    client.release();

  }

}

}