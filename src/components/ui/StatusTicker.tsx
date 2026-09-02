import { useEffect, useState } from "react"

const STATUS_MESSAGES = [
  "적극적으로 기회를 찾고 있습니다",
  "새로운 문제를 풀고 싶습니다",
  "AI로 세상을 바꾸는 중입니다",
  "오늘도 코드를 작성하고 있습니다",
  "좋은 팀을 만나고 싶습니다",
  "사용자의 문제를 해결하고 싶습니다",
]

export function StatusTicker() {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<"visible" | "exit" | "enter">("visible")

  useEffect(() => {
    const id = setInterval(() => {
      setPhase("exit")
      setTimeout(() => {
        setIndex((i) => (i + 1) % STATUS_MESSAGES.length)
        setPhase("enter")
        setTimeout(() => setPhase("visible"), 20)
      }, 300)
    }, 2800)
    return () => clearInterval(id)
  }, [])

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
