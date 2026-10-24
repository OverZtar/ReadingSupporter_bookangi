import type { InputEvent } from '@/shared/events'

// 2단계: 웹캠 핸드트래킹 -> 포인팅(가까운 단어 스냅) / 번호 메뉴 / 주먹=취소.
// 제스처는 hold 시간으로 안정화한다. gaze 모듈을 import 하지 않는다.
export function startHandInput(_emit: (ev: InputEvent) => void): () => void {
  return () => {}
}
