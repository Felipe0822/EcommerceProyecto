import app from "./app";
import { pool } from "./config/db";

const PORT = 3000;

async function startServer() {
  try {

    const result = await pool.query("SELECT NOW()");
    console.log("Conectado a PostgreSQL");
    console.log("Hora del servidor DB:", result.rows[0]);

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });

  } catch (error) {
    console.error("Error conectando a la base de datos", error);
  }
}

startServer();