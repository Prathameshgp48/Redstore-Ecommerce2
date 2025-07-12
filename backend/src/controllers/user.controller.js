import { pool } from "../db/db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Email regex pattern
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password regex pattern (example: minimum 8 characters, at least one letter and one number)
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/


const generateAccessToken = async (userId, req, res) => {
  try {
    const response = await pool.query("SELECT id, email, fullname FROM users WHERE id = $1", [userId]);

    if (response.rows.length === 0) {
      throw new Error('User not found');
    }

    console.log(response.rows[0])
    const user = response.rows[0]


    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        dob: user.dob
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
    );

    return accessToken;
  } catch (error) {
    console.log('Error generating access token:', error);
    throw new Error('Something went wrong while generating access token');
  }
};

const generateRefreshToken = async (userId) => {
  const refreshToken = await jwt.sign(
    {
      id: userId,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );

  await pool.query("UPDATE users SET refreshToken = $1 WHERE id = $2", [refreshToken, userId])

  return refreshToken

};

const generateAccessRefreshTokens = async (userId, req, res) => {
  try {
    const accessToken = await generateAccessToken(userId)
    const refreshToken = await generateRefreshToken(userId)
    console.log("AccessToken", accessToken)
    console.log("refreshToken", refreshToken)

    if (!accessToken && !refreshToken) {
      return res.status(502).json({ message: "Error while generating tokens!!" })
    }

    return { accessToken, refreshToken }
  } catch (error) {
    console.error('Error:', error)
    throw new Error("Something went wrong while generating tokens");
  }
};


const registerUser = async (req, res) => {
  try {
    const { fullname, email, password, phone_number } = req.body

    if (!fullname || !email || !password || !phone_number) {
      return res.status(400).json({
        message: "Please provide all fields"
      })
    }

    if (!emailPattern.test(email)) {
      return res.status(400).json({
        message: "Invalid email"
      })
    }

    if (!passwordPattern.test(password)) {
      return res.status(400).json({ message: "Password must be at least 8 characters long and contain both letters and numbers" })
    }

    const existedUser = await pool.query(
      "SELECT email FROM users WHERE email = $1",
      [email]
    )

    if (existedUser.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword.length)

    const user = await pool.query(
      "INSERT INTO users (fullname, email, password, phone_number) VALUES ($1, $2, $3, $4) RETURNING *",
      [fullname, email, hashedPassword, phone_number]
    )

    // console.log(token)
    return res.status(201).json({ data: user.rows[0], message: "Registered Successfully!" })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: "Internal server error",
    })
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(406).json({ message: "Please provide all the fields!" })
    }

    const existedUser = await pool.query(
      "SELECT id, email, password, fullname FROM users WHERE email = $1",
      [email]
    );

    // console.log(existedUser.rows[0]);

    if (!existedUser.rows[0]) {
      return res.status(501).json({ message: "Invalid Credentials" })
    }

    const userPassword = existedUser.rows[0].password

    const isPasswordMatch = await bcrypt.compare(password, userPassword);

    if (!isPasswordMatch) {
      return res.status(501).json({ message: "Invalid Credentials" });
    }

    const { accessToken, refreshToken } = await generateAccessRefreshTokens(existedUser.rows[0].id)
    // console.log("accessToken", accessToken)

    const accessOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRY, 10) * 24 * 60 * 60 * 1000
    }

    const refreshOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRY, 10) * 24 * 60 * 60 * 1000
    }

    existedUser.rows[0].password = ""
    const loggedUser = existedUser.rows[0]

    // if (process.env.NODE_ENV === 'production') {
    res.cookie("accessToken", accessToken, accessOptions)
    res.cookie("refreshToken", refreshToken, refreshOptions)

    console.log("tokens:", accessToken)

    return res
      .status(200)
      .json({
        message: "Login Successful",
        token: accessToken,
        loggedUser
      })
  } catch (error) {
    console.log('Error from loginUser ~line 67:', error)
    return res.status(501).json({ message: "Internal server error" })
  }
};

const logoutUser = async (req, res) => {
  try {
    const userId = req?.user?.id
    if (userId) {
       await pool.query('UPDATE users SET refreshToken = $1 WHERE id = $2 RETURNING refreshToken;', [null, userId])
    }
    // console.log("Rfrs:", refresh.rows[0])

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    }

    res
      .status(200)
      .clearCookie("refreshToken", options)
      .clearCookie("accessToken", options).json({ message: "User Logged-out" })
  } catch (error) {
    console.log("Logout error:", error)
    return res.status(500).json({ message: "Logout failed" })
  }
}


const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshOptions || req.body.refreshToken

    if (!incomingRefreshToken) {
      return res.status(502).json({ message: "Unauthorized request" })
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await pool.query("SELECT id, fullname, email, phone_number FROM users WHERE id = $1;", decodedToken?.id)

    if (user.rows.length === 0) {
      return res.status(502).json({ message: "Unauthorized request" })
    }

    if (incomingRefreshToken != user.rows[0]?.refreshToken) {
      return res.status(502).json({ message: "Refresh toke expired or used" })
    }

    const accessOptions = {
      httpOnly: true,
      secure: false,
      maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRY, 10) * 24 * 60 * 60 * 1000
    }

    const refreshOptions = {
      httpOnly: true,
      secure: false,
      maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRY, 10) * 24 * 60 * 60 * 1000
    }

    const { accessToken, newRefreshToken } = await generateAccessRefreshTokens(user.rows[0].id)

    return res
      .status(200)
      .cookie("newrefreshToken", newRefreshToken, refreshOptions)
      .cookie("accessToken", accessToken, accessOptions)
      .json({ message: "AccessToken refreshed", accessToken, newRefreshToken })
  } catch (error) {
    console.log("error:", error)
    return res.status(502).json({ message: "Server Error" })
  }
}

const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true })
  } catch (error) {
    return res.json({ sucess: false })
  }
}

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  isAuthenticated
};
