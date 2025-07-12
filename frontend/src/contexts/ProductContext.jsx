import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
const ProductContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const ProductContextProvider = ({ children }) => {
  const [singleProduct, setSingleProduct] = useState(null)
  const [cart, setCart] = useState([])
  const [totalPrice, setTotalPrice] = useState()
  const [checkout, setCheckout] = useState(false)
  const [loading, setLoading] = useState(false)
  const {isAuthenticated} = useAuth()

  const selectProduct = (product) => {
    setSingleProduct(product);
  };

  const addToCart = async (product, quantity, size) => {
    const newCartItem = { ...product, quantity, size}
    setCart((prevCart) => {
      const updatedCart = [...prevCart, newCartItem]
      return updatedCart
    })

  };

  const removeCart = (id) => {
    setCart((prev) => prev.filter((cart) => cart.id !== id));
  };

const loadCartData = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/cart/cart`, {
      withCredentials: true,
    });
    console.log(response.data);
    setCart(response.data);
  } catch (error) {
    console.log("Error loading cart:", error);
    setCart([]); // fallback to empty cart on error
  }
};


  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      if (isAuthenticated) {
        await loadCartData(true)
      } else {
        setCart([])
      }
      setLoading(false)
    }
    loadData()
  }, [isAuthenticated])

  useEffect(() => {
    console.log("Cart updated: ", cart);  // Log cart state whenever it changes
  }, [cart])  

  return (
    <ProductContext.Provider
      value={{
        selectProduct,
        singleProduct,
        cart,
        addToCart,
        removeCart,
        setTotalPrice,
        totalPrice,
        checkout,
        setCheckout,
        loading
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  return useContext(ProductContext);
};
