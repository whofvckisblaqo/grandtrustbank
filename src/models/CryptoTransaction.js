import mongoose from 'mongoose';

const cryptoTxSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:        { type: String, enum: ['buy', 'sell', 'send', 'receive'], required: true },
  coin:        { type: String, required: true },
  symbol:      { type: String, required: true },
  coinAmount:  { type: Number, required: true },
  priceAtTime: { type: Number, required: true },
  totalUSD:    { type: Number, required: true },
  fromAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  toAccount:   { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  reference:   { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.models.CryptoTransaction || mongoose.model('CryptoTransaction', cryptoTxSchema);
