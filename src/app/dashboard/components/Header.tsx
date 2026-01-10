import SearchBar from './SearchBar'
import NotificationButton from './NotificationButton'
import { ThemeToggle } from '@/components/navbar/ThemeToggle'

export default function Header() {
  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800  dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-10">
      <h2 className="text-lg font-bold tracking-tight">Dashboard Overview</h2>

      <div className="flex items-center gap-6">
        <SearchBar />

        <div className="flex gap-2">
          <NotificationButton />
          <ThemeToggle />

          <button className="size-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
        </div>
      </div>
    </header>
  )
}