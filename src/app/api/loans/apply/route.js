import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import Loan from '@/models/Loan';
import User from '@/models/User';
import { sendLoanStatusEmail } from '@/lib/email';

export const maxDuration = 30;

const RATES = {
  personal:  { rate: 12.5, min: 500,    max: 50000,    minMonths: 6,   maxMonths: 60 },
  business:  { rate: 9.5,  min: 5000,   max: 500000,   minMonths: 12,  maxMonths: 84 },
  mortgage:  { rate: 5.5,  min: 50000,  max: 2000000,  minMonths: 60,  maxMonths: 360 },
  auto:      { rate: 7.5,  min: 5000,   max: 100000,   minMonths: 24,  maxMonths: 84 },
  education: { rate: 6.5,  min: 1000,   max: 100000,   minMonths: 12,  maxMonths: 120 },
};

function calcMonthly(principal, annualRate, months) {
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

async function handler(req, _ctx, userId) {
  const { type, amount, duration, purpose } = await req.json();

  if (!RATES[type]) return NextResponse.json({ error: 'Invalid loan type' }, { status: 400 });
  const config = RATES[type];

  if (amount < config.min || amount > config.max)
    return NextResponse.json({ error: `Amount must be between $${config.min.toLocaleString()} and $${config.max.toLocaleString()}` }, { status: 400 });
  if (duration < config.minMonths || duration > config.maxMonths)
    return NextResponse.json({ error: `Duration must be ${config.minMonths}–${config.maxMonths} months for ${type} loans` }, { status: 400 });
  if (!purpose?.trim())
    return NextResponse.json({ error: 'Loan purpose is required' }, { status: 400 });

  const monthly       = calcMonthly(amount, config.rate, duration);
  const totalRepayable = monthly * duration;
  const totalInterest  = totalRepayable - amount;

  const loan = await Loan.create({
    user: userId, type, amount, duration,
    interestRate: config.rate,
    monthlyPayment: Math.round(monthly * 100) / 100,
    totalRepayable: Math.round(totalRepayable * 100) / 100,
    totalInterest:  Math.round(totalInterest  * 100) / 100,
    purpose: purpose.trim(),
  });

  try {
    const user = await User.findById(userId).select('firstName lastName email');
    if (user) {
      await sendLoanStatusEmail({
        to: user.email,
        name: `${user.firstName} ${user.lastName}`,
        loanAmount: amount,
        currency: 'USD',
        status: 'pending',
        note: `Your ${type} loan application is under review. You'll be notified once a decision is made.`,
      });
    }
  } catch (err) {
    console.error('[LOAN_PENDING_EMAIL]', err);
  }

  return NextResponse.json({ message: 'Loan application submitted successfully', loan }, { status: 201 });
}

export const POST = withAuth(handler);