import React, { useState } from 'react';
import { Shield, Search, Calendar, FileText, Lock, Filter } from 'lucide-react';
import { useBarangayStore } from '../../hooks/useBarangayStore';

export const AuditLogsAdmin: React.FC = () => {
  const { auditLogs } = useBarangayStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredLogs = auditLogs.filter(log => {
    const q = searchQuery.toLowerCase().trim();
    const matches = !q ||
      log.action.toLowerCase().includes(q) ||
      log.actor_name.toLowerCase().includes(q) ||
      log.entity_type.toLowerCase().includes(q);

    if (!matches) return false;
    if (roleFilter !== 'all' && log.actor_role !== roleFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Immutable Audit Trail & System Logs</h1>
          <p className="text-xs text-slate-700 mt-0.5">
            Tamper-resistant historical audit records tracking all administrative decisions, status shifts, and citizen interactions.
          </p>
        </div>
        <div className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl font-mono text-xs flex items-center">
          <Lock className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
          {auditLogs.length} Logged Transactions
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action code, actor name, or entity..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
          />
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
          >
            <option value="all">All Actor Roles</option>
            <option value="resident">Residents</option>
            <option value="secretary">Barangay Secretary</option>
            <option value="admin">System Administrators</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp (PHT)</th>
                <th className="py-3 px-4">Actor & Role</th>
                <th className="py-3 px-4">Action Code</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Metadata / Details</th>
                <th className="py-3 px-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-700 italic font-sans">
                    No audit records matching query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 text-slate-700 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-PH')}
                    </td>
                    <td className="py-2.5 px-4 font-sans">
                      <strong className="text-slate-900 block">{log.actor_name}</strong>
                      <span className="text-[10px] uppercase font-bold text-blue-900">{log.actor_role}</span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-900 font-bold rounded-md border border-blue-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-700">
                      {log.entity_type} {log.entity_id ? `(#${log.entity_id})` : ''}
                    </td>
                    <td className="py-2.5 px-4 text-slate-700 font-sans max-w-xs truncate">
                      {log.metadata ? JSON.stringify(log.metadata) : '—'}
                    </td>
                    <td className="py-2.5 px-4 text-right text-slate-600">
                      {log.ip_address || '127.0.0.1'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
