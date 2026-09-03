import type { ReactNode } from "react"

interface RevealProps {
  // useSlideReveal의 반환값 — true가 되면 콘텐츠가 위에서 아래로 나타난다
  show: boolean
  children: ReactNode
  className?: string
}

// 페이지 진입 연출 래퍼 — 콘텐츠가 최종 자리를 그대로 차지한 채(레이아웃
// 밀림 없음) translateY + opacity로 위에서 아래로 미끄러지며 나타난다.
// 프로젝트 상세 RevealCard는 grid-rows로 높이까지 펼쳐져 이동량이 크고
// 느긋해 보이는데, 메인 페이지는 높이 접기를 뺐으므로 이동 거리를 키우고
// 지속시간을 늘려 상세 페이지와 비슷한 속도감으로 맞춘다.
export function Reveal({ show, children, className }: RevealProps) {
  return (
    <div
      className={className}
      style={{
        transform: show ? "translateY(0)" : "translateY(-22px)",
        opacity: show ? 1 : 0,
        transition:
          "transform 0.7s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease-out",
      }}
    >
      {children}
    </div>
  )
}
