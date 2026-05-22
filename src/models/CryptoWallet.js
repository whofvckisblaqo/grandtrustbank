import mongoose from 'mongoose';

const holdingSchema = new mongoose.Schema({
  coin:        { type: String, required: true },
  symbol:      { type: String, required: true },
  amount:      { type: Number, default: 0 },
  avgBuyPrice: { type: Number, default: 0 },
}, { _id: false });

const walletSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  holdings: [holdingSchema],
}, { timestamps: true });

export default mongoose.models.CryptoWallet || mongoose.model('CryptoWallet', walletSchema);
