import { useEffect, useState } from "react"
import type { ProjectContribution } from "@/data/projects"
import { hexToRgba } from "@/lib/color"

interface ContributionBarsProps {
  items: ProjectContribution[]
  accentColor: string
  // 슬라이드 등장 연출이 끝났는지 — 이때부터 막대가 아래에서 위로 자란다.
  revealed: boolean
  isMobile: boolean
}

const BAR_EASE = "cubic-bezier(0.16,1,0.3,1)"
// 막대 트랙(세로) 높이(px) — 카드 전체 높이를 왼쪽 설명 텍스트와 얼추 맞추려고
// 낮게 잡는다.
const TRACK_H = 72

// "담당 업무" 스텝에서 roleBody 옆(모바일은 아래)에 붙는 영역별 기여도 카드.
// 세로 막대 차트 — 각 막대는 "팀 전체 대비 그 영역에 기여한 비중"이라 서로
// 독립적이고 합이 100이 아니다. 가장 높은 영역만 accent 색으로 강조하고
// 나머지는 옅게 둔다. 자라는 연출은 height가 아니라 transform: scaleY로 돌려
// 컴포지터 친화적으로 유지한다.
export function ContributionBars({
  items,
  accentColor,
  revealed,
  isMobile,
}: ContributionBarsProps) {
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

  const peak = Math.max(...items.map((item) => item.percent))

  return (
    <div
      className={
        (isMobile ? "w-full max-w-xs" : "w-[16.5rem] shrink-0") +
        " rounded-2xl border px-5 pb-4 pt-3.5 backdrop-blur-sm"
      }
      style={{
        borderColor: hexToRgba(accentColor, 0.18),
        backgroundColor: "rgba(255,255,255,0.62)",
        boxShadow: "0 14px 34px -18px rgba(12,15,26,0.22)",
      }}
    >
      <p
        style={{ fontFamily: "var(--font-mono)" }}
        className="mb-3 text-[0.62rem] uppercase tracking-[0.08em] text-[#0C0F1A]/35"
      >
        팀 대비 기여도
      </p>
      <div className="flex items-end justify-between gap-2">
        {items.map((item, i) => {
          const isPeak = item.percent === peak && item.percent > 0
          return (
            <div
              key={item.label}
              className="flex flex-1 flex-col items-center gap-1.5"
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  color: isPeak ? accentColor : "rgba(12,15,26,0.4)",
                }}
                className="text-[0.68rem] font-medium tabular-nums"
              >
                {item.percent}%
              </span>
              <div
                className="flex w-full items-end justify-center"
                style={{ height: TRACK_H }}
              >
                <div
                  className="w-[62%] origin-bottom rounded-full"
                  style={{
                    // 0%는 막대를 아예 그리지 않고, 그 외엔 아주 작은 값도
                    // 보이도록 최소 높이를 준다
                    height: item.percent === 0 ? "0%" : `${Math.max(item.percent, 3)}%`,
                    backgroundColor: isPeak
                      ? accentColor
                      : hexToRgba(accentColor, 0.16),
                    transform: `scaleY(${filled ? 1 : 0})`,
                    transition: `transform 0.7s ${BAR_EASE}`,
                    transitionDelay: `${i * 80}ms`,
                  }}
                />
              </div>
              <span
                style={{ wordBreak: "keep-all" }}
                className="text-center text-[0.62rem] leading-[1.15] text-[#0C0F1A]/55"
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
