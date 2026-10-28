import React from 'react';
import { Bell, CheckCheck, Clock, FileText, ChevronRight } from 'lucide-react';
import { useBarangayStore } from '../../hooks/useBarangayStore';
import { InAppNotification } from '../../types';

interface NotificationsViewProps {
  onOpenRequestByRef: (refNumber: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onOpenRequestByRef }) => {
  const { currentUser, notifications, unreadNotifCount, store } = useBarangayStore();

  const handleMarkAllRead = () => {
    if (!currentUser) return;
    store.markAllNotificationsAsRead(currentUser.id);
  };

  const handleNotificationClick = (notif: InAppNotification) => {
    store.markNotificationAsRead(notif.id);
    if (notif.reference_number) {
      onOpenRequestByRef(notif.reference_number);
    }
  };

  return (
    <div className="space-y-4 pb-20 md:pb-8 max-w-2xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Notifications & Updates</h1>
          <p className="text-xs text-slate-700 mt-0.5">
            Real-time status alerts from barangay screening personnel and approving officers.
          </p>
        </div>
        {unreadNotifCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center transition cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 mr-1 text-blue-900" />
            Mark All Read
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">No notifications</h3>
            <p className="text-xs text-slate-700 mt-1">
              You will receive automated in-app alerts whenever your request is reviewed, approved, or ready for release.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                notif.is_read
                  ? 'bg-white border-slate-200 hover:border-slate-300'
                  : 'bg-blue-50/70 border-blue-300 shadow-xs ring-1 ring-blue-500/20'
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center space-x-2">
                  {!notif.is_read && (
                    <span className="w-2 h-2 rounded-full bg-blue-900 shrink-0" />
                  )}
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                    {notif.title}
                  </h4>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {notif.message}
                </p>

                <div className="flex items-center space-x-3 text-[11px] text-slate-700 pt-1">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-slate-600" />
                    {new Date(notif.created_at).toLocaleString('en-PH')}
                  </span>
                  {notif.reference_number && (
                    <span className="font-mono font-semibold text-blue-900 flex items-center">
                      <FileText className="w-3 h-3 mr-1 text-blue-800" />
                      {notif.reference_number}
                    </span>
                  )}
                </div>
              </div>

              {notif.reference_number && (
                <button
                  type="button"
                  className="p-1.5 text-blue-900 hover:bg-blue-100/50 rounded-lg transition shrink-0 self-center"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
