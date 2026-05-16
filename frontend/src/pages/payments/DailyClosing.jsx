import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { HiOutlineLockClosed, HiOutlineCalendar } from 'react-icons/hi';

export default function DailyClosing() {
  const [closings, setClosings] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);
  const load = async () => { try { const { data } = await api.get('/payments/daily-closing'); setClosings(data.data || []); } catch {} };

  const performClosing = async () => {
    if (!window.confirm(`Are you sure you want to perform daily closing for ${date}? This will lock the day's collection.`)) return;
    setLoading(true);
    try {
      await api.post('/payments/daily-closing', { closingDate: date });
      alert('Daily closing completed and locked.');
      load();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header"><div><h1>Daily Closing</h1><p>Close and lock daily collection accounts</p></div></div>
      
      <div className="card" style={{marginBottom:24, maxWidth:400}}>
        <h3>New Closing</h3>
        <div className="form-group" style={{marginTop:16}}><label>Closing Date</label><input type="date" className="form-control" value={date} onChange={e=>setDate(e.target.value)} /></div>
        <button className="btn btn-primary" style={{width:'100%'}} onClick={performClosing} disabled={loading}>{loading ? 'Processing...' : <><HiOutlineLockClosed /> Perform Closing</>}</button>
      </div>

      <div className="card">
        <h3>Previous Closings</h3>
        <div className="table-container" style={{marginTop:16}}><table><thead><tr><th>Date</th><th>Total</th><th>Cash</th><th>Bank/Online</th><th>Receipts</th><th>Closed By</th></tr></thead><tbody>
          {closings.map(c => (
            <tr key={c._id}>
              <td style={{fontWeight:600}}>{new Date(c.closingDate).toLocaleDateString('en-IN')}</td>
              <td style={{fontWeight:700}}>₹{c.totalCollected.toLocaleString('en-IN')}</td>
              <td>₹{c.cashCollection.toLocaleString('en-IN')}</td>
              <td>₹{c.bankCollection.toLocaleString('en-IN')}</td>
              <td>{c.receiptCount}</td>
              <td>{c.closedBy?.name}</td>
            </tr>
          ))}
          {!closings.length && <tr><td colSpan={6} className="empty-state">No previous closings found.</td></tr>}
        </tbody></table></div>
      </div>
    </div>
  );
}
