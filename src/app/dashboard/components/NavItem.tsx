"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavItemProps {
  icon: string
  label: string
  active?: boolean
  link: string
}

export default function NavItem({ icon, label, link }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === link || pathname === `${link}/`;
  return (
    <Link
      href={link}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
        ? 'active-nav'
        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
}