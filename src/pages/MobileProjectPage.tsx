import { Page } from "@/components/layout/Page"
import { PROJECTS, PROJECT_ACCENT } from "@/data/projects"
import { hexToRgba } from "@/lib/color"

// 모바일에서는 4개 카드를 한 화면에 욱여넣는 대신, 프로젝트마다 화면 하나를
// 통째로 준다 — 가로 스와이프/화살표로 넘기는 페이지 하나하나가 프로젝트 한 개.
export function MobileProjectPage({
  project,
  index,
  total,
  onOpen,
}: {
  project: typeof PROJECTS[number]
  index: number
  total: number
  onOpen: (id: string) => void
}) {
  const accent = PROJECT_ACCENT[project.id] ?? null
  return (
    <Page>
      <button
        onClick={() => onOpen(project.id)}
        className="w-full text-left flex flex-col gap-5"
      >
        <div className="flex items-center justify-between">
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-xs text-[#0C0F1A]/45 tracking-[0.04em] uppercase"
          >
            Projects · {String(index + 1).padStart(2, "0")}/
            {String(total).padStart(2, "0")}
          </span>
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-xs text-[#0C0F1A]/45"
          >
            {project.year}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "var(--font-mono)",
                background: accent
                  ? hexToRgba(accent.primary, 0.08)
                  : "rgba(12,15,26,0.05)",
                color: accent
                  ? hexToRgba(accent.primary, 0.85)
                  : "rgba(12,15,26,0.55)",
              }}
              className="text-[9px] px-2.5 py-1 rounded-full uppercase tracking-[0.08em]"
            >
              {t}
            </span>
          ))}
        </div>
        <div>
          <h2
            style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
            className="text-2xl text-[#0C0F1A] leading-snug"
          >
            {project.title}
          </h2>
          <p
            style={{ fontFamily: "var(--font-body)" }}
            className="text-sm text-[#0C0F1A]/55 font-normal mt-1"
          >
            {project.subtitle}
          </p>
        </div>
        <p
          style={{ fontFamily: "var(--font-body)" }}
          className="text-sm text-[#0C0F1A]/70 leading-relaxed font-normal"
        >
          {project.description}
        </p>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            color: accent?.primary ?? "#4F6EF7",
          }}
          className="text-xs uppercase tracking-[0.04em]"
        >
          자세히 보기 →
        </span>
      </button>
    </Page>
  )
}
