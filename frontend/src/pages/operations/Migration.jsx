import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { HiOutlineUpload, HiOutlineDownload, HiOutlineCheck } from 'react-icons/hi';

export default function Migration() {
  const [batches, setBatches] = useState([]);
  const [file, setFile] = useState(null);
  const [type, setType] = useState('student_master');
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);
  const load = async () => { try { const { data } = await api.get('/migration'); setBatches(data.data || []); } catch {} };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('migrationType', type);
    try {
      await api.post('/migration/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert('File uploaded and validated successfully!');
      setFile(null);
      load();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  };

  const statusColors = { 'Preview Ready': 'badge-info', Imported: 'badge-success', 'Error Found': 'badge-danger', 'Rolled Back': 'badge-gray' };

  return (
    <div>
      <div className="page-header"><div><h1>Data Migration</h1><p>Bulk import students and historical fee data</p></div></div>
      
      <div style={{display:'grid', gridTemplateColumns:'1fr 350px', gap:24}}>
        <div className="card">
          <h3>Upload Data</h3>
          <form onSubmit={handleUpload} style={{marginTop:20}}>
            <div className="form-group"><label>Migration Type</label><select className="form-control" value={type} onChange={e=>setType(e.target.value)}><option value="student_master">Student Master</option><option value="opening_fee_balance">Opening Fee Balance</option><option value="previous_receipt">Historical Receipts</option></select></div>
            <div className="form-group"><label>Excel File (.xlsx)</label><input type="file" className="form-control" accept=".xlsx" onChange={e=>setFile(e.target.files[0])} required /></div>
            <div style={{display:'flex', gap:10, marginTop:10}}>
              <button type="submit" className="btn btn-primary" disabled={loading || !file}>{loading ? 'Uploading...' : <><HiOutlineUpload /> Upload & Validate</>}</button>
              <a href={`http://localhost:5000/api/migration/template/${type}`} className="btn btn-outline" target="_blank" rel="noreferrer"><HiOutlineDownload /> Template</a>
            </div>
          </form>
        </div>

        <div className="card">
          <h3>Recent Batches</h3>
          <div style={{marginTop:16}}>
            {batches.map(b => (
              <div key={b._id} style={{padding:12, background:'var(--gray-50)', borderRadius:8, marginBottom:10}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}><strong>{b.migrationType}</strong> <span className={`badge ${statusColors[b.status]}`}>{b.status}</span></div>
                <div style={{fontSize:12, color:'var(--gray-500)', marginTop:4}}>{b.sourceFileName}</div>
                <div style={{fontSize:12, color:'var(--gray-500)'}}>{new Date(b.createdAt).toLocaleString('en-IN')}</div>
                <div style={{display:'flex', gap:10, marginTop:8}}>{b.status === 'Preview Ready' && <button className="btn btn-sm btn-success" style={{width:'100%'}}>Import Now</button>}</div>
              </div>
            ))}
            {!batches.length && <div className="empty-state" style={{padding:20}}>No migration batches.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
