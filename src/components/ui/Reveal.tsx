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
// 등장: translateY(-22px) → 0 + fade in.
// 퇴장: 움직이지 않고 그 자리에서 opacity만 사라진다(위로 빨려 올라가면
// 어색해서). 퇴장 페이드가 끝나 보이지 않게 되면 transform을 다시 위로
// 되돌려, 다음 등장이 또 미끄러져 내려오게 한다.
const EXIT_FADE_MS = 500

export function Reveal({ show, children, className }: RevealProps) {
  const [exiting, setExiting] = useState(false)
  const wasShown = useRef(show)

  useEffect(() => {
    if (wasShown.current && !show) {
      // 보이던 것이 숨는다 → 퇴장: 제자리 페이드아웃
      setExiting(true)
      const timer = setTimeout(() => setExiting(false), EXIT_FADE_MS + 20)
      wasShown.current = show
      return () => clearTimeout(timer)
    }
    if (show) setExiting(false)
    wasShown.current = show
  }, [show])

  return (
    <div
      className={className}
      style={{
        // 퇴장 중에는(그리고 당연히 보이는 동안에는) 제자리 유지,
        // 등장 대기 상태에서만 위로 올려둔다.
        transform: show || exiting ? "translateY(0)" : "translateY(-22px)",
        opacity: show ? 1 : 0,
        transition: `transform 0.7s cubic-bezier(0.16,1,0.3,1), opacity ${EXIT_FADE_MS}ms ease-out`,
      }}
    >
      {children}
    </div>
  )
}
