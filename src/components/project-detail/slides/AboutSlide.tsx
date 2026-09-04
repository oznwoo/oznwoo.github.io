import { useEffect, useState } from "react"
import { TabArrowButton } from "@/components/project-detail/TabArrowButton"
import type { Project, ProjectDetail } from "@/data/projects"
import type { ProjectAccent } from "@/lib/color"
import { hexToRgba } from "@/lib/color"
import { renderWithEmphasis } from "@/lib/emphasis"
import { MediaPlaceholder } from "@/components/project-detail/MediaPlaceholder"
import { useHorizontalStepKeys } from "@/hooks/useHorizontalStepKeys"

const SLIDE_TRANSITION_MS = 750

interface AboutSlideProps {
  project: Project
  detail: ProjectDetail
  accent: ProjectAccent | null
  accentColor: string
  projectId: string
  isMobile: boolean
  isActive: boolean
}

interface AboutStep {
  tabLabel: string
  headline: string
  body: string
  // 이 스텝의 미디어 종류 — 실제 image/video 값이 아직 없어도 이 값으로
  // 어떤 종류의 자리표시자를 보여줄지 정한다
  kind: "image" | "video"
  image?: string
  imageAlt?: string
  imageWidth?: number
  imageHeight?: number
  // 이미지 대신 시연 영상을 보여줄 스텝(선택) — image와 함께 쓰지 않는다
  video?: string
  videoPoster?: string
}

// 본문을 문장 단위로 쪼갠다 — 문장 중간이 아니라 문장 경계에서만
// 줄바꿈되게 하려고, 마침표(.!?) 뒤 공백을 기준으로 나눈다.
function splitSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).filter(Boolean)
}

// 소개 — Overview 히어로 다음, 프로젝트를 실제로 설명하는 전용 화면.
// roleImage·demoVideo가 있는 만큼 SOLUTION 쇼케이스와 같은 탭+화살표
// 패턴으로 "무엇을 만들었나"/"내가 맡은 역할"/"시연 영상" 스텝이 늘어나고,
// 아무것도 없는 프로젝트는 기존처럼 탭 없이 소개 문단(+about 이미지)
// 하나만 보여준다.
export function AboutSlide({
  project,
  detail,
  accent,
  accentColor,
  projectId,
  isMobile,
  isActive,
}: AboutSlideProps) {
  // 프로젝트 소개는 항상 있고, roleHeadline·demoHeadline이 있는 프로젝트만
  // 그만큼 스텝이 늘어난다. 실제 이미지/영상은 나중에 채워질 수 있으므로
  // 스텝 존재 여부는 텍스트(headline) 기준으로 판단하고, 미디어가 아직
  // 없으면 자리표시자를 보여준다. 탭+화살표 UI는 스텝이 2개 이상일 때만
  // 켠다(hasTabs).
  const steps: AboutStep[] = [
    {
      tabLabel: "프로젝트 소개",
      headline: detail.overviewHeadline,
      body: detail.overviewBody,
      kind: "image",
      image: detail.aboutImage,
      imageAlt: `${project.title} 홈페이지 히어로 화면`,
      imageWidth: 1590,
      imageHeight: 956,
    },
  ]
  if (detail.roleHeadline) {
    steps.push({
      tabLabel: "담당 업무",
      headline: detail.roleHeadline,
      body: detail.roleBody ?? "",
      kind: "image",
      image: detail.roleImage,
      imageAlt: `${project.title} 담당 기능 화면`,
      imageWidth: 1830,
      imageHeight: 1014,
    })
  }
  if (detail.demoHeadline) {
    steps.push({
      tabLabel: "시연 영상",
      headline: detail.demoHeadline,
      body: detail.demoBody ?? "",
      kind: "video",
      video: detail.demoVideo,
      videoPoster: detail.demoPoster,
    })
  }
  const hasTabs = steps.length > 1

  const [step, setStep] = useState(0)
  const [shotHovered, setShotHovered] = useState(false)
  const [revealed, setRevealed] = useState(false)

  // 슬라이드를 나갔다 다시 들어와도 보던 스텝을 그대로 유지한다 — step은
  // 여기서 건드리지 않고, 프로젝트 자체가 바뀔 때만(아래 별도 effect) 0으로
  // 되돌린다.
  useEffect(() => {
    if (!isActive) {
      setRevealed(false)
      setShotHovered(false)
      return
    }
    const timer = setTimeout(() => setRevealed(true), SLIDE_TRANSITION_MS)
    return () => clearTimeout(timer)
  }, [isActive])

  // 프로젝트가 바뀌면 이전 프로젝트에서 남은 step이 새 프로젝트의 스텝
  // 개수(hasTabs 여부에 따라 다름) 범위를 벗어날 수 있어 강제로 리셋한다.
  useEffect(() => {
    setStep(0)
  }, [project.id])

  const goStep = (next: number) => {
    const clamped = Math.max(0, Math.min(steps.length - 1, next))
    if (clamped === step) return
    setStep(clamped)
    setShotHovered(false)
  }

  // 좌우 화살표 버튼이 떠 있는 상황(데스크톱 + 스텝 2개 이상)에서는
  // 키보드 ←/→로도 같은 스텝 이동을 할 수 있게 한다.
  useHorizontalStepKeys({
    enabled: isActive && !isMobile && hasTabs,
    onPrev: () => goStep(step - 1),
    onNext: () => goStep(step + 1),
  })

  const current = steps[step]

  return (
    <div
      className={
        isMobile
          ? "min-h-screen w-full flex items-center justify-center text-center pl-16 pr-6 py-20"
          : "min-h-screen flex items-center justify-center px-8 md:px-16 shrink-0 text-center py-16"
      }
    >
      <div
        className={
          (hasTabs
            ? "max-w-3xl"
            : detail.aboutImage
              ? "max-w-3xl"
              : "max-w-2xl") + " w-full flex flex-col items-center gap-8"
        }
      >
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase"
        >
          About
        </span>

        {hasTabs && (
          <span
            style={{
              fontFamily: "var(--font-body)",
              color: "#0C0F1A",
              transform: revealed ? "translateY(0)" : "translateY(10px)",
              opacity: revealed ? 1 : 0,
              transition:
                "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease-out",
            }}
            className="text-base font-semibold"
          >
            {current.tabLabel}
          </span>
        )}

        <div
          key={step}
          style={{
            animation: hasTabs
              ? "step-in 0.5s cubic-bezier(0.16,1,0.3,1) both"
              : undefined,
            // 스텝마다 이미지 비율·본문 길이가 달라 전환 시 이미지·텍스트
            // 위치가 위아래로 밀리지 않도록, 콘텐츠 영역 높이를 고정한다
            minHeight: hasTabs && !isMobile ? "600px" : undefined,
          }}
          className="flex flex-col items-center gap-8 w-full"
        >
          {(hasTabs || current.image || current.video) && (
            <div className="relative flex items-center justify-center w-full">
              {hasTabs && !isMobile && step > 0 && (
                <TabArrowButton
                  direction="prev"
                  label={steps[step - 1]?.tabLabel || "이전"}
                  onClick={() => goStep(step - 1)}
                  revealed={revealed}
                  extraHintActive={shotHovered}
                  accent={accent}
                  accentColor={accentColor}
                  projectId={projectId}
                  offsetClassName="-left-16"
                />
              )}
              <div
                onMouseEnter={() => setShotHovered(true)}
                onMouseLeave={() => setShotHovered(false)}
                className={
                  "w-full rounded-2xl overflow-hidden border cursor-default" +
                  (hasTabs ? " bg-white" : "")
                }
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
                  // 스텝마다 이미지 원본 비율이 달라 w-full h-auto로 두면 스텝
                  // 전환 시 이미지 크기가 눈에 띄게 달라진다. 두 스텝 중 더
                  // 작게 보이는 담당 업무 이미지 비율로 박스를 고정하고,
                  // object-contain으로 잘리지 않게 넣어 항상 같은 크기로 보이게 한다
                  aspectRatio: hasTabs ? "1830 / 1014" : undefined,
                }}
              >
                {current.kind === "video" ? (
                  current.video ? (
                    // 시연 영상 — 포스터 프레임만 먼저 보여주고, 실제로 재생
                    // 버튼을 눌러야 영상 바이트를 받아오게 해 초기 로드에
                    // 영향을 주지 않는다(preload="none")
                    <video
                      key={current.video}
                      src={current.video}
                      poster={current.videoPoster}
                      controls
                      preload="none"
                      className="w-full h-full block object-contain"
                    />
                  ) : (
                    <MediaPlaceholder
                      kind="video"
                      accentColor={accentColor}
                      className="w-full h-full"
                    />
                  )
                ) : current.image ? (
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
                    className={
                      hasTabs
                        ? "w-full h-full block object-contain"
                        : "w-full h-auto block"
                    }
                  />
                ) : (
                  <MediaPlaceholder
                    kind="image"
                    accentColor={accentColor}
                    className="w-full h-full"
                  />
                )}
              </div>
              {hasTabs && !isMobile && step < steps.length - 1 && (
                <TabArrowButton
                  direction="next"
                  label={steps[step + 1]?.tabLabel || "다음"}
                  onClick={() => goStep(step + 1)}
                  revealed={revealed}
                  extraHintActive={shotHovered}
                  accent={accent}
                  accentColor={accentColor}
                  projectId={projectId}
                  offsetClassName="-right-16"
                />
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
              className="text-lg sm:text-xl font-semibold text-[#0C0F1A]"
            >
              {current.headline}
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
              {splitSentences(current.body).map((sentence, i) => (
                <span
                  key={i}
                  className="block w-fit mx-auto sm:whitespace-nowrap"
                >
                  {renderWithEmphasis(sentence)}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
