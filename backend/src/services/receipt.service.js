const mongoose = require('mongoose');
const Receipt = require('../models/Receipt');
const PaymentTransaction = require('../models/PaymentTransaction');
const StudentFeeAssignment = require('../models/StudentFeeAssignment');
const StudentLedgerEntry = require('../models/StudentLedgerEntry');
const { createLedgerEntry, createReversalEntry } = require('./ledger.service');
const { generateNumber } = require('../utils/numberSeries');
const { RECEIPT_STATUS, PAYMENT_STATUS, LEDGER_ENTRY_TYPE } = require('../config/constants');
const { v4: uuidv4 } = require('uuid');

/**
 * Collect fee — supports split payment across multiple modes.
 * @param {Object} params
 */
const collectFee = async ({
  studentId, academicYearId, organisationId, feeAssignmentId,
  payments, // [{ paymentModeId, paymentModeName, amount, reference, bankName, chequeNumber, chequeDate }]
  feeHeadAllocations, // [{ feeHeadId, feeHeadName, amount }]
  collectedBy, receiptDate, remarks,
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const totalAmount = payments.reduce((s, p) => s + p.amount, 0);

    // 1. Generate receipt number
    const receiptNumber = await generateNumber({ organisationId, module: 'receipt', academicYearId });

    // 2. Create payment transactions (one per payment mode)
    const transactionIds = [];
    for (const payment of payments) {
      const tx = await PaymentTransaction.create([{
        transactionId: uuidv4(),
        studentId, receiptId: null, // will update after receipt created
        academicYearId,
        amount: payment.amount,
        paymentModeId: payment.paymentModeId,
        paymentModeName: payment.paymentModeName,
        status: PAYMENT_STATUS.SUCCESS,
        referenceNumber: payment.reference,
        bankName: payment.bankName,
        chequeNumber: payment.chequeNumber,
        chequeDate: payment.chequeDate,
        chequeStatus: payment.chequeNumber ? 'Pending' : 'N/A',
        paymentDate: receiptDate || new Date(),
        collectedBy,
        feeHeadAllocations,
        organisationId,
      }], { session });
      transactionIds.push(tx[0]._id);
    }

    // 3. Create receipt
    const [receipt] = await Receipt.create([{
      receiptNumber,
      receiptType: 'Fee',
      studentId,
      academicYearId,
      totalAmount,
      receiptDate: receiptDate || new Date(),
      issuedBy: collectedBy,
      status: RECEIPT_STATUS.GENERATED,
      linkedTransactions: transactionIds,
      paymentBreakdown: payments.map(p => ({
        paymentModeId: p.paymentModeId,
        paymentModeName: p.paymentModeName,
        amount: p.amount,
        reference: p.reference,
      })),
      remarks,
      organisationId,
    }], { session });

    // 4. Link receipt to transactions
    await PaymentTransaction.updateMany(
      { _id: { $in: transactionIds } },
      { receiptId: receipt._id, receiptDate: receipt.receiptDate },
      { session }
    );

    // 5. Create ledger entry (single credit entry per receipt)
    const ledgerEntry = await createLedgerEntry({
      studentId, academicYearId,
      entryType: LEDGER_ENTRY_TYPE.FEE_PAYMENT,
      creditAmount: totalAmount,
      sourceType: 'receipt',
      sourceId: receipt._id,
      receiptId: receipt._id,
      receiptNumber,
      paymentModeName: payments.length === 1 ? payments[0].paymentModeName : 'Split Payment',
      particulars: `Fee Payment | Receipt: ${receiptNumber}`,
      remarks,
      createdBy: collectedBy,
      organisationId,
    });

    // 6. Update receipt with ledger entry
    await Receipt.findByIdAndUpdate(receipt._id, { linkedLedgerEntries: [ledgerEntry._id] }, { session });

    // 7. Update fee assignment totals
    await StudentFeeAssignment.findByIdAndUpdate(
      feeAssignmentId,
      { $inc: { totalPaid: totalAmount, totalDue: -totalAmount } },
      { session }
    );

    await session.commitTransaction();
    return { receipt, transactions: transactionIds };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

/**
 * Cancel a receipt — creates reversal ledger entry. Never overwrites.
 */
const cancelReceipt = async ({ receiptId, reason, cancelledBy, organisationId }) => {
  const receipt = await Receipt.findById(receiptId);
  if (!receipt) throw new Error('Receipt not found.');
  if (receipt.status !== RECEIPT_STATUS.GENERATED) {
    throw new Error(`Cannot cancel receipt with status: ${receipt.status}`);
  }

  // Get linked ledger entries to reverse
  const ledgerEntries = await StudentLedgerEntry.find({ receiptId });

  const reversalEntries = [];
  for (const entry of ledgerEntries) {
    const reversal = await createReversalEntry({
      originalEntry: entry,
      reason,
      createdBy: cancelledBy,
      receiptId: receipt._id,
      receiptNumber: receipt.receiptNumber,
    });
    reversalEntries.push(reversal._id);
  }

  // Update receipt status — DO NOT delete
  await Receipt.findByIdAndUpdate(receiptId, {
    status: RECEIPT_STATUS.CANCELLED,
    cancellationReason: reason,
    cancelledBy,
    cancelledAt: new Date(),
    reversalLedgerEntryId: reversalEntries[0],
  });

  // Update payment transactions to Cancelled
  await PaymentTransaction.updateMany(
    { _id: { $in: receipt.linkedTransactions } },
    { status: PAYMENT_STATUS.CANCELLED }
  );

  return { success: true, message: 'Receipt cancelled and reversal entries created.' };
};

module.exports = { collectFee, cancelReceipt };
