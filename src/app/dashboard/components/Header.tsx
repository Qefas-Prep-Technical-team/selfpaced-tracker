import SearchBar from './SearchBar'
import NotificationButton from './NotificationButton'
import { ThemeToggle } from '@/components/navbar/ThemeToggle'

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Toggle */}
        <button 
            onClick={onMenuClick}
            className="md:hidden size-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-indigo-600 transition-colors"
            aria-label="Toggle Menu"
        >
            <span className="material-symbols-outlined">menu</span>
        </button>

        <h2 className="text-xs md:text-lg font-black tracking-[0.15em] md:tracking-tight text-slate-800 dark:text-white uppercase md:capitalize">
            <span className="text-indigo-600 md:text-inherit">Qefas</span> <span className="hidden md:inline text-slate-400">Overview</span>
            <span className="md:hidden text-slate-400"> / Hub</span>
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-6">
        <div className="hidden lg:block">
            <SearchBar />
        </div>

        <div className="flex gap-1.5 sm:gap-2">
          <NotificationButton />
          <ThemeToggle />

          <button className="size-9 sm:size-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-500 hover:text-indigo-600 transition-all active:scale-95 group">
            <span className="material-symbols-outlined text-lg sm:text-xl group-hover:rotate-45 transition-transform">settings</span>
          </button>
        </div>
      </div>
    </header>
  )
}