import { pool } from "../db/db.js";

const addToCart = async (req, res) => {
  try {
    const { size, product, quantity } = req.body;
    console.log("line 300:", req.body);

    if (!size || !product || !quantity) {
      return res.status(400).json({ message: "No product details" });
    }


    // Check if the user has an active cart
    const activeCartResult = await pool.query(
      "SELECT * FROM Carts WHERE user_id = $1 AND status=\'ACTIVE\'; ",
      [req.user.id]
    );

    console.log("Active cart query result:", activeCartResult.rows)

    let cart;
    // If no active cart exists, create a new one
    if (activeCartResult.rows.length === 0) {
      const newCartResult = await pool.query(
        "INSERT INTO Carts (user_id, status) VALUES ($1, \'ACTIVE\') RETURNING *;",
        [req.user.id]
      );
      cart = newCartResult.rows[0];
      console.log("New cart created:", cart)
    } else {
      cart = activeCartResult.rows[0];
      console.log("Existing cart found: ", cart)
    }


    // Check if the product is already in the cart
    const cartProductResult = await pool.query(
      "SELECT * FROM CartItems WHERE cart_id = $1 AND product_id = $2;",
      [cart.id, product.product_id]
    );

    if (cartProductResult.rows.length === 0) {
      // If product is not in the cart, add it
      const newCartItemResult = await pool.query(
        "INSERT INTO CartItems (cart_id, product_id, size, quantity, product_img, product_name, price) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *;",
        [cart.id, product.product_id, size, quantity, product.productimgurl, product.product_name, product.price]
      );
      return res.status(200).json({ message: "Product added to cart", product: newCartItemResult.rows[0] });
    } else {
      // If product is already in the cart, update the quantity
      const updatedCartItemResult = await pool.query(
        "UPDATE CartItems SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *;",
        [quantity, cart.id, product.product_id]
      );
      console.log("Product quantity updated in cart:", product.product_name)
      return res.status(200).json({ message: "Product quantity updated in cart", product: updatedCartItemResult.rows[0] });
    }

  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const viewCart = async (req, res) => {
  //1.retrieve the userId when user hits the endpoint
  //2.fetch cart_id corresponding to the userId
  //3.Using cart_id fetch cartItems corresponding to it
  //4.Return

  const userId = req.user.id
  console.log("viewcart userid:", userId)

  const cartId = await pool.query("SELECT id FROM carts WHERE user_id = $1 AND status=\'ACTIVE\'", [
    userId
  ]);
  console.log("line:369", cartId.rows)

  if (cartId.rows.length === 0) {
    return res.status(404).json({ message: "Cart does'nt exist!" });
  }

  const cartItems = await pool.query(
    "SELECT * FROM CartItems WHERE cart_id = $1",
    [cartId.rows[0].id]
  );

  // console.log(cartItems.rows);
  return res.status(200).json(cartItems.rows);
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const { productId } = req.body;
    console.log(productId)
    if (!productId) { return res.status(500).json({ message: "Product_id missing!" }) }

    const userCart = await pool.query("SELECT * FROM Carts WHERE user_id = $1 AND status=\'ACTIVE\';", [userId])

    if (userCart.rows.length === 0) return res.status(400).json({ message: "Active cart not found" })
    const cart_id = userCart.rows[0].id

    const removeProduct = await pool.query("DELETE FROM CartItems WHERE cart_id=$1 AND product_id =$2 RETURNING *;", [cart_id, productId])
    console.log(removeProduct.rows[0])
    if (removeProduct.rows.length === 0) return res.status(400).json({ message: "Product not found" })

    return res.status(200).json({ message: "Product Removed From the Cart!", removed: removeProduct.rows[0] })
  } catch (error) {
    console.log("Error", error)
    return res.status(500).json("Internal Server Error")
  }
}

export {
  removeFromCart,
  viewCart,
  addToCart
}