import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);
  const load = async () => {
    setLoading(true);
    try { const { data } = await api.get('/audit'); setLogs(data.data || []); }
    catch {}
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header"><div><h1>Audit Logs</h1><p>System-wide activity tracking for accountability</p></div></div>
      <div className="card">
        {loading ? <div className="loading"><div className="spinner" /></div> : (
          <div className="table-container"><table><thead><tr><th>User</th><th>Action</th><th>Module</th><th>Date</th><th>IP Address</th></tr></thead><tbody>
            {logs.map(l => (
              <tr key={l._id}>
                <td style={{fontWeight:600}}>{l.userName || 'System'}</td>
                <td><span className="badge badge-gray">{l.action}</span></td>
                <td>{l.module}</td>
                <td>{new Date(l.timestamp).toLocaleString('en-IN')}</td>
                <td style={{fontSize:12}}>{l.ipAddress}</td>
              </tr>
            ))}
            {!logs.length && <tr><td colSpan={5} className="empty-state">No audit logs found.</td></tr>}
          </tbody></table></div>
        )}
      </div>
    </div>
  );
}
