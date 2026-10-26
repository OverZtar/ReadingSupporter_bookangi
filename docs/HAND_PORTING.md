# 손 인식 front 이식 가이드

원본: `back/app/services/hand/hand-test/` (브라우저에서 도는 JS 프로토타입. Python이 아님)
→ MediaPipe Tasks Vision을 브라우저에서 직접 돌리므로 **웹캠 프레임을 back으로 보낼 필요가 없다.** 이식 위치는 `front/src/modules/hand/`.

## 파일별 처리

| 원본 | 이식 | 비고 |
|---|---|---|
| `fingers.js` | `modules/hand/fingers.ts` | 순수 함수. 타입만 붙이고 로직 유지. vitest로 테스트 가능 |
| `posture.js` | `modules/hand/posture.ts` | `PostureGuard` 클래스. 순수, 시간은 `now` 인자로 받음 |
| `hand-gesture.html`의 루프 | `modules/hand/index.ts` (`startHandInput`) | 웹캠·MediaPipe·hold 안정화·이벤트 변환 |
| `lib/`, `hand_landmarker.task` | `front/public/mediapipe/` 또는 npm `@mediapipe/tasks-vision` | 아래 "에셋" 참고 |

## 에셋
- `lib/vision_bundle.mjs` + `lib/wasm/*`는 npm `@mediapipe/tasks-vision`과 같은 것이다. 이식 시 **npm 패키지로 교체**하고 버전을 고정한다(번들 버전이 기록돼 있지 않음). wasm은 `public/mediapipe/wasm`에 복사해 `FilesetResolver.forVisionTasks('/mediapipe/wasm')`로 로드.
- `hand_landmarker.task`(7.8MB)는 `front/public/mediapipe/`에 1개만 둔다. 현재 `back/models/`에 같은 파일이 untracked로 중복돼 있으니 커밋하지 말고 삭제.
- 이식 후 `back/app/services/hand/hand-test/`의 wasm·모델(약 26MB)은 제거해 저장소 용량을 줄인다.

## 이벤트 매핑 (원본 CustomEvent → `InputEvent`)

| 원본 | InputEvent | 처리 |
|---|---|---|
| `hand:point {x,y}` | `WORD_POINTED {wordId, source:'hand'}` | x,y는 전체 창 좌표. `document.elementFromPoint` 또는 가장 가까운 단어 span으로 **스냅**해 wordId를 구함 (`viewer/tokenize.ts`와 연결) |
| `hand:select {count}` | `MENU_SELECTED` | `FINGER_TO_CHOICE` (1=meaning, 2=explain, 3=search). **4·5는 무시** |
| `hand:cancel` | `CANCEL` | 주먹 |
| `hand:lost` | (없음) | 필요하면 포인터 숨김 처리만 |
| `hand:guide {level,msg}` | UI 안내 | 이벤트가 아니라 별도 콜백(`onGuide`)으로 노출. state로 보내지 않는다 |

`startHandInput(emit, { onGuide, onPointer })` 형태를 권장. CustomEvent(window)는 쓰지 않는다 — 모듈 간 계약은 `shared/events.ts` 하나.

## 이식 전에 고칠 점 (리뷰 결과)

1. **검지 포인팅과 "1번 선택"이 충돌한다.** 검지 하나(`count===1`)를 700ms 유지하면 `hand:select 1`이 발사돼 포인팅만 했는데 "뜻"이 선택된다. 해결: 포인팅은 `phase==='idle'`일 때만, 메뉴 선택은 `phase==='menu'`일 때만 방출하도록 `startHandInput`이 현재 phase를 알게 하거나(콜백으로 주입), 포인팅이 확정(WORD_POINTED)된 뒤 손 모양이 한 번 바뀌어야(`fired` 해제) 선택이 가능하게 한다. `reduce`는 이미 `phase!=='menu'`의 MENU_SELECTED를 무시하므로 최소한 잘못된 상태 전이는 막힌다.
2. **hold 시간이 다르다.** 원본 700ms, `gestures.ts`의 `HOLD_MS` 400ms. 하나로 통일(`gestures.ts`가 단일 출처).
3. **커서 좌표가 창 전체 기준.** `(1 - x) * innerWidth`는 영상 전체를 화면에 늘려 매핑한다. 뷰어 영역(Reader 컨테이너) 기준으로 바꾸고, 필요하면 손의 유효 영역을 가운데로 줄여서(가장자리 사용 어려움) 매핑한다.
4. **`fail()`이 문자열을 throw**한다. 이식 시 Error로 바꾸고, 카메라 거부·모델 로드 실패를 UI에 표시.
5. **정리(cleanup) 없음.** `startHandInput`이 반환하는 함수에서 rAF 취소, `MediaStreamTrack.stop()`, `hands.close()`를 해야 React StrictMode 이중 마운트에서 카메라가 남지 않는다.
6. `?.` `numHands:1`, `GPU→CPU` 폴백은 그대로 유지. 임계값(`TH`, `GUIDE`)은 `fingers.ts` 상단에 둔 채로 현장 조명에서 재튜닝.

## 검증 현황
- 합성 랜드마크로 `fingersUp`이 펴짐 0/1/2/3/5개를 올바르게 구분함을 확인 (Node).
- **실제 웹캠 검증은 아직 안 됨.** 이식 전 `cd back/app/services/hand/hand-test && python -m http.server` 후 브라우저에서 1/2/3/주먹/손 사라짐/화면 가장자리 안내를 각 1회 확인할 것.
- 이식 시 `fingers.ts`, `PostureGuard`에 vitest 추가 (위 합성 손 모양을 픽스처로 사용 가능).
