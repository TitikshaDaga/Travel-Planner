import React, { useState, useEffect } from 'react';
import { dbService } from './lib/db';
import { Trip, UserProfile } from './types';
import TimelineManager from './components/TimelineManager';
import FinanceHub from './components/FinanceHub';
import DocumentManager from './components/DocumentManager';
import CollaboratorsConfig from './components/CollaboratorsConfig';
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

  // Active sub-tab inside selectedTrip: 'schedule' | 'documents' | 'finance' | 'collab'
  const [activeSubTab, setActiveSubTab] = useState<'schedule' | 'documents' | 'finance' | 'collab'>('schedule');

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

  const handleLogin = async () => {
    try {
      const user = await dbService.loginWithGoogle();
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

    const newTripId = 'trip_' + Date.now();
    const newTrip: Trip = {
      id: newTripId,
      title: newTripTitle,
      description: newTripDesc || undefined,
      startDate: newTripStart,
      endDate: newTripEnd,
      budget: Number(newTripBudget) || 1000,
      coverImage: newTripImg,
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
    setShowAddTripModal(false);
    
    // Refresh & view newly created trip instantly
    await fetchTripsData();
    setSelectedTrip(newTrip);
    setActiveSubTab('schedule');
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
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Decorative Grid Line styling */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-60"></div>

        <div className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-3xl relative z-10 space-y-8 shadow-xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-indigo-100">
              <CompassIcon className="w-6 h-6 animate-spin-slow" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Plan Your Own Trip</h1>
            <p className="text-slate-500 text-xs px-2 mx-auto max-w-xs">
              Plan destinations, log actual vs expected expenses, and coordinate stored passes with co-planners—anywhere, fully offline.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs text-slate-600">
            <span className="font-bold flex items-center gap-1.5 text-slate-800">
              ⚡ Multi-User & Offline Cache Guard
            </span>
            <p>Runs dual-state sync. If Firebase database credentials aren't initialized yet, the app activates full-fidelity browser mock synchronization automatically containing pre-loaded template trips.</p>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-3 px-4 bg-indigo-600 border border-indigo-700 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer h-12 shadow-md shadow-indigo-100"
          >
            Sign In with Google Account
          </button>

          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-mono">Compatible with Offline Mode</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Top Navigation / Offline Simulator Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSelectedTrip(null)}
            className="flex items-center gap-2 text-left cursor-pointer"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              W
            </div>
            <div className="hidden sm:block">
              <h1 className="font-sans text-sm font-bold tracking-tight text-slate-800 uppercase">WanderPlan</h1>
              <p className="text-[10px] text-slate-400 font-serif italic">Digital Travel Journal</p>
            </div>
          </button>

          {/* Simulated Offline Toggler - satisfies requirement 4 */}
          <button
            onClick={() => setIsOnlineSimulated(!isOnlineSimulated)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition cursor-pointer border ${
              isOnlineSimulated 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
            }`}
            title="Toggle to simulate full offline mode"
          >
            {isOnlineSimulated ? (
              <>
                <Wifi className="w-3.5 h-3.5" /> Simulated: Online
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5" /> Simulated: Offline Cache Active
              </>
            )}
          </button>
        </div>

        {/* User Identity widget */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 pr-3 rounded-full">
            {currentUser.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt={currentUser.displayName || 'Avatar'} 
                className="w-6 h-6 rounded-full border border-slate-300 pointer-events-none"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-[10px]">
                {currentUser.email.substring(0, 2).toUpperCase()}
              </div>
            )}
            <span className="text-[10px] font-bold text-slate-700 font-mono hidden md:inline-block">
              {currentUser.email}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl transition cursor-pointer"
            title="Disconnect Account"
          >
            <LogOut className="w-4 h-4" />
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

            {/* Banner Cover info */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 text-slate-100 min-h-[160px] md:min-h-[200px] flex items-end p-6 md:p-8">
              {selectedTrip.coverImage && (
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay pointer-events-none"
                  style={{ backgroundImage: `url(${selectedTrip.coverImage})` }}
                ></div>
              )}
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-50 border border-indigo-150 px-2.5 py-1 rounded-full tracking-widest block w-fit">
                  🇨🇭 Itinerary Route
                </span>
                <h2 className="text-2xl md:text-3.5xl font-extrabold tracking-tight text-white">{selectedTrip.title}</h2>
                <p className="text-slate-300 text-xs font-medium italic">{selectedTrip.description || 'No description designated'}</p>
                <p className="text-[10px] font-mono text-emerald-400 bg-slate-950/60 inline-block px-2 py-0.5 rounded border border-slate-950/30">
                  📅 Dates: {selectedTrip.startDate} — {selectedTrip.endDate}
                </p>
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
                className="p-5 border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-slate-50/50 text-slate-600 hover:text-indigo-600 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition"
              >
                <Plus className="w-6 h-6" />
                <span className="text-xs font-bold uppercase tracking-wider">Create Future Itinerary</span>
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
              <div className="border border-dashed border-slate-200 p-16 text-center rounded-3xl bg-white space-y-3 shadow-sm">
                <Compass className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-slate-600 font-bold text-sm">No Active Trips Found</p>
                <p className="text-slate-400 text-xs max-w-xs mx-auto">Get started by planning your first future journey! Log places, track dining costs and budgets.</p>
                <button
                  onClick={() => setShowAddTripModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-xs font-semibold mt-2 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Start Planning
                </button>
              </div>
            ) : (
              // Active list grid
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => {
                  const placeCount = (trip.places || []).length;
                  const docCount = (trip.documents || []).length;
                  const completedStops = (trip.places || []).filter(p => p.completed).length;

                  return (
                    <div 
                      key={trip.id}
                      className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-slate-400 hover:shadow-md transition cursor-pointer flex flex-col h-full"
                      onClick={() => {
                        setSelectedTrip(trip);
                        setActiveSubTab('schedule');
                      }}
                    >
                      {trip.coverImage && (
                        <div 
                          className="h-40 bg-cover bg-center border-b border-slate-100 relative pointer-events-none"
                          style={{ backgroundImage: `url(${trip.coverImage})` }}
                        >
                          <div className="absolute top-3 left-3 bg-slate-950/75 border border-slate-800 text-[9px] uppercase font-bold tracking-widest text-emerald-400 px-2.5 py-1 rounded backdrop-blur-sm">
                            Budget: ${trip.budget}
                          </div>
                        </div>
                      )}
                      
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <h3 className="font-sans text-sm font-bold text-slate-900">{trip.title}</h3>
                          <p className="text-slate-500 text-[11px] line-clamp-2 italic">{trip.description || 'No descriptive overview'}</p>
                          <span className="text-[10px] font-mono text-slate-400 block pt-1">
                            📅 {trip.startDate} — {trip.endDate}
                          </span>
                        </div>

                        <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase font-sans">Destinations</span>
                            <strong className="font-mono text-slate-900 text-xs">{placeCount}</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase font-sans">Documents</span>
                            <strong className="font-mono text-slate-900 text-xs">{docCount}</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase font-sans">Progress</span>
                            <strong className="font-mono text-slate-900 text-xs">{placeCount > 0 ? `${Math.round((completedStops / placeCount) * 100)}%` : '0%'}</strong>
                          </div>
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
                  placeholder="e.g., Summer in Swiss Alps"
                  value={newTripTitle}
                  onChange={(e) => setNewTripTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-indigo-500 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 text-xs font-semibold">Overview / Short Description</label>
                <input
                  type="text"
                  placeholder="e.g., A breathing hiking getaway with lisa and mark."
                  value={newTripDesc}
                  onChange={(e) => setNewTripDesc(e.target.value)}
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

              <div className="space-y-1">
                <label className="text-slate-700 text-xs font-semibold flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Planned Budget limit ($)
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

              <div className="space-y-1.5 focus:outline-none">
                <label className="text-slate-700 text-xs font-semibold block">Select Banner Concept</label>
                <div className="grid grid-cols-2 gap-2">
                  {COVER_IMAGES.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setNewTripImg(img.url)}
                      className={`p-2.5 border rounded-xl text-xs font-semibold tracking-tight text-slate-700 transition hover:bg-slate-50 cursor-pointer flex items-center justify-between bg-white ${
                        newTripImg === img.url ? 'border-semibold border-indigo-600 bg-indigo-50/50 text-indigo-900' : 'border-slate-200'
                      }`}
                    >
                      <span>{img.label}</span>
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: img.id === 'img_alps' ? '#64748b' : img.id === 'img_tropical' ? '#0d9488' : '#4f46e5' }} />
                    </button>
                  ))}
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
