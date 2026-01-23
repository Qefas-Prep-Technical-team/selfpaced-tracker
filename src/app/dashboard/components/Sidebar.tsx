"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { link } from 'fs'
import NavItem from './NavItem'
import UserProfile from './UserProfile'
import { useSession } from 'next-auth/react';


const navItems = [
  { icon: 'dashboard', label: 'Dashboard', link: "/dashboard/" },
  { icon: 'mail', label: 'Inbox', link: "/dashboard/inbox" },
  { icon: 'contacts', label: 'inquiries', link: "/dashboard/inquiries" },
  { icon: 'campaign', label: 'Newsletters', link: "/dashboard/newsletters" },
  { icon: 'bar_chart', label: 'Analytics', link: "/dashboard/analytics" },
  { icon: 'settings_input_antenna', label: 'Channel', link: "/dashboard/channel" },
  { icon: 'ads_click', label: 'Clicks', link: "/dashboard/clicks" },
  { icon: 'person_check', label: 'Invite', link: "/dashboard/invite", adminOnly: true }, // Added flag
];

export default function Sidebar() {
    const { data: session, status: sessionStatus } = useSession();
    // 1. Get the current role (and normalize to lowercase)
  const userRole = (session?.user as any)?.role?.toLowerCase();

  // 2. Filter the items
  const visibleNavItems = navItems.filter(item => {
    // If it's an admin-only item, only show if user is admin
    if (item.adminOnly) {
      return userRole === 'admin';
    }
    // Otherwise, show it to everyone
    return true;
  });


  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800  dark:bg-background-dark flex flex-col sticky top-0 h-screen">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white dark:text-black">
          <span className="material-symbols-outlined">rocket_launch</span>
        </div>
        <div>
          <h1 className="text-base font-bold leading-tight">Qefas Marketing Dashboard</h1>
          <p className="text-[#4c739a] text-xs font-normal">AI-Powered</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {visibleNavItems.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}

            link={item.link} />
        ))}
      </nav>

      {/* User Profile */}
      <UserProfile />
    </aside>
  )
}