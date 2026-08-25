import { useEffect, useState } from "react"
import type { ProjectDetailCardItem } from "@/data/projects"
import type { ProjectAccent } from "@/lib/color"
import { hexToRgba, mixWithWhite } from "@/lib/color"
import { AccentPill } from "../AccentPill"

const SLIDE_TRANSITION_MS = 750
// 스텝 전환 시 콘텐츠가 가로로 미끄러져 들어오고/나가는 거리와, 그 이동의
// transform·opacity가 실제로 걸리는 시간(SlideStep의 transition과 맞춰야 함)
const STEP_SLIDE_PX = 40
const STEP_SLIDE_MS = 550

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

interface SlideStepProps {
  children: React.ReactNode
  fromX: number
  toX: number
  fromOpacity: number
  toOpacity: number
  // 이탈 중인(곧 사라질) 카피는 마우스 이벤트를 받지 않게 한다
  interactive: boolean
}

// 스텝 전환용 범용 래퍼 — mount 직후 한 틱 뒤에 from → to로 값을 바꿔
// transition이 실제로 재생되게 한다. 같은 컴포넌트를 진입(반대 방향에서
// 들어오는 새 스텝)과 이탈(같은 방향으로 빠져나가는 이전 스텝) 양쪽에
// from/to 값만 바꿔서 재사용한다.
function SlideStep({ children, fromX, toX, fromOpacity, toOpacity, interactive }: SlideStepProps) {
  const [on, setOn] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      // 두 카피(이탈/진입)를 같은 grid-area에 겹쳐 쌓는다 — absolute를 쓰면
      // 부모가 콘텐츠 높이를 잃어버리는데, grid 스택은 자식들 중 가장 큰
      // 것에 맞춰 부모가 자동으로 높이를 잡아줘서 그 문제가 없다
      className="[grid-area:1/1] w-full"
      style={{
        transform: `translateX(${on ? toX : fromX}px)`,
        opacity: on ? toOpacity : fromOpacity,
        transition: `transform ${STEP_SLIDE_MS}ms cubic-bezier(0.16,1,0.3,1), opacity ${STEP_SLIDE_MS - 100}ms ease-out`,
        pointerEvents: interactive ? "auto" : "none",
      }}
    >
      {children}
    </div>
  )
}

// Fintag SOLUTION 전용 — 3개의 해결 방안을 PROBLEM과 1:1로 짝지어 한 번에
// 하나씩 보여준다. 탭(또는 이미지 옆 화살표)으로 스텝을 넘기면, 넘어간
// 방향에서 새 콘텐츠가 들어오고 이전 콘텐츠는 반대 방향으로 빠져나간다.
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
  // 방금까지 보이고 있던 스텝 — 새 스텝이 들어오는 동안 반대 방향으로
  // 빠져나가는 애니메이션을 재생할 때만 잠깐 유지한다
  const [prevStep, setPrevStep] = useState<number | null>(null)
  // 다음(1)으로 넘어갔는지 이전(-1)으로 넘어갔는지 — 새 스텝이 어느
  // 방향에서 들어올지, 이전 스텝이 어느 방향으로 빠질지를 결정한다
  const [direction, setDirection] = useState<1 | -1>(1)
  const [imgHovered, setImgHovered] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!isActive) {
      setRevealed(false)
      return
    }
    setStep(0)
    setPrevStep(null)
    const timer = setTimeout(() => setRevealed(true), SLIDE_TRANSITION_MS)
    return () => clearTimeout(timer)
  }, [isActive])

  // step이 바뀌고 나면(=탭·화살표 전환 직후) 슬라이드 애니메이션이 끝날
  // 시간만큼만 이전 스텝 카피를 유지했다가 정리한다
  useEffect(() => {
    if (prevStep === null) return
    const timer = setTimeout(() => setPrevStep(null), STEP_SLIDE_MS)
    return () => clearTimeout(timer)
  }, [step, prevStep])

  const goStep = (next: number) => {
    const clamped = Math.max(0, Math.min(solutions.length - 1, next))
    if (clamped === step) return
    setDirection(clamped > step ? 1 : -1)
    setPrevStep(step)
    setStep(clamped)
  }

  const solution = solutions[step]

  // 타이틀 + 이미지(화살표 포함) + 설명 카드 + 태그 한 스텝 분량 — 현재
  // 보이는 카피와 빠져나가는 카피가 화살표 로직까지 완전히 동일해서
  // 하나로 뽑아 쓴다. idx는 이 콘텐츠가 실제로 나타내는 스텝 번호(빠져
  // 나가는 카피는 step과 다를 수 있음), interactive는 마우스/클릭을
  // 받을지 여부다.
  const renderStepContent = (idx: number, item: ProjectDetailCardItem, interactive: boolean) => (
    <div className="flex flex-col gap-3">
      <h3
        style={{ fontFamily: "var(--font-body)" }}
        className="text-xl font-semibold text-[#0C0F1A]"
      >
        {item.title}
      </h3>
      {item.image && (
        <div
          className="relative flex items-center justify-center"
          style={{ height: isMobile ? undefined : "260px" }}
        >
          {!isMobile && idx > 0 && (
            <button
              aria-label="이전 해결 방안"
              onClick={() => goStep(idx - 1)}
              className="absolute -left-8 top-1/2 -translate-y-1/2 z-10 text-3xl leading-none opacity-30 hover:opacity-80 transition-opacity duration-300"
              style={{
                color: "#0C0F1A",
                pointerEvents: interactive ? "auto" : "none",
              }}
            >
              ‹
            </button>
          )}
          <div
            onMouseEnter={interactive ? () => setImgHovered(true) : undefined}
            onMouseLeave={interactive ? () => setImgHovered(false) : undefined}
            className="inline-block max-w-full rounded-2xl overflow-hidden border cursor-default"
            style={{
              borderColor:
                interactive && imgHovered
                  ? hexToRgba(accentColor, 0.35)
                  : "rgba(12,15,26,0.1)",
              boxShadow:
                interactive && imgHovered
                  ? `0 20px 45px -14px ${hexToRgba(accentColor, 0.35)}, 0 8px 18px -8px rgba(12,15,26,0.28)`
                  : "0 14px 34px -18px rgba(12,15,26,0.24), 0 4px 10px -6px rgba(12,15,26,0.12)",
              transform:
                interactive && imgHovered
                  ? "translateY(-3px) scale(1.008)"
                  : "translateY(0) scale(1)",
              transition:
                "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease-out, border-color 0.4s ease-out",
            }}
          >
            <img
              src={item.image}
              alt=""
              aria-hidden="true"
              loading="lazy"
              width={imageWidth}
              height={imageHeight}
              className="block w-auto h-auto max-w-full"
              style={{ maxHeight: isMobile ? "38vh" : "260px" }}
            />
          </div>
          {!isMobile && idx < solutions.length - 1 && (
            <button
              aria-label="다음 해결 방안"
              onClick={() => goStep(idx + 1)}
              className="absolute -right-8 top-1/2 -translate-y-1/2 z-10 text-3xl leading-none opacity-30 hover:opacity-80 transition-opacity duration-300"
              style={{
                color: "#0C0F1A",
                pointerEvents: interactive ? "auto" : "none",
              }}
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
          {item.shortBody ? (
            <ul className="flex flex-col gap-1.5">
              {item.shortBody.map((line, i) => (
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
              {item.body}
            </p>
          )}
        </div>
      </div>
      {item.tags && (
        <div className="flex flex-wrap gap-2">
          {item.tags.map((t) => (
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
  )

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

        <div className="grid w-full">
          {prevStep !== null && (
            <SlideStep
              key={`prev-${prevStep}`}
              fromX={0}
              toX={direction * -STEP_SLIDE_PX}
              fromOpacity={1}
              toOpacity={0}
              interactive={false}
            >
              {renderStepContent(prevStep, solutions[prevStep], false)}
            </SlideStep>
          )}
          <SlideStep
            key={`current-${step}`}
            fromX={direction * STEP_SLIDE_PX}
            toX={0}
            fromOpacity={0}
            toOpacity={1}
            interactive
          >
            {renderStepContent(step, solution, true)}
          </SlideStep>
        </div>
      </div>
    </div>
  )
}
