import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cva, cx } from '../../styled-system/css'

const buttonStyle = cva({
  base: {
    alignItems: 'center',
    border: '0',
    borderRadius: '16px',
    cursor: 'pointer',
    display: 'inline-flex',
    fontWeight: '700',
    gap: '8px',
    justifyContent: 'center',
    transition: 'background 160ms ease, color 160ms ease, transform 160ms ease',
    _hover: { filter: 'brightness(.97)' },
    _active: { transform: 'scale(.985)' },
    _disabled: { cursor: 'not-allowed', opacity: 0.46, transform: 'none' },
    _focusVisible: { outline: '3px solid rgba(49,130,246,.28)', outlineOffset: '3px' },
  },
  variants: {
    variant: {
      primary: {
        background: 'grape',
        color: 'white',
      },
      secondary: { background: 'cream', color: 'grape' },
      ghost: { background: 'transparent', color: 'muted' },
      danger: { background: '#fff0f0', color: '#b42318' },
    },
    size: {
      sm: { fontSize: '13px', minHeight: '36px', paddingX: '14px' },
      md: { fontSize: '15px', minHeight: '50px', paddingX: '20px' },
      lg: { fontSize: '16px', minHeight: '56px', paddingX: '24px' },
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
}

export function Button({
  children,
  className,
  disabled,
  loading = false,
  size,
  variant,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cx(buttonStyle({ size, variant }), className)}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? <span aria-hidden="true">●●●</span> : children}
    </button>
  )
}
