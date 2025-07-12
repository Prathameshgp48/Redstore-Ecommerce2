import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../logo.png";
import { useAuth } from "../../contexts/AuthContext.jsx";
import LogoutButton from "./LogoutButton.jsx";
import LoginButton from "./LoginButton.jsx";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  // console.log(isAuthenticated)

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isHomePage = location.pathname === "/" || "/login" || "/register";

  return (
    <div
      className={`flex justify-between items-center py-4 px-6 bg-gradient-to-r from-white to-red-400 ${
        isHomePage ? "" : "shadow-md"
      } relative z-50`}
    >
      <NavLink to="/">
        <img
          className="w-[150px] object-contain py-2 px-3"
          src={logo}
          alt="logo"
        />
      </NavLink>

      <div className="md:hidden cursor-pointer" onClick={toggleMenu}>
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>

      <ul
        className={`absolute md:static top-full left-0 w-full md:w-auto md:bg-transparent transition-all duration-300 ease-in-out 
        ${
          isOpen ? "max-h-screen" : "max-h-0"
        } overflow-hidden md:flex md:items-center md:justify-center md:max-h-screen bg-white`}
      >
        <NavLink
          onClick={toggleMenu}
          to=""
          className="text-black text-base no-underline block md:border-none py-2 px-4 md:hover:bg-transparent hover:bg-red-100 border-b border-gray-300"
        >
          <li className="list-none">Home</li>
        </NavLink>
        <NavLink
          onClick={toggleMenu}
          to="/products"
          className="text-black text-base no-underline block md:border-none py-2 px-4 md:hover:bg-transparent hover:bg-red-100 border-b border-gray-300"
        >
          <li className="list-none">Products</li>
        </NavLink>

        {isAuthenticated ? (
          <>
            <NavLink
              onClick={toggleMenu}
              to="/cart"
              className="text-black text-base no-underline block md:border-none py-2 px-4 md:hover:bg-transparent hover:bg-red-100 border-b border-gray-300"
            >
              <li className="list-none">Cart</li>
            </NavLink>
            <NavLink
              onClick={toggleMenu}
              to="/myorders"
              className="text-black text-base no-underline block md:border-none py-2 px-4 md:hover:bg-transparent hover:bg-red-100 border-b border-gray-300"
            >
              <li className="list-none">MyOrders</li>
            </NavLink>
            <LogoutButton />
          </>
        ) : (
          <LoginButton />
        )}
      </ul>
    </div>
  );
}

export default Navbar;
