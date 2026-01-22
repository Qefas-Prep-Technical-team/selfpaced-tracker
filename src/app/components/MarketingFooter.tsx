// components/marketing/MarketingFooter.tsx
import Logo from './Logo'

const footerLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Contact', href: '#' },
]

export function MarketingFooter() {
  return (
    <footer className="bg-white dark:bg-background-dark/50 border-t border-border-light dark:border-white/10 py-12">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-40 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Logo size={24} />
          <span className="text-text-primary dark:text-white font-bold tracking-tight">
            QEFAS
          </span>
        </div>

        {/* Links */}
        <div className="flex gap-8 text-sm text-text-secondary dark:text-white/60">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-sm text-text-secondary dark:text-white/60">
          © 2024 QEFAS Analytics. All rights reserved.
        </p>
      </div>
    </footer>
  )
}