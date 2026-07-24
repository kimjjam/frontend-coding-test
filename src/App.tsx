import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { css } from '../styled-system/css'
import { Button } from './components/button'
import { Popup } from './components/popup'
import {
  BASE_SLOTS,
  getExtraChanceSlot,
  isBaseSlotEnabled,
  isBonusUnlocked,
  periodFromQuery,
  type SlotId,
} from './reward-logic'
import { useDailyProgress } from './use-daily-progress'

const SLOT_DETAILS = {
  morning: {
    icon: '☀️',
    label: '아침',
    time: '00:00 - 11:59',
    color: 'peach',
    message: '기분 좋은 하루를 시작해요',
  },
  lunch: {
    icon: '🥪',
    label: '점심',
    time: '12:00 - 17:59',
    color: 'mint',
    message: '잠깐의 여유를 챙겨보세요',
  },
  dinner: {
    icon: '🌙',
    label: '저녁',
    time: '18:00 - 23:59',
    color: 'softNavy',
    message: '오늘 하루를 가볍게 마무리해요',
  },
  bonus: {
    icon: '🎁',
    label: '오늘의 보너스',
    time: '세 슬롯 완료 보상',
    color: 'cream',
    message: '하루의 마지막 행운을 열어보세요',
  },
} as const

type ResultPopup = { type: 'success' | 'failure'; elapsed?: number } | null

function App() {
  const currentPeriod = useMemo(() => periodFromQuery(window.location.search), [])
  const { progress, markComplete, reset } = useDailyProgress()
  const [selectedSlot, setSelectedSlot] = useState<SlotId | null>(null)
  const [result, setResult] = useState<ResultPopup>(null)
  const pending = useRef<{ slot: SlotId; startedAt: number } | null>(null)

  const extraChanceSlot = getExtraChanceSlot(progress)
  const bonusUnlocked = isBonusUnlocked(progress)
  const progressCount = BASE_SLOTS.filter((slot) => progress.completed.includes(slot)).length
  const progressPercent = Math.round((progressCount / BASE_SLOTS.length) * 100)

  const handleReturn = useCallback(() => {
    if (!pending.current || document.visibilityState === 'hidden') return
    const { slot, startedAt } = pending.current
    pending.current = null
    const elapsed = (Date.now() - startedAt) / 1000
    if (elapsed >= 3) {
      markComplete(slot)
      setResult({ type: 'success', elapsed })
    } else {
      setResult({ type: 'failure', elapsed })
    }
  }, [markComplete])

  useEffect(() => {
    window.addEventListener('focus', handleReturn)
    document.addEventListener('visibilitychange', handleReturn)
    return () => {
      window.removeEventListener('focus', handleReturn)
      document.removeEventListener('visibilitychange', handleReturn)
    }
  }, [handleReturn])

  const openLanding = () => {
    if (!selectedSlot) return
    const slot = selectedSlot
    pending.current = { slot, startedAt: Date.now() }

    // `noopener`를 features 문자열로 전달하면 Chrome이 열린 창도 null로 반환할 수 있다.
    const opened = window.open('about:blank', '_blank')
    if (!opened) {
      pending.current = null
      setSelectedSlot(null)
      setResult({ type: 'failure' })
      return
    }

    opened.opener = null
    opened.location.replace('https://example.com/')
    setSelectedSlot(null)
  }

  return (
    <main
      className={css({
        background: 'white',
        color: 'ink',
        fontFamily: 'sans',
        minHeight: '100vh',
      })}
    >
      <nav
        aria-label="서비스 메뉴"
        className={css({
          alignItems: 'center',
          borderBottom: '1px solid token(colors.line)',
          display: 'flex',
          height: '64px',
          justifyContent: 'space-between',
          marginX: 'auto',
          maxWidth: '1120px',
          paddingX: { base: '20px', md: '32px' },
        })}
      >
        <strong className={css({ fontSize: '19px', letterSpacing: '-.04em' })}>
          오늘의 행운
        </strong>
        <span
          className={css({
            background: 'cream',
            borderRadius: '999px',
            color: 'grape',
            fontSize: '12px',
            fontWeight: '700',
            padding: '7px 11px',
          })}
        >
          {SLOT_DETAILS[currentPeriod].label} 참여 시간
        </span>
      </nav>

      <div
        className={css({
          marginX: 'auto',
          maxWidth: '1040px',
          padding: { base: '68px 20px 100px', md: '104px 32px 140px' },
        })}
      >
        <header className={css({ marginBottom: { base: '64px', md: '96px' } })}>
          <p
            className={css({
              color: 'grape',
              fontSize: '15px',
              fontWeight: '800',
              marginBottom: '18px',
            })}
          >
            DAILY REWARD
          </p>
          <h1
            className={css({
              fontSize: { base: '42px', md: '64px' },
              fontWeight: '900',
              letterSpacing: '-.055em',
              lineHeight: '1.13',
              maxWidth: '760px',
            })}
          >
            오늘도 작은 행운을
            <br />
            놓치지 마세요
          </h1>
          <p
            className={css({
              color: 'muted',
              fontSize: { base: '17px', md: '20px' },
              lineHeight: '1.65',
              marginTop: '24px',
            })}
          >
            하루 세 번, 시간대에 맞는 미션을 완료하면
            <br className={css({ display: { base: 'none', sm: 'block' } })} />
            마지막 보너스까지 받을 수 있어요.
          </p>
        </header>

        <section
          aria-labelledby="progress-title"
          className={css({
            background: 'surface',
            borderRadius: { base: '24px', md: '32px' },
            display: 'grid',
            gap: { base: '24px', md: '40px' },
            gridTemplateColumns: { base: '1fr', md: '1fr auto' },
            marginBottom: '24px',
            padding: { base: '24px', md: '34px 38px' },
          })}
        >
          <div>
            <div
              className={css({
                alignItems: 'baseline',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '16px',
              })}
            >
              <h2 id="progress-title" className={css({ fontSize: '20px', fontWeight: '800' })}>
                오늘의 진행 상황
              </h2>
              <strong className={css({ color: 'grape', fontSize: '15px' })}>
                {progressCount} / 3
              </strong>
            </div>
            <div
              aria-label={`오늘 미션 ${progressPercent}% 완료`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={progressPercent}
              className={css({
                background: '#dfe3e8',
                borderRadius: '999px',
                height: '10px',
                overflow: 'hidden',
              })}
              role="progressbar"
            >
              <div
                className={css({
                  background: 'grape',
                  borderRadius: 'inherit',
                  height: '100%',
                  transition: 'width 300ms ease',
                })}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div
            className={css({
              alignItems: 'center',
              display: 'flex',
              gap: '10px',
              minWidth: { md: '220px' },
            })}
          >
            <span
              aria-hidden="true"
              className={css({
                background: 'cream',
                borderRadius: '999px',
                color: 'grape',
                display: 'grid',
                fontSize: '18px',
                height: '42px',
                placeItems: 'center',
                width: '42px',
              })}
            >
              ✓
            </span>
            <div>
              <p className={css({ color: 'subtle', fontSize: '12px', fontWeight: '700' })}>
                지금 참여 가능
              </p>
              <strong>{SLOT_DETAILS[currentPeriod].label} 슬롯</strong>
            </div>
          </div>
        </section>

        <section aria-labelledby="slot-title">
          <div
            className={css({
              alignItems: { base: 'flex-start', sm: 'end' },
              display: 'flex',
              flexDirection: { base: 'column', sm: 'row' },
              gap: '10px',
              justifyContent: 'space-between',
              margin: { base: '64px 0 24px', md: '88px 0 28px' },
            })}
          >
            <div>
              <p className={css({ color: 'grape', fontSize: '14px', fontWeight: '800' })}>
                TODAY&apos;S MISSION
              </p>
              <h2
                id="slot-title"
                className={css({
                  fontSize: { base: '30px', md: '38px' },
                  fontWeight: '900',
                  letterSpacing: '-.045em',
                  marginTop: '10px',
                })}
              >
                받을 보상을 선택하세요
              </h2>
            </div>
            <p className={css({ color: 'subtle', fontSize: '14px' })}>
              외부 페이지에서 3초 이상 머물면 완료돼요
            </p>
          </div>

          <div
            className={css({
              display: 'grid',
              gap: '14px',
              gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' },
            })}
          >
            {BASE_SLOTS.map((slot, index) => {
              const detail = SLOT_DETAILS[slot]
              const completed = progress.completed.includes(slot)
              const isExtra = extraChanceSlot === slot
              const enabled = isBaseSlotEnabled(slot, currentPeriod, progress)
              return (
                <article
                  key={slot}
                  className={css({
                    background: completed ? '#f7f9fa' : 'white',
                    border: completed
                      ? '1px solid token(colors.line)'
                      : enabled
                        ? '2px solid token(colors.grape)'
                        : '1px solid token(colors.line)',
                    borderRadius: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '314px',
                    opacity: enabled || completed ? 1 : 0.65,
                    padding: '24px',
                    transition: 'border-color 180ms ease, transform 180ms ease',
                    _hover: enabled ? { transform: 'translateY(-3px)' } : undefined,
                  })}
                >
                  <div
                    className={css({
                      alignItems: 'center',
                      display: 'flex',
                      justifyContent: 'space-between',
                    })}
                  >
                    <span
                      className={css({
                        color: 'subtle',
                        fontSize: '12px',
                        fontWeight: '800',
                      })}
                    >
                      0{index + 1}
                    </span>
                    {completed ? (
                      <span
                        className={css({
                          background: 'mint',
                          borderRadius: '999px',
                          color: 'success',
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '5px 9px',
                        })}
                      >
                        완료
                      </span>
                    ) : isExtra ? (
                      <span
                        className={css({
                          background: 'peach',
                          borderRadius: '999px',
                          color: '#b65c00',
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '5px 9px',
                        })}
                      >
                        추가 기회
                      </span>
                    ) : enabled ? (
                      <span
                        className={css({
                          color: 'grape',
                          fontSize: '11px',
                          fontWeight: '800',
                        })}
                      >
                        참여 가능
                      </span>
                    ) : null}
                  </div>

                  <div
                    aria-hidden="true"
                    className={css({
                      alignItems: 'center',
                      background: detail.color,
                      borderRadius: '18px',
                      display: 'flex',
                      fontSize: '30px',
                      height: '62px',
                      justifyContent: 'center',
                      marginTop: '26px',
                      width: '62px',
                    })}
                  >
                    {detail.icon}
                  </div>
                  <h3
                    className={css({
                      fontSize: '24px',
                      fontWeight: '850',
                      letterSpacing: '-.035em',
                      marginTop: '20px',
                    })}
                  >
                    {detail.label}
                  </h3>
                  <p className={css({ color: 'muted', fontSize: '14px', marginTop: '6px' })}>
                    {detail.message}
                  </p>
                  <p className={css({ color: 'subtle', fontSize: '12px', marginTop: '4px' })}>
                    {detail.time}
                  </p>
                  <Button
                    className={css({ marginTop: 'auto', width: '100%' })}
                    disabled={!enabled}
                    variant={completed ? 'secondary' : 'primary'}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {completed ? '수령 완료' : enabled ? '행운 확인하기' : '참여 시간이 아니에요'}
                  </Button>
                </article>
              )
            })}
          </div>
        </section>

        {bonusUnlocked && (
          <section
            aria-labelledby="bonus-title"
            className={css({
              alignItems: { base: 'stretch', md: 'center' },
              background: 'grape',
              borderRadius: '28px',
              color: 'white',
              display: 'flex',
              flexDirection: { base: 'column', md: 'row' },
              gap: '24px',
              justifyContent: 'space-between',
              marginTop: '18px',
              padding: { base: '28px', md: '34px 38px' },
            })}
          >
            <div className={css({ alignItems: 'center', display: 'flex', gap: '18px' })}>
              <span
                aria-hidden="true"
                className={css({
                  background: 'rgba(255,255,255,.16)',
                  borderRadius: '18px',
                  display: 'grid',
                  fontSize: '34px',
                  height: '64px',
                  placeItems: 'center',
                  width: '64px',
                })}
              >
                🎁
              </span>
              <div>
                <p className={css({ fontSize: '12px', fontWeight: '800', opacity: 0.72 })}>
                  ALL CLEAR
                </p>
                <h2 id="bonus-title" className={css({ fontSize: '23px', fontWeight: '850' })}>
                  마지막 보너스가 열렸어요
                </h2>
              </div>
            </div>
            <Button
              disabled={progress.completed.includes('bonus')}
              variant="secondary"
              onClick={() => setSelectedSlot('bonus')}
            >
              {progress.completed.includes('bonus') ? '보너스 수령 완료' : '보너스 받기'}
            </Button>
          </section>
        )}

        <footer
          className={css({
            alignItems: { base: 'flex-start', sm: 'center' },
            borderTop: '1px solid token(colors.line)',
            color: 'muted',
            display: 'flex',
            flexDirection: { base: 'column', sm: 'row' },
            fontSize: '13px',
            gap: '12px',
            justifyContent: 'space-between',
            marginTop: '72px',
            paddingTop: '24px',
          })}
        >
          <span>
            테스트 시간대 · <strong>{SLOT_DETAILS[currentPeriod].label}</strong>
          </span>
          <Button size="sm" variant="ghost" onClick={reset}>
            오늘 기록 초기화
          </Button>
        </footer>
      </div>

      {selectedSlot && (
        <Popup
          title={`${SLOT_DETAILS[selectedSlot].label} 보상 받기`}
          confirmLabel="미션 시작하기"
          onClose={() => setSelectedSlot(null)}
          onConfirm={openLanding}
        >
          <p>
            새로 열리는 페이지에서 <strong>3초 이상</strong> 머문 뒤 돌아오면 보상이
            자동으로 지급돼요.
          </p>
        </Popup>
      )}

      {result && (
        <Popup
          title={result.type === 'success' ? '보상을 받았어요 🎉' : '조금만 더 머물러 주세요'}
          onClose={() => setResult(null)}
        >
          {result.type === 'success' ? (
            <p>
              미션을 완료했어요
              {result.elapsed ? ` (${result.elapsed.toFixed(1)}초)` : ''}. 다음 시간대의
              행운도 놓치지 마세요.
            </p>
          ) : (
            <p>
              {result.elapsed === undefined
                ? '팝업이 차단됐어요. 브라우저에서 팝업을 허용한 뒤 다시 시도해 주세요.'
                : `${result.elapsed.toFixed(1)}초 동안 머물렀어요. 3초 이상 머물면 보상을 받을 수 있어요.`}
            </p>
          )}
        </Popup>
      )}
    </main>
  )
}

export default App
