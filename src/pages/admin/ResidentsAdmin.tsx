import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail,
  UserCheck
} from 'lucide-react';
import { useBarangayStore } from '../../hooks/useBarangayStore';

export const ResidentsAdmin: React.FC = () => {
  const { allProfiles, allRequests, store } = useBarangayStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all');

  const residents = allProfiles.filter(p => p.role === 'resident');

  const filtered = residents.filter(r => {
    const q = searchQuery.toLowerCase().trim();
    const matches = !q ||
      r.full_name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.complete_address.toLowerCase().includes(q) ||
      r.sitio_purok.toLowerCase().includes(q);

    if (!matches) return false;

    if (filterVerified === 'verified') return r.is_verified;
    if (filterVerified === 'unverified') return !r.is_verified;
    return true;
  });

  const handleToggleVerification = (residentId: string, currentStatus: boolean) => {
    store.verifyResident(residentId, !currentStatus);
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Registry of Barangay Inhabitants (RBI)</h1>
          <p className="text-xs text-slate-700 mt-0.5">
            Authenticate citizen residency status, manage contact details, and review citizen filing histories.
          </p>
        </div>
        <div className="px-3.5 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 font-bold text-xs flex items-center">
          <Users className="w-4 h-4 mr-1.5" />
          {residents.length} Registered Citizens
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by resident name, email, street, or purok..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'verified', 'unverified'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterVerified(tab)}
              className={`px-3 py-2 rounded-xl font-semibold capitalize transition ${
                filterVerified === tab
                  ? 'bg-blue-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Residents Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Resident Citizen</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4">Purok & Address</th>
                <th className="py-3 px-4">Residency</th>
                <th className="py-3 px-4">RBI Status</th>
                <th className="py-3 px-4">Requests</th>
                <th className="py-3 px-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-700 italic">
                    No resident records found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((res) => {
                  const reqCount = allRequests.filter(r => r.resident_id === res.id).length;

                  return (
                    <tr key={res.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{res.full_name}</div>
                        <div className="text-[10px] text-slate-600">ID: {res.id}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 space-y-0.5">
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-1 text-slate-600" />
                          {res.mobile_number}
                        </div>
                        <div className="flex items-center text-slate-600">
                          <Mail className="w-3 h-3 mr-1 text-slate-600" />
                          {res.email}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="font-semibold text-slate-900">{res.sitio_purok}</div>
                        <div className="text-[11px] text-slate-600 truncate max-w-xs">{res.complete_address}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700">
                        <strong>{res.residency_years || 1}</strong> yrs • {res.civil_status || 'Single'}
                      </td>

                      <td className="py-3.5 px-4">
                        {res.is_verified ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                            Verified RBI
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-800">
                            Unverified
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {reqCount} {reqCount === 1 ? 'request' : 'requests'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleToggleVerification(res.id, res.is_verified)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            res.is_verified
                              ? 'bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                          }`}
                        >
                          {res.is_verified ? 'Revoke Verification' : 'Verify Resident'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
