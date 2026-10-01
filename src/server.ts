import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import ProductRoute from "./router/product.router";
import authRouter from "./router/auth.router";
import { openApiSpec } from "./docs/openapi";
import { connectDB } from "./config/db";

dotenv.config();

const app = express()
const port = process.env.PORT || 1000

app.use(express.json())
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec, {
  customSiteTitle: "KLab TechUp Skills API",
}))
app.get("/api-docs.json", (_req, res) => {
  res.json(openApiSpec)
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/api",ProductRoute)
app.use("/api/auth", authRouter)

connectDB();

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`)
})