import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js"
import { addProduct } from "../controllers/admin.controller.js"

const router = Router()

router.route("/addproduct").post(
    upload.fields([
        { name: "product_img", maxCount: 1 },
    ]),
    addProduct
)

export default router