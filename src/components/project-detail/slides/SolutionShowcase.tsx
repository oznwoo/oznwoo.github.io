import { useEffect, useState } from "react"
import { TabArrowButton } from "@/components/project-detail/TabArrowButton"
import { DEFAULT_ACCENT } from "@/data/projects"
import type { ProjectDetailCardItem } from "@/data/projects"
import type { ProjectAccent } from "@/lib/color"
import { hexToRgba, mixWithWhite, softPillGradient } from "@/lib/color"
import { renderWithEmphasis } from "@/lib/emphasis"
import { MediaPlaceholder } from "@/components/project-detail/MediaPlaceholder"
import { getArrowColors } from "@/components/project-detail/lightbox/arrowColors"
import type { LightboxContent } from "@/components/project-detail/lightbox/ImageLightbox"
import { useLightbox } from "@/components/project-detail/lightbox/LightboxProvider"
import { ZoomableImage } from "@/components/project-detail/lightbox/ZoomableImage"
import { ComparisonItemCard } from "./solution-showcase/ComparisonItemCard"
import { ComparisonLabelPill } from "./solution-showcase/ComparisonLabelPill"
import { FlowArrow } from "./solution-showcase/FlowArrow"
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
  const {
    open: openLightbox,
    close: closeLightbox,
    isOpen: lightboxOpen,
  } = useLightbox()

  // 슬라이드를 나갔다 다시 들어와도 보던 스텝을 그대로 유지한다 — step은
  // 여기서 건드리지 않고, 프로젝트 자체가 바뀔 때만(아래 별도 effect) 0으로
  // 되돌린다.
  useEffect(() => {
    if (!isActive) {
      setRevealed(false)
      setHoveredImageIndex(null)
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
    setHoveredImageIndex(null)
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

  // 확대 시 보여줄 내용 — 여러 장이면 겹침(imagesOverlap) 여부에 따라 캐러셀
  // (한 장씩 좌우로 넘김) 또는 화살표로 이은 나란한 줄로 보여준다
  const buildImagesContent = (): LightboxContent => {
    const imgs = solution.images ?? []
    if (solution.imagesOverlap === true && imgs.length > 1) {
      return { kind: "carousel", images: imgs, label: solution.title }
    }
    return {
      kind: "row",
      images: imgs,
      showArrows: solution.imagesShowArrows !== false,
      label: solution.title,
    }
  }
  // 여러 장을 나란히 두기엔 폭이 부족한 경우, 데스크톱에서만 카드를 서로
  // 살짝 겹쳐 부채꼴로 펼친다 — 모바일은 세로 스택이라 겹침이 부자연스럽다
  const overlapImages =
    !isMobile &&
    solution.imagesOverlap === true &&
    (solution.images?.length ?? 0) > 1
  // 이미지를 hover하고 있다는 것만 따로 뽑아둔다 — "크게 보기" 버튼과
  // 이전/다음 화살표 모두 자기 자신을 hover할 때뿐 아니라 이미지를
  // hover할 때도 같이 강조되어야 하기 때문
  const isImageHovered = imgHovered || hoveredImageIndex !== null

  // 화살표 색은 AccentPill(태그) 배경 그라디언트와 같은 계열 — 라이트박스의
  // 멀티 이미지 확대와도 값을 맞춰야 해서 헬퍼로 공유한다
  const { arrowGradientStops, arrowShadowColor } = getArrowColors(
    accent,
    projectId,
  )

  // 선택된 탭 배경 — 카드 태그(AccentPill) 계열의 pill 그라디언트를 쓰되,
  // 분홍빛 페이지 배경에서도 선택 상태가 또렷하게 보이도록 문제·해결 라벨
  // (흰색 혼합 0.5/0.2)보다 흰색을 덜 섞어 더 진하게 깐다.
  const activeTabBackground = softPillGradient(
    accent ?? DEFAULT_ACCENT,
    projectId === "02" ? 0.12 : 0.32,
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
        {/* eyebrow(왼쪽) + 세그먼트 탭(오른쪽)을 한 줄에 둬서 상단 우측의 남는
            공간을 쓰고 이미지를 위로 끌어올린다. 모바일은 세로로 쌓는다.
            탭: 옅은 중립 회색 컨테이너, 선택된 탭만 네비게이터 dot과 같은 색,
            둥글기는 페이지 카드 톤에 맞춤. 라벨은 problems와 1:1로 맞으면
            (Fintag) PROBLEM 쪽 표현을, 아니면 solution 제목을 쓴다. */}
        <div
          className={
            isMobile
              ? "mb-3 flex flex-col gap-2"
              : "mb-3 flex items-center justify-between gap-4"
          }
        >
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="shrink-0 text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase"
          >
            Solution
          </span>
          {/* 탭도 revealed 기반 전환을 쓴다 — 등장할 땐 아래에서 위로
              (12px → 0), 슬라이드를 떠날 땐 위에서 아래로(0 → 12px) 사라진다. */}
          <div
            className="inline-flex max-w-full items-center overflow-x-auto rounded-lg p-1"
            style={{
              background: "rgba(12,15,26,0.045)",
              transform: revealed ? "translateY(0)" : "translateY(12px)",
              opacity: revealed ? 1 : 0,
              transition:
                "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease-out",
            }}
          >
            {solutions.map((s, i) => {
              const active = i === step
              return (
                <button
                  key={s.title}
                  onClick={() => goStep(i)}
                  style={{
                    fontFamily: "var(--font-body)",
                    background: active ? activeTabBackground : "transparent",
                    color: active
                      ? "rgba(255,255,255,0.98)"
                      : "rgba(12,15,26,0.5)",
                    WebkitTextStroke: active
                      ? "0.3px rgba(255,255,255,0.98)"
                      : undefined,
                    boxShadow: active
                      ? `0 6px 16px -8px ${hexToRgba(accentColor, 0.45)}`
                      : "none",
                    textShadow: active
                      ? "0 1px 2px rgba(12,15,26,0.2)"
                      : "none",
                  }}
                  className={
                    "cursor-pointer whitespace-nowrap rounded-[7px] px-3 py-1 text-xs transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:shadow-md active:translate-y-0 active:scale-95 " +
                    (active
                      ? "font-bold hover:brightness-[1.04]"
                      : "font-medium hover:bg-[rgba(12,15,26,0.08)] hover:text-[#0C0F1A]/80")
                  }
                >
                  {problems[i]?.title ?? s.title}
                </button>
              )
            })}
          </div>
        </div>

        {/* 이미지 영역 — 탭 컨테이너와 같은 옅은 중립 회색 배경으로 영역을
            암시한다. 스텝 종류(단일/멀티/겹침/없음)와 무관하게 항상 같은
            크기·안쪽 여백. 좌우 스텝 화살표는 영역 바깥(옆)에 뜬다. */}
        <div className="relative">
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              height: isMobile ? undefined : "340px",
              minHeight: isMobile ? "40vh" : undefined,
              background: "rgba(12,15,26,0.045)",
              border: "1px solid rgba(12,15,26,0.05)",
            }}
          >
              <div
                key={step}
                className="flex h-full w-full items-center justify-center px-6 py-5"
                style={{
                  animation: "step-in 0.5s cubic-bezier(0.16,1,0.3,1) both",
                }}
              >
                {solution.images ? (
                // 스텝별 스크린샷을 합성 이미지 한 장 대신 낱장으로 받아,
                // 사이 화살표는 이미지에 미리 그려 넣지 않고 FlowArrow로
                // 직접 그린다 — 다른 화살표들과 색·모양이 항상 일치한다.
                // imagesOverlap이면 화살표 없이 카드를 겹쳐 부채꼴로 편다.
                <div
                  className={
                    isMobile
                      ? "flex flex-col items-center gap-3"
                      : overlapImages
                        ? "flex items-center justify-center"
                        : "flex items-center justify-center gap-3"
                  }
                >
                  {solution.images.map((img, i) => {
                    const isHovered = hoveredImageIndex === i
                    const mid = (solution.images!.length - 1) / 2
                    const restTransform = overlapImages
                      ? `translateY(${Math.abs(i - mid) * 5}px) rotate(${(i - mid) * 2.5}deg)`
                      : "translateY(0) scale(1)"
                    const hoverTransform = overlapImages
                      ? "translateY(-10px) rotate(0deg) scale(1.04)"
                      : "translateY(-3px) scale(1.012)"
                    return (
                      <div
                        key={i}
                        className={
                          isMobile
                            ? "flex flex-col items-center gap-3"
                            : "flex items-center gap-3"
                        }
                        style={
                          overlapImages && i > 0
                            ? { marginLeft: "-268px" }
                            : undefined
                        }
                      >
                        {i > 0 &&
                          !overlapImages &&
                          solution.imagesShowArrows !== false && (
                            <FlowArrow
                              gradientId={`solution-arrow-gradient-img-${i}`}
                              gradientStops={arrowGradientStops}
                              shadowColor={arrowShadowColor}
                              size={26}
                              rotate={isMobile}
                            />
                          )}
                        <div
                          role="button"
                          tabIndex={0}
                          aria-label={`${solution.title} 이미지 크게 보기`}
                          onMouseEnter={() => setHoveredImageIndex(i)}
                          onMouseLeave={() => setHoveredImageIndex(null)}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={(e) =>
                            openLightbox(
                              e.currentTarget.getBoundingClientRect(),
                              buildImagesContent(),
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault()
                              openLightbox(
                                e.currentTarget.getBoundingClientRect(),
                                buildImagesContent(),
                              )
                            }
                          }}
                          className="rounded-2xl overflow-hidden border shrink-0 cursor-zoom-in"
                          style={{
                            position: overlapImages ? "relative" : undefined,
                            // 겹침(부채꼴) 카드는 원본 비율이 제각각이면 부채꼴
                            // 전체 폭이 들쭉날쭉해져 스텝 화살표 영역까지 침범한다
                            // — 카드 크기를 고정하고 이미지는 object-cover로 채우며,
                            // 겹침 간격도 %가 아닌 고정 px로 줘서 부채꼴 폭이 항상
                            // 컨테이너(max-w-4xl) 안에 들어오고 화살표와 간격이 유지된다
                            width: overlapImages ? "376px" : undefined,
                            height: overlapImages ? "256px" : undefined,
                            // 평상시엔 왼쪽 카드가 앞(부채꼴을 왼→오로 읽게),
                            // hover한 카드는 항상 맨 위로
                            zIndex: overlapImages
                              ? isHovered
                                ? 40
                                : solution.images!.length - i
                              : undefined,
                            transformOrigin: overlapImages
                              ? "center bottom"
                              : undefined,
                            borderColor: isHovered
                              ? hexToRgba(accentColor, 0.35)
                              : "rgba(12,15,26,0.1)",
                            boxShadow: isHovered
                              ? `0 20px 45px -14px ${hexToRgba(accentColor, 0.35)}, 0 8px 18px -8px rgba(12,15,26,0.28)`
                              : "0 14px 34px -18px rgba(12,15,26,0.24), 0 4px 10px -6px rgba(12,15,26,0.12)",
                            transform: isHovered
                              ? hoverTransform
                              : restTransform,
                            transition:
                              "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease-out, border-color 0.4s ease-out",
                          }}
                        >
                          <img
                            src={img}
                            alt=""
                            aria-hidden="true"
                            loading="eager"
                            className={
                              overlapImages
                                ? "block h-full w-full object-cover"
                                : "block w-auto"
                            }
                            style={
                              overlapImages
                                ? undefined
                                : {
                                    height: isMobile
                                      ? "32vh"
                                      : // 가로로 넓은 다이어그램 2장을 나란히
                                        // 두면 폭 합이 컨테이너를 넘어간다 —
                                        // 3장 미만일 때는 낮춘 높이로 폭을 맞춘다
                                        solution.images!.length >= 3
                                        ? "258px"
                                        : "210px",
                                  }
                            }
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : solution.image ? (
                <ZoomableImage
                  src={solution.image}
                  accentColor={accentColor}
                  width={imageWidth}
                  height={imageHeight}
                  onHoverChange={setImgHovered}
                  frameClassName="inline-block max-w-full"
                  imgClassName="block w-auto h-auto max-w-full"
                  imgStyle={{ maxHeight: isMobile ? "36vh" : "288px" }}
                />
              ) : (
                // 아직 스텝 이미지가 없는 solution — 자리와 카드 톤은
                // 그대로 두고 자리표시자만 보여준다
                <MediaPlaceholder
                  kind="image"
                  accentColor={accentColor}
                  style={{
                    aspectRatio: `${imageWidth} / ${imageHeight}`,
                    maxWidth: "100%",
                    height: isMobile ? "26vh" : "270px",
                  }}
                />
              )}
              </div>
            </div>
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
