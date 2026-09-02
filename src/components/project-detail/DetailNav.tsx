import { useState } from "react"
import { DETAIL_PAGE_LABELS } from "@/data/navigation"
import type { ProjectAccent } from "@/lib/color"
import { accentGradient } from "@/lib/color"

export function DetailNav({
  slide,
  onClose,
  goSlide,
  accent,
  isMobile,
  // 등록된 프로젝트면 그 브랜드 그라디언트를, 아니면 기본 블루를 dot에 쓴다.
}: {
  slide: number
  onClose: () => void
  goSlide: (i: number) => void
  accent: ProjectAccent | null
  isMobile: boolean
}) {
  const dotBackground = accent ? accentGradient(accent) : "#4F6EF7"
  const [hovered, setHovered] = useState(false)
  return (
    <nav
      // 데스크톱/태블릿에서는 이 nav가 메인↔상세 패널을 옆으로 밀어내는
      // translateX 래퍼 "안"에 있다 — transform이 있는 조상은 fixed 자식의
      // containing block이 되므로, 여기서 fixed를 쓰면 패널이 슬라이드될 때
      // nav도 화면 밖으로 같이 끌려나가 사라진다. absolute라야 래퍼 박스
      // 기준으로 정상적으로 같이 슬라이드-인 된다. 모바일은 그 transform
      // 래퍼 자체가 없는(overlay) 구조라 fixed로 뷰포트에 고정해야 한다.
      className={
        (isMobile ? "fixed" : "absolute") +
        " left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-start"
      }
      style={{ gap: "10px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 뒤로가기 */}
      <button
        onClick={onClose}
        className="flex items-center gap-2.5 shrink-0"
        style={{ height: "20px" }}
      >
        {/* dot 아이콘 칸과 동일하게 좌측 정렬 — justify-center로 24px 칸
            가운데에 두면 화살표가 아래 dot 열보다 오른쪽으로 치우쳐 보인다.
            글리프 자체의 좌측 여백만큼만 음수 마진으로 당겨 dot 좌측 edge에
            시각적으로 맞춘다 (DotNav 로고 아이콘 보정과 같은 방식). */}
        <span
          className="flex items-center shrink-0"
          style={{ width: "24px", height: "20px" }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              color: "rgba(12,15,26,0.35)",
              marginLeft: "-1px",
            }}
          >
            ←
          </span>
        </span>
        <span
          className="hidden md:inline-block"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#0C0F1A",
            whiteSpace: "nowrap",
            opacity: hovered ? 0.35 : 0,
            transition: "opacity 0.25s",
          }}
        >
          Back
        </span>
      </button>

      {/* 슬라이드 dot + 타이틀 */}
      {DETAIL_PAGE_LABELS.map((label, i) => (
        <button
          key={label}
          onClick={() => goSlide(i)}
          className="flex items-center gap-2.5 shrink-0"
          style={{ height: "20px" }}
        >
          <span
            className="flex items-center shrink-0"
            style={{ width: "24px", height: "20px" }}
          >
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: i === slide ? "20px" : "6px",
                height: "6px",
                background: i === slide ? dotBackground : "rgba(12,15,26,0.22)",
              }}
            />
          </span>
          <span
            className="hidden md:inline-block"
            style={{
              fontFamily: "var(--font-mono)",
              opacity: i === slide ? 0.65 : hovered ? 0.3 : 0,
              color: "#0C0F1A",
              fontSize: "0.65rem",
              letterSpacing: "0.04em",
              textTransform: "uppercase" as const,
              transition: "opacity 0.25s",
              fontWeight: i === slide ? 500 : 400,
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
        </button>
      ))}
    </nav>
  )
}
