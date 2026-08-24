import type { Project, ProjectDetail } from "@/data/projects"
import { hexToRgba } from "@/lib/color"
import { DetailIcon } from "../DetailIcon"

interface OutcomeSlideProps {
  project: Project
  detail: ProjectDetail
  accentColor: string
  isMobile: boolean
}

// 성과
export function OutcomeSlide({ project, detail, accentColor, isMobile }: OutcomeSlideProps) {
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
                  style={{ background: hexToRgba(accentColor, 0.1), color: accentColor }}
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
