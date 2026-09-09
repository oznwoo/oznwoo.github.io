import { useEffect, useState } from "react"
import type { ProjectContribution } from "@/data/projects"

interface ContributionChartProps {
  items: ProjectContribution[]
  accentColor: string
  // 슬라이드 등장 연출이 끝났는지 — 이때부터 막대가 아래에서 위로 자란다.
  revealed: boolean
  isMobile: boolean
}

const BAR_EASE = "cubic-bezier(0.16,1,0.3,1)"
// 100% 막대의 높이(px). "담당 업무" 스텝 전체 높이를 다른 About 탭과 맞추기
// 위해(위 이미지 위치가 밀리지 않도록) 낮게 잡는다.
const TRACK_H = 52
// 막대가 이 높이보다 짧으면 안쪽에 퍼센트를 넣지 못하므로 최소 높이를 준다
const BAR_MIN_H = 15

// "담당 업무" 스텝에서 roleBody 옆(모바일은 아래)에 놓는 좁은 세로 막대 차트.
// 각 막대는 "프로젝트 전체에서 그 영역에 기여한 정도"라 서로 독립적이고 합이
// 100이 아니다. 퍼센트는 막대 안쪽 상단에 흰 글자로 넣는다. 자라는 연출은
// height가 아니라 transform: scaleY로 돌려 컴포지터 친화적으로 유지한다.
export function ContributionChart({
  items,
  accentColor,
  revealed,
  isMobile,
}: ContributionChartProps) {
  // revealed가 켜진 다음 프레임에 채워야 scaleY 트랜지션이 실제로 돈다
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
    <div className={isMobile ? "w-full max-w-[13rem]" : "w-[10.5rem] shrink-0"}>
      <p
        style={{ fontFamily: "var(--font-mono)" }}
        className="mb-1.5 text-center text-[0.55rem] uppercase tracking-[0.08em] text-[#0C0F1A]/35"
      >
        프로젝트 기여도
      </p>
      <div className="flex items-end justify-between gap-1">
        {items.map((item, i) => {
          const barPx = Math.round((item.percent / 100) * TRACK_H)
          return (
            <div
              key={item.label}
              className="flex flex-1 flex-col items-center"
            >
              {item.percent > 0 ? (
                <div
                  className="relative w-[68%] overflow-hidden rounded-md"
                  style={{ height: Math.max(barPx, BAR_MIN_H) }}
                >
                  <div
                    className="absolute inset-0 origin-bottom"
                    style={{
                      backgroundColor: accentColor,
                      transform: `scaleY(${filled ? 1 : 0})`,
                      transition: `transform 0.7s ${BAR_EASE}`,
                      transitionDelay: `${i * 80}ms`,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      opacity: filled ? 1 : 0,
                      transition: `opacity 0.35s ease ${i * 80 + 220}ms`,
                    }}
                    className="absolute inset-x-0 top-0 pt-[2px] text-center text-[0.5rem] font-semibold leading-none text-white tabular-nums"
                  >
                    {item.percent}%
                  </span>
                </div>
              ) : (
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-[0.5rem] font-medium leading-none text-[#0C0F1A]/40 tabular-nums"
                  // 0%는 막대 없이 라벨만, 다른 막대 상단 근처에 맞춰 놓는다
                >
                  0%
                </span>
              )}
              <span
                style={{ wordBreak: "keep-all" }}
                className="mt-1 text-center text-[0.52rem] leading-[1.1] text-[#0C0F1A]/55"
              >
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
