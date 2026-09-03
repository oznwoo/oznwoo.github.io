import { useEffect } from "react"

// 프로젝트 상세에서 좌우 화살표 버튼(TabArrowButton)으로 스텝을 넘기는
// 슬라이드(ABOUT·SOLUTION 쇼케이스)를 키보드 ←/→로도 이동하게 한다.
// 세로 슬라이드 전환은 ProjectDetailView가 ↑/↓로 처리하므로 여기서는
// ←/→만 다룬다. enabled가 false면 리스너를 아예 걸지 않아, 화면에 보이지
// 않는 슬라이드의 스텝이 바뀌는 일을 막는다.
export function useHorizontalStepKeys({
  enabled,
  onPrev,
  onNext,
}: {
  enabled: boolean
  onPrev: () => void
  onNext: () => void
}): void {
  useEffect(() => {
    if (!enabled) return
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        onPrev()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        onNext()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [enabled, onPrev, onNext])
}
