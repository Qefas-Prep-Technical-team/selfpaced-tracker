// components/marketing/MarketingHeader.tsx
import { Button } from './ui/Button'
import Logo from './Logo'


export function MarketingHeader() {
  const navItems = [
    { label: 'Features', href: '#' },
    { label: 'Pricing', href: '#' },
    { label: 'Docs', href: '#' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-border-light dark:border-white/10 px-6 lg:px-40 py-4">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <h2 className="text-text-primary dark:text-white text-xl font-black leading-tight tracking-tight">
            QEFAS
          </h2>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-9">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-text-primary dark:text-white/80 text-sm font-medium hover:text-primary transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <Button variant="default" size="lg">
            Open Dashboard
          </Button>
        </div>
      </div>
    </header>
  )
}