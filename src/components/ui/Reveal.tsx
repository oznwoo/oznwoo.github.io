import type { ReactNode } from "react"

interface RevealProps {
  // useSlideReveal의 반환값 — true가 되면 콘텐츠가 위에서 아래로 나타난다
  show: boolean
  children: ReactNode
  className?: string
}

// 페이지 진입 연출 래퍼 — 콘텐츠가 최종 자리를 그대로 차지한 채(레이아웃
// 밀림 없음) 위에서 아래로 미끄러지며 나타난다. 프로젝트 상세 RevealCard는
// grid-template-rows(0fr→1fr)로 아래 요소를 밀며 펼쳐지지만, 세로 중앙정렬인
// 메인 페이지에서 높이를 접으면 블록 전체가 흔들리므로, 같은 "위에서부터
// 훑어내리며 열리는" 느낌을 레이아웃 영향이 없는 clip-path로 재현한다.
// 지속시간·이징은 RevealCard와 동일하게 맞춘다.
export function Reveal({ show, children, className }: RevealProps) {
  return (
    <div
      className={className}
      style={{
        transform: show ? "translateY(0)" : "translateY(-10px)",
        opacity: show ? 1 : 0,
        clipPath: show ? "inset(-15% -15% -15% -15%)" : "inset(0 0 100% 0)",
        transition:
          "transform 0.6s cubic-bezier(0.16,1,0.3,1), opacity 0.45s ease-out, clip-path 0.6s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {children}
    </div>
  )
}
