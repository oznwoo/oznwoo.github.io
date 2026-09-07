import { useRef, useState } from "react"
import type { CSSProperties } from "react"
import type { ProjectAccent } from "@/lib/color"
import { hexToRgba } from "@/lib/color"
import { useLightbox } from "./LightboxProvider"
import { ZoomHint, type CursorPos } from "./ZoomHint"
import type { LightboxContent } from "./ImageLightbox"

interface ZoomableImageProps {
  src: string
  alt?: string
  accent: ProjectAccent | null
  accentColor: string
  projectId: string
  isMobile: boolean
  width?: number
  height?: number
  loading?: "eager" | "lazy"
  imgClassName?: string
  imgStyle?: CSSProperties
  // 프레임(테두리+그림자 카드)에 얹을 추가 클래스/스타일 — inline-block,
  // aspectRatio 고정, 하단 여백 등 슬라이드별 요구사항을 여기로 넘긴다
  frameClassName?: string
  frameStyle?: CSSProperties
  // hover 상태를 부모에도 알려야 하는 경우(예: SOLUTION 탭 화살표 강조)
  onHoverChange?: (hovered: boolean) => void
  // 확대 시 보여줄 내용 — 기본은 이 이미지 한 장. 여러 장/캐러셀이면 지정한다
  zoomContent?: LightboxContent
  // About 스크린샷처럼 더 크게 놓이는 이미지 — 그림자·리프트 강도를 키운다
  emphasis?: boolean
}

// 프로젝트 상세의 표준 이미지 카드 — 테두리 + 이중 그림자 + hover 리프트라는
// 기존 컨벤션을 한곳에 모으고, 여기에 "클릭하면 확대" 동작(커서 툴팁 + 클릭 시
// 라이트박스)을 붙였다. RevealCard / StackSlide / OutcomeSlide / SOLUTION
// 단일 이미지가 공유한다.
export function ZoomableImage({
  src,
  alt,
  accent,
  accentColor,
  projectId,
  isMobile,
  width,
  height,
  loading = "lazy",
  imgClassName = "w-full h-auto block",
  imgStyle,
  frameClassName = "",
  frameStyle,
  onHoverChange,
  zoomContent,
  emphasis = false,
}: ZoomableImageProps) {
  const [hovered, setHovered] = useState(false)
  // 커서 툴팁 위치 — hover 중 마우스가 움직일 때마다 갱신한다
  const [cursor, setCursor] = useState<CursorPos | null>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const { open, isOpen } = useLightbox()

  const setHover = (next: boolean) => {
    setHovered(next)
    if (!next) setCursor(null)
    onHoverChange?.(next)
  }

  const openZoom = () => {
    const rect = frameRef.current?.getBoundingClientRect()
    if (!rect) return
    open(rect, zoomContent ?? { kind: "single", src, label: alt })
  }

  const restShadow = emphasis
    ? "0 24px 60px -24px rgba(12,15,26,0.28), 0 6px 16px -8px rgba(12,15,26,0.14)"
    : "0 14px 34px -18px rgba(12,15,26,0.24), 0 4px 10px -6px rgba(12,15,26,0.12)"
  const hoverShadow = emphasis
    ? `0 32px 70px -18px ${hexToRgba(accentColor, 0.35)}, 0 10px 26px -10px rgba(12,15,26,0.3)`
    : `0 20px 45px -14px ${hexToRgba(accentColor, 0.35)}, 0 8px 18px -8px rgba(12,15,26,0.28)`
  const hoverLift = emphasis
    ? "translateY(-4px) scale(1.012)"
    : "translateY(-3px) scale(1.012)"

  return (
    <>
      <div
        ref={frameRef}
        role="button"
        tabIndex={0}
        aria-label={alt ? `${alt} 크게 보기` : "이미지 크게 보기"}
        onMouseEnter={(e) => {
          setHover(true)
          if (!isMobile) setCursor({ x: e.clientX, y: e.clientY })
        }}
        onMouseMove={
          isMobile
            ? undefined
            : (e) => setCursor({ x: e.clientX, y: e.clientY })
        }
        onMouseLeave={() => setHover(false)}
        // 마우스 클릭으로는 포커스 링이 남지 않게 한다(키보드 Tab 포커스는 유지)
        onMouseDown={(e) => e.preventDefault()}
        onClick={openZoom}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            openZoom()
          }
        }}
        className={
          "rounded-2xl overflow-hidden border cursor-zoom-in " + frameClassName
        }
        style={{
          borderColor: hovered
            ? hexToRgba(accentColor, 0.35)
            : "rgba(12,15,26,0.1)",
          boxShadow: hovered ? hoverShadow : restShadow,
          transform: hovered ? hoverLift : "translateY(0) scale(1)",
          transition:
            "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease-out, border-color 0.4s ease-out",
          ...frameStyle,
        }}
      >
        <img
          src={src}
          alt={alt ?? ""}
          aria-hidden={alt ? undefined : "true"}
          loading={loading}
          width={width}
          height={height}
          className={imgClassName}
          style={imgStyle}
        />
      </div>
      {!isMobile && (
        <ZoomHint
          pos={hovered && !isOpen ? cursor : null}
          accent={accent}
          accentColor={accentColor}
          projectId={projectId}
        />
      )}
    </>
  )
}
