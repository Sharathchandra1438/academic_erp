import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { HiOutlinePlus, HiOutlineX, HiOutlineEye, HiOutlineTrash } from 'react-icons/hi';

export default function FeeStructures() {
  const [structures, setStructures] = useState([]);
  const [heads, setHeads] = useState([]);
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', academicYearId: '', classId: '', items: [] });

  useEffect(() => { load(); loadMetadata(); }, []);
  const load = async () => { try { const { data } = await api.get('/fee-structures'); setStructures(data.data || []); } catch {} };
  const loadMetadata = async () => {
    try {
      const [h, c, y] = await Promise.all([api.get('/fee-heads'), api.get('/setup/classes'), api.get('/setup/academic-years')]);
      setHeads(h.data.data || []); setClasses(c.data.data || []); setAcademicYears(y.data.data || []);
    } catch {}
  };

  const addItem = () => { setForm({ ...form, items: [...form.items, { feeHeadId: '', amount: 0 }] }); };
  const removeItem = (index) => { const items = [...form.items]; items.splice(index, 1); setForm({ ...form, items }); };
  const updateItem = (index, field, value) => { const items = [...form.items]; items[index][field] = value; setForm({ ...form, items }); };

  const totalAmount = form.items.reduce((s, item) => s + (Number(item.amount) || 0), 0);

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.post('/fee-structures', { ...form, totalAmount });
      setShowModal(false); load();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <div>
      <div className="page-header"><div><h1>Fee Structures</h1><p>Design class-wise fee plans</p></div><button className="btn btn-primary" onClick={()=>{setForm({ name: '', academicYearId: '', classId: '', items: [] });setShowModal(true)}}><HiOutlinePlus /> Create Structure</button></div>
      <div className="card"><div className="table-container"><table><thead><tr><th>Structure Name</th><th>Class</th><th>Academic Year</th><th>Total Amount</th><th>Items</th><th>Actions</th></tr></thead><tbody>
        {structures.map(s => (
          <tr key={s._id}>
            <td style={{fontWeight:600}}>{s.name}</td>
            <td>{s.classId?.name||'-'}</td>
            <td>{s.academicYearId?.label||'-'}</td>
            <td style={{fontWeight:700, color:'var(--primary-600)'}}>₹{s.totalAmount?.toLocaleString('en-IN')}</td>
            <td>{s.items?.length || 0} Heads</td>
            <td><button className="btn btn-sm btn-outline"><HiOutlineEye /></button></td>
          </tr>
        ))}
        {!structures.length && <tr><td colSpan={6} className="empty-state">No fee structures defined yet.</td></tr>}
      </tbody></table></div></div>

      {showModal && (
        <div className="modal-overlay" onClick={()=>setShowModal(false)}><div className="modal" style={{minWidth:600}} onClick={e=>e.stopPropagation()}>
          <div className="modal-header"><h3>Create Fee Structure</h3><button className="modal-close" onClick={()=>setShowModal(false)}><HiOutlineX/></button></div>
          <form onSubmit={save}>
            <div className="form-group"><label>Structure Name *</label><input className="form-control" placeholder="Annual Fee 2026-27" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
            <div className="form-row">
              <div className="form-group"><label>Academic Year *</label><select className="form-control" value={form.academicYearId} onChange={e=>setForm({...form,academicYearId:e.target.value})} required><option value="">Select Year</option>{academicYears.map(y=><option key={y._id} value={y._id}>{y.label}</option>)}</select></div>
              <div className="form-group"><label>Class *</label><select className="form-control" value={form.classId} onChange={e=>setForm({...form,classId:e.target.value})} required><option value="">Select Class</option>{classes.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
            </div>
            
            <div style={{marginTop:20, borderTop:'1px solid var(--border)', paddingTop:16}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:12}}><strong>Fee Components</strong><button type="button" className="btn btn-sm btn-outline" onClick={addItem}><HiOutlinePlus /> Add Component</button></div>
              {form.items.map((item, idx) => (
                <div key={idx} className="form-row" style={{marginBottom:8}}>
                  <div style={{flex:2}}><select className="form-control" value={item.feeHeadId} onChange={e=>updateItem(idx, 'feeHeadId', e.target.value)} required><option value="">Select Fee Head</option>{heads.map(h=><option key={h._id} value={h._id}>{h.name}</option>)}</select></div>
                  <div style={{flex:1}}><input type="number" className="form-control" placeholder="Amount" value={item.amount} onChange={e=>updateItem(idx, 'amount', Number(e.target.value))} required /></div>
                  <button type="button" className="btn btn-icon btn-outline btn-danger" onClick={()=>removeItem(idx)}><HiOutlineX /></button>
                </div>
              ))}
              {form.items.length === 0 && <div style={{textAlign:'center', padding:20, background:'var(--gray-50)', borderRadius:8, color:'var(--gray-500)', fontSize:13}}>No components added yet.</div>}
              <div style={{display:'flex', justifyContent:'flex-end', marginTop:16, fontWeight:800, fontSize:16, color:'var(--primary-700)'}}>Total Amount: ₹{totalAmount.toLocaleString('en-IN')}</div>
            </div>

            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button><button type="submit" className="btn btn-primary" disabled={form.items.length === 0}>Save Structure</button></div>
          </form>
        </div></div>
      )}
    </div>
  );
}
