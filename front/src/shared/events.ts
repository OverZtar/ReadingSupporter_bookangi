// 손/시선/마우스 모듈은 서로를 모른다. 모두 InputEvent만 state로 보낸다.
export type MenuChoice = 'meaning' | 'explain' | 'search'

export type InputEvent =
  | { type: 'WORD_POINTED'; wordId: string; source: 'mouse' | 'hand' }
  | { type: 'MENU_SELECTED'; choice: MenuChoice }
  | { type: 'CANCEL' }
  | { type: 'GAZE_PARAGRAPH'; paragraphId: string | null }
