import type { Project, ProjectDetail } from "@/data/projects"
import type { ProjectAccent } from "@/lib/color"
import { hexToRgba } from "@/lib/color"
import { DetailIcon } from "../DetailIcon"
import { CardGridSlide } from "./CardGridSlide"

interface OutcomeSlideProps {
  project: Project
  detail: ProjectDetail
  accent: ProjectAccent | null
  accentColor: string
  projectId: string
  isMobile: boolean
  isActive: boolean
}

// 성과 — outcomeGallery가 있는 프로젝트(Fintag)는 PROBLEM/SOLUTION과 완전히
// 동일한 카드 그리드 구조로 '해결된 버전'을 보여준다. 없는 프로젝트는 기존
// 스탯 카드 레이아웃을 그대로 쓴다.
export function OutcomeSlide({
  project,
  detail,
  accent,
  accentColor,
  projectId,
  isMobile,
  isActive,
}: OutcomeSlideProps) {
  if (detail.outcomeGallery) {
    return (
      <CardGridSlide
        eyebrow="Outcome"
        items={detail.outcomeGallery}
        accent={accent}
        accentColor={accentColor}
        projectId={projectId}
        imageWidth={1024}
        imageHeight={765}
        isMobile={isMobile}
        isActive={isActive}
      />
    )
  }

  return (
    <div
      className={
        isMobile
          ? "min-h-screen w-full flex items-center justify-center px-6 pl-16 py-20"
          : "min-h-screen flex items-center justify-center px-8 md:px-16 shrink-0 py-24"
      }
    >
      <div className="max-w-6xl w-full">
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase mb-10 block"
        >
          Outcome
        </span>
        <div className="grid md:grid-cols-3 gap-5 mb-6">
          {detail.outcome.map((item) => (
            <div
              key={item.label}
              className="relative overflow-hidden rounded-2xl border border-[#0C0F1A]/8 bg-white/50 backdrop-blur-sm p-6 flex flex-col gap-4"
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1"
                style={{ background: accentColor }}
              />
              {item.icon && (
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center p-2.5"
                  style={{
                    background: hexToRgba(accentColor, 0.1),
                    color: accentColor,
                  }}
                >
                  <DetailIcon name={item.icon} />
                </div>
              )}
              <div>
                <div
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-[clamp(1.5rem,3vw,2.2rem)] font-semibold text-[#0C0F1A] leading-none mb-2"
                >
                  {item.stat}
                </div>
                <div
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-xs text-[#0C0F1A]/35 uppercase tracking-[0.02em] leading-relaxed"
                >
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
        {detail.outcomeImage && (
          <div className="relative overflow-hidden rounded-2xl border border-[#0C0F1A]/8 bg-white/50 backdrop-blur-sm mb-6 h-40 md:h-48">
            <img
              src={detail.outcomeImage}
              alt="전처리 및 잔차 보정 적용 후 30일 Walk-forward 예측이 실제 잔액을 촘촘히 따라가는 것을 보여주는 차트"
              loading="lazy"
              width={1000}
              height={807}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="bg-[#0C0F1A] rounded-2xl px-10 py-10">
          <p
            style={{ fontFamily: "var(--font-display)", lineHeight: 1.5 }}
            className="text-xl font-light text-[#F0F3F9]"
          >
            "{project.description}"
          </p>
        </div>
      </div>
    </div>
  )
}
