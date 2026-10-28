import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  CheckCircle2, 
  RotateCcw, 
  Building2,
  Phone,
  Mail,
  Clock,
  MapPin,
  Megaphone,
  UserCheck
} from 'lucide-react';
import { useBarangayStore } from '../../hooks/useBarangayStore';

export const SystemSettingsAdmin: React.FC = () => {
  const { systemSettings, store } = useBarangayStore();

  // Settings form
  const [barangayName, setBarangayName] = useState(systemSettings.barangay_name);
  const [cityMunicipality, setCityMunicipality] = useState(systemSettings.city_municipality);
  const [province, setProvince] = useState(systemSettings.province);
  const [barangayCaptain, setBarangayCaptain] = useState(systemSettings.barangay_captain);
  const [barangaySecretary, setBarangaySecretary] = useState(systemSettings.barangay_secretary);
  const [contactPhone, setContactPhone] = useState(systemSettings.contact_phone);
  const [contactEmail, setContactEmail] = useState(systemSettings.contact_email);
  const [officeHours, setOfficeHours] = useState(systemSettings.office_hours);
  const [hallAddress, setHallAddress] = useState(systemSettings.hall_address);
  const [emergencyAnnouncement, setEmergencyAnnouncement] = useState(systemSettings.emergency_announcement || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSystemSettings({
      barangay_name: barangayName,
      city_municipality: cityMunicipality,
      province,
      barangay_captain: barangayCaptain,
      barangay_secretary: barangaySecretary,
      contact_phone: contactPhone,
      contact_email: contactEmail,
      office_hours: officeHours,
      hall_address: hallAddress,
      emergency_announcement: emergencyAnnouncement
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all requests, audit logs, and demo accounts back to original factory initial state?')) {
      store.resetToDefaultData();
      alert('System data reset to initial demo state.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-900" />
            Barangay Identity & System Settings
          </h1>
          <p className="text-xs text-slate-700 mt-0.5">
            Configure local government identity, official signatories, hall contact details, and public advisories for Barangay Comod-om, Alcantara, Romblon.
          </p>
        </div>
        <button
          onClick={handleResetData}
          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center transition cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Reset Demo Data
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
          <span>System configuration and official signatories successfully updated.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveGeneral} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-xs">
        
        {/* Section 1: Official Barangay Identity */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
            <Building2 className="w-4 h-4 text-blue-900" />
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
              Local Government Unit Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Barangay Name *</label>
              <input
                type="text"
                required
                value={barangayName}
                onChange={(e) => setBarangayName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-600 font-medium"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Municipality / City *</label>
              <input
                type="text"
                required
                value={cityMunicipality}
                onChange={(e) => setCityMunicipality(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-600 font-medium"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Province *</label>
              <input
                type="text"
                required
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-600 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Official Signatories */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
            <UserCheck className="w-4 h-4 text-blue-900" />
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
              Official Signatories (Prints on Certificates)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Punong Barangay (Barangay Captain) *
              </label>
              <input
                type="text"
                required
                value={barangayCaptain}
                onChange={(e) => setBarangayCaptain(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-600 font-medium"
              />
              <span className="text-[10px] text-slate-600 mt-1 block">
                Official signature appearing on Clearances and Certificates of Residency.
              </span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Barangay Secretary / Attesting Officer *
              </label>
              <input
                type="text"
                required
                value={barangaySecretary}
                onChange={(e) => setBarangaySecretary(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-600 font-medium"
              />
              <span className="text-[10px] text-slate-600 mt-1 block">
                Attesting officer for verification, records screening, and release slips.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Contact & Hall Office Hours */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
            <Phone className="w-4 h-4 text-blue-900" />
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
              Barangay Hall Contact Channels & Office Hours
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Official Hotline / Mobile</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Official Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Office Operating Hours</label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={officeHours}
                  onChange={(e) => setOfficeHours(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Barangay Hall Physical Address</label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={hallAddress}
                  onChange={(e) => setHallAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Public Emergency Advisory */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
            <Megaphone className="w-4 h-4 text-blue-900" />
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
              Top Banner Public Advisory
            </h2>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Top Announcement Text (Leave blank to hide advisory strip)
            </label>
            <textarea
              rows={2}
              value={emergencyAnnouncement}
              onChange={(e) => setEmergencyAnnouncement(e.target.value)}
              placeholder="e.g. Schedule of free medical mission this Saturday at Barangay Gymnasium."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-600"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs transition flex items-center cursor-pointer"
          >
            <Save className="w-4 h-4 mr-1.5" />
            Save Identity Settings
          </button>
        </div>
      </form>

    </div>
  );
};
