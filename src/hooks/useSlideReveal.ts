import { useEffect, useState } from "react"

// 메인 포트폴리오의 세로 페이지 전환(App.tsx, 0.75s)이 끝난 뒤에야 콘텐츠가
// 위에서 아래로 미끄러지며 나타난다. 페이지를 떠나면 다시 숨겨서, 재진입할
// 때마다 연출이 다시 재생된다. (프로젝트 상세 슬라이드의 RevealCard와 동일한 개념)
const PAGE_TRANSITION_MS = 750

export function useSlideReveal(
  isActive: boolean,
  delayMs: number = PAGE_TRANSITION_MS,
): boolean {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!isActive) {
      setRevealed(false)
      return
    }
    const timer = setTimeout(() => setRevealed(true), delayMs)
    return () => clearTimeout(timer)
  }, [isActive, delayMs])

  return revealed
}
