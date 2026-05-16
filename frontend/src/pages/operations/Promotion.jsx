import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { HiOutlineArrowCircleUp, HiOutlinePlus, HiOutlineCheck } from 'react-icons/hi';

export default function Promotion() {
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ fromAcademicYearId: '', toAcademicYearId: '', fromClassId: '', toClassId: '' });

  useEffect(() => { load(); loadMetadata(); }, []);
  const load = async () => { try { const { data } = await api.get('/promotion'); setBatches(data.data || []); } catch {} };
  const loadMetadata = async () => {
    try {
      const [c, y] = await Promise.all([api.get('/setup/classes'), api.get('/setup/academic-years')]);
      setClasses(c.data.data || []); setAcademicYears(y.data.data || []);
    } catch {}
  };

  const createBatch = async (e) => {
    e.preventDefault();
    try {
      await api.post('/promotion', form);
      setShowModal(false); load();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const statusColors = { Pending: 'badge-warning', Submitted: 'badge-info', Approved: 'badge-primary', Applied: 'badge-success' };

  return (
    <div>
      <div className="page-header"><div><h1>Promotion</h1><p>Promote students to next academic year/class</p></div><button className="btn btn-primary" onClick={()=>setShowModal(true)}><HiOutlinePlus /> New Promotion Batch</button></div>
      <div className="card"><div className="table-container"><table><thead><tr><th>Batch Info</th><th>From Year</th><th>To Year</th><th>From Class</th><th>To Class</th><th>Status</th><th>Actions</th></tr></thead><tbody>
        {batches.map(b => (
          <tr key={b._id}>
            <td style={{fontWeight:600}}>{b.promotionName || 'Promotion Batch'}</td>
            <td>{b.fromAcademicYearId?.label}</td>
            <td>{b.toAcademicYearId?.label}</td>
            <td>{b.fromClassId?.name}</td>
            <td>{b.toClassId?.name}</td>
            <td><span className={`badge ${statusColors[b.status]}`}>{b.status}</span></td>
            <td><button className="btn btn-sm btn-outline">View</button></td>
          </tr>
        ))}
        {!batches.length && <tr><td colSpan={7} className="empty-state">No promotion batches found.</td></tr>}
      </tbody></table></div></div>

      {showModal && (
        <div className="modal-overlay" onClick={()=>setShowModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
          <div className="modal-header"><h3>New Promotion Batch</h3><button className="modal-close" onClick={()=>setShowModal(false)}>×</button></div>
          <form onSubmit={createBatch}>
            <div className="form-row">
              <div className="form-group"><label>From Academic Year *</label><select className="form-control" value={form.fromAcademicYearId} onChange={e=>setForm({...form,fromAcademicYearId:e.target.value})} required><option value="">Select Year</option>{academicYears.map(y=><option key={y._id} value={y._id}>{y.label}</option>)}</select></div>
              <div className="form-group"><label>To Academic Year *</label><select className="form-control" value={form.toAcademicYearId} onChange={e=>setForm({...form,toAcademicYearId:e.target.value})} required><option value="">Select Year</option>{academicYears.map(y=><option key={y._id} value={y._id}>{y.label}</option>)}</select></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>From Class *</label><select className="form-control" value={form.fromClassId} onChange={e=>setForm({...form,fromClassId:e.target.value})} required><option value="">Select Class</option>{classes.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
              <div className="form-group"><label>To Class *</label><select className="form-control" value={form.toClassId} onChange={e=>setForm({...form,toClassId:e.target.value})} required><option value="">Select Class</option>{classes.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
            </div>
            <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">Create Batch</button></div>
          </form>
        </div></div>
      )}
    </div>
  );
}
