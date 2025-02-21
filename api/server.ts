import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'

import cors, { CorsOptions } from 'cors'
import CategoriesRouter from "./src/api/categories/categories.router";

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000

const corsOptions: CorsOptions = {
  origin: '*',
  methods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Enctype']
};

app.use(cors<Request>(corsOptions));

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})

app.use('/api/categories', CategoriesRouter);
