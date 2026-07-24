import { describe, expect, it } from 'vitest'
import {
  completeSlot,
  getExtraChanceSlot,
  isBonusUnlocked,
  periodFromHour,
  type DailyProgress,
} from './reward-logic'

describe('reward slot rules', () => {
  it('maps hours to the three required periods', () => {
    expect(periodFromHour(0)).toBe('morning')
    expect(periodFromHour(11)).toBe('morning')
    expect(periodFromHour(12)).toBe('lunch')
    expect(periodFromHour(17)).toBe('lunch')
    expect(periodFromHour(18)).toBe('dinner')
    expect(periodFromHour(23)).toBe('dinner')
  })

  it('opens morning as the one extra chance after lunch is complete', () => {
    expect(getExtraChanceSlot({ completed: ['lunch'], extraChanceUsed: false })).toBe(
      'morning',
    )
  })

  it('prioritizes lunch when dinner is complete and both earlier slots were missed', () => {
    expect(getExtraChanceSlot({ completed: ['dinner'], extraChanceUsed: false })).toBe(
      'lunch',
    )
  })

  it('consumes the extra chance after the eligible missed slot completes', () => {
    const state: DailyProgress = { completed: ['dinner'], extraChanceUsed: false }
    expect(completeSlot(state, 'lunch').extraChanceUsed).toBe(true)
  })

  it('unlocks the fourth slot only after all base rewards are complete', () => {
    expect(
      isBonusUnlocked({
        completed: ['morning', 'lunch', 'dinner'],
        extraChanceUsed: false,
      }),
    ).toBe(true)
    expect(
      isBonusUnlocked({ completed: ['morning', 'lunch'], extraChanceUsed: false }),
    ).toBe(false)
  })
})
