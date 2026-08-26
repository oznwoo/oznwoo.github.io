import { createPortal } from "react-dom"
import type { RefObject } from "react"
import type { ProjectDetailCardItem } from "@/data/projects"
import { FlowArrow } from "./FlowArrow"
import type { LightboxPhase } from "./flip"

interface ImageLightboxProps {
  solution: ProjectDetailCardItem
  isMobile: boolean
  lightboxPhase: LightboxPhase
  zoomContentRef: RefObject<HTMLDivElement | null>
  closeZoom: () => void
  resetZoomImmediately: () => void
  arrowGradientStops: string[]
  arrowShadowColor: string
}

// "이미지 크게 보기" 라이트박스의 실제 화면 — FLIP transform은 useImageLightbox
// 훅이 zoomContentRef에 직접 걸어주므로, 여기서는 순수하게 마크업만 그린다.
export function ImageLightbox({
  solution,
  isMobile,
  lightboxPhase,
  zoomContentRef,
  closeZoom,
  resetZoomImmediately,
  arrowGradientStops,
  arrowShadowColor,
}: ImageLightboxProps) {
  if (lightboxPhase === "closed" || !(solution.image || solution.images))
    return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${solution.title} 크게 보기`}
      onClick={closeZoom}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-14"
      style={{
        background: "rgba(12,15,26,0.1)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        opacity: lightboxPhase === "open" ? 1 : 0,
        transition: "opacity 0.35s ease",
      }}
    >
      <div
        ref={zoomContentRef}
        onClick={(e) => e.stopPropagation()}
        onTransitionEnd={(e) => {
          // transform 트랜지션이 끝났을 때만 처리 — opacity 등 다른
          // 속성 트랜지션에 중복으로 반응하지 않게 property를 확인한다
          if (e.propertyName === "transform" && lightboxPhase === "closing") {
            resetZoomImmediately()
          }
        }}
      >
        {solution.images ? (
          <div
            className={
              isMobile
                ? "flex flex-col items-center gap-6 max-h-full overflow-auto"
                : "flex items-center gap-8 max-h-full"
            }
          >
            {solution.images.map((img, i) => (
              <div
                key={i}
                className={
                  isMobile
                    ? "flex flex-col items-center gap-6"
                    : "flex items-center gap-8"
                }
              >
                {i > 0 && solution.imagesShowArrows !== false && (
                  <FlowArrow
                    gradientId={`solution-arrow-gradient-zoom-${i}`}
                    gradientStops={arrowGradientStops}
                    shadowColor={arrowShadowColor}
                    size={36}
                    rotate={isMobile}
                  />
                )}
                <img
                  src={img}
                  alt=""
                  className="rounded-2xl"
                  style={{
                    maxHeight: isMobile ? "40vh" : "82vh",
                    // 이미지 개수가 늘어날수록 한 장에 배분되는 폭이
                    // 줄어야 화살표를 포함한 전체 줄이 뷰포트를 넘지
                    // 않는다 — 장수로 나눠 여유(화살표·gap)를 뺀 값
                    maxWidth: isMobile
                      ? "88vw"
                      : `${Math.floor(80 / solution.images!.length)}vw`,
                    width: "auto",
                    height: "auto",
                    boxShadow: "0 50px 100px -20px rgba(0,0,0,0.4)",
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <img
            src={solution.image}
            alt=""
            className="rounded-2xl"
            style={{
              maxHeight: "88vh",
              maxWidth: "92vw",
              width: "auto",
              height: "auto",
              boxShadow: "0 50px 100px -20px rgba(0,0,0,0.4)",
            }}
          />
        )}
      </div>
    </div>,
    document.body,
  )
}
