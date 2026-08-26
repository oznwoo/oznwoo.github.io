import { useState } from "react"
import type { ProjectAccent } from "@/lib/color"
import { hexToRgba } from "@/lib/color"
import { AccentPill } from "@/components/project-detail/AccentPill"
import { ExpandIcon } from "./ExpandIcon"

interface ZoomButtonProps {
  onClick: () => void
  // 진입/이탈 애니메이션이 끝났는지 — 끝나기 전에는 hover해도 강조되지 않는다
  revealed: boolean
  // 아이콘 자체를 hover하지 않아도(이미지를 hover할 때) 같이 강조한다 —
  // 아이콘을 처음 보는 사람에게 "이미지를 크게 볼 수 있다"를 먼저 알려주기 위함
  extraHintActive: boolean
  accent: ProjectAccent | null
  accentColor: string
  projectId: string
}

// SOLUTION 쇼케이스의 "이미지 크게 보기" 버튼 — 탭 바로 아래 우측에 아이콘만
// 떠 있다가, hover(또는 이미지 hover) 시 카드처럼 떠오르며 pill 툴팁을 보여준다.
export function ZoomButton({
  onClick,
  revealed,
  extraHintActive,
  accent,
  accentColor,
  projectId,
}: ZoomButtonProps) {
  const [hovered, setHovered] = useState(false)
  const hintActive = revealed && (hovered || extraHintActive)

  return (
    <div className="relative group pb-3">
      {/* 툴팁을 이 안쪽 wrapper 기준으로 세로 중앙 정렬한다 — 바깥
          div의 pb-3(탭 밑줄 정렬용)까지 포함해 중앙을 잡으면 아이콘
          실제 높이보다 아래로 치우친다 */}
      <div className="relative flex items-center justify-center">
        <button
          onClick={onClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label="크게 보기"
          style={{
            color: "#0C0F1A",
            // 평소엔 배경·그림자 없이 아이콘만 떠 있다가, hover할 때만 다른
            // 이미지 카드들과 똑같은 색(옅은 accent 테두리 + 그림자)으로
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
          className="flex items-center justify-center rounded-lg border p-1.5 opacity-45 hover:opacity-90 transition-all duration-300"
        >
          <ExpandIcon />
        </button>
        {/* 아래(top-full)에 두면 바로 아래 이미지 카드에 가려지므로,
            아이콘 왼쪽에 세로 중앙 정렬로 띄운다 */}
        <div
          role="tooltip"
          style={{ opacity: revealed && extraHintActive ? 1 : undefined }}
          className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <AccentPill
            label="이미지 크게 보기"
            accent={accent}
            accentColor={accentColor}
            projectId={projectId}
          />
        </div>
      </div>
    </div>
  )
}
