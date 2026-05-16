import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { HiOutlinePlus, HiOutlineX, HiOutlinePhone, HiOutlineChat } from 'react-icons/hi';

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(null);
  const [form, setForm] = useState({});
  const [followUpForm, setFollowUpForm] = useState({ note: '', status: '' });
  const [filter, setFilter] = useState('');

  useEffect(() => { load(); loadClasses(); }, []);
  const load = async () => { try { const { data } = await api.get(`/enquiries${filter ? `?status=${filter}` : ''}`); setEnquiries(data.data || []); } catch {} };
  const loadClasses = async () => { try { const { data } = await api.get('/setup/classes'); setClasses(data.data || []); } catch {} };
  useEffect(() => { load(); }, [filter]);

  const save = async (e) => {
    e.preventDefault();
    try { await api.post('/enquiries', form); setShowModal(false); load(); } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };
  const addFollowUp = async (e) => {
    e.preventDefault();
    try { await api.post(`/enquiries/${showFollowUp._id}/follow-up`, followUpForm); setShowFollowUp(null); load(); } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const statusColors = { New: 'badge-info', Contacted: 'badge-primary', Interested: 'badge-success', 'Not Interested': 'badge-danger', 'Form Sold': 'badge-warning', Converted: 'badge-success', Lost: 'badge-gray' };

  return (
    <div>
      <div className="page-header"><div><h1>Enquiries</h1><p>Track and manage admission enquiries</p></div><button className="btn btn-primary" onClick={()=>{setForm({});setShowModal(true)}}><HiOutlinePlus /> New Enquiry</button></div>
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {['', 'New', 'Contacted', 'Interested', 'Not Interested', 'Form Sold'].map(s => (
          <button key={s} className={`btn btn-sm ${filter===s?'btn-primary':'btn-outline'}`} onClick={()=>setFilter(s)}>{s || 'All'}</button>
        ))}
      </div>
      <div className="card"><div className="table-container"><table><thead><tr><th>Candidate</th><th>Parent</th><th>Mobile</th><th>Class</th><th>Source</th><th>Status</th><th>Actions</th></tr></thead><tbody>
        {enquiries.map(e => <tr key={e._id}><td style={{fontWeight:600}}>{e.candidateName}</td><td>{e.parentName}</td><td>{e.parentMobile}</td><td>{e.interestedClass?.name||'-'}</td><td>{e.source}</td><td><span className={`badge ${statusColors[e.status]||'badge-gray'}`}>{e.status}</span></td><td><button className="btn btn-sm btn-outline" onClick={()=>{setShowFollowUp(e);setFollowUpForm({note:'',status:''})}}><HiOutlineChat /> Follow Up</button></td></tr>)}
        {!enquiries.length && <tr><td colSpan={7} className="empty-state">No enquiries found</td></tr>}
      </tbody></table></div></div>

      {showModal && (
        <div className="modal-overlay" onClick={()=>setShowModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
          <div className="modal-header"><h3>New Enquiry</h3><button className="modal-close" onClick={()=>setShowModal(false)}><HiOutlineX/></button></div>
          <form onSubmit={save}>
            <div className="form-row"><div className="form-group"><label>Candidate Name *</label><input className="form-control" value={form.candidateName||''} onChange={e=>setForm({...form,candidateName:e.target.value})} required /></div><div className="form-group"><label>Gender</label><select className="form-control" value={form.gender||''} onChange={e=>setForm({...form,gender:e.target.value})}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></div></div>
            <div className="form-row"><div className="form-group"><label>Parent Name *</label><input className="form-control" value={form.parentName||''} onChange={e=>setForm({...form,parentName:e.target.value})} required /></div><div className="form-group"><label>Mobile *</label><input className="form-control" value={form.parentMobile||''} onChange={e=>setForm({...form,parentMobile:e.target.value})} required /></div></div>
            <div className="form-row"><div className="form-group"><label>Interested Class</label><select className="form-control" value={form.interestedClass||''} onChange={e=>setForm({...form,interestedClass:e.target.value})}><option value="">Select</option>{classes.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}</select></div><div className="form-group"><label>Source</label><select className="form-control" value={form.source||'Walk-in'} onChange={e=>setForm({...form,source:e.target.value})}><option>Walk-in</option><option>Phone</option><option>Website</option><option>Social Media</option><option>Referral</option></select></div></div>
            <div className="form-group"><label>Remarks</label><textarea className="form-control" value={form.remarks||''} onChange={e=>setForm({...form,remarks:e.target.value})} /></div>
            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">Create Enquiry</button></div>
          </form>
        </div></div>
      )}

      {showFollowUp && (
        <div className="modal-overlay" onClick={()=>setShowFollowUp(null)}><div className="modal" onClick={e=>e.stopPropagation()}>
          <div className="modal-header"><h3>Follow Up — {showFollowUp.candidateName}</h3><button className="modal-close" onClick={()=>setShowFollowUp(null)}><HiOutlineX/></button></div>
          {showFollowUp.followUpNotes?.length > 0 && <div style={{marginBottom:16,maxHeight:150,overflowY:'auto'}}>{showFollowUp.followUpNotes.map((n,i)=><div key={i} style={{padding:'8px 12px',background:'var(--gray-50)',borderRadius:8,marginBottom:6,fontSize:13}}><strong>{new Date(n.date).toLocaleDateString('en-IN')}</strong>: {n.note}</div>)}</div>}
          <form onSubmit={addFollowUp}>
            <div className="form-group"><label>Note *</label><textarea className="form-control" value={followUpForm.note} onChange={e=>setFollowUpForm({...followUpForm,note:e.target.value})} required /></div>
            <div className="form-group"><label>Update Status</label><select className="form-control" value={followUpForm.status} onChange={e=>setFollowUpForm({...followUpForm,status:e.target.value})}><option value="">No Change</option><option>Contacted</option><option>Interested</option><option>Not Interested</option><option>Form Sold</option></select></div>
            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={()=>setShowFollowUp(null)}>Cancel</button><button type="submit" className="btn btn-primary">Add Follow Up</button></div>
          </form>
        </div></div>
      )}
    </div>
  );
}
