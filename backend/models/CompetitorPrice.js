import mongoose from 'mongoose';

const competitorSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  competitorName: String,
  price: Number,
  date: { type: Date, default: Date.now }
});

export default mongoose.model('CompetitorPrice', competitorSchema);