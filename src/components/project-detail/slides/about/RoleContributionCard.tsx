import { useEffect, useState } from "react"
import type { ProjectContribution } from "@/data/projects"
import { hexToRgba } from "@/lib/color"
import { renderWithEmphasis } from "@/lib/emphasis"

interface RoleContributionCardProps {
  headline: string
  body: string
  items: ProjectContribution[]
  accentColor: string
  // 슬라이드 등장 연출이 끝났는지 — 이때부터 막대가 아래에서 위로 자란다.
  revealed: boolean
  isMobile: boolean
}

const BAR_EASE = "cubic-bezier(0.16,1,0.3,1)"
// 100% 막대의 높이(px) — 이 값 기준으로 각 막대 높이를 비례 계산한다.
// 카드 전체 높이를 다른 About 탭(프로젝트 소개·기술 스택)의 본문 영역과
// 비슷하게 유지하려고 낮게 잡는다.
const TRACK_H = 48

// "담당 업무" 스텝 전용 카드 — roleHeadline·roleBody 설명과 영역별 기여도
// 차트를 한 카드 안에 좌우로(모바일은 위아래) 담는다. 다른 탭의 본문 영역과
// 세로 높이를 맞추기 위해 최대한 납작하게 구성한다. 각 막대는 "팀 전체 대비
// 그 영역에 기여한 비중"이라 서로 독립적이고 합이 100이 아니다. 가장 높은
// 영역만 accent 색으로 강조한다. 자라는 연출은 transform: scaleY로 돌려
// 컴포지터 친화적으로 유지한다.
export function RoleContributionCard({
  headline,
  body,
  items,
  accentColor,
  revealed,
  isMobile,
}: RoleContributionCardProps) {
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
        "w-full rounded-2xl border px-5 py-4 text-left backdrop-blur-sm " +
        (isMobile
          ? "flex flex-col gap-4"
          : "flex flex-row items-center gap-7")
      }
      style={{
        borderColor: hexToRgba(accentColor, 0.18),
        backgroundColor: "rgba(255,255,255,0.6)",
        boxShadow: "0 16px 36px -20px rgba(12,15,26,0.2)",
      }}
    >
      <div className="flex-1">
        <p
          style={{ fontFamily: "var(--font-body)", lineHeight: 1.3 }}
          className="text-sm font-semibold text-[#0C0F1A] sm:text-[0.95rem]"
        >
          {headline}
        </p>
        {body && (
          <p
            style={{ fontFamily: "var(--font-body)" }}
            className="mt-1.5 text-xs leading-relaxed text-[#0C0F1A]/55 sm:text-[0.8rem]"
          >
            {renderWithEmphasis(body)}
          </p>
        )}
      </div>

      <div className={isMobile ? "w-full" : "w-[13.5rem] shrink-0"}>
        <p
          style={{ fontFamily: "var(--font-mono)" }}
          className="mb-1.5 text-[0.55rem] uppercase tracking-[0.08em] text-[#0C0F1A]/35"
        >
          팀 대비 기여도
        </p>
        <div className="flex items-end justify-between gap-1.5">
          {items.map((item, i) => {
            const isPeak = item.percent === peak && item.percent > 0
            const barPx = Math.round((item.percent / 100) * TRACK_H)
            return (
              <div
                key={item.label}
                className="flex flex-1 flex-col items-center gap-0.5"
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: isPeak ? accentColor : "rgba(12,15,26,0.45)",
                  }}
                  className="text-[0.6rem] font-medium tabular-nums"
                >
                  {item.percent}%
                </span>
                {item.percent > 0 && (
                  <div
                    className="w-[36%] origin-bottom rounded-full"
                    style={{
                      height: Math.max(barPx, 4),
                      backgroundColor: isPeak
                        ? accentColor
                        : hexToRgba(accentColor, 0.32),
                      transform: `scaleY(${filled ? 1 : 0})`,
                      transition: `transform 0.7s ${BAR_EASE}`,
                      transitionDelay: `${i * 80}ms`,
                    }}
                  />
                )}
                <span
                  style={{ wordBreak: "keep-all" }}
                  className="mt-1 text-center text-[0.58rem] leading-[1.15] text-[#0C0F1A]/55"
                >
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
