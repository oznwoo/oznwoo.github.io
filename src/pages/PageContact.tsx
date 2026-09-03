import { Page } from "@/components/layout/Page"
import { Reveal } from "@/components/ui/Reveal"
import { useSlideReveal } from "@/hooks/useSlideReveal"

const EMAIL = "luvmoire@gmail.com"
const SECONDARY_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/%EC%A7%84%EC%9A%B0-%EC%98%A4-9a2133327/",
  },
  { label: "GitHub", href: "https://github.com/oznwoo" },
]

export function PageContact({ isActive = true }: { isActive?: boolean }) {
  // 페이지 전환이 끝나면 헤드라인 → 본문이 차례로 나타난다. 섹션 라벨만 고정.
  const headlineRevealed = useSlideReveal(isActive)
  const contentRevealed = useSlideReveal(isActive, 850)

  return (
    <Page>
      <div className="max-w-md">
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/45 tracking-[0.04em] uppercase"
        >
          Contact
        </span>
        <Reveal show={headlineRevealed}>
          <h2
            style={{ fontFamily: "var(--font-display)", lineHeight: 1.3 }}
            className="text-[clamp(1.5rem,6vw,3rem)] font-light text-[#1B2333] mt-2"
          >
            <span className="text-[0.8em]">함께</span>
            <br />
            <span className="shimmer-title font-semibold">만들어봐요.</span>
          </h2>
        </Reveal>
        <Reveal show={contentRevealed}>
          <p
            style={{ fontFamily: "var(--font-body)" }}
            className="mt-5 text-[#0C0F1A]/60 font-normal text-sm leading-loose"
          >
            새로운 팀에 합류할 기회를 기다리고 있습니다. 함께할 자리가 있다면
            편하게 연락 부탁드립니다.
          </p>

          {/* 폼 대신 메일 클라이언트를 바로 여는 CTA — 실제 주소도 아래 함께 노출 */}
          <a
            href={`mailto:${EMAIL}`}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              background: "#0C0F1A",
            }}
            className="mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm text-white transition-all duration-300 active:scale-[0.98]"
            onMouseEnter={(e) => (e.currentTarget.style.background = "#4F6EF7")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#0C0F1A")}
          >
            이메일 보내기
            <span aria-hidden="true">→</span>
          </a>
          <p
            style={{ fontFamily: "var(--font-mono)" }}
            className="mt-3 text-xs text-[#0C0F1A]/50 tracking-[0.02em]"
          >
            {EMAIL}
          </p>

          <div className="mt-8 flex items-center gap-6">
            {SECONDARY_LINKS.map(({ label, href }) => (
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
          </div>
        </Reveal>
      </div>
    </Page>
  )
}
