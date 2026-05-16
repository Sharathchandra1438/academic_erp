const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth.routes');
const setupRoutes = require('./routes/setup.routes');
const userRoutes = require('./routes/user.routes');
const roleRoutes = require('./routes/role.routes');
const enquiryRoutes = require('./routes/enquiry.routes');
const applicationRoutes = require('./routes/application.routes');
const pipelineRoutes = require('./routes/pipeline.routes');
const admissionRoutes = require('./routes/admission.routes');
const feeHeadRoutes = require('./routes/feeHead.routes');
const feeStructureRoutes = require('./routes/feeStructure.routes');
const repaymentModeRoutes = require('./routes/repaymentMode.routes');
const studentFeeRoutes = require('./routes/studentFee.routes');
const paymentModeRoutes = require('./routes/paymentMode.routes');
const receiptRoutes = require('./routes/receipt.routes');
const paymentRoutes = require('./routes/payment.routes');
const ledgerRoutes = require('./routes/ledger.routes');
const studentRoutes = require('./routes/student.routes');
const promotionRoutes = require('./routes/promotion.routes');
const migrationRoutes = require('./routes/migration.routes');
const reportRoutes = require('./routes/report.routes');
const auditRoutes = require('./routes/audit.routes');
const concessionRoutes = require('./routes/concession.routes');
const dailyClosingRoutes = require('./routes/dailyClosing.routes');
const bonafideRoutes = require('./routes/bonafide.routes');
const studentAppRoutes = require('./routes/studentApp.routes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/setup', setupRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/pipelines', pipelineRoutes);
app.use('/api/admission', admissionRoutes);
app.use('/api/fee-heads', feeHeadRoutes);
app.use('/api/fee-structures', feeStructureRoutes);
app.use('/api/repayment-modes', repaymentModeRoutes);
app.use('/api/student-fees', studentFeeRoutes);
app.use('/api/payment-modes', paymentModeRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/migrations', migrationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/concessions', concessionRoutes);
app.use('/api/daily-closing', dailyClosingRoutes);
app.use('/api/bonafide', bonafideRoutes);
app.use('/api/student-app', studentAppRoutes);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Academic ERP Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
