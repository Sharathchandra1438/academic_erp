import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { HiOutlinePlus, HiOutlineX } from 'react-icons/hi';

export default function NumberSeriesSetup() {
  const [series, setSeries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ module: '', prefix: '', separator: '-', padding: 5, currentSeq: 0 });

  useEffect(() => { load(); }, []);
  const load = async () => { try { const { data } = await api.get('/setup/number-series'); setSeries(data.data || []); } catch {} };
  const save = async (e) => {
    e.preventDefault();
    try { await api.post('/setup/number-series', form); setShowModal(false); load(); } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <div>
      <div className="page-header"><div><h1>Number Series</h1><p>Configure unique number sequences for receipts, applications, students</p></div><button className="btn btn-primary" onClick={() => { setForm({ module:'', prefix:'', separator:'-', padding:5, currentSeq:0 }); setShowModal(true); }}><HiOutlinePlus /> Add Series</button></div>
      <div className="card"><div className="table-container"><table><thead><tr><th>Module</th><th>Prefix</th><th>Separator</th><th>Padding</th><th>Current Seq</th><th>Next Number</th></tr></thead><tbody>
        {series.map(s => { const next = `${s.prefix}${s.separator}${String(s.currentSeq + 1).padStart(s.padding, '0')}`; return (
          <tr key={s._id}><td><span className="badge badge-primary">{s.module}</span></td><td style={{fontWeight:600}}>{s.prefix}</td><td>{s.separator}</td><td>{s.padding}</td><td>{s.currentSeq}</td><td style={{fontWeight:600,color:'var(--primary-600)'}}>{next}</td></tr>
        ); })}
        {!series.length && <tr><td colSpan={6} style={{textAlign:'center',padding:40,color:'#94a3b8'}}>No number series configured. Run the seed script first.</td></tr>}
      </tbody></table></div></div>
      {showModal && (
        <div className="modal-overlay" onClick={()=>setShowModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
          <div className="modal-header"><h3>Add Number Series</h3><button className="modal-close" onClick={()=>setShowModal(false)}><HiOutlineX/></button></div>
          <form onSubmit={save}>
            <div className="form-group"><label>Module *</label><select className="form-control" value={form.module} onChange={e=>setForm({...form,module:e.target.value})} required><option value="">Select</option><option value="receipt">Receipt</option><option value="application_receipt">App Receipt</option><option value="application">Application</option><option value="student">Student</option><option value="enquiry">Enquiry</option><option value="bonafide">Bonafide</option></select></div>
            <div className="form-row"><div className="form-group"><label>Prefix *</label><input className="form-control" placeholder="FR" value={form.prefix} onChange={e=>setForm({...form,prefix:e.target.value})} required /></div><div className="form-group"><label>Separator</label><input className="form-control" value={form.separator} onChange={e=>setForm({...form,separator:e.target.value})} /></div><div className="form-group"><label>Padding</label><input type="number" className="form-control" value={form.padding} onChange={e=>setForm({...form,padding:Number(e.target.value)})} /></div></div>
            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">Save</button></div>
          </form>
        </div></div>
      )}
    </div>
  );
}
