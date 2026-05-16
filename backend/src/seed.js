require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Organisation = require('./models/Organisation');
const AcademicYear = require('./models/AcademicYear');
const Class = require('./models/Class');
const Section = require('./models/Section');
const Medium = require('./models/Medium');
const FeeCategory = require('./models/FeeCategory');
const NumberSeries = require('./models/NumberSeries');
const Role = require('./models/Role');
const User = require('./models/User');
const PaymentMode = require('./models/PaymentMode');
const FeeHead = require('./models/FeeHead');

const seed = async () => {
  await connectDB();
  console.log('🌱 Seeding database...');

  // Clear existing
  await Promise.all([Organisation.deleteMany(), AcademicYear.deleteMany(), Class.deleteMany(), Section.deleteMany(), Medium.deleteMany(), FeeCategory.deleteMany(), NumberSeries.deleteMany(), Role.deleteMany(), User.deleteMany(), PaymentMode.deleteMany(), FeeHead.deleteMany()]);

  // 1. Organisation
  const org = await Organisation.create({ name: 'Demo School', code: 'DEMO', address: '123 Education Lane', city: 'Hyderabad', state: 'Telangana', pincode: '500001', phone: '9876543210', email: 'admin@demoschool.com', receiptHeader: 'DEMO SCHOOL', certificateHeader: 'DEMO SCHOOL - Certificate', principalName: 'Dr. Principal Kumar', currency: 'INR' });

  // 2. Academic Year
  const ay = await AcademicYear.create({ label: '2026-27', startDate: new Date('2026-06-01'), endDate: new Date('2027-03-31'), isActive: true, organisationId: org._id });

  // 3. Classes
  const classNames = ['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
  const classes = [];
  for (let i = 0; i < classNames.length; i++) {
    const c = await Class.create({ name: classNames[i], order: i + 1, level: i < 3 ? 'Pre-Primary' : i < 8 ? 'Primary' : 'Secondary', organisationId: org._id });
    classes.push(c);
  }

  // 4. Sections for each class
  for (const cls of classes) {
    await Section.create([{ name: 'A', classId: cls._id, organisationId: org._id, capacity: 40 }, { name: 'B', classId: cls._id, organisationId: org._id, capacity: 40 }]);
  }

  // 5. Mediums
  await Medium.create([{ name: 'English', organisationId: org._id }, { name: 'Telugu', organisationId: org._id }, { name: 'Hindi', organisationId: org._id }]);

  // 6. Fee Categories
  await FeeCategory.create([{ name: 'General', organisationId: org._id }, { name: 'Staff Ward', organisationId: org._id }, { name: 'SC/ST', organisationId: org._id }, { name: 'Scholarship', organisationId: org._id }]);

  // 7. Roles
  const superAdminRole = await Role.create({ name: 'Super Admin', isSystem: true, organisationId: org._id, permissions: [{ module: '*', action: '*', description: 'Full access' }] });
  const adminRole = await Role.create({ name: 'Institution Admin', isSystem: true, organisationId: org._id, permissions: [{ module: 'setup', action: '*' }, { module: 'admission', action: '*' }, { module: 'fee', action: '*' }, { module: 'student', action: '*' }, { module: 'report', action: '*' }] });
  await Role.create({ name: 'Admission Staff', organisationId: org._id, permissions: [{ module: 'admission', action: 'create' }, { module: 'admission', action: 'read' }, { module: 'enquiry', action: '*' }] });
  await Role.create({ name: 'Accountant', organisationId: org._id, permissions: [{ module: 'fee', action: '*' }, { module: 'payment', action: '*' }, { module: 'receipt', action: '*' }, { module: 'report', action: 'read' }] });
  await Role.create({ name: 'Principal', organisationId: org._id, permissions: [{ module: '*', action: 'read' }, { module: 'admission', action: 'approve' }, { module: 'promotion', action: 'approve' }] });

  // 8. Users
  await User.create({ name: 'Super Admin', email: 'admin@demo.com', passwordHash: 'admin123', roleId: superAdminRole._id, organisationId: org._id, phone: '9876543210' });
  await User.create({ name: 'Institution Admin', email: 'inst@demo.com', passwordHash: 'admin123', roleId: adminRole._id, organisationId: org._id, phone: '9876543211' });

  // 9. Number Series
  const modules = ['receipt', 'application_receipt', 'application', 'student', 'enquiry', 'bonafide'];
  const prefixes = ['FR', 'AR', 'APP', 'STU', 'ENQ', 'BF'];
  for (let i = 0; i < modules.length; i++) {
    await NumberSeries.create({ module: modules[i], prefix: prefixes[i], separator: '-', currentSeq: 0, padding: 5, resetOnAcademicYear: true, academicYearId: ay._id, organisationId: org._id });
  }

  // 10. Payment Modes
  const paymentModes = [
    { name: 'Cash', code: 'CASH', modeType: 'Cash' },
    { name: 'UPI', code: 'UPI', modeType: 'Online', referenceRequired: true },
    { name: 'Bank Transfer', code: 'NEFT', modeType: 'Bank', referenceRequired: true, bankNameRequired: true },
    { name: 'Cheque', code: 'CHQ', modeType: 'Bank', referenceRequired: true, bankNameRequired: true, needsVerification: true },
    { name: 'Card', code: 'CARD', modeType: 'Bank', referenceRequired: true },
    { name: 'DD', code: 'DD', modeType: 'Bank', referenceRequired: true, bankNameRequired: true },
  ];
  for (const pm of paymentModes) {
    await PaymentMode.create({ ...pm, organisationId: org._id });
  }

  // 11. Fee Heads
  const feeHeads = [
    { name: 'Tuition Fee', code: 'TF', category: 'Academic', priority: 1 },
    { name: 'Admission Fee', code: 'AF', category: 'Academic', priority: 2 },
    { name: 'Exam Fee', code: 'EF', category: 'Academic', priority: 3 },
    { name: 'Library Fee', code: 'LF', category: 'Academic', priority: 4 },
    { name: 'Transport Fee', code: 'TRNF', category: 'Transport', priority: 5 },
    { name: 'Lab Fee', code: 'LAB', category: 'Academic', priority: 6 },
    { name: 'Fine', code: 'FINE', category: 'Fine', priority: 10 },
  ];
  for (const fh of feeHeads) {
    await FeeHead.create({ ...fh, organisationId: org._id });
  }

  console.log('✅ Seed complete!');
  console.log('');
  console.log('📧 Login credentials:');
  console.log('   Admin: admin@demo.com / admin123');
  console.log('   Institution Admin: inst@demo.com / admin123');
  process.exit(0);
};

seed().catch(err => { console.error('Seed error:', err); process.exit(1); });
