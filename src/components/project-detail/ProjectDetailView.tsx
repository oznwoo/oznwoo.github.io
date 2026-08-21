import { useState, useEffect, useRef, useCallback } from "react"
import { useIsMobile } from "@/hooks/useIsMobile"
import { useSectionObserver } from "@/hooks/useSectionObserver"
import { DETAIL_PAGE_LABELS } from "@/data/navigation"
import { PROJECTS, PROJECT_DETAILS, PROJECT_ACCENT } from "@/data/projects"
import { hexToRgba } from "@/lib/color"
import { DetailIcon } from "./DetailIcon"
import { HeroVisual } from "./HeroVisual"
import { DetailNav } from "./DetailNav"

export function ProjectDetailView({
  projectId,
  open,
  onClose,
  onTransition,
  // 상세 내부 슬라이드 전환마다 공유 배경의 웜프(회전·버스트)를 같이 재생해
  // 메인 페이지 전환과 동일한 애니메이션 언어를 쓰게 한다.
}: {
  projectId: string
  open: boolean
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
  // 모바일은 가로 슬라이드 축을 메인 페이지 전환에 이미 쓰고 있어서, 상세
  // 진입·퇴장은 App의 화면 전체 색 펄스로 연출한다. open은 부모가 펄스
  // 타이밍에 맞춰 지연시켜 넘겨주므로(펄스가 절정을 지난 뒤 true), 여기서는
  // 그 값을 그대로 opacity에 반영해 패널이 펄스 아래에서 드러나게만 하면 된다.
  const mobileShown = open
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
    // 개요 — 실사진이 없는 대신, 큰 타이틀(또는 로고)이 세로 중앙에 걸리는
    // 에디토리얼 케이스 스터디 구성(레퍼런스 레이아웃)으로 바꿨다.
    // 좌측 고정 네비게이터(DetailNav, left-6 + 라벨 폭 ~130px)와 겹치지 않도록
    // 텍스트 칼럼은 항상 충분한 좌측 여백을 확보한다. 모바일은 DetailNav 라벨이
    // 숨겨져 dot만 보이므로(hidden md:inline-block) pl-16이면 충분하다.
    <div
      className={
        isMobile
          ? "min-h-screen w-full flex items-center pl-16 pr-6 py-20 relative overflow-hidden"
          : "h-screen flex items-center pl-32 md:pl-44 lg:pl-56 pr-8 md:pr-16 shrink-0 relative overflow-hidden"
      }
    >
      {/* 장식 차트는 텍스트 칼럼(max-w-xl, 최대 우측 끝 ~800px)과 절대 겹치지
          않도록 화면 폭이 충분한 xl(1280px)부터만 우측 고정폭 컬럼에 그린다 */}
      {detail.heroVisual && (
        <div
          className="hidden xl:block absolute inset-y-0 right-0 w-[420px] 2xl:w-[520px]"
          aria-hidden="true"
        >
          <HeroVisual name={detail.heroVisual} color={accentColor} />
        </div>
      )}
      <div className="max-w-xl w-full relative z-10">
        {detail.logoSrc ? (
          <img
            src={detail.logoSrc}
            alt={project.title}
            className="relative h-24 sm:h-28 md:h-32 lg:h-36 w-auto mb-2"
          />
        ) : (
          <h2
            style={{ fontFamily: "var(--font-display)", lineHeight: 0.95 }}
            className="relative text-[clamp(3rem,8vw,6.5rem)] font-light text-[#0C0F1A]"
          >
            {project.title}
          </h2>
        )}
        <p
          style={{ fontFamily: "var(--font-body)" }}
          className="relative text-base italic text-[#0C0F1A]/45 font-light mt-3 mb-6"
        >
          {project.subtitle}
        </p>
        <div className="w-16 h-px mb-6" style={{ background: accentColor }} />
        <p
          style={{ fontFamily: "var(--font-body)" }}
          className="text-sm text-[#0C0F1A]/55 leading-relaxed font-light max-w-md mb-8"
        >
          {detail.overview}
        </p>
        <div className="flex gap-10">
          {[
            ["Period", detail.period],
            ["Role", detail.role],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1.5">
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs text-[#0C0F1A]/25 uppercase tracking-[0.04em]"
              >
                {k}
              </span>
              <span
                style={{ fontFamily: "var(--font-body)" }}
                className="text-sm text-[#0C0F1A]/55 font-light"
              >
                {v}
              </span>
            </div>
          ))}
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
      style={
        isMobile
          ? {
              // App의 펄스(mobile-detail-burst, 0.7s)는 30~50% 구간(약
              // 210~350ms)이 절정이다. open은 그 구간 안(220ms)에서 넘어오므로
              // 여기서는 짧게 스냅시키기만 하면 된다 — 내용이 바뀌는 순간
              // 자체를 펄스가 가려주므로 패널 쪽에서 느리게 크로스페이드할
              // 필요가 없다. 펄스가 걷히는 나머지 구간에는 이미 바뀐 이
              // 화면만 조용히 드러난다.
              opacity: mobileShown ? 1 : 0,
              pointerEvents: mobileShown ? "auto" : "none",
              transition: "opacity 0.18s ease-out",
              willChange: "opacity",
            }
          : undefined
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
