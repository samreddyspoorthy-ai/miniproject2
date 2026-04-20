import { useState } from 'react';
import { Bell, ChevronDown, Menu, UserCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { branchOptions, leakageAlerts } from '../../data/mockData';
import { useLiveData } from '../../context/LiveDataContext';

function TopNavbar({ onMenuClick }) {
  const [branchIndex, setBranchIndex] = useState(0);
  const [orgIndex, setOrgIndex] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const organizations = ['Urban Dine Group', 'South Zone Cluster', 'Metro Food Chain Pvt Ltd'];
  const { liveEnabled, branches, alerts } = useLiveData();
  const activeBranches = liveEnabled && branches.length ? branches.map((b) => b.name) : branchOptions;
  const notificationItems = liveEnabled && alerts.length ? alerts.map((a) => a.message) : leakageAlerts;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 px-4 py-3 backdrop-blur sm:px-6 lg:ml-72">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-500">Organization</p>
            <button
              onClick={() => setOrgIndex((idx) => (idx + 1) % organizations.length)}
              className="mb-1 flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-800"
            >
              {organizations[orgIndex]}
              <ChevronDown className="h-4 w-4" />
            </button>
            <p className="text-sm font-medium text-slate-500">Active Branch</p>
            <button
              onClick={() => setBranchIndex((idx) => (idx + 1) % activeBranches.length)}
              className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-800"
            >
              {activeBranches[branchIndex % activeBranches.length]}
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative flex items-center gap-2 sm:gap-4">
          <button
            className="relative rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
            aria-label="Notifications"
            onClick={() => setShowNotifications((v) => !v)}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-orange-500" />
          </button>
          {showNotifications ? (
            <div className="absolute right-16 top-12 w-80 rounded-xl bg-white p-3 text-sm text-slate-700 shadow-soft ring-1 ring-slate-200">
              <p className="font-semibold">Smart Alerts System</p>
              <div className="mt-2 space-y-2">
                {notificationItems.map((alert) => (
                  <p key={alert} className="rounded-lg bg-orange-50 p-2 text-xs text-orange-700">{alert}</p>
                ))}
              </div>
            </div>
          ) : null}

          <button
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            onClick={() => setShowProfileMenu((v) => !v)}
          >
            <UserCircle2 className="h-5 w-5" />
            <span className="hidden sm:inline">Asha Nair</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          {showProfileMenu ? (
            <div className="absolute right-0 top-12 w-44 rounded-xl bg-white p-2 text-sm shadow-soft ring-1 ring-slate-200">
              <button onClick={() => navigate('/settings')} className="w-full rounded-lg px-3 py-2 text-left hover:bg-slate-100">View Profile</button>
              <button onClick={() => navigate('/')} className="w-full rounded-lg px-3 py-2 text-left hover:bg-slate-100">Sign Out</button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
