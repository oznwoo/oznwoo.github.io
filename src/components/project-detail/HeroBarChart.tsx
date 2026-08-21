// Overview 히어로 하단에 까는 장식 막대 차트. 정보 그래픽이 아니라
// 텍스트 뒤에서 존재감을 주는 히어로 애니메이션이라, 정확한 수치 대신
// "현금흐름이 우상향한다"는 실루엣만 우상향 노이즈로 만든다. 순수 CSS
// hover(각 막대 자체의 :hover)만으로 반응하게 해 — 마우스가 지나가는
// 막대만 즉시 솟아올랐다가, 커서가 빠지면 다시 가라앉는다.
const BAR_COUNT = 48

function buildHeights() {
  return Array.from({ length: BAR_COUNT }, (_, i) => {
    const t = i / (BAR_COUNT - 1)
    const trend = Math.pow(t, 1.4)
    const noise = Math.sin(i * 1.9) * 0.5 + Math.cos(i * 0.7) * 0.5
    const pct = 14 + trend * 62 + noise * 6
    return Math.max(8, Math.min(95, pct))
  })
}

export function HeroBarChart({ color }: { color: string }) {
  const heights = buildHeights()
  return (
    <div
      aria-hidden="true"
      className="flex items-end w-full h-full gap-[3px] sm:gap-1"
    >
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm origin-bottom transition-transform duration-300 ease-out hover:scale-y-[1.35]"
          style={{
            height: `${h}%`,
            background: color,
            opacity: 0.22,
            // fill-mode은 backwards만 쓴다 — both/forwards로 애니메이션의
            // 최종 transform이 계속 "점유"돼 있으면 애니메이션이 끝난 뒤에도
            // hover:scale-y가 이를 못 이기고 씹힌다(애니메이션 캐스케이드가
            // 일반 클래스보다 우선순위가 높음). backwards만 쓰면 delay
            // 동안엔 0% 상태(scaleY 0)를 보여주다가, 끝난 뒤엔 transform
            // 소유권을 완전히 내려놓아 이후 hover transition이 정상 동작한다.
            animation: `bar-rise 0.6s cubic-bezier(0.16,1,0.3,1) backwards`,
            animationDelay: `${i * 0.012}s`,
          }}
        />
      ))}
    </div>
  )
}
