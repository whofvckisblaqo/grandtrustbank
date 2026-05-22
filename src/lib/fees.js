// Standard domestic transfer fee tiers
export function calculateTransferFee(amount) {
  if (amount <= 500)    return 0;      // free for small transfers
  if (amount <= 5000)   return 1.50;
  if (amount <= 25000)  return 3.00;
  return 5.00;
}

// Sales tax on fees = 0% (waived for banking fees in most US/EU jurisdictions)
export function calculateVAT(fee) {
  return 0;
}

export function getTransactionCost(amount) {
  const fee = calculateTransferFee(amount);
  const tax = calculateVAT(fee);
  return { fee, tax, total: parseFloat((fee + tax).toFixed(2)) };
}
