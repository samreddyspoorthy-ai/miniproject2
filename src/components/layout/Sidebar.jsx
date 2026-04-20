import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  Building2,
  FileSpreadsheet,
  Gauge,
  Home,
  LayoutDashboard,
  Link2,
  PackageSearch,
  Receipt,
  Settings,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Upload Data', to: '/upload', icon: FileSpreadsheet },
  { label: 'Waste Predictions', to: '/predictions', icon: Gauge },
  { label: 'Order Optimization', to: '/predictions', icon: PackageSearch },
  { label: 'Analytics', to: '/analytics', icon: BarChart3 },
  { label: 'Branch Comparison', to: '/branches', icon: Building2 },
  { label: 'Inventory Aging', to: '/inventory', icon: PackageSearch },
  { label: 'Reports & Exports', to: '/reports', icon: Receipt },
  { label: 'Integrations', to: '/integrations', icon: Link2 },
  { label: 'Settings', to: '/settings', icon: Settings },
  { label: 'Home', to: '/', icon: Home },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-white/95 px-5 py-6 shadow-soft transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 text-lg font-bold text-white">
          W
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900">WasteWise Intelligence Platform</h1>
          <p className="text-xs text-slate-500">Organization: Urban Dine Group</p>
          <p className="text-xs text-slate-500">Client: Koramangala Flagship</p>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={`${item.to}-${item.label}`}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-orange-50 p-4 ring-1 ring-emerald-100">
        <p className="text-sm font-semibold text-slate-800">AI Waste Score</p>
        <p className="mt-1 text-2xl font-bold text-emerald-700">89/100</p>
        <p className="text-xs text-slate-600">Projected annual savings: ₹14.8L</p>
      </div>
    </aside>
  );
}

export default Sidebar;
