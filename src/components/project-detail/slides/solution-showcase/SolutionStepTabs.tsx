import { DEFAULT_ACCENT } from "@/data/projects"
import type { ProjectAccent } from "@/lib/color"
import { hexToRgba, softPillGradient } from "@/lib/color"

interface SolutionStepTabsProps {
  labels: string[]
  activeIndex: number
  onSelect: (index: number) => void
  // 슬라이드 등장 연출 신호 — 등장할 땐 아래에서 위로, 떠날 땐 위에서 아래로.
  revealed: boolean
  accent: ProjectAccent | null
  accentColor: string
  projectId: string
  isMobile: boolean
}

// SOLUTION 스텝 전환 — 왼쪽 eyebrow + 오른쪽 세그먼트 탭을 한 줄에 둔다.
// 선택된 탭 배경은 카드 태그(AccentPill) 계열 pill 그라디언트를 쓰되, 분홍빛
// 페이지 배경에서도 또렷하게 보이도록 문제·해결 라벨보다 흰색을 덜 섞는다.
export function SolutionStepTabs({
  labels,
  activeIndex,
  onSelect,
  revealed,
  accent,
  accentColor,
  projectId,
  isMobile,
}: SolutionStepTabsProps) {
  const activeTabBackground = softPillGradient(
    accent ?? DEFAULT_ACCENT,
    projectId === "02" ? 0.12 : 0.32,
  )

  return (
    <div
      className={
        isMobile
          ? "mb-3 flex flex-col gap-2"
          : "mb-3 flex items-center justify-between gap-4"
      }
    >
      <span
        style={{ fontFamily: "var(--font-mono)" }}
        className="shrink-0 text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase"
      >
        Solution
      </span>
      <div
        className="inline-flex max-w-full flex-wrap items-center justify-end gap-y-1 rounded-lg p-1"
        style={{
          background: "rgba(12,15,26,0.045)",
          transform: revealed ? "translateY(0)" : "translateY(12px)",
          opacity: revealed ? 1 : 0,
          transition:
            "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease-out",
        }}
      >
        {labels.map((label, i) => {
          const active = i === activeIndex
          return (
            <button
              key={label}
              onClick={() => onSelect(i)}
              style={{
                fontFamily: "var(--font-body)",
                // 비활성은 inline background를 비워 hover:bg 클래스(회색)가
                // 먹히게 한다 — inline style은 클래스보다 우선하기 때문.
                background: active ? activeTabBackground : undefined,
                color: active ? "rgba(255,255,255,0.98)" : "rgba(12,15,26,0.5)",
                WebkitTextStroke: active
                  ? "0.3px rgba(255,255,255,0.98)"
                  : undefined,
                boxShadow: active
                  ? `0 6px 16px -8px ${hexToRgba(accentColor, 0.45)}`
                  : "none",
                textShadow: active ? "0 1px 2px rgba(12,15,26,0.2)" : "none",
              }}
              className={
                "cursor-pointer whitespace-nowrap rounded-[7px] px-3 py-1 text-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 " +
                (active
                  ? "font-bold hover:brightness-[1.04]"
                  : "font-medium hover:bg-black/10 hover:text-[#0C0F1A]/80")
              }
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
