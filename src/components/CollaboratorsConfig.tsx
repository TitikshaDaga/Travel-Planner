import React, { useState } from 'react';
import { Trip } from '../types';
import { Users, UserPlus, Trash2, Mail, Copy, Check, Share2, HelpCircle } from 'lucide-react';

interface CollaboratorsConfigProps {
  trip: Trip;
  currentUserEmail: string;
  onUpdateTrip: (updated: Trip) => void;
}

export default function CollaboratorsConfig({ trip, currentUserEmail, onUpdateTrip }: CollaboratorsConfigProps) {
  const [newEmail, setNewEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [emailError, setEmailError] = useState('');

  const isOwner = trip.ownerEmail === currentUserEmail;

  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    // Basic email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    if (newEmail.toLowerCase() === trip.ownerEmail.toLowerCase()) {
      setEmailError('The owner is already the trip administrator.');
      return;
    }

    if (trip.collaborators.some(c => c.toLowerCase() === newEmail.toLowerCase())) {
      setEmailError('This user is already added as a collaborator.');
      return;
    }

    setEmailError('');
    const updatedCollabs = [...trip.collaborators, newEmail.trim().toLowerCase()];
    onUpdateTrip({
      ...trip,
      collaborators: updatedCollabs,
      updatedAt: new Date().toISOString()
    });
    setNewEmail('');
  };

  const handleRemoveCollaborator = (emailToRemove: string) => {
    if (!window.confirm(`Are you sure you want to remove collaborator ${emailToRemove}?`)) return;
    const updatedCollabs = trip.collaborators.filter(c => c !== emailToRemove);
    onUpdateTrip({
      ...trip,
      collaborators: updatedCollabs,
      updatedAt: new Date().toISOString()
    });
  };

  const handleCopyInvite = () => {
    const inviteText = `Hey! Join my trip itinerary "${trip.title}" (${trip.startDate} - ${trip.endDate}) on the Plan Your Own Trip Applet! Let's plan our locations, schedule and expenses together! Access link: ${window.location.href}`;
    navigator.clipboard.writeText(inviteText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="border border-slate-200 p-6 rounded-2xl bg-white space-y-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
            <Share2 className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400">Trip Co-Planning</h3>
            <h2 className="font-sans text-lg font-bold text-slate-850">Collaborate with Co-Planners</h2>
            <p className="text-slate-500 text-xs font-medium">Invite friends or family to configure routes, track budgets, and manage travel documents together.</p>
          </div>
        </div>

        {/* Copy Shareable Details */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
          <div className="space-y-1">
            <h4 className="font-sans text-xs font-bold text-slate-800 flex items-center gap-1.5">
              💡 Shareable Itinerary Package
            </h4>
            <p className="text-slate-500 text-xs font-medium">Share a summary of this trip outline with your travel companions.</p>
          </div>
          <button
            onClick={handleCopyInvite}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 border border-indigo-700 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition cursor-pointer w-full sm:w-auto justify-center shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Invite Package
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collaborators List */}
        <div className="lg:col-span-2 space-y-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-slate-550" /> Active Trip Members
          </h3>

          <div className="space-y-2.5">
            {/* Owner profile */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50/70 border border-slate-150 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-850 text-white flex items-center justify-center font-bold font-mono text-xs uppercase" title="Trip Creator">
                  {trip.ownerEmail.substring(0, 2)}
                </div>
                <div>
                  <h4 className="font-sans text-xs font-bold text-slate-800">{trip.ownerName || 'Trip Owner'}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{trip.ownerEmail}</p>
                </div>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-200 text-slate-705 rounded">
                Creator / Admin
              </span>
            </div>

            {/* List entries */}
            {trip.collaborators.length === 0 ? (
              <p className="text-center py-6 text-slate-400 text-xs">No co-planners joined yet. Work on the route together by adding a co-planner!</p>
            ) : (
              trip.collaborators.map((email) => (
                <div 
                  key={email}
                  className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl hover:border-slate-300 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100/50 border border-slate-200 text-slate-700 flex items-center justify-center font-bold font-mono text-xs uppercase">
                      {email.substring(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-sans text-xs font-bold text-slate-800 font-mono">{email}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">Collaborator access enabled</p>
                    </div>
                  </div>

                  {isOwner ? (
                    <button
                      onClick={() => handleRemoveCollaborator(email)}
                      className="p-2 border border-rose-100 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer min-w-10 min-h-10 flex items-center justify-center animate-fade-in"
                      title="Revoke access"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400">View Only access</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add co-planner panel */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl h-fit space-y-4 shadow-sm">
          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-slate-550" /> Share This Trip
          </h3>

          {isOwner ? (
            <form onSubmit={handleAddCollaborator} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-slate-700 text-xs font-semibold">Co-planner Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="travel.buddy@gmail.com"
                    value={newEmail}
                    onChange={(e) => {
                      setNewEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-indigo-500"
                  />
                </div>
                {emailError && <p className="text-rose-500 text-[10px] mt-1 font-semibold">{emailError}</p>}
              </div>

              <button
                type="submit"
                className="w-full h-10 bg-indigo-600 border border-indigo-750 hover:bg-indigo-750 text-white transition rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <UserPlus className="w-4 h-4" /> Enable Collaboration
              </button>
            </form>
          ) : (
            <div className="p-4 bg-amber-50 rounded-xl text-[11px] text-amber-800 space-y-1.5">
              <span className="font-bold block flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" /> Read-Only Membership
              </span>
              <p>Because you are not the administrator/owner of this trip, you cannot add or remove shared members. Contact trip creator ({trip.ownerEmail}) for administrative modifications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
