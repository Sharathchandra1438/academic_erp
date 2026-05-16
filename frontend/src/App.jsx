import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';

// Setup
import OrganisationSetup from './pages/setup/OrganisationSetup';
import AcademicSetup from './pages/setup/AcademicSetup';
import UsersRoles from './pages/setup/UsersRoles';
import NumberSeriesSetup from './pages/setup/NumberSeriesSetup';

// Admissions
import Enquiries from './pages/admission/Enquiries';
import Applications from './pages/admission/Applications';
import Students from './pages/admission/Students';

// Fee
import FeeHeads from './pages/fee/FeeHeads';
import FeeStructures from './pages/fee/FeeStructures';
import FeeCollection from './pages/fee/FeeCollection';
import Receipts from './pages/fee/Receipts';

// Payments
import PaymentModes from './pages/payments/PaymentModes';
import Transactions from './pages/payments/Transactions';
import DailyClosing from './pages/payments/DailyClosing';

// Ops
import Promotion from './pages/operations/Promotion';
import Migration from './pages/operations/Migration';

// Reports/Audit
import Reports from './pages/Reports';
import AuditLogs from './pages/AuditLogs';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            
            {/* Setup */}
            <Route path="setup/organisation" element={<OrganisationSetup />} />
            <Route path="setup/academic" element={<AcademicSetup />} />
            <Route path="setup/users" element={<UsersRoles />} />
            <Route path="setup/number-series" element={<NumberSeriesSetup />} />
            
            {/* Admission */}
            <Route path="admission/enquiries" element={<Enquiries />} />
            <Route path="admission/applications" element={<Applications />} />
            <Route path="admission/students" element={<Students />} />
            
            {/* Fee */}
            <Route path="fee/heads" element={<FeeHeads />} />
            <Route path="fee/structures" element={<FeeStructures />} />
            <Route path="fee/collection" element={<FeeCollection />} />
            <Route path="fee/receipts" element={<Receipts />} />
            
            {/* Payments */}
            <Route path="payments/modes" element={<PaymentModes />} />
            <Route path="payments/transactions" element={<Transactions />} />
            <Route path="payments/daily-closing" element={<DailyClosing />} />
            
            {/* Operations */}
            <Route path="promotion" element={<Promotion />} />
            <Route path="migration" element={<Migration />} />
            
            {/* Reports/Audit */}
            <Route path="reports" element={<Reports />} />
            <Route path="audit" element={<AuditLogs />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
