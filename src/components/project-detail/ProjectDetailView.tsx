import { useState, useEffect, useRef, useCallback } from "react"
import { useIsMobile } from "@/hooks/useIsMobile"
import { useSectionObserver } from "@/hooks/useSectionObserver"
import { DETAIL_PAGE_LABELS } from "@/data/navigation"
import { PROJECTS, PROJECT_DETAILS, PROJECT_ACCENT } from "@/data/projects"
import { hexToRgba } from "@/lib/color"
import { DetailIcon } from "./DetailIcon"
import { DetailNav } from "./DetailNav"
import { HeroBarChart } from "./HeroBarChart"

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
  const animating = useRef(false)
  const touchStart = useRef<number | null>(null)
  const detail = PROJECT_DETAILS[projectId]
  const project = PROJECTS.find((p) => p.id === projectId)!
  const accentColor = PROJECT_ACCENT[projectId]?.primary ?? "#4F6EF7"
  const TOTAL_D = DETAIL_PAGE_LABELS.length
  const isMobile = useIsMobile()
  const detailSlideIds = DETAIL_PAGE_LABELS.map((_, i) => `detail-slide-${i}`)
  // 모바일(stack 모드)에서는 세로 슬라이드 트랙 대신 자연스러운 문서 스크롤을
  // 쓰므로, 활성 dot은 goSlide가 아니라 실제로 보이는 섹션을 관찰해 정한다.
  const observedSlide = useSectionObserver(detailSlideIds, isMobile)
  const displaySlide = isMobile ? observedSlide : slide

  useEffect(() => {
    setSlide(0)
  }, [projectId])

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
        onClose()
        return
      }
      if (isMobile) return
      if (e.key === "ArrowDown") nextSlide()
      if (e.key === "ArrowUp") prevSlide()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [nextSlide, prevSlide, onClose, isMobile])

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

  const slideWrapClass = isMobile
    ? "min-h-screen w-full flex items-center justify-center px-6 pl-16 py-20"
    : "h-screen flex items-center justify-center px-8 md:px-20 shrink-0"

  const handleDotClick = isMobile
    ? (i: number) =>
        document
          .getElementById(`detail-slide-${i}`)
          ?.scrollIntoView({ behavior: "smooth", block: "start" })
    : goSlide

  const slides = [
    // 개요 — 로고 → 큰 타이틀만 중앙 정렬로 쌓이는 순수 Hero. 소개 문단과
    // 기간/역할은 바로 다음 "소개" 슬라이드로 넘긴다.
    // 화면 맨 아래에는 장식 막대 차트가 깔린다(레퍼런스 레이아웃 참고).
    // 정보 그래픽이 아니라 마우스가 지나가는 막대만 즉시 솟아올랐다가
    // 커서가 빠지면 가라앉는 히어로 장식이라, 순수 CSS :hover로만
    // 반응하게 하고 텍스트와 겹치지 않도록 하단 전용 밴드에 둔다.
    // 기존 공유 GradientBackground는 그대로 유지하고 그 위에 얹기만 한다.
    <div
      className={
        (isMobile
          ? "min-h-screen w-full flex items-center justify-center text-center pl-16 pr-6 py-20"
          : "h-screen flex items-center justify-center px-8 md:px-16 shrink-0 text-center") +
        " relative overflow-hidden"
      }
    >
      {detail.outcomeImage && (
        <div className="absolute inset-x-0 bottom-0 h-[30vh] sm:h-[36vh]">
          <HeroBarChart color={accentColor} />
        </div>
      )}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {detail.logoSrc ? (
          <img
            src={detail.logoSrc}
            alt={project.title}
            className="h-20 sm:h-24 w-auto"
          />
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
      </div>
    </div>,
    // 소개 — Overview 히어로 다음, 프로젝트를 실제로 설명하는 전용 화면.
    // 로고/타이틀은 앞 슬라이드에서 이미 보여줬으니 여기서는 소개 문단과
    // 기간·역할 메타만 차분하게 다시 보여준다.
    <div
      className={
        isMobile
          ? "min-h-screen w-full flex items-center justify-center text-center pl-16 pr-6 py-20"
          : "h-screen flex items-center justify-center px-8 md:px-16 shrink-0 text-center"
      }
    >
      <div className="max-w-2xl flex flex-col items-center gap-8">
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase"
        >
          About
        </span>
        <p
          style={{ fontFamily: "var(--font-body)" }}
          className="text-base sm:text-lg text-[#0C0F1A]/70 leading-relaxed font-normal"
        >
          {detail.overview}
        </p>
        <div
          style={{ fontFamily: "var(--font-mono)" }}
          className="flex items-center gap-4 text-xs text-[#0C0F1A]/45 uppercase tracking-[0.04em]"
        >
          <span>{detail.period}</span>
          <span className="w-1 h-1 rounded-full bg-[#0C0F1A]/30" />
          <span>{detail.role}</span>
        </div>
      </div>
    </div>,
    // 문제 — PPT 발표자료의 카드 레이아웃(헤더 색 바 + 아이콘 + 태그)만 가져오고
    // 색/폰트 등 PPT 자체 템플릿 스타일은 따르지 않는다
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
          Problem
        </span>
        <div className="grid md:grid-cols-3 gap-5">
          {detail.problem.map((item, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-[#0C0F1A]/8 bg-white/50 backdrop-blur-sm flex flex-col"
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 z-10"
                style={{ background: accentColor }}
              />
              {item.image && (
                <div className="h-36 md:h-40 overflow-hidden bg-[#0C0F1A]/[0.03]">
                  <img
                    src={item.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    width={531}
                    height={386}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div className="flex items-start justify-between">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center p-2.5 shrink-0"
                    style={{ background: hexToRgba(accentColor, 0.1), color: accentColor }}
                  >
                    {item.icon && <DetailIcon name={item.icon} />}
                  </div>
                  <span
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="text-xs text-[#0C0F1A]/20"
                  >
                    0{i + 1}
                  </span>
                </div>
                <div>
                  <h3
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-base font-medium text-[#0C0F1A] mb-2"
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{ fontFamily: "var(--font-body)" }}
                    className="text-sm text-[#0C0F1A]/50 leading-relaxed font-light"
                  >
                    {item.body}
                  </p>
                </div>
                {item.tags && (
                  <div className="flex flex-wrap gap-2 mt-auto pt-1">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: accentColor,
                          borderColor: hexToRgba(accentColor, 0.25),
                        }}
                        className="text-[10px] px-2.5 py-1 rounded-full border tracking-[0.02em]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    // 해결
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
          Solution
        </span>
        <div className="grid md:grid-cols-3 gap-5">
          {detail.solution.map((item, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-[#0C0F1A]/8 bg-white/50 backdrop-blur-sm flex flex-col"
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 z-10"
                style={{ background: accentColor }}
              />
              {item.image && (
                <div className="h-36 md:h-40 overflow-hidden bg-[#0C0F1A]/[0.03]">
                  <img
                    src={item.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    width={1400}
                    height={460}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div className="flex items-start justify-between">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center p-2.5 shrink-0"
                    style={{ background: hexToRgba(accentColor, 0.1), color: accentColor }}
                  >
                    {item.icon && <DetailIcon name={item.icon} />}
                  </div>
                  <span
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="text-xs text-[#0C0F1A]/20"
                  >
                    0{i + 1}
                  </span>
                </div>
                <div>
                  <h3
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-base font-medium text-[#0C0F1A] mb-2"
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{ fontFamily: "var(--font-body)" }}
                    className="text-sm text-[#0C0F1A]/50 leading-relaxed font-light"
                  >
                    {item.body}
                  </p>
                </div>
                {item.tags && (
                  <div className="flex flex-wrap gap-2 mt-auto pt-1">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: accentColor,
                          borderColor: hexToRgba(accentColor, 0.25),
                        }}
                        className="text-[10px] px-2.5 py-1 rounded-full border tracking-[0.02em]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    // 성과
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
    </div>,
    // 기술
    <div className={slideWrapClass}>
      <div className="max-w-2xl w-full">
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase mb-12 block"
        >
          Stack
        </span>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-12">
          {detail.tech.map((group) => (
            <div key={group.category}>
              <div
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs text-[#4F6EF7] uppercase tracking-[0.04em] mb-4"
              >
                {group.category}
              </div>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    style={{ fontFamily: "var(--font-body)" }}
                    className="text-sm text-[#0C0F1A]/55 font-light"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <a
          href="https://github.com/oznwoo"
          target="_blank"
          rel="noreferrer"
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/40 hover:text-[#0C0F1A] transition-colors uppercase tracking-[0.04em] border-b border-[#0C0F1A]/15 pb-0.5"
        >
          GitHub →
        </a>
      </div>
    </div>,
  ]

  const accent = PROJECT_ACCENT[projectId] ?? null

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
        onClose={onClose}
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
          translateX 래퍼와 함께 슬라이드-인 된다 */}
      <div
        style={{ fontFamily: "var(--font-mono)" }}
        className={
          (isMobile ? "fixed" : "absolute") +
          " bottom-6 left-6 text-xs text-[#0C0F1A]/25 select-none"
        }
      >
        {String(displaySlide + 1).padStart(2, "0")} /{" "}
        {String(TOTAL_D).padStart(2, "0")}
      </div>
    </div>
  )
}
