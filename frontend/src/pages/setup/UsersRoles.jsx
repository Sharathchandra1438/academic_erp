import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { HiOutlinePlus, HiOutlineX } from 'react-icons/hi';

export default function UsersRoles() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => { loadAll(); }, []);
  const loadAll = async () => {
    try {
      const [u, r] = await Promise.all([api.get('/users'), api.get('/roles')]);
      setUsers(u.data.data || []); setRoles(r.data.data || []);
    } catch {}
  };

  const saveUser = async (e) => {
    e.preventDefault();
    try { await api.post('/users', form); setShowModal(false); loadAll(); }
    catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const saveRole = async (e) => {
    e.preventDefault();
    try { await api.post('/roles', form); setShowModal(false); loadAll(); }
    catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Users & Roles</h1><p>Manage system users and access roles</p></div>
        <button className="btn btn-primary" onClick={() => { setForm({}); setShowModal(true); }}><HiOutlinePlus /> Add {tab === 'users' ? 'User' : 'Role'}</button>
      </div>
      <div className="tabs">
        <div className={`tab ${tab==='users'?'active':''}`} onClick={()=>setTab('users')}>Users</div>
        <div className={`tab ${tab==='roles'?'active':''}`} onClick={()=>setTab('roles')}>Roles</div>
      </div>
      <div className="card">
        {tab === 'users' && (
          <div className="table-container"><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th></tr></thead><tbody>
            {users.map(u => <tr key={u._id}><td style={{fontWeight:600}}>{u.name}</td><td>{u.email}</td><td>{u.phone||'-'}</td><td><span className="badge badge-primary">{u.roleId?.name||'-'}</span></td><td><span className={`badge ${u.isActive?'badge-success':'badge-danger'}`}>{u.isActive?'Active':'Inactive'}</span></td></tr>)}
          </tbody></table></div>
        )}
        {tab === 'roles' && (
          <div className="table-container"><table><thead><tr><th>Role</th><th>Permissions</th><th>Type</th></tr></thead><tbody>
            {roles.map(r => <tr key={r._id}><td style={{fontWeight:600}}>{r.name}</td><td>{r.permissions?.length || 0} permissions</td><td><span className={`badge ${r.isSystem?'badge-info':'badge-gray'}`}>{r.isSystem?'System':'Custom'}</span></td></tr>)}
          </tbody></table></div>
        )}
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3>Add {tab==='users'?'User':'Role'}</h3><button className="modal-close" onClick={()=>setShowModal(false)}><HiOutlineX/></button></div>
            {tab === 'users' ? (
              <form onSubmit={saveUser}>
                <div className="form-row"><div className="form-group"><label>Name *</label><input className="form-control" value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} required /></div><div className="form-group"><label>Email *</label><input type="email" className="form-control" value={form.email||''} onChange={e=>setForm({...form,email:e.target.value})} required /></div></div>
                <div className="form-row"><div className="form-group"><label>Password *</label><input type="password" className="form-control" value={form.password||''} onChange={e=>setForm({...form,password:e.target.value})} required /></div><div className="form-group"><label>Phone</label><input className="form-control" value={form.phone||''} onChange={e=>setForm({...form,phone:e.target.value})} /></div></div>
                <div className="form-group"><label>Role *</label><select className="form-control" value={form.roleId||''} onChange={e=>setForm({...form,roleId:e.target.value})} required><option value="">Select Role</option>{roles.map(r=><option key={r._id} value={r._id}>{r.name}</option>)}</select></div>
                <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">Create User</button></div>
              </form>
            ) : (
              <form onSubmit={saveRole}>
                <div className="form-group"><label>Role Name *</label><input className="form-control" value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
                <div className="form-group"><label>Description</label><input className="form-control" value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})} /></div>
                <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">Create Role</button></div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
