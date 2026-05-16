import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { HiOutlinePlus, HiOutlineX, HiOutlineEye } from 'react-icons/hi';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => { load(); }, []);
  const load = async () => { try { const { data } = await api.get('/applications/candidates'); setApplications(data.data || []); } catch {} };

  const sellForm = async (e) => {
    e.preventDefault();
    try { await api.post('/applications/sales', form); setShowSaleModal(false); load(); } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const statusColors = { 'Form Sold':'badge-warning', 'Form Submitted':'badge-info', 'Under Review':'badge-primary', 'Document Pending':'badge-warning', Approved:'badge-success', Rejected:'badge-danger', Admitted:'badge-success' };

  return (
    <div>
      <div className="page-header"><div><h1>Applications</h1><p>Application forms and candidate tracking</p></div><button className="btn btn-primary" onClick={()=>{setForm({});setShowSaleModal(true)}}><HiOutlinePlus /> Sell Application</button></div>
      <div className="card"><div className="table-container"><table><thead><tr><th>App No.</th><th>Candidate</th><th>Parent</th><th>Class</th><th>Status</th><th>Date</th></tr></thead><tbody>
        {applications.map(a => <tr key={a._id}><td style={{fontWeight:600}}>{a.applicationNumber||'-'}</td><td>{a.candidateName}</td><td>{a.parentName}</td><td>{a.interestedClass?.name||'-'}</td><td><span className={`badge ${statusColors[a.status]||'badge-gray'}`}>{a.status}</span></td><td>{new Date(a.createdAt).toLocaleDateString('en-IN')}</td></tr>)}
        {!applications.length && <tr><td colSpan={6} className="empty-state">No applications yet</td></tr>}
      </tbody></table></div></div>

      {showSaleModal && (
        <div className="modal-overlay" onClick={()=>setShowSaleModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
          <div className="modal-header"><h3>Sell Application Form</h3><button className="modal-close" onClick={()=>setShowSaleModal(false)}><HiOutlineX/></button></div>
          <form onSubmit={sellForm}>
            <div className="form-row"><div className="form-group"><label>Candidate Name *</label><input className="form-control" value={form.candidateName||''} onChange={e=>setForm({...form,candidateName:e.target.value})} required /></div><div className="form-group"><label>Parent Name *</label><input className="form-control" value={form.parentName||''} onChange={e=>setForm({...form,parentName:e.target.value})} required /></div></div>
            <div className="form-row"><div className="form-group"><label>Mobile *</label><input className="form-control" value={form.parentMobile||''} onChange={e=>setForm({...form,parentMobile:e.target.value})} required /></div><div className="form-group"><label>Application Fee (₹)</label><input type="number" className="form-control" value={form.applicationFeeAmount||0} onChange={e=>setForm({...form,applicationFeeAmount:Number(e.target.value)})} /></div></div>
            <div className="form-group"><label>Payment Mode</label><select className="form-control" value={form.paymentMode||'Cash'} onChange={e=>setForm({...form,paymentMode:e.target.value})}><option>Cash</option><option>UPI</option><option>Card</option></select></div>
            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={()=>setShowSaleModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">Sell & Generate Receipt</button></div>
          </form>
        </div></div>
      )}
    </div>
  );
}
