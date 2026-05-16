import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { HiOutlineBell, HiOutlineLogout } from 'react-icons/hi';

const pageTitles = {
  '/': 'Dashboard',
  '/setup/organisation': 'Organisation Setup',
  '/setup/academic': 'Academic Setup',
  '/setup/users': 'Users & Roles',
  '/setup/number-series': 'Number Series',
  '/admission/enquiries': 'Enquiries',
  '/admission/applications': 'Applications',
  '/admission/pipeline': 'Admission Pipeline',
  '/admission/students': 'Student Master',
  '/fee/heads': 'Fee Heads',
  '/fee/structures': 'Fee Structures',
  '/fee/collection': 'Fee Collection',
  '/fee/receipts': 'Receipts',
  '/payments/modes': 'Payment Modes',
  '/payments/transactions': 'Payment Transactions',
  '/payments/daily-closing': 'Daily Closing',
  '/promotion': 'Promotion',
  '/migration': 'Data Migration',
  '/bonafide': 'Bonafide Certificates',
  '/reports': 'Reports',
  '/audit': 'Audit Logs',
};

export default function Topbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Academic ERP';
  const initials = user?.name?.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'A';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2>{title}</h2>
      </div>
      <div className="topbar-right">
        <button className="btn btn-icon btn-outline" style={{ position: 'relative' }}>
          <HiOutlineBell size={18} />
        </button>
        <div className="topbar-user">
          <div className="topbar-avatar">{initials}</div>
          <div>
            <div className="user-name">{user?.name || 'Admin'}</div>
            <div className="user-role">{user?.role?.name || 'Super Admin'}</div>
          </div>
        </div>
        <button className="btn btn-icon btn-outline" onClick={logout} title="Logout">
          <HiOutlineLogout size={18} />
        </button>
      </div>
    </header>
  );
}
