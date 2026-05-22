import mongoose from 'mongoose';

function generateReference() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `GTB${ts}${rand}`;
}

const transactionSchema = new mongoose.Schema(
  {
    reference:       { type: String, unique: true },
    type:            { type: String, enum: ['transfer', 'deposit', 'withdrawal', 'bill-payment', 'reversal', 'fee', 'interest'], required: true },
    direction:       { type: String, enum: ['credit', 'debit'], required: true },

    amount:          { type: Number, required: true, min: 0 },
    fee:             { type: Number, default: 0 },
    tax:             { type: Number, default: 0 },
    currency:        { type: String, default: 'USD' },

    senderAccount:   { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    senderUser:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiverAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    receiverUser:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    balanceBefore:   { type: Number },
    balanceAfter:    { type: Number },

    narration:       { type: String, trim: true },
    description:     { type: String, trim: true },
    category:        { type: String, default: 'general' },

    status:          { type: String, enum: ['pending', 'processing', 'completed', 'failed', 'reversed'], default: 'pending' },
    failureReason:   { type: String },

    channel:         { type: String, enum: ['web', 'mobile', 'ussd', 'api', 'system'], default: 'web' },
    ipAddress:       { type: String },
    deviceInfo:      { type: String },

    reversedFrom:    { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
    metadata:        { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

transactionSchema.pre('save', async function () {
  if (!this.reference) {
    this.reference = generateReference();
  }
});

transactionSchema.index({ senderAccount: 1, createdAt: -1 });
transactionSchema.index({ receiverAccount: 1, createdAt: -1 });
transactionSchema.index({ senderUser: 1, createdAt: -1 });
transactionSchema.index({ reference: 1 });
transactionSchema.index({ status: 1 });

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
