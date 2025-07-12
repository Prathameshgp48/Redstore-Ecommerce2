import { pool } from "../db/db.js";

const getAllProducts = async (req, res) => {
    try {
        // console.log(req.cookies.accessToken)
        const products = await pool.query("SELECT * FROM products;");
        if (products.rows.length === 0) {
            return res.status(400).json({ message: "Data not found!" });
        }
        // console.log(products);
        console.log(res.cookie)

        if (req.query.category) {
            const filterProduct = products.rows.filter(
                (product) => product.category === req.query.category
            );

            return res.status(200).json({ products: filterProduct });
        }

        if (req.params.id) {
            console.log(req.params.id);
            const product = product.rows.find(
                (product) => product.product_id === parseInt(req.params.id)
            );
            if (!product) {
                return res.status(404).json({ message: "Product not found!" });
            }
            return res.status(200).json(product);
        }

        return res.status(200).json({ products: products.rows });
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ message: "Internal server error!!" });
    }
};


const getProductById = async (req, res) => {
    const productId = req.params.id;

    try {
        const query = 'SELECT * FROM products WHERE product_id = $1';
        const values = [productId];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ product: result.rows[0] });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getCategoryProducts = async (req, res) => {
    try {
        const { category, product_name } = req.query;
        let query = "SELECT * FROM products WHERE 1=1";
        const queryObject = [];

        if (category) {
            query += " AND category ~ $1";
            queryObject.push(category);
        }

        if (product_name) {
            query += ` AND product_name ~ $${queryObject.length + 1}`;
            queryObject.push(product_name);
        }

        if (!category || !product_name) {
            return getAllProducts(req, res);
        }

        console.log("lin 83:", queryObject, query);

        const { rows: products } = await pool.query(query, queryObject);

        if (products.length == 0) {
            return res.status(400).json({ message: "Data not found!" });
        }

        return res.status(200).json({ products });
    } catch (error) { }
};

const getProductByPrice = async (req, res) => {
    try {
        const { min_price, max_price } = req.query;

        if (!max_price) {
            return getAllProducts(req, res);
        }

        const { rows: products } = await pool.query(
            "SELECT * FROM products WHERE price <= $1;",
            [max_price]
        );

        if (products.length == 0) {
            return res.status(400).json({ message: "Not found!" });
        }

        return res.status(200).json({ products });
    } catch (error) {
        console.log("Error at getProductByPrice:", error);
        return res.status(500).json({ message: "Internal Server Error!" });
    }
};

export {
    getAllProducts,
    getProductById,
    getCategoryProducts,
    getProductByPrice
}