import { Router } from "express";
import { getProduct , getProductById ,addProduct ,updateProduct , deleteProduct} from "../controller/product.controller";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/uploadMiddleware";

const  ProductRoute=Router();

ProductRoute.use(authenticate);

ProductRoute.get("/products",getProduct);
ProductRoute.get("/products/:id",getProductById)
ProductRoute.post("/products", upload.single("image"), addProduct)
ProductRoute.put("/products/:id", upload.single("image"), updateProduct);
ProductRoute.delete("/products/:id",deleteProduct)

export default ProductRoute;

