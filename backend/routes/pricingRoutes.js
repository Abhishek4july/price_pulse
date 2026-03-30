import express from 'express';
import { getRecommendedPrice } from '../controllers/pricingController.js';

const router = express.Router();

router.get('/recommend/:productId', getRecommendedPrice);

export default router;