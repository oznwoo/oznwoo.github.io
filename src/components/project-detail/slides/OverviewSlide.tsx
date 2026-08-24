import { useEffect, useState } from "react"
import type { Project, ProjectDetail } from "@/data/projects"
import { DEFAULT_ACCENT } from "@/data/projects"
import { hexToRgba, mixWithWhite } from "@/lib/color"
import type { ProjectAccent } from "@/lib/color"
import { HeroBarChart } from "../HeroBarChart"

// 상세 패널이 메인에서 슬라이드-인하는 가로 전환(App.tsx, 0.75s)과 맞춘
// 지연 시간 — 그 전환이 끝난 뒤에야 차트가 올라오며 나타난다.
const PANEL_TRANSITION_MS = 750

interface OverviewSlideProps {
  project: Project
  projectId: string
  detail: ProjectDetail
  accent: ProjectAccent | null
  accentColor: string
  isMobile: boolean
  // 지금 보이고 있는 슬라이드가 Overview(첫 슬라이드) 자신인지 — 다른
  // 슬라이드로 넘어가면 차트를 가라앉히며 숨긴다.
  isActive: boolean
  // 상세 패널을 닫는 중인지 — 메인으로 돌아갈 때도 차트를 먼저 가라앉힌다.
  isClosing: boolean
}

// 개요 — 로고 → 큰 타이틀 → 태그 pill → 기간/역할이 중앙 정렬로 쌓이는
// Hero. 소개 문단만 바로 다음 "소개" 슬라이드로 넘긴다.
// 화면 맨 아래에는 장식 막대 차트가 깔린다(레퍼런스 레이아웃 참고).
// 정보 그래픽이 아니라 마우스가 지나가는 막대만 즉시 솟아올랐다가
// 커서가 빠지면 가라앉는 히어로 장식이라, 순수 CSS :hover로만
// 반응하게 하고 텍스트와 겹치지 않도록 하단 전용 밴드에 둔다.
// 기존 공유 GradientBackground는 그대로 유지하고 그 위에 얹기만 한다.
export function OverviewSlide({
  project,
  projectId,
  detail,
  accent,
  accentColor,
  isMobile,
  isActive,
  isClosing,
}: OverviewSlideProps) {
  // projectId가 바뀔 때마다(다른 프로젝트로 재진입 등) 다시 지연부터
  // 시작한다 — 이 컴포넌트가 프로젝트 전환 사이에 언마운트되지 않을 수 있어서다.
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    setEntered(false)
    const timer = setTimeout(() => setEntered(true), PANEL_TRANSITION_MS)
    return () => clearTimeout(timer)
  }, [projectId])

  const showChart = entered && isActive && !isClosing

  return (
    <div
      className={
        (isMobile
          ? "min-h-screen w-full flex items-center justify-center text-center pl-16 pr-6 py-20"
          : "h-screen flex items-center justify-center px-8 md:px-16 shrink-0 text-center") +
        " relative overflow-hidden"
      }
    >
      {detail.outcomeImage && (
        <div className="absolute inset-x-0 bottom-0 h-[30vh] sm:h-[36vh]">
          <HeroBarChart color={accentColor} visible={showChart} />
        </div>
      )}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {detail.logoSrc ? (
          <img
            src={detail.logoSrc}
            alt={project.title}
            className="h-20 sm:h-24 w-auto"
          />
        ) : (
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-xs text-[#0C0F1A]/40 tracking-[0.04em] uppercase"
          >
            {project.title}
          </span>
        )}
        <h2
          style={{ fontFamily: "var(--font-display)", lineHeight: 1.1 }}
          className="text-[clamp(1.8rem,5vw,3.25rem)] font-medium text-[#0C0F1A] max-w-3xl"
        >
          {project.subtitle}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {project.tags.map((t) => {
            const pillAccent = accent ?? DEFAULT_ACCENT
            // 메인 프로젝트 카드 호버 시 pill 디자인과 동일 — 상세 페이지는
            // 이미 이 프로젝트 색으로 물들어 있으니 항상 "활성" 톤으로 보여준다
            const pillWhiteMix = projectId === "02" ? 0.2 : 0.5
            return (
              <span
                key={t}
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "rgba(255,255,255,0.95)",
                  WebkitTextStroke: "0.35px currentColor",
                  boxShadow: `0 6px 16px ${hexToRgba(accentColor, 0.18)}, 0 1px 3px rgba(12,15,26,0.08)`,
                }}
                className="relative flex items-center text-[9px] px-2.5 py-1 rounded-full uppercase tracking-[0.08em]"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(ellipse at center, ${hexToRgba(pillAccent.primary, 0.3)} 0%, transparent 72%), linear-gradient(135deg, ${mixWithWhite(pillAccent.blobs[0], pillWhiteMix)}, ${mixWithWhite(pillAccent.blobs[1], pillWhiteMix)}, ${mixWithWhite(pillAccent.blobs[2], pillWhiteMix)})`,
                  }}
                />
                <span className="relative">{t}</span>
              </span>
            )
          })}
        </div>
        <div
          style={{ fontFamily: "var(--font-mono)" }}
          className="flex items-center gap-4 text-xs text-[#0C0F1A]/45 uppercase tracking-[0.04em]"
        >
          <span>{detail.period}</span>
          <span className="w-1 h-1 rounded-full bg-[#0C0F1A]/30" />
          <span>{detail.role}</span>
        </div>
      </div>
    </div>
  )
}
