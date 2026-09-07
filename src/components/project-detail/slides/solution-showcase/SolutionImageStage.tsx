import { useEffect, useState } from "react"
import { TabArrowButton } from "@/components/project-detail/TabArrowButton"
import type { ProjectDetailCardItem } from "@/data/projects"
import type { ProjectAccent } from "@/lib/color"
import { hexToRgba } from "@/lib/color"
import { MediaPlaceholder } from "@/components/project-detail/MediaPlaceholder"
import { getArrowColors } from "@/components/project-detail/lightbox/arrowColors"
import type { LightboxContent } from "@/components/project-detail/lightbox/ImageLightbox"
import { useLightbox } from "@/components/project-detail/lightbox/LightboxProvider"
import { ZoomableImage } from "@/components/project-detail/lightbox/ZoomableImage"
import { FlowArrow } from "./FlowArrow"

interface SolutionImageStageProps {
  solution: ProjectDetailCardItem
  step: number
  stepCount: number
  onStep: (index: number) => void
  revealed: boolean
  imageWidth: number
  imageHeight: number
  accent: ProjectAccent | null
  accentColor: string
  projectId: string
  isMobile: boolean
}

// SOLUTION 스텝의 이미지 영역 — 탭 컨테이너와 같은 옅은 회색 패널(고정
// 340px)에 스텝 종류(단일/멀티/겹침/없음)와 무관하게 항상 같은 크기로
// 스크린샷을 얹고, 좌우에 스텝 이동 화살표를 띄운다.
export function SolutionImageStage({
  solution,
  step,
  stepCount,
  onStep,
  revealed,
  imageWidth,
  imageHeight,
  accent,
  accentColor,
  projectId,
  isMobile,
}: SolutionImageStageProps) {
  const { open: openLightbox } = useLightbox()
  const [imgHovered, setImgHovered] = useState(false)
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null)

  // 스텝을 바꾸거나 슬라이드를 떠나면(revealed=false) hover 강조를 푼다
  useEffect(() => {
    setHoveredImageIndex(null)
    setImgHovered(false)
  }, [step, revealed])

  const { arrowGradientStops, arrowShadowColor } = getArrowColors(
    accent,
    projectId,
  )

  const images = solution.images
  // 여러 장을 나란히 두기엔 폭이 부족한 경우, 데스크톱에서만 카드를 서로
  // 살짝 겹쳐 부채꼴로 펼친다 — 모바일은 세로 스택이라 겹침이 부자연스럽다
  const overlapImages =
    !isMobile && solution.imagesOverlap === true && (images?.length ?? 0) > 1
  // "크게 보기" 화살표와 이미지 카드 어느 쪽을 hover해도 같이 강조된다
  const isImageHovered = imgHovered || hoveredImageIndex !== null

  // 확대 시 보여줄 내용 — 여러 장이면 겹침 여부에 따라 캐러셀(한 장씩 넘김)
  // 또는 화살표로 이은 나란한 줄로 보여준다
  const buildImagesContent = (): LightboxContent => {
    const imgs = images ?? []
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

  return (
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
          className="flex h-full w-full items-center justify-center px-6 py-4"
          style={{
            animation: "step-in 0.5s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          {images ? (
            // 스텝별 스크린샷을 합성 이미지 한 장 대신 낱장으로 받아, 사이
            // 화살표는 이미지에 미리 그려 넣지 않고 FlowArrow로 직접 그린다 —
            // 다른 화살표들과 색·모양이 항상 일치한다. imagesOverlap이면
            // 화살표 없이 카드를 겹쳐 부채꼴로 편다.
            <div
              className={
                isMobile
                  ? "flex flex-col items-center gap-3"
                  : overlapImages
                    ? "flex items-center justify-center"
                    : "flex items-center justify-center gap-3"
              }
            >
              {images.map((img, i) => {
                const isHovered = hoveredImageIndex === i
                const mid = (images.length - 1) / 2
                const restTransform = overlapImages
                  ? `translateY(${Math.abs(i - mid) * 4}px) rotate(${(i - mid) * 2}deg)`
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
                        ? {
                            marginLeft:
                              images.length >= 3 ? "-110px" : "-155px",
                          }
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
                        // 겹침(부채꼴)은 원본을 자르지 않는다 — 높이만 통일하고
                        // 폭은 원본 비율대로 두며(object 안 씀), 이미지 영역
                        // 좌우 여백을 살리도록 겹침을 얕게 준다. 3장짜리는 폭
                        // 합이 커지므로 높이를 더 낮춰 맞춘다.
                        height: overlapImages
                          ? images.length >= 3
                            ? "224px"
                            : "268px"
                          : undefined,
                        // 평상시엔 왼쪽 카드가 앞(부채꼴을 왼→오로 읽게),
                        // hover한 카드는 항상 맨 위로
                        zIndex: overlapImages
                          ? isHovered
                            ? 40
                            : images.length - i
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
                        transform: isHovered ? hoverTransform : restTransform,
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
                          overlapImages ? "block h-full w-auto" : "block w-auto"
                        }
                        style={
                          overlapImages
                            ? undefined
                            : {
                                height: isMobile
                                  ? "32vh"
                                  : // 가로로 넓은 다이어그램 2장을 나란히 두면
                                    // 폭 합이 컨테이너를 넘어간다 — 3장 미만일
                                    // 때는 낮춘 높이로 폭을 맞춘다
                                    images.length >= 3
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
            // 아직 스텝 이미지가 없는 solution — 자리와 카드 톤은 그대로 두고
            // 자리표시자만 보여준다
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
          onClick={() => onStep(step - 1)}
          revealed={revealed}
          extraHintActive={isImageHovered}
          accent={accent}
          accentColor={accentColor}
          projectId={projectId}
          offsetClassName="-left-14"
        />
      )}
      {!isMobile && step < stepCount - 1 && (
        <TabArrowButton
          direction="next"
          label="다음 해결 방안"
          onClick={() => onStep(step + 1)}
          revealed={revealed}
          extraHintActive={isImageHovered}
          accent={accent}
          accentColor={accentColor}
          projectId={projectId}
          offsetClassName="-right-14"
        />
      )}
    </div>
  )
}
