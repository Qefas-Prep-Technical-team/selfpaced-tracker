"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import NavItem from './NavItem'
import UserProfile from './UserProfile'
import { useSession } from 'next-auth/react';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', link: "/dashboard/" },
  { icon: 'mail', label: 'Inbox', link: "/dashboard/inbox" },
  { icon: 'contacts', label: 'Inquiries', link: "/dashboard/inquiries" },
  { icon: 'newspaper', label: 'Newsletters', link: "/dashboard/newsletters" },
  { icon: 'campaign', label: 'Campaigns', link: "/dashboard/campaigns" },
  { icon: 'bar_chart', label: 'Analytics', link: "/dashboard/analytics" },
  { icon: 'settings_input_antenna', label: 'Channel', link: "/dashboard/channel" },
  { icon: 'network_intel_node', label: 'KnowledgeManager', link: "/dashboard/KnowledgeManager" },
  { icon: 'ads_click', label: 'Clicks', link: "/dashboard/clicks" },
  { icon: 'person_check', label: 'Invite', link: "/dashboard/invite", adminOnly: true },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role?.toLowerCase();

  const visibleNavItems = navItems.filter(item => {
    if (item.adminOnly) {
      return userRole === 'admin';
    }
    return true;
  });

  return (
    <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-2xl md:shadow-none transition-colors duration-300">
      {/* Logo Area */}
      <div className="p-6 flex items-center justify-between border-b border-slate-50 dark:border-white/5">
        <div className="flex items-center gap-3">
            <div className="bg-indigo-600 size-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <span className="material-symbols-outlined">rocket_launch</span>
            </div>
            <div>
                <h1 className="text-sm font-black leading-none tracking-tight">Qefas AI</h1>
                <p className="text-[#4c739a] text-[10px] font-black uppercase tracking-widest mt-1">Intelligent Hub</p>
            </div>
        </div>

        {/* Mobile Close Button */}
        <button 
            onClick={onClose}
            className="md:hidden size-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-red-500 transition-colors"
        >
            <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 mt-6 overflow-y-auto custom-scrollbar">
        {visibleNavItems.map((item) => (
          <div key={item.label} onClick={onClose} className="block">
            <NavItem
                icon={item.icon}
                label={item.label}
                link={item.link} 
            />
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
        <UserProfile />
      </div>
    </aside>
  )
}