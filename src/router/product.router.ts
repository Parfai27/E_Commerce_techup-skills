import { Router } from "express";
import { getProductById ,addProduct ,updateProduct , deleteProduct} from "../controller/product.controller";
import { browseProducts, getProductStats, listProducts, searchProducts } from "../controller/product.query.controller";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/uploadMiddleware";

const  ProductRoute=Router();

ProductRoute.use(authenticate);

ProductRoute.get("/products/search", searchProducts);
ProductRoute.get("/products/stats", getProductStats);
ProductRoute.get("/products/browse", browseProducts);
ProductRoute.get("/products", listProducts);
ProductRoute.get("/products/:id",getProductById)
ProductRoute.post("/products", upload.single("image"), addProduct)
ProductRoute.put("/products/:id", upload.single("image"), updateProduct);
ProductRoute.delete("/products/:id",deleteProduct)

export default ProductRoute;

