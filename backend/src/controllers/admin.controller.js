import { pool } from "../db/db.js";
import { uploadOnCloudinary } from "../utils/fileuploader.js";

const addProduct = async (req, res) => {
    const { name, price, stock, category, description } = req.body

    console.log('Request Body:', req.body);
    console.log('Request Files:', req.files);

    if (!name || !price || !stock || !description || !category || !req.files) {
        return res.status(400).json({ message: "Please fill all the fields" })
    }

    const product_img = req.files?.product_img[0]?.path;
    if (!product_img) {
        return res.status(400).json({ message: "Product image not found" })
    }

    const img_url = await uploadOnCloudinary(product_img);
    console.log(img_url.url)
    if (!img_url) {
        return res.status(500).json({ message: "Something went wrong while file upload" })
    }

    try {
        const product = await pool.query("INSERT INTO products (product_name, category, price, description, instock, productimgurl) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;", [
            name, category, price, description, stock, img_url.url
        ])

        if (product.rows.length === 0) {
            return res.status(500).json({ message: "Server Error while product upload" })
        }

        return res.status(200).json({ message: "Product added successfully" })
    } catch (error) {
        console.log("ERR:", error)
        return res.status(500).json({ message: "Server Error" })
    }

    // console.log(name, price, stock, description, img_url.url)
}

export {
    addProduct
}