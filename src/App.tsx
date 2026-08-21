import { useState, useEffect, useRef, useCallback } from "react"
import { GradientBackground } from "@/components/background/GradientBackground"
import { DotNav } from "@/components/nav/DotNav"
import { MobileNav } from "@/components/nav/MobileNav"
import { ProjectDetailView } from "@/components/project-detail/ProjectDetailView"
import { useIsMobile } from "@/hooks/useIsMobile"
import { SECTIONS } from "@/data/navigation"
import { PROJECT_ACCENT, PROJECT_PULL, DEFAULT_ACCENT } from "@/data/projects"
import type { ProjectAccent } from "@/lib/color"
import { PageHome } from "@/pages/PageHome"
import { PageAbout } from "@/pages/PageAbout"
import { PageResume } from "@/pages/PageResume"
import { PageProjects } from "@/pages/PageProjects"
import { PageContact } from "@/pages/PageContact"

const TOTAL = SECTIONS.length

export default function App() {
  // ─── State: 메인 세로 슬라이드 + 상세 패널 열림/닫힘 ─────────────────────
  const [current, setCurrent] = useState(0)
  const [activeProject, setActiveProject] = useState<string | null>(null)
  // 상세 패널에 실제로 마운트되는 프로젝트. 닫힐 때는 가로 슬라이드(0.75s)가
  // 끝날 때까지 activeProject보다 늦게 null이 되어, 애니메이션 도중 콘텐츠가
  // 먼저 사라지지 않도록 한다.
  const [renderedProject, setRenderedProject] = useState<string | null>(null)
  const closeDetailTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // 배경이 "상세 페이지 색 모드"로 들어갈지 여부. renderedProject와 달리 열릴 때도
  // 가로 슬라이드(0.75s)가 끝날 때까지 기다렸다가 바뀐다 — 그래야 슬라이드 도중에는
  // 기존 파란 배경이 그대로 보이고, 상세 페이지로 다 넘어간 뒤에야 서서히 프로젝트
  // 색으로 바뀐다. 닫힐 때도 같은 타이밍으로 되돌아간다.
  const [detailBgActive, setDetailBgActive] = useState(false)
  const detailBgTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const animating = useRef(false)
  const touchStart = useRef<number | null>(null)
  // 페이지가 실제로 전환될 때만 잠깐 켜지는 "웜프" 상태 — 색 강조/스케일/블러 펄스에 쓰인다.
  // ─── State: 배경 웜프(전환 애니메이션) ────────────────────────────────
  const [warping, setWarping] = useState(false)
  // 지금의 웜프가 상세 페이지 "내부" 섹션 전환에서 온 것인지 표시 — true일 때만
  // 상세 모드에서도 색 버스트를 (프로젝트 색으로) 재생한다.
  const [detailSectionWarp, setDetailSectionWarp] = useState(false)
  const warpTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // 배경 전체의 누적 회전각 — 전환마다 시계 방향으로 더해지기만 하고 되돌아오지 않는다.
  const [rotation, setRotation] = useState(0)
  // 프로젝트 카드 호버 시 blob에 반영할 브랜드 컬러. hoverId는 현재 호버 중인
  // 카드(없으면 null). 상세 페이지가 열려있으면 그 프로젝트 색이 우선한다 —
  // 배경/DotNav/상세 네비게이터가 모두 이 값을 공유해 리스트 호버와 동일한
  // 크로스페이드·펄스·플래시 효과로 상세 페이지 색을 표시한다.
  // ─── State: 프로젝트 브랜드 컬러 (호버/상세페이지 크로스페이드) ────────
  const [hoverId, setHoverId] = useState<string | null>(null)
  const displayAccentId = renderedProject ?? hoverId
  const hoverAccent = displayAccentId
    ? (PROJECT_ACCENT[displayAccentId] ?? null)
    : null
  // 두 슬롯에 색을 번갈아 담아둔다. 호버 대상이 A→B로 바로 바뀔 때 A가 담긴
  // 슬롯은 페이드아웃, B가 담긴 슬롯은 페이드인 되며 실제로 색이 크로스페이드된다.
  const [slotColors, setSlotColors] = useState<[ProjectAccent, ProjectAccent]>([
    DEFAULT_ACCENT,
    DEFAULT_ACCENT,
  ])
  const [activeSlot, setActiveSlot] = useState<0 | 1>(0)
  // 호버 대상이 바뀔 때마다(호버→호버 직행 포함) 짧게 튕기는 펄스를 재생한다.
  const [pulseActive, setPulseActive] = useState(false)
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevDisplayId = useRef<string | null>(null)
  // 미호버 → 호버로 "처음" 진입하는 순간에만, 페이지 전환에 쓰이는 웜프 버스트를
  // 프로젝트 색으로 재생한다. 호버 중인 카드가 바로 다른 카드로 바뀌는 전환에는
  // 켜지지 않아, 크로스페이드와 역할이 겹치지 않고 "지금 막 반응을 시작했다"는
  // 신호로만 쓰인다.
  const [flashNonce, setFlashNonce] = useState(0)
  const [flashColor, setFlashColor] = useState(DEFAULT_ACCENT.primary)
  const [burstOffset, setBurstOffset] = useState({ x: 0, y: 0 })
  const prevAccentOn = useRef(false)

  // ─── Effect: 브랜드 컬러 크로스페이드·펄스·플래시 계산 ─────────────────
  useEffect(() => {
    if (hoverAccent && slotColors[activeSlot].primary !== hoverAccent.primary) {
      const nextSlot: 0 | 1 = activeSlot === 0 ? 1 : 0
      setSlotColors((prev) => {
        const next = [...prev] as [ProjectAccent, ProjectAccent]
        next[nextSlot] = hoverAccent
        return next
      })
      setActiveSlot(nextSlot)
    }
    if (displayAccentId && displayAccentId !== prevDisplayId.current) {
      setPulseActive(true)
      if (pulseTimer.current) clearTimeout(pulseTimer.current)
      pulseTimer.current = setTimeout(() => setPulseActive(false), 420)
    }
    const accentOn = hoverAccent !== null
    if (accentOn && !prevAccentOn.current && hoverAccent) {
      setFlashColor(hoverAccent.primary)
      setFlashNonce((n) => n + 1)
      setBurstOffset({
        x: (Math.random() - 0.5) * 26,
        y: (Math.random() - 0.5) * 26,
      })
      // 페이지 전환의 회전을 그대로 재사용하되, 이번엔 방향에 매이지 않고
      // 무작위 각도·방향으로 돌려 매번 다른 방식으로 흩어지게 한다.
      const spin = (Math.random() * 50 + 20) * (Math.random() < 0.5 ? 1 : -1)
      setRotation((r) => r + spin)
    }
    prevAccentOn.current = accentOn
    prevDisplayId.current = displayAccentId
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayAccentId, hoverAccent])

  const pull = hoverId
    ? (PROJECT_PULL[hoverId] ?? { x: 0, y: 0 })
    : { x: 0, y: 0 }

  // 페이지 전환마다 배경을 회전·웜프시키는 공통 트리거. 세로 섹션 이동뿐 아니라
  // 상세 페이지 열기/닫기, 상세 내부 슬라이드에도 동일하게 재사용해 어떤
  // 전환이든 같은 애니메이션 언어를 쓰게 한다. resetHover가 true면 전환 시작과
  // 동시에 리스트 호버를 해제한다 — 상세를 여는 순간에는 열리는 프로젝트의 색이
  // 끊기지 않아야 하므로 false로 호출한다. isDetailSection이 true면 상세
  // 페이지 "내부" 섹션 전환임을 표시해, 진입/퇴장 슬라이드는 조용히 넘어가되
  // 내부 섹션 전환만 메인 페이지와 같은 색 버스트를 (프로젝트 색으로) 재생한다.
  // ─── Callbacks: 페이지 전환 트리거 (데스크톱 세로 슬라이드) ────────────
  const triggerWarp = useCallback(
    (
      direction: 1 | -1,
      resetHover: boolean = true,
      isDetailSection: boolean = false,
    ) => {
      setWarping(true)
      setDetailSectionWarp(isDetailSection)
      if (resetHover) setHoverId(null)
      setRotation((r) => r + direction * 34)
      if (warpTimer.current) clearTimeout(warpTimer.current)
      warpTimer.current = setTimeout(() => {
        setWarping(false)
        setDetailSectionWarp(false)
      }, 750)
    },
    [],
  )

  const goTo = useCallback(
    (idx: number) => {
      const n = Math.max(0, Math.min(TOTAL - 1, idx))
      if (n === current || animating.current) return
      animating.current = true
      triggerWarp(n > current ? 1 : -1)
      setCurrent(n)
      setTimeout(() => {
        animating.current = false
      }, 800)
    },
    [current, triggerWarp],
  )

  const prev = useCallback(() => goTo(current - 1), [current, goTo])
  const next = useCallback(() => goTo(current + 1), [current, goTo])

  // ref로 최신 isDetail 값을 읽어 deps 배열 크기를 고정
  const isDetail = activeProject !== null
  const isDetailRef = useRef(isDetail)
  isDetailRef.current = isDetail

  // 모바일(stack 모드)에서는 세로 슬라이드 트랙 자체를 렌더링하지 않고 일반
  // 문서 스크롤을 쓰므로, 전역 wheel/touch/keydown 페이지 전환 핸들러는 꺼둔다.
  // ─── State: 모바일 여부 감지 (아래 데스크톱/모바일 렌더 분기의 기준) ───
  const isMobile = useIsMobile()
  const isMobileRef = useRef(isMobile)
  isMobileRef.current = isMobile

  useEffect(() => {
    if (closeDetailTimer.current) clearTimeout(closeDetailTimer.current)
    if (activeProject !== null) {
      setRenderedProject(activeProject)
    } else {
      closeDetailTimer.current = setTimeout(() => setRenderedProject(null), 750)
    }
  }, [activeProject])

  useEffect(() => {
    if (detailBgTimer.current) clearTimeout(detailBgTimer.current)
    detailBgTimer.current = setTimeout(() => {
      setDetailBgActive(activeProject !== null)
    }, 750)
  }, [activeProject])

  // ─── Effects: 전역 wheel/keydown/touch 리스너 (데스크톱 세로 슬라이드) ─
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (isDetailRef.current || isMobileRef.current) return
      e.preventDefault()
      if (Math.abs(e.deltaY) < 20) return
      e.deltaY > 0 ? next() : prev()
    }
    window.addEventListener("wheel", onWheel, { passive: false })
    return () => window.removeEventListener("wheel", onWheel)
  }, [next, prev])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isDetailRef.current || isMobileRef.current) return
      if (e.key === "ArrowDown") next()
      if (e.key === "ArrowUp") prev()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [next, prev])

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientY
    }
    const onEnd = (e: TouchEvent) => {
      if (isDetailRef.current || isMobileRef.current || touchStart.current === null)
        return
      const delta = touchStart.current - e.changedTouches[0].clientY
      if (Math.abs(delta) > 50) delta > 0 ? next() : prev()
      touchStart.current = null
    }
    window.addEventListener("touchstart", onStart, { passive: true })
    window.addEventListener("touchend", onEnd, { passive: true })
    return () => {
      window.removeEventListener("touchstart", onStart)
      window.removeEventListener("touchend", onEnd)
    }
  }, [next, prev])

  const progress = TOTAL > 1 ? current / (TOTAL - 1) : 0

  // 모바일은 세로 대신 가로로 페이지를 넘긴다 — 세로 스크롤/스와이프는
  // 브라우저 자체의 pull-to-refresh와 겹치기 때문. 페이지 구성 자체는
  // 데스크톱과 동일(Home/About/Resume/Projects/Contact 5개) — Projects도
  // Resume처럼 위→아래 리스트로 한 화면에 담기므로 더 이상 쪼갤 필요가 없다.
  // ─── State + Effects: 모바일 전용 가로 페이지 전환 ─────────────────────
  const [mobilePage, setMobilePage] = useState(0)
  const mobileProgress = TOTAL > 1 ? mobilePage / (TOTAL - 1) : 0
  // 데스크톱의 goTo와 동일하게 triggerWarp를 태워야 배경 blob의 웜프(회전·
  // 스케일·버스트 플래시) 반응이 모바일 페이지 전환에도 재생된다 — 이걸
  // 빼먹었더니 모바일에서만 배경이 그냥 멈춰있는 것처럼 보였음.
  const goMobile = useCallback(
    (idx: number) => {
      const next = Math.max(0, Math.min(TOTAL - 1, idx))
      if (next === mobilePage) return
      triggerWarp(next > mobilePage ? 1 : -1)
      setMobilePage(next)
    },
    [mobilePage, triggerWarp],
  )
  const mobileTouchStart = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!isMobile) return
    const EDGE_GUARD = 24 // 화면 가장자리에서 시작한 스와이프는 OS 뒤로가기 제스처로 넘긴다
    const onStart = (e: TouchEvent) => {
      if (isDetailRef.current) return
      const t = e.touches[0]
      if (t.clientX < EDGE_GUARD || t.clientX > window.innerWidth - EDGE_GUARD) {
        mobileTouchStart.current = null
        return
      }
      mobileTouchStart.current = { x: t.clientX, y: t.clientY }
    }
    const onEnd = (e: TouchEvent) => {
      if (isDetailRef.current || !mobileTouchStart.current) return
      const t = e.changedTouches[0]
      const dx = t.clientX - mobileTouchStart.current.x
      const dy = t.clientY - mobileTouchStart.current.y
      mobileTouchStart.current = null
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return
      goMobile(mobilePage + (dx < 0 ? 1 : -1))
    }
    window.addEventListener("touchstart", onStart, { passive: true })
    window.addEventListener("touchend", onEnd, { passive: true })
    return () => {
      window.removeEventListener("touchstart", onStart)
      window.removeEventListener("touchend", onEnd)
    }
  }, [isMobile, mobilePage, goMobile])

  // ─── 페이지 목록: 실제 pages/*.tsx 컴포넌트를 순서대로 배치 ────────────
  // 데스크톱 세로 슬라이드·모바일 가로 슬라이드 양쪽에서 동일한 5페이지
  // 구성을 그대로 재사용한다 (Projects 내부에서 isMobile로 카드/리스트 분기).
  const pages = [
    <PageHome />,
    <PageAbout />,
    <PageResume />,
    <PageProjects
      // 상세 페이지로 들어갈 때는 웜프(회전·blob 강조) 없이 가로 슬라이드만
      // 재생한다. 호버 중이던 색은 renderedProject가 이어받아 끊기지 않는다.
      onOpen={setActiveProject}
      // 세로 슬라이드 중에는 마우스가 카드를 스쳐도 호버로 잡지 않아, 전환
      // 도중에는 슬라이드 애니메이션만 보이고 색 반응은 끼어들지 않는다.
      onHover={(id) => {
        if (!warping) setHoverId(id)
      }}
    />,
    <PageContact />,
  ]

  // ─── 공유 배경 + 상세 패널 (데스크톱/모바일 렌더 양쪽에서 재사용) ──────
  const background = (
    <GradientBackground
      progress={isMobile ? mobileProgress : progress}
      page={isMobile ? mobilePage : current}
      warping={warping}
      rotation={rotation}
      accentSlots={slotColors}
      activeSlot={activeSlot}
      accentOn={hoverAccent !== null}
      flashNonce={flashNonce}
      flashColor={flashColor}
      burstOffset={burstOffset}
      pull={pull}
      pulseActive={pulseActive}
      detailMode={detailBgActive}
      detailSectionWarp={detailSectionWarp}
      enteringDetail={activeProject !== null && !detailBgActive}
    />
  )

  const detailOverlay = renderedProject && (
    <ProjectDetailView
      projectId={renderedProject}
      open={isDetail}
      onClose={() => {
        triggerWarp(-1)
        setActiveProject(null)
      }}
      onTransition={(direction) => triggerWarp(direction, false, true)}
    />
  )

  // ═══ 렌더 분기 A: 모바일 (가로 슬라이드) ═══════════════════════════════
  // 모바일은 데스크톱과 같은 "페이지 하나 = 화면 하나" 원칙을 유지하되 축만
  // 세로 → 가로로 바꾼다. 세로 스크롤이 브라우저 pull-to-refresh와 겹치는
  // 문제를 원천적으로 피한다. 페이지 구성은 데스크톱과 동일한 5개.
  if (isMobile) {
    return (
      <div className="fixed inset-0 overflow-hidden">
        {background}
        {!isDetail && (
          <MobileNav
            current={mobilePage}
            total={TOTAL}
            onPrev={() => goMobile(mobilePage - 1)}
            onNext={() => goMobile(mobilePage + 1)}
            onHome={() => goMobile(0)}
          />
        )}
        <div
          className="flex h-full"
          style={{
            transform: `translateX(-${mobilePage * 100}vw)`,
            transition: "transform 0.6s cubic-bezier(0.77,0,0.18,1)",
            width: `${TOTAL * 100}vw`,
            willChange: "transform",
          }}
        >
          {pages.map((page, i) => (
            <div key={i} className="h-screen w-screen shrink-0">
              {page}
            </div>
          ))}
        </div>
        {detailOverlay}
      </div>
    )
  }

  // ═══ 렌더 분기 B: 데스크톱/태블릿 (세로 슬라이드) ══════════════════════
  return (
    <div className="fixed inset-0 overflow-hidden">
      {background}

      {/* 가로 슬라이드: 메인(0) ↔ 상세(1) */}
      <div
        className="flex h-full"
        style={{
          transform: `translateX(${isDetail ? "-100vw" : "0"})`,
          transition: "transform 0.75s cubic-bezier(0.77,0,0.18,1)",
          width: "200vw",
          willChange: "transform",
        }}
      >
        {/* 메인 세로 슬라이더 */}
        <div className="w-screen h-screen shrink-0 relative overflow-hidden">
          <DotNav
            current={current}
            total={TOTAL}
            onChange={goTo}
            accentSlots={slotColors}
            activeSlot={activeSlot}
            accentOn={hoverAccent !== null}
          />
          <div
            className="flex flex-col h-full"
            style={{
              transform: `translateY(-${current * 100}vh)`,
              transition: "transform 0.75s cubic-bezier(0.77,0,0.18,1)",
              height: `${TOTAL * 100}vh`,
              willChange: "transform",
            }}
          >
            {pages.map((page, i) => (
              <div key={i} className="h-screen w-full shrink-0">
                {page}
              </div>
            ))}
          </div>
          <div
            style={{ fontFamily: "var(--font-mono)" }}
            className="fixed bottom-6 left-6 md:left-12 text-xs text-[#0C0F1A]/25 select-none"
          >
            {String(current + 1).padStart(2, "0")} /{" "}
            {String(TOTAL).padStart(2, "0")}
          </div>
        </div>

        {/* 상세 세로 슬라이더 */}
        <div className="w-screen h-screen shrink-0">{detailOverlay}</div>
      </div>
    </div>
  )
}
