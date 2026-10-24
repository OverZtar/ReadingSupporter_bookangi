import type { Dispatch } from 'react'
import type { InputEvent } from '@/shared/events'
import type { State } from '@/modules/state/machine'

// 1단계: 마우스 클릭으로 단어 조회. 텍스트 → 단어 토큰 분할은 tokenize.ts 담당.
export function Reader({ state, dispatch }: { state: State; dispatch: Dispatch<InputEvent> }) {
  return (
    <main>
      <h1>Book항이</h1>
      <p data-paragraph-id="p1">
        <span onClick={() => dispatch({ type: 'WORD_POINTED', wordId: 'w1', source: 'mouse' })}>
          예시
        </span>
      </p>
      <pre>{JSON.stringify(state)}</pre>
    </main>
  )
}
