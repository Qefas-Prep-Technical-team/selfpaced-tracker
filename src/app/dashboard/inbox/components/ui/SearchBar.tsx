import { FC } from 'react'

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

const SearchBar: FC<SearchBarProps> = ({ placeholder = 'Search...', value, onChange }) => {
  return (
    <label className="flex flex-col w-full">
      <div className="flex w-full flex-1 items-stretch rounded-lg h-9 border border-slate-100 dark:border-slate-800">
        <div className="text-[#4c739a] flex bg-[#f6f7f8] dark:bg-slate-800 items-center justify-center pl-3 rounded-l-lg">
          <span className="material-symbols-outlined text-lg">search</span>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="form-input flex w-full min-w-0 flex-1 border-none bg-[#f6f7f8] dark:bg-slate-800 text-[#0d141b] dark:text-white focus:outline-0 focus:ring-0 h-full placeholder:text-[#4c739a] px-2 rounded-r-lg text-sm"
        />
      </div>
    </label>
  )
}

export default SearchBar