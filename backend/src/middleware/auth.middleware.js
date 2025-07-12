import jwt from "jsonwebtoken"
import { pool } from "../db/db.js"

export const verifyJWT = async (req, res, next) => {
    try {
        // console.log("Cookies:", req.cookies);
        // console.log("Headers:", req.headers);
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        console.log("token", token)
        if (!token) {
            console.log("token error")
            return res.status(401).json({ message: "Unauthorized Request" })
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
              console.log("token error", err);
              return res.status(401).json({ message: "Invalid token" });
            }
            req.user = decoded;
            next();
          });
    } catch (error) {
        console.log("Error", error)
        return res.status(401).json({ message: "Invalid Access Token" })
    }
}