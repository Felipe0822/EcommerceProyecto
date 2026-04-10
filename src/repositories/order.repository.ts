import { pool } from "../config/db";
import { IOrderRepository } from "./interfaces/IOrderRepository";

export class OrderRepository implements IOrderRepository {

async createOrderWithItems(customer_name: string, items: any[]) {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    let total = 0;

    const orderResult = await client.query(
      `INSERT INTO orders (customer_name, total)
      VALUES ($1, $2)
       RETURNING *`,
      [customer_name, 0]
    );

    const order = orderResult.rows[0];

    for (const item of items) {

      // 🔥 1. TRAER PRODUCTO DESDE BD
      const productResult = await client.query(
        `SELECT price FROM products WHERE id = $1`,
        [item.product_id]
      );

      if (productResult.rows.length === 0) {
        throw new Error(`Producto ${item.product_id} no existe`);
      }

      const productPrice = productResult.rows[0].price;

      const subtotal = productPrice * item.quantity;
      total += subtotal;

      // 🔥 2. INSERTAR con precio REAL
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)`,
        [
          order.id,
          item.product_id,
          item.quantity,
          productPrice
        ]
      );
    }

    // 🔥 3. ACTUALIZAR TOTAL
    await client.query(
      `UPDATE orders SET total = $1 WHERE id = $2`,
      [total, order.id]
    );

   // 🔥 4. traer orden actualizada
const updatedOrderResult = await client.query(
  `SELECT * FROM orders WHERE id = $1`,
  [order.id]
);

await client.query("COMMIT");

return updatedOrderResult.rows[0];

  } catch (error) {

    await client.query("ROLLBACK");
    throw error;

  } finally {

    client.release();

}
}

async getOrders() {

    const result = await pool.query(
    `SELECT * FROM orders ORDER BY created_at DESC`
);

    return result.rows;
}
async getOrderWithItems(id: number) {

const orderResult = await pool.query(
    `SELECT * FROM orders WHERE id=$1`,
    [id]
);

if (orderResult.rows.length === 0) return null;

const itemsResult = await pool.query(
    `SELECT oi.*, p.name
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = $1`,
    [id]
);

return {
    ...orderResult.rows[0],
    items: itemsResult.rows
};
}

async delete(id: number) {

    const result = await pool.query(
      "DELETE FROM orders WHERE id=$1 RETURNING *",
    [id]
    );

    return result.rows[0];
}

}