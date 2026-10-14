import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

type ButtonProps = {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'md' | 'lg'
  className?: string
  icon?: ReactNode
  /** external links get the right rel attributes automatically */
  external?: boolean
  download?: boolean
  type?: 'button' | 'submit'
  'aria-label'?: string
}

const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

const variants = {
  primary:
    'bg-fg text-ink hover:bg-white hover:shadow-[0_12px_40px_-12px_rgba(79,140,255,0.65)] active:scale-[0.985]',
  outline:
    'border border-line-strong bg-white/[0.02] text-fg hover:border-accent/60 hover:bg-white/[0.05] hover:shadow-[0_10px_36px_-16px_rgba(79,140,255,0.55)] active:scale-[0.985]',
  ghost: 'text-muted hover:text-fg',
}

const sizes = {
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-7 text-[0.95rem]',
}

export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  icon,
  external,
  download,
  type = 'button',
  ...rest
}: ButtonProps) {
  const cls = cn(base, variants[variant], sizes[size], className)

  if (href) {
    return (
      <a
        href={href}
        className={cls}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        download={download}
        {...rest}
      >
        {icon}
        {children}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className={cls} {...rest}>
      {icon}
      {children}
    </button>
  )
}
