import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
  
    useEffect(() => {
        const authState = localStorage.getItem("isAuthenticated")
        console.log(authState)
        if (authState !== null) {
            setIsAuthenticated(JSON.parse(authState))
        }
    }, [])

    const setlogin = () => {
        localStorage.setItem("isAuthenticated", JSON.stringify(true))
        setIsAuthenticated(true)
    }
    const setlogout = () => {
        localStorage.setItem("isAuthenticated", JSON.stringify(false));
        setIsAuthenticated(false)
    }

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, setlogin, setlogout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}