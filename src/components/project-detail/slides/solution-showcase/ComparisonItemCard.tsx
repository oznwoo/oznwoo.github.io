import { renderWithEmphasis } from "@/lib/emphasis"
import { hexToRgba, mixWithWhite } from "@/lib/color"
import type { ComparisonEntry } from "@/data/projects/types"

interface ComparisonItemCardProps {
  entry: ComparisonEntry
  accentColor: string
}

// AS-IS(또는 TO-BE) 항목 하나 = 카드 하나. 구분선 없이 카드를 떼어내
// 영역을 구분하고, 같은 행의 문제↔해결 카드는 화살표로 잇는다. 카드 안에서는
// 타이틀과 내용을 divider로 나눈다.
export function ComparisonItemCard({
  entry,
  accentColor,
}: ComparisonItemCardProps) {
  return (
    <div
      className="flex-1 min-h-[130px] rounded-2xl backdrop-blur-sm px-4 py-3.5 flex flex-col items-center justify-center text-center"
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
        {entry.title}
      </p>
      <div
        aria-hidden="true"
        className="my-2.5 h-px w-full"
        style={{ background: "rgba(12,15,26,0.1)" }}
      />
      <ul className="flex flex-col items-center gap-1.5">
        {entry.detail.map((line, j) => (
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
            <span>{renderWithEmphasis(line)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
