import { useEffect, useRef, useState } from "react"

// Overview 히어로 하단에 까는 장식 막대 차트. 정보 그래픽이 아니라
// 텍스트 뒤에서 존재감을 주는 히어로 애니메이션이라, 우상향 추세를 주지
// 않고 평균 높이는 비슷하되 들쑥날쑥한 실루엣(오디오 이퀄라이저에 가까운
// 느낌)으로 만든다. 순수 CSS hover(각 막대 자체의 :hover)만으로 반응하게
// 해 — 마우스가 지나가는 막대만 즉시 솟아올랐다가, 커서가 빠지면 가라앉는다.
const BAR_COUNT = 48
const STAGGER_STEP_S = 0.012

function buildHeights() {
  return Array.from({ length: BAR_COUNT }, (_, i) => {
    // 서로 다른 주기의 sin/cos 네 개를 겹쳐 추세 없이 완만하게 굴곡지는
    // 실루엣을 만든다 — 평균은 대략 45% 부근에서 유지된다. 고주파(짧은 주기)
    // 성분의 비중을 낮게 둬서 이웃 막대끼리 너무 튀지 않게 한다.
    const noise =
      Math.sin(i * 1.9) * 0.4 +
      Math.cos(i * 0.7) * 0.35 +
      Math.sin(i * 3.3 + 1) * 0.15 +
      Math.cos(i * 5.1 + 2) * 0.1
    const pct = 45 + noise * 20
    return Math.max(15, Math.min(80, pct))
  })
}

export function HeroBarChart({
  color,
  visible,
}: {
  color: string
  // 왼쪽부터 순차적으로 솟아오르며 나타나고(true), 오른쪽부터 순차적으로
  // 가라앉으며 사라진다(false). 처음 나타나기 전(아직 한 번도 true였던
  // 적이 없을 때)에는 애니메이션 없이 그냥 접힌 상태로 대기한다.
  visible: boolean
}) {
  // 높이 패턴은 마운트 시 한 번만 뽑고, visible이 토글돼도 다시 뽑지 않는다
  // — 재계산하면 사라졌다 나타날 때마다 실루엣이 바뀌어 버린다.
  const heightsRef = useRef<number[] | null>(null)
  if (!heightsRef.current) heightsRef.current = buildHeights()
  const heights = heightsRef.current

  const [hasEntered, setHasEntered] = useState(visible)
  useEffect(() => {
    if (visible) setHasEntered(true)
  }, [visible])

  return (
    <div
      aria-hidden="true"
      className="flex items-end w-full h-full gap-[3px] sm:gap-1"
    >
      {heights.map((h, i) => {
        const style: React.CSSProperties = {
          height: `${h}%`,
          background: color,
          opacity: 0.22,
        }
        if (visible) {
          // fill-mode은 backwards만 쓴다 — both/forwards로 애니메이션의
          // 최종 transform이 계속 "점유"돼 있으면 애니메이션이 끝난 뒤에도
          // hover:scale-y가 이를 못 이기고 씹힌다(애니메이션 캐스케이드가
          // 일반 클래스보다 우선순위가 높음). backwards만 쓰면 delay
          // 동안엔 0% 상태(scaleY 0)를 보여주다가, 끝난 뒤엔 transform
          // 소유권을 완전히 내려놓아 이후 hover transition이 정상 동작한다.
          style.animation = `bar-rise 0.6s cubic-bezier(0.16,1,0.3,1) ${i * STAGGER_STEP_S}s backwards`
        } else if (hasEntered) {
          // 나타날 때와 반대로 오른쪽 막대부터 먼저 가라앉기 시작하도록
          // delay를 인덱스 역순으로 준다. reverse + forwards로 재생해
          // scaleY(1)에서 시작해 scaleY(0)에서 멈춰있게 한다.
          style.animation = `bar-rise 0.5s cubic-bezier(0.4,0,1,1) ${(BAR_COUNT - 1 - i) * STAGGER_STEP_S}s reverse forwards`
        } else {
          style.transform = "scaleY(0)"
        }
        return (
          <div
            key={i}
            className="hero-bar flex-1 rounded-t-sm origin-bottom"
            style={style}
          />
        )
      })}
    </div>
  )
}
