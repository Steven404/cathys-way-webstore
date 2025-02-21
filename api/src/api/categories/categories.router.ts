import { Router } from 'express';
import {getAllCategories} from "./categories.controller";

const router = Router();

router.get('/getAll', async (req, res) => {
    await getAllCategories(req, res)
})

export default router