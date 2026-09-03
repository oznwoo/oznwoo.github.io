import { Page } from "@/components/layout/Page"
import { Reveal } from "@/components/ui/Reveal"
import { useSlideReveal } from "@/hooks/useSlideReveal"

const EMAIL = "luvmoire@gmail.com"
const CHANNELS = [
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
  // 페이지 전환이 끝나면 헤드라인 → 본문·연락 패널이 차례로 나타난다. 라벨만 고정.
  const headlineRevealed = useSlideReveal(isActive)
  const contentRevealed = useSlideReveal(isActive, 850)

  return (
    <Page>
      <div className="grid items-center gap-10 md:grid-cols-[1fr_auto] md:gap-16">
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

        {/* 연락 패널 — 사이트의 "여백 위 타이포" 언어에 맞춰 최소한의 면만 두고,
            메일을 1차 액션으로, LinkedIn·GitHub를 보조 채널로 위계를 잡는다. */}
        <Reveal show={contentRevealed}>
          <div
            className="w-full rounded-[20px] p-7 md:w-[21rem]"
            style={{
              background: "rgba(255,255,255,0.34)",
              border: "1px solid rgba(12,15,26,0.07)",
              boxShadow: "0 14px 44px -22px rgba(12,15,26,0.22)",
              backdropFilter: "blur(6px)",
            }}
          >
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-[10px] uppercase tracking-[0.12em] text-[#0C0F1A]/40"
            >
              Email
            </span>
            <a
              href={`mailto:${EMAIL}`}
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              className="mt-1.5 block text-lg text-[#1B2333] transition-colors hover:text-[#4F6EF7]"
            >
              {EMAIL}
            </a>
            <a
              href={`mailto:${EMAIL}`}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                background: "#0C0F1A",
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs text-white transition-all duration-300 active:scale-[0.98]"
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

            <div className="mt-7 space-y-4 border-t border-[#0C0F1A]/[0.07] pt-6">
              {CHANNELS.map(({ label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group block"
                >
                  <span
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="text-[10px] uppercase tracking-[0.12em] text-[#0C0F1A]/40"
                  >
                    {label}
                  </span>
                  <span className="mt-1 flex items-center gap-1.5">
                    <span
                      style={{ fontFamily: "var(--font-body)" }}
                      className="text-sm text-[#0C0F1A]/65 transition-colors group-hover:text-[#1B2333]"
                    >
                      {value}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-xs text-[#0C0F1A]/25 transition-all group-hover:translate-x-0.5 group-hover:text-[#4F6EF7]"
                    >
                      →
                    </span>
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
