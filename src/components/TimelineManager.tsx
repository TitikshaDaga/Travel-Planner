import React, { useState } from 'react';
import { Trip, Place, Activity, Transport, DiningItem } from '../types';
import { 
  MapPin, 
  Activity as ActionIcon, 
  Plane, 
  UtensilsCrossed, 
  Plus, 
  Trash2, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  X,
  PlusCircle,
  CalendarDays,
  MenuSquare
} from 'lucide-react';

interface TimelineManagerProps {
  trip: Trip;
  onUpdateTrip: (updated: Trip) => void;
}

type ModeType = 'places' | 'activities' | 'transport' | 'dining';

export default function TimelineManager({ trip, onUpdateTrip }: TimelineManagerProps) {
  const [activeTab, setActiveTab] = useState<ModeType>('places');
  const [showAddModal, setShowAddModal] = useState(false);

  const symbol = trip.currency ? (
    trip.currency === 'USD' ? '$' :
    trip.currency === 'EUR' ? '€' :
    trip.currency === 'GBP' ? '£' :
    trip.currency === 'CHF' ? 'CHF ' :
    trip.currency === 'JPY' ? '¥' :
    trip.currency === 'CAD' ? 'CA$' :
    trip.currency === 'AUD' ? 'A$' :
    trip.currency === 'INR' ? '₹' : '$'
  ) : '$';

  // Form Inputs State
  const [name, setName] = useState('');
  const [expectedCost, setExpectedCost] = useState<number>(0);
  const [expectedTime, setExpectedTime] = useState(''); // e.g. "3h"
  const [date, setDate] = useState(trip.startDate);
  const [notes, setNotes] = useState('');
  
  // Specific inputs
  const [location, setLocation] = useState('');
  const [transportType, setTransportType] = useState<Transport['type']>('Flight');
  const [provider, setProvider] = useState('');
  const [details, setDetails] = useState('');
  const [cuisine, setCuisine] = useState('');

  // Editing state for updating "Actual" values
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [actualCostVal, setActualCostVal] = useState<number>(0);
  const [actualTimeVal, setActualTimeVal] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const itemId = 'item_' + Date.now();
    const updatedTrip = { ...trip, updatedAt: new Date().toISOString() };

    if (activeTab === 'places') {
      const newPlace: Place = {
        id: itemId,
        name,
        expectedCost,
        actualCost: expectedCost, // initialize actual corresponding to estimate
        expectedTime,
        actualTime: expectedTime,
        date,
        notes: notes || undefined,
        completed: false
      };
      updatedTrip.places = [newPlace, ...(trip.places || [])];
    } else if (activeTab === 'activities') {
      const newActivity: Activity = {
        id: itemId,
        name,
        expectedCost,
        actualCost: expectedCost,
        expectedTime,
        actualTime: expectedTime,
        date,
        location: location || undefined,
        notes: notes || undefined,
        completed: false
      };
      updatedTrip.activities = [newActivity, ...(trip.activities || [])];
    } else if (activeTab === 'transport') {
      const newTransport: Transport = {
        id: itemId,
        type: transportType,
        provider: provider || 'TBD',
        details: details || '',
        expectedCost,
        actualCost: expectedCost,
        expectedTime,
        actualTime: expectedTime,
        completed: false
      };
      updatedTrip.transport = [newTransport, ...(trip.transport || [])];
    } else if (activeTab === 'dining') {
      const newDining: DiningItem = {
        id: itemId,
        name,
        cuisine: cuisine || undefined,
        expectedCost,
        actualCost: expectedCost,
        expectedTime,
        actualTime: expectedTime,
        notes: notes || undefined,
        completed: false
      };
      updatedTrip.dining = [newDining, ...(trip.dining || [])];
    }

    onUpdateTrip(updatedTrip);
    
    // Clear Form
    setName('');
    setExpectedCost(0);
    setExpectedTime('');
    setNotes('');
    setLocation('');
    setProvider('');
    setDetails('');
    setCuisine('');
    setShowAddModal(false);
  };

  const handleDeleteItem = (categoryId: ModeType, itemId: string) => {
    if (!window.confirm('Are you sure you want to remove this plan from your itinerary?')) return;
    
    const updatedTrip = { ...trip, updatedAt: new Date().toISOString() };
    if (categoryId === 'places') updatedTrip.places = (trip.places || []).filter(i => i.id !== itemId);
    if (categoryId === 'activities') updatedTrip.activities = (trip.activities || []).filter(i => i.id !== itemId);
    if (categoryId === 'transport') updatedTrip.transport = (trip.transport || []).filter(i => i.id !== itemId);
    if (categoryId === 'dining') updatedTrip.dining = (trip.dining || []).filter(i => i.id !== itemId);

    onUpdateTrip(updatedTrip);
  };

  const handleToggleCompleted = (categoryId: ModeType, itemId: string) => {
    const updatedTrip = { ...trip, updatedAt: new Date().toISOString() };

    if (categoryId === 'places') {
      updatedTrip.places = (trip.places || []).map(p => {
        if (p.id === itemId) {
          const toggled = !p.completed;
          return { ...p, completed: toggled };
        }
        return p;
      });
    } else if (categoryId === 'activities') {
      updatedTrip.activities = (trip.activities || []).map(a => {
        if (a.id === itemId) {
          const toggled = !a.completed;
          return { ...a, completed: toggled };
        }
        return a;
      });
    } else if (categoryId === 'transport') {
      updatedTrip.transport = (trip.transport || []).map(t => {
        if (t.id === itemId) {
          const toggled = !t.completed;
          return { ...t, completed: toggled };
        }
        return t;
      });
    } else if (categoryId === 'dining') {
      updatedTrip.dining = (trip.dining || []).map(d => {
        if (d.id === itemId) {
          const toggled = !d.completed;
          return { ...d, completed: toggled };
        }
        return d;
      });
    }

    onUpdateTrip(updatedTrip);
  };

  const startLoggingActuals = (itemId: string, cost: number, time: string) => {
    setEditingItemId(itemId);
    setActualCostVal(cost);
    setActualTimeVal(time);
  };

  const handleSaveActualValues = (categoryId: ModeType, itemId: string) => {
    const updatedTrip = { ...trip, updatedAt: new Date().toISOString() };

    if (categoryId === 'places') {
      updatedTrip.places = (trip.places || []).map(p => 
        p.id === itemId ? { ...p, actualCost: actualCostVal, actualTime: actualTimeVal, completed: true } : p
      );
    } else if (categoryId === 'activities') {
      updatedTrip.activities = (trip.activities || []).map(a => 
        a.id === itemId ? { ...a, actualCost: actualCostVal, actualTime: actualTimeVal, completed: true } : a
      );
    } else if (categoryId === 'transport') {
      updatedTrip.transport = (trip.transport || []).map(t => 
        t.id === itemId ? { ...t, actualCost: actualCostVal, actualTime: actualTimeVal, completed: true } : t
      );
    } else if (categoryId === 'dining') {
      updatedTrip.dining = (trip.dining || []).map(d => 
        d.id === itemId ? { ...d, actualCost: actualCostVal, actualTime: actualTimeVal, completed: true } : d
      );
    }

    onUpdateTrip(updatedTrip);
    setEditingItemId(null);
  };

  const getCategoryIcon = (tab: ModeType) => {
    switch(tab) {
      case 'places': return <MapPin className="w-5 h-5" />;
      case 'activities': return <ActionIcon className="w-5 h-5" />;
      case 'transport': return <Plane className="w-5 h-5" />;
      case 'dining': return <UtensilsCrossed className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-sans text-xl font-bold text-stone-900">Trip Schedule & Logistics</h2>
          <p className="text-stone-500 text-xs">Define planned routes and add real durations and costs as you live the trip.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-stone-900 duration-200 border border-stone-800 text-stone-100 hover:bg-stone-800 transition rounded-xl text-xs font-semibold h-11"
        >
          <Plus className="w-4 h-4" /> Add to Schedule
        </button>
      </div>

      {/* Tabs list inside detailed timeline */}
      <div className="flex border-b border-stone-200">
        {(['places', 'activities', 'transport', 'dining'] as ModeType[]).map((tab) => {
          const isActive = activeTab === tab;
          let counts = 0;
          if (tab === 'places') counts = (trip.places || []).length;
          if (tab === 'activities') counts = (trip.activities || []).length;
          if (tab === 'transport') counts = (trip.transport || []).length;
          if (tab === 'dining') counts = (trip.dining || []).length;
          
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold transition capitalize cursor-pointer -mb-[2px] ${
                isActive 
                  ? 'border-stone-900 text-stone-900' 
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              {getCategoryIcon(tab)}
              <span>{tab}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${isActive ? 'bg-stone-100 text-stone-800' : 'bg-stone-50 text-stone-500'}`}>
                {counts}
              </span>
            </button>
          );
        })}
      </div>

      {/* Primary list */}
      <div className="space-y-4">
        {activeTab === 'places' && (
          <div className="space-y-3.5">
            {(!trip.places || trip.places.length === 0) ? (
              <div className="text-center py-16 border border-dashed border-stone-200 rounded-2xl bg-stone-55 italic text-xs text-stone-400">
                No destinations listed yet. Add places like hotels, view-points or neighborhoods.
              </div>
            ) : (
              trip.places.map((place) => (
                <div 
                  key={place.id} 
                  className={`p-5 bg-white border rounded-2xl transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    place.completed ? 'border-emerald-300 bg-emerald-50/10' : 'border-stone-200'
                  }`}
                >
                  <div className="flex gap-3.5 items-start">
                    <button 
                      onClick={() => handleToggleCompleted('places', place.id)}
                      className={`w-6 h-6 mt-0.5 rounded-full flex items-center justify-center transition border ${
                        place.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 hover:border-stone-500 bg-stone-50'
                      }`}
                      title="Toggle Completed"
                    >
                      {place.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <div>
                      <h4 className={`font-sans text-xs font-bold text-stone-900 ${place.completed && 'line-through text-stone-400'}`}>
                        {place.name}
                      </h4>
                      <p className="text-[10px] font-mono text-stone-400 flex items-center gap-1.5 mt-0.5">
                        <CalendarDays className="w-3" /> Scheduled: {place.date}
                      </p>
                      {place.notes && <p className="text-stone-500 text-[11px] mt-1.5 pl-3 border-l-2 border-stone-200 font-serif italic">{place.notes}</p>}
                      
                      <div className="flex items-center gap-4 mt-3 flex-wrap">
                        <div className="flex items-center gap-1 text-[11px] text-stone-600">
                          <DollarSign className="w-3.5 h-3.5 text-stone-400" />
                          <span>Est Cost:</span>
                          <span className="font-bold text-stone-800">{symbol}{place.expectedCost}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-stone-600">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>Est Duration:</span>
                          <span className="font-bold text-stone-800">{place.expectedTime || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Comparison & On-trip fields */}
                  <div className="flex flex-col items-stretch md:items-end gap-3.5 w-full md:w-auto border-t md:border-none pt-3 md:pt-0">
                    {editingItemId === place.id ? (
                      <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl space-y-2 w-full md:w-64">
                        <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Update Actual Spent</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[9px] text-stone-400 block font-semibold">Cost ({symbol.trim()})</span>
                            <input 
                              type="number" 
                              value={actualCostVal}
                              onChange={(e) => setActualCostVal(Number(e.target.value))}
                              className="w-full px-2 py-1 border border-stone-300 bg-white rounded text-xs"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] text-stone-400 block font-semibold">Duration</span>
                            <input 
                              type="text" 
                              value={actualTimeVal}
                              placeholder="e.g. 2h"
                              onChange={(e) => setActualTimeVal(e.target.value)}
                              className="w-full px-2 py-1 border border-stone-300 bg-white rounded text-xs"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button 
                            onClick={() => setEditingItemId(null)}
                            className="px-2 py-1 bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 text-[10px] rounded font-semibold"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleSaveActualValues('places', place.id)}
                            className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-stone-100 text-[10px] rounded font-semibold"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 md:text-right">
                        {place.completed ? (
                          <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl text-[11px] border border-emerald-200/50 flex flex-col items-start md:items-end">
                            <span className="font-bold text-[10px] text-emerald-700 font-sans uppercase">Actual Spent Metrics</span>
                            <div className="grid grid-cols-2 gap-3 mt-1 text-xs">
                              <span className="font-mono">Spent: <strong className="text-emerald-900">{symbol}{place.actualCost}</strong></span>
                              <span className="font-mono">Time: <strong className="text-emerald-900">{place.actualTime}</strong></span>
                            </div>
                            <button 
                              onClick={() => startLoggingActuals(place.id, place.actualCost, place.actualTime)}
                              className="text-[10px] text-stone-500 font-semibold hover:text-stone-900 underline mt-2"
                            >
                              Edit Spent Values
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => startLoggingActuals(place.id, place.expectedCost, place.expectedTime)}
                            className="px-3.5 py-1.5 border border-stone-300 hover:bg-stone-50 text-stone-700 text-[11px] font-bold rounded-xl flex items-center gap-1 cursor-pointer w-full md:w-auto justify-center"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Log Spent Values (Completed)
                          </button>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button 
                        onClick={() => handleDeleteItem('places', place.id)}
                        className="p-2 border border-stone-100 text-rose-500 hover:bg-rose-50/50 rounded-xl transition cursor-pointer"
                        title="Delete place"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="space-y-3.5">
            {(!trip.activities || trip.activities.length === 0) ? (
              <div className="text-center py-16 border border-dashed border-stone-200 rounded-2xl bg-stone-55 italic text-xs text-stone-400">
                No excursions or events scheduled. Add tickets, guided tours or hiking itineraries.
              </div>
            ) : (
              trip.activities.map((act) => (
                <div 
                  key={act.id} 
                  className={`p-5 bg-white border rounded-2xl transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    act.completed ? 'border-emerald-300 bg-emerald-50/10' : 'border-stone-200'
                  }`}
                >
                  <div className="flex gap-3.5 items-start">
                    <button 
                      onClick={() => handleToggleCompleted('activities', act.id)}
                      className={`w-6 h-6 mt-0.5 rounded-full flex items-center justify-center transition border ${
                        act.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 hover:border-stone-500 bg-stone-50'
                      }`}
                    >
                      {act.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <div>
                      <h4 className={`font-sans text-xs font-bold text-stone-900 ${act.completed && 'line-through text-stone-400'}`}>
                        {act.name}
                      </h4>
                      <p className="text-[10px] font-mono text-stone-400 flex items-center gap-3 mt-0.5">
                        <span>📅 Sch: {act.date}</span>
                        {act.location && <span>• 📍 Location: {act.location}</span>}
                      </p>
                      {act.notes && <p className="text-stone-500 text-[11px] mt-1.5 pl-3 border-l-2 border-stone-200 font-serif italic">{act.notes}</p>}
                      
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1 text-[11px] text-stone-600">
                          <DollarSign className="w-3.5 h-3.5 text-stone-400" />
                          <span>Est Cost:</span>
                          <span className="font-bold text-stone-800">{symbol}{act.expectedCost}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-stone-600">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>Est Duration:</span>
                          <span className="font-bold text-stone-800">{act.expectedTime || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Comparison */}
                  <div className="flex flex-col items-stretch md:items-end gap-3.5 w-full md:w-auto border-t md:border-none pt-3 md:pt-0">
                    {editingItemId === act.id ? (
                      <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl space-y-2 w-full md:w-64">
                        <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Update Spent Details</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[9px] text-stone-400 block font-semibold">Cost ({symbol.trim()})</span>
                            <input 
                              type="number" 
                              value={actualCostVal}
                              onChange={(e) => setActualCostVal(Number(e.target.value))}
                              className="w-full px-2 py-1 border border-stone-300 bg-white rounded text-xs"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] text-stone-400 block font-semibold">Duration</span>
                            <input 
                              type="text" 
                              value={actualTimeVal}
                              onChange={(e) => setActualTimeVal(e.target.value)}
                              className="w-full px-2 py-1 border border-stone-300 bg-white rounded text-xs"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button 
                            onClick={() => setEditingItemId(null)}
                            className="px-2 py-1 bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 text-[10px] rounded font-semibold"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleSaveActualValues('activities', act.id)}
                            className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-stone-100 text-[10px] rounded font-semibold"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 md:text-right">
                        {act.completed ? (
                          <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl text-[11px] border border-emerald-200/50 flex flex-col items-start md:items-end">
                            <span className="font-bold text-[10px] text-emerald-700 font-sans uppercase">Actual Spent Metrics</span>
                            <div className="grid grid-cols-2 gap-3 mt-1 text-xs">
                              <span className="font-mono">Spent: <strong className="text-emerald-900">{symbol}{act.actualCost}</strong></span>
                              <span className="font-mono">Time: <strong className="text-emerald-900">{act.actualTime}</strong></span>
                            </div>
                            <button 
                              onClick={() => startLoggingActuals(act.id, act.actualCost, act.actualTime)}
                              className="text-[10px] text-stone-500 font-semibold hover:text-stone-900 underline mt-2"
                            >
                              Edit Spent Values
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => startLoggingActuals(act.id, act.expectedCost, act.expectedTime)}
                            className="px-3.5 py-1.5 border border-stone-300 hover:bg-stone-50 text-stone-700 text-[11px] font-bold rounded-xl flex items-center gap-1 cursor-pointer w-full md:w-auto justify-center"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Log Spent Values (Completed)
                          </button>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button 
                        onClick={() => handleDeleteItem('activities', act.id)}
                        className="p-2 border border-stone-100 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'transport' && (
          <div className="space-y-3.5">
            {(!trip.transport || trip.transport.length === 0) ? (
              <div className="text-center py-16 border border-dashed border-stone-200 rounded-2xl bg-stone-55 italic text-xs text-stone-400">
                No transits or routes configured. Add plane flight passes, car rental specifics or rail tickets.
              </div>
            ) : (
              trip.transport.map((trans) => (
                <div 
                  key={trans.id} 
                  className={`p-5 bg-white border rounded-2xl transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    trans.completed ? 'border-emerald-300 bg-emerald-50/10' : 'border-stone-200'
                  }`}
                >
                  <div className="flex gap-3.5 items-start">
                    <button 
                      onClick={() => handleToggleCompleted('transport', trans.id)}
                      className={`w-6 h-6 mt-0.5 rounded-full flex items-center justify-center transition border ${
                        trans.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 hover:border-stone-500 bg-stone-50'
                      }`}
                    >
                      {trans.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase font-mono bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-bold">
                          {trans.type}
                        </span>
                        <h4 className={`font-sans text-xs font-bold text-stone-900 ${trans.completed && 'line-through text-stone-400'}`}>
                          {trans.provider}
                        </h4>
                      </div>
                      {trans.details && <p className="text-stone-500 text-[11px] mt-1 font-semibold">{trans.details}</p>}
                      
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1 text-[11px] text-stone-600">
                          <DollarSign className="w-3.5 h-3.5 text-stone-400" />
                          <span>Est Cost:</span>
                          <span className="font-bold text-stone-800">{symbol}{trans.expectedCost}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-stone-600">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>Est Duration:</span>
                          <span className="font-bold text-stone-800">{trans.expectedTime || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Comparison */}
                  <div className="flex flex-col items-stretch md:items-end gap-3.5 w-full md:w-auto border-t md:border-none pt-3 md:pt-0">
                    {editingItemId === trans.id ? (
                      <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl space-y-2 w-full md:w-64">
                        <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Update Spent Details</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[9px] text-stone-400 block font-semibold">Cost ({symbol.trim()})</span>
                            <input 
                              type="number" 
                              value={actualCostVal}
                              onChange={(e) => setActualCostVal(Number(e.target.value))}
                              className="w-full px-2 py-1 border border-stone-300 bg-white rounded text-xs"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] text-stone-400 block font-semibold">Duration</span>
                            <input 
                              type="text" 
                              value={actualTimeVal}
                              onChange={(e) => setActualTimeVal(e.target.value)}
                              className="w-full px-2 py-1 border border-stone-300 bg-white rounded text-xs"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button 
                            onClick={() => setEditingItemId(null)}
                            className="px-2 py-1 bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 text-[10px] rounded font-semibold"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleSaveActualValues('transport', trans.id)}
                            className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-stone-100 text-[10px] rounded font-semibold"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 md:text-right">
                        {trans.completed ? (
                          <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl text-[11px] border border-emerald-200/50 flex flex-col items-start md:items-end">
                            <span className="font-bold text-[10px] text-emerald-700 font-sans uppercase">Actual Spent Metrics</span>
                            <div className="grid grid-cols-2 gap-3 mt-1 text-xs">
                              <span className="font-mono">Spent: <strong className="text-emerald-950">{symbol}{trans.actualCost}</strong></span>
                              <span className="font-mono">Time: <strong className="text-emerald-950">{trans.actualTime}</strong></span>
                            </div>
                            <button 
                              onClick={() => startLoggingActuals(trans.id, trans.actualCost, trans.actualTime)}
                              className="text-[10px] text-stone-500 font-semibold hover:text-stone-900 underline mt-2"
                            >
                              Edit Spent Values
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => startLoggingActuals(trans.id, trans.expectedCost, trans.expectedTime)}
                            className="px-3.5 py-1.5 border border-stone-300 hover:bg-stone-50 text-stone-700 text-[11px] font-bold rounded-xl flex items-center gap-1 cursor-pointer w-full md:w-auto justify-center"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Log Spent Values (Completed)
                          </button>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button 
                        onClick={() => handleDeleteItem('transport', trans.id)}
                        className="p-2 border border-stone-100 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'dining' && (
          <div className="space-y-3.5">
            {(!trip.dining || trip.dining.length === 0) ? (
              <div className="text-center py-16 border border-dashed border-stone-200 rounded-2xl bg-stone-55 italic text-xs text-stone-400">
                No dining hotspots logged. Save local restaurants, bars or street food markets.
              </div>
            ) : (
              trip.dining.map((din) => (
                <div 
                  key={din.id} 
                  className={`p-5 bg-white border rounded-2xl transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    din.completed ? 'border-emerald-300 bg-emerald-50/10' : 'border-stone-200'
                  }`}
                >
                  <div className="flex gap-3.5 items-start">
                    <button 
                      onClick={() => handleToggleCompleted('dining', din.id)}
                      className={`w-6 h-6 mt-0.5 rounded-full flex items-center justify-center transition border ${
                        din.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 hover:border-stone-500 bg-stone-50'
                      }`}
                    >
                      {din.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <div>
                      <h4 className={`font-sans text-xs font-bold text-stone-900 ${din.completed && 'line-through text-stone-400'}`}>
                        {din.name}
                      </h4>
                      {din.cuisine && <p className="text-stone-400 text-[10px] font-medium leading-none uppercase tracking-wide bg-stone-100 px-1.5 py-0.5 rounded w-fit mt-1">{din.cuisine} Cuisine</p>}
                      {din.notes && <p className="text-stone-500 text-[11px] mt-1.5 pl-3 border-l-2 border-stone-200 font-serif italic">{din.notes}</p>}
                      
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1 text-[11px] text-stone-600">
                          <DollarSign className="w-3.5 h-3.5 text-stone-400" />
                          <span>Est Cost:</span>
                          <span className="font-bold text-stone-800">{symbol}{din.expectedCost}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-stone-600">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>Est Duration:</span>
                          <span className="font-bold text-stone-800">{din.expectedTime || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Comparison */}
                  <div className="flex flex-col items-stretch md:items-end gap-3.5 w-full md:w-auto border-t md:border-none pt-3 md:pt-0">
                    {editingItemId === din.id ? (
                      <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl space-y-2 w-full md:w-64">
                        <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Update Spent Details</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[9px] text-stone-400 block font-semibold">Cost ({symbol.trim()})</span>
                            <input 
                              type="number" 
                              value={actualCostVal}
                              onChange={(e) => setActualCostVal(Number(e.target.value))}
                              className="w-full px-2 py-1 border border-stone-300 bg-white rounded text-xs"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] text-stone-400 block font-semibold">Duration</span>
                            <input 
                              type="text" 
                              value={actualTimeVal}
                              onChange={(e) => setActualTimeVal(e.target.value)}
                              className="w-full px-2 py-1 border border-stone-300 bg-white rounded text-xs"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button 
                            onClick={() => setEditingItemId(null)}
                            className="px-2 py-1 bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 text-[10px] rounded font-semibold"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleSaveActualValues('dining', din.id)}
                            className="px-2 py-1 bg-stone-900 hover:bg-stone-800 text-stone-100 text-[10px] rounded font-semibold"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 md:text-right">
                        {din.completed ? (
                          <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl text-[11px] border border-emerald-200/50 flex flex-col items-start md:items-end">
                            <span className="font-bold text-[10px] text-emerald-700 font-sans uppercase">Actual Spent Metrics</span>
                            <div className="grid grid-cols-2 gap-3 mt-1 text-xs">
                              <span className="font-mono">Spent: <strong className="text-emerald-950">{symbol}{din.actualCost}</strong></span>
                              <span className="font-mono">Time: <strong className="text-emerald-950">{din.actualTime}</strong></span>
                            </div>
                            <button 
                              onClick={() => startLoggingActuals(din.id, din.actualCost, din.actualTime)}
                              className="text-[10px] text-stone-500 font-semibold hover:text-stone-900 underline mt-2"
                            >
                              Edit Spent Values
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => startLoggingActuals(din.id, din.expectedCost, din.expectedTime)}
                            className="px-3.5 py-1.5 border border-stone-300 hover:bg-stone-50 text-stone-700 text-[11px] font-bold rounded-xl flex items-center gap-1 cursor-pointer w-full md:w-auto justify-center"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Log Spent Values (Completed)
                          </button>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button 
                        onClick={() => handleDeleteItem('dining', din.id)}
                        className="p-2 border border-stone-100 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add Schedule Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-lg p-6 relative z-10 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
              <h3 className="font-sans text-sm font-semibold text-stone-900 uppercase tracking-widest flex items-center gap-2">
                {getCategoryIcon(activeTab)}
                <span>Add {activeTab.replace('s', '')} Plan</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-stone-100 rounded-lg text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-stone-700 text-xs font-semibold">
                  {activeTab === 'transport' ? 'Provider / Carrier Name' : 'Item Name / Label'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    activeTab === 'places' ? 'e.g., Matterhorn Chalet' :
                    activeTab === 'activities' ? 'e.g., Interlaken Paragliding' :
                    activeTab === 'transport' ? 'e.g., Swiss Federal Railways' : 'e.g., Walliserkanne Fondue House'
                  }
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-stone-500"
                />
              </div>

              {/* Specific inputs */}
              {activeTab === 'activities' && (
                <div className="space-y-1">
                  <label className="text-stone-700 text-xs font-semibold">Location / Address</label>
                  <input
                    type="text"
                    placeholder="e.g., Meet at Bahnhofplatz, Interlaken"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-stone-500"
                  />
                </div>
              )}

              {activeTab === 'transport' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-stone-700 text-xs font-semibold">Transit Type</label>
                    <select
                      value={transportType}
                      onChange={(e) => setTransportType(e.target.value as Transport['type'])}
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs bg-white focus:outline-stone-500"
                    >
                      <option value="Flight">✈️ Flight</option>
                      <option value="Train">🚆 train</option>
                      <option value="Car">🚗 Car Rental/Drive</option>
                      <option value="Bus">🚌 Bus</option>
                      <option value="Ferry">🚢 Ferry/Boat</option>
                      <option value="Walking">🥾 Walking/Hiking</option>
                      <option value="Other">🎒 Other</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-stone-700 text-xs font-semibold">Departure & Numbers</label>
                    <input
                      type="text"
                      placeholder="e.g. Flight LX-208 / Train platform 4"
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-stone-500"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'dining' && (
                <div className="space-y-1">
                  <label className="text-stone-700 text-xs font-semibold">Cuisine / Food Concept</label>
                  <input
                    type="text"
                    placeholder="e.g. Traditional Swiss Fondue / Italian / Street Food"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-stone-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-stone-700 text-xs font-semibold flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-stone-400" /> Expected Cost ({symbol.trim()})
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={expectedCost}
                    onChange={(e) => setExpectedCost(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-stone-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-700 text-xs font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" /> Expected Duration / Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 3h / 4 days / 45m"
                    value={expectedTime}
                    onChange={(e) => setExpectedTime(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-stone-500 font-mono"
                  />
                </div>
              </div>

              {activeTab !== 'transport' && (
                <div className="space-y-1">
                  <label className="text-stone-700 text-xs font-semibold flex items-center gap-1">
                    📅 Schedule Date
                  </label>
                  <input
                    type="date"
                    min={trip.startDate}
                    max={trip.endDate}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-stone-500 font-mono"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-stone-700 text-xs font-semibold flex items-center gap-1.5">
                  <MenuSquare className="w-3.5 h-3.5 text-stone-400" /> Extra Details / Notes
                </label>
                <textarea
                  placeholder="e.g., Dress code, phone numbers, booking confirmations."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs resize-none focus:outline-stone-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-semibold cursor-pointer h-10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-stone-100 hover:bg-stone-800 rounded-xl text-xs font-semibold cursor-pointer h-10"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
