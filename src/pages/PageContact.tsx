import { Page } from "@/components/layout/Page"
import { Reveal } from "@/components/ui/Reveal"
import { useSlideReveal } from "@/hooks/useSlideReveal"

const EMAIL = "luvmoire@gmail.com"
const CHANNELS = [
  { label: "Email", value: EMAIL, href: `mailto:${EMAIL}`, external: false },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/진우-오",
    href: "https://www.linkedin.com/in/%EC%A7%84%EC%9A%B0-%EC%98%A4-9a2133327/",
    external: true,
  },
  {
    label: "GitHub",
    value: "github.com/oznwoo",
    href: "https://github.com/oznwoo",
    external: true,
  },
]

export function PageContact({ isActive = true }: { isActive?: boolean }) {
  // 페이지 전환이 끝나면 헤드라인 → 본문·연락처 목록이 차례로 나타난다. 라벨만 고정.
  const headlineRevealed = useSlideReveal(isActive)
  const contentRevealed = useSlideReveal(isActive, 850)

  return (
    <Page>
      <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-20">
        <div className="md:max-w-sm">
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

        {/* 연락처 — 배경 없이 그냥 나열하다가, 호버하면 면이 떠오르며 그림자가
            생겨 "누르면 이동한다"는 걸 알린다. Email/LinkedIn/GitHub 모두 동일 형태. */}
        <Reveal show={contentRevealed} className="w-full md:w-[21rem] md:shrink-0">
          {CHANNELS.map(({ label, value, href, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="group -mx-3 flex items-center gap-4 rounded-xl px-3 py-3.5 transition-[transform,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[3px] hover:bg-white/60 hover:shadow-[0_18px_44px_-18px_rgba(12,15,26,0.30)]"
            >
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="w-16 shrink-0 text-[10px] uppercase tracking-[0.12em] text-[#0C0F1A]/40"
              >
                {label}
              </span>
              <span
                style={{ fontFamily: "var(--font-body)" }}
                className="flex-1 text-sm text-[#0C0F1A]/70 transition-colors group-hover:text-[#1B2333]"
              >
                {value}
              </span>
              <span
                aria-hidden="true"
                className="text-xs text-[#0C0F1A]/25 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[#4F6EF7]"
              >
                →
              </span>
            </a>
          ))}
        </Reveal>
      </div>
    </Page>
  )
}
