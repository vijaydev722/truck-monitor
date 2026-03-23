"use client";

import { useEffect, useState } from 'react';

type Shipment = {
  _id: string;
  trackingNumber: string;
  client: { _id: string; name: string };
  loadingPlace: { _id: string; name: string };
  deliveryAddress: string;
  truck?: { _id: string; plateNumber: string };
  driver?: { _id: string; name: string };
  status: 'Pending' | 'In Transit' | 'Delivered';
  price: number;
  createdAt: string;
};

// Types for form dropdowns
type Option = { _id: string; name?: string; plateNumber?: string };

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Dropdown data
  const [clients, setClients] = useState<Option[]>([]);
  const [places, setPlaces] = useState<Option[]>([]);
  const [trucks, setTrucks] = useState<Option[]>([]);
  const [drivers, setDrivers] = useState<Option[]>([]);

  // Form state
  const [trackingNumber, setTrackingNumber] = useState('');
  const [clientId, setClientId] = useState('');
  const [loadingPlaceId, setLoadingPlaceId] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [truckId, setTruckId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [status, setStatus] = useState<'Pending' | 'In Transit' | 'Delivered'>('Pending');
  const [price, setPrice] = useState('0');

  const fetchData = async () => {
    try {
      const [shipmentsRes, clientsRes, placesRes, trucksRes, driversRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/shipments`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/loading-places`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/trucks`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/drivers`),
      ]);

      if (shipmentsRes.ok) setShipments(await shipmentsRes.json());
      if (clientsRes.ok) setClients(await clientsRes.json());
      if (placesRes.ok) setPlaces(await placesRes.json());
      if (trucksRes.ok) setTrucks(await trucksRes.json());
      if (driversRes.ok) setDrivers(await driversRes.json());
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        trackingNumber,
        client: clientId,
        loadingPlace: loadingPlaceId,
        deliveryAddress,
        status,
        price: Number(price)
      };
      
      if (truckId) payload.truck = truckId;
      if (driverId) payload.driver = driverId;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shipments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowForm(false);
        // Reset form
        setTrackingNumber('');
        setClientId('');
        setLoadingPlaceId('');
        setDeliveryAddress('');
        setTruckId('');
        setDriverId('');
        setStatus('Pending');
        setPrice('0');
        fetchData(); // Refresh list
      }
    } catch (error) {
      console.error('Failed to add shipment:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Transit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Shipments</h1>
          <p className="text-slate-500 mt-1">Track and manage all logistics operations</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
        >
          {showForm ? 'Close Form' : '+ New Shipment'}
        </button>
      </header>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-bold mb-4">Create a New Shipment</h2>
          <form onSubmit={handleAddShipment} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tracking Number</label>
              <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} required
                className="w-full border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="SHP-123456" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Client</label>
              <select value={clientId} onChange={(e) => setClientId(e.target.value)} required className="w-full border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                <option value="" disabled>Select a client...</option>
                {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Loading Place</label>
              <select value={loadingPlaceId} onChange={(e) => setLoadingPlaceId(e.target.value)} required className="w-full border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                <option value="" disabled>Select origin...</option>
                {places.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Address</label>
              <input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} required
                className="w-full border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Destination address" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Assign Truck (Optional)</label>
              <select value={truckId} onChange={(e) => setTruckId(e.target.value)} className="w-full border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                <option value="">Unassigned</option>
                {trucks.map(t => <option key={t._id} value={t._id}>{t.plateNumber}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Assign Driver (Optional)</label>
              <select value={driverId} onChange={(e) => setDriverId(e.target.value)} className="w-full border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                <option value="">Unassigned</option>
                {drivers.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price / Cost ($)</label>
              <input type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required
                className="w-full border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="0.00" />
            </div>
            <div className="flex items-end flex-col justify-end">
              <label className="block text-sm font-medium text-slate-700 mb-1 self-start">Initial Status</label>
              <div className="flex w-full gap-2">
                <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="flex-1 border-slate-200 rounded-lg p-2.5 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                  <option value="Pending">Pending</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <button type="submit" className="flex-1 bg-slate-800 hover:bg-slate-900 text-white p-2.5 rounded-lg font-medium transition-colors">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {shipments.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-500 text-lg">No shipments found. Create your first shipment to start tracking.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium text-sm">
                  <th className="px-6 py-4">Tracking Number</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Origin & Destination</th>
                  <th className="px-6 py-4">Assignment</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shipments.map(shipment => (
                  <tr key={shipment._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-800">{shipment.trackingNumber}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{shipment.client?.name || 'Unknown Client'}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-800 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> 
                        {shipment.loadingPlace?.name || 'Unknown'}
                      </div>
                      <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-slate-300"></span> 
                        {shipment.deliveryAddress}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700 mb-1">
                        🚗 {shipment.truck?.plateNumber || <span className="text-slate-400 italic">No Truck</span>}
                      </div>
                      <div className="text-sm text-slate-700">
                        👤 {shipment.driver?.name || <span className="text-slate-400 italic">No Driver</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(shipment.status)}`}>
                        {shipment.status}
                      </span>
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
