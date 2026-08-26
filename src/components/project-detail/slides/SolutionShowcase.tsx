import { useEffect, useRef, useState } from "react"
import { TabArrowButton } from "@/components/project-detail/TabArrowButton"
import { DEFAULT_ACCENT } from "@/data/projects"
import type { ProjectDetailCardItem } from "@/data/projects"
import type { ProjectAccent } from "@/lib/color"
import { hexToRgba, mixWithWhite } from "@/lib/color"
import { renderWithEmphasis } from "@/lib/emphasis"
import { ComparisonGroupCard } from "./solution-showcase/ComparisonGroupCard"
import { FlowArrow } from "./solution-showcase/FlowArrow"
import { ImageLightbox } from "./solution-showcase/ImageLightbox"
import { useImageLightbox } from "./solution-showcase/useImageLightbox"
import { ZoomButton } from "./solution-showcase/ZoomButton"

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

// Fintag SOLUTION 전용 — 3개의 해결 방안을 PROBLEM과 1:1로 짝지어 한 번에
// 하나씩 보여준다. 탭(또는 이미지 옆 화살표)으로 스텝만 조용히 전환하고,
// 세로 슬라이드 트랙이나 배경 blob 웜프는 건드리지 않는다.
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
  const [imgHovered, setImgHovered] = useState(false)
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(
    null,
  )
  const [revealed, setRevealed] = useState(false)
  // 작게 보이는 이미지 영역 — 라이트박스가 "여기서부터" 커지기 시작할 기준점
  const imageRowRef = useRef<HTMLDivElement>(null)
  const {
    lightboxPhase,
    zoomContentRef,
    openZoom,
    closeZoom,
    resetZoomImmediately,
  } = useImageLightbox(imageRowRef)

  // 슬라이드를 나갔다 다시 들어와도 보던 스텝을 그대로 유지한다 — step은
  // 여기서 건드리지 않고, 프로젝트 자체가 바뀔 때만(아래 별도 effect) 0으로
  // 되돌린다.
  useEffect(() => {
    if (!isActive) {
      setRevealed(false)
      setHoveredImageIndex(null)
      resetZoomImmediately()
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
    setHoveredImageIndex(null)
    resetZoomImmediately()
  }

  const solution = solutions[step]
  // 이미지를 hover하고 있다는 것만 따로 뽑아둔다 — "크게 보기" 버튼과
  // 이전/다음 화살표 모두 자기 자신을 hover할 때뿐 아니라 이미지를
  // hover할 때도 같이 강조되어야 하기 때문
  const isImageHovered = imgHovered || hoveredImageIndex !== null

  // 화살표 색을 AccentPill(태그) 배경 그라디언트와 같은 색 계열로 맞추되,
  // pill보다 흰색 혼합을 덜 써서 조금 더 진하게 보이게 한다
  const pillAccent = accent ?? DEFAULT_ACCENT
  const pillWhiteMix = projectId === "02" ? 0.2 : 0.5
  const arrowWhiteMix = Math.max(pillWhiteMix - 0.15, 0)
  const arrowGradientStops = pillAccent.blobs.map((c) =>
    mixWithWhite(c, arrowWhiteMix),
  )
  const arrowShadowColor = hexToRgba(pillAccent.primary, 0.4)

  return (
    <>
      <div
        className={
          isMobile
            ? "min-h-screen w-full flex items-center justify-center px-6 pl-16 py-20"
            : "min-h-screen flex items-center justify-center px-8 md:px-16 shrink-0 py-24"
        }
      >
        <div className="max-w-4xl w-full">
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase mb-6 block"
          >
            Solution
          </span>
          <div
            className="flex flex-wrap items-center justify-between gap-6 mb-4"
            style={{ borderBottom: "1px solid rgba(12,15,26,0.08)" }}
          >
            <div className="flex flex-wrap items-center gap-6">
              {problems.map((p, i) => (
                <button
                  key={p.title}
                  onClick={() => goStep(i)}
                  style={{
                    fontFamily: "var(--font-body)",
                    color: i === step ? "#0C0F1A" : "rgba(12,15,26,0.4)",
                    borderBottomColor: i === step ? accentColor : "transparent",
                  }}
                  className="text-sm font-medium pb-3 border-b-2 transition-colors duration-300"
                >
                  {p.title}
                </button>
              ))}
            </div>
            {(solution.image || solution.images) && (
              <ZoomButton
                onClick={openZoom}
                revealed={revealed}
                extraHintActive={isImageHovered}
                accent={accent}
                accentColor={accentColor}
                projectId={projectId}
              />
            )}
          </div>

          <div
            key={step}
            style={{
              animation: "step-in 0.5s cubic-bezier(0.16,1,0.3,1) both",
              // 탭 아래 콘텐츠 영역 크기를 스텝마다 고정해, 이미지 비율이나
              // 설명 길이가 달라져도 탭 위치가 위아래로 밀리지 않게 한다
              minHeight: isMobile ? undefined : "520px",
            }}
            className="flex flex-col gap-6"
          >
            {(solution.image || solution.images) && (
              <div
                ref={imageRowRef}
                className="relative flex items-center justify-center"
                // 스텝 종류(단일 이미지/멀티 이미지/비교 카드)와 무관하게 항상
                // 같은 높이를 써야 탭을 전환해도 아래 콘텐츠·페이지 위치가
                // 흔들리지 않는다 — 스텝별로 값을 다르게 주면 안 된다
                style={{ height: isMobile ? undefined : "300px" }}
              >
                {!isMobile && step > 0 && (
                  <TabArrowButton
                    direction="prev"
                    label="이전 해결 방안"
                    onClick={() => goStep(step - 1)}
                    revealed={revealed}
                    extraHintActive={isImageHovered}
                    accent={accent}
                    accentColor={accentColor}
                    projectId={projectId}
                    offsetClassName="-left-14"
                  />
                )}
                {solution.images ? (
                  // 스텝별 스크린샷을 합성 이미지 한 장 대신 낱장으로 받아,
                  // 사이 화살표는 이미지에 미리 그려 넣지 않고 FlowArrow로
                  // 직접 그린다 — 다른 화살표들과 색·모양이 항상 일치한다
                  <div
                    className={
                      isMobile
                        ? "flex flex-col items-center gap-3"
                        : "flex items-center justify-center gap-3"
                    }
                  >
                    {solution.images.map((img, i) => (
                      <div
                        key={i}
                        className={
                          isMobile
                            ? "flex flex-col items-center gap-3"
                            : "flex items-center gap-3"
                        }
                      >
                        {i > 0 && solution.imagesShowArrows !== false && (
                          <FlowArrow
                            gradientId={`solution-arrow-gradient-img-${i}`}
                            gradientStops={arrowGradientStops}
                            shadowColor={arrowShadowColor}
                            size={26}
                            rotate={isMobile}
                          />
                        )}
                        <div
                          onMouseEnter={() => setHoveredImageIndex(i)}
                          onMouseLeave={() => setHoveredImageIndex(null)}
                          className="rounded-2xl overflow-hidden border shrink-0 cursor-default"
                          style={{
                            borderColor:
                              hoveredImageIndex === i
                                ? hexToRgba(accentColor, 0.35)
                                : "rgba(12,15,26,0.1)",
                            boxShadow:
                              hoveredImageIndex === i
                                ? `0 20px 45px -14px ${hexToRgba(accentColor, 0.35)}, 0 8px 18px -8px rgba(12,15,26,0.28)`
                                : "0 14px 34px -18px rgba(12,15,26,0.24), 0 4px 10px -6px rgba(12,15,26,0.12)",
                            transform:
                              hoveredImageIndex === i
                                ? "translateY(-3px) scale(1.012)"
                                : "translateY(0) scale(1)",
                            transition:
                              "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease-out, border-color 0.4s ease-out",
                          }}
                        >
                          <img
                            src={img}
                            alt=""
                            aria-hidden="true"
                            loading="eager"
                            className="block w-auto"
                            style={{
                              height: isMobile
                                ? "28vh"
                                : // 가로로 넓은 다이어그램 2장을 260px 높이로 나란히
                                  // 두면 폭 합이 컨테이너를 넘어간다 — 이미지가
                                  // 3장 미만일 때는 낮춘 높이로 폭을 맞춘다
                                  solution.images!.length >= 3
                                  ? "260px"
                                  : "220px",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    onMouseEnter={() => setImgHovered(true)}
                    onMouseLeave={() => setImgHovered(false)}
                    className="inline-block max-w-full rounded-2xl overflow-hidden border cursor-default"
                    style={{
                      borderColor: imgHovered
                        ? hexToRgba(accentColor, 0.35)
                        : "rgba(12,15,26,0.1)",
                      boxShadow: imgHovered
                        ? `0 20px 45px -14px ${hexToRgba(accentColor, 0.35)}, 0 8px 18px -8px rgba(12,15,26,0.28)`
                        : "0 14px 34px -18px rgba(12,15,26,0.24), 0 4px 10px -6px rgba(12,15,26,0.12)",
                      transform: imgHovered
                        ? "translateY(-3px) scale(1.008)"
                        : "translateY(0) scale(1)",
                      transition:
                        "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease-out, border-color 0.4s ease-out",
                    }}
                  >
                    <img
                      src={solution.image}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      width={imageWidth}
                      height={imageHeight}
                      className="block w-auto h-auto max-w-full"
                      style={{ maxHeight: isMobile ? "38vh" : "260px" }}
                    />
                  </div>
                )}
                {!isMobile && step < solutions.length - 1 && (
                  <TabArrowButton
                    direction="next"
                    label="다음 해결 방안"
                    onClick={() => goStep(step + 1)}
                    revealed={revealed}
                    extraHintActive={isImageHovered}
                    accent={accent}
                    accentColor={accentColor}
                    projectId={projectId}
                    offsetClassName="-right-14"
                  />
                )}
              </div>
            )}
            <div
              style={{
                transform: revealed ? "translateY(0)" : "translateY(-10px)",
                opacity: revealed ? 1 : 0,
                transition:
                  "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease-out",
              }}
            >
              {solution.comparison ? (
                // 기존 상태를 개선한 항목(전처리 파이프라인)은 점 불릿 목록
                // 대신 AS-IS 항목 전체를 한 카드로, TO-BE 항목 전체를 한
                // 카드로 묶고(카드 내부는 구분선으로만 나눔) 화살표로 잇는
                // 비교 구조로 보여준다 — 어려운 용어 없이 상태 변화 자체가
                // 한눈에 읽히게
                <div
                  className={
                    (isMobile ? "flex flex-col" : "flex items-stretch") +
                    " gap-3"
                  }
                >
                  <ComparisonGroupCard
                    label="문제"
                    items={solution.comparison.before}
                    accentColor={accentColor}
                  />
                  <div className="flex flex-col items-center shrink-0">
                    {/* 카드 위 "문제"/"해결" 라벨만큼 화살표를 아래로 밀어서,
                        화살표가 라벨을 포함한 전체 높이가 아니라 카드 자체의
                        세로 중앙에 오게 맞춘다 */}
                    {!isMobile && <div aria-hidden="true" className="h-6" />}
                    <div
                      aria-hidden="true"
                      className="flex-1 flex items-center justify-center"
                      style={{ color: accentColor }}
                    >
                      <FlowArrow
                        gradientId="solution-arrow-gradient-comparison"
                        gradientStops={arrowGradientStops}
                        shadowColor={arrowShadowColor}
                        rotate={isMobile}
                      />
                    </div>
                  </div>
                  <ComparisonGroupCard
                    label="해결"
                    items={solution.comparison.after}
                    accentColor={accentColor}
                  />
                </div>
              ) : (
                <div
                  className="rounded-2xl p-5 backdrop-blur-sm"
                  style={{
                    background: hexToRgba(
                      mixWithWhite(accentColor, 0.93),
                      0.62,
                    ),
                    border: "1px solid rgba(12,15,26,0.06)",
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
      <ImageLightbox
        solution={solution}
        isMobile={isMobile}
        lightboxPhase={lightboxPhase}
        zoomContentRef={zoomContentRef}
        closeZoom={closeZoom}
        resetZoomImmediately={resetZoomImmediately}
        arrowGradientStops={arrowGradientStops}
        arrowShadowColor={arrowShadowColor}
      />
    </>
  )
}
