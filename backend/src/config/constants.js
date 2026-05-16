// Application-wide constants

const PAYMENT_STATUS = {
  DRAFT: 'Draft',
  INITIATED: 'Initiated',
  PENDING: 'Pending',
  SUCCESS: 'Success',
  FAILED: 'Failed',
  VERIFIED: 'Verified',
  RECONCILED: 'Reconciled',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
  BOUNCED: 'Bounced',
  REVERSED: 'Reversed',
};

const RECEIPT_STATUS = {
  GENERATED: 'Generated',
  CANCELLED: 'Cancelled',
  REVERSED: 'Reversed',
  REFUNDED: 'Refunded',
};

const FEE_STATUS = {
  NOT_ASSIGNED: 'Not Assigned',
  ASSIGNED: 'Assigned',
  PARTIALLY_PAID: 'Partially Paid',
  FULLY_PAID: 'Fully Paid',
  DUE: 'Due',
  ADVANCE: 'Advance',
  WRITTEN_OFF: 'Written Off',
  REFUNDED: 'Refunded',
  ASSIGNMENT_PENDING: 'Fee Assignment Pending',
};

const ACADEMIC_STATUS = {
  APPLICANT: 'Applicant',
  ADMITTED: 'Admitted',
  ACTIVE: 'Active',
  PROMOTED: 'Promoted',
  HELD: 'Held',
  DEMOTED: 'Demoted',
  TRANSFERRED: 'Transferred',
  DISCONTINUED: 'Discontinued',
  PASSED_OUT: 'Passed Out',
  ALUMNI: 'Alumni',
};

const ADMISSION_STATUS = {
  ENQUIRY: 'Enquiry',
  FORM_SOLD: 'Form Sold',
  FORM_SUBMITTED: 'Form Submitted',
  UNDER_REVIEW: 'Under Review',
  DOCUMENT_PENDING: 'Document Pending',
  DOCUMENT_REJECTED: 'Document Rejected',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  ADMITTED: 'Admitted',
  CANCELLED: 'Cancelled',
};

const PIPELINE_STAGE_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected',
  SKIPPED: 'Skipped',
  FAILED: 'Failed',
  OVERRIDDEN: 'Overridden',
};

const PIPELINE_TYPE = {
  ADMISSION: 'Admission',
  FEE: 'Fee',
  PROMOTION: 'Promotion',
  FEE_RECONFIGURATION: 'Fee Reconfiguration',
  DATA_MIGRATION: 'Data Migration',
  BONAFIDE: 'Bonafide',
  TC: 'TC',
};

const MIGRATION_STATUS = {
  TEMPLATE_GENERATED: 'Template Generated',
  UPLOADED: 'Uploaded',
  VALIDATING: 'Validating',
  ERROR_FOUND: 'Error Found',
  PREVIEW_READY: 'Preview Ready',
  IMPORTED: 'Imported',
  ROLLED_BACK: 'Rolled Back',
  LOCKED: 'Locked',
};

const PROMOTION_STATUS = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  APPROVED: 'Approved',
  APPLIED: 'Applied',
  CANCELLED: 'Cancelled',
  ROLLED_BACK: 'Rolled Back',
  PARTIALLY_FAILED: 'Partially Failed',
};

const PROMOTION_DECISION = {
  PROMOTE: 'Promote',
  HOLD: 'Hold',
  DEMOTE: 'Demote',
  TRANSFER_OUT: 'Transfer Out',
  DISCONTINUE: 'Discontinue',
  PASSED_OUT: 'Passed Out',
  PENDING: 'Pending',
};

const PAYMENT_MODE_TYPE = {
  CASH: 'Cash',
  BANK: 'Bank',
  ONLINE: 'Online',
  ADJUSTMENT: 'Adjustment',
};

const LEDGER_ENTRY_TYPE = {
  FEE_ASSIGNED: 'Fee Assigned',
  FEE_PAYMENT: 'Fee Payment',
  RECEIPT_CANCELLATION: 'Receipt Cancellation',
  REVERSAL: 'Reversal',
  CARRYFORWARD_DUE: 'Carryforward Due',
  CARRYFORWARD_ADVANCE: 'Carryforward Advance',
  CONCESSION: 'Concession',
  SCHOLARSHIP: 'Scholarship',
  FINE: 'Fine',
  REFUND: 'Refund',
  ADJUSTMENT: 'Adjustment',
  OPENING_BALANCE: 'Opening Balance',
  MIGRATION_BALANCE: 'Migration Balance',
};

const RECEIPT_TYPE = {
  APPLICATION: 'Application',
  FEE: 'Fee',
  MISCELLANEOUS: 'Miscellaneous',
  REFUND: 'Refund',
};

const DEFAULT_FEE_PRIORITY = [
  'Previous Year Due',
  'Admission Fee',
  'Tuition Fee',
  'Transport Fee',
  'Exam Fee',
  'Fine',
];

module.exports = {
  PAYMENT_STATUS,
  RECEIPT_STATUS,
  FEE_STATUS,
  ACADEMIC_STATUS,
  ADMISSION_STATUS,
  PIPELINE_STAGE_STATUS,
  PIPELINE_TYPE,
  MIGRATION_STATUS,
  PROMOTION_STATUS,
  PROMOTION_DECISION,
  PAYMENT_MODE_TYPE,
  LEDGER_ENTRY_TYPE,
  RECEIPT_TYPE,
  DEFAULT_FEE_PRIORITY,
};
