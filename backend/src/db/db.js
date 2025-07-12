import pkg from "pg";
import dotenv from "dotenv";

dotenv.config()

const { Pool } = pkg;

let pool;

if(process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {rejectUnauthorized: false}
  })
} else {
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
}

//testing purpose for deploying
const isRenderEnv = process.env.RENDER === "true"

const connectDB = async () => {
  try {
    await pool.connect();
    console.log(
      `Connection Successful!!\n Host:${pool.options.host}, Port:${pool.options.port}, Database:${pool.options.database}`
    );

  } catch (error) {
    console.log("connection FAILED", error);
    process.exit(1);
  }
};

export { connectDB, pool };
