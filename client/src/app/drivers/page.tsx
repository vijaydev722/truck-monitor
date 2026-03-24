"use client";

import { useEffect, useState } from 'react';

type Driver = {
  _id: string;
  personal_info?: {
    full_name: string;
    phone: string;
  };
  compliance?: {
    license?: { number: string };
  };
  current_status?: {
    state: 'idle' | 'on_trip' | 'off_duty' | 'suspended';
  };
  createdAt: string;
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'on_trip' | 'off_duty' | 'suspended'>('idle');

  const fetchDrivers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/drivers`);
      if (res.ok) {
        const data = await res.json();
        setDrivers(data);
      }
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/drivers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, licenseNumber, phone, status }),
      });
      if (res.ok) {
        setShowForm(false);
        setName('');
        setLicenseNumber('');
        setPhone('');
        setStatus('idle');
        fetchDrivers();
      }
    } catch (error) {
      console.error('Failed to add driver:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'on_trip': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'off_duty': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Drivers</h1>
          <p className="text-slate-500 mt-1">Manage fleet drivers and their statuses</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
        >
          {showForm ? 'Close Form' : '+ Add New Driver'}
        </button>
      </header>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-bold mb-4">Add a New Driver</h2>
          <form onSubmit={handleAddDriver} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="e.g. John Smith"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">License Number</label>
              <input 
                type="text" 
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="DL12345678"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input 
                type="text" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="(555) 987-6543"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="idle">Idle</option>
                <option value="on_trip">On Trip</option>
                <option value="off_duty">Off Duty</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <button 
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-900 text-white p-2.5 rounded-lg font-medium transition-colors h-[46px]"
            >
              Save Driver
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center">
            <p className="text-slate-500 text-lg">No drivers found. Add your first driver to get started.</p>
          </div>
        ) : (
          drivers.map(driver => (
            <div key={driver._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-xl uppercase">
                    {driver.personal_info?.full_name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{driver.personal_info?.full_name || 'Unknown'}</h3>
                    <p className="text-sm font-mono text-slate-500">{driver.compliance?.license?.number || 'No License'}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border uppercase ${getStatusColor(driver.current_status?.state || 'idle')}`}>
                  {(driver.current_status?.state || 'idle').replace('_', ' ')}
                </span>
              </div>
              
              <div className="space-y-2 mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center text-sm text-slate-600">
                  <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  {driver.personal_info?.phone || 'No phone provided'}
                </div>
                <div className="flex items-center text-sm text-slate-500">
                  <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/></svg>
                  Joined {new Date(driver.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
