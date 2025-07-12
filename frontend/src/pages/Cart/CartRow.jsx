import React from "react";
import { useProduct } from "../../contexts/ProductContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function CartRow({ item }) {
  const { removeCart, setQuantity } = useProduct()
  const { isAuthenticated } = useAuth()
  console.log(isAuthenticated)

  const handleQuantityChange = (e) => {
    setQuantity(item.id);
  };

  const handleRemove = async () => {
    const productId = item.product_id

    if (isAuthenticated) {
      try {
        const response = await axios.post(`${API_URL}/api/v1/cart/removefromcart`, { productId })
        console.log(response.data)
        if (response.status >= 200) {
          removeCart(item.id)
          toast.success(response.data?.message || "Product Removed From the Cart")
        }

      } catch (error) {
        console.log(error)
        toast.error("Something went wrong")
      }
    }
  };

  return (

    <tr>
      <td>
        <div className="flex flex-wrap">
          <img src={item.product_img} alt={item.product_name} />
          <div>
            <p>{item.product_name}</p>
            <small>Price: Rs.{item.price}</small>
            <br />
            <button onClick={handleRemove}>Remove</button>
          </div>
        </div>
      </td>
      <td>{item.size}</td>
      <td>
        <input
          type="number"
          min={1}
          max={10}
          value={item.quantity}
          onChange={handleQuantityChange}
        />
      </td>
      <td>Rs.{Number(item.price) * item.quantity}</td>
    </tr>
  );
}

export default CartRow;
