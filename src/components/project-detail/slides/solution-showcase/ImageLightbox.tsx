import { useEffect, useState } from "react"
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
  const images = solution.images
  // 겹쳐 보여주던 독립 스크린샷들은 크게 볼 때 나란히 두면 각 장이 너무
  // 작아진다 — 한 장씩 꽉 차게 보여주고 좌우 화살표로 넘긴다.
  const carousel =
    solution.imagesOverlap === true && !!images && images.length > 1
  const count = images?.length ?? 0
  const [index, setIndex] = useState(0)

  // 라이트박스를 닫거나 다른 스텝으로 넘어가면 항상 첫 장부터 다시 시작
  useEffect(() => {
    if (lightboxPhase === "closed") setIndex(0)
  }, [lightboxPhase])
  useEffect(() => {
    setIndex(0)
  }, [solution])

  // 열려 있는 동안 좌우 방향키로도 전환 (Esc는 훅에서 이미 처리)
  useEffect(() => {
    if (!carousel || lightboxPhase === "closed") return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % count)
      else if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + count) % count)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [carousel, lightboxPhase, count])

  if (lightboxPhase === "closed" || !(solution.image || solution.images))
    return null

  const goPrev = () => setIndex((i) => (i - 1 + count) % count)
  const goNext = () => setIndex((i) => (i + 1) % count)
  const navVisible = lightboxPhase === "open"

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
        {carousel ? (
          <div className="relative flex items-center justify-center">
            <img
              key={index}
              src={images![index]}
              alt=""
              className="rounded-2xl"
              style={{
                maxHeight: isMobile ? "72vh" : "84vh",
                maxWidth: isMobile ? "90vw" : "86vw",
                width: "auto",
                height: "auto",
                boxShadow: "0 50px 100px -20px rgba(0,0,0,0.4)",
                animation: "step-in 0.3s cubic-bezier(0.16,1,0.3,1) both",
              }}
            />
            <button
              type="button"
              aria-label="이전 이미지"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full text-3xl leading-none transition-colors duration-200"
              style={{
                background: "rgba(12,15,26,0.55)",
                color: "#fff",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                opacity: navVisible ? 1 : 0,
              }}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="다음 이미지"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full text-3xl leading-none transition-colors duration-200"
              style={{
                background: "rgba(12,15,26,0.55)",
                color: "#fff",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                opacity: navVisible ? 1 : 0,
              }}
            >
              ›
            </button>
            <div
              aria-hidden="true"
              className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs tracking-wide"
              style={{
                background: "rgba(12,15,26,0.55)",
                color: "#fff",
                fontFamily: "var(--font-mono)",
                opacity: navVisible ? 1 : 0,
              }}
            >
              {index + 1} / {count}
            </div>
          </div>
        ) : solution.images ? (
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
