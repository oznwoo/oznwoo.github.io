import { useState, type ReactNode } from "react"
import { hexToRgba } from "@/lib/color"

interface DetailExternalLinksProps {
  githubUrl?: string
  liveUrl?: string
  figmaUrl?: string
  accentColor: string
  isMobile: boolean
}

// 프로젝트 상세 우측 하단에 항상 떠 있는 외부 링크들.
// 좌측 하단 페이지 카운터와 같은 위치·톤(mono, 흰 blur 배경)을 쓰되, 링크라서
// hover 시 프로젝트 accent 색으로 살짝 떠오른다. 라이브 데모·Figma 기획이 있으면
// GitHub 왼쪽에 나란히 놓아 "실제 서비스/기획 → 소스"로 자연스럽게 읽히게 한다.
export function DetailExternalLinks({
  githubUrl,
  liveUrl,
  figmaUrl,
  accentColor,
  isMobile,
}: DetailExternalLinksProps) {
  if (!githubUrl && !liveUrl && !figmaUrl) return null

  return (
    <div
      className={
        (isMobile ? "fixed" : "absolute") +
        " bottom-6 right-6 z-30 flex items-center gap-2"
      }
    >
      {liveUrl && (
        <LinkPill href={liveUrl} accentColor={accentColor} label="Live">
          <svg
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 2H2.5A.5.5 0 0 0 2 2.5v11a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V10" />
            <path d="M9.5 2H14v4.5" />
            <path d="M14 2 7 9" />
          </svg>
        </LinkPill>
      )}
      {figmaUrl && (
        <LinkPill href={figmaUrl} accentColor={accentColor} label="Figma">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8.148 24c2.352 0 4.259-1.907 4.259-4.259v-4.259H8.148c-2.352 0-4.259 1.907-4.259 4.259C3.889 22.093 5.796 24 8.148 24zM3.889 11.852c0-2.352 1.907-4.259 4.259-4.259h4.259v8.518H8.148c-2.352 0-4.259-1.907-4.259-4.259zM3.889 4.259C3.889 1.907 5.796 0 8.148 0h4.259v8.518H8.148c-2.352 0-4.259-1.907-4.259-4.259zM12.407 0h4.259c2.352 0 4.259 1.907 4.259 4.259s-1.907 4.259-4.259 4.259h-4.259V0zM20.926 11.852c0 2.352-1.907 4.259-4.259 4.259s-4.259-1.907-4.259-4.259 1.907-4.259 4.259-4.259 4.259 1.907 4.259 4.259z" />
          </svg>
        </LinkPill>
      )}
      {githubUrl && (
        <LinkPill href={githubUrl} accentColor={accentColor} label="GitHub">
          <svg
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </LinkPill>
      )}
    </div>
  )
}

interface LinkPillProps {
  href: string
  accentColor: string
  label: string
  children: ReactNode
}

function LinkPill({ href, accentColor, label, children }: LinkPillProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "var(--font-mono)",
        color: hovered ? accentColor : "rgba(12,15,26,0.45)",
        borderColor: hovered
          ? hexToRgba(accentColor, 0.35)
          : "rgba(12,15,26,0.12)",
        boxShadow: hovered
          ? `0 12px 26px -12px ${hexToRgba(accentColor, 0.35)}`
          : "none",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition:
          "color 0.25s ease, border-color 0.25s ease, box-shadow 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1)",
      }}
      className="flex items-center gap-1.5 rounded-full border bg-white/45 backdrop-blur-sm px-3 py-1.5 text-xs uppercase tracking-[0.04em] select-none"
    >
      {children}
      {label}
    </a>
  )
}
