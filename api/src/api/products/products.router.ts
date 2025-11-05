import { Router } from 'express';
import {getAllProducts, getCategoryProducts, getProduct} from "./products.controller";

const router = Router();

router.get('/all', async (req, res) => {
    await getAllProducts(req, res)
})

router.get('/category', async (req, res) => {
    await getCategoryProducts(req, res)
})

router.get('/', async (req, res) => {
    await getProduct(req,res)
})

export default router