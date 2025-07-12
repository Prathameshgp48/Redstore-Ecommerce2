import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
    fullname: "",
    phone_number: ""
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user);

    try {
      const response = await axios.post(`${API_URL}/api/v1/users/register`, user);
      if(response.status >= 200) {
        toast.success(response.data.message || "You Have Registered Successfully🥳")
        navigate("/login")
      }
      setUser({
        email: "",
        password: "",
        fullname: "",
        phone_number: ""
      })

    } catch (error) {
      toast.error(error.response?.data.message)
      console.log("ERROR", error.response);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-400">
      <div className="flex flex-col md:flex-row items-center md:justify-between w-full max-w-6xl p-8 md:p-16">
        <div className="hidden md:flex md:w-1/2 md:order-2 mb-8 md:mb-0 justify-center">
          <img src="/images/image1.png" alt="Register Image" />
        </div>
        <div className="md:w-1/2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Join Us Today!
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-6">
            Create an account to get started.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col items-center md:items-start w-full max-w-xs bg-white bg-opacity-40 p-8 rounded-2xl shadow-lg backdrop-blur-md border border-white border-opacity-30">
            <input
              type="text" 
              name="fullname"
              value={user.fullname}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="mb-5 w-full p-2 rounded-md border border-gray-300 bg-white bg-opacity-60 outline-none placeholder-gray-800"
            />
            <input
              type="email" 
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="mb-5 w-full p-2 rounded-md border border-gray-300 bg-white bg-opacity-60 outline-none placeholder-gray-800"
            />
            <div className="relative w-full mb-5">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={user.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full p-2 rounded-md border border-gray-300 bg-white bg-opacity-60 outline-none placeholder-gray-800"
              />
              <button type="button"
                onClick={toggleShowPassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? (
                  <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                    <path d="M2 2L22 22" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                ) : (
                  <svg width="24px" height="px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <circle cx="12" cy="12" r="3" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                )}
              </button>
            </div>
            <input
              type="tel" 
              name="phone_number"
              value={user.phone_number}
              onChange={handleChange}
              placeholder="Phone number"
              pattern="[0-9]{10}"
              required
              className="mb-5 w-full p-2 rounded-md border border-gray-300 bg-white bg-opacity-50 outline-none placeholder-gray-800"
            />
            <button
              type="submit"
              className="bg-red-500 text-white py-2 px-6 rounded-full transition duration-300 hover:bg-red-600 w-full mb-4"
            >
              Register
            </button>
            <p className="text-lg">
              Already have an account?{" "}
              <NavLink to="/login" className="text-blue-600 hover:underline">
                Login
              </NavLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
