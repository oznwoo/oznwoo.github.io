import type { ReactNode } from "react"

interface RevealProps {
  // useSlideReveal의 반환값 — true가 되면 콘텐츠가 위에서 아래로 나타난다
  show: boolean
  children: ReactNode
  className?: string
}

// 페이지 진입 연출 래퍼 — 콘텐츠가 최종 자리를 그대로 차지한 채(레이아웃
// 밀림 없음) translateY + opacity로 위에서 아래로 미끄러지며 나타난다.
// 프로젝트 상세 RevealCard의 모션 언어를 페이지 단위로 재사용한다.
export function Reveal({ show, children, className }: RevealProps) {
  return (
    <div
      className={className}
      style={{
        transform: show ? "translateY(0)" : "translateY(-10px)",
        opacity: show ? 1 : 0,
        transition:
          "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease-out",
      }}
    >
      {children}
    </div>
  )
}
