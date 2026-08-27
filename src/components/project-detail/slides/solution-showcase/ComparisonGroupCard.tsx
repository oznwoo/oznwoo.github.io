import { renderWithEmphasis } from "@/lib/emphasis"
import { hexToRgba, mixWithWhite } from "@/lib/color"
import type { ComparisonEntry } from "@/data/projects/types"

interface ComparisonGroupCardProps {
  label: string
  items: ComparisonEntry[]
  accentColor: string
}

// AS-IS 항목 전체(또는 TO-BE 항목 전체)를 한 카드에 묶어 보여준다 — 항목이
// 여러 개면 카드 내부를 구분선으로만 나누고, 항목 사이에 별도 카드 배경·
// 테두리를 반복하지 않는다. 카드 위에는 "문제"/"해결" 같은 짧은 라벨을 달아
// AS-IS/TO-BE 구도를 한눈에 알아보게 한다
export function ComparisonGroupCard({
  label,
  items,
  accentColor,
}: ComparisonGroupCardProps) {
  return (
    <div className="flex-1 flex flex-col gap-2">
      <span
        style={{ fontFamily: "var(--font-mono)", color: accentColor }}
        className="text-xs font-semibold tracking-[0.08em] uppercase text-center"
      >
        {label}
      </span>
      <div
        className="rounded-2xl backdrop-blur-sm overflow-hidden"
        style={{
          background: hexToRgba(mixWithWhite(accentColor, 0.93), 0.62),
          border: "1px solid rgba(12,15,26,0.06)",
        }}
      >
        {items.map((item, i) => (
          <div key={i}>
            {i > 0 && (
              <div
                aria-hidden="true"
                className="h-px mx-4"
                style={{ background: "rgba(12,15,26,0.1)" }}
              />
            )}
            <div className="p-4 flex flex-col items-center text-center">
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
    </div>
  )
}
