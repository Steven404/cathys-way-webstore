import type {Request, Response} from "express";
import {connection} from "../../utils/db";
import {Category, SortOption} from "../../../../commonTypes";
import {CategoryRowDataPacket, ProductRowDataPacket} from "../../utils/apiTypes";

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
  const { categoryId,first, sort, offset } = req.query

  try {

    const offsetInt = parseInt(offset as string);
    console.log(offsetInt)

    const queryParams = [categoryId];

    let queryStr = `SELECT * FROM PRODUCTS WHERE categoryId = ?`

    if (sort && typeof sort === "string") {
      let sortObj = JSON.parse(sort) as SortOption['field'];

      // ✅ Whitelist valid column names to prevent SQL injection
      const validSortFields = ['price', 'name', 'createdAt']; // <-- add all valid column names here
      if (validSortFields.includes(sortObj.fieldName)) {
        const sortOrder = sortObj.order === 'asc' ? 'ASC' : 'DESC';
        queryStr += ` ORDER BY ${sortObj.fieldName} ${sortOrder}`;
      }
    }

    queryStr+= ` LIMIT 10 OFFSET ${offsetInt}`

    const query = await connection.execute<ProductRowDataPacket[]>(
        queryStr, queryParams
    )
    const countQuery = await connection.execute<ProductRowDataPacket[]>(
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

export const getProduct =  async (req: Request, res: Response) => {
    const { id } = req.query

    try {
        const query = await connection.execute<ProductRowDataPacket[]>('SELECT * FROM PRODUCTS where id = ?', [id])

        const result = query[0];


        if(result.length) {
            return res.status(200).json({status: 200, product: result[0],})
        } else {
            return res.status(204).json({status: 204, message: 'Product with ID' + id + ' not found', })
        }


        } catch (e) {
        return res.status(500).json({ status: 500, message: e.message });
    }
}