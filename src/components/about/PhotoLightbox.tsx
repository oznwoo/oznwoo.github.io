import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"
import { createPortal } from "react-dom"
import {
  computeFlipTransform,
  type LightboxPhase,
} from "@/components/project-detail/lightbox/flip"

interface PhotoLightboxProps {
  src: string
  alt: string
  // 트리거 프레임(테두리·그림자·라운드·비율)에 얹을 클래스/스타일 —
  // 페이지가 자기 레이아웃에 맞게 넘긴다
  frameClassName?: string
  frameStyle?: CSSProperties
  imgClassName?: string
}

const OPEN_EASE = "transform 0.45s cubic-bezier(0.16,1,0.3,1)"
const CLOSE_EASE = "transform 0.35s cubic-bezier(0.6,0,0.9,0.2)"

// ABOUT 증명사진 전용 라이트박스. 프로젝트 상세의 라이트박스는 액센트 색·캐러셀·
// 화살표까지 얽혀 있어 페이지 루트에 얹기 어렵다 — 여기서는 단일 이미지에
// 필요한 FLIP 확대(그 자리에서부터 커짐)만 떼어내 자체적으로 처리한다.
export function PhotoLightbox({
  src,
  alt,
  frameClassName = "",
  frameStyle,
  imgClassName = "w-full h-full object-cover object-top",
}: PhotoLightboxProps) {
  const [phase, setPhase] = useState<LightboxPhase>("closed")
  const frameRef = useRef<HTMLButtonElement>(null)
  const sourceRectRef = useRef<DOMRect | null>(null)
  const zoomRef = useRef<HTMLImageElement>(null)

  const openZoom = useCallback(() => {
    const rect = frameRef.current?.getBoundingClientRect()
    if (!rect) return
    sourceRectRef.current = rect
    setPhase("opening")
  }, [])

  const closeZoom = useCallback(() => {
    const el = zoomRef.current
    const source = sourceRectRef.current
    if (!el || !source) {
      setPhase("closed")
      return
    }
    const { dx, dy, scale } = computeFlipTransform(
      source,
      el.getBoundingClientRect(),
    )
    setPhase("closing")
    el.style.transition = CLOSE_EASE
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`
  }, [])

  // opening: 라이트박스 이미지가 자연 크기로 한 번 그려진 상태를 측정해,
  // 썸네일 크기로 축소한 transform을 트랜지션 없이 걸고 다음 프레임에 걷어낸다
  // (표준 FLIP). prefers-reduced-motion이면 계산을 건너뛰고 바로 open.
  useLayoutEffect(() => {
    if (phase !== "opening") return
    const el = zoomRef.current
    const source = sourceRectRef.current
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!el || !source || reduce) {
      setPhase("open")
      return
    }
    const { dx, dy, scale } = computeFlipTransform(
      source,
      el.getBoundingClientRect(),
    )
    el.style.transition = "none"
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`
    void el.offsetHeight
    requestAnimationFrame(() => {
      el.style.transition = OPEN_EASE
      el.style.transform = "translate(0px, 0px) scale(1)"
      setPhase("open")
    })
  }, [phase])

  // 열려 있는 동안 Esc로 닫고, 배경 스크롤을 잠근다
  useEffect(() => {
    if (phase === "closed") return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation()
        closeZoom()
      }
    }
    window.addEventListener("keydown", onKey, true)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey, true)
      document.body.style.overflow = prevOverflow
    }
  }, [phase, closeZoom])

  return (
    <>
      <button
        ref={frameRef}
        type="button"
        aria-label={`${alt} 크게 보기`}
        onMouseDown={(e) => e.preventDefault()}
        onClick={openZoom}
        className={"block overflow-hidden cursor-zoom-in " + frameClassName}
        style={frameStyle}
      >
        <img src={src} alt={alt} className={imgClassName} />
      </button>

      {phase !== "closed" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${alt} 크게 보기`}
            onClick={closeZoom}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-14"
            style={{
              background: "rgba(12,15,26,0.1)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              opacity: phase === "open" ? 1 : 0,
              transition: "opacity 0.35s ease",
            }}
          >
            <img
              ref={zoomRef}
              src={src}
              alt={alt}
              onClick={(e) => e.stopPropagation()}
              onTransitionEnd={(e) => {
                if (e.propertyName === "transform" && phase === "closing") {
                  setPhase("closed")
                }
              }}
              className="rounded-2xl cursor-zoom-out"
              style={{
                maxHeight: "88vh",
                maxWidth: "92vw",
                width: "auto",
                height: "auto",
                boxShadow: "0 50px 100px -20px rgba(0,0,0,0.4)",
              }}
            />
          </div>,
          document.body,
        )}
    </>
  )
}
