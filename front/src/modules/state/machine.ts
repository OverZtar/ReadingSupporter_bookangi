import type { InputEvent, MenuChoice } from '@/shared/events'

export interface State {
  phase: 'idle' | 'menu' | 'result'
  wordId: string | null
  choice: MenuChoice | null
  gazeParagraphId: string | null
}

export const initialState: State = {
  phase: 'idle',
  wordId: null,
  choice: null,
  gazeParagraphId: null,
}

// 순수 함수: 웹캠/DOM 없이 테스트 가능해야 한다.
export function reduce(state: State, ev: InputEvent): State {
  switch (ev.type) {
    case 'WORD_POINTED':
      return { ...state, phase: 'menu', wordId: ev.wordId, choice: null }
    case 'MENU_SELECTED':
      return state.phase === 'menu' ? { ...state, phase: 'result', choice: ev.choice } : state
    case 'CANCEL':
      return { ...state, phase: 'idle', wordId: null, choice: null }
    case 'GAZE_PARAGRAPH':
      return { ...state, gazeParagraphId: ev.paragraphId }
  }
}
