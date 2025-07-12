import React from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

function LogoutButton() {
    axios.defaults.withCredentials = true
    const { isAuthenticated, setlogout } = useAuth()
    const navigate = useNavigate()

    if(!isAuthenticated) {
        return null
    }

    const handleLogOut = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/v1/users/logout`, {}, {withCredentials: true})
            console.log(response.data)
        } catch (error) {
            console.log("Error:", error.message)
        } finally {
             setlogout();
             navigate("/login");
        }
    }

    return (
        <button onClick={handleLogOut} className="text-black text-base no-underline block md:border-none py-2 px-4 md:hover:bg-transparent hover:bg-red-100 border-b border-gray-300">
            <li className="list-none">Logout</li>
        </button>
    )
}

export default LogoutButton
