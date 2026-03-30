import CompetitorPrice from '../models/CompetitorPrice.js';
import PriceHistory from '../models/PriceHistory.js';
import Product from '../models/Product.js';

// Create Product : /api/products
export const createProduct = async (req, res) => {
  try {
    const {name, category, basePrice} = req.body;
    const product = await Product.create({name, category, basePrice});
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Products : /api/products
export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

// Add Previous Prices : /api/products/history
export const addPriceHistory = async (req, res) => {
  try {
    const { productId, price } = req.body;
    const newHistory = await PriceHistory.create({ productId, price });
    res.status(201).json(newHistory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add Competitor Prices : /api/products/competitor
export const addCompetitorPrice = async (req, res) => {
  try {
    const { productId, competitorName, price } = req.body;
    const newCompPrice = await CompetitorPrice.create({ 
      productId, 
      competitorName, 
      price 
    });
    res.status(201).json(newCompPrice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};