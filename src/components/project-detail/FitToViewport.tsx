import { useEffect, useRef, useState, type ReactNode } from "react"

// 슬라이드 내용이 창 안쪽 높이(window.innerHeight — 브라우저 탭·북마크바가
// 켜져 있으면 그만큼 줄어든 값)보다 크면 transform: scale()로 딱 맞게 줄여
// 위아래가 잘리지 않게 한다. 내용이 화면에 들어가면 배율은 1이라 아무 변화가
// 없다. 세로 슬라이드 트랙의 translateY 계산이 깨지지 않도록 바깥 래퍼는
// 항상 정확히 100vh를 유지한다.

// 이보다 더 줄여야 하는 상황이면 글자가 읽기 어려워지므로, 축소 대신 잘림을
// 허용하는 하한.
const MIN_SCALE = 0.6

// 슬라이드 본문은 대부분 min-h-screen이라 scrollHeight가 창 높이와 사실상
// 같게 나온다. 소수점·서브픽셀 오차로 매 슬라이드가 미세하게 축소되지 않도록,
// 이 값보다 더 넘칠 때만 "넘쳤다"고 본다.
const OVERFLOW_TOLERANCE_PX = 2

// 실제로 축소할 때만, 반올림으로 1~2px이 삐져나와 잘리는 걸 막는 여유.
const EDGE_SLACK_PX = 4

interface FitToViewportProps {
  children: ReactNode
}

export function FitToViewport({ children }: FitToViewportProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    const measure = () => {
      // scrollHeight는 transform의 영향을 받지 않는 원본 레이아웃 높이라,
      // 배율이 걸린 뒤 다시 재도 값이 흔들리지 않는다(피드백 루프 없음).
      const contentHeight = content.scrollHeight
      const viewport = window.innerHeight
      const overflowing = contentHeight > viewport + OVERFLOW_TOLERANCE_PX
      const next = overflowing
        ? Math.max(MIN_SCALE, (viewport - EDGE_SLACK_PX) / contentHeight)
        : 1
      setScale((prev) => (Math.abs(prev - next) < 0.001 ? prev : next))
    }

    measure()
    // 웹폰트·이미지가 늦게 잡혀 본문 높이가 바뀌는 경우를 한 번 더 보정한다.
    const settle = window.setTimeout(measure, 300)
    // 이미지 로딩·탭 전환 등으로 본문 높이가 바뀌면 다시 잰다.
    const observer = new ResizeObserver(measure)
    observer.observe(content)
    window.addEventListener("resize", measure)
    return () => {
      window.clearTimeout(settle)
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [])

  return (
    <div className="h-screen w-full shrink-0 overflow-hidden flex items-center justify-center">
      <div
        ref={contentRef}
        className="w-full"
        style={
          scale === 1
            ? undefined
            : { transform: `scale(${scale})`, transformOrigin: "center center" }
        }
      >
        {children}
      </div>
    </div>
  )
}
