import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  HiOutlineHome, HiOutlineOfficeBuilding, HiOutlineAcademicCap,
  HiOutlineUserGroup, HiOutlineClipboardList, HiOutlineDocumentText,
  HiOutlineCash, HiOutlineCreditCard, HiOutlineReceiptRefund,
  HiOutlineChartBar, HiOutlineUpload, HiOutlineShieldCheck,
  HiOutlineArrowCircleUp, HiOutlineIdentification, HiOutlineBell,
  HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight,
  HiOutlineCog, HiOutlineDocumentDuplicate, HiOutlineBookOpen,
} from 'react-icons/hi';

const navSections = [
  {
    title: 'Overview',
    items: [
      { path: '/', icon: HiOutlineHome, label: 'Dashboard' },
    ],
  },
  {
    title: 'Administration',
    items: [
      { path: '/setup/organisation', icon: HiOutlineOfficeBuilding, label: 'Organisation' },
      { path: '/setup/academic', icon: HiOutlineAcademicCap, label: 'Academic Setup' },
      { path: '/setup/users', icon: HiOutlineUserGroup, label: 'Users & Roles' },
      { path: '/setup/number-series', icon: HiOutlineCog, label: 'Number Series' },
    ],
  },
  {
    title: 'Admissions',
    items: [
      { path: '/admission/enquiries', icon: HiOutlineClipboardList, label: 'Enquiries' },
      { path: '/admission/applications', icon: HiOutlineDocumentText, label: 'Applications' },
      { path: '/admission/pipeline', icon: HiOutlineArrowCircleUp, label: 'Pipeline Board' },
      { path: '/admission/students', icon: HiOutlineIdentification, label: 'Students' },
    ],
  },
  {
    title: 'Fee Management',
    items: [
      { path: '/fee/heads', icon: HiOutlineBookOpen, label: 'Fee Heads' },
      { path: '/fee/structures', icon: HiOutlineDocumentDuplicate, label: 'Fee Structures' },
      { path: '/fee/collection', icon: HiOutlineCash, label: 'Fee Collection' },
      { path: '/fee/receipts', icon: HiOutlineReceiptRefund, label: 'Receipts' },
    ],
  },
  {
    title: 'Payments',
    items: [
      { path: '/payments/modes', icon: HiOutlineCreditCard, label: 'Payment Modes' },
      { path: '/payments/transactions', icon: HiOutlineCash, label: 'Transactions' },
      { path: '/payments/daily-closing', icon: HiOutlineShieldCheck, label: 'Daily Closing' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { path: '/promotion', icon: HiOutlineArrowCircleUp, label: 'Promotion' },
      { path: '/migration', icon: HiOutlineUpload, label: 'Data Migration' },
      { path: '/bonafide', icon: HiOutlineDocumentText, label: 'Bonafide' },
    ],
  },
  {
    title: 'Reports & Audit',
    items: [
      { path: '/reports', icon: HiOutlineChartBar, label: 'Reports' },
      { path: '/audit', icon: HiOutlineShieldCheck, label: 'Audit Logs' },
    ],
  },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-icon">E</div>
        <span className="brand-text">Academic ERP</span>
      </div>

      <nav className="sidebar-nav">
        {navSections.map((section, si) => (
          <div key={si}>
            <div className="nav-section-title">{section.title}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon className="nav-icon" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <button className="sidebar-toggle" onClick={onToggle}>
        {collapsed ? <HiOutlineChevronDoubleRight /> : <HiOutlineChevronDoubleLeft />}
      </button>
    </aside>
  );
}
