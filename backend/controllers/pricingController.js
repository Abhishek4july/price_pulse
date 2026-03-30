import Product from '../models/Product.js';
import PriceHistory from '../models/PriceHistory.js';
import CompetitorPrice from '../models/CompetitorPrice.js';
import calculateRecommendedPrice from '../services/pricingService.js';
import axios from 'axios';

// Get Recommended Price : /api/recommend/:productId
export const getRecommendedPrice = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const history = await PriceHistory.find({ productId });
    const competitor = await CompetitorPrice.find({ productId });

    const currentPrice =
      history.length > 0
        ? history[history.length - 1].price
        : product.basePrice;

    const avgCompetitorPrice =
      competitor.length > 0
        ? competitor.reduce((acc, c) => acc + c.price, 0) / competitor.length
        : product.basePrice;

    let predictedDemand = 0.5;
    let predictedPrice = currentPrice;

    // ML Call
    try {
      const priceHistory = history.map(h => h.price);

      if (priceHistory.length >= 1) {
        const mlResponse = await axios.post('http://localhost:5001/predict', {
          priceHistory,
          competitorPrices: competitor.map(c => c.price)
        });

        predictedDemand = mlResponse.data.predictedDemand;
        predictedPrice = mlResponse.data.predictedPrice;
      } else {
        console.log("Not enough history for ML prediction");
      }
    } catch (mlError) {
      console.log("ML service failed:", mlError.message);
    }

    const result = calculateRecommendedPrice({
      currentPrice,
      avgCompetitorPrice,
      predictedDemand
    });

    res.json({
      currentPrice,
      avgCompetitorPrice,
      predictedDemand,
      predictedPrice,
      mlUsed: history.length > 0,
      ...result
    });

  } catch (err) {
    console.error("Controller Error:", err);
    res.status(500).json({ error: err.message });
  }
};