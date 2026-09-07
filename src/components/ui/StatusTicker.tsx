import { useEffect, useState } from "react"

const STATUS_MESSAGES = [
  "적극적으로 기회를 찾고 있습니다",
  "새로운 문제를 풀고 싶습니다",
  "AI로 세상을 바꾸는 중입니다",
  "오늘도 코드를 작성하고 있습니다",
  "좋은 팀을 만나고 싶습니다",
  "사용자의 문제를 해결하고 싶습니다",
]

// active=false 동안(슬라이드 등장 연출 중)에는 자체 위로-올라가는 순환을
// 멈추고, 등장이 끝난 뒤(active=true)부터 메시지를 바꾼다.
export function StatusTicker({ active = true }: { active?: boolean }) {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<"visible" | "exit" | "enter">("visible")

  useEffect(() => {
    if (!active) {
      setPhase("visible")
      return
    }
    const id = setInterval(() => {
      setPhase("exit")
      setTimeout(() => {
        setIndex((i) => (i + 1) % STATUS_MESSAGES.length)
        setPhase("enter")
        setTimeout(() => setPhase("visible"), 20)
      }, 300)
    }, 2800)
    return () => clearInterval(id)
  }, [active])

  const transform =
    phase === "exit"
      ? "translateY(-8px)"
      : phase === "enter"
        ? "translateY(8px)"
        : "translateY(0)"

  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        display: "inline-block",
        transform,
        opacity: phase === "visible" ? 1 : 0,
        transition:
          phase === "enter" ? "none" : "transform 0.3s ease, opacity 0.3s ease",
        fontSize: "0.75rem",
        color: "rgba(12,15,26,0.62)",
      }}
    >
      {STATUS_MESSAGES[index]}
    </span>
  )
}
