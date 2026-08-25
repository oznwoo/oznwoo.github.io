import { useEffect, useState } from "react"
import type { ProjectDetailCardItem } from "@/data/projects"
import type { ProjectAccent } from "@/lib/color"
import { hexToRgba, mixWithWhite } from "@/lib/color"

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
// 하나씩 보여준다. 탭(또는 이미지 옆 화살표)으로 스텝만 조용히 전환하고,
// 세로 슬라이드 트랙이나 배경 blob 웜프는 건드리지 않는다.
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
        <div
          className="flex flex-wrap items-center gap-6 mb-8"
          style={{ borderBottom: "1px solid rgba(12,15,26,0.08)" }}
        >
          {problems.map((p, i) => (
            <button
              key={p.title}
              onClick={() => goStep(i)}
              style={{
                fontFamily: "var(--font-body)",
                color: i === step ? "#0C0F1A" : "rgba(12,15,26,0.4)",
                borderBottomColor: i === step ? accentColor : "transparent",
              }}
              className="text-sm font-medium pb-3 border-b-2 transition-colors duration-300"
            >
              {p.title}
            </button>
          ))}
        </div>

        <div
          key={step}
          style={{
            animation: "step-in 0.5s cubic-bezier(0.16,1,0.3,1) both",
            // 탭 아래 콘텐츠 영역 크기를 스텝마다 고정해, 이미지 비율이나
            // 설명 길이가 달라져도 탭 위치가 위아래로 밀리지 않게 한다.
            // flowSteps가 있는 스텝(전처리 파이프라인)이 가장 길어서 그
            // 기준으로 잡는다.
            minHeight: isMobile ? undefined : "640px",
          }}
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
              className="relative flex items-center justify-center"
              style={{ height: isMobile ? undefined : "260px" }}
            >
              {!isMobile && step > 0 && (
                <button
                  aria-label="이전 해결 방안"
                  onClick={() => goStep(step - 1)}
                  className="absolute -left-8 top-1/2 -translate-y-1/2 z-10 text-3xl leading-none opacity-30 hover:opacity-80 transition-opacity duration-300"
                  style={{ color: "#0C0F1A" }}
                >
                  ‹
                </button>
              )}
              <div
                onMouseEnter={() => setImgHovered(true)}
                onMouseLeave={() => setImgHovered(false)}
                className="inline-block max-w-full rounded-2xl overflow-hidden border cursor-default"
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
                  style={{ maxHeight: isMobile ? "38vh" : "260px" }}
                />
              </div>
              {!isMobile && step < solutions.length - 1 && (
                <button
                  aria-label="다음 해결 방안"
                  onClick={() => goStep(step + 1)}
                  className="absolute -right-8 top-1/2 -translate-y-1/2 z-10 text-3xl leading-none opacity-30 hover:opacity-80 transition-opacity duration-300"
                  style={{ color: "#0C0F1A" }}
                >
                  ›
                </button>
              )}
            </div>
          )}
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
              {solution.flowSteps ? (
                // 단계가 순서대로 이어지는 항목(전처리 파이프라인)은 점
                // 불릿 대신 번호 배지가 붙은 카드형 그리드로 보여준다. 세로
                // 한 줄로 쌓으면 오른쪽이 텅 비어서, 2열로 채워 넓은 설명
                // 카드 폭을 실제로 활용한다 — 순서는 배지 숫자로 충분히
                // 읽히므로 화살표 커넥터는 두지 않는다.
                <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                  {solution.flowSteps.map((s, i) => (
                    <li key={i} className="flex gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                        style={{ background: hexToRgba(accentColor, 0.14), color: accentColor }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <p
                          style={{ fontFamily: "var(--font-body)" }}
                          className="text-sm font-semibold text-[#0C0F1A]"
                        >
                          {s.title}
                        </p>
                        <p
                          style={{ fontFamily: "var(--font-body)" }}
                          className="text-sm text-[#0C0F1A]/70 leading-relaxed font-normal"
                        >
                          {s.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : solution.shortBody ? (
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
    </div>
  )
}
