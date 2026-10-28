import { useState, useEffect } from 'react';
import { store } from '../services/store';
import { Profile, SystemSettings, DocumentService, BarangayRequest, InAppNotification } from '../types';

export function useBarangayStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTick(prev => prev + 1);
    });
    return unsubscribe;
  }, []);

  const currentUser = store.getCurrentUser();
  const systemSettings: SystemSettings = store.getSystemSettings();
  const services: DocumentService[] = store.getDocumentServices(true);
  const activeServices: DocumentService[] = store.getDocumentServices(false);
  const allRequests: BarangayRequest[] = store.getAllRequests();
  const userRequests: BarangayRequest[] = currentUser ? store.getRequestsForUser(currentUser.id) : [];
  const notifications: InAppNotification[] = currentUser ? store.getNotificationsForUser(currentUser.id) : [];
  const unreadNotifCount = currentUser ? store.getUnreadNotificationCount(currentUser.id) : 0;
  const auditLogs = store.getAuditLogs();
  const allProfiles: Profile[] = store.getAllProfiles();

  return {
    currentUser,
    systemSettings,
    services,
    activeServices,
    allRequests,
    userRequests,
    notifications,
    unreadNotifCount,
    auditLogs,
    allProfiles,
    store,
    // Convenient role booleans
    isResident: currentUser?.role === 'resident',
    isStaff: currentUser?.role === 'secretary' || currentUser?.role === 'admin',
    isSecretary: currentUser?.role === 'secretary' || currentUser?.role === 'admin',
    isAdmin: currentUser?.role === 'admin'
  };
}
