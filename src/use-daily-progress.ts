import { useCallback, useEffect, useState } from 'react'
import {
  completeSlot,
  EMPTY_PROGRESS,
  type DailyProgress,
  type SlotId,
} from './reward-logic'

const STORAGE_PREFIX = 'panda-reward-slots'

function dateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function storageKey() {
  return `${STORAGE_PREFIX}:${dateKey()}`
}

function readProgress(): DailyProgress {
  try {
    const saved = localStorage.getItem(storageKey())
    return saved ? JSON.parse(saved) : EMPTY_PROGRESS
  } catch {
    return EMPTY_PROGRESS
  }
}

export function useDailyProgress() {
  const [progress, setProgress] = useState<DailyProgress>(readProgress)

  useEffect(() => {
    localStorage.setItem(storageKey(), JSON.stringify(progress))
  }, [progress])

  const markComplete = useCallback((slot: SlotId) => {
    setProgress((current) => completeSlot(current, slot))
  }, [])

  const reset = useCallback(() => {
    localStorage.removeItem(storageKey())
    setProgress(EMPTY_PROGRESS)
  }, [])

  return { progress, markComplete, reset }
}
