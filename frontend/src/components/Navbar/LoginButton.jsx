import React from 'react'
import { NavLink } from 'react-router-dom'

function LoginButton() {
    return (
        <NavLink to="/login" className="text-black text-base no-underline block md:border-none py-2 px-4 md:hover:bg-transparent hover:bg-red-100 border-b border-gray-300">
            <li className="list-none ">Login</li>
        </NavLink>
    )
}

export default LoginButton
