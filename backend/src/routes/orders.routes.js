import { Router } from "express"
import { checkout, updateAddress, userAddress, userOrders, verifyOrder } from "../controllers/order.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

router.route("/checkout").post(verifyJWT, checkout)
router.route("/verifyorder").post(verifyJWT, verifyOrder)
router.route("/useraddress").get(verifyJWT, userAddress)
router.route("/updateaddress").post(verifyJWT, updateAddress)
router.route("/myorders").post(verifyJWT, userOrders)

export default router