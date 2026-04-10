import express from "express";

import v1Routes from "./routes/v1/index"

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("TechStore API funcionando");
});

// app.use("/v1", V1ProductRouter);
app.use("/v1", v1Routes)


export default app;