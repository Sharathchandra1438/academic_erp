import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineOfficeBuilding } from 'react-icons/hi';

export default function OrganisationSetup() {
  const [org, setOrg] = useState(null);
  const [form, setForm] = useState({ name: '', code: '', address: '', city: '', state: '', pincode: '', phone: '', email: '', website: '', receiptHeader: '', principalName: '' });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadOrg(); }, []);
  const loadOrg = async () => {
    try { const { data } = await api.get('/setup/organisation'); if (data.data) { setOrg(data.data); setForm(data.data); } } catch {}
  };

  const save = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (org?._id) { await api.put(`/setup/organisation/${org._id}`, form); }
      else { await api.post('/setup/organisation', form); }
      setEditing(false); loadOrg();
    } catch (err) { alert(err.response?.data?.message || 'Error saving'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Organisation Setup</h1><p>Configure your institution details</p></div>
        {!editing && <button className="btn btn-primary" onClick={() => setEditing(true)}><HiOutlinePencil /> Edit</button>}
      </div>
      <div className="card">
        <form onSubmit={save}>
          <div className="form-row">
            <div className="form-group"><label>Institution Name *</label><input className="form-control" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} required disabled={!editing} /></div>
            <div className="form-group"><label>Code</label><input className="form-control" value={form.code || ''} onChange={e => setForm({...form, code: e.target.value})} disabled={!editing} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Email</label><input className="form-control" type="email" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} disabled={!editing} /></div>
            <div className="form-group"><label>Phone</label><input className="form-control" value={form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})} disabled={!editing} /></div>
          </div>
          <div className="form-group"><label>Address</label><input className="form-control" value={form.address || ''} onChange={e => setForm({...form, address: e.target.value})} disabled={!editing} /></div>
          <div className="form-row">
            <div className="form-group"><label>City</label><input className="form-control" value={form.city || ''} onChange={e => setForm({...form, city: e.target.value})} disabled={!editing} /></div>
            <div className="form-group"><label>State</label><input className="form-control" value={form.state || ''} onChange={e => setForm({...form, state: e.target.value})} disabled={!editing} /></div>
            <div className="form-group"><label>Pincode</label><input className="form-control" value={form.pincode || ''} onChange={e => setForm({...form, pincode: e.target.value})} disabled={!editing} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Receipt Header</label><input className="form-control" value={form.receiptHeader || ''} onChange={e => setForm({...form, receiptHeader: e.target.value})} disabled={!editing} /></div>
            <div className="form-group"><label>Principal Name</label><input className="form-control" value={form.principalName || ''} onChange={e => setForm({...form, principalName: e.target.value})} disabled={!editing} /></div>
          </div>
          <div className="form-group"><label>Website</label><input className="form-control" value={form.website || ''} onChange={e => setForm({...form, website: e.target.value})} disabled={!editing} /></div>
          {editing && (
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setEditing(false); if (org) setForm(org); }}>Cancel</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
