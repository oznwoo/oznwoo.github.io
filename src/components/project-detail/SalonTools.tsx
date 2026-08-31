// Gopssl Overview 히어로 배경. 히어로 텍스트 주변 대략적인 위치에 미용실 도구
// 라인아트(가위·바리깡·손거울·스프레이·드라이기·고데기)와 반짝임을 흩어
// 두고, 등장한 뒤에도 도구마다 다른 주기로 천천히 떠다닌다(표류·흔들·미세
// 진동). 커서를 올리면 그 자리에 멈춰 고정된 채로 도구 특성대로 크게
// 반응한다 — 가위는 자르고, 바리깡은 진동하고, 손거울은 반짝이고,
// 스프레이는 뿌리고, 드라이기는 바람을 내고, 고데기는 집게가 여닫힌다.
//
// 처음 등장할 때는 전부 한 번에 뜨지 않고, seeded shuffle로 정한 --pop-delay
// 만큼 뒤죽박죽 순서로 하나씩 팝인한다. 정보가 아니라 분위기라 히어로
// 텍스트(z-10) 뒤(z-0)에 낮은 불투명도로 깔고, 순수 CSS(index.css의
// .salon-tool* / .salon-sparkle)로만 반응한다.
//
// 계층: .salon-tool(팝인) > .salon-tool-drift(느린 표류) > .salon-tool-rot
// (각도) > .salon-tool-idle(제자리 흔들림) > svg.salon-tool-svg(호버 반응).
// transform이 겹치지 않게 층마다 나눴고, 호버 시 drift·idle을 함께 멈춘다.
//
// 가위·바리깡·스프레이는 Tabler Icons(MIT)의 아웃라인 path를 그대로 인라인으로
// 쓰고, 손거울·드라이기·고데기는 같은 24그리드·stroke 규격으로 직접 그렸다.
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

// 탁상 거울 — 원형 거울 + 오른쪽 위 사선 하이라이트 2줄 + 거울 아래를 감싸는
// C자 받침 + 기둥 + 바닥. 호버 시 거울 면에서 4각 별(.mirror-spark)이 커졌다
// 작아지며 반짝인다
function StandMirror() {
  return (
    <svg className="salon-tool-svg" viewBox="0 0 24 24" fill="none">
      <circle cx={12} cy={7.5} r={6} />
      <path d="M12 4.3l2.8 -2.2" />
      <path d="M13.6 6.2l2.2 -1.7" />
      <path d="M7.6 11.4q0 4.6 4.4 4.6t4.4 -4.6" />
      <path d="M12 15.8v2.4" />
      <path d="M8.6 18.2h6.8" />
      <path
        className="mirror-spark"
        fill="currentColor"
        stroke="none"
        d="M12 3.8l0.9 2.9l2.9 0.9l-2.9 0.9l-0.9 2.9l-0.9 -2.9l-2.9 -0.9l2.9 -0.9z"
      />
    </svg>
  )
}

// 헤어드라이어 — 뒤쪽 모터(왼쪽 동심원) + 앞으로 살짝 벌어지는 노즐(오른쪽) +
// 손잡이. 노즐이 오른쪽을 향하고 그 앞으로 바람(.dryer-air)이 호버 시 뿜어진다
function Dryer() {
  return (
    <svg className="salon-tool-svg" viewBox="0 0 24 24" fill="none">
      <circle cx={5.5} cy={9} r={4.5} />
      <circle cx={5.5} cy={9} r={1.5} />
      <path d="M9.5 4.8l6.8 -2a1.1 1.1 0 0 1 1.5 1.1v7.6a1.1 1.1 0 0 1 -1.5 1.1l-6.8 -2" />
      <path d="M3 12.6v4.3a2.5 2.5 0 0 0 5 0v-2" />
      <g className="dryer-air">
        <path d="M19 5h2.5" />
        <path d="M19 9h3" />
        <path d="M19 13h2.5" />
      </g>
    </svg>
  )
}

// 고데기(판고데) — 왼쪽 경첩(원) + 오른쪽으로 벌어진 두 판(끝이 둥근 막대) +
// 경첩 옆 스프링. 호버 시 위 판(.curl-clamp)이 경첩을 축으로 아래 판 쪽으로
// 여닫히며 집게처럼 움직인다
function CurlingIron() {
  return (
    <svg className="salon-tool-svg" viewBox="0 0 24 24" fill="none">
      <circle cx={4.5} cy={12} r={2} />
      <rect x={5} y={12.4} width={13.5} height={2.8} rx={1.4} transform="rotate(16 5 13.8)" />
      <path d="M6.6 10.7l1.6 2.7" />
      <g className="curl-clamp">
        <rect x={5} y={8.8} width={13.5} height={2.8} rx={1.4} transform="rotate(-16 5 10.2)" />
      </g>
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
  { key: "mirror", toolClass: "tool-mirror", rotate: -5, style: { left: "8%", top: "56%" }, render: StandMirror },
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
const POP_STEP_MS = 55

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
          <div className="salon-tool-drift">
            <div
              className="salon-tool-rot"
              style={{ transform: `rotate(${rotate}deg)` }}
            >
              <div className="salon-tool-idle">{render()}</div>
            </div>
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
