import { Router } from "express";
import { getAllProducts, getCategoryProducts, getProductById, getProductByPrice } from "../controllers/products.controller.js"

const router = Router();

router.route("/category").get(getCategoryProducts)
router.route("/products").get(getAllProducts)
router.route("/products/:id").get(getProductById)
router.route("/price").get(getProductByPrice)

export default router;