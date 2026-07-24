export const BASE_SLOTS = ['morning', 'lunch', 'dinner'] as const
export type BaseSlotId = (typeof BASE_SLOTS)[number]
export type SlotId = BaseSlotId | 'bonus'

export type DailyProgress = {
  completed: SlotId[]
  extraChanceUsed: boolean
}

export const EMPTY_PROGRESS: DailyProgress = {
  completed: [],
  extraChanceUsed: false,
}

export function periodFromHour(hour: number): BaseSlotId {
  if (hour < 12) return 'morning'
  if (hour < 18) return 'lunch'
  return 'dinner'
}

export function periodFromQuery(search: string, now = new Date()): BaseSlotId {
  const test = new URLSearchParams(search).get('test')
  return BASE_SLOTS.includes(test as BaseSlotId)
    ? (test as BaseSlotId)
    : periodFromHour(now.getHours())
}

export function getExtraChanceSlot(progress: DailyProgress): BaseSlotId | null {
  if (progress.extraChanceUsed) return null

  const latestCompletedIndex = BASE_SLOTS.reduce(
    (latest, slot, index) => (progress.completed.includes(slot) ? index : latest),
    -1,
  )

  for (let index = latestCompletedIndex - 1; index >= 0; index -= 1) {
    const slot = BASE_SLOTS[index]
    if (!progress.completed.includes(slot)) return slot
  }
  return null
}

export function isBaseSlotEnabled(
  slot: BaseSlotId,
  currentPeriod: BaseSlotId,
  progress: DailyProgress,
): boolean {
  if (progress.completed.includes(slot)) return false
  return slot === currentPeriod || slot === getExtraChanceSlot(progress)
}

export function isBonusUnlocked(progress: DailyProgress): boolean {
  return BASE_SLOTS.every((slot) => progress.completed.includes(slot))
}

export function completeSlot(progress: DailyProgress, slot: SlotId): DailyProgress {
  if (progress.completed.includes(slot)) return progress
  const extraSlot = getExtraChanceSlot(progress)
  return {
    completed: [...progress.completed, slot],
    extraChanceUsed: progress.extraChanceUsed || slot === extraSlot,
  }
}
