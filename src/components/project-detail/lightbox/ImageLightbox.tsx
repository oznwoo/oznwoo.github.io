import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import type { RefObject } from "react"
import { hexToRgba } from "@/lib/color"
import { FlowArrow } from "../slides/solution-showcase/FlowArrow"
import type { LightboxPhase } from "./flip"

// 라이트박스로 크게 볼 내용 — 트리거(ZoomableImage / SOLUTION 쇼케이스)가
// 이미 정규화해서 넘겨준다.
// - single: 이미지 한 장
// - row: 파이프라인 스텝 스크린샷 여러 장을 나란히(사이에 화살표)
// - carousel: 서로 독립된 스크린샷 여러 장을 한 장씩, 좌우 화살표로 넘김
export type LightboxContent =
  | {
      kind: "single"
      src: string
      label?: string
    }
  | {
      kind: "row"
      images: string[]
      showArrows: boolean
      label?: string
    }
  | {
      kind: "carousel"
      images: string[]
      label?: string
    }

// 캐러셀 좌우 넘김 버튼 — 이미지 위가 아니라 백드롭 가장자리에 둔다.
// SOLUTION 탭 화살표(TabArrowButton)와 같은 흰 카드형 버튼. 그림자는 hover와
// 무관하게 항상 켜져 있고, hover 시에는 화살표(chevron)가 진해지며 accent
// 테두리가 들어오고 카드가 살짝 앞으로 떠오른다.
function LightboxNav({
  side,
  visible,
  accentColor,
  onClick,
}: {
  side: "prev" | "next"
  visible: boolean
  accentColor: string
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      type="button"
      aria-label={side === "prev" ? "이전 이미지" : "다음 이미지"}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={
        "absolute top-1/2 z-10 flex items-center justify-center " +
        "rounded-xl border px-3 py-2 text-3xl leading-none " +
        (side === "prev" ? "left-2 md:left-8" : "right-2 md:right-8")
      }
      style={{
        color: "#0C0F1A",
        background: "rgba(255,255,255,0.92)",
        borderColor: hovered
          ? hexToRgba(accentColor, 0.35)
          : "rgba(12,15,26,0.06)",
        boxShadow: hovered
          ? `0 22px 44px -14px ${hexToRgba(accentColor, 0.4)}, 0 8px 18px -8px rgba(12,15,26,0.28)`
          : "0 16px 34px -12px rgba(12,15,26,0.3), 0 6px 14px -8px rgba(12,15,26,0.2)",
        transform: hovered
          ? "translateY(calc(-50% - 3px)) scale(1.06)"
          : "translateY(-50%) scale(1)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition:
          "opacity 0.35s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <span
        style={{
          opacity: hovered ? 0.9 : 0.32,
          transition: "opacity 0.25s ease",
        }}
      >
        {side === "prev" ? "‹" : "›"}
      </span>
    </button>
  )
}

interface ImageLightboxProps {
  content: LightboxContent | null
  isMobile: boolean
  lightboxPhase: LightboxPhase
  zoomContentRef: RefObject<HTMLDivElement | null>
  closeZoom: () => void
  resetZoomImmediately: () => void
  accentColor: string
  arrowGradientStops: string[]
  arrowShadowColor: string
}

// "이미지 크게 보기" 라이트박스의 실제 화면 — FLIP transform은 LightboxProvider
// 가 zoomContentRef에 직접 걸어주므로, 여기서는 순수하게 마크업만 그린다.
export function ImageLightbox({
  content,
  isMobile,
  lightboxPhase,
  zoomContentRef,
  closeZoom,
  resetZoomImmediately,
  accentColor,
  arrowGradientStops,
  arrowShadowColor,
}: ImageLightboxProps) {
  const carousel = content?.kind === "carousel"
  const images = content && content.kind !== "single" ? content.images : null
  const count = images?.length ?? 0
  const [index, setIndex] = useState(0)

  // 라이트박스를 닫거나 다른 내용으로 바뀌면 항상 첫 장부터 다시 시작
  useEffect(() => {
    if (lightboxPhase === "closed") setIndex(0)
  }, [lightboxPhase])
  useEffect(() => {
    setIndex(0)
  }, [content])

  // 열려 있는 동안 좌우 방향키로도 전환 (Esc는 Provider에서 이미 처리).
  // 양 끝에서는 더 넘어가지 않는다(순환 X) — 경계 화살표도 함께 숨긴다.
  useEffect(() => {
    if (!carousel || lightboxPhase === "closed") return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => Math.min(count - 1, i + 1))
      else if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [carousel, lightboxPhase, count])

  if (lightboxPhase === "closed" || !content) return null

  const goPrev = () => setIndex((i) => Math.max(0, i - 1))
  const goNext = () => setIndex((i) => Math.min(count - 1, i + 1))
  const navVisible = lightboxPhase === "open"

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${content.label ?? "이미지"} 크게 보기`}
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
        {content.kind === "carousel" ? (
          <div className="relative flex items-center justify-center">
            <img
              key={index}
              src={content.images[index]}
              alt=""
              className="rounded-2xl"
              style={{
                maxHeight: isMobile ? "72vh" : "84vh",
                maxWidth: isMobile ? "90vw" : "82vw",
                width: "auto",
                height: "auto",
                boxShadow: "0 50px 100px -20px rgba(0,0,0,0.4)",
                animation: "step-in 0.3s cubic-bezier(0.16,1,0.3,1) both",
              }}
            />
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
        ) : content.kind === "row" ? (
          <div
            className={
              isMobile
                ? "flex flex-col items-center gap-6 max-h-full overflow-auto"
                : "flex items-center gap-8 max-h-full"
            }
          >
            {content.images.map((img, i) => (
              <div
                key={i}
                className={
                  isMobile
                    ? "flex flex-col items-center gap-6"
                    : "flex items-center gap-8"
                }
              >
                {i > 0 && content.showArrows && (
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
                      : `${Math.floor(80 / content.images.length)}vw`,
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
            src={content.src}
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
      {carousel && (
        <>
          <LightboxNav
            side="prev"
            visible={navVisible && index > 0}
            accentColor={accentColor}
            onClick={goPrev}
          />
          <LightboxNav
            side="next"
            visible={navVisible && index < count - 1}
            accentColor={accentColor}
            onClick={goNext}
          />
        </>
      )}
    </div>,
    document.body,
  )
}
