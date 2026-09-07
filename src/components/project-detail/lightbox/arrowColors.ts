import { DEFAULT_ACCENT } from "@/data/projects"
import type { ProjectAccent } from "@/lib/color"
import { hexToRgba, mixWithWhite } from "@/lib/color"

// SOLUTION 쇼케이스가 이미지 사이·비교 카드 사이에 그리는 FlowArrow의 색 —
// 태그 pill 배경 그라디언트와 같은 계열이되, pill보다 흰색 혼합을 덜 써서
// 조금 더 진하게 보이게 한다. 라이트박스(멀티 이미지 확대)와 쇼케이스 본문
// 두 곳에서 같은 값을 써야 해서 여기로 뺐다.
export function getArrowColors(
  accent: ProjectAccent | null,
  projectId: string,
) {
  const pillAccent = accent ?? DEFAULT_ACCENT
  // CoChat for Business(id "02")는 배경과 마찬가지로 흰색 혼합 비율을 덜 쓴다
  const pillWhiteMix = projectId === "02" ? 0.2 : 0.5
  const arrowWhiteMix = Math.max(pillWhiteMix - 0.15, 0)
  return {
    arrowGradientStops: pillAccent.blobs.map((c) =>
      mixWithWhite(c, arrowWhiteMix),
    ),
    arrowShadowColor: hexToRgba(pillAccent.primary, 0.4),
  }
}
