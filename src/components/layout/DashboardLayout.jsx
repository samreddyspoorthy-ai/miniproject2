import { useState } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen text-slate-800">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {isSidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close navigation"
        />
      ) : null}
      <TopNavbar onMenuClick={() => setIsSidebarOpen(true)} />
      <main className="px-4 pb-8 pt-6 sm:px-6 lg:ml-72">{children}</main>
    </div>
  );
}

export default DashboardLayout;
