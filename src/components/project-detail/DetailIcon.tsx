import type { DetailIconKey } from "@/data/projects"

// Problem/Solution/Outcome 카드 아이콘. 획일적인 아이콘 라이브러리 대신 사이트
// 톤(가는 획, 둥근 끝)에 맞춘 최소한의 프리미티브 조합으로 직접 그린다.
export function DetailIcon({ name }: { name: DetailIconKey }) {
  const p = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "w-full h-full",
  }
  switch (name) {
    case "duplicate":
      return (
        <svg {...p}>
          <rect x="3" y="3" width="13" height="13" rx="2.5" opacity="0.4" />
          <rect x="8" y="8" width="13" height="13" rx="2.5" />
        </svg>
      )
    case "target":
      return (
        <svg {...p}>
          <circle cx="10" cy="10" r="7.5" />
          <circle cx="10" cy="10" r="4" />
          <circle cx="10" cy="10" r="0.6" fill="currentColor" stroke="none" />
          <path d="M16.5 3.5 H21 V8" />
          <path d="M21 3.5 L15 9.5" />
        </svg>
      )
    case "alert":
      return (
        <svg {...p}>
          <path d="M4 20 H20" />
          <rect x="6" y="13" width="3" height="7" opacity="0.4" />
          <rect x="11" y="9" width="3" height="11" opacity="0.4" />
          <rect x="16" y="14" width="3" height="6" opacity="0.4" />
          <circle cx="17.5" cy="4.5" r="2.6" />
          <path d="M17.5 3.2 V4.9" />
          <circle
            cx="17.5"
            cy="6.1"
            r="0.15"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      )
    case "filter":
      return (
        <svg {...p}>
          <path d="M4 5 H20 L14 12.5 V18.5 L10 20.5 V12.5 Z" />
        </svg>
      )
    case "layers":
      return (
        <svg {...p}>
          <path d="M12 3 L21 8 L12 13 L3 8 Z" />
          <path d="M3 13 L12 18 L21 13" />
          <path d="M3 17.5 L12 22 L21 17.5" opacity="0.4" />
        </svg>
      )
    case "sparkle":
      return (
        <svg {...p}>
          <path d="M12 3 L13.8 9.4 L20 11 L13.8 12.6 L12 19 L10.2 12.6 L4 11 L10.2 9.4 Z" />
        </svg>
      )
    case "trend-down":
      return (
        <svg {...p}>
          <path d="M3 6 L10 13 L14 9 L21 16" />
          <path d="M21 9.5 V16 H14.5" />
        </svg>
      )
  }
}
