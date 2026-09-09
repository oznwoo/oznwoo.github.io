import { useEffect, useState } from "react"
import type { ProjectContribution } from "@/data/projects"
import { hexToRgba } from "@/lib/color"

interface ContributionBarsProps {
  items: ProjectContribution[]
  accentColor: string
  // 슬라이드 등장 연출이 끝났는지 — 이때부터 막대가 0에서 목표치까지 찬다.
  revealed: boolean
  isMobile: boolean
}

const BAR_EASE = "cubic-bezier(0.16,1,0.3,1)"

// "담당 업무" 스텝에서 roleBody 옆(모바일은 아래)에 붙는 영역별 기여도 막대.
// 각 막대는 "팀 전체 대비 그 영역에 기여한 비중"이라 서로 독립적이고 합이
// 100이 아니다. 채우는 연출은 width가 아니라 transform: scaleX로 돌려
// 컴포지터 친화적으로 유지한다.
export function ContributionBars({
  items,
  accentColor,
  revealed,
  isMobile,
}: ContributionBarsProps) {
  // revealed가 켜진 다음 프레임에 채워야 scaleX 트랜지션이 실제로 돈다
  const [filled, setFilled] = useState(false)
  useEffect(() => {
    if (!revealed) {
      setFilled(false)
      return
    }
    const id = requestAnimationFrame(() => setFilled(true))
    return () => cancelAnimationFrame(id)
  }, [revealed])

  return (
    <div className={isMobile ? "w-full" : "w-[13.5rem] shrink-0"}>
      <p
        style={{ fontFamily: "var(--font-mono)" }}
        className="mb-3 text-[0.65rem] uppercase tracking-[0.08em] text-[#0C0F1A]/35"
      >
        팀 대비 기여도
      </p>
      <ul className="flex flex-col gap-2.5">
        {items.map((item, i) => (
          <li key={item.label} className="flex flex-col gap-1">
            <div
              style={{ fontFamily: "var(--font-mono)" }}
              className="flex items-baseline justify-between text-[0.7rem] text-[#0C0F1A]/60"
            >
              <span>{item.label}</span>
              <span className="tabular-nums text-[#0C0F1A]/45">
                {item.percent}%
              </span>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full"
              style={{ backgroundColor: hexToRgba(accentColor, 0.12) }}
            >
              <div
                className="h-full origin-left rounded-full"
                style={{
                  backgroundColor: accentColor,
                  transform: `scaleX(${filled ? item.percent / 100 : 0})`,
                  transition: `transform 0.75s ${BAR_EASE}`,
                  transitionDelay: `${i * 90}ms`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
