import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineCheck, HiOutlineX } from 'react-icons/hi';

export default function AcademicSetup() {
  const [tab, setTab] = useState('years');
  const [years, setYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [mediums, setMediums] = useState([]);
  const [feeCategories, setFeeCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [form, setForm] = useState({});

  useEffect(() => { loadAll(); }, []);
  const loadAll = async () => {
    try {
      const [y, c, s, m, fc] = await Promise.all([
        api.get('/setup/academic-years'), api.get('/setup/classes'), api.get('/setup/sections'),
        api.get('/setup/mediums'), api.get('/setup/fee-categories'),
      ]);
      setYears(y.data.data || []); setClasses(c.data.data || []); setSections(s.data.data || []);
      setMediums(m.data.data || []); setFeeCategories(fc.data.data || []);
    } catch {}
  };

  const openModal = (type) => { setModalType(type); setForm({}); setShowModal(true); };

  const save = async (e) => {
    e.preventDefault();
    try {
      const endpoints = { years: '/setup/academic-years', classes: '/setup/classes', sections: '/setup/sections', mediums: '/setup/mediums', feeCategories: '/setup/fee-categories' };
      await api.post(endpoints[modalType], form);
      setShowModal(false); loadAll();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const activateYear = async (id) => {
    try { await api.put(`/setup/academic-years/${id}/activate`); loadAll(); } catch {}
  };

  const tabs = [
    { key: 'years', label: 'Academic Years' }, { key: 'classes', label: 'Classes' },
    { key: 'sections', label: 'Sections' }, { key: 'mediums', label: 'Mediums' },
    { key: 'feeCategories', label: 'Fee Categories' },
  ];

  return (
    <div>
      <div className="page-header">
        <div><h1>Academic Setup</h1><p>Configure academic years, classes, sections, mediums</p></div>
        <button className="btn btn-primary" onClick={() => openModal(tab)}><HiOutlinePlus /> Add New</button>
      </div>

      <div className="tabs">{tabs.map(t => <div key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</div>)}</div>

      <div className="card">
        {tab === 'years' && (
          <div className="table-container"><table><thead><tr><th>Label</th><th>Start Date</th><th>End Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>
            {years.map(y => <tr key={y._id}><td style={{fontWeight:600}}>{y.label}</td><td>{new Date(y.startDate).toLocaleDateString('en-IN')}</td><td>{new Date(y.endDate).toLocaleDateString('en-IN')}</td><td><span className={`badge ${y.isActive ? 'badge-success' : 'badge-gray'}`}>{y.isActive ? 'Active' : 'Inactive'}</span></td><td>{!y.isActive && <button className="btn btn-sm btn-outline" onClick={() => activateYear(y._id)}>Activate</button>}</td></tr>)}
            {!years.length && <tr><td colSpan={5} style={{textAlign:'center',padding:40,color:'#94a3b8'}}>No academic years configured</td></tr>}
          </tbody></table></div>
        )}
        {tab === 'classes' && (
          <div className="table-container"><table><thead><tr><th>Order</th><th>Name</th><th>Level</th><th>Status</th></tr></thead><tbody>
            {classes.map(c => <tr key={c._id}><td>{c.order}</td><td style={{fontWeight:600}}>{c.name}</td><td>{c.level || '-'}</td><td><span className="badge badge-success">Active</span></td></tr>)}
          </tbody></table></div>
        )}
        {tab === 'sections' && (
          <div className="table-container"><table><thead><tr><th>Section</th><th>Class</th><th>Capacity</th></tr></thead><tbody>
            {sections.map(s => <tr key={s._id}><td style={{fontWeight:600}}>{s.name}</td><td>{s.classId?.name || '-'}</td><td>{s.capacity || '-'}</td></tr>)}
          </tbody></table></div>
        )}
        {tab === 'mediums' && (
          <div className="table-container"><table><thead><tr><th>Medium</th><th>Status</th></tr></thead><tbody>
            {mediums.map(m => <tr key={m._id}><td style={{fontWeight:600}}>{m.name}</td><td><span className="badge badge-success">Active</span></td></tr>)}
          </tbody></table></div>
        )}
        {tab === 'feeCategories' && (
          <div className="table-container"><table><thead><tr><th>Category</th><th>Description</th><th>Status</th></tr></thead><tbody>
            {feeCategories.map(f => <tr key={f._id}><td style={{fontWeight:600}}>{f.name}</td><td>{f.description || '-'}</td><td><span className="badge badge-success">Active</span></td></tr>)}
          </tbody></table></div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Add {tabs.find(t=>t.key===modalType)?.label?.slice(0,-1)}</h3><button className="modal-close" onClick={() => setShowModal(false)}><HiOutlineX /></button></div>
            <form onSubmit={save}>
              {modalType === 'years' && <>
                <div className="form-group"><label>Label *</label><input className="form-control" placeholder="2026-27" value={form.label||''} onChange={e=>setForm({...form,label:e.target.value})} required /></div>
                <div className="form-row"><div className="form-group"><label>Start Date *</label><input type="date" className="form-control" value={form.startDate||''} onChange={e=>setForm({...form,startDate:e.target.value})} required /></div><div className="form-group"><label>End Date *</label><input type="date" className="form-control" value={form.endDate||''} onChange={e=>setForm({...form,endDate:e.target.value})} required /></div></div>
              </>}
              {modalType === 'classes' && <>
                <div className="form-group"><label>Name *</label><input className="form-control" placeholder="Class 6" value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
                <div className="form-row"><div className="form-group"><label>Order</label><input type="number" className="form-control" value={form.order||''} onChange={e=>setForm({...form,order:Number(e.target.value)})} /></div><div className="form-group"><label>Level</label><select className="form-control" value={form.level||''} onChange={e=>setForm({...form,level:e.target.value})}><option value="">Select</option><option>Pre-Primary</option><option>Primary</option><option>Secondary</option><option>Higher Secondary</option></select></div></div>
              </>}
              {modalType === 'sections' && <>
                <div className="form-group"><label>Section Name *</label><input className="form-control" placeholder="A" value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
                <div className="form-group"><label>Class *</label><select className="form-control" value={form.classId||''} onChange={e=>setForm({...form,classId:e.target.value})} required><option value="">Select Class</option>{classes.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
                <div className="form-group"><label>Capacity</label><input type="number" className="form-control" value={form.capacity||''} onChange={e=>setForm({...form,capacity:Number(e.target.value)})} /></div>
              </>}
              {modalType === 'mediums' && <div className="form-group"><label>Medium Name *</label><input className="form-control" placeholder="English" value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} required /></div>}
              {modalType === 'feeCategories' && <>
                <div className="form-group"><label>Category Name *</label><input className="form-control" placeholder="General" value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
                <div className="form-group"><label>Description</label><input className="form-control" value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})} /></div>
              </>}
              <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">Save</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
