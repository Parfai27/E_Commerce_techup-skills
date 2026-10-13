import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
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

app.use("/api/auth", authRouter)
app.use("/api",ProductRoute)

const storefrontPath = path.resolve(__dirname, "../../react-app/dist");
const storefrontIndex = path.join(storefrontPath, "index.html");

if (fs.existsSync(storefrontIndex)) {
  app.use(express.static(storefrontPath));
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      next();
      return;
    }
    if (req.path.startsWith("/api")) {
      next();
      return;
    }
    res.sendFile(storefrontIndex);
  });
} else {
  app.get("/", (_req, res) => {
    res.send("Hello World!");
  });
}

connectDB();

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`)
})