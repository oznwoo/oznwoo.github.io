import { renderWithEmphasis } from "@/lib/emphasis"
import { hexToRgba, mixWithWhite } from "@/lib/color"
import type { ComparisonEntry } from "@/data/projects/types"

interface ComparisonGroupCardProps {
  label: string
  items: ComparisonEntry[]
  accentColor: string
  // 라벨 배경 — 선택된 세그먼트 탭과 같은 accent 그라디언트를 받는다.
  headerBackground: string
}

// AS-IS(또는 TO-BE) 묶음 하나 — 선택된 탭과 같은 accent 그라디언트 라벨
// 아래에, 항목을 각각 독립된 카드로 "떼어내서" 세로로 쌓아 영역을 구분한다.
export function ComparisonGroupCard({
  label,
  items,
  accentColor,
  headerBackground,
}: ComparisonGroupCardProps) {
  return (
    <div className="flex-1 flex flex-col gap-2">
      <div
        className="shrink-0 rounded-2xl px-3 py-2 text-center"
        style={{
          background: headerBackground,
          boxShadow: "0 8px 20px -12px rgba(12,15,26,0.25)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            color: "rgba(255,255,255,0.98)",
            textShadow: "0 1px 2px rgba(12,15,26,0.25)",
          }}
          className="text-sm"
        >
          {label}
        </span>
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          className="flex-1 rounded-2xl backdrop-blur-sm px-3.5 py-3 flex flex-col items-center justify-center text-center"
          style={{
            background: hexToRgba(mixWithWhite(accentColor, 0.93), 0.62),
            border: `1px solid ${hexToRgba(accentColor, 0.15)}`,
            boxShadow: "0 12px 32px -14px rgba(12,15,26,0.2)",
          }}
        >
          <p
            style={{ fontFamily: "var(--font-body)" }}
            className="text-base font-semibold text-[#0C0F1A] leading-snug"
          >
            {item.title}
          </p>
          <ul className="flex flex-col items-center gap-1 mt-2">
            {item.detail.map((line, j) => (
              <li
                key={j}
                style={{ fontFamily: "var(--font-body)" }}
                className="text-xs text-[#0C0F1A]/60 leading-relaxed font-normal flex items-center gap-1.5"
              >
                <span
                  aria-hidden="true"
                  className="w-1 h-1 rounded-full shrink-0"
                  style={{ background: accentColor }}
                />
                {renderWithEmphasis(line)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
