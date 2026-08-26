import { useEffect, useLayoutEffect, useRef, useState } from "react"
import type { RefObject } from "react"
import { computeFlipTransform, type LightboxPhase } from "./flip"

// SOLUTION 쇼케이스의 "이미지 크게 보기" 라이트박스 상태 전체를 여기 담는다.
// imageRowRef는 호출부가 만들어서 실제 이미지 줄 DOM에 붙여줘야 한다 —
// 라이트박스가 "여기서부터" 커지기 시작할 기준점(source rect)이기 때문.
export function useImageLightbox(
  imageRowRef: RefObject<HTMLDivElement | null>,
) {
  // closed → opening(FLIP 계산 중, 아직 안 보임) → open(다 커진 상태) →
  // closing(줄어드는 중) — opening/closing 사이에 실제 transform 애니메이션이 재생된다
  const [lightboxPhase, setLightboxPhase] = useState<LightboxPhase>("closed")
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null)
  // 라이트박스 안 실제 이미지 콘텐츠 — FLIP transform을 직접 주고받는 대상
  const zoomContentRef = useRef<HTMLDivElement>(null)

  // 라이트박스가 열려 있는 동안 Esc로 닫을 수 있게 한다
  useEffect(() => {
    if (lightboxPhase === "closed") return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeZoom()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxPhase])

  // opening으로 전환된 직후 — 라이트박스 콘텐츠가 자연스러운 크기로 한 번
  // 렌더링된 상태를 측정해, source(썸네일) 크기로 축소된 transform을 트랜지션
  // 없이 먼저 걸고, 다음 프레임에 transform을 걷어내며(=원래 크기로 애니메이션)
  // "여기서부터 커지는" 느낌을 만든다. 표준 FLIP 기법.
  useLayoutEffect(() => {
    if (lightboxPhase !== "opening") return
    const content = zoomContentRef.current
    if (!content || !sourceRect) {
      setLightboxPhase("open")
      return
    }
    const targetRect = content.getBoundingClientRect()
    const { dx, dy, scale } = computeFlipTransform(sourceRect, targetRect)
    content.style.transition = "none"
    content.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`
    // 강제 리플로우 — 위에서 준 transform이 실제로 한 프레임 그려지게 만들어야
    // 아래 rAF에서 transition을 붙였을 때 애니메이션이 재생된다
    void content.offsetHeight
    requestAnimationFrame(() => {
      content.style.transition = "transform 0.45s cubic-bezier(0.16,1,0.3,1)"
      content.style.transform = "translate(0px, 0px) scale(1)"
      setLightboxPhase("open")
    })
  }, [lightboxPhase, sourceRect])

  const openZoom = () => {
    const rect = imageRowRef.current?.getBoundingClientRect()
    if (!rect) return
    setSourceRect(rect)
    setLightboxPhase("opening")
  }

  const closeZoom = () => {
    const content = zoomContentRef.current
    if (!content || !sourceRect) {
      resetZoomImmediately()
      return
    }
    const targetRect = content.getBoundingClientRect()
    const { dx, dy, scale } = computeFlipTransform(sourceRect, targetRect)
    setLightboxPhase("closing")
    content.style.transition = "transform 0.35s cubic-bezier(0.6,0,0.9,0.2)"
    content.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`
  }

  // 슬라이드/스텝 전환처럼 사용자가 직접 닫은 게 아닌 경우 — 애니메이션 없이
  // 즉시 닫고, 다음에 열 때 깨끗하게 시작하도록 남아있던 인라인 transform도 지운다
  const resetZoomImmediately = () => {
    if (zoomContentRef.current) {
      zoomContentRef.current.style.transition = "none"
      zoomContentRef.current.style.transform = "none"
    }
    setLightboxPhase("closed")
  }

  return {
    lightboxPhase,
    zoomContentRef,
    openZoom,
    closeZoom,
    resetZoomImmediately,
  }
}
