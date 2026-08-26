import { useState } from "react"
import type { ProjectAccent } from "@/lib/color"
import { hexToRgba } from "@/lib/color"
import { AccentPill } from "./AccentPill"

interface TabArrowButtonProps {
  direction: "prev" | "next"
  label: string
  onClick: () => void
  // 진입/이탈 애니메이션이 끝났는지 — 끝나기 전에는 hover해도 강조되지 않는다
  revealed: boolean
  // 화살표 자체를 hover하지 않아도(예: 옆 이미지를 hover할 때) 같이 강조하고
  // 싶을 때 쓴다 — SOLUTION/ABOUT 둘 다 이미지 hover와 화살표 hover를 같은
  // 시각적 신호로 묶어 쓴다
  extraHintActive?: boolean
  accent: ProjectAccent | null
  accentColor: string
  projectId: string
  // 화살표를 이미지 바깥 어느 쪽에, 얼마나 띄울지 — 호출부마다 이미지 폭이
  // 달라 오프셋이 다르다(SOLUTION -14, ABOUT -16)
  offsetClassName: string
}

// SOLUTION 쇼케이스와 ABOUT 슬라이드가 공유하는 "이전/다음 스텝" 화살표 —
// 이미지 옆에 뜨는 카드형 버튼 + pill 툴팁 + hover 시 살짝 떠오르는 연출을
// 한 군데에 묶어둔다. hover 상태를 컴포넌트 안에 두는 게 중요한데, 이
// 화살표는 스텝이 경계(첫/마지막)에 닿으면 통째로 언마운트된다 — 상태를
// 부모에 두면 다시 마운트될 때 이전 hover가 남아 있어(마우스가 그대로 있어도
// 언마운트 시 mouseleave가 안 오는 경우가 있다) 툴팁이 저절로 켜진 것처럼
// 보이는 버그가 생긴다. 컴포넌트 로컬 상태로 두면 언마운트=상태 소멸이라
// 이 문제가 애초에 생기지 않는다.
export function TabArrowButton({
  direction,
  label,
  onClick,
  revealed,
  extraHintActive = false,
  accent,
  accentColor,
  projectId,
  offsetClassName,
}: TabArrowButtonProps) {
  const [hovered, setHovered] = useState(false)
  const hintActive = revealed && (hovered || extraHintActive)
  const isPrev = direction === "prev"

  return (
    <div
      className={`absolute ${offsetClassName} top-1/2 z-10 group`}
      style={{
        // 진입 시 왼쪽에서 오른쪽으로 나타나고, 벗어날 때(revealed가 다시
        // false가 되며)는 같은 값을 거꾸로 통과해 반대로 사라진다
        transform: `translateY(-50%) translateX(${revealed ? 0 : -10}px)`,
        opacity: revealed ? 1 : 0,
        transition:
          "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease-out",
        pointerEvents: revealed ? "auto" : "none",
      }}
    >
      <button
        aria-label={isPrev ? "이전" : "다음"}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          color: "#0C0F1A",
          // 평소엔 배경·그림자 없이 화살표만 떠 있다가, hover할 때만 다른
          // 이미지 카드들과 같은 색(옅은 accent 테두리 + 그림자)으로
          // 카드처럼 떠오른다
          background: hintActive ? "rgba(255,255,255,0.7)" : "transparent",
          borderColor: hintActive
            ? hexToRgba(accentColor, 0.35)
            : "transparent",
          boxShadow: hintActive
            ? `0 14px 28px -10px ${hexToRgba(accentColor, 0.35)}, 0 6px 14px -6px rgba(12,15,26,0.28)`
            : "none",
          transform: hintActive
            ? "translateY(-2px) scale(1.05)"
            : "translateY(0) scale(1)",
        }}
        className="block text-3xl leading-none opacity-30 hover:opacity-80 transition-all duration-300 rounded-lg border px-2 py-1"
      >
        {isPrev ? "‹" : "›"}
      </button>
      {/* 화살표 바깥쪽(이미지에서 먼 방향)에 세로 중앙 정렬로 띄워, 위/아래에
          두면 생기는 이미지와의 겹침을 피한다 */}
      <div
        role="tooltip"
        style={{ opacity: revealed && extraHintActive ? 1 : undefined }}
        className={
          (isPrev ? "right-full mr-2" : "left-full ml-2") +
          " pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        }
      >
        <AccentPill
          label={label}
          accent={accent}
          accentColor={accentColor}
          projectId={projectId}
        />
      </div>
    </div>
  )
}
