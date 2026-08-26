import type { ProjectAccent } from "@/lib/color"

// 프로젝트 카드 호버 시 반영할 브랜드 컬러 (로고/배너 기반). 로고를 받은 프로젝트만
// 등록되어 있고, 없는 프로젝트는 호버해도 색이 바뀌지 않는다.
// - primary: DotNav dot, 캔버스 톤, 태그 pill처럼 단색이 필요한 곳
// - blobs: 배경 blob a/b/c 각각에 입힐 색 — 그라디언트 브랜드는 여러 색을 넣어 재현
export const PROJECT_ACCENT: Record<string, ProjectAccent> = {
  "01": {
    // Fintag — 로고의 # 심볼 레드, 단색이라 세 blob 모두 동일
    primary: "#F0283C",
    blobs: ["#F0283C", "#F0283C", "#F0283C"],
  },
  "02": {
    // CoChat for Business — 배너 그라디언트(노랑 → 코랄 → 파랑). 배너 원본은 파스텔
    // 톤이라, Fintag 레드와 강조감이 비슷하게 느껴지도록 채도/명도를 확 끌어올림
    primary: "#E63E7A",
    blobs: ["#F0B400", "#1F8FE0", "#E63E7A"],
  },
  "03": {
    // Gopssl — 로고 워드마크의 플럼/퍼플, 단색이라 세 blob 모두 동일
    primary: "#7A3986",
    blobs: ["#7A3986", "#7A3986", "#7A3986"],
  },
  "04": {
    // CoChat — CoChat for Business와 같은 큐브 로고 계열(노랑/파랑/레드)이지만, 로고의
    // 짙은 네이비 말풍선 톤을 살려 자매 프로덕트인 CoChat for Business보다 전체적으로
    // 어둡고 차분한 색감으로 구분되게 함
    primary: "#B8241E",
    blobs: ["#B8860A", "#1A2B6B", "#B8241E"],
  },
}

// 카드 그리드(2열)에서 프로젝트가 위치한 사분면 방향으로 blob이 살짝 쏠리게 해
// 호버할 때마다 그라디언트가 실제로 "반응"하는 느낌을 준다. x/y는 -1~1.
export const PROJECT_PULL: Record<string, { x: number; y: number }> = {
  "01": { x: -1, y: -1 },
  "02": { x: 1, y: -1 },
  "03": { x: -1, y: 1 },
  "04": { x: 1, y: 1 },
}

export const DEFAULT_ACCENT: ProjectAccent = {
  primary: "#4F6EF7",
  blobs: ["#4F6EF7", "#4F6EF7", "#4F6EF7"],
}
