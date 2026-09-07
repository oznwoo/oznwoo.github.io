import { DEFAULT_ACCENT } from "@/data/projects"
import type { ProjectAccent } from "@/lib/color"
import { hexToRgba, softPillGradient } from "@/lib/color"

interface ComparisonLabelPillProps {
  label: string
  accent: ProjectAccent | null
  accentColor: string
  projectId: string
}

// "문제"/"해결" 라벨 — 카드 태그(AccentPill)와 같은 은은한 그라디언트 배경에
// 흰 글씨. 단 태그보다 크고 굵게 잡아 섹션 라벨로 읽히게 한다.
export function ComparisonLabelPill({
  label,
  accent,
  accentColor,
  projectId,
}: ComparisonLabelPillProps) {
  const pillAccent = accent ?? DEFAULT_ACCENT
  // CoChat for Business(id "02")는 배경처럼 흰색 혼합을 덜 써서 톤을 진하게 둔다
  const pillWhiteMix = projectId === "02" ? 0.2 : 0.5

  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        color: "rgba(255,255,255,0.98)",
        WebkitTextStroke: "0.4px currentColor",
        background: softPillGradient(pillAccent, pillWhiteMix),
        boxShadow: `0 6px 16px ${hexToRgba(accentColor, 0.2)}, 0 1px 3px rgba(12,15,26,0.1)`,
      }}
      className="flex items-center rounded-full px-4 py-1.5 text-base font-bold tracking-[0.04em]"
    >
      {label}
    </span>
  )
}
