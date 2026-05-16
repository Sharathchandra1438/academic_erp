import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineUserGroup, HiOutlineAcademicCap, HiOutlineCash,
  HiOutlineReceiptRefund, HiOutlineClipboardList, HiOutlineDocumentText,
} from 'react-icons/hi';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ students: 0, enquiries: 0, receipts: 0, collection: 0 });

  useEffect(() => {
    // Load dashboard stats (gracefully handle missing endpoints)
    const load = async () => {
      try {
        const [students, enquiries, receipts] = await Promise.allSettled([
          api.get('/students?limit=1'),
          api.get('/enquiries?limit=1'),
          api.get('/receipts?limit=1'),
        ]);
        setStats({
          students: students.value?.data?.total || 0,
          enquiries: enquiries.value?.data?.total || 0,
          receipts: receipts.value?.data?.total || 0,
          collection: 0,
        });
      } catch {}
    };
    load();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Welcome back, {user?.name?.split(' ')[0] || 'Admin'} 👋</h1>
          <p>Here's what's happening with your institution today.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary"><HiOutlineUserGroup /></div>
          <div className="stat-info">
            <h4>Total Students</h4>
            <div className="stat-value">{stats.students}</div>
            <div className="stat-sub">Active this year</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning"><HiOutlineClipboardList /></div>
          <div className="stat-info">
            <h4>Enquiries</h4>
            <div className="stat-value">{stats.enquiries}</div>
            <div className="stat-sub">Total enquiries</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success"><HiOutlineCash /></div>
          <div className="stat-info">
            <h4>Receipts</h4>
            <div className="stat-value">{stats.receipts}</div>
            <div className="stat-sub">Generated</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon info"><HiOutlineReceiptRefund /></div>
          <div className="stat-info">
            <h4>Collection</h4>
            <div className="stat-value">₹{stats.collection.toLocaleString('en-IN')}</div>
            <div className="stat-sub">This month</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-header"><h3>Quick Actions</h3></div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <a href="/admission/enquiries" className="btn btn-primary"><HiOutlineClipboardList /> New Enquiry</a>
            <a href="/fee/collection" className="btn btn-success"><HiOutlineCash /> Collect Fee</a>
            <a href="/admission/students" className="btn btn-secondary"><HiOutlineAcademicCap /> View Students</a>
            <a href="/reports" className="btn btn-outline"><HiOutlineDocumentText /> Reports</a>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3>System Info</h3></div>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr><td style={{ fontWeight: 600 }}>Version</td><td>V1.0.0</td></tr>
              <tr><td style={{ fontWeight: 600 }}>User</td><td>{user?.name}</td></tr>
              <tr><td style={{ fontWeight: 600 }}>Role</td><td>{user?.role?.name || 'Admin'}</td></tr>
              <tr><td style={{ fontWeight: 600 }}>Email</td><td>{user?.email}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
