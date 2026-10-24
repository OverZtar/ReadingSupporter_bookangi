export interface WordToken {
  id: string
  text: string
}

// TODO(1단계): 문단 텍스트를 어절 단위 토큰으로 분할
export function tokenize(paragraphId: string, text: string): WordToken[] {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((t, i) => ({ id: `${paragraphId}-${i}`, text: t }))
}
