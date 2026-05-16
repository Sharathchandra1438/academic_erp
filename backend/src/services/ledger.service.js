const StudentLedgerEntry = require('../models/StudentLedgerEntry');
const { LEDGER_ENTRY_TYPE } = require('../config/constants');

/**
 * Get the current balance for a student in an academic year.
 * Balance = sum(debits) - sum(credits). Positive = Due, Negative = Advance.
 */
const getStudentBalance = async (studentId, academicYearId) => {
  const result = await StudentLedgerEntry.aggregate([
    { $match: { studentId: mongoose.Types.ObjectId(studentId), academicYearId: mongoose.Types.ObjectId(academicYearId) } },
    { $group: { _id: null, totalDebit: { $sum: '$debitAmount' }, totalCredit: { $sum: '$creditAmount' } } },
  ]);
  if (!result.length) return { totalDebit: 0, totalCredit: 0, balance: 0 };
  const { totalDebit, totalCredit } = result[0];
  return { totalDebit, totalCredit, balance: totalDebit - totalCredit };
};

/**
 * Get the last balance entry for running balance calculation.
 */
const getLastBalance = async (studentId, academicYearId) => {
  const last = await StudentLedgerEntry.findOne(
    { studentId, academicYearId },
    { balanceAfterEntry: 1 },
    { sort: { createdAt: -1 } }
  );
  return last ? last.balanceAfterEntry : 0;
};

/**
 * Create a ledger entry — APPEND ONLY.
 */
const createLedgerEntry = async ({
  studentId, academicYearId, entryType, debitAmount = 0, creditAmount = 0,
  feeHeadId, feeHeadName, sourceType, sourceId, receiptId, receiptNumber,
  paymentModeId, paymentModeName, particulars, remarks, createdBy, organisationId,
  isMigrated = false, migrationBatchId,
}) => {
  const mongoose = require('mongoose');
  const lastBalance = await getLastBalance(studentId, academicYearId);
  const balanceAfterEntry = lastBalance + debitAmount - creditAmount;

  const entry = await StudentLedgerEntry.create({
    studentId, academicYearId, entryType,
    debitAmount, creditAmount, balanceAfterEntry,
    feeHeadId, feeHeadName, sourceType, sourceId,
    receiptId, receiptNumber,
    paymentModeId, paymentModeName,
    particulars, remarks, createdBy, organisationId,
    isMigrated, migrationBatchId,
    entryDate: new Date(),
  });

  return entry;
};

/**
 * Create a reversal entry (for receipt cancellation).
 * Reversal mirrors the original entry with swapped debit/credit.
 */
const createReversalEntry = async ({ originalEntry, reason, createdBy, receiptId, receiptNumber }) => {
  return createLedgerEntry({
    studentId: originalEntry.studentId,
    academicYearId: originalEntry.academicYearId,
    entryType: LEDGER_ENTRY_TYPE.REVERSAL,
    debitAmount: originalEntry.creditAmount, // reverse
    creditAmount: originalEntry.debitAmount, // reverse
    feeHeadId: originalEntry.feeHeadId,
    feeHeadName: originalEntry.feeHeadName,
    sourceType: 'reversal',
    sourceId: originalEntry._id,
    receiptId,
    receiptNumber,
    paymentModeId: originalEntry.paymentModeId,
    paymentModeName: originalEntry.paymentModeName,
    particulars: `Reversal of: ${originalEntry.particulars} | Reason: ${reason}`,
    remarks: reason,
    createdBy,
    organisationId: originalEntry.organisationId,
  });
};

module.exports = { getStudentBalance, getLastBalance, createLedgerEntry, createReversalEntry };
