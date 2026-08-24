import { useState } from "react"
import type { ProjectDetail } from "@/data/projects"
import { hexToRgba } from "@/lib/color"

interface StackSlideProps {
  tech: ProjectDetail["tech"]
  stackDiagram?: string
  accentColor: string
  isMobile: boolean
}

// 기술 — stackDiagram이 있으면(Fintag) 카테고리 텍스트 목록 대신 아키텍처
// 다이어그램 이미지 하나만, 다른 이미지 카드와 동일한 border/hover 컨벤션으로
// 보여준다.
export function StackSlide({ tech, stackDiagram, accentColor, isMobile }: StackSlideProps) {
  const [imgHovered, setImgHovered] = useState(false)
  const wrapClass = isMobile
    ? "min-h-screen w-full flex items-center justify-center px-6 pl-16 py-20"
    : "h-screen flex items-center justify-center px-8 md:px-20 shrink-0"

  if (stackDiagram) {
    return (
      <div className={wrapClass}>
        <div className="max-w-4xl w-full">
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase mb-10 block"
          >
            Stack
          </span>
          <div
            onMouseEnter={() => setImgHovered(true)}
            onMouseLeave={() => setImgHovered(false)}
            className="rounded-2xl overflow-hidden border cursor-default"
            style={{
              borderColor: imgHovered
                ? hexToRgba(accentColor, 0.35)
                : "rgba(12,15,26,0.1)",
              boxShadow: imgHovered
                ? `0 20px 45px -14px ${hexToRgba(accentColor, 0.35)}, 0 8px 18px -8px rgba(12,15,26,0.28)`
                : "0 14px 34px -18px rgba(12,15,26,0.24), 0 4px 10px -6px rgba(12,15,26,0.12)",
              transform: imgHovered
                ? "translateY(-3px) scale(1.008)"
                : "translateY(0) scale(1)",
              transition:
                "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease-out, border-color 0.4s ease-out",
            }}
          >
            <img
              src={stackDiagram}
              alt=""
              aria-hidden="true"
              loading="lazy"
              width={1672}
              height={941}
              className="w-full h-auto block"
            />
          </div>
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
        <a
          href="https://github.com/oznwoo"
          target="_blank"
          rel="noreferrer"
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/40 hover:text-[#0C0F1A] transition-colors uppercase tracking-[0.04em] border-b border-[#0C0F1A]/15 pb-0.5"
        >
          GitHub →
        </a>
      </div>
    </div>
  )
}
