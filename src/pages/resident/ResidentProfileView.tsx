import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  Save, 
  Wifi, 
  WifiOff, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { useBarangayStore } from '../../hooks/useBarangayStore';

interface ResidentProfileViewProps {
  onOpenPrivacy: () => void;
  onOpenHelp: () => void;
  onOpenAuth: () => void;
}

export const ResidentProfileView: React.FC<ResidentProfileViewProps> = ({
  onOpenPrivacy,
  onOpenHelp,
  onOpenAuth
}) => {
  const { currentUser, store, systemSettings } = useBarangayStore();

  const [mobileNumber, setMobileNumber] = useState(currentUser?.mobile_number || '');
  const [completeAddress, setCompleteAddress] = useState(currentUser?.complete_address || '');
  const [sitioPurok, setSitioPurok] = useState(currentUser?.sitio_purok || 'Purok 1');
  const [residencyYears, setResidencyYears] = useState(currentUser?.residency_years || 1);
  const [civilStatus, setCivilStatus] = useState(currentUser?.civil_status || 'Single');
  
  const [savedSuccess, setSavedSuccess] = useState(false);
  const isOnline = navigator.onLine;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateProfile({
      mobile_number: mobileNumber,
      complete_address: completeAddress,
      sitio_purok: sitioPurok,
      residency_years: residencyYears,
      civil_status: civilStatus
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-20 md:pb-8">
      
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-900 text-white font-black text-xl flex items-center justify-center shadow-md">
          {currentUser?.full_name ? currentUser.full_name.charAt(0) : 'R'}
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900">{currentUser?.full_name}</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-900 rounded-md uppercase">
              {currentUser?.role}
            </span>
          </div>
          <p className="text-xs text-slate-700">{currentUser?.email}</p>
        </div>
      </div>

      {/* Verification Status Banner */}
      <div className={`p-4 rounded-2xl border flex items-start space-x-3 text-xs ${
        currentUser?.is_verified
          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
          : 'bg-amber-50 border-amber-300 text-amber-900'
      }`}>
        {currentUser?.is_verified ? (
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        )}
        <div className="space-y-1">
          <div className="font-bold text-sm">
            {currentUser?.is_verified ? 'Verified Barangay Resident' : 'Residency Verification Pending'}
          </div>
          <p className="leading-relaxed">
            {currentUser?.is_verified
              ? `Your residency is officially authenticated with the Registry of Barangay Inhabitants (RBI). Verified records expedite document clearances.`
              : `Your account is active. To obtain "Verified Resident" standing, bring your original government ID or voter certification during your first document pickup at ${systemSettings.hall_address}.`}
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-xs shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-bold text-slate-900 text-sm">Residence & Contact Information</h2>
          {savedSuccess && (
            <span className="text-emerald-600 font-semibold text-xs flex items-center">
              <CheckCircle className="w-3.5 h-3.5 mr-1" />
              Changes Saved!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Philippine Mobile Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Sitio / Purok Zone</label>
            <input
              type="text"
              value={sitioPurok}
              onChange={(e) => setSitioPurok(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Complete House / Physical Address</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={completeAddress}
              onChange={(e) => setCompleteAddress(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Years of Residency</label>
            <input
              type="number"
              min="0"
              max="99"
              value={residencyYears}
              onChange={(e) => setResidencyYears(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Civil Status</label>
            <select
              value={civilStatus}
              onChange={(e) => setCivilStatus(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
            >
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Widowed">Widowed</option>
              <option value="Separated">Separated</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl flex items-center transition shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4 mr-1.5" />
            Save Profile Updates
          </button>
        </div>
      </form>

      {/* Network & Low-Connectivity Diagnostics */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 text-xs space-y-2">
        <h3 className="font-bold text-slate-900 flex items-center">
          {isOnline ? (
            <Wifi className="w-4 h-4 mr-1.5 text-emerald-800" />
          ) : (
            <WifiOff className="w-4 h-4 mr-1.5 text-red-600" />
          )}
          Network & Device Status (Mobile-Optimized)
        </h3>
        <p className="text-slate-700 leading-relaxed">
          Barangay360 is optimized for entry-level smartphones and 3G/4G connections. All data transactions use compressed payloads. Submissions are preserved safely during temporary signal drops.
        </p>
      </div>

      {/* Quick Action Links */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
        <div className="flex items-center justify-between py-1">
          <span className="text-slate-700">Philippine Data Privacy Act (RA 10173):</span>
          <button
            onClick={onOpenPrivacy}
            className="text-blue-900 font-bold underline hover:text-blue-950"
          >
            View Policy
          </button>
        </div>
        <div className="flex items-center justify-between py-1 border-t border-slate-200">
          <span className="text-slate-700">Barangay Citizen Helpdesk & Contact:</span>
          <button
            onClick={onOpenHelp}
            className="text-blue-900 font-bold underline hover:text-blue-950"
          >
            Hotlines & Office Hours
          </button>
        </div>
        <div className="flex items-center justify-between py-1 border-t border-slate-200">
          <span className="text-slate-700">Account Access:</span>
          <button
            onClick={onOpenAuth}
            className="text-red-700 font-bold hover:underline"
          >
            Switch / Sign In with Another Account
          </button>
        </div>
      </div>

    </div>
  );
};
