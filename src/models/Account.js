import mongoose from 'mongoose';

function generateAccountNumber() {
  return `GTB${Date.now().toString().slice(-7)}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
}

const accountSchema = new mongoose.Schema(
  {
    user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    accountNumber: { type: String, unique: true },
    accountType:   { type: String, enum: ['savings', 'current', 'fixed-deposit', 'domiciliary'], default: 'savings' },
    currency:      { type: String, default: 'USD' },
    balance:       { type: Number, default: 0, min: 0 },
    ledgerBalance: { type: Number, default: 0 },
    availableBalance: { type: Number, default: 0 },
    status:        { type: String, enum: ['active', 'inactive', 'frozen', 'closed'], default: 'active' },
    tier:          { type: String, enum: ['tier1', 'tier2', 'tier3'], default: 'tier1' },
    dailyTransferLimit: { type: Number, default: 50000 },
    interestRate:  { type: Number, default: 0 },
    maturityDate:  { type: Date },
    isPrimary:     { type: Boolean, default: false },
    nickname:      { type: String },
  },
  { timestamps: true }
);

accountSchema.pre('save', async function () {
  if (!this.accountNumber) {
    this.accountNumber = generateAccountNumber();
  }
  if (this.availableBalance === 0 && this.balance > 0) {
    this.availableBalance = this.balance;
  }
});

export default mongoose.models.Account || mongoose.model('Account', accountSchema);
