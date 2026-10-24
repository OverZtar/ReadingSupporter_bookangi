import { describe, expect, it } from 'vitest'
import { initialState, reduce } from './machine'

describe('state machine', () => {
  it('단어 지정 → 메뉴', () => {
    const s = reduce(initialState, { type: 'WORD_POINTED', wordId: 'w1', source: 'mouse' })
    expect(s.phase).toBe('menu')
  })
  it('주먹(취소) → idle', () => {
    const s = reduce({ ...initialState, phase: 'menu', wordId: 'w1' }, { type: 'CANCEL' })
    expect(s).toMatchObject({ phase: 'idle', wordId: null })
  })
})
