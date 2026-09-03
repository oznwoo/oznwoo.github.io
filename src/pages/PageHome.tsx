import { Page } from "@/components/layout/Page"
import { StatusTicker } from "@/components/ui/StatusTicker"
import { Reveal } from "@/components/ui/Reveal"
import { useSlideReveal } from "@/hooks/useSlideReveal"

export function PageHome({ isActive = true }: { isActive?: boolean }) {
  // 페이지 전환이 끝나면 헤드라인 → 하단 행(이름·링크)이 차례로 나타난다.
  // 이어브로우는 고정. 이름과 링크는 같은 가로 행이라 한 타이밍에 함께 등장한다.
  const headlineRevealed = useSlideReveal(isActive)
  const bottomRowRevealed = useSlideReveal(isActive, 850)

  return (
    <Page>
      <div className="flex flex-col gap-8">
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/45 tracking-[0.04em] uppercase"
        >
          Developer
        </span>
        <Reveal show={headlineRevealed}>
          <h1
            style={{ fontFamily: "var(--font-display)", lineHeight: 1.15 }}
            className="shimmer-title text-[clamp(2.1rem,9vw,6.5rem)] font-light tracking-tight text-[#1B2333]"
          >
            <span className="text-[0.8em]">아이디어를</span>
            <br />
            <span className="font-semibold">현실로 만듭니다.</span>
          </h1>
        </Reveal>
        <div className="border-t border-[#0C0F1A]/10 pt-7 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <Reveal show={bottomRowRevealed}>
            <p
              style={{ fontFamily: "var(--font-body)" }}
              className="max-w-sm text-[#0C0F1A]/65 text-base leading-loose font-normal"
            >
              오진우
            </p>
          </Reveal>
          <Reveal
            show={bottomRowRevealed}
            className="flex items-center gap-4 sm:gap-8 shrink-0 flex-wrap"
          >
            {[
              { label: "GitHub", href: "https://github.com/oznwoo" },
              { label: "RESUME", href: "/documents/resume.pdf" },
              { label: "Email", href: "mailto:luvmoire@gmail.com" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs text-[#0C0F1A]/45 hover:text-[#0C0F1A] transition-colors uppercase tracking-[0.02em]"
              >
                {label}
              </a>
            ))}
          </Reveal>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#4F6EF7] animate-pulse shrink-0" />
          <StatusTicker />
        </div>
      </div>
    </Page>
  )
}
