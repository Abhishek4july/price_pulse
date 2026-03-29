import mongoose from 'mongoose';

const priceHistorySchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  price: Number,
  date: { type: Date, default: Date.now }
});

export default mongoose.model('PriceHistory', priceHistorySchema);