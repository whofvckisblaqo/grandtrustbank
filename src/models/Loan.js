import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:           { type: String, enum: ['personal', 'business', 'mortgage', 'auto', 'education'], required: true },
  amount:         { type: Number, required: true },
  duration:       { type: Number, required: true }, // months
  interestRate:   { type: Number, required: true }, // annual %
  monthlyPayment: { type: Number, required: true },
  totalRepayable: { type: Number, required: true },
  totalInterest:  { type: Number, required: true },
  purpose:        { type: String, required: true },
  status:         { type: String, enum: ['pending', 'approved', 'rejected', 'active', 'completed'], default: 'pending' },
  adminNotes:     { type: String },
  creditedAccount:{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  approvedAt:     { type: Date },
  rejectedAt:     { type: Date },
}, { timestamps: true });

export default mongoose.models.Loan || mongoose.model('Loan', loanSchema);
