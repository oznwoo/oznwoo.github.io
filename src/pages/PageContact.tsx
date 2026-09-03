import { Page } from "@/components/layout/Page"
import { Reveal } from "@/components/ui/Reveal"
import { useSlideReveal } from "@/hooks/useSlideReveal"

const EMAIL = "luvmoire@gmail.com"
const SECONDARY_LINKS = [
  {
    label: "LinkedIn",
    value: "linkedin.com/in/진우-오",
    href: "https://www.linkedin.com/in/%EC%A7%84%EC%9A%B0-%EC%98%A4-9a2133327/",
  },
  {
    label: "GitHub",
    value: "github.com/oznwoo",
    href: "https://github.com/oznwoo",
  },
]

export function PageContact({ isActive = true }: { isActive?: boolean }) {
  // 페이지 전환이 끝나면 헤드라인 → 본문·카드가 차례로 나타난다. 라벨만 고정.
  const headlineRevealed = useSlideReveal(isActive)
  const contentRevealed = useSlideReveal(isActive, 850)

  return (
    <Page>
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
        <div>
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
              className="mt-5 max-w-xs text-[#0C0F1A]/60 font-normal text-sm leading-loose"
            >
              새로운 팀에 합류할 기회를 기다리고 있습니다. 함께할 자리가
              있다면 편하게 연락 부탁드립니다.
            </p>
          </Reveal>
        </div>

        {/* 연락 수단 카드 — 메일 CTA + 실제 주소 + 보조 링크(LinkedIn·GitHub) */}
        <Reveal show={contentRevealed}>
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{
              background: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(12,15,26,0.08)",
              boxShadow: "0 24px 56px -20px rgba(12,15,26,0.16)",
            }}
          >
            <a
              href={`mailto:${EMAIL}`}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                background: "#0C0F1A",
              }}
              className="flex items-center justify-between rounded-xl px-5 py-3.5 text-sm text-white transition-all duration-300 active:scale-[0.99]"
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#4F6EF7")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#0C0F1A")
              }
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

            <div className="mt-6 space-y-1 border-t border-[#0C0F1A]/[0.08] pt-4">
              {SECONDARY_LINKS.map(({ label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group -mx-2 flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-[#0C0F1A]/[0.03]"
                >
                  <span className="flex items-baseline gap-3">
                    <span
                      style={{ fontFamily: "var(--font-mono)" }}
                      className="w-16 shrink-0 text-[10px] uppercase tracking-[0.04em] text-[#0C0F1A]/45"
                    >
                      {label}
                    </span>
                    <span
                      style={{ fontFamily: "var(--font-body)" }}
                      className="text-xs text-[#0C0F1A]/65 transition-colors group-hover:text-[#0C0F1A] sm:text-sm"
                    >
                      {value}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-[#0C0F1A]/25 transition-all group-hover:translate-x-0.5 group-hover:text-[#0C0F1A]/55"
                  >
                    →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Page>
  )
}
