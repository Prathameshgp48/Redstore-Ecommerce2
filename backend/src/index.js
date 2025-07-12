import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./db/db.js";
import { app } from "./app.js";

const port = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.on("ERROR", (error) => {
            console.log("ERR: ", error);
            throw error;
        });

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((err) => console.log("DATABASE CONNECTION FAILED", err));
