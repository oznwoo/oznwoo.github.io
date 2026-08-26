// PROBLEM/SOLUTION 카드, ABOUT 본문, SOLUTION 비교 카드가 공유하는 규칙 —
// 텍스트 안의 **강조** 구간만 굵게 렌더링해, 옅은 본문 톤 안에서도 핵심
// 단어가 눈에 들어오게 한다.
export function renderWithEmphasis(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-[#0C0F1A]">
        {part}
      </strong>
    ) : (
      part
    ),
  )
}
