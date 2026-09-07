// 프로젝트 카드 호버 시 반영할 브랜드 컬러 (로고/배너 기반). 로고를 받은 프로젝트만
// 등록되어 있고, 없는 프로젝트는 호버해도 색이 바뀌지 않는다.
// - primary: DotNav dot, 캔버스 톤, 태그 pill처럼 단색이 필요한 곳
// - blobs: 배경 blob a/b/c 각각에 입힐 색 — 그라디언트 브랜드는 여러 색을 넣어 재현
export type ProjectAccent = {
  primary: string
  blobs: [string, string, string]
}

export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "")
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

// DotNav dot·태그 pill처럼 작은 UI에 브랜드 컬러를 입힐 때 쓰는 그라디언트.
// blobs 3색이 모두 같은 단색 프로젝트는 자연히 flat color로 보이고,
// CoChat/CoChat for Business처럼 3색이 다른 프로젝트는 그 다색이 그대로 드러난다.
export function accentGradient(accent: ProjectAccent): string {
  return `linear-gradient(135deg, ${accent.blobs[0]}, ${accent.blobs[1]}, ${accent.blobs[2]})`
}

// 카드 태그(AccentPill)·SOLUTION 라벨/선택 탭이 공유하는 "은은한 pill" 배경 —
// primary를 옅게 깐 radial 위에 blobs 3색을 흰색과 섞은 linear를 얹는다.
// whiteMix가 클수록 파스텔에 가깝다(기본 0.5, CoChat for Business는 0.2).
export function softPillGradient(accent: ProjectAccent, whiteMix = 0.5): string {
  return `radial-gradient(ellipse at center, ${hexToRgba(accent.primary, 0.3)} 0%, transparent 72%), linear-gradient(135deg, ${mixWithWhite(accent.blobs[0], whiteMix)}, ${mixWithWhite(accent.blobs[1], whiteMix)}, ${mixWithWhite(accent.blobs[2], whiteMix)})`
}

// hex를 흰색과 섞어 옅게 만든다. 상세 페이지에서는 opacity를 낮추는 대신 이걸
// 써서 색 자체를 옅은 톤으로 바꾼다 — opacity만 낮추면 blob overlay가 밑에
// 깔린 파랑/보라 앰비언트 base를 다 못 가려서 색이 탁하게 섞여 보이기 때문.
export function mixWithWhite(hex: string, ratio: number): string {
  const h = hex.replace("#", "")
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const mix = (c: number) => Math.round(c + (255 - c) * ratio)
  const toHex = (c: number) => c.toString(16).padStart(2, "0")
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`
}
