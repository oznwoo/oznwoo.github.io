import { useEffect, useState } from "react"
import type { Project, ProjectDetail } from "@/data/projects"
import { hexToRgba } from "@/lib/color"

const SLIDE_TRANSITION_MS = 750

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
          tabLabel: "담당 역할",
          headline: detail.roleHeadline ?? "",
          body: detail.roleBody ?? "",
          image: detail.roleImage,
          imageAlt: `${project.title} 담당 기능 화면`,
          imageWidth: 1818,
          imageHeight: 1016,
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
  const [shotHovered, setShotHovered] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!isActive) {
      // step은 여기서 리셋하지 않는다 — 즉시 리셋하면 key={step} 때문에
      // 지금 보고 있던 스텝(예: 담당 역할)이 사라지는 애니메이션 없이
      // 바로 첫 스텝으로 바뀌어 버린다. 대신 revealed만 꺼서 지금 보이는
      // 자리에서 화살표·텍스트가 페이드아웃되게 하고, step은 다음에 다시
      // 들어올 때(아래 else 분기)에만 0으로 되돌린다.
      setRevealed(false)
      return
    }
    setStep(0)
    const timer = setTimeout(() => setRevealed(true), SLIDE_TRANSITION_MS)
    return () => clearTimeout(timer)
  }, [isActive])

  const goStep = (next: number) => {
    const clamped = Math.max(0, Math.min(steps.length - 1, next))
    if (clamped === step) return
    setStep(clamped)
    setShotHovered(false)
  }

  const current = steps[step]

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

        <div
          key={step}
          style={{
            animation: hasRole ? "step-in 0.5s cubic-bezier(0.16,1,0.3,1) both" : undefined,
            // 스텝마다 이미지 비율·본문 길이가 달라 전환 시 이미지·텍스트
            // 위치가 위아래로 밀리지 않도록, 콘텐츠 영역 높이를 고정한다
            minHeight: hasRole && !isMobile ? "600px" : undefined,
          }}
          className="flex flex-col items-center gap-8 w-full"
        >
          {current.image && (
            <div className="relative flex items-center justify-center w-full">
              {hasRole && !isMobile && step > 0 && (
                <div
                  className="absolute -left-10 top-1/2 z-10"
                  style={{
                    // 진입 시 왼쪽에서 오른쪽으로 나타나고, 슬라이드를 벗어날 때는
                    // (revealed가 다시 false가 되며) 같은 값을 거꾸로 통과해
                    // 나타난 방향과 반대로(오른쪽에서 왼쪽으로) 사라진다
                    transform: `translateY(-50%) translateX(${revealed ? 0 : -10}px)`,
                    opacity: revealed ? 1 : 0,
                    transition:
                      "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease-out",
                    pointerEvents: revealed ? "auto" : "none",
                  }}
                >
                  <button
                    aria-label="이전"
                    onClick={() => goStep(step - 1)}
                    className="text-3xl leading-none opacity-30 hover:opacity-80 transition-opacity duration-300"
                    style={{ color: "#0C0F1A" }}
                  >
                    ‹
                  </button>
                </div>
              )}
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
                  src={current.image}
                  alt={current.imageAlt}
                  // 두 번째 슬라이드라 진입 직후 곧바로 보이는데, transform 기반
                  // 세로 슬라이드 트랙에서는 loading="lazy"의 뷰포트 교차 판정이
                  // 갱신되지 않아 스크롤 없이는 이미지가 영영 로드되지 않는
                  // 문제가 있었다 — eager로 바꿔 우회한다.
                  loading="eager"
                  width={current.imageWidth}
                  height={current.imageHeight}
                  className="w-full h-auto block"
                />
              </div>
              {hasRole && !isMobile && step < steps.length - 1 && (
                <div
                  className="absolute -right-10 top-1/2 z-10"
                  style={{
                    // 진입 시 왼쪽에서 오른쪽으로 나타나고, 슬라이드를 벗어날 때는
                    // (revealed가 다시 false가 되며) 같은 값을 거꾸로 통과해
                    // 나타난 방향과 반대로(오른쪽에서 왼쪽으로) 사라진다
                    transform: `translateY(-50%) translateX(${revealed ? 0 : -10}px)`,
                    opacity: revealed ? 1 : 0,
                    transition:
                      "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease-out",
                    pointerEvents: revealed ? "auto" : "none",
                  }}
                >
                  <button
                    aria-label="다음"
                    onClick={() => goStep(step + 1)}
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
              {current.headline}
            </p>
            {/* 마크다운 h2/본문 느낌 — 구체적인 과정·성과는 작고 옅게 보조 설명으로.
                문장 중간에서 줄바꿈되면 가독성이 떨어져서, 문장 경계에서만
                줄바꿈되도록 문장 단위로 나눠 각각 한 줄로 보여준다 */}
            <p
              style={{ fontFamily: "var(--font-body)" }}
              className="text-sm sm:text-base text-[#0C0F1A]/55 leading-relaxed font-normal"
            >
              {splitSentences(current.body).map((sentence, i) => (
                <span key={i} className="block sm:whitespace-nowrap">
                  {sentence}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
