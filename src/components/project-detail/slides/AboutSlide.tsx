import { useState } from "react"
import type { Project, ProjectDetail } from "@/data/projects"
import { hexToRgba } from "@/lib/color"

interface AboutSlideProps {
  project: Project
  detail: ProjectDetail
  accentColor: string
  isMobile: boolean
}

// 소개 — Overview 히어로 다음, 프로젝트를 실제로 설명하는 전용 화면.
// 로고/타이틀/메타는 앞 슬라이드에서 이미 보여줬으니 소개 문단(+있으면
// 실제 서비스 화면 스크린샷)만 둔다.
export function AboutSlide({ project, detail, accentColor, isMobile }: AboutSlideProps) {
  const [shotHovered, setShotHovered] = useState(false)

  return (
    <div
      className={
        isMobile
          ? "min-h-screen w-full flex items-center justify-center text-center pl-16 pr-6 py-20"
          : "h-screen flex items-center justify-center px-8 md:px-16 shrink-0 text-center"
      }
    >
      <div
        className={
          (detail.aboutImage ? "max-w-3xl" : "max-w-2xl") +
          " flex flex-col items-center gap-8"
        }
      >
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase"
        >
          About
        </span>
        {detail.aboutImage && (
          <div
            onMouseEnter={() => setShotHovered(true)}
            onMouseLeave={() => setShotHovered(false)}
            className="w-full rounded-2xl overflow-hidden border cursor-default"
            style={{
              borderColor: shotHovered
                ? hexToRgba(accentColor, 0.35)
                : "rgba(12,15,26,0.1)",
              // 앰비언트(넓고 옅은) + 컨택트(좁고 진한) 그림자를 겹쳐 입체감을
              // 주고, hover 시 accent 컬러가 은은하게 번지는 그림자로 전환한다
              boxShadow: shotHovered
                ? `0 32px 70px -18px ${hexToRgba(accentColor, 0.35)}, 0 10px 26px -10px rgba(12,15,26,0.3)`
                : "0 24px 60px -24px rgba(12,15,26,0.28), 0 6px 16px -8px rgba(12,15,26,0.14)",
              transform: shotHovered
                ? "translateY(-4px) scale(1.012)"
                : "translateY(0) scale(1)",
              transition:
                "transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s ease-out, border-color 0.45s ease-out",
            }}
          >
            <img
              src={detail.aboutImage}
              alt={`${project.title} 홈페이지 히어로 화면`}
              // 두 번째 슬라이드라 진입 직후 곧바로 보이는데, transform 기반
              // 세로 슬라이드 트랙에서는 loading="lazy"의 뷰포트 교차 판정이
              // 갱신되지 않아 스크롤 없이는 이미지가 영영 로드되지 않는
              // 문제가 있었다 — eager로 바꿔 우회한다.
              loading="eager"
              width={1274}
              height={768}
              className="w-full h-auto block"
            />
          </div>
        )}
        <p
          style={{ fontFamily: "var(--font-body)" }}
          className={
            (detail.aboutImage ? "max-w-xl" : "") +
            " text-base sm:text-lg text-[#0C0F1A]/70 leading-relaxed font-normal"
          }
        >
          {detail.overview}
        </p>
      </div>
    </div>
  )
}
