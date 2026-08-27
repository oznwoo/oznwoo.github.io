import { useEffect, useRef } from "react"
import type { ProjectAccent } from "@/lib/color"
import { mixWithWhite } from "@/lib/color"

// CoChat for Business Overview 히어로 배경. 메신저 말풍선/종이비행기/하트
// 아이콘이 화면 위쪽 밖에서 아래쪽 밖으로 끝없이 흘러내리고, 커서가 가까이
// 오면 밀려나며 도망친다("여러 메신저 알림에 파묻힌다"는 문제의식을 놀이처럼
// 뒤집는다). 정보가 아니라 분위기라 히어로 텍스트(z-10) 뒤(z-0)에 낮은
// 불투명도로 깔고, requestAnimationFrame 루프에서 transform만 갱신해
// 컴포지터에서 처리되게 한다. HeroBarChart처럼 visible로 등장/이탈을 제어한다.

const ICON_COUNT = 18
// 커서가 이 반경(px) 안에 들어오면 아이콘이 밀려나기 시작한다
const FLEE_RADIUS = 160
// 반발 가속도 스케일(px/s^2 수준). 거리가 가까울수록 제곱으로 세진다
const FLEE_STRENGTH = 5200
// vx가 기준 드리프트로, 회전이 기본 스핀으로 돌아오는 감쇠 세기
const SETTLE = 2.6
// 낙하 속도로 수렴하는 감쇠 세기
const FALL_SETTLE = 3
// 탭 비활성 등으로 프레임 간격이 크게 튀어 아이콘이 순간이동하는 것 방지
const MAX_DT = 1 / 30

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

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  baseVx: number // 평상시 가로 드리프트(px/s)
  fallV: number // 목표 낙하 속도(px/s)
  spin: number // 평상시 회전 속도(deg/s)
  fleeSpin: number // 도망칠 때 더해지는 회전 속도(감쇠)
  rot: number
  size: number
  opacity: number
  shape: Shape
  color: string
}

// 인덱스 기반 결정적 의사난수 — 첫 배치가 마운트마다 흔들리지 않게 한다
function rand(i: number, salt: number): number {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

function buildParticles(
  accent: ProjectAccent,
  w: number,
  h: number,
): Particle[] {
  // blob 3색을 흰색과 섞어 파스텔로 눅인 팔레트 — 히어로 텍스트 가독성을
  // 해치지 않으면서 레퍼런스의 알록달록한 느낌만 가져온다
  const palette = accent.blobs.map((c) => mixWithWhite(c, 0.4))
  return Array.from({ length: ICON_COUNT }, (_, i) => {
    const size = 20 + rand(i, 2) * 30
    return {
      x: rand(i, 1) * w,
      // -h ~ h 범위에 흩어 놓아 일부는 이미 화면 안, 일부는 위쪽 밖에서 대기
      y: rand(i, 9) * h * 1.8 - h,
      vx: 0,
      vy: 0,
      baseVx: (rand(i, 5) - 0.5) * 26,
      fallV: 34 + rand(i, 3) * 42,
      spin: (rand(i, 6) - 0.5) * 26,
      fleeSpin: 0,
      rot: rand(i, 7) * 360,
      size,
      opacity: 0.45 + rand(i, 4) * 0.4,
      shape: SHAPES[Math.floor(rand(i, 8) * SHAPES.length)],
      color: palette[i % palette.length],
    }
  })
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

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  )
}

export function FallingMessages({
  accent,
  visible,
}: {
  accent: ProjectAccent
  visible: boolean
}) {
  const layerRef = useRef<HTMLDivElement | null>(null)
  const iconRefs = useRef<(HTMLDivElement | null)[]>([])
  const particlesRef = useRef<Particle[] | null>(null)
  // 레이어 기준 커서 좌표. active=false면 반발력을 계산하지 않는다
  const pointerRef = useRef({ x: 0, y: 0, active: false })

  // 첫 렌더 전에 배치를 잡아둔다 — 레이어는 거의 전체 화면이라 뷰포트
  // 크기로 근사하고, 실제 크기는 아래 effect에서 다시 맞춘다
  if (particlesRef.current === null && typeof window !== "undefined") {
    particlesRef.current = buildParticles(
      accent,
      window.innerWidth,
      window.innerHeight,
    )
  }

  useEffect(() => {
    if (!visible || prefersReducedMotion()) return
    const layer = layerRef.current
    const particles = particlesRef.current
    if (!layer || !particles) return

    let w = layer.clientWidth || window.innerWidth
    let h = layer.clientHeight || window.innerHeight

    const syncSize = () => {
      w = layer.clientWidth || window.innerWidth
      h = layer.clientHeight || window.innerHeight
    }
    const onPointerMove = (e: PointerEvent) => {
      const rect = layer.getBoundingClientRect()
      pointerRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      }
    }
    const onPointerGone = () => {
      pointerRef.current.active = false
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    window.addEventListener("blur", onPointerGone)
    document.addEventListener("mouseleave", onPointerGone)
    window.addEventListener("resize", syncSize)

    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(MAX_DT, (now - last) / 1000)
      last = now
      const p = pointerRef.current

      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i]

        // 평상시: vx는 기준 드리프트로, vy는 낙하 속도로 수렴
        pt.vx += (pt.baseVx - pt.vx) * Math.min(1, dt * SETTLE)
        pt.vy += (pt.fallV - pt.vy) * Math.min(1, dt * FALL_SETTLE)
        pt.fleeSpin += (0 - pt.fleeSpin) * Math.min(1, dt * SETTLE)

        // 커서 반발 — 아이콘 중심 기준 거리가 가까울수록 제곱으로 세게 민다
        if (p.active) {
          const cx = pt.x + pt.size / 2
          const cy = pt.y + pt.size / 2
          const dx = cx - p.x
          const dy = cy - p.y
          const dist = Math.hypot(dx, dy)
          if (dist < FLEE_RADIUS && dist > 0.01) {
            const f = 1 - dist / FLEE_RADIUS
            const a = FLEE_STRENGTH * f * f * dt
            pt.vx += (dx / dist) * a
            pt.vy += (dy / dist) * a
            pt.fleeSpin += f * 120 * dt
          }
        }

        pt.x += pt.vx * dt
        pt.y += pt.vy * dt
        pt.rot += (pt.spin + pt.fleeSpin) * dt

        // 화면 밖으로 나가면 반대편/상단에서 다시 등장
        if (pt.y > h + pt.size) {
          pt.y = -pt.size - Math.random() * h * 0.3
          pt.x = Math.random() * w
          pt.vx = pt.baseVx
          pt.vy = pt.fallV
        }
        if (pt.x < -pt.size * 2) pt.x = w + pt.size
        else if (pt.x > w + pt.size * 2) pt.x = -pt.size

        const el = iconRefs.current[i]
        if (el) {
          el.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0) rotate(${pt.rot}deg)`
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("blur", onPointerGone)
      document.removeEventListener("mouseleave", onPointerGone)
      window.removeEventListener("resize", syncSize)
    }
    // accent는 첫 배치에만 쓰이고(particlesRef로 1회 고정) 이후 참조하지 않는다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  if (prefersReducedMotion()) return null

  const particles = particlesRef.current

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-700"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {Array.from({ length: ICON_COUNT }, (_, i) => {
        const pt = particles?.[i]
        return (
          <div
            key={i}
            ref={(el) => {
              iconRefs.current[i] = el
            }}
            className="absolute top-0 left-0 drop-shadow-sm"
            style={{
              width: `${pt ? pt.size : 32}px`,
              height: `${pt ? pt.size : 32}px`,
              color: pt?.color ?? "transparent",
              opacity: pt?.opacity ?? 0,
              // rAF 루프가 매 프레임 덮어쓰지만, 첫 프레임 전까지 좌상단에
              // 뭉치지 않도록 초기 위치를 잡아둔다. translate3d로 각 아이콘이
              // 자체 컴포지팅 레이어를 갖는다
              transform: pt
                ? `translate3d(${pt.x}px, ${pt.y}px, 0) rotate(${pt.rot}deg)`
                : undefined,
            }}
          >
            <ShapeIcon shape={pt?.shape ?? "bubble"} />
          </div>
        )
      })}
    </div>
  )
}
