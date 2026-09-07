export type LightboxPhase = "closed" | "opening" | "open" | "closing"

// FLIP(First-Last-Invert-Play) 애니메이션 — source(작은 썸네일 위치)에서
// target(라이트박스 안 자연스러운 크기)까지 그리는 데 필요한 translate·scale을
// 계산한다. 두 rect의 가로/세로 비율이 다를 수 있어(아이콘·gap 크기가 달라짐)
// scale은 더 작은 쪽에 맞춰 하나로 통일해 찌그러지지 않게 한다.
export function computeFlipTransform(source: DOMRect, target: DOMRect) {
  const scale = Math.min(
    source.width / target.width,
    source.height / target.height,
  )
  const dx = source.left + source.width / 2 - (target.left + target.width / 2)
  const dy = source.top + source.height / 2 - (target.top + target.height / 2)
  return { dx, dy, scale }
}
