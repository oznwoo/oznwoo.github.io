import type { Project, ProjectDetail } from "@/data/projects"

interface AboutSlideProps {
  project: Project
  detail: ProjectDetail
  isMobile: boolean
}

// 소개 — Overview 히어로 다음, 프로젝트를 실제로 설명하는 전용 화면.
// 로고/타이틀/메타는 앞 슬라이드에서 이미 보여줬으니 소개 문단(+있으면
// 실제 서비스 화면 스크린샷)만 둔다.
export function AboutSlide({ project, detail, isMobile }: AboutSlideProps) {
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
            className="w-full rounded-2xl overflow-hidden border border-[#0C0F1A]/8"
            style={{ boxShadow: "0 24px 60px -20px rgba(12,15,26,0.25)" }}
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
