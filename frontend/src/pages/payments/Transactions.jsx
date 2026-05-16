import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => { load(); }, []);
  const load = async () => { try { const { data } = await api.get('/payments/transactions'); setTransactions(data.data || []); } catch {} };

  const statusColors = { Success: 'badge-success', Pending: 'badge-warning', Verified: 'badge-info', Reconciled: 'badge-primary', Cancelled: 'badge-danger', Bounced: 'badge-danger' };

  return (
    <div>
      <div className="page-header"><div><h1>Transactions</h1><p>All payment transactions (Cash, UPI, Bank, etc.)</p></div></div>
      <div className="card"><div className="table-container"><table><thead><tr><th>TXN ID</th><th>Date</th><th>Student</th><th>Amount</th><th>Mode</th><th>Reference</th><th>Status</th></tr></thead><tbody>
        {transactions.map(t => (
          <tr key={t._id}>
            <td style={{fontSize:11}}>{t.transactionId?.substring(0,8)}...</td>
            <td>{new Date(t.paymentDate).toLocaleDateString('en-IN')}</td>
            <td>{t.studentId?.name} ({t.studentId?.admissionNumber})</td>
            <td style={{fontWeight:700}}>₹{t.amount.toLocaleString('en-IN')}</td>
            <td><span className="badge badge-gray">{t.paymentModeName}</span></td>
            <td style={{fontSize:12}}>{t.referenceNumber || '-'}</td>
            <td><span className={`badge ${statusColors[t.status]}`}>{t.status}</span></td>
          </tr>
        ))}
        {!transactions.length && <tr><td colSpan={7} className="empty-state">No transactions recorded.</td></tr>}
      </tbody></table></div></div>
    </div>
  );
}
