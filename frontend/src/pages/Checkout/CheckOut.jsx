import axios from 'axios'
import React from 'react'
import { useProduct } from '../../contexts/ProductContext.jsx'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL;

function CheckOut() {
    const { totalPrice, cart } = useProduct()
    const navigate = useNavigate()

    const handleCheckout = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${API_URL}/api/v1/orders/checkout`,{withCredentials: true})
            console.log(response.data)

            if (response.data.success === true) {
                window.location.href = response.data.session_url
                navigate("/myorders")
            } else {
                console.error('Checkout failed:', response.data.message)
                navigate("/")
            }
        } catch (error) {
            console.log(error)
            navigate("/")
        }
    }

    return (
        <button onClick={handleCheckout} className="w-full bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded">
            Checkout
        </button>
    )
}

export default CheckOut
