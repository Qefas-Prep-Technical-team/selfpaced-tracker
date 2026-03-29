import { FC } from 'react'

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

const SearchBar: FC<SearchBarProps> = ({ placeholder = 'Search...', value, onChange }) => {
  return (
    <div className="relative w-full group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary text-slate-400">
        <span className="material-symbols-outlined text-lg">search</span>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary/50 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white"
      />
    </div>
  )
}

export default SearchBar