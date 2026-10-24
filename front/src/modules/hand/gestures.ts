import type { MenuChoice } from '@/shared/events'

export type Gesture = { kind: 'menu'; choice: MenuChoice } | { kind: 'fist' } | { kind: 'none' }

export const HOLD_MS = 400 // 튜닝 대상

export const FINGER_TO_CHOICE: Record<1 | 2 | 3, MenuChoice> = {
  1: 'meaning',
  2: 'explain',
  3: 'search',
}
