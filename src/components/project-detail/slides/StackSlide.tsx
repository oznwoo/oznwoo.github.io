import type { ProjectDetail } from "@/data/projects"
import type { ProjectAccent } from "@/lib/color"
import { ZoomableImage } from "../lightbox/ZoomableImage"

interface StackSlideProps {
  tech: ProjectDetail["tech"]
  stackDiagram?: string
  accent: ProjectAccent | null
  accentColor: string
  projectId: string
  isMobile: boolean
}

// 기술 — stackDiagram이 있으면(Fintag) 카테고리 텍스트 목록 대신 아키텍처
// 다이어그램 이미지 하나만, 다른 이미지 카드와 동일한 border/hover 컨벤션으로
// 보여준다(클릭하면 확대).
export function StackSlide({
  tech,
  stackDiagram,
  accent,
  accentColor,
  projectId,
  isMobile,
}: StackSlideProps) {
  const wrapClass = isMobile
    ? "min-h-screen w-full flex items-center justify-center px-6 pl-16 py-20"
    : "min-h-screen flex items-center justify-center px-8 md:px-20 shrink-0 py-16"

  if (stackDiagram) {
    return (
      <div className={wrapClass}>
        <div className="max-w-5xl w-full">
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase mb-10 block"
          >
            Stack
          </span>
          <ZoomableImage
            src={stackDiagram}
            alt="시스템 아키텍처 다이어그램"
            accent={accent}
            accentColor={accentColor}
            projectId={projectId}
            isMobile={isMobile}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={wrapClass}>
      <div className="max-w-2xl w-full">
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase mb-12 block"
        >
          Stack
        </span>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-12">
          {tech.map((group) => (
            <div key={group.category}>
              <div
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs text-[#4F6EF7] uppercase tracking-[0.04em] mb-4"
              >
                {group.category}
              </div>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    style={{ fontFamily: "var(--font-body)" }}
                    className="text-sm text-[#0C0F1A]/55 font-light"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
