import React, { useState } from 'react';
import { Send, CheckCircle2, Megaphone, Users } from 'lucide-react';
import { useBarangayStore } from '../../hooks/useBarangayStore';

export const BroadcastAdmin: React.FC = () => {
  const { allProfiles, store, notifications } = useBarangayStore();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const residentsCount = allProfiles.filter(p => p.role === 'resident').length;

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    store.broadcastNotification(title.trim(), message.trim());
    setTitle('');
    setMessage('');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 4000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Citizen Broadcast & Public Advisories</h1>
          <p className="text-xs text-slate-700 mt-0.5">
            Dispatch announcements, schedule notices, and emergency advisories directly to all citizen mobile devices.
          </p>
        </div>
        <div className="px-3.5 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 font-bold text-xs flex items-center">
          <Users className="w-4 h-4 mr-1.5" />
          {residentsCount} Registered Citizens
        </div>
      </div>

      {sentSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
          Broadcast notice has been dispatched to {residentsCount} citizen accounts.
        </div>
      )}

      {/* Broadcast Composer */}
      <form onSubmit={handleBroadcast} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <div className="flex items-center space-x-2 text-blue-900 font-bold text-sm">
          <Megaphone className="w-4 h-4 text-amber-500" />
          <span>Compose Citizen Announcement</span>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Notice Title / Headline</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Schedule of Free Anti-Rabies Vaccination & Health Caravan"
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            required
          />
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Message Body</label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter complete instructions, venues, dates, and required documents..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            required
          />
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 space-y-1">
          <strong>Delivery Channel:</strong> In-app push notification with banner notification upon citizen login. SMS and Email gateway integration can be provisioned via System Settings.
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl flex items-center transition shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4 mr-1.5" />
            Dispatch Broadcast to All Citizens
          </button>
        </div>
      </form>

    </div>
  );
};
