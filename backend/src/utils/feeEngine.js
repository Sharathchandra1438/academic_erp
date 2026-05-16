const dayjs = require('dayjs');

/**
 * Split total fee into N installments with rounding fix on the last installment.
 * Ensures: sum of all installments === totalAmount (always)
 */
const generateInstallments = ({ totalAmount, numberOfInstallments, startDate, repaymentMode, dueDayOfMonth = 10, customDueDates = [] }) => {
  if (!totalAmount || totalAmount <= 0) throw new Error('Total amount must be positive.');
  if (!numberOfInstallments || numberOfInstallments <= 0) throw new Error('Invalid number of installments.');

  const base = Math.floor(totalAmount / numberOfInstallments);
  const remainder = totalAmount - base * numberOfInstallments;

  const installments = [];
  const start = dayjs(startDate || new Date());

  for (let i = 0; i < numberOfInstallments; i++) {
    let amount = base;
    // Add remainder to the LAST installment (never truncate)
    if (i === numberOfInstallments - 1) amount += remainder;

    let dueDate;
    if (customDueDates && customDueDates.length > i) {
      dueDate = new Date(customDueDates[i]);
    } else {
      // Generate monthly due dates from start month
      dueDate = start.add(i, 'month').date(dueDayOfMonth).toDate();
    }

    installments.push({
      installmentNumber: i + 1,
      label: numberOfInstallments === 1 ? 'Annual' :
             numberOfInstallments === 2 ? `Term ${i + 1}` :
             numberOfInstallments === 4 ? `Quarter ${i + 1}` :
             `Month ${i + 1}`,
      dueDate,
      amount,
      paidAmount: 0,
      status: 'Pending',
    });
  }

  // Verify total (sanity check)
  const total = installments.reduce((s, inst) => s + inst.amount, 0);
  if (total !== totalAmount) {
    throw new Error(`Installment rounding error. Expected ${totalAmount}, got ${total}.`);
  }

  return installments;
};

/**
 * Recalculate installments after partial payment (fee reconfiguration).
 */
const recalculateInstallments = ({ remainingAmount, numberOfInstallments, startDate, dueDayOfMonth = 10 }) => {
  return generateInstallments({ totalAmount: remainingAmount, numberOfInstallments, startDate, dueDayOfMonth });
};

module.exports = { generateInstallments, recalculateInstallments };
