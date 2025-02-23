import type {Request, Response} from "express";
import {connection} from "../../utils/db";

export const getAllProducts =  async (req: Request, res: Response) => {
    try {
        const query = await connection.query('SELECT * FROM PRODUCTS')
        const countQuery =await connection.query('SELECT COUNT(*) FROM PRODUCTS')

        const result = query[0];

        return res.status(200).json({status: 200, products: result, totalCount: countQuery[0]})
    } catch (e) {
        return res.status(500).json({ status: 500, message: e.message });
    }
}

export const getCategoryProducts = async (req: Request, res: Response) => {
  const { categoryId } = req.query

  try {
    const query = await connection.execute(
      `SELECT * FROM PRODUCTS WHERE categoryId = ?`, [categoryId]
    )
    const countQuery = await connection.execute(
      `SELECT COUNT(*) FROM PRODUCTS WHERE categoryId = ?`, [categoryId]
    )
    const result = query[0];

    const totalCount = countQuery[0][0]['COUNT(*)']

    return res
      .status(200)
      .json({ status: 200, products: result, totalCount: totalCount })
  } catch (e) {
    return res.status(500).json({ status: 500, message: e.message })
  }
}