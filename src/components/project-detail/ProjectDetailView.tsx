import { useState, useEffect, useRef, useCallback } from "react"
import { useIsMobile } from "@/hooks/useIsMobile"
import { useSectionObserver } from "@/hooks/useSectionObserver"
import { DETAIL_PAGE_LABELS } from "@/data/navigation"
import { PROJECTS, PROJECT_DETAILS, PROJECT_ACCENT } from "@/data/projects"
import { DetailNav } from "./DetailNav"
import { OverviewSlide } from "./slides/OverviewSlide"
import { AboutSlide } from "./slides/AboutSlide"
import { ProblemSlide } from "./slides/ProblemSlide"
import { SolutionSlide } from "./slides/SolutionSlide"
import { OutcomeSlide } from "./slides/OutcomeSlide"
import { StackSlide } from "./slides/StackSlide"

export function ProjectDetailView({
  projectId,
  onClose,
  onTransition,
  // 상세 내부 슬라이드 전환마다 공유 배경의 웜프(회전·버스트)를 같이 재생해
  // 메인 페이지 전환과 동일한 애니메이션 언어를 쓰게 한다.
}: {
  projectId: string
  onClose: () => void
  onTransition: (direction: 1 | -1) => void
}) {
  const [slide, setSlide] = useState(0)
  // 뒤로가기/Escape로 닫기 시작하는 순간 true — Overview의 하단 차트가
  // 상세 패널이 실제로 닫히기(가로 슬라이드 0.75s) 전에 먼저 가라앉으며
  // 사라지는 애니메이션을 재생할 시간을 벌어준다.
  const [isClosing, setIsClosing] = useState(false)
  const animating = useRef(false)
  const touchStart = useRef<number | null>(null)
  const detail = PROJECT_DETAILS[projectId]
  const project = PROJECTS.find((p) => p.id === projectId)!
  const accent = PROJECT_ACCENT[projectId] ?? null
  const accentColor = accent?.primary ?? "#4F6EF7"
  const TOTAL_D = DETAIL_PAGE_LABELS.length
  const isMobile = useIsMobile()
  const detailSlideIds = DETAIL_PAGE_LABELS.map((_, i) => `detail-slide-${i}`)
  // 모바일(stack 모드)에서는 세로 슬라이드 트랙 대신 자연스러운 문서 스크롤을
  // 쓰므로, 활성 dot은 goSlide가 아니라 실제로 보이는 섹션을 관찰해 정한다.
  const observedSlide = useSectionObserver(detailSlideIds, isMobile)
  const displaySlide = isMobile ? observedSlide : slide

  useEffect(() => {
    setSlide(0)
    setIsClosing(false)
  }, [projectId])

  const handleClose = useCallback(() => {
    setIsClosing(true)
    onClose()
  }, [onClose])

  const goSlide = useCallback(
    (idx: number) => {
      const next = Math.max(0, Math.min(TOTAL_D - 1, idx))
      if (next === slide || animating.current) return
      animating.current = true
      onTransition(next > slide ? 1 : -1)
      setSlide(next)
      setTimeout(() => {
        animating.current = false
      }, 800)
    },
    [slide, onTransition],
  )

  const prevSlide = useCallback(() => goSlide(slide - 1), [slide, goSlide])
  const nextSlide = useCallback(() => goSlide(slide + 1), [slide, goSlide])

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // 모바일(stack 모드)에서는 세로 트랙을 강제 전환하지 않고 일반 문서
      // 스크롤을 그대로 둔다.
      if (isMobile) return
      e.preventDefault()
      if (Math.abs(e.deltaY) < 20) return
      e.deltaY > 0 ? nextSlide() : prevSlide()
    }
    window.addEventListener("wheel", onWheel, { passive: false })
    return () => window.removeEventListener("wheel", onWheel)
  }, [nextSlide, prevSlide, isMobile])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose()
        return
      }
      if (isMobile) return
      if (e.key === "ArrowDown") nextSlide()
      if (e.key === "ArrowUp") prevSlide()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [nextSlide, prevSlide, handleClose, isMobile])

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientY
    }
    const onEnd = (e: TouchEvent) => {
      if (isMobile || touchStart.current === null) return
      const delta = touchStart.current - e.changedTouches[0].clientY
      if (Math.abs(delta) > 50) delta > 0 ? nextSlide() : prevSlide()
      touchStart.current = null
    }
    window.addEventListener("touchstart", onStart, { passive: true })
    window.addEventListener("touchend", onEnd, { passive: true })
    return () => {
      window.removeEventListener("touchstart", onStart)
      window.removeEventListener("touchend", onEnd)
    }
  }, [nextSlide, prevSlide, isMobile])

  const handleDotClick = isMobile
    ? (i: number) =>
        document
          .getElementById(`detail-slide-${i}`)
          ?.scrollIntoView({ behavior: "smooth", block: "start" })
    : goSlide

  const slides = [
    <OverviewSlide
      project={project}
      projectId={projectId}
      detail={detail}
      accent={accent}
      accentColor={accentColor}
      isMobile={isMobile}
      isActive={displaySlide === 0}
      isClosing={isClosing}
    />,
    <AboutSlide
      project={project}
      detail={detail}
      accentColor={accentColor}
      isMobile={isMobile}
      isActive={displaySlide === 1}
    />,
    <ProblemSlide
      items={detail.problem}
      accent={accent}
      accentColor={accentColor}
      projectId={projectId}
      isMobile={isMobile}
      isActive={displaySlide === 2}
    />,
    <SolutionSlide
      problemItems={detail.problem}
      items={detail.solution}
      accent={accent}
      accentColor={accentColor}
      projectId={projectId}
      isMobile={isMobile}
      isActive={displaySlide === 3}
    />,
    <OutcomeSlide
      project={project}
      detail={detail}
      accent={accent}
      accentColor={accentColor}
      projectId={projectId}
      isMobile={isMobile}
      isActive={displaySlide === 4}
    />,
    <StackSlide
      tech={detail.tech}
      stackDiagram={detail.stackDiagram}
      accentColor={accentColor}
      isMobile={isMobile}
    />,
  ]

  return (
    <div
      className={
        isMobile
          ? "fixed inset-0 z-40 overflow-y-auto bg-[#EEF1F9]"
          : "w-screen h-screen relative overflow-hidden"
      }
    >
      {/* 배경은 자체 색을 칠하지 않고 App의 공유 GradientBackground를 그대로
          비쳐 보이게 둔다 — 리스트 호버와 같은 방식으로 이 프로젝트의 색이
          깔린다 */}
      {/* 좌측 네비게이터 — 메인과 동일한 구조 */}
      <DetailNav
        slide={displaySlide}
        onClose={handleClose}
        goSlide={handleDotClick}
        accent={accent}
        isMobile={isMobile}
      />

      {/* 세로 슬라이드 트랙: 모바일은 자연스러운 문서 스크롤, 데스크톱/태블릿은
          transform 기반 세로 슬라이드 */}
      <div
        className="flex flex-col"
        style={
          isMobile
            ? undefined
            : {
                transform: `translateY(-${slide * 100}vh)`,
                transition: "transform 0.75s cubic-bezier(0.77,0,0.18,1)",
                height: `${TOTAL_D * 100}vh`,
                willChange: "transform",
              }
        }
      >
        {slides.map((s, i) => (
          <div
            key={i}
            id={isMobile ? detailSlideIds[i] : undefined}
            className={isMobile ? "w-full" : "h-screen w-full shrink-0"}
          >
            {s}
          </div>
        ))}
      </div>

      {/* 하단 카운터 — DetailNav와 같은 이유로 데스크톱에서는 absolute를 써야
          translateX 래퍼와 함께 슬라이드-인 된다. Overview 슬라이드는 하단에
          장식 막대 차트가 깔려 카운터가 묻히므로, 그 슬라이드에서만 뒤에
          은은한 배경을 페이드 인/아웃시켜 대비를 보정한다 — 배경은 절대
          위치로 텍스트 뒤에 깔아 패딩이 텍스트 위치 자체를 밀지 않게 한다. */}
      <div
        style={{ fontFamily: "var(--font-mono)" }}
        className={
          (isMobile ? "fixed" : "absolute") +
          " bottom-6 left-6 text-xs text-[#0C0F1A]/25 select-none"
        }
      >
        <span
          aria-hidden
          className="absolute -inset-x-2 -inset-y-1 rounded-full bg-white/35 backdrop-blur-sm transition-opacity duration-500 pointer-events-none"
          style={{
            opacity: displaySlide === 0 && detail.outcomeImage ? 1 : 0,
          }}
        />
        <span className="relative">
          {String(displaySlide + 1).padStart(2, "0")} /{" "}
          {String(TOTAL_D).padStart(2, "0")}
        </span>
      </div>
    </div>
  )
}
