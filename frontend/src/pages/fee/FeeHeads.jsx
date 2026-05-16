import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { HiOutlinePlus, HiOutlineX, HiOutlineTrash } from 'react-icons/hi';

export default function FeeHeads() {
  const [heads, setHeads] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', category: 'Academic', priority: 1, isOptional: false });

  useEffect(() => { load(); }, []);
  const load = async () => { try { const { data } = await api.get('/fee-heads'); setHeads(data.data || []); } catch {} };

  const save = async (e) => {
    e.preventDefault();
    try { await api.post('/fee-heads', form); setShowModal(false); load(); } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const deactivate = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this fee head?')) return;
    try { await api.delete(`/fee-heads/${id}`); load(); } catch {}
  };

  return (
    <div>
      <div className="page-header"><div><h1>Fee Heads</h1><p>Define all fee components (Tuition, Admission, Transport, etc.)</p></div><button className="btn btn-primary" onClick={()=>{setForm({ name: '', code: '', category: 'Academic', priority: 1, isOptional: false });setShowModal(true)}}><HiOutlinePlus /> Add Fee Head</button></div>
      <div className="card"><div className="table-container"><table><thead><tr><th>Priority</th><th>Name</th><th>Code</th><th>Category</th><th>Optional</th><th>Actions</th></tr></thead><tbody>
        {heads.map(h => <tr key={h._id}><td>{h.priority}</td><td style={{fontWeight:600}}>{h.name}</td><td>{h.code}</td><td><span className="badge badge-info">{h.category}</span></td><td>{h.isOptional ? 'Yes' : 'No'}</td><td><button className="btn btn-sm btn-outline btn-danger" onClick={()=>deactivate(h._id)}><HiOutlineTrash /></button></td></tr>)}
        {!heads.length && <tr><td colSpan={6} className="empty-state">No fee heads configured. Run the seed script first.</td></tr>}
      </tbody></table></div></div>

      {showModal && (
        <div className="modal-overlay" onClick={()=>setShowModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
          <div className="modal-header"><h3>Add Fee Head</h3><button className="modal-close" onClick={()=>setShowModal(false)}><HiOutlineX/></button></div>
          <form onSubmit={save}>
            <div className="form-group"><label>Name *</label><input className="form-control" placeholder="Tuition Fee" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
            <div className="form-row"><div className="form-group"><label>Code *</label><input className="form-control" placeholder="TF" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} required /></div><div className="form-group"><label>Category</label><select className="form-control" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Academic</option><option>Transport</option><option>Activities</option><option>Fine</option><option>Hostel</option><option>Other</option></select></div></div>
            <div className="form-row"><div className="form-group"><label>Priority (1 = Highest)</label><input type="number" className="form-control" value={form.priority} onChange={e=>setForm({...form,priority:Number(e.target.value)})} /></div><div className="form-group" style={{display:'flex',alignItems:'center',gap:8,paddingTop:24}}><input type="checkbox" checked={form.isOptional} onChange={e=>setForm({...form,isOptional:e.target.checked})} /> <label style={{marginBottom:0}}>Optional?</label></div></div>
            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">Save Head</button></div>
          </form>
        </div></div>
      )}
    </div>
  );
}
