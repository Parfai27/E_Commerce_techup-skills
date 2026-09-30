import { Router } from "express";
import { getProduct , getProductById ,addProduct ,updateProduct , deleteProduct} from "../controller/product.controller";

const  ProductRoute=Router();

ProductRoute.get("/products",getProduct);
ProductRoute.get("/products/:id",getProductById)
ProductRoute.post("/products",addProduct)
ProductRoute.put("/products/:id",updateProduct);
ProductRoute.delete("/products/:id",deleteProduct)

export default ProductRoute;

