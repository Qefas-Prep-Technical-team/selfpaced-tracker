import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { icon: 'dashboard', label: 'Home', link: "/dashboard/" },
  { icon: 'mail', label: 'Inbox', link: "/dashboard/inbox" },
  { icon: 'contacts', label: 'Leads', link: "/dashboard/inquiries" },
  { icon: 'bar_chart', label: 'Stats', link: "/dashboard/analytics" },
]

export default function MobileNavbar() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 z-40 px-6 flex items-center justify-between">
      {navItems.map((item) => {
        const isActive = pathname === item.link || (item.link !== '/dashboard/' && pathname.startsWith(item.link))
        
        return (
          <Link 
            key={item.label} 
            href={item.link}
            className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${
              isActive ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            <div className={`size-10 rounded-xl flex items-center justify-center transition-colors ${
              isActive ? 'bg-indigo-600/10' : 'bg-transparent'
            }`}>
              <span className={`material-symbols-outlined text-[20px] ${isActive ? 'fill-1' : ''}`}>
                {item.icon}
              </span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
