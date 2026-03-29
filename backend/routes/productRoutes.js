import express from 'express';
import { addCompetitorPrice, addPriceHistory, createProduct, getProducts } from '../controllers/productController.js';

const router = express.Router();

router.post('/products', createProduct);
router.get('/products', getProducts);
router.post('/products/history', addPriceHistory);
router.post('/products/competitor', addCompetitorPrice);

export default router;