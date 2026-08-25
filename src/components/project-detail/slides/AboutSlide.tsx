import { useEffect, useState } from "react"
import type { Project, ProjectDetail } from "@/data/projects"
import { hexToRgba } from "@/lib/color"

const SLIDE_TRANSITION_MS = 750
// 스텝 전환 시 콘텐츠가 가로로 미끄러져 들어오고/나가는 거리와, 그 이동의
// transform·opacity가 실제로 걸리는 시간(SlideStep의 transition과 맞춰야 함)
const STEP_SLIDE_PX = 40
const STEP_SLIDE_MS = 550

interface AboutSlideProps {
  project: Project
  detail: ProjectDetail
  accentColor: string
  isMobile: boolean
  isActive: boolean
}

interface AboutStep {
  tabLabel: string
  headline: string
  body: string
  image?: string
  imageAlt: string
  imageWidth: number
  imageHeight: number
}

// 본문을 문장 단위로 쪼갠다 — 문장 중간이 아니라 문장 경계에서만
// 줄바꿈되게 하려고, 마침표(.!?) 뒤 공백을 기준으로 나눈다.
function splitSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).filter(Boolean)
}

// PROBLEM/SOLUTION 카드와 동일한 규칙 — 텍스트 안의 **강조** 구간만
// 굵게 렌더링해, 옅은 본문 톤 안에서도 핵심 단어가 눈에 들어오게 한다.
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
      // 부모가 콘텐츠 높이를 잃어 모바일처럼 고정 높이를 주지 않는
      // 화면에서 박스가 찌그러지는데, grid 스택은 자식들 중 가장 큰
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

// 소개 — Overview 히어로 다음, 프로젝트를 실제로 설명하는 전용 화면.
// roleImage가 있는 프로젝트는 SOLUTION 쇼케이스와 같은 탭+화살표 패턴으로
// "무엇을 만들었나"/"내가 맡은 역할" 두 스텝을 한 번에 하나씩 보여주고,
// 없는 프로젝트는 기존처럼 탭 없이 소개 문단(+about 이미지) 하나만 보여준다.
export function AboutSlide({ project, detail, accentColor, isMobile, isActive }: AboutSlideProps) {
  const hasRole = Boolean(detail.roleImage)

  const steps: AboutStep[] = hasRole
    ? [
        {
          tabLabel: "프로젝트 소개",
          headline: detail.overviewHeadline,
          body: detail.overviewBody,
          image: detail.aboutImage,
          imageAlt: `${project.title} 홈페이지 히어로 화면`,
          imageWidth: 1590,
          imageHeight: 956,
        },
        {
          tabLabel: "담당 업무",
          headline: detail.roleHeadline ?? "",
          body: detail.roleBody ?? "",
          image: detail.roleImage,
          imageAlt: `${project.title} 담당 기능 화면`,
          imageWidth: 1830,
          imageHeight: 1014,
        },
      ]
    : [
        {
          tabLabel: "",
          headline: detail.overviewHeadline,
          body: detail.overviewBody,
          image: detail.aboutImage,
          imageAlt: `${project.title} 홈페이지 히어로 화면`,
          imageWidth: 1590,
          imageHeight: 956,
        },
      ]

  const [step, setStep] = useState(0)
  // 방금까지 보이고 있던 스텝 — 새 스텝이 들어오는 동안 반대 방향으로
  // 빠져나가는 애니메이션을 재생할 때만 잠깐 유지한다
  const [prevStep, setPrevStep] = useState<number | null>(null)
  // 다음(1)으로 넘어갔는지 이전(-1)으로 넘어갔는지 — 새 스텝이 어느
  // 방향에서 들어올지, 이전 스텝이 어느 방향으로 빠질지를 결정한다
  const [direction, setDirection] = useState<1 | -1>(1)
  const [shotHovered, setShotHovered] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!isActive) {
      // step은 여기서 리셋하지 않는다 — 즉시 리셋하면 지금 보고 있던
      // 스텝(예: 담당 업무)이 사라지는 애니메이션 없이 바로 첫 스텝으로
      // 바뀌어 버린다. 대신 revealed만 꺼서 지금 보이는 자리에서
      // 화살표·텍스트가 페이드아웃되게 하고, step은 다음에 다시 들어올
      // 때(아래 else 분기)에만 0으로 되돌린다.
      setRevealed(false)
      return
    }
    setStep(0)
    setPrevStep(null)
    const timer = setTimeout(() => setRevealed(true), SLIDE_TRANSITION_MS)
    return () => clearTimeout(timer)
  }, [isActive])

  // step이 바뀌고 나면(=화살표 전환 직후) 슬라이드 애니메이션이 끝날 시간
  // 만큼만 이전 스텝 카피를 유지했다가 정리한다
  useEffect(() => {
    if (prevStep === null) return
    const timer = setTimeout(() => setPrevStep(null), STEP_SLIDE_MS)
    return () => clearTimeout(timer)
  }, [step, prevStep])

  const goStep = (next: number) => {
    const clamped = Math.max(0, Math.min(steps.length - 1, next))
    if (clamped === step) return
    setDirection(clamped > step ? 1 : -1)
    setPrevStep(step)
    setStep(clamped)
    setShotHovered(false)
  }

  const current = steps[step]

  // 이미지 + 화살표 + 헤드라인/본문 한 스텝 분량 — 현재 보이는 카피와
  // 빠져나가는 카피가 화살표 로직까지 완전히 동일해서 하나로 뽑아 쓴다.
  // idx는 이 콘텐츠가 실제로 나타내는 스텝 번호(빠져나가는 카피는 step과
  // 다를 수 있음), interactive는 마우스/클릭을 받을지 여부다.
  const renderStepContent = (idx: number, s: AboutStep, interactive: boolean) => (
    <div className="flex flex-col items-center gap-8 w-full">
      {s.image && (
        <div className="relative flex items-center justify-center w-full">
          {hasRole && !isMobile && idx > 0 && (
            <div
              className="absolute -left-10 top-1/2 z-10"
              style={{
                transform: `translateY(-50%) translateX(${revealed ? 0 : -10}px)`,
                opacity: revealed ? 1 : 0,
                transition:
                  "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease-out",
                pointerEvents: interactive && revealed ? "auto" : "none",
              }}
            >
              <button
                aria-label="이전"
                onClick={() => goStep(idx - 1)}
                className="text-3xl leading-none opacity-30 hover:opacity-80 transition-opacity duration-300"
                style={{ color: "#0C0F1A" }}
              >
                ‹
              </button>
            </div>
          )}
          <div
            onMouseEnter={interactive ? () => setShotHovered(true) : undefined}
            onMouseLeave={interactive ? () => setShotHovered(false) : undefined}
            className={
              "w-full rounded-2xl overflow-hidden border cursor-default" +
              (hasRole ? " bg-white" : "")
            }
            style={{
              borderColor:
                interactive && shotHovered
                  ? hexToRgba(accentColor, 0.35)
                  : "rgba(12,15,26,0.1)",
              // 앰비언트(넓고 옅은) + 컨택트(좁고 진한) 그림자를 겹쳐 입체감을
              // 주고, hover 시 accent 컬러가 은은하게 번지는 그림자로 전환한다
              boxShadow:
                interactive && shotHovered
                  ? `0 32px 70px -18px ${hexToRgba(accentColor, 0.35)}, 0 10px 26px -10px rgba(12,15,26,0.3)`
                  : "0 24px 60px -24px rgba(12,15,26,0.28), 0 6px 16px -8px rgba(12,15,26,0.14)",
              transform:
                interactive && shotHovered
                  ? "translateY(-4px) scale(1.012)"
                  : "translateY(0) scale(1)",
              transition:
                "transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s ease-out, border-color 0.45s ease-out",
              // 스텝마다 이미지 원본 비율이 달라 w-full h-auto로 두면 스텝
              // 전환 시 이미지 크기가 눈에 띄게 달라진다. 두 스텝 중 더
              // 작게 보이는 담당 업무 이미지 비율로 박스를 고정하고,
              // object-contain으로 잘리지 않게 넣어 항상 같은 크기로 보이게 한다
              aspectRatio: hasRole ? "1830 / 1014" : undefined,
            }}
          >
            <img
              src={s.image}
              alt={s.imageAlt}
              // 두 번째 슬라이드라 진입 직후 곧바로 보이는데, transform 기반
              // 세로 슬라이드 트랙에서는 loading="lazy"의 뷰포트 교차 판정이
              // 갱신되지 않아 스크롤 없이는 이미지가 영영 로드되지 않는
              // 문제가 있었다 — eager로 바꿔 우회한다.
              loading="eager"
              width={s.imageWidth}
              height={s.imageHeight}
              className={
                hasRole ? "w-full h-full block object-contain" : "w-full h-auto block"
              }
            />
          </div>
          {hasRole && !isMobile && idx < steps.length - 1 && (
            <div
              className="absolute -right-10 top-1/2 z-10"
              style={{
                transform: `translateY(-50%) translateX(${revealed ? 0 : -10}px)`,
                opacity: revealed ? 1 : 0,
                transition:
                  "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease-out",
                pointerEvents: interactive && revealed ? "auto" : "none",
              }}
            >
              <button
                aria-label="다음"
                onClick={() => goStep(idx + 1)}
                className="text-3xl leading-none opacity-30 hover:opacity-80 transition-opacity duration-300"
                style={{ color: "#0C0F1A" }}
              >
                ›
              </button>
            </div>
          )}
        </div>
      )}
      <div
        className="flex flex-col gap-3 w-full"
        style={{
          transform: revealed ? "translateY(0)" : "translateY(-10px)",
          opacity: revealed ? 1 : 0,
          transition:
            "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease-out",
        }}
      >
        {/* 마크다운 h1 느낌 — 무엇을 만들었고 무슨 역할을 맡았는지 한 줄로
            크고 진하게 먼저 보여준다 */}
        <p
          style={{ fontFamily: "var(--font-body)", lineHeight: 1.35 }}
          className="text-lg sm:text-xl font-medium text-[#0C0F1A]"
        >
          {s.headline}
        </p>
        {/* 마크다운 h2/본문 느낌 — 구체적인 과정·성과는 작고 옅게 보조 설명으로.
            문장 중간에서 줄바꿈되면 가독성이 떨어져서, 문장 경계에서만
            줄바꿈되도록 문장 단위로 나눠 각각 한 줄로 보여준다. 크기·명도를
            올리는 대신, 핵심 단어만 **강조**로 굵게 표시해 옅은 텍스트
            안에서도 눈에 잘 들어오는 지점을 만든다 */}
        <p
          style={{ fontFamily: "var(--font-body)" }}
          className="text-sm sm:text-base text-[#0C0F1A]/55 leading-relaxed font-normal"
        >
          {splitSentences(s.body).map((sentence, i) => (
            <span key={i} className="block sm:whitespace-nowrap">
              {renderWithEmphasis(sentence)}
            </span>
          ))}
        </p>
      </div>
    </div>
  )

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
          (hasRole ? "max-w-3xl" : detail.aboutImage ? "max-w-3xl" : "max-w-2xl") +
          " w-full flex flex-col items-center gap-8"
        }
      >
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase"
        >
          About
        </span>

        {hasRole && (
          <span
            style={{
              fontFamily: "var(--font-body)",
              color: "#0C0F1A",
              transform: revealed ? "translateY(0)" : "translateY(10px)",
              opacity: revealed ? 1 : 0,
              transition:
                "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease-out",
            }}
            className="text-sm font-medium"
          >
            {current.tabLabel}
          </span>
        )}

        {hasRole ? (
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
                {renderStepContent(prevStep, steps[prevStep], false)}
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
              {renderStepContent(step, current, true)}
            </SlideStep>
          </div>
        ) : (
          renderStepContent(step, current, true)
        )}
      </div>
    </div>
  )
}
