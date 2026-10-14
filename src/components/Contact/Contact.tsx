import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Copy, Github, Linkedin, Mail, Send } from 'lucide-react'
import { contact, profile } from '../../data/site'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { EASE } from '../../utils/animations'
import { cn } from '../../utils/cn'

type Fields = { name: string; email: string; message: string }
type Errors = Partial<Record<keyof Fields, string>>

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values: Fields): Errors {
  const errors: Errors = {}
  if (values.name.trim().length < 2) errors.name = 'Please enter your name.'
  if (!emailRe.test(values.email.trim()))
    errors.email = 'Please enter a valid email address.'
  if (values.message.trim().length < 10)
    errors.message = 'Message should be at least 10 characters.'
  return errors
}

const fieldCn =
  'w-full rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-[0.9rem] text-fg placeholder:text-faint transition-colors focus:border-accent/60 focus:bg-white/[0.05] focus:outline-none'

export function Contact() {
  const reduced = useReducedMotion()
  const [values, setValues] = useState<Fields>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'opened' | 'copied'>('idle')

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }))
    if (errors[key]) setErrors((err) => ({ ...err, [key]: undefined }))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const next = validate(values)
    setErrors(next)
    if (Object.keys(next).length > 0) return

    // No backend: hand the message to the visitor's email client instead
    // of pretending a server sent it.
    const subject = encodeURIComponent(`Portfolio contact — ${values.name.trim()}`)
    const body = encodeURIComponent(
      `${values.message.trim()}\n\n—\n${values.name.trim()}\n${values.email.trim()}`,
    )
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`
    setStatus('opened')
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setStatus('copied')
      setTimeout(() => setStatus('idle'), 2600)
    } catch {
      setStatus('idle')
    }
  }

  const links = [
    {
      icon: Mail,
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
      external: false,
    },
    { icon: Github, label: 'GitHub', value: 'github.com/rithikjaiswar', href: contact.github, external: true },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'linkedin.com/in/rithikjaiswar',
      href: contact.linkedin,
      external: true,
    },
  ]

  return (
    <section id="contact" className="section-pad relative">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Contact"
          title={
            <>
              Let&apos;s <span className="text-gradient">Connect</span>.
            </>
          }
          description="Open to Data Analyst, Data Scientist, AI/ML and GenAI roles — and to interesting data problems in general."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* --------------------------- contact links --------------------------- */}
          <div className="space-y-4">
            <Reveal>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="glass group flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-white/[0.03] text-accent transition-colors group-hover:bg-accent group-hover:text-ink">
                        <link.icon className="h-4.5 w-4.5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-mono text-[0.6rem] tracking-[0.24em] text-faint uppercase">
                          {link.label}
                        </span>
                        <span className="block truncate text-[0.92rem] font-medium text-fg">
                          {link.value}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="glass flex items-center justify-between gap-4 rounded-2xl px-5 py-4">
                <div>
                  <p className="font-mono text-[0.6rem] tracking-[0.24em] text-faint uppercase">
                    Status
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-[0.9rem] font-medium text-fg">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-accent-2" />
                    </span>
                    {profile.status}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3.5 text-[0.74rem] text-muted transition-colors hover:border-line-strong hover:text-fg"
                  aria-label="Copy email address"
                >
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  Copy email
                </button>
              </div>
            </Reveal>
          </div>

          {/* ------------------------------ form ------------------------------ */}
          <Reveal delay={0.08}>
            <form
              onSubmit={onSubmit}
              noValidate
              className="glass rounded-3xl p-6 sm:p-8"
              aria-label="Contact form"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-[0.78rem] font-medium text-muted">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={values.name}
                    onChange={set('name')}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    placeholder="Your name"
                    className={cn(fieldCn, errors.name && 'border-red-400/60')}
                  />
                  {errors.name && (
                    <p id="name-error" role="alert" className="mt-1.5 flex items-center gap-1.5 text-[0.74rem] text-red-300">
                      <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-[0.78rem] font-medium text-muted">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={values.email}
                    onChange={set('email')}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    placeholder="you@company.com"
                    className={cn(fieldCn, errors.email && 'border-red-400/60')}
                  />
                  {errors.email && (
                    <p id="email-error" role="alert" className="mt-1.5 flex items-center gap-1.5 text-[0.74rem] text-red-300">
                      <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="message" className="mb-2 block text-[0.78rem] font-medium text-muted">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={values.message}
                  onChange={set('message')}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  placeholder="Tell me about the role or the problem you're working on…"
                  className={cn(fieldCn, 'resize-y', errors.message && 'border-red-400/60')}
                />
                {errors.message && (
                  <p id="message-error" role="alert" className="mt-1.5 flex items-center gap-1.5 text-[0.74rem] text-red-300">
                    <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-fg px-7 text-sm font-medium text-ink transition-all hover:bg-white hover:shadow-[0_12px_40px_-12px_rgba(79,140,255,0.65)] active:scale-[0.98]"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Send Message
                </button>
                <p className="text-[0.72rem] leading-relaxed text-faint">
                  Opens your email app — this page doesn&apos;t store or send data.
                </p>
              </div>

              <AnimatePresence>
                {status === 'opened' && (
                  <motion.p
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    role="status"
                    className="mt-4 flex items-start gap-2 rounded-xl border border-accent-2/30 bg-accent-2/10 px-4 py-3 text-[0.78rem] text-accent-2"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    Your email app should have opened with the message pre-filled. If nothing
                    happened, email me directly at{' '}
                    <span className="font-mono text-fg">{contact.email}</span>.
                  </motion.p>
                )}
                {status === 'copied' && (
                  <motion.p
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    role="status"
                    className="mt-4 text-[0.78rem] text-accent-2"
                  >
                    Email address copied to clipboard.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
