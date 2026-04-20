import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, ensureSession } from '../api/client';

const LiveDataContext = createContext(null);

export function LiveDataProvider({ children }) {
  const [liveEnabled, setLiveEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [uploadHistory, setUploadHistory] = useState([]);

  const load = async () => {
    try {
      setLoading(true);
      await ensureSession();
      const [branchRows, dashboardData, alertRows, historyRows] = await Promise.all([
        api.branches(),
        api.dashboard(),
        api.alerts(),
        api.uploadHistory(),
      ]);
      setBranches(branchRows || []);
      setDashboard(dashboardData || null);
      setAlerts(alertRows || dashboardData?.alerts || []);
      setUploadHistory(historyRows || []);
      setLiveEnabled(true);
    } catch {
      setLiveEnabled(false);
      setUploadHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const value = useMemo(
    () => ({
      liveEnabled,
      loading,
      branches,
      dashboard,
      alerts,
      uploadHistory,
      refreshLiveData: load,
    }),
    [liveEnabled, loading, branches, dashboard, alerts, uploadHistory],
  );

  return <LiveDataContext.Provider value={value}>{children}</LiveDataContext.Provider>;
}

export function useLiveData() {
  const context = useContext(LiveDataContext);
  if (!context) {
    throw new Error('useLiveData must be used within LiveDataProvider');
  }
  return context;
}
