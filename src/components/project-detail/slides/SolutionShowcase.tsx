import { useEffect, useState } from "react"
import type { ProjectDetailCardItem } from "@/data/projects"
import type { ProjectAccent } from "@/lib/color"
import { hexToRgba, mixWithWhite } from "@/lib/color"
import { AccentPill } from "../AccentPill"

const SLIDE_TRANSITION_MS = 750

interface SolutionShowcaseProps {
  problems: ProjectDetailCardItem[]
  solutions: ProjectDetailCardItem[]
  accent: ProjectAccent | null
  accentColor: string
  projectId: string
  imageWidth: number
  imageHeight: number
  isMobile: boolean
  isActive: boolean
  onTransition: (direction: 1 | -1) => void
}

function renderWithEmphasis(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-[#0C0F1A]">
        {part}
      </strong>
    ) : (
      part
    ),
  )
}

// Fintag SOLUTION 전용 — 3개의 해결 방안을 PROBLEM과 1:1로 짝지어 한 번에
// 하나씩 보여준다. 세로 슬라이드 트랙은 그대로 두고, 스텝을 넘길 때마다
// 공유 배경의 blob 웜프만 재생해 자연스럽게 전환되는 느낌을 낸다.
export function SolutionShowcase({
  problems,
  solutions,
  accent,
  accentColor,
  projectId,
  imageWidth,
  imageHeight,
  isMobile,
  isActive,
  onTransition,
}: SolutionShowcaseProps) {
  const [step, setStep] = useState(0)
  const [imgHovered, setImgHovered] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!isActive) {
      setRevealed(false)
      setStep(0)
      return
    }
    const timer = setTimeout(() => setRevealed(true), SLIDE_TRANSITION_MS)
    return () => clearTimeout(timer)
  }, [isActive])

  const goStep = (next: number) => {
    const clamped = Math.max(0, Math.min(solutions.length - 1, next))
    if (clamped === step) return
    onTransition(clamped > step ? 1 : -1)
    setStep(clamped)
  }

  const solution = solutions[step]

  return (
    <div
      className={
        isMobile
          ? "min-h-screen w-full flex items-center justify-center px-6 pl-16 py-20"
          : "min-h-screen flex items-center justify-center px-8 md:px-16 shrink-0 py-24"
      }
    >
      <div className="max-w-4xl w-full">
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase mb-5 block"
        >
          Solution
        </span>
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {problems.map((p, i) => (
            <button
              key={p.title}
              onClick={() => goStep(i)}
              style={{
                fontFamily: "var(--font-body)",
                background: i === step ? accentColor : "transparent",
                borderColor:
                  i === step ? accentColor : "rgba(12,15,26,0.14)",
                color: i === step ? "#ffffff" : "rgba(12,15,26,0.5)",
              }}
              className="text-xs font-medium px-3.5 py-2 rounded-full border transition-colors duration-300"
            >
              {p.title}
            </button>
          ))}
        </div>

        <div
          key={step}
          style={{ animation: "step-in 0.5s cubic-bezier(0.16,1,0.3,1) both" }}
          className="flex flex-col gap-3"
        >
          <h3
            style={{ fontFamily: "var(--font-body)" }}
            className="text-xl font-semibold text-[#0C0F1A]"
          >
            {solution.title}
          </h3>
          {solution.image && (
            <div
              onMouseEnter={() => setImgHovered(true)}
              onMouseLeave={() => setImgHovered(false)}
              // 세로로 긴 이미지(예측 설명 이미지)가 뷰포트 높이를 넘어 슬라이드
              // 하단이 잘리지 않도록, 프레임을 이미지 실제 크기에 맞춰 inline-
              // block으로 두고 최대 높이를 뷰포트 기준으로 제한한다
              className="inline-block max-w-full mx-auto rounded-2xl overflow-hidden border cursor-default"
              style={{
                borderColor: imgHovered
                  ? hexToRgba(accentColor, 0.35)
                  : "rgba(12,15,26,0.1)",
                boxShadow: imgHovered
                  ? `0 20px 45px -14px ${hexToRgba(accentColor, 0.35)}, 0 8px 18px -8px rgba(12,15,26,0.28)`
                  : "0 14px 34px -18px rgba(12,15,26,0.24), 0 4px 10px -6px rgba(12,15,26,0.12)",
                transform: imgHovered
                  ? "translateY(-3px) scale(1.008)"
                  : "translateY(0) scale(1)",
                transition:
                  "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease-out, border-color 0.4s ease-out",
              }}
            >
              <img
                src={solution.image}
                alt=""
                aria-hidden="true"
                loading="lazy"
                width={imageWidth}
                height={imageHeight}
                className="block w-auto h-auto max-w-full"
                style={{ maxHeight: "38vh" }}
              />
            </div>
          )}
          <div
            style={{
              display: "grid",
              gridTemplateRows: revealed ? "1fr" : "0fr",
              transition: "grid-template-rows 0.5s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div className="overflow-hidden">
              <div
                style={{
                  transform: revealed ? "translateY(0)" : "translateY(-10px)",
                  opacity: revealed ? 1 : 0,
                  transition:
                    "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease-out",
                }}
              >
                <div
                  className="rounded-2xl p-4 backdrop-blur-sm"
                  style={{
                    background: hexToRgba(mixWithWhite(accentColor, 0.93), 0.62),
                    border: "1px solid rgba(12,15,26,0.06)",
                  }}
                >
                  {solution.shortBody ? (
                    <ul className="flex flex-col gap-1.5">
                      {solution.shortBody.map((line, i) => (
                        <li
                          key={i}
                          style={{ fontFamily: "var(--font-body)" }}
                          className="text-sm text-[#0C0F1A]/70 leading-relaxed font-normal flex items-start gap-2"
                        >
                          <span
                            aria-hidden="true"
                            className="w-1 h-1 rounded-full shrink-0 mt-2"
                            style={{ background: accentColor }}
                          />
                          <span>{renderWithEmphasis(line)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p
                      style={{ fontFamily: "var(--font-body)" }}
                      className="text-sm text-[#0C0F1A]/70 leading-relaxed font-normal"
                    >
                      {solution.body}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {solution.tags && (
            <div className="flex flex-wrap gap-2">
              {solution.tags.map((t) => (
                <AccentPill
                  key={t}
                  label={t}
                  accent={accent}
                  accentColor={accentColor}
                  projectId={projectId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
