import { useEffect, useState } from "react"
import type { ProjectDetailCardItem } from "@/data/projects"
import type { ProjectAccent } from "@/lib/color"
import { hexToRgba, mixWithWhite } from "@/lib/color"
import { renderWithEmphasis } from "@/lib/emphasis"
import { getArrowColors } from "@/components/project-detail/lightbox/arrowColors"
import { useLightbox } from "@/components/project-detail/lightbox/LightboxProvider"
import { ComparisonItemCard } from "./solution-showcase/ComparisonItemCard"
import { ComparisonLabelPill } from "./solution-showcase/ComparisonLabelPill"
import { FlowArrow } from "./solution-showcase/FlowArrow"
import { SolutionImageStage } from "./solution-showcase/SolutionImageStage"
import { SolutionStepTabs } from "./solution-showcase/SolutionStepTabs"
import { useHorizontalStepKeys } from "@/hooks/useHorizontalStepKeys"

const SLIDE_TRANSITION_MS = 750

interface SolutionShowcaseProps {
  problems: ProjectDetailCardItem[]
  solutions: ProjectDetailCardItem[]
  accent: ProjectAccent | null
  accentColor: string
  projectId: string
  imageWidth: number
  imageHeight: number
  isMobile: boolean
  isActive: boolean
}

// PROBLEM과 1:1로 짝지은 해결 방안을 한 번에 하나씩 보여준다(Fintag·CoChat·
// CoChat for Business·Gopssl 공용). 위에서부터 스텝 탭 → 이미지 영역 →
// 문제/해결 비교 카드 순. 스텝 전환만 조용히 일어나고 세로 슬라이드 트랙은
// 건드리지 않는다.
export function SolutionShowcase({
  problems,
  solutions,
  accent,
  accentColor,
  projectId,
  imageWidth,
  imageHeight,
  isMobile,
  isActive,
}: SolutionShowcaseProps) {
  const [step, setStep] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const { close: closeLightbox, isOpen: lightboxOpen } = useLightbox()

  // 슬라이드를 나갔다 다시 들어와도 보던 스텝을 그대로 유지한다 — step은
  // 여기서 건드리지 않고, 프로젝트 자체가 바뀔 때만(아래 별도 effect) 0으로
  // 되돌린다.
  useEffect(() => {
    if (!isActive) {
      setRevealed(false)
      closeLightbox()
      return
    }
    const timer = setTimeout(() => setRevealed(true), SLIDE_TRANSITION_MS)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive])

  // 프로젝트가 바뀌면 이전 프로젝트에서 남은 step이 새 프로젝트의
  // solutions.length 범위를 벗어날 수 있어 강제로 리셋한다.
  useEffect(() => {
    setStep(0)
  }, [projectId])

  const goStep = (next: number) => {
    const clamped = Math.max(0, Math.min(solutions.length - 1, next))
    if (clamped === step) return
    setStep(clamped)
    closeLightbox()
  }

  // 좌우 화살표 버튼이 떠 있을 때 키보드 ←/→로도 스텝을 넘긴다. 단
  // 이미지 라이트박스가 열려 있으면(캐러셀 ←/→·Esc는 라이트박스가 직접
  // 처리) 비활성화해 충돌을 막는다.
  useHorizontalStepKeys({
    enabled: isActive && !isMobile && solutions.length > 1 && !lightboxOpen,
    onPrev: () => goStep(step - 1),
    onNext: () => goStep(step + 1),
  })

  const solution = solutions[step]
  const comparison = solution.comparison

  // 문제↔해결 카드 사이 화살표 색 — AccentPill(태그) 배경 그라디언트 계열
  const { arrowGradientStops, arrowShadowColor } = getArrowColors(
    accent,
    projectId,
  )

  return (
    <div
      className={
        isMobile
          ? "min-h-screen w-full flex items-center justify-center px-6 pl-16 py-20"
          : "min-h-screen flex items-center justify-center px-8 md:px-16 shrink-0 py-24"
      }
    >
      <div className="max-w-4xl w-full">
        {/* 라벨은 problems와 1:1로 맞으면(Fintag) PROBLEM 쪽 표현을, 아니면
            solution 제목을 쓴다. */}
        <SolutionStepTabs
          labels={solutions.map((s, i) => problems[i]?.title ?? s.title)}
          activeIndex={step}
          onSelect={goStep}
          revealed={revealed}
          accent={accent}
          accentColor={accentColor}
          projectId={projectId}
          isMobile={isMobile}
        />

        <SolutionImageStage
          solution={solution}
          step={step}
          stepCount={solutions.length}
          onStep={goStep}
          revealed={revealed}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          accent={accent}
          accentColor={accentColor}
          projectId={projectId}
          isMobile={isMobile}
        />

        {/* 이미지 영역과 문제/해결 영역을 나누는 divider */}
        <div
          aria-hidden="true"
          className="my-4 h-px"
          style={{ background: "rgba(12,15,26,0.1)" }}
        />

        {/* 문제/해결 본문 — 스텝마다 다시 등장한다. 카드 영역 크기는 스텝과
            무관하게 통일한다(데스크톱 고정 높이). */}
        <div
          key={step}
          style={{
            animation: "step-in 0.5s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          <div
            style={{
              transform: revealed ? "translateY(0)" : "translateY(-10px)",
              opacity: revealed ? 1 : 0,
              transition:
                "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease-out",
            }}
          >
            {comparison ? (
              // AS-IS 항목 하나 ↔ TO-BE 항목 하나를 각각 독립 카드로 떼어
              // 같은 행에 두고 행마다 화살표로 잇는다 — 어려운 용어 없이
              // 상태 변화 자체가 한눈에 읽히게. 데스크톱은 3열(문제 | 화살표
              // | 해결), 모바일은 짝별로 세로로 쌓는다.
              <div className="mx-auto flex max-w-3xl flex-col gap-3">
                {!isMobile && (
                  <div className="flex items-center gap-3">
                    <div className="flex flex-1 justify-center">
                      <ComparisonLabelPill
                        label="문제"
                        accent={accent}
                        accentColor={accentColor}
                        projectId={projectId}
                      />
                    </div>
                    <div className="w-10 shrink-0" aria-hidden="true" />
                    <div className="flex flex-1 justify-center">
                      <ComparisonLabelPill
                        label="해결"
                        accent={accent}
                        accentColor={accentColor}
                        projectId={projectId}
                      />
                    </div>
                  </div>
                )}
                {comparison.before.map((beforeEntry, i) => (
                  <div
                    key={i}
                    className={
                      (isMobile ? "flex flex-col" : "flex items-stretch") +
                      " gap-3"
                    }
                  >
                    {isMobile && (
                      <div className="flex justify-center">
                        <ComparisonLabelPill
                          label="문제"
                          accent={accent}
                          accentColor={accentColor}
                          projectId={projectId}
                        />
                      </div>
                    )}
                    <ComparisonItemCard
                      entry={beforeEntry}
                      accentColor={accentColor}
                    />
                    <div
                      className="flex shrink-0 items-center justify-center self-center"
                      style={{
                        color: accentColor,
                        width: isMobile ? undefined : "2.5rem",
                      }}
                    >
                      <FlowArrow
                        gradientId={`solution-arrow-gradient-comparison-${i}`}
                        gradientStops={arrowGradientStops}
                        shadowColor={arrowShadowColor}
                        rotate={isMobile}
                      />
                    </div>
                    {isMobile && (
                      <div className="flex justify-center">
                        <ComparisonLabelPill
                          label="해결"
                          accent={accent}
                          accentColor={accentColor}
                          projectId={projectId}
                        />
                      </div>
                    )}
                    <ComparisonItemCard
                      entry={comparison.after[i]}
                      accentColor={accentColor}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="rounded-2xl p-5 backdrop-blur-sm"
                style={{
                  background: hexToRgba(mixWithWhite(accentColor, 0.93), 0.62),
                  border: "1px solid rgba(12,15,26,0.06)",
                  minHeight: isMobile ? undefined : "232px",
                }}
              >
                {solution.shortBody ? (
                  <ul className="flex flex-col gap-2">
                    {solution.shortBody.map((line, i) => (
                      <li
                        key={i}
                        style={{ fontFamily: "var(--font-body)" }}
                        className="text-sm text-[#0C0F1A]/70 leading-relaxed font-normal flex items-start gap-2"
                      >
                        <span
                          aria-hidden="true"
                          className="w-1 h-1 rounded-full shrink-0 mt-2"
                          style={{ background: accentColor }}
                        />
                        <span>{renderWithEmphasis(line)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    style={{ fontFamily: "var(--font-body)" }}
                    className="text-sm text-[#0C0F1A]/70 leading-relaxed font-normal"
                  >
                    {solution.body}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
