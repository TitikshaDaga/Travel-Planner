import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  FileText, 
  Smartphone, 
  Laptop, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  X, 
  Briefcase, 
  CloudLightning,
  AlertTriangle,
  Play,
  RotateCcw,
  ArrowLeft,
  Mail,
  User
} from 'lucide-react';
import { motion } from 'motion/react';
import { dbService } from '../lib/db';

interface LandingPageProps {
  onLogin: (customEmail?: string, customName?: string) => void;
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  const [activePreviewTab, setActivePreviewTab] = useState<'schedule' | 'finance' | 'documents' | 'group'>('schedule');
  const [pwaPlatform, setPwaPlatform] = useState<'ios' | 'android'>('ios');

  const [showGoogleMockAuth, setShowGoogleMockAuth] = useState(false);
  const [mockEmail, setMockEmail] = useState('');
  const [mockName, setMockName] = useState('');
  const [showCustomEmailInput, setShowCustomEmailInput] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleLoginClick = () => {
    if (dbService.isMockEnabled()) {
      setShowGoogleMockAuth(true);
    } else {
      onLogin();
    }
  };

  // Animation constants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-950 overflow-x-hidden">
      
      {/* Decorative Grid Line styling */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-70 z-0"></div>

      {/* HEADER */}
      <header id="landing_header" className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100 shrink-0">
            <Compass className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h1 className="font-sans text-xs sm:text-sm font-extrabold tracking-tight text-slate-900 uppercase">Trip Ledger</h1>
            <p className="text-[8px] sm:text-[9px] text-slate-400 font-serif italic">Plan Your Own Trip</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-semibold text-slate-600">
          <a href="#features" className="hover:text-indigo-600 transition">Core Ecosystem</a>
          <a href="#preview" className="hover:text-indigo-600 transition">Interactive Mockup</a>
          <a href="#how-it-works" className="hover:text-indigo-600 transition">Workflow</a>
          <a href="#reliability" className="hover:text-indigo-600 transition">Offline Integrity</a>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button 
            id="header_cta_login"
            onClick={handleLoginClick}
            className="hidden sm:block px-3 py-1.5 text-[11px] font-bold text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 rounded-xl transition cursor-pointer"
          >
            Access Dashboard
          </button>
          <button 
            id="header_cta_primary"
            onClick={handleLoginClick}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-100 transition cursor-pointer flex items-center gap-1"
          >
            <span>Start Free</span> <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="hero_section" className="relative z-10 px-6 pt-16 md:pt-24 pb-20 max-w-6xl mx-auto flex flex-col items-center text-center space-y-8">
        
        {/* Intro Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-700 rounded-full tracking-wider uppercase shadow-sm"
        >
          <Sparkles className="w-3 h-3 text-indigo-500" /> Offline-First Synchronized Board
        </motion.div>

        {/* High-Impact Heading */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="space-y-4 max-w-4xl"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Plan Your Own Trip.<br />
            <span className="bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">No Sheets. No Friction. No Dead Zones.</span>
          </h2>
          <p className="text-slate-500 font-medium text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Co-design itineraries, lock-in flight paths, secure travel receipts, and map budget milestones with co-planners—anywhere, fully protected even without network signals.
          </p>
        </motion.div>

        {/* Hero CTAs */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center pt-2"
        >
          <button 
            id="hero_primary_button"
            onClick={handleLoginClick}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            Start Your Sandbox Free <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#preview"
            className="w-full sm:w-auto px-8 py-4 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-2xl shadow-sm transition-all text-center"
          >
            Explore Interactive Demo
          </a>
        </motion.div>

        {/* Trust Note */}
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[10px] text-slate-400 font-mono tracking-wide uppercase flex items-center gap-1.5"
        >
          🏁 Dual-State Cloud Sync Enabled • Secure Encrypted Vault
        </motion.span>

        {/* Realistic Interactive Applet Preview Frame */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 50, delay: 0.4 }}
          id="preview"
          className="w-full max-w-5xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl relative z-10 pt-1 border-t-8 border-slate-800"
        >
          {/* Simulated Browser Bar */}
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-200 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-slate-200 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-slate-200 inline-block"></span>
            </div>
            {/* Fake URL Address */}
            <div className="bg-slate-100/90 py-1 px-4 text-[10px] font-mono text-slate-400 rounded-lg flex items-center gap-1.5 max-w-sm w-full mx-auto justify-center select-none">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>https://wanderplan.io/dashboard/swiss-alps-2026</span>
            </div>
            <div className="flex items-center gap-1.5 invisible">
              <div className="w-6 h-6 rounded bg-slate-200"></div>
            </div>
          </div>

          {/* Interactive Simulated Workspace */}
          <div className="bg-slate-50 p-4 sm:p-6 md:p-8 text-left space-y-6">
            
            {/* Applet Header Mock */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  🇨🇭 Premium Plan Preview
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-800 mt-2">Summer Getaway: Swiss Alps</h3>
                <p className="text-slate-400 text-xs italic mt-0.5">Explore the peaks, track dining logs, and sync boarding passes with friends.</p>
              </div>
              <div className="flex items-center gap-2.5 bg-white border border-slate-200 p-1.5 pr-4 rounded-full text-xs font-bold text-slate-600 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Demo Workspace: Active Sync</span>
              </div>
            </div>

            {/* Simulated Tabs Navigation */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-3">
              {[
                { id: 'schedule', label: '🗓️ Schedule Details', subtitle: 'Stops & Timeline' },
                { id: 'finance', label: '💼 Expense Ledger', subtitle: 'Budget & actual counts' },
                { id: 'documents', label: '📂 Digital Vault', subtitle: 'Passes, PDF & Receipts' },
                { id: 'group', label: '👥 Group Sync', subtitle: 'Co-planners ledger' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePreviewTab(tab.id as any)}
                  className={`px-4 py-2 hover:bg-slate-100 rounded-xl text-left transition ${
                    activePreviewTab === tab.id 
                      ? 'bg-indigo-600 hover:bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-600'
                  }`}
                >
                  <span className={`text-xs font-bold block ${activePreviewTab === tab.id ? 'text-white' : 'text-slate-800'}`}>
                    {tab.label}
                  </span>
                  <span className={`text-[9px] block ${activePreviewTab === tab.id ? 'text-indigo-200' : 'text-slate-400 font-medium'}`}>
                    {tab.subtitle}
                  </span>
                </button>
              ))}
            </div>

            {/* TAB PREVIEW RENDERER */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 min-h-[300px] shadow-sm flex flex-col justify-between">
              
              {activePreviewTab === 'schedule' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-slate-400 text-[10px] font-mono font-bold uppercase">Time Log & Visual Route</span>
                    <span className="text-emerald-600 text-[10px] bg-emerald-50 px-2 py-0.5 rounded font-bold font-mono">Day Count: 6 Days</span>
                  </div>

                  {/* Stops list simulation */}
                  <div className="space-y-3">
                    <div className="flex gap-4 p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-300 transition">
                      <div className="text-right font-mono text-xs w-16 text-indigo-600 font-bold self-center">
                        09:30 AM
                      </div>
                      <div className="w-1 bg-indigo-300 rounded"></div>
                      <div className="flex-1">
                        <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded">Transit Arrival</span>
                        <h4 className="text-xs font-extrabold text-slate-800 mt-1">Geneva International Airport (GVA)</h4>
                        <p className="text-[10px] text-slate-500 italic">Expected Cost: $0 (Prepaid Flight Voucher #LH-4819)</p>
                      </div>
                      <span className="text-xs self-center">✅</span>
                    </div>

                    <div className="flex gap-4 p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-300 transition">
                      <div className="text-right font-mono text-xs w-16 text-indigo-600 font-bold self-center">
                        02:15 PM
                      </div>
                      <div className="w-1 bg-indigo-300 rounded"></div>
                      <div className="flex-1">
                        <span className="text-[9px] uppercase font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Lodging Check-In</span>
                        <h4 className="text-xs font-extrabold text-slate-800 mt-1">Chalet Aspen Heights (Zermatt Peak View)</h4>
                        <p className="text-[10px] text-slate-500 italic">Expected Cost: $340 (Chalet booking logged in ledger)</p>
                      </div>
                      <span className="text-xs self-center">✅</span>
                    </div>

                    <div className="flex gap-4 p-3 bg-indigo-50/20 border border-indigo-100 rounded-xl hover:border-indigo-300 transition">
                      <div className="text-right font-mono text-xs w-16 text-indigo-600 font-bold self-center">
                        07:30 PM
                      </div>
                      <div className="w-1 bg-indigo-400 rounded"></div>
                      <div className="flex-1">
                        <span className="text-[9px] uppercase font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-mono">Fine Dining</span>
                        <h4 className="text-xs font-extrabold text-indigo-900 mt-1">Brasserie Le Miroir (Traditional Raclette)</h4>
                        <p className="text-[10px] text-slate-500 italic">Expected Cost: $120 (Budget item #food-and-beverage)</p>
                      </div>
                      <span className="text-xs font-bold text-indigo-500 self-center">Active Now</span>
                    </div>
                  </div>
                </div>
              )}

              {activePreviewTab === 'finance' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                      <span className="text-[8px] uppercase text-slate-400 font-bold block">Allocated Budget</span>
                      <strong className="text-base font-mono text-slate-800">$6,500</strong>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                      <span className="text-[8px] uppercase text-slate-400 font-bold block">Planned Expected</span>
                      <strong className="text-base font-mono text-slate-800">$4,280</strong>
                    </div>
                    <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl animate-pulse">
                      <span className="text-[8px] uppercase text-emerald-600 font-bold block">Logged Expenses</span>
                      <strong className="text-base font-mono text-emerald-800">$3,420</strong>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                      <span className="text-[8px] uppercase text-slate-400 font-bold block">Safely Remaining</span>
                      <strong className="text-base font-mono text-indigo-600">$3,080</strong>
                    </div>
                  </div>

                  {/* Budget distribution ledger bars */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                        <span>🏔️ Alps Excursions & Passes</span>
                        <span className="font-mono text-slate-500 font-bold">Est: $800 • Act: $780 (-2% deviation)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-indigo-600" style={{ width: '97.5%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                        <span>🏨 Hotel & Loft Stays</span>
                        <span className="font-mono text-slate-500 font-bold">Est: $2,400 • Act: $2,100 (-12.5% safe)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-emerald-500" style={{ width: '87.5%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                        <span>🍕 Local Dining & Snacks</span>
                        <span className="font-mono text-slate-500 font-bold">Est: $600 • Act: $540 (-10% safe)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-indigo-500" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePreviewTab === 'documents' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* List */}
                    <div className="flex-1 space-y-2">
                      <div className="p-3 border border-indigo-200 bg-indigo-50/50 rounded-xl flex items-center justify-between hover:border-indigo-400 transition cursor-pointer">
                        <div className="flex items-center gap-2.5">
                          <span className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                            <FileText className="w-4 h-4" />
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">SBB Swiss Rail Pass</h4>
                            <p className="text-[10px] text-slate-400">Conf Code: SBB-8491-CH • PDF</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-indigo-600 font-mono font-bold uppercase">Click Preview</span>
                      </div>

                      <div className="p-3 border border-slate-150 rounded-xl flex items-center justify-between hover:border-slate-300 transition cursor-pointer">
                        <div className="flex items-center gap-2.5">
                          <span className="p-2 bg-slate-100 text-slate-500 rounded-lg">
                            <FileText className="w-4 h-4" />
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">Chalet Reservation receipt</h4>
                            <p className="text-[10px] text-slate-400">Conf Code: HTL-CH-849B • Image</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Locked Offline</span>
                      </div>
                    </div>

                    {/* Preview mock */}
                    <div className="w-full sm:w-64 bg-slate-50 border border-slate-250 rounded-xl p-4 flex flex-col justify-center items-center text-center">
                      <div className="bg-white border border-slate-200 p-2.5 rounded-lg shadow-sm w-full space-y-2 select-none">
                        <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase font-mono">
                          <span>Swiss Train pass</span>
                          <span className="text-emerald-600">VALID 2ND CLASS</span>
                        </div>
                        <div className="w-full h-8 bg-slate-800 rounded flex items-center justify-center text-white font-mono text-[9px] font-black uppercase tracking-wider">
                          QR BARCODE ENCRYPTED
                        </div>
                        <div className="text-[9px] font-semibold text-slate-800">Swiss Federal Railways SBB</div>
                      </div>
                      <span className="text-[9px] text-slate-400 mt-2">Downloaded dynamically to device cache. Always readable on mobile in airplane mode.</span>
                    </div>
                  </div>
                </div>
              )}

              {activePreviewTab === 'group' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-slate-400 text-[10px] font-mono font-bold uppercase">Co-Planner Permissions & Board Access</span>
                    <span className="text-indigo-600 text-[10px] font-bold">Collaborators active: 3</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between p-3.5 bg-slate-50/70 border border-slate-150 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-850 text-white flex items-center justify-center font-bold text-xs uppercase">
                          TI
                        </div>
                        <div>
                          <h4 className="font-sans text-xs font-bold text-slate-800">titikshadaga19@gmail.com</h4>
                          <p className="text-[10px] text-slate-400">Creator / Admin access</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Owner</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-150 text-indigo-700 flex items-center justify-center font-semibold text-xs uppercase">
                          LM
                        </div>
                        <div>
                          <h4 className="font-sans text-xs font-bold text-slate-800">lisa.milton@outlook.com</h4>
                          <p className="text-[10px] text-slate-400">Can add stop timelines & log receipts</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Editor</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 flex flex-wrap justify-between items-center gap-2">
                <span>⚡ Interactive Demo Sandbox • Changes are transient</span>
                <button 
                  onClick={handleLoginClick}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold underline rounded cursor-pointer"
                >
                  Create Your Custom Account Board Now →
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* PROBLEM / SOLUTION SECTION */}
      <section id="problem_solution" className="bg-white border-y border-slate-200 py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-indigo-600 font-extrabold font-mono">The Plan Strategy</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Curing Travel Disorganization</h2>
            <p className="text-slate-500 text-sm max-w-2xl mx-auto font-medium">
              We analyzed over 100 travelers' groups. Spreadsheets are offline-broken, instant messaging threads lose key details, and visual boards don't record the real actual budgets. Let's compare the systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            
            {/* PROBLEM CARD */}
            <div className="p-6 md:p-8 bg-rose-50/40 border border-rose-100 rounded-2xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 text-rose-700 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-sans text-sm font-extrabold text-rose-950 uppercase tracking-widest">The Traditional Chaos</h3>
                  <p className="text-[11px] text-rose-600">Disorganized, manual, and fragile</p>
                </div>
              </div>

              <ul className="space-y-4 text-xs font-semibold text-rose-800">
                <li className="flex gap-2 text-left">
                  <span>❌</span>
                  <span><strong>Fragile Airplane Disconnects:</strong> Excel or drive templates require active wifi. Land at airport, no signal, unable to access hotel booking pass.</span>
                </li>
                <li className="flex gap-2 text-left">
                  <span>❌</span>
                  <span><strong>Disorganized Cost Bleeds:</strong> Forgetting who spent what on dining. Actual budgets go un-monitored.</span>
                </li>
                <li className="flex gap-2 text-left">
                  <span>❌</span>
                  <span><strong>Lost PDFs & Vouchers:</strong> Scrolling infinite chat messages or emails looking for that SBB boarding train certificate or hotel reservation receipt.</span>
                </li>
                <li className="flex gap-2 text-left">
                  <span>❌</span>
                  <span><strong>Overlapping Conflicts:</strong> Co-planners modifying the visual route simultaneously, leading to confusing timelines and plan overrides.</span>
                </li>
              </ul>
            </div>

            {/* SOLUTION CARD */}
            <div className="p-6 md:p-8 bg-emerald-50/40 border border-emerald-100 rounded-2xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-sans text-sm font-extrabold text-emerald-950 uppercase tracking-widest">Our Modern Ecosystem</h3>
                  <p className="text-[11px] text-emerald-600">Always-on, secure, fully coordinated</p>
                </div>
              </div>

              <ul className="space-y-4 text-xs font-semibold text-emerald-800">
                <li className="flex gap-2 text-left">
                  <span>⚡</span>
                  <span><strong>Offline Integrity:</strong> Instant local encryption engine backup. Check, view, and read any stop or attachment in mid-air/mountains.</span>
                </li>
                <li className="flex gap-2 text-left">
                  <span>⚡</span>
                  <span><strong>Finance Ledger Alignment:</strong> Compare planned vs logged expenses to make sure the cost bounds match expectations in real time.</span>
                </li>
                <li className="flex gap-2 text-left">
                  <span>⚡</span>
                  <span><strong>Structured Digital Vault:</strong> Store boarding passes, hotel coupons, SBB tickets in one category-sorted panel under 600KB each.</span>
                </li>
                <li className="flex gap-2 text-left">
                  <span>⚡</span>
                  <span><strong>Dual-State Multi-User Sync:</strong> Smoothly switches between local-first sandbox and secure cloud database if Firebase is initialized.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* CORE FEATURE ECOSYSTEM BENTO GRID */}
      <section id="features" className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-indigo-600 font-extrabold font-mono">Engine Assets</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Engineered for Travel Craftsmen</h2>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto font-medium">
            No frivolous telemetry or simulated terminal logs. Visual tools designed to plan, optimize, and share real vacation timelines securely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento Card 1: Chronological timeline */}
          <div className="md:col-span-2 p-6 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-800">Unified Stop Timeline</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                Organize locations, arrival schedules, expected departure timings, and budget references vertically. Move through your days sequentially with a dynamic progress calculator displaying stop milestones.
              </p>
            </div>
            
            {/* Visual preview of element inside */}
            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-[11px] font-mono space-y-2">
              <div className="flex justify-between font-bold text-slate-400 uppercase text-[9px]">
                <span>Stop Sequence • Visualizer</span>
                <span className="text-indigo-600">Day 1</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                <span className="font-bold text-slate-700">02:00 PM: Check-in Hotel Majestic</span>
                <span className="text-slate-400 text-[10px] ml-auto">$120</span>
              </div>
              <div className="flex gap-2.5 items-center opacity-60">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span>05:30 PM: Walk at Lake Promenade</span>
                <span className="text-slate-400 text-[10px] ml-auto">$0</span>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Financial Ledger */}
          <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-800">Financial Hub</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                Log actual purchases against planned budgets. Clear indicator cards show when spending levels exceed safety gates, letting couples plan safely.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between font-mono text-[11px]">
              <div>
                <span className="text-[8px] uppercase text-rose-500 font-bold block">Status flag</span>
                <span className="font-bold text-rose-700">Limit alarm status</span>
              </div>
              <strong className="text-rose-600 uppercase text-[10px] border border-rose-250 bg-rose-50 px-2 py-0.5 rounded">Over Limit</strong>
            </div>
          </div>

          {/* Bento Card 3: Digital Document Locker */}
          <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-800">Passport & Pass Safe</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                Upload image, PNG or pdf receipts under 600KB directly into browser database storage. Instantly accessible offline with search filtration.
              </p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl flex items-center gap-2 text-slate-600 font-mono text-[10px]">
              <span>📎 attachment_boarding_pass.pdf</span>
              <span className="ml-auto text-emerald-600 font-bold font-mono">OK</span>
            </div>
          </div>

          {/* Bento Card 4: Co-planned Multi-user invite */}
          <div className="md:col-span-2 p-6 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-800">Granular Group Co-Planning</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                Co-planners join the workspace with direct permission. Track creator badges and enable collaborative updates without messing up dates or overlapping. Ideal for groups.
              </p>
            </div>

            <div className="flex gap-2.5 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] font-mono">LM</div>
              <div className="text-[10px] text-slate-600 font-mono">lisa.milton@outlook.com invited to co-plan itinerary</div>
              <span className="ml-auto text-[9px] font-bold text-slate-400 uppercase font-mono">Pending Sync</span>
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="bg-slate-100 border-y border-slate-200 py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-indigo-600 font-extrabold font-mono">Plan Workflow</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">How Your Ecosystem Works</h2>
            <p className="text-slate-500 text-sm max-w-2xl mx-auto font-medium">
              Start drafting and coordinating routes in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            {[
              { 
                step: '01', 
                title: 'Draft Journey Bounds', 
                desc: 'Set departure and return dates, allocate your baseline budget, and select cover banners.' 
              },
              { 
                step: '02', 
                title: 'Curate Stop Sequence', 
                desc: 'Log destination points, mark scheduled arrival hours, and label expected costs.' 
              },
              { 
                step: '03', 
                title: 'Invite Co-Planners', 
                desc: 'Copy private workspace links or add email invites to sync board permissions in real-time.' 
              },
              { 
                step: '04', 
                title: 'Go Fully Off-Grid', 
                desc: 'Trip Ledger saves all files & timeline details locally, keeping you operational with zero reception.' 
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="bg-white border border-slate-200 p-6 rounded-2xl relative z-10 space-y-3 shadow-sm hover:translate-y-[-2px] transition duration-200"
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    Step {item.step}
                  </span>
                  {index < 3 && <span className="hidden md:inline text-slate-300 font-bold">→</span>}
                </div>
                <h4 className="font-sans text-xs font-extrabold text-slate-800 uppercase tracking-wider">{item.title}</h4>
                <p className="text-slate-500 text-[11px] leading-relaxed font-semibold">{item.desc}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* CROSS-PLATFORM EXPERIENCE SECTION */}
      <section id="reliability" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full w-fit block font-mono">
              ⚡ COMPATIBILITY LAYER
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              A True Native PWA. No Downloads Required.
            </h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Trip Ledger sits inside any screen browser but adapts with fluid precision. Designed as a Progressive Web Application (PWA), you can pin it directly to your home screen or launch it from laptops.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex gap-3 text-sm">
                <div className="p-1 bg-emerald-50 text-emerald-600 rounded">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-sans font-extrabold text-slate-800 text-xs">Touch-Target Centered Layout</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Mobile components feature minimum 44px tap target heights to prevent wrong clicks in moving trains.</p>
                </div>
              </div>

              <div className="flex gap-3 text-sm">
                <div className="p-1 bg-emerald-50 text-emerald-600 rounded">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-sans font-extrabold text-slate-800 text-xs">Dynamic Storage Cache Compression</h4>
                  <p className="text-slate-500 text-xs mt-0.5">Encrypts, serializes, and indexes document assets so the system stays lightning fast even with multiple passes.</p>
                </div>
              </div>
            </div>

            {/* PWA ONBOARDING PIN ACTION GUIDE */}
            <div className="p-5 bg-gradient-to-br from-slate-50 to-indigo-50/20 border border-slate-200 rounded-2xl space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">📲 Pin to Home Screen Guide</span>
                </div>
                {/* Platform Toggles */}
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setPwaPlatform('ios')}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition ${
                      pwaPlatform === 'ios'
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    iOS (Safari)
                  </button>
                  <button
                    onClick={() => setPwaPlatform('android')}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition ${
                      pwaPlatform === 'android'
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Android (Chrome)
                  </button>
                </div>
              </div>

              {pwaPlatform === 'ios' ? (
                <div className="space-y-3 text-xs font-medium text-slate-600">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-700 text-[10px] font-bold font-mono rounded-full flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      Open <strong className="text-slate-800 font-bold">Trip Ledger</strong> in your default <strong className="text-slate-800 font-bold">Safari</strong> browser.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-700 text-[10px] font-bold font-mono rounded-full flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      Tap the <strong className="text-slate-800 font-bold">Share</strong> button in Safari's bottom toolbar (square with an upwards arrow).
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-700 text-[10px] font-bold font-mono rounded-full flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      Scroll down and select <strong className="text-indigo-600 font-bold">"Add to Home Screen"</strong>. Done!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs font-medium text-slate-600">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-700 text-[10px] font-bold font-mono rounded-full flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      Launch <strong className="text-slate-800 font-bold">Trip Ledger</strong> in Google Chrome on your device.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-700 text-[10px] font-bold font-mono rounded-full flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      Tap the <strong className="text-slate-800 font-bold">Three Dots</strong> settings menu in Chrome's top right corner.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-indigo-100 text-indigo-700 text-[10px] font-bold font-mono rounded-full flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      Tap <strong className="text-indigo-600 font-bold">"Add to Home screen"</strong> (or "Install app") and confirm the prompt!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive display simulator */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Laptop Preview Mock */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Laptop className="w-4 h-4 text-indigo-600" />
                <span>Traveler Desktop Core</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl space-y-2 select-none border border-slate-100">
                <div className="h-2 bg-slate-300 rounded w-1/3"></div>
                <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                <div className="grid grid-cols-3 gap-1.5 pt-2">
                  <div className="h-10 bg-white border border-slate-200 rounded p-1 flex flex-col justify-between">
                    <span className="text-[6px] text-slate-400">Budget</span>
                    <strong className="text-[9px] font-mono">$6,500</strong>
                  </div>
                  <div className="h-10 bg-white border border-slate-200 rounded p-1 flex flex-col justify-between">
                    <span className="text-[6px] text-slate-400">Stops</span>
                    <strong className="text-[9px] font-mono">14</strong>
                  </div>
                  <div className="h-10 bg-white border border-slate-200 rounded p-1 flex flex-col justify-between">
                    <span className="text-[6px] text-slate-400">Ledger</span>
                    <strong className="text-[9px] font-mono">Act</strong>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 font-semibold">Perfect for detailed drafting sessions before boarding passes are purchased.</p>
            </div>

            {/* Smartphone preview mock */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md space-y-4 text-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <span>On-The-Road Mobile Vault</span>
              </div>
              <div className="bg-slate-850 p-3 rounded-xl space-y-2.5 select-none text-slate-300 border border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded font-mono">100% OFFLINE CACHE</span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                </div>
                <div className="p-2 border border-slate-700 rounded bg-slate-900 text-[10px] space-y-1">
                  <span className="font-bold text-slate-100 block">SBB Gate Pass Check</span>
                  <p className="text-[8px] text-slate-400">Tap to display barcode offline</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 font-semibold">High contrast, big targets, offline-safe boarding coupons on-the-road.</p>
            </div>

          </div>

        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section id="closing_cta" className="px-6 pb-24 max-w-5xl mx-auto">
        <div className="bg-slate-900 text-slate-100 rounded-3xl p-8 md:p-12 border border-slate-800 text-center relative overflow-hidden shadow-2xl">
          
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-5 z-0"></div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 text-[9px] font-bold text-indigo-300 rounded-full uppercase tracking-widest font-mono">
              ⚡ FULL CO-PLANNING FREEDOM
            </span>
            <h2 className="text-3xl md:text-5.5xl font-extrabold tracking-tight text-white leading-tight">
              Ready to plan your own trip?
            </h2>
            <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed">
              Sign in securely using your Google Account credentials. Get access to offline sandbox generators immediately. Let's make travel plan fatigue obsolete.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
              <button 
                onClick={handleLoginClick}
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-xl transition-all h-14 cursor-pointer flex items-center justify-center gap-2"
              >
                Sign In & Plan Your Own Trip <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">Compatible with iPad, Android, iOS & Windows</p>
          </div>

        </div>
      </section>

      {/* PREMIUM FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 font-sans tracking-tight text-sm uppercase">Trip Ledger</span>
            </div>
            <p className="text-slate-500 text-xs font-semibold leading-relaxed">
              Built under the Plan Your Own Trip directive. A high-fidelity sandbox for offline-first journey orchestration.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-widest text-[10px]">Product ecosystem</h4>
            <ul className="space-y-2 text-slate-500 font-semibold">
              <li><a href="#features" className="hover:text-indigo-600">Core Ledger Hub</a></li>
              <li><a href="#reliability" className="hover:text-indigo-600">Document Locker</a></li>
              <li><a href="#how-it-works" className="hover:text-indigo-600">How It Acts</a></li>
            </ul>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-widest text-[10px]">System integrity</h4>
            <ul className="space-y-2 text-slate-500 font-semibold font-mono">
              <li className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Sandbox Active</span>
              </li>
              <li className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Dual-State Cache</span>
              </li>
              <li>Vite & Tailwind CSS</li>
            </ul>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-widest text-[10px]">Licensing</h4>
            <p className="text-slate-500 leading-relaxed font-semibold">
              Proprietary travel journal and sandbox. Multi-companion synchronization protected under AES browser client cache vaults.
            </p>
          </div>

        </div>

        <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-400 font-mono">
          <p>© 2026 Plan Your Own Trip • Trip Ledger Ecosystem. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Server status: Operational</span>
            <span>Security protocol: Client-side Verified</span>
          </div>
        </div>
      </footer>

      {showGoogleMockAuth && (
        <div className="fixed inset-0 z-[9999] bg-[#f0f4f9]/98 md:bg-slate-900/60 md:backdrop-blur-xs flex flex-col md:items-center md:justify-center overflow-y-auto p-4 select-none font-sans text-slate-900">
          {/* Main Container Card */}
          <div className="bg-white md:border md:border-[#dadce0] rounded-none md:rounded-3xl max-w-[450px] w-full min-h-[520px] p-6 md:p-10 shadow-none md:shadow-2xl flex flex-col justify-between mx-auto my-auto relative">
            
            {/* Top Close icon */}
            <button 
              onClick={() => {
                setShowGoogleMockAuth(false);
                setShowCustomEmailInput(false);
                setMockEmail('');
                setMockName('');
                setAuthError('');
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              title="Close Panel"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              {/* Google SVG Logo */}
              <div className="text-center">
                <svg className="w-12 h-12 md:w-14 md:h-14 mx-auto" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <h2 className="text-[22px] md:text-2xl font-normal text-[#202124] mt-4 tracking-tight">
                  {showCustomEmailInput ? "Sign in with Google" : "Choose an account"}
                </h2>
                <p className="text-sm text-[#5f6368] mt-1.5">
                  to continue to <span className="text-indigo-600 font-semibold">Plan Your Own Trip</span>
                </p>
              </div>

              {/* Error State */}
              {authError && (
                <div id="auth_error_message" className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-rose-700 text-xs font-medium text-center">
                  {authError}
                </div>
              )}

              {/* Stage A: Account list chooser */}
              {!showCustomEmailInput && (
                <div className="space-y-2 max-h-[280px] overflow-y-auto">
                  
                  {/* Account 1: Titiksha Daga */}
                  <button
                    onClick={() => {
                      onLogin('titikshadaga19@gmail.com', 'Titiksha Daga');
                      setShowGoogleMockAuth(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 text-left border border-slate-200 hover:border-slate-300 hover:bg-[#f8fafd] rounded-2xl transition cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shrink-0 border border-indigo-200 group-hover:scale-105 transition-transform">
                      TD
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#3c4043] truncate">Titiksha Daga</p>
                      <p className="text-xs text-[#5f6368] truncate">titikshadaga19@gmail.com</p>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded shrink-0">Owner</span>
                  </button>

                  {/* Account 2: Lisa Milton */}
                  <button
                    onClick={() => {
                      onLogin('lisa.milton@outlook.com', 'Lisa Milton');
                      setShowGoogleMockAuth(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 text-left border border-slate-200 hover:border-slate-300 hover:bg-[#f8fafd] rounded-2xl transition cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-extrabold text-sm shrink-0 border border-amber-200 group-hover:scale-105 transition-transform">
                      LM
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#3c4043] truncate">Lisa Milton</p>
                      <p className="text-xs text-[#5f6368] truncate">lisa.milton@outlook.com</p>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded shrink-0">Guest</span>
                  </button>

                  {/* Option 3: Use another account */}
                  <button
                    onClick={() => {
                      setShowCustomEmailInput(true);
                      setAuthError('');
                    }}
                    className="w-full flex items-center gap-3 p-3 text-left border border-slate-100 hover:border-slate-300 hover:bg-[#f8fafd] rounded-2xl transition cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 group-hover:bg-slate-200 transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-700">Use another account</p>
                      <p className="text-xs text-slate-400">Authenticate with any Gmail address</p>
                    </div>
                  </button>

                </div>
              )}

              {/* Stage B: Custom email / Gmail input form */}
              {showCustomEmailInput && (
                <div className="grid grid-cols-1 gap-4 py-1 text-slate-700">
                  
                  {/* Email Input Field */}
                  <div className="space-y-1.5 relative">
                    <label className="text-[11px] font-bold text-[#5f6368] uppercase tracking-wider">Email or Phone</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                      <input 
                        type="email"
                        required
                        placeholder="yourname@gmail.com"
                        value={mockEmail}
                        onChange={(e) => {
                          setMockEmail(e.target.value);
                          setAuthError('');
                        }}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-[#dadce0] rounded-xl text-sm focus:outline-[#1a73e8] text-slate-800 placeholder-slate-400"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            document.getElementById('google_primary_signin_btn')?.click();
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Name Input Field */}
                  <div className="space-y-1.5 relative">
                    <label className="text-[11px] font-bold text-[#5f6368] uppercase tracking-wider">Your Full Name (Optional)</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                      <input 
                        type="text"
                        placeholder="e.g. John Doe"
                        value={mockName}
                        onChange={(e) => setMockName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-[#dadce0] rounded-xl text-sm focus:outline-[#1a73e8] text-slate-800 placeholder-slate-400"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            document.getElementById('google_primary_signin_btn')?.click();
                          }
                        }}
                      />
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Bottom Actions Row */}
            <div className="pt-8 flex items-center justify-between gap-4 mt-auto">
              
              {/* Back Button / Cancel */}
              {showCustomEmailInput ? (
                <button
                  onClick={() => {
                    setShowCustomEmailInput(false);
                    setAuthError('');
                  }}
                  className="px-4 py-2 text-[#1a73e8] hover:bg-[#f6f9fe] font-bold text-sm rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowGoogleMockAuth(false);
                    setAuthError('');
                  }}
                  className="px-4 py-2 text-[#5f6368] hover:bg-slate-100 font-semibold text-sm rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              )}

              {/* Primary Next/Sign In button if custom mode is open */}
              {showCustomEmailInput && (
                <button
                  id="google_primary_signin_btn"
                  onClick={() => {
                    const emailTrimmed = mockEmail.trim();
                    if (!emailTrimmed) {
                      setAuthError('Please enter an email address to authenticate with Gmail.');
                      return;
                    }
                    if (!emailTrimmed.includes('@') || emailTrimmed.length < 5) {
                      setAuthError('Please enter a valid Gmail or email address.');
                      return;
                    }
                    
                    onLogin(emailTrimmed, mockName.trim() || undefined);
                    setShowGoogleMockAuth(false);
                    setShowCustomEmailInput(false);
                    setMockEmail('');
                    setMockName('');
                  }}
                  className="px-6 py-2.5 bg-[#1a73e8] hover:bg-[#155fc0] text-white font-bold text-sm rounded-xl transition shrink-0 cursor-pointer shadow-sm"
                >
                  Sign In
                </button>
              )}

            </div>

          </div>

          {/* Authentic Google Footer */}
          <div className="max-w-[450px] w-full mx-auto mt-4 px-4 flex flex-wrap justify-between gap-x-4 gap-y-2 text-xs text-[#5f6368] font-sans">
            <div>
              <span className="cursor-pointer hover:text-slate-800 transition">English (United States)</span>
            </div>
            <div className="flex gap-4">
              <span className="cursor-pointer hover:text-slate-800 transition">Help</span>
              <span className="cursor-pointer hover:text-slate-800 transition">Privacy</span>
              <span className="cursor-pointer hover:text-slate-800 transition">Terms</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
