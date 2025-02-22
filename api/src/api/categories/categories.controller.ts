import { type Response, type Request } from 'express';
import { connection } from "../../utils/db";

export const getAllCategories =  async (req: Request, res: Response) => {
    try {
        const query = await connection.query('SELECT * FROM CATEGORIES')
        const result = query[0];

        return res.status(200).json({status: 200, categories: result})
    } catch (e) {
        return res.status(500).json({ status: 500, message: e.message });
    }
}