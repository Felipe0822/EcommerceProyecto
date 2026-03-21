import express from "express";
import categoryRoutes from "./routes/category.routes";
import orderRoutes from "./routes/order.routes";
import v1Routes from "./routes/v1/index"

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("TechStore API funcionando");
});

// app.use("/v1", V1ProductRouter);
app.use("/v1", v1Routes)
app.use("/categories", categoryRoutes);
app.use("/orders", orderRoutes);

export default app;