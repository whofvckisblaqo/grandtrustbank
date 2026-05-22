import mongoose from 'mongoose';

function genNumber(network) {
  const prefix = network === 'mastercard' ? '5' : '4';
  let n = prefix;
  while (n.length < 16) n += Math.floor(Math.random() * 10);
  return n;
}

function genCVV() {
  return String(Math.floor(Math.random() * 900) + 100);
}

const cardSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    fullNumber:  { type: String },
    last4:       { type: String },
    network:     { type: String, enum: ['visa', 'mastercard'], default: 'visa' },
    cardType:    { type: String, enum: ['debit', 'credit'], default: 'debit' },
    cardName:    { type: String, required: true },
    expiryMonth: { type: String },
    expiryYear:  { type: String },
    cvv:         { type: String },
    status:      { type: String, enum: ['active', 'frozen', 'blocked'], default: 'active' },
    creditLimit:     { type: Number, default: 0 },
    availableCredit: { type: Number, default: 0 },
    isVirtual: { type: Boolean, default: true },
  },
  { timestamps: true }
);

cardSchema.pre('save', function () {
  if (!this.fullNumber) {
    const num = genNumber(this.network);
    this.fullNumber = num;
    this.last4 = num.slice(-4);
  }
  if (!this.cvv) this.cvv = genCVV();
  if (!this.expiryMonth) {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 4);
    this.expiryMonth = String(d.getMonth() + 1).padStart(2, '0');
    this.expiryYear  = String(d.getFullYear()).slice(-2);
  }
});

cardSchema.set('toJSON', {
  virtuals: true,
  transform(_, obj) { delete obj.__v; return obj; },
});

export default mongoose.models.Card || mongoose.model('Card', cardSchema);
