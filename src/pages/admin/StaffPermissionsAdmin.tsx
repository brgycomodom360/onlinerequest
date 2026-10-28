import React, { useState } from 'react';
import { 
  Shield, 
  UserCheck, 
  Key, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Lock
} from 'lucide-react';
import { useBarangayStore } from '../../hooks/useBarangayStore';
import { UserRole } from '../../types';

export const StaffPermissionsAdmin: React.FC = () => {
  const { allProfiles, currentUser, isAdmin, store } = useBarangayStore();
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const res = store.updateUserRole(userId, newRole);
    if (res.success) {
      setFeedback(`User role successfully updated to ${newRole.toUpperCase()}.`);
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback(res.error || 'Failed to update role');
    }
  };

  const matrix = [
    { action: 'Create & Submit Requests', res: true, sec: false, admin: true },
    { action: 'View Own Request Records', res: true, sec: true, admin: true },
    { action: 'Screen & Review All Requests', res: false, sec: true, admin: true },
    { action: 'Request Additional Requirements', res: false, sec: true, admin: true },
    { action: 'Add Internal Confidential Notes', res: false, sec: true, admin: true },
    { action: 'Approve or Reject Applications', res: false, sec: true, admin: true },
    { action: 'Prepare Official Certificates', res: false, sec: true, admin: true },
    { action: 'Authorize Official Release & O.R.', res: false, sec: true, admin: true },
    { action: 'Manage Document Services & Fees', res: false, sec: false, admin: true },
    { action: 'Modify User Roles & Permissions', res: false, sec: false, admin: true },
    { action: 'Access Immutable Audit Logs', res: false, sec: false, admin: true },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">User Roles & Access Control (RBAC)</h1>
          <p className="text-xs text-slate-700 mt-0.5">
            Strict role-based segregation of duties between applicants, screening processors, approving officials, and IT administrators.
          </p>
        </div>
        <div className="px-3.5 py-1.5 bg-blue-100 border border-blue-300 rounded-xl text-blue-950 font-bold text-xs flex items-center">
          <Shield className="w-4 h-4 mr-1.5 text-blue-800" />
          Enforced Server-Side Policies
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center">
          <CheckCircle2 className="w-4 h-4 mr-2 text-blue-700" />
          {feedback}
        </div>
      )}

      {/* Staff Accounts Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-sm">System Users & Appointed Roles</h2>
          {!isAdmin && (
            <span className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Only System Administrators can reassign roles
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Email Address</th>
                <th className="py-2.5 px-3">Current Role</th>
                <th className="py-2.5 px-3">Department / Office</th>
                <th className="py-2.5 px-3 text-right">Role Assignment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allProfiles.map(p => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">{p.full_name}</td>
                  <td className="py-3 px-3 text-slate-700">{p.email}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      p.role === 'admin' ? 'bg-purple-100 text-purple-900' :
                      p.role === 'secretary' ? 'bg-blue-100 text-blue-900' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {p.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 text-[11px]">{p.sitio_purok}</td>
                  <td className="py-3 px-3 text-right">
                    {isAdmin ? (
                      <select
                        value={p.role}
                        onChange={(e) => handleRoleChange(p.id, e.target.value as UserRole)}
                        className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      >
                        <option value="resident">Resident</option>
                        <option value="secretary">Barangay Secretary</option>
                        <option value="admin">System Administrator</option>
                      </select>
                    ) : (
                      <span className="text-slate-600 italic text-[11px]">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explicit Permissions Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <h2 className="font-bold text-slate-900 text-sm">Segregation of Duties (Permission Matrix)</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Functional Capability</th>
                <th className="py-2.5 px-3 text-center">Resident</th>
                <th className="py-2.5 px-3 text-center">Secretary (Approver)</th>
                <th className="py-2.5 px-3 text-center">System Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-medium text-slate-800">{row.action}</td>
                  <td className="py-2.5 px-3 text-center">
                    {row.res ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <XCircle className="w-4 h-4 text-slate-300 inline" />}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.sec ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <XCircle className="w-4 h-4 text-slate-300 inline" />}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.admin ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <XCircle className="w-4 h-4 text-slate-300 inline" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
