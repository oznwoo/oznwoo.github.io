import { useEffect, useState } from "react"
import type { ProjectDetail } from "@/data/projects"
import { hexToRgba } from "@/lib/color"
import { renderWithEmphasis } from "@/lib/emphasis"
import { MediaPlaceholder } from "@/components/project-detail/MediaPlaceholder"

const SLIDE_TRANSITION_MS = 750

interface DemoSlideProps {
  detail: ProjectDetail
  accentColor: string
  isMobile: boolean
  isActive: boolean
}

// 시연 영상 — 문제→해결→성과를 다 본 뒤, 실제로 동작하는 제품을 마지막에
// 보여준다. 예전 About "시연 영상" 탭을 맨 끝 독립 슬라이드로 옮긴 것.
// 영상은 슬라이드 전환(트랙 페이드)만 타고 자체 등장 연출은 하지 않는다 —
// 하단 설명 텍스트만 위→제자리로 나타난다.
export function DemoSlide({
  detail,
  accentColor,
  isMobile,
  isActive,
}: DemoSlideProps) {
  const [revealed, setRevealed] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (!isActive) {
      setRevealed(false)
      setHovered(false)
      return
    }
    const timer = setTimeout(() => setRevealed(true), SLIDE_TRANSITION_MS)
    return () => clearTimeout(timer)
  }, [isActive])

  return (
    <div
      className={
        isMobile
          ? "min-h-screen w-full flex items-center justify-center text-center pl-16 pr-6 py-20"
          : "min-h-screen flex items-center justify-center px-8 md:px-20 shrink-0 text-center py-16"
      }
    >
      <div className="max-w-5xl w-full flex flex-col items-center gap-8">
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase"
        >
          Demo
        </span>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="w-full rounded-2xl overflow-hidden border bg-white"
          style={{
            borderColor: hovered
              ? hexToRgba(accentColor, 0.35)
              : "rgba(12,15,26,0.1)",
            boxShadow: hovered
              ? `0 32px 70px -18px ${hexToRgba(accentColor, 0.35)}, 0 10px 26px -10px rgba(12,15,26,0.3)`
              : "0 24px 60px -24px rgba(12,15,26,0.28), 0 6px 16px -8px rgba(12,15,26,0.14)",
            transform: hovered
              ? "translateY(-4px) scale(1.012)"
              : "translateY(0) scale(1)",
            transition:
              "transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s ease-out, border-color 0.45s ease-out",
            aspectRatio: "1830 / 1014",
          }}
        >
          {detail.demoVideo ? (
            <video
              key={detail.demoVideo}
              src={detail.demoVideo}
              poster={detail.demoPoster}
              controls
              preload="none"
              className="w-full h-full block object-contain"
            />
          ) : (
            <MediaPlaceholder
              kind="video"
              accentColor={accentColor}
              className="w-full h-full"
            />
          )}
        </div>
        <div
          style={{
            transform: revealed ? "translateY(0)" : "translateY(-10px)",
            opacity: revealed ? 1 : 0,
            transition:
              "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease-out",
          }}
          className="flex flex-col gap-3 w-full"
        >
          <p
            style={{ fontFamily: "var(--font-body)", lineHeight: 1.35 }}
            className="text-lg sm:text-xl font-semibold text-[#0C0F1A]"
          >
            {detail.demoHeadline}
          </p>
          {detail.demoBody && (
            <p
              style={{ fontFamily: "var(--font-body)" }}
              className="text-sm sm:text-base text-[#0C0F1A]/55 leading-relaxed font-normal"
            >
              {renderWithEmphasis(detail.demoBody)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
