import { Router } from 'express';
import {getAllCategories, getCategory} from "./categories.controller";

const router = Router();

router.get('/getAll', async (req, res) => {
    await getAllCategories(req, res);
});

router.get('/get', async (req,res) => {
    await getCategory(req,res);
});

export default router