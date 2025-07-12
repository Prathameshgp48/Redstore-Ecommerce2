import { response } from "express";
import { pool } from "../db/db.js"
import Stripe from "stripe"
import { createStripeSession } from "../utils/createStripeSession.js";

const userAddress = async (req, res) => {
    try {
        const { id: userId } = req.user;

        const existingAddress = await pool.query(
            'SELECT * FROM shippingAddress WHERE user_id = $1;', [userId]
        );

        if (existingAddress.rows.length === 0) {
            return res.status(500).json({ message: "Address not found" });
        } else {
            return res.status(200).json(existingAddress.rows[0])
        }

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const updateAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(userId)
        const userAddress = await pool.query('SELECT * FROM shippingAddress WHERE user_id = $1;', [userId])

        const { address_line1, address_line2, city, state, pincode } = req.body;
        console.log(address_line1, address_line2, city, state, pincode)
        if (!address_line1 || !city || !state || !pincode) {
            return res.status(400).json({ message: "Please fill in all the fields" })
        }

        if (userAddress.rows.length === 0) {
            const newAddress = await pool.query(
                "INSERT INTO shippingAddress (user_id, address_line1, address_line2, city, state, pin_code) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
                [userId, address_line1, address_line2 || null, city, state, pincode]
            );
            return res.status(202).json({ message: "Proceed to checkout", address: newAddress.rows[0] })
        } else {
            const updatedAddress = await pool.query(
                "UPDATE shippingAddress SET address_line1 = $1, address_line2 = $2, city = $3, state = $4, pin_code = $5 WHERE user_id = $6 RETURNING *;",
                [address_line1, address_line2 || null, city, state, pincode, userId]
            );

            if (updatedAddress.rows.length === 0) {
                return res.status(500).json({ message: "Failed to update address" })
            }

            return res.status(202).json({ message: "Proceed to checkout", address: updatedAddress.rows[0] })
        }
    } catch (error) {
        console.log("Error", error)
        return res.status(500).json({ message: "Server error" })
    }
}


const checkout = async (req, res) => {
    try {
        const { id: userId } = req.user;
        console.log(userId)

        await pool.query('BEGIN');

        const cartResult = await pool.query(
            'SELECT * FROM Carts WHERE user_id = $1 AND status=\'ACTIVE\';',
            [userId]
        );
        console.log(cartResult.rows)
        if (cartResult.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ message: "Cart not found for user" });
        }

        const cartId = cartResult.rows[0].id;
        const cartItems = await pool.query('SELECT * FROM CartItems WHERE cart_id = $1;', [cartId]);

        const shippingAddress = await pool.query('SELECT id FROM shippingAddress WHERE user_id = $1;', [userId]);
        const shippingAddressId = shippingAddress.rows[0]?.id;

        if (!shippingAddressId) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ message: "Shipping address not found" });
        }

        let totalPrice = 0;
        for (const item of cartItems.rows) {
            const productResult = await pool.query('SELECT price FROM Products WHERE product_id = $1;', [item.product_id]);
            const productPrice = productResult.rows[0]?.price;

            if (productPrice === undefined) {
                await pool.query('ROLLBACK');
                return res.status(400).json({ message: "Product price not found" });
            }
            totalPrice += productPrice * item.quantity;
        }

        const orderResult = await pool.query(
            'INSERT INTO Orders (user_id, cart_id, total, status, shipping_address_id) VALUES ($1, $2, $3, $4, $5) RETURNING id;',
            [userId, cartId, totalPrice, 'PENDING', shippingAddressId]
        );

        const orderId = orderResult.rows[0].id;

        for (const item of cartItems.rows) {
            await pool.query('INSERT INTO OrderItems (order_id, product_id, quantity) VALUES ($1, $2, $3);', [orderId, item.product_id, item.quantity]);
        }

        await pool.query('DELETE FROM CartItems WHERE cart_id = $1;', [cartId]);
        await pool.query('UPDATE Carts SET status = \'CHECKED_OUT\' WHERE id=$1;', [cartId])

        await pool.query('COMMIT');

        const sessionUrl = await createStripeSession(cartItems.rows, orderId);

        res.status(202).json({ message: 'Order Placed Successfully!', success: true, session_url: sessionUrl });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("Database error:", error);
        res.status(500).json({ error: 'Failed to place order', details: error.message });
    }
};

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body
    console.log(req.body)
    try {
        if (success === 'true') {
            await pool.query(
                "UPDATE Orders SET status = 'PLACED' WHERE id = $1;",
                [orderId]
            );
            return res.status(200).json({ message: "Order Placed", success });
        }
    } catch (error) {
        await pool.query("DELETE FROM OrderItems WHERE order_id=$1;"[orderId])
        await pool.query("DELETE FROM Orders WHERE id = $1;"[orderId])
        return res.status(500).json({ message: "Order Failed!" });
    }
}

const userOrders = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const userOrders = await pool.query(
            "SELECT * FROM Orders WHERE user_id = $1 AND status='PLACED';",
            [userId]
        );

        const query = `
        SELECT o.id AS order_id, 
               o.created_at, 
               o.total, 
               o.status, 
               sa.address_line1, 
               sa.city, 
               sa.state, 
               sa.pin_code, 
               oi.product_id, 
               oi.quantity, 
               p.product_name, 
               p.price,
               p.productimgurl
        FROM Orders o
        JOIN shippingaddress sa ON o.shipping_address_id = sa.id
        JOIN OrderItems oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.product_id
        WHERE o.user_id = $1 AND (o.status = 'PLACED' OR o.status = 'DISPATCHED');
    `;

    const { rows } = await pool.query(query, [userId]);

    console.log(rows);
    res.status(200).json({ success: true, orders: rows });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        })
    }
}

export {
    userAddress,
    updateAddress,
    checkout,
    verifyOrder,
    userOrders
};