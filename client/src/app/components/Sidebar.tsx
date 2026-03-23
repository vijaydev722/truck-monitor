"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);

  const links = [
    { name: 'Trucks', href: '/', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/> },
    { name: 'Clients', href: '/clients', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/> },
    { name: 'Loading Places', href: '/loading-places', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/> },
    { name: 'Drivers', href: '/drivers', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/> },
    { name: 'Shipments', href: '/shipments', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/> },
    { name: 'Invoices', href: '/invoices', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/> }
  ];

  return (
    <div className={`${isExpanded ? 'w-64' : 'w-20'} transition-all duration-300 bg-slate-900 border-r border-slate-800 text-white flex flex-col min-h-screen relative p-4 space-y-6 flex-shrink-0`}>
      <div className={`flex items-center ${isExpanded ? 'justify-between' : 'justify-center'} mb-6`}>
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex-shrink-0 flex items-center justify-center font-bold text-lg">T</div>
          {isExpanded && <span className="text-xl font-extrabold tracking-tight whitespace-nowrap">FleetPro</span>}
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
        >
          <svg className={`w-5 h-5 transform transition-transform duration-300 ${isExpanded ? 'rotate-0' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 space-y-2 relative">
        {links.map((link) => (
          <Link 
            key={link.name} 
            href={link.href} 
            className={`flex items-center ${isExpanded ? 'px-3' : 'justify-center'} py-3 text-slate-300 hover:text-white rounded-lg group transition-colors hover:bg-slate-800 font-medium`}
            title={!isExpanded ? link.name : undefined}
          >
            <svg className="w-6 h-6 flex-shrink-0 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {link.icon}
            </svg>
            {isExpanded && <span className="ml-3 whitespace-nowrap">{link.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
