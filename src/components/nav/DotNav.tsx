import { useState } from "react"
import logoImg from "@/imports/______________.png"
import { SECTIONS } from "@/data/navigation"
import type { ProjectAccent } from "@/lib/color"
import { accentGradient } from "@/lib/color"

export function DotNav({
  current,
  total,
  onChange,
  accentSlots,
  activeSlot,
  accentOn,
  // 현재 페이지 dot의 색. 두 슬롯을 크로스페이드시켜, 호버 대상이 바로 다른
  // 프로젝트로 바뀌어도 dot 색이 스냅되지 않고 배경과 같은 방식으로 섞이며
  // 전환된다. 프로젝트가 다색 브랜드면 그라디언트로 그 다색이 그대로 보인다.
}: {
  current: number
  total: number
  onChange: (i: number) => void
  accentSlots: [ProjectAccent, ProjectAccent]
  activeSlot: 0 | 1
  accentOn: boolean
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <nav
      aria-label="페이지 이동"
      className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-start"
      style={{ gap: "10px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 로고 — Home 페이지 dot 역할 */}
      <button
        onClick={() => onChange(0)}
        className="flex items-center gap-2.5 shrink-0"
        aria-label="Home"
        style={{ height: "20px" }}
      >
        <span
          className="flex items-center shrink-0"
          style={{ width: "24px", height: "20px" }}
        >
          {/* 로고 아이콘은 dot보다 훨씬 넓어서 좌측 정렬만으로는 시각적 중심이 dot들보다 오른쪽으로 치우쳐 보임 —
              dot의 시각적 중심(비활성 3px / 활성 10px)에 맞춰 음수 마진으로 보정 */}
          <img
            src={logoImg}
            alt="홈"
            style={{
              width: current === 0 ? "24px" : "16px",
              height: current === 0 ? "24px" : "16px",
              marginLeft: current === 0 ? "-2px" : "-5px",
              objectFit: "contain",
              opacity: current === 0 ? 0.75 : 0.22,
              transition:
                "opacity 0.3s, width 0.3s, height 0.3s, margin-left 0.3s",
              flexShrink: 0,
            }}
          />
        </span>
        <span
          className="hidden md:inline-block"
          style={{
            fontFamily: "var(--font-mono)",
            opacity: current === 0 ? 0.65 : hovered ? 0.3 : 0,
            color: "#0C0F1A",
            fontSize: "0.65rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase" as const,
            transition: "opacity 0.25s",
            fontWeight: current === 0 ? 500 : 400,
            whiteSpace: "nowrap",
          }}
        >
          {SECTIONS[0]}
        </span>
      </button>

      {/* 나머지 섹션 dot */}
      {Array.from({ length: total - 1 }).map((_, idx) => {
        const i = idx + 1
        return (
          <button
            key={i}
            onClick={() => onChange(i)}
            aria-label={SECTIONS[i]}
            className="flex items-center gap-2.5 shrink-0"
            style={{ height: "20px" }}
          >
            <span
              className="flex items-center shrink-0"
              style={{ width: "24px", height: "20px" }}
            >
              <span
                className="relative block rounded-full overflow-hidden transition-all duration-300"
                style={{
                  width: i === current ? "20px" : "6px",
                  height: "6px",
                  background: i === current ? "#4F6EF7" : "rgba(12,15,26,0.32)",
                }}
              >
                {i === current && (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background: accentGradient(accentSlots[0]),
                        opacity: accentOn && activeSlot === 0 ? 1 : 0,
                        transition:
                          accentOn && activeSlot === 0
                            ? "opacity 0.45s ease-out"
                            : "opacity 0.6s ease-in",
                      }}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background: accentGradient(accentSlots[1]),
                        opacity: accentOn && activeSlot === 1 ? 1 : 0,
                        transition:
                          accentOn && activeSlot === 1
                            ? "opacity 0.45s ease-out"
                            : "opacity 0.6s ease-in",
                      }}
                    />
                  </>
                )}
              </span>
            </span>
            <span
              className="hidden md:inline-block"
              style={{
                fontFamily: "var(--font-mono)",
                opacity: i === current ? 0.65 : hovered ? 0.3 : 0,
                color: "#0C0F1A",
                fontSize: "0.65rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase" as const,
                transition: "opacity 0.25s",
                fontWeight: i === current ? 500 : 400,
                whiteSpace: "nowrap",
              }}
            >
              {SECTIONS[i]}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
