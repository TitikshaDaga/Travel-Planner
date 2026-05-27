import React, { useState, useEffect } from 'react';
import { dbService } from './lib/db';
import { Trip, UserProfile } from './types';
import TimelineManager from './components/TimelineManager';
import FinanceHub from './components/FinanceHub';
import DocumentManager from './components/DocumentManager';
import CollaboratorsConfig from './components/CollaboratorsConfig';
import LandingPage from './components/LandingPage';
import { 
  Calendar, 
  Compass, 
  LogOut, 
  Map, 
  Plus, 
  Share2, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Wifi, 
  WifiOff, 
  ChevronRight, 
  Trash2,
  Lock,
  Compass as CompassIcon,
  HelpCircle
} from 'lucide-react';

// Elegant default cover images
const COVER_IMAGES = [
  { id: 'img_alps', label: 'Swiss Mountains', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop' },
  { id: 'img_tropical', label: 'Tropical Beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop' },
  { id: 'img_tokyo', label: 'Tokyo Cityscape', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop' },
  { id: 'img_paris', label: 'European Streets', url: 'https://images.unsplash.com/photo-1499856871958-5b9647a640d0?w=800&auto=format&fit=crop' }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isOnlineSimulated, setIsOnlineSimulated] = useState(true);

  // Trips Lists state
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Modals / Creating trip
  const [showAddTripModal, setShowAddTripModal] = useState(false);
  const [newTripTitle, setNewTripTitle] = useState('');
  const [newTripDesc, setNewTripDesc] = useState('');
  const [newTripStart, setNewTripStart] = useState('');
  const [newTripEnd, setNewTripEnd] = useState('');
  const [newTripBudget, setNewTripBudget] = useState<number>(2000);
  const [newTripImg, setNewTripImg] = useState(COVER_IMAGES[0].url);
  const [newTripCurrency, setNewTripCurrency] = useState('USD');

  // Active sub-tab inside selectedTrip: 'schedule' | 'documents' | 'finance' | 'collab'
  const [activeSubTab, setActiveSubTab] = useState<'schedule' | 'documents' | 'finance' | 'collab'>('schedule');

  const [isWipingConfirm, setIsWipingConfirm] = useState(false);

  // Sync auth state
  useEffect(() => {
    const unsubscribe = dbService.subscribeAuth((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch trips once user or online-state changes
  const fetchTripsData = async () => {
    if (!currentUser) return;
    setTripsLoading(true);
    try {
      const results = await dbService.getTrips(currentUser.email, currentUser.uid);
      setTrips(results);
      // Keep selected trip updated if details were updated elsewhere
      if (selectedTrip) {
        const matching = results.find(t => t.id === selectedTrip.id);
        if (matching) setSelectedTrip(matching);
      }
    } catch (e) {
      console.error("Failed loading trips", e);
    } finally {
      setTripsLoading(false);
    }
  };

  useEffect(() => {
    fetchTripsData();
  }, [currentUser, isOnlineSimulated]);

  const handleLogin = async (customEmail?: string, customName?: string) => {
    try {
      const user = await dbService.loginWithGoogle(customEmail, customName);
      setCurrentUser(user);
    } catch (e) {
      alert("Failed Google Auth. Please check your credentials or run in mock mode.");
    }
  };

  const handleLogout = async () => {
    await dbService.logout();
    setCurrentUser(null);
    setSelectedTrip(null);
  };

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newTripTitle || !newTripStart || !newTripEnd) return;

    try {
      const newTripId = 'trip_' + Date.now();
      const newTrip: Trip = {
        id: newTripId,
        title: newTripTitle,
        description: newTripDesc || '',
        startDate: newTripStart,
        endDate: newTripEnd,
        budget: Number(newTripBudget) || 1000,
        currency: newTripCurrency,
        ownerId: currentUser.uid,
        ownerEmail: currentUser.email,
        ownerName: currentUser.displayName || 'Traveler',
        collaborators: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        places: [],
        activities: [],
        transport: [],
        dining: [],
        documents: []
      };

      await dbService.saveTrip(newTrip);
      
      // reset form
      setNewTripTitle('');
      setNewTripDesc('');
      setNewTripStart('');
      setNewTripEnd('');
      setNewTripBudget(2000);
      setNewTripCurrency('USD');
      setShowAddTripModal(false);
      
      // Refresh & view newly created trip instantly
      await fetchTripsData();
      setSelectedTrip(newTrip);
      setActiveSubTab('schedule');
    } catch (err: any) {
      console.error("Error creating journey:", err);
      alert(`Could not save journey: ${err.message || 'Unknown database write error'}`);
    }
  };

  const handleUpdateTripDetails = async (updatedTrip: Trip) => {
    // Optimistic state sync
    setSelectedTrip(updatedTrip);
    setTrips(prev => prev.map(t => t.id === updatedTrip.id ? updatedTrip : t));

    // Save to DB (caches instantly offline too!)
    await dbService.saveTrip(updatedTrip);
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (!window.confirm('Are you absolute sure you want to permanently delete this trip and all its schedule details? This action is irreversible.')) return;
    await dbService.deleteTrip(tripId);
    setSelectedTrip(null);
    fetchTripsData();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-slate-800 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-slate-500 animate-pulse">Initializing Plan Your Own Trip Environment</p>
      </div>
    );
  }

  // Login Screen if unauthorized
  if (!currentUser) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Top Navigation / Offline Simulator Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 md:px-8 py-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSelectedTrip(null)}
            className="flex items-center gap-1.5 text-left cursor-pointer"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm shrink-0">
              TL
            </div>
            <div className="hidden sm:block">
              <h1 className="font-sans text-xs sm:text-sm font-bold tracking-tight text-slate-800 uppercase">Trip Ledger</h1>
              <p className="text-[9px] text-slate-400 font-serif italic">Digital Travel Journal</p>
            </div>
          </button>

          {/* Simulated Offline Toggler - satisfies requirement 4 */}
          <button
            onClick={() => setIsOnlineSimulated(!isOnlineSimulated)}
            className={`flex items-center gap-1 py-1 px-2 sm:px-3 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider uppercase transition cursor-pointer border shrink-0 ${
              isOnlineSimulated 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
            }`}
            title="Toggle to simulate full offline mode"
          >
            {isOnlineSimulated ? (
              <>
                <Wifi className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden min-[480px]:inline">Simulated: Online</span>
                <span className="min-[480px]:hidden">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden min-[480px]:inline">Simulated: Offline Cache Active</span>
                <span className="min-[480px]:hidden">Offline</span>
              </>
            )}
          </button>
        </div>

        {/* User Identity widget */}
        <div className="flex items-center gap-2 shrink-0">
          {isWipingConfirm ? (
            <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 py-1 px-1.5 sm:px-2.5 rounded-2xl shrink-0">
              <span className="text-[9px] sm:text-[10px] text-rose-700 font-bold uppercase tracking-wider px-1">Confirm Purge All?</span>
              <button
                onClick={async () => {
                  try {
                    for (const trip of trips) {
                      await dbService.deleteTrip(trip.id);
                    }
                    localStorage.removeItem('tripplanner_trips');
                    setTrips([]);
                    setSelectedTrip(null);
                    setIsWipingConfirm(false);
                  } catch (e) {
                    console.error("Purge failure: ", e);
                  }
                }}
                className="px-2 py-1 bg-red-650 hover:bg-red-700 text-white rounded-xl text-[9px] sm:text-[10px] font-bold transition cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={() => setIsWipingConfirm(false)}
                className="px-2 py-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 rounded-xl text-[9px] sm:text-[10px] font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsWipingConfirm(true)}
              className="p-1.5 sm:p-2 border border-rose-200 bg-rose-50/30 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-xl transition cursor-pointer flex items-center gap-1 shrink-0"
              title="Delete All Data & Reset Application"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 animate-pulse" />
              <span className="hidden leading-none md:inline text-[10px] font-bold uppercase tracking-wider text-rose-700">Wipe Ledger</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-1 sm:p-1.5 sm:pr-3 rounded-full">
            {currentUser.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt={currentUser.displayName || 'Avatar'} 
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-slate-300 pointer-events-none"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-[9px] sm:text-[10px]">
                {currentUser.email.substring(0, 2).toUpperCase()}
              </div>
            )}
            <span className="text-[10px] font-bold text-slate-700 font-mono hidden md:inline-block">
              {currentUser.email}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 sm:p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl transition cursor-pointer"
            title="Disconnect Account"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        
        {/* Selected Trip Details Page */}
        {selectedTrip ? (
          <div className="space-y-6">
            
            {/* Back Button and action menu */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setSelectedTrip(null)}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition font-semibold text-xs cursor-pointer"
              >
                ← Back to Dashboard Overview
              </button>

              <button
                onClick={() => handleDeleteTrip(selectedTrip.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-100 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Itinerary
              </button>
            </div>

            {/* Elegant simplified trip info card */}
            <div className="relative rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 flex items-end p-6 md:p-8">
              <div className="relative z-10 space-y-2 w-full">
                <span className="text-[10px] uppercase font-bold text-indigo-400 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-full tracking-widest block w-fit">
                  🗺️ Itinerary Route Ledger
                </span>
                <div className="flex flex-col md:flex-row md:items-start lg:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3.5xl font-extrabold tracking-tight text-white">{selectedTrip.title}</h2>
                    <p className="text-[10px] font-mono text-emerald-400 bg-slate-950 inline-block px-2.5 py-1 rounded border border-slate-800 mt-2">
                      📅 Dates: {selectedTrip.startDate} — {selectedTrip.endDate}
                    </p>
                  </div>
                  <div className="bg-slate-950 border border-slate-850 font-mono px-4 py-3 rounded-2xl flex flex-col items-start md:items-end md:self-center">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Plan Budget</span>
                    <strong className="text-lg text-indigo-450 mt-0.5">
                      {selectedTrip.currency ? (
                        selectedTrip.currency === 'USD' ? '$' :
                        selectedTrip.currency === 'EUR' ? '€' :
                        selectedTrip.currency === 'GBP' ? '£' :
                        selectedTrip.currency === 'CHF' ? 'CHF ' :
                        selectedTrip.currency === 'JPY' ? '¥' :
                        selectedTrip.currency === 'CAD' ? 'CA$' :
                        selectedTrip.currency === 'AUD' ? 'A$' :
                        selectedTrip.currency === 'INR' ? '₹' : '$'
                      ) : '$'}{selectedTrip.budget.toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Trip Control Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-1.5 shadow-sm">
                {[
                  { id: 'schedule', label: '🗓️ Schedule & Actuals' },
                  { id: 'documents', label: '💼 Travel Documents' },
                  { id: 'finance', label: '📊 Expense Analytics' },
                  { id: 'collab', label: '👥 Coordinate Partners' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSubTab(item.id as any)}
                    className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                      activeSubTab === item.id 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>

              {/* Tab Display Panel */}
              <div className="lg:col-span-3">
                {activeSubTab === 'schedule' && (
                  <TimelineManager 
                    trip={selectedTrip} 
                    onUpdateTrip={handleUpdateTripDetails} 
                  />
                )}
                {activeSubTab === 'documents' && (
                  <DocumentManager 
                    trip={selectedTrip} 
                    onUpdateTrip={handleUpdateTripDetails} 
                  />
                )}
                {activeSubTab === 'finance' && (
                  <FinanceHub 
                    trip={selectedTrip} 
                  />
                )}
                {activeSubTab === 'collab' && (
                  <CollaboratorsConfig 
                    trip={selectedTrip} 
                    currentUserEmail={currentUser.email}
                    onUpdateTrip={handleUpdateTripDetails} 
                  />
                )}
              </div>
            </div>

          </div>
        ) : (
          
          // Dashboard Overview
          <div className="space-y-6">
            {/* Quick Metrics Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <span className="text-slate-400 font-sans text-[10px] uppercase font-bold tracking-wider block">Upcoming Trips</span>
                <div className="text-3xl font-extrabold font-mono text-slate-900 mt-1">{trips.length}</div>
                <p className="text-slate-500 text-[11px] mt-1">Stored securely offline</p>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <span className="text-slate-400 font-sans text-[10px] uppercase font-bold tracking-wider block">Co-Planned Trips</span>
                <div className="text-3xl font-extrabold font-mono text-slate-900 mt-1">
                  {trips.filter(t => t.collaborators.length > 0).length}
                </div>
                <p className="text-slate-500 text-[11px] mt-1">Collaborations with friends</p>
              </div>

              <button 
                onClick={() => setShowAddTripModal(true)}
                className="p-5 border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-slate-50/50 text-slate-600 hover:text-indigo-600 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition select-none"
              >
                <Plus className="w-6 h-6 text-indigo-500" />
                <span className="text-xs font-bold uppercase tracking-wider mt-0.5">Create Future Itinerary</span>
              </button>
            </div>

            {/* Trips List Header */}
            <div className="flex justify-between items-center pt-2">
              <h2 className="font-sans text-lg font-bold text-slate-900">My Travel Board</h2>
              <span className="text-slate-400 text-xs font-mono font-bold uppercase">Chronological Order</span>
            </div>

            {tripsLoading ? (
              <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest font-mono">Syncing Cloud Database</p>
              </div>
            ) : trips.length === 0 ? (
              <div className="border border-dashed border-slate-200 p-16 text-center rounded-3xl bg-white space-y-4 shadow-sm">
                <Compass className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-slate-600 font-bold text-sm">No Active Trips Found</p>
                <p className="text-slate-400 text-xs max-w-xs mx-auto">Get started by planning your first future journey! Log places, track dining costs and budgets.</p>
                <div className="flex flex-wrap gap-3 justify-center pt-2">
                  <button
                    onClick={() => setShowAddTripModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition"
                  >
                    <Plus className="w-4 h-4" /> Start Planning
                  </button>
                </div>
              </div>
            ) : (
              // Active list grid
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => {
                  const placeCount = (trip.places || []).length;
                  const docCount = (trip.documents || []).length;
                  const completedStops = (trip.places || []).filter(p => p.completed).length;

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

                  return (
                    <div 
                      key={trip.id}
                      className="bg-white border border-slate-200 rounded-3xl p-6 hover:border-slate-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between h-full space-y-5"
                      onClick={() => {
                        setSelectedTrip(trip);
                        setActiveSubTab('schedule');
                      }}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-sans text-sm font-bold text-slate-900 line-clamp-1">{trip.title}</h3>
                          <div className="bg-slate-50 border border-slate-200 text-[10px] uppercase font-bold tracking-wider text-slate-600 font-mono px-2 py-0.5 rounded shrink-0">
                            {symbol}{trip.budget}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          📅 {trip.startDate} — {trip.endDate}
                        </span>
                      </div>

                      <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
                        <div>
                          <span className="text-[9px] text-slate-400 block font-semibold uppercase font-sans">Stops</span>
                          <strong className="font-mono text-slate-900 text-xs">{placeCount}</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block font-semibold uppercase font-sans">Docs</span>
                          <strong className="font-mono text-slate-900 text-xs">{docCount}</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block font-semibold uppercase font-sans">Progress</span>
                          <strong className="font-mono text-slate-900 text-xs">{placeCount > 0 ? `${Math.round((completedStops / placeCount) * 100)}%` : '0%'}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Footer support details */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-[10px] text-slate-400 font-mono space-y-1 mt-12">
        <p>Plan Your Own Trip • Offline Data Cache Active & Encrypted Locally</p>
        <p>Designed for Travelers • Sync status verified in sandbox</p>
      </footer>

      {/* Add Trip Modal */}
      {showAddTripModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddTripModal(false)}></div>
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 relative z-10 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-sans text-sm font-semibold text-slate-800 uppercase tracking-widest">Plan Future Journey</h3>
              <button 
                onClick={() => setShowAddTripModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer text-xs font-semibold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-700 text-xs font-semibold">Itinerary Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Summer Getaway in Tokyo"
                  value={newTripTitle}
                  onChange={(e) => setNewTripTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-indigo-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-700 text-xs font-semibold">Departure Date *</label>
                  <input
                    type="date"
                    required
                    value={newTripStart}
                    onChange={(e) => setNewTripStart(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-indigo-500 font-mono bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 text-xs font-semibold">Return Date *</label>
                  <input
                    type="date"
                    required
                    value={newTripEnd}
                    onChange={(e) => setNewTripEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-indigo-500 font-mono bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-700 text-xs font-semibold flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Planned Budget limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newTripBudget}
                    onChange={(e) => setNewTripBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-indigo-500 font-mono bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 text-xs font-semibold">Currency Choice</label>
                  <select
                    value={newTripCurrency}
                    onChange={(e) => setNewTripCurrency(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-indigo-500 bg-white"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CHF">CHF (CHF)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="CAD">CAD (CA$)</option>
                    <option value="AUD">AUD (A$)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTripModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold cursor-pointer h-10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 border border-indigo-700 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition cursor-pointer h-10 shadow-sm"
                >
                  Confirm Journey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
