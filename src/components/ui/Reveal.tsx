import { useEffect, useRef, useState, type ReactNode } from "react"

interface RevealProps {
  // useSlideReveal의 반환값 — true가 되면 콘텐츠가 위에서 아래로 나타난다
  show: boolean
  children: ReactNode
  className?: string
}

// 페이지 진입 연출 래퍼 — 콘텐츠가 최종 자리를 그대로 차지한 채(레이아웃
// 밀림 없음) 위에서 아래로 미끄러지며 나타난다. 프로젝트 상세 RevealCard의
// 모션 언어를 페이지 단위로 재사용한다.
//
// 등장: translateY(-22px), opacity 0 → translateY(0), opacity 1.
// 퇴장: 스스로 움직이거나 사라지지 않는다 — 슬라이드 전환 시 페이지 전체
// 페이드가 고정 요소·콘텐츠를 같은 속도로 함께 지우므로, 여기서 또 페이드하면
// 요소마다 사라지는 속도가 달라 보인다. 페이지 페이드가 끝나 보이지 않게 된
// 뒤에야(EXIT_HOLD_MS) 다음 등장을 위해 위로·투명으로 되돌린다.
const EXIT_HOLD_MS = 850

export function Reveal({ show, children, className }: RevealProps) {
  const [exiting, setExiting] = useState(false)
  const wasShown = useRef(show)

  useEffect(() => {
    if (wasShown.current && !show) {
      // 보이던 것이 숨는다 → 퇴장: 페이지 페이드가 끝날 때까지 제자리 유지
      setExiting(true)
      const timer = setTimeout(() => setExiting(false), EXIT_HOLD_MS)
      wasShown.current = show
      return () => clearTimeout(timer)
    }
    if (show) setExiting(false)
    wasShown.current = show
  }, [show])

  // 등장 대기 상태에서만 위로 올려 두고 투명하게. 보이는 동안과 퇴장 중에는
  // 제자리·불투명을 유지해 페이지 페이드에 맡긴다.
  const waiting = !show && !exiting

  return (
    <div
      className={className}
      style={{
        transform: waiting ? "translateY(-22px)" : "translateY(0)",
        opacity: waiting ? 0 : 1,
        transition:
          "transform 0.7s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease-out",
      }}
    >
      {children}
    </div>
  )
}
