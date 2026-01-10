export default function SearchBar() {
  return (
    <label className="relative flex items-center min-w-64">
      <span className="material-symbols-outlined absolute left-3 text-[#4c739a] text-xl">
        search
      </span>
      <input
        type="text"
        placeholder="Search contacts, chats, or tasks..."
        className="w-full h-10 pl-10 pr-4 rounded-lg border-none bg-slate-100 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary/50 transition-all"
      />
    </label>
  )
}