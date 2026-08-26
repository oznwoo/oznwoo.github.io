import { hexToRgba } from "@/lib/color"

interface MediaPlaceholderProps {
  kind: "image" | "video"
  accentColor: string
  className?: string
  style?: React.CSSProperties
}

// 실제 스크린샷·시연 영상이 아직 없는 프로젝트에서, 있어야 할 미디어 영역을
// 접어 숨기는 대신 자리와 구조를 그대로 유지하기 위한 자리표시자. 나중에
// image/video 값만 채워 넣으면 별도 레이아웃 변경 없이 실제 미디어로
// 교체된다.
export function MediaPlaceholder({
  kind,
  accentColor,
  className,
  style,
}: MediaPlaceholderProps) {
  return (
    <div
      className={
        "rounded-2xl border border-dashed flex flex-col items-center justify-center gap-2 " +
        (className ?? "")
      }
      style={{
        borderColor: hexToRgba(accentColor, 0.22),
        background: hexToRgba(accentColor, 0.045),
        color: hexToRgba(accentColor, 0.5),
        ...style,
      }}
    >
      {kind === "video" ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7 opacity-70"
        >
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="M10 9.5 L15 12 L10 14.5 Z" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7 opacity-70"
        >
          <rect x="3" y="4" width="18" height="16" rx="2.5" />
          <circle cx="8.5" cy="9.5" r="1.6" />
          <path d="M4 17.5 L9 12.5 L12.5 16 L16 11.5 L20 15.5" />
        </svg>
      )}
      <span
        style={{ fontFamily: "var(--font-mono)" }}
        className="text-[11px] uppercase tracking-[0.04em]"
      >
        {kind === "video" ? "영상 준비 중" : "이미지 준비 중"}
      </span>
    </div>
  )
}
