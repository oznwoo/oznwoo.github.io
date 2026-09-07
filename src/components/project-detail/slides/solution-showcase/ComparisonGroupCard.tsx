import { renderWithEmphasis } from "@/lib/emphasis"
import { hexToRgba, mixWithWhite } from "@/lib/color"
import type { ComparisonEntry } from "@/data/projects/types"

interface ComparisonGroupCardProps {
  label: string
  items: ComparisonEntry[]
  accentColor: string
}

// AS-IS 항목 전체(또는 TO-BE 항목 전체)를 한 카드에 묶어 보여준다 — "문제"/
// "해결" 라벨은 카드 바깥이 아니라 카드 맨 위(구분선 포함)에 넣고, 항목이
// 여러 개면 카드 내부를 구분선으로만 나눈다. 좌우 여백은 상하 여백과 비슷한
// 크기로 맞춰 균형을 준다.
export function ComparisonGroupCard({
  label,
  items,
  accentColor,
}: ComparisonGroupCardProps) {
  return (
    <div
      className="flex-1 rounded-2xl backdrop-blur-sm overflow-hidden"
      style={{
        background: hexToRgba(mixWithWhite(accentColor, 0.93), 0.62),
        border: "1px solid rgba(12,15,26,0.06)",
      }}
    >
      <div
        className="px-3 pt-2.5 pb-2 text-center"
        style={{ borderBottom: "1px solid rgba(12,15,26,0.08)" }}
      >
        <span
          style={{ fontFamily: "var(--font-mono)", color: accentColor }}
          className="text-[11px] font-semibold tracking-[0.08em] uppercase"
        >
          {label}
        </span>
      </div>
      {items.map((item, i) => (
        <div key={i}>
          {i > 0 && (
            <div
              aria-hidden="true"
              className="h-px mx-3"
              style={{ background: "rgba(12,15,26,0.1)" }}
            />
          )}
          <div className="px-3 py-3 flex flex-col items-center text-center">
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
        </div>
      ))}
    </div>
  )
}
