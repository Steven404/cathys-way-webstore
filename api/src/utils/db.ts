import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()
export const connection = mysql
  .createPool({
    port: 3306,
    host: 'localhost',
    user: process.env.DB_ADMIN,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  })
  .promise()
