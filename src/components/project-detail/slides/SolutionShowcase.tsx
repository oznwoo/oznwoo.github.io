import { useEffect, useState } from "react"
import { DEFAULT_ACCENT } from "@/data/projects"
import type { ProjectDetailCardItem } from "@/data/projects"
import type { ProjectAccent } from "@/lib/color"
import { hexToRgba, mixWithWhite } from "@/lib/color"

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

function renderWithEmphasis(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-[#0C0F1A]">
        {part}
      </strong>
    ) : (
      part
    ),
  )
}

interface FlowArrowProps {
  gradientId: string
  gradientStops: string[]
  shadowColor: string
  size?: number
  rotate?: boolean
}

// AS-IS/TO-BE 비교 화살표와 이미지 스텝 사이 화살표가 공유하는 뭉툭하고
// 둥근 블록 화살표 — 도형 정의는 SolutionShowcase의 comparison 렌더링 부분
// 주석 참고(짧은 이음매 변에서 라운딩 반지름이 교차하지 않게 계산됨).
function FlowArrow({ gradientId, gradientStops, shadowColor, size = 38, rotate }: FlowArrowProps) {
  return (
    <svg
      width={size}
      height={Math.round((size * 24) / 40)}
      viewBox="0 0 40 24"
      style={{
        transform: rotate ? "rotate(90deg)" : undefined,
        filter: `drop-shadow(0 6px 12px ${shadowColor})`,
      }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={gradientStops[0]} />
          <stop offset="50%" stopColor={gradientStops[1]} />
          <stop offset="100%" stopColor={gradientStops[2]} />
        </linearGradient>
      </defs>
      <path
        d="M4.2,7 L19.8,7 Q22,7 22,4.8 L22,4.2 Q22,2 23.9,3.2 L36.1,10.8 Q38,12 36.1,13.2 L23.9,20.8 Q22,22 22,19.8 L22,19.2 Q22,17 19.8,17 L4.2,17 Q2,17 2,14.8 L2,9.2 Q2,7 4.2,7 Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  )
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
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!isActive) {
      setRevealed(false)
      setStep(0)
      setHoveredImageIndex(null)
      return
    }
    const timer = setTimeout(() => setRevealed(true), SLIDE_TRANSITION_MS)
    return () => clearTimeout(timer)
  }, [isActive])

  const goStep = (next: number) => {
    const clamped = Math.max(0, Math.min(solutions.length - 1, next))
    if (clamped === step) return
    setStep(clamped)
    setHoveredImageIndex(null)
  }

  const solution = solutions[step]

  // 화살표 색을 AccentPill(태그) 배경 그라디언트와 같은 색 계열로 맞추되,
  // pill보다 흰색 혼합을 덜 써서 조금 더 진하게 보이게 한다
  const pillAccent = accent ?? DEFAULT_ACCENT
  const pillWhiteMix = projectId === "02" ? 0.2 : 0.5
  const arrowWhiteMix = Math.max(pillWhiteMix - 0.15, 0)
  const arrowGradientStops = pillAccent.blobs.map((c) => mixWithWhite(c, arrowWhiteMix))

  return (
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
          className="flex flex-wrap items-center gap-6 mb-10"
          style={{ borderBottom: "1px solid rgba(12,15,26,0.08)" }}
        >
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
              className="relative flex items-center justify-center"
              // 스텝 종류(단일 이미지/멀티 이미지/비교 카드)와 무관하게 항상
              // 같은 높이를 써야 탭을 전환해도 아래 콘텐츠·페이지 위치가
              // 흔들리지 않는다 — 스텝별로 값을 다르게 주면 안 된다
              style={{ height: isMobile ? undefined : "300px" }}
            >
              {!isMobile && step > 0 && (
                <button
                  aria-label="이전 해결 방안"
                  onClick={() => goStep(step - 1)}
                  className="absolute -left-8 top-1/2 -translate-y-1/2 z-10 text-3xl leading-none opacity-30 hover:opacity-80 transition-opacity duration-300"
                  style={{ color: "#0C0F1A" }}
                >
                  ‹
                </button>
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
                          shadowColor={hexToRgba(pillAccent.primary, 0.4)}
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
                    style={{ maxHeight: isMobile ? "38vh" : "300px" }}
                  />
                </div>
              )}
              {!isMobile && step < solutions.length - 1 && (
                <button
                  aria-label="다음 해결 방안"
                  onClick={() => goStep(step + 1)}
                  className="absolute -right-8 top-1/2 -translate-y-1/2 z-10 text-3xl leading-none opacity-30 hover:opacity-80 transition-opacity duration-300"
                  style={{ color: "#0C0F1A" }}
                >
                  ›
                </button>
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
              // 대신 AS-IS/TO-BE 두 영역을 화살표로 잇는 비교 구조로
              // 보여준다 — 어려운 용어 없이 상태 변화 자체가 한눈에 읽히게
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: isMobile ? "1fr" : "1fr auto 1fr",
                  // 각 before/after 카드를 같은 행에 나란히 둬서, grid의
                  // 기본 stretch 정렬로 짝을 이루는 두 카드의 높이가 항상
                  // 같아지게 한다(한쪽 설명이 길어 줄바꿈돼도 나란히 맞음)
                  gridTemplateRows: `repeat(${solution.comparison.before.length}, auto)`,
                }}
              >
                {solution.comparison.before.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-4 backdrop-blur-sm"
                    style={{
                      gridColumn: 1,
                      gridRow: isMobile ? undefined : i + 1,
                      background: hexToRgba(mixWithWhite(accentColor, 0.93), 0.62),
                      border: "1px solid rgba(12,15,26,0.06)",
                    }}
                  >
                    <p
                      style={{ fontFamily: "var(--font-body)" }}
                      className="text-sm font-semibold text-[#0C0F1A] leading-snug"
                    >
                      {item.title}
                    </p>
                    <p
                      style={{ fontFamily: "var(--font-body)" }}
                      className="text-xs text-[#0C0F1A]/60 leading-relaxed font-normal mt-1"
                    >
                      {item.detail}
                    </p>
                  </div>
                ))}
                <div
                  aria-hidden="true"
                  className="flex items-center justify-center shrink-0 mx-auto"
                  style={{
                    gridColumn: isMobile ? 1 : 2,
                    gridRow: isMobile
                      ? undefined
                      : `1 / span ${solution.comparison.before.length}`,
                    color: accentColor,
                  }}
                >
                  <FlowArrow
                    gradientId="solution-arrow-gradient-comparison"
                    gradientStops={arrowGradientStops}
                    shadowColor={hexToRgba(pillAccent.primary, 0.4)}
                    rotate={isMobile}
                  />
                </div>
                {solution.comparison.after.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-4 backdrop-blur-sm"
                    style={{
                      gridColumn: isMobile ? 1 : 3,
                      gridRow: isMobile ? undefined : i + 1,
                      background: hexToRgba(mixWithWhite(accentColor, 0.93), 0.62),
                      border: "1px solid rgba(12,15,26,0.06)",
                    }}
                  >
                    <p
                      style={{ fontFamily: "var(--font-body)" }}
                      className="text-sm font-semibold text-[#0C0F1A] leading-snug"
                    >
                      {item.title}
                    </p>
                    <p
                      style={{ fontFamily: "var(--font-body)" }}
                      className="text-xs text-[#0C0F1A]/60 leading-relaxed font-normal mt-1"
                    >
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="rounded-2xl p-5 backdrop-blur-sm"
                style={{
                  background: hexToRgba(mixWithWhite(accentColor, 0.93), 0.62),
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
  )
}
