import { hexToRgba } from "@/lib/color"

interface ComparisonLabelPillProps {
  label: string
  // 선택된 세그먼트 탭과 같은 accent 그라디언트.
  background: string
  accentColor: string
}

// "문제"/"해결" 라벨 pill — 스타일을 선택된 세그먼트 탭 버튼과 똑같이 맞춘다
// (같은 폰트·크기·그림자). 폭은 텍스트에 맞춰 가운데 정렬 래퍼 안에서
// 자연 축소된다.
export function ComparisonLabelPill({
  label,
  background,
  accentColor,
}: ComparisonLabelPillProps) {
  return (
    <div
      style={{
        fontFamily: "var(--font-body)",
        background,
        color: "rgba(255,255,255,0.98)",
        boxShadow: `0 6px 14px -6px ${hexToRgba(accentColor, 0.5)}`,
        textShadow: "0 1px 2px rgba(12,15,26,0.25)",
      }}
      className="rounded-lg px-3 py-1 text-xs font-medium"
    >
      {label}
    </div>
  )
}
