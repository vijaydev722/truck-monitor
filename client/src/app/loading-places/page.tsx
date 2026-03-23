"use client";

import { useEffect, useState } from 'react';

type LoadingPlace = {
  _id: string;
  name: string;
  address: string;
  contactName: string;
  createdAt: string;
};

export default function LoadingPlacesPage() {
  const [places, setPlaces] = useState<LoadingPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contactName, setContactName] = useState('');

  const fetchPlaces = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/loading-places`);
      if (res.ok) {
        const data = await res.json();
        setPlaces(data);
      }
    } catch (error) {
      console.error('Failed to fetch loading places:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleAddPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/loading-places`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address, contactName }),
      });
      if (res.ok) {
        setShowForm(false);
        setName('');
        setAddress('');
        setContactName('');
        fetchPlaces();
      }
    } catch (error) {
      console.error('Failed to add loading place:', error);
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
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Loading Places</h1>
          <p className="text-slate-500 mt-1">Manage pickup and drop-off locations</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
        >
          {showForm ? 'Close Form' : '+ Add New Location'}
        </button>
      </header>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-bold mb-4">Add a New Loading Place</h2>
          <form onSubmit={handleAddPlace} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="e.g. Warehouse A"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Address</label>
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="123 Industrial Pkwy"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
              <input 
                type="text" 
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="e.g. Jane Doe"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-900 text-white p-2.5 rounded-lg font-medium transition-colors h-[46px]"
            >
              Save Location
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {places.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-500 text-lg">No locations found. Add your first loading place to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium text-sm">
                  <th className="px-6 py-4">Location Name</th>
                  <th className="px-6 py-4">Address</th>
                  <th className="px-6 py-4">Contact Person</th>
                  <th className="px-6 py-4">Added On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {places.map(place => (
                  <tr key={place._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{place.name}</td>
                    <td className="px-6 py-4 text-slate-600">{place.address}</td>
                    <td className="px-6 py-4 text-slate-600">{place.contactName || '-'}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(place.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
