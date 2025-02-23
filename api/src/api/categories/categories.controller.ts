import { type Response, type Request } from 'express';
import { connection } from "../../utils/db";
import { CategoryRowDataPacket } from "../../utils/apiTypes";

export const getAllCategories =  async (req: Request, res: Response) => {
    try {
        const query = await connection.query('SELECT * FROM CATEGORIES')
        const result = query[0];

        return res.status(200).json({status: 200, categories: result})
    } catch (e) {
        return res.status(500).json({ status: 500, message: e.message });
    }
}

export const getCategory = async (req: Request, res: Response) => {
    const { categoryId } = req.query

    try {
        const [rows, fields] = await connection.execute<CategoryRowDataPacket[]>(`SELECT * FROM CATEGORIES WHERE ID = ?`, [categoryId])

        if(!rows.length) {
            return res.status(204).json({status: 204, category: rows[0]})
        }

        return res.status(200).json({status: 200, category: rows[0]})
    } catch (e) {
        return res.status(500).json({ status: 500, message: e.message });
    }
}