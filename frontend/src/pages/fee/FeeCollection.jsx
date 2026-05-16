import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { HiOutlineSearch, HiOutlineCash, HiOutlineX } from 'react-icons/hi';

export default function FeeCollection() {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feeAssignment, setFeeAssignment] = useState(null);
  const [paymentModes, setPaymentModes] = useState([]);
  const [paymentForm, setPaymentForm] = useState({ amount: 0, paymentModeId: '', reference: '', remarks: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadPaymentModes(); }, []);
  const loadPaymentModes = async () => { try { const { data } = await api.get('/payment-modes'); setPaymentModes(data.data || []); } catch {} };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;
    try {
      const { data } = await api.get(`/students?search=${search}`);
      setStudents(data.data || []);
    } catch {}
  };

  const selectStudent = async (student) => {
    setSelectedStudent(student);
    setStudents([]);
    try {
      const { data } = await api.get(`/student-fee/${student._id}`);
      setFeeAssignment(data.data?.[0] || null); // Assuming one active assignment
    } catch {}
  };

  const collect = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !feeAssignment) return;
    setLoading(true);
    try {
      const payload = {
        studentId: selectedStudent._id,
        academicYearId: selectedStudent.currentAcademicYearId,
        feeAssignmentId: feeAssignment._id,
        payments: [{
          paymentModeId: paymentForm.paymentModeId,
          paymentModeName: paymentModes.find(m => m._id === paymentForm.paymentModeId)?.name,
          amount: Number(paymentForm.amount),
          reference: paymentForm.reference
        }],
        feeHeadAllocations: [], // Simplified for now
        remarks: paymentForm.remarks
      };
      await api.post('/receipts/collect', payload);
      alert('Fee collected successfully!');
      setSelectedStudent(null);
      setFeeAssignment(null);
      setPaymentForm({ amount: 0, paymentModeId: '', reference: '', remarks: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header"><div><h1>Fee Collection</h1><p>Record fee payments and generate receipts</p></div></div>
      
      {!selectedStudent ? (
        <div className="card" style={{maxWidth:600, margin:'0 auto'}}>
          <form onSubmit={handleSearch} style={{display:'flex', gap:10}}>
            <input className="form-control" placeholder="Search by name or admission number..." value={search} onChange={e=>setSearch(e.target.value)} />
            <button className="btn btn-primary"><HiOutlineSearch /> Search</button>
          </form>
          {students.length > 0 && (
            <div className="table-container" style={{marginTop:20}}>
              <table>
                <tbody>
                  {students.map(s => (
                    <tr key={s._id} style={{cursor:'pointer'}} onClick={()=>selectStudent(s)}>
                      <td style={{fontWeight:600}}>{s.name} ({s.admissionNumber})</td>
                      <td>{s.currentClassId?.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div style={{display:'grid', gridTemplateColumns:'1fr 400px', gap:24}}>
          <div className="card">
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:20}}>
              <h3>Student Info</h3>
              <button className="btn btn-icon btn-outline" onClick={()=>setSelectedStudent(null)}><HiOutlineX /></button>
            </div>
            <div className="form-row">
              <div><strong>Name:</strong> {selectedStudent.name}</div>
              <div><strong>Adm No:</strong> {selectedStudent.admissionNumber}</div>
              <div><strong>Class:</strong> {selectedStudent.currentClassId?.name}</div>
            </div>
            
            <div style={{marginTop:30}}>
              <h3>Fee Summary</h3>
              {feeAssignment ? (
                <div className="table-container" style={{marginTop:12}}>
                  <table>
                    <thead><tr><th>Fee Head</th><th>Assigned</th><th>Paid</th><th>Due</th></tr></thead>
                    <tbody>
                      {feeAssignment.feeHeads.map((h, i) => (
                        <tr key={i}><td>{h.feeHeadName}</td><td>₹{h.amount}</td><td>₹{h.paidAmount}</td><td style={{color:h.balanceAmount > 0 ? 'var(--danger)' : 'var(--success)'}}>₹{h.balanceAmount}</td></tr>
                      ))}
                      <tr style={{background:'var(--gray-50)', fontWeight:800}}>
                        <td>Total</td>
                        <td>₹{feeAssignment.totalAssigned}</td>
                        <td style={{color:'var(--success)'}}>₹{feeAssignment.totalPaid}</td>
                        <td style={{color:'var(--danger)'}}>₹{feeAssignment.totalDue}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : <div className="empty-state">No fee structure assigned to this student.</div>}
            </div>
          </div>

          <div className="card">
            <h3>Record Payment</h3>
            <form onSubmit={collect} style={{marginTop:20}}>
              <div className="form-group"><label>Amount to Collect *</label><input type="number" className="form-control" value={paymentForm.amount} onChange={e=>setPaymentForm({...paymentForm, amount: e.target.value})} required max={feeAssignment?.totalDue || 9999999} /></div>
              <div className="form-group"><label>Payment Mode *</label><select className="form-control" value={paymentForm.paymentModeId} onChange={e=>setPaymentForm({...paymentForm, paymentModeId: e.target.value})} required><option value="">Select Mode</option>{paymentModes.map(m=><option key={m._id} value={m._id}>{m.name}</option>)}</select></div>
              <div className="form-group"><label>Reference No.</label><input className="form-control" placeholder="TXN ID / Cheque No." value={paymentForm.reference} onChange={e=>setPaymentForm({...paymentForm, reference: e.target.value})} /></div>
              <div className="form-group"><label>Remarks</label><textarea className="form-control" value={paymentForm.remarks} onChange={e=>setPaymentForm({...paymentForm, remarks: e.target.value})} /></div>
              <button type="submit" className="btn btn-primary" style={{width:'100%', marginTop:10}} disabled={loading || !feeAssignment || paymentForm.amount <= 0}>
                {loading ? 'Processing...' : <><HiOutlineCash /> Collect ₹{paymentForm.amount || 0}</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
