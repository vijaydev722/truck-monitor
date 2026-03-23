"use client";

import { useEffect, useState } from 'react';

type Truck = {
  _id: string;
  plateNumber: string;
  status: 'In Transit' | 'Idle' | 'Maintenance';
  location: string;
  lastUpdated: string;
};

export default function Home() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [plateNumber, setPlateNumber] = useState('');
  const [status, setStatus] = useState<'In Transit' | 'Idle' | 'Maintenance'>('Idle');
  const [location, setLocation] = useState('');

  const fetchTrucks = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trucks`);
      if (res.ok) {
        const data = await res.json();
        setTrucks(data);
      }
    } catch (error) {
      console.error('Failed to fetch trucks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrucks();
    // Poll every 5 seconds for updates
    const interval = setInterval(fetchTrucks, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddTruck = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trucks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plateNumber, status, location }),
      });
      if (res.ok) {
        setShowForm(false);
        setPlateNumber('');
        setLocation('');
        setStatus('Idle');
        fetchTrucks();
      }
    } catch (error) {
      console.error('Failed to add truck:', error);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trucks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchTrucks();
    } catch (error) {
      console.error('Failed to update truck status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Transit': return 'bg-green-100 text-green-800 border-green-200';
      case 'Idle': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Maintenance': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Fleet Monitor</h1>
            <p className="text-slate-500 mt-1">Real-time truck tracking and status dashboard</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
          >
            {showForm ? 'Close Form' : '+ Add New Truck'}
          </button>
        </header>

        {/* Add Truck Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-xl font-bold mb-4">Add a New Truck</h2>
            <form onSubmit={handleAddTruck} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Plate Number</label>
                <input 
                  type="text" 
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  className="w-full border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g. TRK-492"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g. Warehouse A"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="Idle">Idle</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <button 
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-900 text-white p-2.5 rounded-lg font-medium transition-colors h-[46px]"
              >
                Save Truck
              </button>
            </form>
          </div>
        )}

        {/* Trucks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trucks.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center">
              <p className="text-slate-500 text-lg">No trucks found. Add your first truck to monitor.</p>
            </div>
          ) : (
            trucks.map(truck => (
              <div key={truck._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Plate</span>
                    <h3 className="text-2xl font-bold font-mono text-slate-800">{truck.plateNumber}</h3>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(truck.status)}`}>
                    {truck.status}
                  </span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-slate-600">
                    <svg className="w-5 h-5 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {truck.location}
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                    <svg className="w-5 h-5 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Updated: {new Date(truck.lastUpdated).toLocaleTimeString()}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Quick Update Status</label>
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdateStatus(truck._id, 'In Transit')} className="flex-1 text-xs py-1.5 rounded-md bg-green-50 text-green-700 hover:bg-green-100 font-medium transition-colors">In Transit</button>
                    <button onClick={() => handleUpdateStatus(truck._id, 'Idle')} className="flex-1 text-xs py-1.5 rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100 font-medium transition-colors">Idle</button>
                    <button onClick={() => handleUpdateStatus(truck._id, 'Maintenance')} className="flex-1 text-xs py-1.5 rounded-md bg-red-50 text-red-700 hover:bg-red-100 font-medium transition-colors">Maintenance</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
