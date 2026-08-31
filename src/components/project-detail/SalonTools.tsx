// Gopssl Overview 히어로 배경. 히어로 텍스트 주변 고정 위치에 미용실 도구
// 라인아트(가위·바리깡·헤어롤·스프레이·드라이기·고데기)와 반짝임을 흩어
// 두고, 평상시에도 도구마다 은은하게 움직이며(흔들·회전·미세진동), 커서를
// 올리면 도구 특성대로 크게 반응한다 — 가위는 자르고, 바리깡은 진동하고,
// 헤어롤은 빠르게 돌고, 스프레이는 뿌리고, 드라이기는 바람을 내고, 고데기는
// 집게가 여닫힌다.
//
// 처음 등장할 때는 전부 한 번에 뜨지 않고, seeded shuffle로 정한 --pop-delay
// 만큼 뒤죽박죽 순서로 하나씩 팝인한다. 정보가 아니라 분위기라 히어로
// 텍스트(z-10) 뒤(z-0)에 낮은 불투명도로 깔고, 순수 CSS(index.css의
// .salon-tool* / .salon-sparkle)로만 반응한다.
//
// 계층: .salon-tool(팝인) > .salon-tool-rot(각도) > .salon-tool-idle(상시
// 움직임) > svg.salon-tool-svg(호버 반응). transform이 겹치지 않게 나눴다.
//
// 가위·바리깡·스프레이는 Tabler Icons(MIT)의 아웃라인 path를 그대로 인라인으로
// 쓰고, 헤어롤·드라이기·고데기는 같은 24그리드·stroke 규격으로 직접 그렸다.
// path 문자열만 복사해 런타임 의존성은 없다.

import { useMemo } from "react"
import type { CSSProperties, ReactElement } from "react"

// Tabler — scissors. 두 손잡이 그룹을 교차점(12,12) 기준으로 벌렸다 닫음
function Scissors() {
  return (
    <svg className="salon-tool-svg" viewBox="0 0 24 24" fill="none">
      <g className="sc-a">
        <path d="M3 7a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        <path d="M8.6 15.4l10.4 -10.4" />
      </g>
      <g className="sc-b">
        <path d="M3 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        <path d="M8.6 8.6l10.4 10.4" />
      </g>
    </svg>
  )
}

// Tabler — razor-electric (바리깡)
function Clipper() {
  return (
    <svg className="salon-tool-svg" viewBox="0 0 24 24" fill="none">
      <path d="M8 3v2" />
      <path d="M12 3v2" />
      <path d="M16 3v2" />
      <path d="M9 12v6a3 3 0 0 0 6 0v-6h-6" />
      <path d="M8 5h8l-1 4h-6l-1 -4" />
      <path d="M12 17v1" />
    </svg>
  )
}

// Tabler — spray. 분무 점들(.spray-mist)만 호버 시 뿜어져 나옴
function Spray() {
  return (
    <svg className="salon-tool-svg" viewBox="0 0 24 24" fill="none">
      <path d="M4 12a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v7a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2l0 -7" />
      <path d="M6 10v-4a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v4" />
      <path d="M10 7h1" />
      <g className="spray-mist">
        <path d="M15 7h.01" />
        <path d="M18 9h.01" />
        <path d="M18 5h.01" />
        <path d="M21 3h.01" />
        <path d="M21 7h.01" />
        <path d="M21 11h.01" />
      </g>
    </svg>
  )
}

// 헤어롤 — 원통 + 양 끝 + 감긴 선. .salon-tool-idle가 통째로 천천히 회전
function Roller() {
  return (
    <svg className="salon-tool-svg" viewBox="0 0 24 24" fill="none">
      <rect x={5} y={8} width={14} height={8} rx={4} />
      <ellipse cx={5} cy={12} rx={2.4} ry={4} />
      <ellipse cx={19} cy={12} rx={2.4} ry={4} />
      <path d="M9.5 8.4v7.2" />
      <path d="M14.5 8.4v7.2" />
    </svg>
  )
}

// 헤어드라이어 — 모터 + 노즐 + 손잡이, 노즐 앞 바람 선(.dryer-air)
function Dryer() {
  return (
    <svg className="salon-tool-svg" viewBox="0 0 24 24" fill="none">
      <circle cx={8} cy={10} r={5} />
      <path d="M12.5 7.5l5 1a1.2 1.2 0 0 1 0 3l-5 1z" />
      <path d="M6 14.5v3a2.5 2.5 0 0 0 5 0v-1.5" />
      <g className="dryer-air">
        <path d="M19 6.5h3" />
        <path d="M19 10h3.5" />
        <path d="M19 13.5h3" />
      </g>
    </svg>
  )
}

// 고데기 — 얇은 배럴(.curl-barrel) + 클램프 밴드 + 굵은 손잡이 + 전선
function CurlingIron() {
  return (
    <svg className="salon-tool-svg" viewBox="0 0 24 24" fill="none">
      <g className="curl-barrel">
        <rect x={9} y={2} width={4.5} height={9} rx={2.25} />
        <path d="M8 6.3h6.5" />
      </g>
      <rect x={7} y={11} width={8.5} height={6} rx={2.6} />
      <path d="M11 17c0 3 1.5 3.6 3.4 3.6c1.9 0 2.6 -1 2.6 -2" />
    </svg>
  )
}

interface Tool {
  key: string
  toolClass: string
  rotate: number
  style: CSSProperties
  render: () => ReactElement
}

// 여섯 도구를 히어로 둘레에 배치. 중앙 텍스트 밴드(x 28~72% · y 34~56%)는 피한다
const TOOLS: Tool[] = [
  { key: "scissors", toolClass: "tool-scissors", rotate: -12, style: { left: "13%", top: "21%" }, render: Scissors },
  { key: "dryer", toolClass: "tool-dryer", rotate: -4, style: { left: "42%", top: "10%" }, render: Dryer },
  { key: "clipper", toolClass: "tool-clipper", rotate: 10, style: { right: "13%", top: "19%" }, render: Clipper },
  { key: "roller", toolClass: "tool-roller", rotate: -10, style: { left: "8%", top: "56%" }, render: Roller },
  { key: "spray", toolClass: "tool-spray", rotate: 8, style: { right: "9%", top: "56%" }, render: Spray },
  { key: "curling", toolClass: "tool-curling", rotate: 12, style: { right: "33%", top: "79%" }, render: CurlingIron },
]

// 반짝임 — 도구 사이 빈자리를 채운다. 위치와 twinkle 지연(delay)만 다르다
const SPARKLES: { style: CSSProperties; twinkleDelay: string }[] = [
  { style: { left: "25%", top: "40%" }, twinkleDelay: "0s" },
  { style: { right: "24%", top: "42%" }, twinkleDelay: "-2.6s" },
  { style: { left: "31%", top: "72%" }, twinkleDelay: "-1.4s" },
  { style: { left: "46%", top: "30%" }, twinkleDelay: "-0.7s" },
  { style: { right: "40%", top: "66%" }, twinkleDelay: "-2.3s" },
  { style: { right: "46%", top: "16%" }, twinkleDelay: "-3.1s" },
]

const TOTAL = TOOLS.length + SPARKLES.length
const POP_STEP_MS = 95

// seeded Fisher–Yates — 마운트마다 흔들리지 않는 고정 순서
function shuffledRanks(count: number): number[] {
  const idx = Array.from({ length: count }, (_, i) => i)
  let s = 20260830
  for (let i = idx.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    const j = s % (i + 1)
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  const rankOf: number[] = []
  idx.forEach((elementIndex, rank) => {
    rankOf[elementIndex] = rank
  })
  return rankOf
}

interface SalonToolsProps {
  visible: boolean
  color: string
}

export function SalonTools({ visible, color }: SalonToolsProps) {
  // 각 요소의 등장 지연(ms) — 뒤죽박죽 순서로 하나씩 팝인
  const popDelays = useMemo(
    () => shuffledRanks(TOTAL).map((rank) => rank * POP_STEP_MS),
    [],
  )

  return (
    <div
      aria-hidden="true"
      className="salon-tools absolute inset-0 overflow-hidden pointer-events-none"
      data-shown={visible ? "true" : "false"}
      style={{ color }}
    >
      {TOOLS.map(({ key, toolClass, rotate, style, render }, i) => (
        <div
          key={key}
          className={`salon-tool ${toolClass}`}
          style={{ ...style, ["--pop-delay" as string]: `${popDelays[i]}ms` }}
        >
          <div
            className="salon-tool-rot"
            style={{ transform: `rotate(${rotate}deg)` }}
          >
            <div className="salon-tool-idle">{render()}</div>
          </div>
        </div>
      ))}
      {SPARKLES.map(({ style, twinkleDelay }, i) => (
        <div
          key={i}
          className="salon-sparkle"
          style={{
            ...style,
            ["--pop-delay" as string]: `${popDelays[TOOLS.length + i]}ms`,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            style={{ animationDelay: twinkleDelay }}
          >
            <path d="M12 2C12.8 8 16 11.2 22 12C16 12.8 12.8 16 12 22C11.2 16 8 12.8 2 12C8 11.2 11.2 8 12 2Z" />
          </svg>
        </div>
      ))}
    </div>
  )
}
