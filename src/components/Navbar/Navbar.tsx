import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Download, Github, Linkedin, Menu, X } from 'lucide-react'
import { contact, navLinks, profile } from '../../data/site'
import { useActiveSection } from '../../hooks/useActiveSection'
import { cn } from '../../utils/cn'
import { EASE } from '../../utils/animations'

const sectionIds = navLinks.map((l) => l.id)

export function Navbar() {
  const active = useActiveSection(sectionIds)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const goTo = (id: string) => {
    setOpen(false)
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-line bg-ink/70 backdrop-blur-xl supports-[backdrop-filter]:bg-ink/55'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8 lg:h-[4.5rem]"
      >
        {/* Brand */}
        <button
          onClick={() => goTo('home')}
          className="flex items-center gap-2.5 rounded-lg"
          title={`${profile.name} — back to top`}
        >
          <span className="grid h-8 w-8 place-items-center rounded-md border border-line-strong bg-white/[0.04] font-mono text-xs font-semibold text-accent">
            RJ
          </span>
          <span className="hidden text-sm font-semibold tracking-tight text-fg sm:block">
            {profile.name}
          </span>
        </button>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = active === link.id
            return (
              <li key={link.id}>
                <button
                  onClick={() => goTo(link.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative rounded-full px-3.5 py-2 text-sm transition-colors duration-200',
                    isActive ? 'text-fg' : 'text-muted hover:text-fg',
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full border border-line bg-white/[0.06]"
                      transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
                    />
                  )}
                </button>
              </li>
            )
          })}
        </ul>

        {/* Right side actions */}
        <div className="flex items-center gap-1.5">
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="hidden h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg sm:grid"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="hidden h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg sm:grid"
          >
            <Linkedin className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={contact.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 hidden h-9 items-center gap-1.5 rounded-full border border-line-strong bg-white/[0.05] px-4 text-xs font-medium text-fg transition-all hover:border-accent/60 hover:bg-white/[0.08] sm:inline-flex"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            Resume
          </a>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-fg lg:hidden"
          >
            {open ? <X className="h-4.5 w-4.5" aria-hidden="true" /> : <Menu className="h-4.5 w-4.5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
            className="overflow-hidden border-t border-line bg-ink/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: reduced ? 0 : 0.05 * i, duration: 0.3 }}
                >
                  <button
                    onClick={() => goTo(link.id)}
                    className={cn(
                      'flex w-full items-center justify-between border-b border-line/60 py-3.5 text-left text-[0.95rem] transition-colors',
                      active === link.id ? 'text-accent' : 'text-fg',
                    )}
                  >
                    {link.label}
                    <span className="font-mono text-[0.7rem] text-faint">0{i + 1}</span>
                  </button>
                </motion.li>
              ))}
              <li className="flex items-center gap-3 pt-5 pb-2">
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-line text-sm text-fg"
                >
                  <Github className="h-4 w-4" aria-hidden="true" /> GitHub
                </a>
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-line text-sm text-fg"
                >
                  <Linkedin className="h-4 w-4" aria-hidden="true" /> LinkedIn
                </a>
                <a
                  href={contact.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-fg text-sm font-medium text-ink"
                >
                  <Download className="h-4 w-4" aria-hidden="true" /> Resume
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
