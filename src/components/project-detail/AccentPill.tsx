import { DEFAULT_ACCENT } from "@/data/projects"
import type { ProjectAccent } from "@/lib/color"
import { hexToRgba, mixWithWhite } from "@/lib/color"

interface AccentPillProps {
  label: string
  accent: ProjectAccent | null
  accentColor: string
  projectId: string
}

// 메인 프로젝트 카드 호버 시 나오는 pill과 동일한 디자인(accent.blobs 기반
// radial+linear 그라디언트 배경, 흰 글자 + text-stroke, box-shadow) —
// 상세 페이지 곳곳(Overview 태그, Problem/Solution 카드 태그)에서 공유한다.
// 상세 페이지는 이미 프로젝트 색으로 테마돼 있어 hover의 "활성" 상태를
// 항상 켜둔 형태로 쓴다.
export function AccentPill({
  label,
  accent,
  accentColor,
  projectId,
}: AccentPillProps) {
  const pillAccent = accent ?? DEFAULT_ACCENT
  // CoChat for Business(id "02")는 배경과 마찬가지로 흰색 혼합 비율을 덜 써서
  // 다른 프로젝트보다 톤을 진하게 유지한다
  const pillWhiteMix = projectId === "02" ? 0.2 : 0.5

  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        color: "rgba(255,255,255,0.95)",
        WebkitTextStroke: "0.35px currentColor",
        boxShadow: `0 6px 16px ${hexToRgba(accentColor, 0.18)}, 0 1px 3px rgba(12,15,26,0.08)`,
      }}
      className="relative flex items-center text-[9px] px-2.5 py-1 rounded-full uppercase tracking-[0.08em]"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(ellipse at center, ${hexToRgba(pillAccent.primary, 0.3)} 0%, transparent 72%), linear-gradient(135deg, ${mixWithWhite(pillAccent.blobs[0], pillWhiteMix)}, ${mixWithWhite(pillAccent.blobs[1], pillWhiteMix)}, ${mixWithWhite(pillAccent.blobs[2], pillWhiteMix)})`,
        }}
      />
      <span className="relative">{label}</span>
    </span>
  )
}
