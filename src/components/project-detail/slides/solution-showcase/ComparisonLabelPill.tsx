interface ComparisonLabelPillProps {
  label: string
  // 선택된 세그먼트 탭과 같은 accent 그라디언트.
  background: string
}

// "문제"/"해결" 라벨 pill — 폭은 텍스트에 맞춘다(가운데 정렬 래퍼 안에서
// 자연 축소). 섹션 제목과 같은 display 폰트.
export function ComparisonLabelPill({
  label,
  background,
}: ComparisonLabelPillProps) {
  return (
    <div
      className="rounded-xl px-4 py-1.5"
      style={{
        background,
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
  )
}
