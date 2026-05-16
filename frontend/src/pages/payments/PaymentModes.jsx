import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { HiOutlinePlus, HiOutlineX } from 'react-icons/hi';

export default function PaymentModes() {
  const [modes, setModes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', modeType: 'Cash', referenceRequired: false, needsVerification: false });

  useEffect(() => { load(); }, []);
  const load = async () => { try { const { data } = await api.get('/payment-modes'); setModes(data.data || []); } catch {} };

  const save = async (e) => {
    e.preventDefault();
    try { await api.post('/payment-modes', form); setShowModal(false); load(); } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <div>
      <div className="page-header"><div><h1>Payment Modes</h1><p>Configure Cash, Bank, UPI, Cheque settings</p></div><button className="btn btn-primary" onClick={()=>{setForm({ name: '', code: '', modeType: 'Cash', referenceRequired: false, needsVerification: false });setShowModal(true)}}><HiOutlinePlus /> Add Mode</button></div>
      <div className="card"><div className="table-container"><table><thead><tr><th>Name</th><th>Code</th><th>Type</th><th>Ref Required</th><th>Verification</th></tr></thead><tbody>
        {modes.map(m => <tr key={m._id}><td style={{fontWeight:600}}>{m.name}</td><td>{m.code}</td><td><span className="badge badge-info">{m.modeType}</span></td><td>{m.referenceRequired ? 'Yes' : 'No'}</td><td>{m.needsVerification ? 'Yes' : 'No'}</td></tr>)}
        {!modes.length && <tr><td colSpan={5} className="empty-state">No payment modes configured.</td></tr>}
      </tbody></table></div></div>

      {showModal && (
        <div className="modal-overlay" onClick={()=>setShowModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
          <div className="modal-header"><h3>Add Payment Mode</h3><button className="modal-close" onClick={()=>setShowModal(false)}><HiOutlineX/></button></div>
          <form onSubmit={save}>
            <div className="form-group"><label>Name *</label><input className="form-control" placeholder="HDFC Bank" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
            <div className="form-row"><div className="form-group"><label>Code *</label><input className="form-control" placeholder="HDFC" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} required /></div><div className="form-group"><label>Type</label><select className="form-control" value={form.modeType} onChange={e=>setForm({...form,modeType:e.target.value})}><option>Cash</option><option>Bank</option><option>Online</option></select></div></div>
            <div className="form-row">
              <div className="form-group" style={{display:'flex',alignItems:'center',gap:8,paddingTop:24}}><input type="checkbox" checked={form.referenceRequired} onChange={e=>setForm({...form,referenceRequired:e.target.checked})} /> <label style={{marginBottom:0}}>Ref Required?</label></div>
              <div className="form-group" style={{display:'flex',alignItems:'center',gap:8,paddingTop:24}}><input type="checkbox" checked={form.needsVerification} onChange={e=>setForm({...form,needsVerification:e.target.checked})} /> <label style={{marginBottom:0}}>Needs Verification?</label></div>
            </div>
            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">Save Mode</button></div>
          </form>
        </div></div>
      )}
    </div>
  );
}
