import type { InputEvent } from '@/shared/events'

// 3단계: 시선 오차 ~100px -> 문단/줄 수준 보조 입력만. 단어 지정은 hand 담당.
// hand 모듈을 import 하지 않는다. 이 모듈이 없어도 2단계 데모는 동작해야 한다.
export function startGazeInput(_emit: (ev: InputEvent) => void): () => void {
  return () => {}
}
