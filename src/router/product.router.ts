import { Router } from "express";
import { getProduct , getProductById ,addProduct ,updateProduct , deleteProduct} from "../controller/product.controller";
import { authenticate } from "../middleware/auth.middleware";

const  ProductRoute=Router();

ProductRoute.use(authenticate);

ProductRoute.get("/products",getProduct);
ProductRoute.get("/products/:id",getProductById)
ProductRoute.post("/products",addProduct)
ProductRoute.put("/products/:id",updateProduct);
ProductRoute.delete("/products/:id",deleteProduct)

export default ProductRoute;

