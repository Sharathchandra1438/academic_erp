import { useState, useEffect } from 'react';
import api from '../api/axios';
import { HiOutlineChartBar, HiOutlineCash, HiOutlineUserGroup, HiOutlineClock } from 'react-icons/hi';

export default function Reports() {
  const reports = [
    { title: 'Collection Report', desc: 'Daily/Date-wise collection summary', icon: HiOutlineCash, path: '/reports/collection' },
    { title: 'Due Report', desc: 'Class-wise pending fee details', icon: HiOutlineClock, path: '/reports/dues' },
    { title: 'Student List', desc: 'Detailed student demographic report', icon: HiOutlineUserGroup, path: '/reports/students' },
    { title: 'Cashbook', desc: 'Only cash transaction summary', icon: HiOutlineCash, path: '/reports/cashbook' },
    { title: 'Bankbook', desc: 'Non-cash transaction summary', icon: HiOutlineChartBar, path: '/reports/bankbook' },
  ];

  return (
    <div>
      <div className="page-header"><div><h1>Reports</h1><p>Generate and export institution data</p></div></div>
      <div className="stats-grid" style={{gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))'}}>
        {reports.map((r, i) => (
          <div key={i} className="card" style={{cursor:'pointer', transition:'all 0.2s', hover:{transform:'translateY(-5px)', boxShadow:'var(--shadow-md)'}}}>
            <div style={{display:'flex', gap:16}}>
              <div className="stat-icon primary" style={{width:60, height:60, fontSize:28}}><r.icon /></div>
              <div>
                <h3 style={{fontSize:18}}>{r.title}</h3>
                <p style={{color:'var(--gray-500)', fontSize:14, marginTop:4}}>{r.desc}</p>
                <button className="btn btn-sm btn-primary" style={{marginTop:12}}>View Report</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
