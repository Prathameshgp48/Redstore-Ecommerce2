import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

function AddProduct() {
    const [newProduct, setNewProduct] = useState({
        product_img: "",
        product_name: "",
        category: "",
        price: "",
        description: "",
        stock: ""
    })

    const handleProductImgChange = (e) => {
        const { files } = e.target;
        const productImg = files[0];
        setNewProduct({ ...newProduct, product_img: productImg });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    }

    const preview = (e) => {
        let output = document.getElementById("output");
        output.src = URL.createObjectURL(e.target.files[0]);
        output.onload = function () {
            URL.revokeObjectURL(output.src);
        };
    };

    const addProduct = async (e) => {
        e.preventDefault()
        console.log(newProduct)
        const isNumeric = (string) => /^[+-]?\d+(\.\d+)?$/.test(string)
        if (!isNumeric(newProduct.price)) {
            return toast.error("Invalid Input Price")
        }

        if (!isNumeric(newProduct.stock)) {
            return toast.error("Invalid Input Stock")
        }

        try {
            const formData = new FormData();
            formData.append('product_img', newProduct.product_img);
            formData.append('product_name', newProduct.product_name);
            formData.append('category', newProduct.category);
            formData.append('price', newProduct.price);
            formData.append('description', newProduct.description);
            formData.append('stock', newProduct.stock);
            formData.append('sizes', newProduct.sizes);

            const response = await axios.post(`${API_URL}/api/v1/addproduct`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response.data)
            if(response.status === 200) {
                toast.success(response.data.message||"Product Added Successfully!🥳")
                setNewProduct({
                    product_img: "",
                    product_name: "",
                    category: "",
                    price: "",
                    description: "",
                    stock: ""
                })
            }
        } catch (error) {
            console.log(error)
            toast.error(error.data || "Something went wrong")
        }
    }

    return (
        <div className="p-4">
            <form className="grid gap-6 grid-cols-1 md:grid-cols-2" onSubmit={addProduct}>
                <div className="flex flex-col items-center justify-center">
                    <img
                        src="https://cdn-icons-png.flaticon.com/128/9789/9789495.png"
                        id="output"
                        alt=""
                        className="h-32 w-32 mb-4 object-cover rounded-md"
                    />
                    <input
                        type="file"
                        accept="image/**"
                        className="h-24 w-full max-w-[200px] px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 focus:outline-none"
                        onChange={(e) => {
                            preview(e);
                            handleProductImgChange(e);
                        }}
                    />
                </div>
                <div className="max-w-full md:max-w-72 m-4">
                    <input
                        type="text"
                        name="product_name"
                        value={newProduct.product_name}
                        placeholder="Product Name"
                        className="mb-5 w-full p-3 rounded-md border border-gray-300 bg-white bg-opacity-50 outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-600"
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="category"
                        value={newProduct.category}
                        placeholder="Category"
                        className="mb-5 w-full p-3 rounded-md border border-gray-300 bg-white bg-opacity-50 outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-600"
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="price"
                        value={newProduct.price}
                        placeholder="Price"
                        className="mb-5 w-full p-3 rounded-md border border-gray-300 bg-white bg-opacity-50 outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-600"
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="stock"
                        value={newProduct.stock}
                        placeholder="Stock"
                        className="mb-5 w-full p-3 rounded-md border border-gray-300 bg-white bg-opacity-50 outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-600"
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="description"
                        value={newProduct.description}
                        placeholder="Description"
                        className="mb-5 w-full p-3 rounded-md border border-gray-300 bg-white bg-opacity-50 outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-600"
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="sizes"
                        value={newProduct.sizes}
                        placeholder="Available Sizes"
                        className="mb-5 w-full p-3 rounded-md border border-gray-300 bg-white bg-opacity-50 outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-600"
                        onChange={handleChange}
                    />
                    <button
                        type="submit"
                        className="w-full p-3 rounded-md bg-red-500 text-white hover:bg-red-400 outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Add Product
                    </button>
                </div>
            </form>
        </div>

    )
}

export default AddProduct
