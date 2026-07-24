import { useEffect, useRef, type ReactNode } from 'react'
import { css } from '../../styled-system/css'
import { Button } from './button'

type PopupProps = {
  title: string
  children: ReactNode
  confirmLabel?: string
  onClose: () => void
  onConfirm?: () => void
}

export function Popup({
  title,
  children,
  confirmLabel = '확인',
  onClose,
  onConfirm,
}: PopupProps) {
  const dialogRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [onClose])

  return (
    <div
      className={css({
        alignItems: 'center',
        background: 'rgba(25, 31, 40, 0.48)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        inset: 0,
        justifyContent: 'center',
        padding: '20px',
        position: 'fixed',
        zIndex: 20,
      })}
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        ref={dialogRef}
        aria-modal="true"
        className={css({
          background: 'white',
          borderRadius: '26px',
          boxShadow: '0 24px 70px rgba(25, 31, 40, 0.22)',
          maxWidth: '420px',
          padding: { base: '24px', md: '30px' },
          outline: 'none',
          width: '100%',
        })}
        role="dialog"
        aria-labelledby="popup-title"
        tabIndex={-1}
      >
        <div
          className={css({
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '14px',
          })}
        >
          <h2
            id="popup-title"
            className={css({
              color: 'ink',
              fontSize: '24px',
              fontWeight: '800',
              letterSpacing: '-.03em',
            })}
          >
            {title}
          </h2>
          <Button aria-label="팝업 닫기" size="sm" variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </div>
        <div className={css({ color: 'muted', fontSize: '15px', lineHeight: '1.7' })}>
          {children}
        </div>
        <div
          className={css({
            display: 'grid',
            gap: '10px',
            gridTemplateColumns: onConfirm ? '1fr 1.45fr' : '1fr',
            marginTop: '24px',
          })}
        >
          {onConfirm ? (
            <>
              <Button variant="secondary" onClick={onClose}>
                취소
              </Button>
              <Button onClick={onConfirm}>{confirmLabel}</Button>
            </>
          ) : (
            <Button onClick={onClose}>{confirmLabel}</Button>
          )}
        </div>
      </section>
    </div>
  )
}
