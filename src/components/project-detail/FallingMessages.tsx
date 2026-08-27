import { useRef } from "react"
import type { CSSProperties } from "react"
import type { ProjectAccent } from "@/lib/color"
import { mixWithWhite } from "@/lib/color"

// CoChat for Business Overview 히어로 배경. 메신저 말풍선/종이비행기/하트
// 아이콘이 화면 위쪽 밖에서 아래쪽 밖으로 끝없이 흘러내리며, "여러 메신저
// 알림에 파묻힌다"는 이 프로젝트의 문제의식을 은은하게 암시한다. 정보가
// 아니라 분위기라 히어로 텍스트(z-10) 뒤(z-0)에 낮은 불투명도로 깔고,
// transform/opacity만 움직여 컴포지터에서 처리되게 한다. HeroBarChart와
// 마찬가지로 visible로 등장/이탈 페이드를 제어한다.

const ICON_COUNT = 18

type Shape = "bubble" | "plane" | "heart"
// 말풍선이 주가 되고 종이비행기·하트를 가끔 섞는다(레퍼런스 인포그래픽 비율)
const SHAPES: Shape[] = [
  "bubble",
  "bubble",
  "bubble",
  "bubble",
  "plane",
  "heart",
]

interface Drop {
  leftPct: number
  size: number
  durationS: number
  delayS: number
  driftVw: number
  rotateDeg: number
  opacity: number
  shape: Shape
  color: string
}

// 인덱스 기반 결정적 의사난수 — 마운트할 때마다 배치가 흔들리지 않게 한다
function rand(i: number, salt: number): number {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

function buildDrops(accent: ProjectAccent): Drop[] {
  // blob 3색을 흰색과 섞어 파스텔로 눅인 팔레트 — 히어로 텍스트 가독성을
  // 해치지 않으면서 레퍼런스의 알록달록한 느낌만 가져온다
  const palette = accent.blobs.map((c) => mixWithWhite(c, 0.4))
  return Array.from({ length: ICON_COUNT }, (_, i) => ({
    leftPct: rand(i, 1) * 96 + 2,
    size: 20 + rand(i, 2) * 30,
    durationS: 9 + rand(i, 3) * 8,
    // 음수 delay로 마운트 시점에 이미 제각기 다른 높이에서 낙하 중이게 한다
    delayS: -(rand(i, 4) * 17),
    driftVw: (rand(i, 5) - 0.5) * 7,
    rotateDeg: (rand(i, 6) - 0.5) * 44,
    opacity: 0.45 + rand(i, 7) * 0.4,
    shape: SHAPES[Math.floor(rand(i, 8) * SHAPES.length)],
    color: palette[i % palette.length],
  }))
}

function ShapeIcon({ shape }: { shape: Shape }) {
  if (shape === "plane") {
    return (
      <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
        <path d="M2 12 22 3l-4 18-5-6-4 3v-4.5L18 6 6.5 12.5z" />
      </svg>
    )
  }
  if (shape === "heart") {
    return (
      <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
        <path d="M12 21S3 14.6 3 8.7A4.7 4.7 0 0 1 12 6a4.7 4.7 0 0 1 9 2.7C21 14.6 12 21 12 21z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
      <path d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <circle cx="8" cy="10.5" r="1.5" fill="#fff" />
      <circle cx="12" cy="10.5" r="1.5" fill="#fff" />
      <circle cx="16" cy="10.5" r="1.5" fill="#fff" />
    </svg>
  )
}

export function FallingMessages({
  accent,
  visible,
}: {
  accent: ProjectAccent
  visible: boolean
}) {
  // 배치는 마운트 시 한 번만 뽑는다 — visible 토글로 다시 뽑으면 아이콘들이
  // 점프하듯 자리를 옮긴다
  const dropsRef = useRef<Drop[] | null>(null)
  if (!dropsRef.current) dropsRef.current = buildDrops(accent)
  const drops = dropsRef.current

  return (
    <div
      aria-hidden="true"
      className="falling-messages-layer absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-700"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {drops.map((d, i) => {
        const style: CSSProperties & Record<"--fall-drift" | "--fall-rot", string> =
          {
            left: `${d.leftPct}%`,
            top: 0,
            width: `${d.size}px`,
            height: `${d.size}px`,
            color: d.color,
            opacity: d.opacity,
            animation: `message-fall ${d.durationS}s linear ${d.delayS}s infinite`,
            animationPlayState: visible ? "running" : "paused",
            "--fall-drift": `${d.driftVw}vw`,
            "--fall-rot": `${d.rotateDeg}deg`,
          }
        return (
          <div
            key={i}
            className="falling-message absolute drop-shadow-sm"
            style={style}
          >
            <ShapeIcon shape={d.shape} />
          </div>
        )
      })}
    </div>
  )
}
