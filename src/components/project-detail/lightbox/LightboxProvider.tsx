import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import type { ReactNode } from "react"
import type { ProjectAccent } from "@/lib/color"
import { computeFlipTransform, type LightboxPhase } from "./flip"
import { getArrowColors } from "./arrowColors"
import { ImageLightbox, type LightboxContent } from "./ImageLightbox"

interface LightboxContextValue {
  // sourceRect는 확대가 "여기서부터" 커지기 시작할 기준(썸네일 위치).
  // 트리거가 클릭 직전 자기 자신을 measure해서 넘긴다.
  open: (sourceRect: DOMRect, content: LightboxContent) => void
  // 스텝/탭 전환처럼 사용자가 직접 닫은 게 아닌 경우 — 애니메이션 없이 즉시 닫는다
  close: () => void
  isOpen: boolean
}

const LightboxContext = createContext<LightboxContextValue | null>(null)

export function useLightbox(): LightboxContextValue {
  const ctx = useContext(LightboxContext)
  if (!ctx) {
    throw new Error("useLightbox must be used within <LightboxProvider>")
  }
  return ctx
}

interface LightboxProviderProps {
  children: ReactNode
  accent: ProjectAccent | null
  accentColor: string
  projectId: string
  isMobile: boolean
  // 값이 바뀌면(다른 프로젝트/다른 슬라이드로 이동) 열려 있던 라이트박스를
  // 애니메이션 없이 닫는다
  resetKey: string
}

// 프로젝트 상세의 모든 이미지가 공유하는 라이트박스 하나. 트리거(ZoomableImage,
// SOLUTION 쇼케이스)가 useLightbox().open으로 source rect + 내용을 넘기면,
// 표준 FLIP 기법으로 "그 자리에서부터" 커지는 확대를 재생한다.
export function LightboxProvider({
  children,
  accent,
  accentColor,
  projectId,
  isMobile,
  resetKey,
}: LightboxProviderProps) {
  // closed → opening(FLIP 계산 중, 아직 안 보임) → open(다 커진 상태) →
  // closing(줄어드는 중)
  const [phase, setPhase] = useState<LightboxPhase>("closed")
  const [content, setContent] = useState<LightboxContent | null>(null)
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null)
  // 라이트박스 안 실제 이미지 콘텐츠 — FLIP transform을 직접 주고받는 대상
  const zoomContentRef = useRef<HTMLDivElement>(null)

  // 라이트박스가 열려 있는 동안 Esc로 닫을 수 있게 한다. 캡처 단계로 등록해
  // ProjectDetailView의 Esc(상세 페이지 닫기)보다 먼저 잡고, 이벤트를 소비해
  // 라이트박스만 닫히고 상세 페이지로는 전파되지 않게 한다.
  useEffect(() => {
    if (phase === "closed") return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      e.preventDefault()
      e.stopPropagation()
      closeZoom()
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // opening으로 전환된 직후 — 라이트박스 콘텐츠가 자연스러운 크기로 한 번
  // 렌더링된 상태를 측정해, source(썸네일) 크기로 축소된 transform을 트랜지션
  // 없이 먼저 걸고, 다음 프레임에 transform을 걷어내며(=원래 크기로 애니메이션)
  // "여기서부터 커지는" 느낌을 만든다. 표준 FLIP 기법.
  useLayoutEffect(() => {
    if (phase !== "opening") return
    const el = zoomContentRef.current
    if (!el || !sourceRect) {
      setPhase("open")
      return
    }
    const targetRect = el.getBoundingClientRect()
    const { dx, dy, scale } = computeFlipTransform(sourceRect, targetRect)
    el.style.transition = "none"
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`
    // 강제 리플로우 — 위에서 준 transform이 실제로 한 프레임 그려지게 만들어야
    // 아래 rAF에서 transition을 붙였을 때 애니메이션이 재생된다
    void el.offsetHeight
    requestAnimationFrame(() => {
      el.style.transition = "transform 0.45s cubic-bezier(0.16,1,0.3,1)"
      el.style.transform = "translate(0px, 0px) scale(1)"
      setPhase("open")
    })
  }, [phase, sourceRect])

  const resetImmediately = useCallback(() => {
    if (zoomContentRef.current) {
      zoomContentRef.current.style.transition = "none"
      zoomContentRef.current.style.transform = "none"
    }
    setPhase("closed")
  }, [])

  const closeZoom = useCallback(() => {
    const el = zoomContentRef.current
    if (!el || !sourceRect) {
      resetImmediately()
      return
    }
    const targetRect = el.getBoundingClientRect()
    const { dx, dy, scale } = computeFlipTransform(sourceRect, targetRect)
    setPhase("closing")
    el.style.transition = "transform 0.35s cubic-bezier(0.6,0,0.9,0.2)"
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`
  }, [sourceRect, resetImmediately])

  const open = useCallback((rect: DOMRect, next: LightboxContent) => {
    setContent(next)
    setSourceRect(rect)
    setPhase("opening")
  }, [])

  // 다른 프로젝트/슬라이드로 이동하면 열려 있던 라이트박스는 즉시 닫는다
  const firstRun = useRef(true)
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    resetImmediately()
  }, [resetKey, resetImmediately])

  const { arrowGradientStops, arrowShadowColor } = getArrowColors(
    accent,
    projectId,
  )

  return (
    <LightboxContext.Provider
      value={{ open, close: resetImmediately, isOpen: phase !== "closed" }}
    >
      {children}
      <ImageLightbox
        content={content}
        isMobile={isMobile}
        lightboxPhase={phase}
        zoomContentRef={zoomContentRef}
        closeZoom={closeZoom}
        resetZoomImmediately={resetImmediately}
        accentColor={accentColor}
        arrowGradientStops={arrowGradientStops}
        arrowShadowColor={arrowShadowColor}
      />
    </LightboxContext.Provider>
  )
}
