import { useEffect, useState } from "react"
import type { Project, ProjectDetail } from "@/data/projects"
import type { ProjectAccent } from "@/lib/color"
import { AccentPill } from "../AccentPill"
import { HeroBarChart } from "../HeroBarChart"
import { FallingMessages } from "../FallingMessages"

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
// 프로젝트별로 배경 장식(detail.heroEffect)이 다르다 — Fintag는 하단 전용
// 밴드의 이퀄라이저 막대(HeroBarChart), CoChat for Business는 텍스트 뒤로
// 흘러내리는 메신저 말풍선(FallingMessages). 둘 다 정보가 아니라 분위기라
// 히어로 텍스트(z-10) 뒤(z-0)에 낮은 불투명도로 깔고, 기존 공유
// GradientBackground는 그대로 두고 그 위에 얹기만 한다.
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

  // 패널 전환(0.75s)이 끝난 뒤 등장하고, 다른 슬라이드로 넘어가거나 패널을
  // 닫는 중이면 다시 사라진다
  const showHeroEffect = entered && isActive && !isClosing

  return (
    <div
      className={
        (isMobile
          ? "min-h-screen w-full flex items-center justify-center text-center pl-16 pr-6 py-20"
          : "h-screen flex items-center justify-center px-8 md:px-16 shrink-0 text-center") +
        " relative overflow-hidden"
      }
    >
      {detail.heroEffect === "bars" && (
        <div className="absolute inset-x-0 bottom-0 h-[30vh] sm:h-[36vh]">
          <HeroBarChart color={accentColor} visible={showHeroEffect} />
        </div>
      )}
      {detail.heroEffect === "falling-messages" && accent && (
        <FallingMessages accent={accent} visible={showHeroEffect} />
      )}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {detail.logoSrc ? (
          <div className="flex flex-col items-center gap-1.5">
            <img
              src={detail.logoSrc}
              alt={project.title}
              // 로고마다 원본 형태가 달라(가로로 넓은 워드마크 vs 정사각형
              // 심볼) 같은 높이를 줘도 체감 크기가 다르다 — 기본값은 워드마크
              // 기준이고, 심볼형 로고는 프로젝트별로 더 큰 값을 지정한다
              className={detail.logoClassName ?? "h-20 sm:h-24 w-auto"}
            />
            {/* 심볼만 있고 서비스명이 로고 안에 없는 경우(예: CoChat for
                Business) 아래에 이름을 별도로 적어준다 */}
            {detail.logoShowName && (
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs text-[#0C0F1A]/40 tracking-[0.04em] uppercase"
              >
                {project.title}
              </span>
            )}
          </div>
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
          {project.tags.map((t) => (
            <AccentPill
              key={t}
              label={t}
              accent={accent}
              accentColor={accentColor}
              projectId={projectId}
            />
          ))}
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
