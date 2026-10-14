import { ArrowUp, Download, Github, Linkedin } from 'lucide-react'
import { contact, profile } from '../../data/site'

const year = new Date().getFullYear()

export function Footer() {
  const links = [
    { label: 'GitHub', href: contact.github, icon: Github },
    { label: 'LinkedIn', href: contact.linkedin, icon: Linkedin },
    { label: 'Resume', href: contact.resume, icon: Download },
  ]

  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-lg font-semibold tracking-tight text-fg">{profile.name}</p>
            <p className="mt-1.5 font-mono text-[0.75rem] tracking-[0.18em] text-muted uppercase">
              Data • Machine Learning • AI
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center gap-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-4 text-[0.78rem] text-muted transition-colors hover:border-line-strong hover:text-fg"
                  >
                    <link.icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#home"
                  aria-label="Back to top"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
                >
                  <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="text-[0.78rem] text-faint">
            © {year} {profile.name}. All rights reserved.
          </p>
          <p className="font-mono text-[0.68rem] text-faint">
            Built with React • TypeScript • Three.js • Tailwind
          </p>
        </div>
      </div>
    </footer>
  )
}
