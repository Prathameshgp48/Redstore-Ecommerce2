import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useProduct } from "../../contexts/ProductContext.jsx"
import axios from "axios"
import AddToCartButton from "./AddToCartButton.jsx"

const API_URL = import.meta.env.VITE_API_URL;

function ProductDetails() {
  const sizeOptions = {
    "T-shirt": ["XXL", "XL", "L", "M", "S"],
    "Joggers": ["XXL", "XL", "L", "M", "S"],
    "Sports Shoes": ["12", "11", "10", "9", "8"],
    "classic-watch": []
  };

  const { singleProduct, selectProduct } = useProduct()
  const [product, setProduct] = useState(singleProduct || null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState("Select Size")
  const [quantity, setQuantity] = useState(1)
  // const [quantity, setQuantity] = useState(1)
  const { id } = useParams();
  // console.log(id)


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // const response = await axios.get(
        //   `http://localhost:8000/api/v1/products/products/${id}`
        // );
        const response = await axios.get(
          `${API_URL}/api/v1/products/products/${id}`
        );
        // console.log(response.data)
        setProduct(response.data.product)
        selectProduct(response.data.product)
        setLoading(false)
        // console.log(product)
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false)
      }
    };


    if (!singleProduct && !product) {
      fetchProduct();
    } else {
      setLoading(false)
    }
  }, [id, product, singleProduct, selectProduct]);

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  }

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value)
  }


  if (loading) {
    return <div>Loading..</div>
  }

  if (!singleProduct) {
    return <div>Error: Invalid Product</div>
  }

  const categorySize = sizeOptions[product.category] || ["Select Size"]
  // console.log(categorySize)
  return (
    <div className="container mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="flex justify-center">
          <img
            src={product.productimgurl}
            alt={product.name}
            className="max-w-[400px] w-full h-auto"
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">
            {product.product_name}
          </h1>
          <h4 className="text-2xl font-semibold text-gray-700 mb-4">
            Rs. {product.price}
          </h4>
          <select
            className="px-4 py-2 text-center border border-red-500 rounded-full mb-4 mx-4"
            value={selectedSize}
            onChange={handleSizeChange}
          >
            <option>Select Size</option>
            {categorySize.map((size, index) => (
              <option key={index} value={size}>
                {size}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            max={10}
            value={quantity}
            onChange={handleQuantityChange}
            className="px-4 py-2 text-center border border-red-500 rounded-full mb-4 mx-4"
          />
          <AddToCartButton
            product={product}
            selectedSize={selectedSize}
            quantity={quantity}
          />
           <p className="mb-4">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
