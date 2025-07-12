import { Router } from "express";
import { addToCart, removeFromCart, viewCart } from "../controllers/cart.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/addtocart").post(verifyJWT, addToCart)
router.route("/cart").get(verifyJWT, viewCart)
router.route("/removefromcart").post(verifyJWT, removeFromCart)

export default router