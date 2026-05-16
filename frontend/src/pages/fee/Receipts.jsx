import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { HiOutlineReceiptRefund, HiOutlinePrinter, HiOutlineXCircle } from 'react-icons/hi';

export default function Receipts() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);
  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get('/receipts'); setReceipts(data.data || []); }
    catch {}
    finally { setLoading(false); }
  };

  const cancel = async (id) => {
    const reason = window.prompt('Reason for cancellation:');
    if (!reason) return;
    try {
      await api.put(`/receipts/${id}/cancel`, { reason });
      alert('Receipt cancelled and ledger reversed.');
      load();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const statusColors = { Generated: 'badge-success', Cancelled: 'badge-danger' };

  return (
    <div>
      <div className="page-header"><div><h1>Receipts</h1><p>View and manage all fee receipts</p></div></div>
      <div className="card">
        {loading ? <div className="loading"><div className="spinner" /></div> : (
          <div className="table-container"><table><thead><tr><th>Receipt No.</th><th>Date</th><th>Student</th><th>Amount</th><th>Status</th><th>Issued By</th><th>Actions</th></tr></thead><tbody>
            {receipts.map(r => (
              <tr key={r._id}>
                <td style={{fontWeight:600}}>{r.receiptNumber}</td>
                <td>{new Date(r.receiptDate).toLocaleDateString('en-IN')}</td>
                <td>{r.studentId?.name} ({r.studentId?.admissionNumber})</td>
                <td style={{fontWeight:700}}>₹{r.totalAmount.toLocaleString('en-IN')}</td>
                <td><span className={`badge ${statusColors[r.status]}`}>{r.status}</span></td>
                <td>{r.issuedBy?.name}</td>
                <td>
                  <div style={{display:'flex', gap:8}}>
                    <button className="btn btn-sm btn-outline"><HiOutlinePrinter /> Print</button>
                    {r.status === 'Generated' && <button className="btn btn-sm btn-outline btn-danger" onClick={()=>cancel(r._id)}><HiOutlineXCircle /> Cancel</button>}
                  </div>
                </td>
              </tr>
            ))}
            {!receipts.length && <tr><td colSpan={7} className="empty-state">No receipts found.</td></tr>}
          </tbody></table></div>
        )}
      </div>
    </div>
  );
}
