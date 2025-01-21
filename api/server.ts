import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'

import * as mysql from 'mysql2'
import { connection } from './src/utils/db'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})

;(async () => {
  const test = await connection.query('SELECT * FROM CATEGORIES')

  console.log(test[0])
})()
