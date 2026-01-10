export default function NotificationButton() {
  return (
    <button className="size-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors relative">
      <span className="material-symbols-outlined text-xl">notifications</span>
      <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800" />
    </button>
  )
}