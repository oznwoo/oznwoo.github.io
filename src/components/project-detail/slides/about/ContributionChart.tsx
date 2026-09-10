import { Fragment, useEffect, useState } from "react"
import type { ProjectContribution } from "@/data/projects"

interface ContributionChartProps {
  items: ProjectContribution[]
  accentColor: string
  // 슬라이드 등장 연출이 끝났는지 — 이때부터 막대가 왼쪽에서 오른쪽으로 찬다
  revealed: boolean
}

const BAR_EASE = "cubic-bezier(0.16,1,0.3,1)"

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

// "담당 업무" 스텝에서 본문 오른쪽(모바일은 아래)에 놓는 가로 막대 차트.
// 부모가 폭을 잡아주므로 여기선 w-full로 그 폭을 채운다. 각 값은 "프로젝트
// 전체에서 그 영역에 기여한 정도"라 서로 독립적이고 합이 100이 아니다.
// 퍼센트는 막대 바깥 오른쪽에 둬서 20%·30%처럼 짧은 값도 높이 꼼수 없이
// 구분된다. 채우는 연출은 width가 아니라 transform: scaleX로 돌려 레이아웃을
// 건드리지 않는다.
export function ContributionChart({
  items,
  accentColor,
  revealed,
}: ContributionChartProps) {
  const [filled, setFilled] = useState(prefersReducedMotion())

  useEffect(() => {
    if (prefersReducedMotion()) {
      setFilled(true)
      return
    }
    if (!revealed) {
      setFilled(false)
      return
    }
    // revealed가 켜진 다음 프레임에 채워야 scaleX 트랜지션이 실제로 돈다
    const id = requestAnimationFrame(() => setFilled(true))
    return () => cancelAnimationFrame(id)
  }, [revealed])

  return (
    <div className="w-full">
      {/* 열 제목 — 왼쪽 열의 headline(compact)과 같은 스타일로 맞춘다 */}
      <p
        style={{ fontFamily: "var(--font-body)", lineHeight: 1.35 }}
        className="mb-2 text-center text-base font-semibold text-[#0C0F1A] sm:text-lg"
      >
        프로젝트 기여도
      </p>

      {/* 한 그리드를 모든 행이 공유해야 라벨 길이와 무관하게 트랙 시작 x가
          일렬로 맞는다 — 행마다 grid를 두면 열 폭이 제각각이 된다.
          좌측 텍스트 열과 높이를 맞추려 행 간격(gap-y)은 최소로 둔다 */}
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1">
        {items.map((item, i) => {
          const zero = item.percent <= 0
          return (
            <Fragment key={item.label}>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  wordBreak: "keep-all",
                }}
                className="whitespace-nowrap text-right text-xs text-[#0C0F1A]/55 sm:text-[0.8rem]"
              >
                {item.label}
              </span>
              <span className="relative block h-1.5 overflow-hidden rounded-full bg-[#0C0F1A]/[0.06] sm:h-2">
                {!zero && (
                  <span
                    className="absolute inset-y-0 left-0 block origin-left rounded-full"
                    style={{
                      width: `${item.percent}%`,
                      backgroundColor: accentColor,
                      transform: `scaleX(${filled ? 1 : 0})`,
                      transition: `transform 0.7s ${BAR_EASE}`,
                      transitionDelay: `${i * 70}ms`,
                    }}
                  />
                )}
              </span>
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className={
                  "w-10 text-right text-xs font-semibold tabular-nums sm:text-[0.8rem] " +
                  (zero ? "text-[#0C0F1A]/30" : "text-[#0C0F1A]/75")
                }
              >
                {item.percent}%
              </span>
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
