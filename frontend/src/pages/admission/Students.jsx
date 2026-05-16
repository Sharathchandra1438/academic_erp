import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { HiOutlineSearch, HiOutlineEye } from 'react-icons/hi';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => { load(); loadClasses(); }, []);
  useEffect(() => { load(); }, [search, classFilter]);

  const load = async () => {
    try {
      let url = '/students?limit=50';
      if (search) url += `&search=${search}`;
      if (classFilter) url += `&classId=${classFilter}`;
      const { data } = await api.get(url);
      setStudents(data.data || []);
    } catch {}
  };
  const loadClasses = async () => { try { const { data } = await api.get('/setup/classes'); setClasses(data.data || []); } catch {} };
  const loadDetail = async (id) => { try { const { data } = await api.get(`/students/${id}`); setSelected(data.data); } catch {} };

  const statusColors = { Admitted:'badge-success', Active:'badge-success', Promoted:'badge-info', Held:'badge-warning', Transferred:'badge-gray', Discontinued:'badge-danger', 'Passed Out':'badge-primary' };

  return (
    <div>
      <div className="page-header"><div><h1>Student Master</h1><p>View and manage all students</p></div></div>
      <div style={{ display:'flex', gap:12, marginBottom:16 }}>
        <div style={{ flex:1, position:'relative' }}><HiOutlineSearch style={{ position:'absolute', left:12, top:11, color:'var(--gray-400)' }} /><input className="form-control" placeholder="Search by name or admission number..." style={{ paddingLeft:36 }} value={search} onChange={e=>setSearch(e.target.value)} /></div>
        <select className="form-control" style={{width:180}} value={classFilter} onChange={e=>setClassFilter(e.target.value)}><option value="">All Classes</option>{classes.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}</select>
      </div>
      <div className="card"><div className="table-container"><table><thead><tr><th>Adm No.</th><th>Name</th><th>Class</th><th>Section</th><th>Status</th><th>Actions</th></tr></thead><tbody>
        {students.map(s => <tr key={s._id}><td style={{fontWeight:600}}>{s.admissionNumber}</td><td>{s.name}</td><td>{s.currentClassId?.name||'-'}</td><td>{s.currentSectionId?.name||'-'}</td><td><span className={`badge ${statusColors[s.academicStatus]||'badge-gray'}`}>{s.academicStatus}</span></td><td><button className="btn btn-sm btn-outline" onClick={()=>loadDetail(s._id)}><HiOutlineEye /> View</button></td></tr>)}
        {!students.length && <tr><td colSpan={6} className="empty-state">No students found</td></tr>}
      </tbody></table></div></div>

      {selected && (
        <div className="modal-overlay" onClick={()=>setSelected(null)}><div className="modal" style={{minWidth:600}} onClick={e=>e.stopPropagation()}>
          <div className="modal-header"><h3>{selected.student?.name} — {selected.student?.admissionNumber}</h3><button className="modal-close" onClick={()=>setSelected(null)}>×</button></div>
          <div className="form-row"><div><strong>Class:</strong> {selected.student?.currentClassId?.name}</div><div><strong>Section:</strong> {selected.student?.currentSectionId?.name}</div><div><strong>Status:</strong> <span className={`badge ${statusColors[selected.student?.academicStatus]||''}`}>{selected.student?.academicStatus}</span></div></div>
          <div style={{marginTop:16}}><strong>DOB:</strong> {selected.student?.dob ? new Date(selected.student.dob).toLocaleDateString('en-IN') : '-'} | <strong>Gender:</strong> {selected.student?.gender||'-'}</div>
          {selected.student?.guardians?.length > 0 && <div style={{marginTop:12}}><strong>Guardian:</strong> {selected.student.guardians[0]?.name} ({selected.student.guardians[0]?.relation}) — {selected.student.guardians[0]?.phone}</div>}
          {selected.academicHistory?.length > 0 && <div style={{marginTop:16}}><h4 style={{marginBottom:8}}>Academic History</h4><div className="table-container"><table><thead><tr><th>Year</th><th>Class</th><th>Decision</th></tr></thead><tbody>{selected.academicHistory.map((h,i)=><tr key={i}><td>{h.academicYearId?.label||'-'}</td><td>{h.classId?.name||'-'}</td><td>{h.promotionDecision||'-'}</td></tr>)}</tbody></table></div></div>}
        </div></div>
      )}
    </div>
  );
}
