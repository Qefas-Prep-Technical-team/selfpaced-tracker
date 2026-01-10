'use client'
import SearchBar from './ui/SearchBar'

const navItems = [
    { label: 'Inbox', href: '#', active: true },
    { label: 'Contacts', href: '#' },
    { label: 'Newsletters', href: '#' },
    { label: 'Analytics', href: '#' },
]

export default function TopNavBar() {
    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e7edf3] bg-white dark:bg-background-dark dark:border-slate-800 px-6 py-3">
            <div className="flex items-center gap-8">
                {/* Logo */}
                <div className="flex items-center gap-4 text-primary">
                    <div className="size-6">
                        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor"></path>
                        </svg>
                    </div>
                    <h2 className="text-[#0d141b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                        Lumina AI
                    </h2>
                </div>

                {/* Navigation Links */}
                <div className="flex items-center gap-6">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className={`text-sm font-medium transition-colors ${item.active
                                ? 'text-primary border-b-2 border-primary py-1 font-semibold'
                                : 'text-[#4c739a] dark:text-slate-400 hover:text-primary'
                                }`}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex flex-1 justify-end gap-4 items-center">
                <SearchBar placeholder={"Global search..."} />

                <div className="flex gap-2">
                    <button className="flex items-center justify-center rounded-lg size-9 bg-[#e7edf3] dark:bg-slate-800 text-[#0d141b] dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined text-xl">notifications</span>
                    </button>
                    <button className="flex items-center justify-center rounded-lg size-9 bg-[#e7edf3] dark:bg-slate-800 text-[#0d141b] dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined text-xl">settings</span>
                    </button>
                </div>

                {/* User Avatar */}
                <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border-2 border-primary/20"
                    style={{
                        backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAQ4KeoHbgM4AMqVMwwuKYpsYu8DD0J8RCVwpvQmLZQexc6PPlPj8D5A1-zydfqfKLVmAYnAdxTGR5d5zyYwuYmWmIteUx4GvpdWkyuXXBurWptRMj75acFK-4Dy25KxTAMIaciu6m9bACRIbFmdDp_xVcrIW4e4LTrKbRM3essqsrwopnuxpz_1gYFdbFE_V-g23wMDhFNHEm-2Cr072Lk5NYgF_7Sa9r9ZUzeNLGB1Q3sE7Ci1Gzexm560LiD1IWgRoWgSxJZtUo")',
                    }}
                />
            </div>
        </header>
    )
}