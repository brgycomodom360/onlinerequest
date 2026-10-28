import React from 'react';
import { RequestStatus } from '../types';
import { Clock, CheckCircle2, AlertCircle, FileCheck, Send, XCircle, PackageCheck } from 'lucide-react';

interface StatusBadgeProps {
  status: RequestStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config: Record<RequestStatus, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
    submitted: {
      label: 'Submitted',
      bg: 'bg-slate-100 text-slate-800',
      text: 'text-slate-800',
      border: 'border-slate-300',
      icon: <Send className="w-3.5 h-3.5 mr-1 text-slate-600" />
    },
    under_review: {
      label: 'Under Review',
      bg: 'bg-amber-50 text-amber-900',
      text: 'text-amber-800',
      border: 'border-amber-300',
      icon: <Clock className="w-3.5 h-3.5 mr-1 text-amber-600 animate-spin" />
    },
    pending_requirements: {
      label: 'Action Needed',
      bg: 'bg-orange-100 text-orange-950',
      text: 'text-orange-900',
      border: 'border-orange-400 font-semibold',
      icon: <AlertCircle className="w-3.5 h-3.5 mr-1 text-orange-600" />
    },
    approved: {
      label: 'Approved',
      bg: 'bg-emerald-50 text-emerald-900',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
    },
    ready_for_release: {
      label: 'Ready for Release',
      bg: 'bg-blue-100 text-blue-900',
      text: 'text-blue-900',
      border: 'border-blue-300 font-medium',
      icon: <FileCheck className="w-3.5 h-3.5 mr-1 text-blue-700" />
    },
    released: {
      label: 'Released',
      bg: 'bg-green-100 text-green-900',
      text: 'text-green-900',
      border: 'border-green-400',
      icon: <PackageCheck className="w-3.5 h-3.5 mr-1 text-green-700" />
    },
    rejected: {
      label: 'Declined',
      bg: 'bg-red-50 text-red-900',
      text: 'text-red-900',
      border: 'border-red-300',
      icon: <XCircle className="w-3.5 h-3.5 mr-1 text-red-600" />
    }
  };

  const item = config[status] || config.submitted;
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5'
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${item.bg} ${item.border} ${sizeClasses[size]}`}>
      {item.icon}
      {item.label}
    </span>
  );
};
