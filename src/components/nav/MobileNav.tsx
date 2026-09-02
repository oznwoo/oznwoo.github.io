import logoImg from "@/imports/______________.png"

// 모바일 전용 네비게이션 — 왼쪽 세로 dot rail 대신, 홈으로 가는 로고(좌상단)와
// 이전/다음 화살표(우하단)로 가로 페이지를 넘긴다.
export function MobileNav({
  current,
  total,
  onPrev,
  onNext,
  onHome,
}: {
  current: number
  total: number
  onPrev: () => void
  onNext: () => void
  onHome: () => void
}) {
  return (
    <>
      <button
        onClick={onHome}
        aria-label="Home"
        className="fixed left-5 top-5 z-50 flex h-9 w-9 items-center justify-center"
      >
        <img
          src={logoImg}
          alt=""
          style={{ width: 20, height: 20, objectFit: "contain", opacity: 0.55 }}
        />
      </button>
      <div
        style={{ fontFamily: "var(--font-mono)" }}
        className="fixed bottom-6 left-6 z-50 text-xs text-[#0C0F1A]/40 select-none"
      >
        {String(current + 1).padStart(2, "0")} /{" "}
        {String(total).padStart(2, "0")}
      </div>
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={current === 0}
          aria-label="이전 페이지"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#0C0F1A]/10 text-[#0C0F1A]/50 backdrop-blur-md transition active:scale-95 disabled:opacity-25"
          style={{ background: "rgba(255,255,255,0.55)" }}
        >
          ←
        </button>
        <button
          onClick={onNext}
          disabled={current === total - 1}
          aria-label="다음 페이지"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#0C0F1A]/10 text-[#0C0F1A]/50 backdrop-blur-md transition active:scale-95 disabled:opacity-25"
          style={{ background: "rgba(255,255,255,0.55)" }}
        >
          →
        </button>
      </div>
    </>
  )
}
