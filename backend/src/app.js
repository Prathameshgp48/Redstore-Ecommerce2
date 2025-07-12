import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import adminRouter from "./routes/admin.routes.js"
import orderRouter from "./routes/orders.routes.js"
import productRouter from "./routes/products.routes.js"
import cartRouter from "./routes/cart.routes.js"

const app = express()

app.use(
    cors({
        origin:`http://localhost:${process.env.CORS_ORIGIN}`,
        credentials: true,
    })
);

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(cookieParser());

//route declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/orders", orderRouter)
app.use("/api/v1/products", productRouter)
app.use("/api/v1/cart", cartRouter)

export { app };