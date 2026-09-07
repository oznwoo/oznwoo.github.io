import { createPortal } from "react-dom"
import type { ProjectAccent } from "@/lib/color"
import { AccentPill } from "../AccentPill"

export interface CursorPos {
  x: number
  y: number
}

interface ZoomHintProps {
  // 커서 좌표(뷰포트 기준). null이면 렌더링하지 않는다 — 호출부가 이미지를
  // hover 중일 때만 마지막 커서 위치를 넣어준다. 포인터가 없는 환경(모바일)
  // 에서도 호출부에서 null을 넣어 아무것도 그리지 않게 한다.
  pos: CursorPos | null
  accent: ProjectAccent | null
  accentColor: string
  projectId: string
  label?: string
}

// 확대 가능한 이미지에 마우스를 올리면 커서 옆에 붙어 따라다니는 안내 툴팁.
// 상세 페이지 곳곳에서 쓰는 AccentPill 디자인을 그대로 쓴다. 커서 추적은
// 호출부(이미지 프레임의 onMouseMove)가 맡고, 여기서는 위치만 받아 그린다.
export function ZoomHint({
  pos,
  accent,
  accentColor,
  projectId,
  label = "클릭하면 확대",
}: ZoomHintProps) {
  if (!pos) return null

  return createPortal(
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        // 커서 오른쪽 아래로 살짝 띄워, 커서 자체나 확대 아이콘을 가리지 않게
        transform: "translate(14px, 16px)",
        zIndex: 60,
        pointerEvents: "none",
      }}
    >
      <AccentPill
        label={label}
        accent={accent}
        accentColor={accentColor}
        projectId={projectId}
      />
    </div>,
    document.body,
  )
}
