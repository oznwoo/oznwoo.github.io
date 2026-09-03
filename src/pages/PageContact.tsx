import { siGithub, siGmail } from "simple-icons"
import { Page } from "@/components/layout/Page"
import { hexToRgba } from "@/lib/color"
import { Reveal } from "@/components/ui/Reveal"
import { useSlideReveal } from "@/hooks/useSlideReveal"

const EMAIL = "luvmoire@gmail.com"

// simple-icons에서 LinkedIn 로고는 상표 요청으로 빠져서 path를 직접 둔다.
const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"

const CHANNELS = [
  {
    label: "Email",
    desc: EMAIL,
    href: `mailto:${EMAIL}`,
    external: false,
    icon: siGmail.path,
    tint: "#4F6EF7",
  },
  {
    label: "LinkedIn",
    desc: "linkedin.com/in/진우-오",
    href: "https://www.linkedin.com/in/%EC%A7%84%EC%9A%B0-%EC%98%A4-9a2133327/",
    external: true,
    icon: LINKEDIN_PATH,
    tint: "#0A66C2",
  },
  {
    label: "GitHub",
    desc: "github.com/oznwoo",
    href: "https://github.com/oznwoo",
    external: true,
    icon: siGithub.path,
    tint: "#1B2333",
  },
]

export function PageContact({ isActive = true }: { isActive?: boolean }) {
  // 페이지 전환이 끝나면 헤드라인 → 본문·연락처 카드가 차례로 나타난다. 라벨만 고정.
  const headlineRevealed = useSlideReveal(isActive)
  const contentRevealed = useSlideReveal(isActive, 850)

  return (
    <Page>
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-14">
        <div className="md:max-w-sm md:shrink-0">
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-xs text-[#0C0F1A]/45 tracking-[0.04em] uppercase"
          >
            Contact
          </span>
          <Reveal show={headlineRevealed}>
            <h2
              style={{ fontFamily: "var(--font-display)", lineHeight: 1.3 }}
              className="text-[clamp(1.75rem,6.5vw,3.4rem)] font-light text-[#1B2333] mt-2"
            >
              <span className="text-[0.8em]">함께</span>
              <br />
              <span className="shimmer-title font-semibold">만들어봐요.</span>
            </h2>
          </Reveal>
          <Reveal show={contentRevealed}>
            <p
              style={{ fontFamily: "var(--font-body)" }}
              className="mt-6 max-w-sm text-[#0C0F1A]/60 font-normal text-[15px] leading-loose"
            >
              새로운 팀에 합류할 기회를 기다리고 있습니다. 함께할 자리가
              있다면 편하게 연락 부탁드립니다.
            </p>
          </Reveal>
        </div>

        {/* 연락처 카드 — 아이콘 타일 + 채널명 + 주소, 우측 화살표.
            호버하면 카드가 살짝 떠오르며 그림자가 깊어져 "누르면 이동"을 알린다. */}
        <Reveal
          show={contentRevealed}
          className="w-full space-y-3.5 md:max-w-[38rem] md:flex-1"
        >
          {CHANNELS.map(({ label, desc, href, external, icon, tint }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="group flex items-center gap-5 rounded-2xl bg-white/65 px-5 py-4 shadow-[0_10px_30px_-14px_rgba(12,15,26,0.16)] backdrop-blur-sm transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_20px_44px_-16px_rgba(12,15,26,0.28)]"
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ background: hexToRgba(tint, 0.1), color: tint }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-[22px] w-[22px]"
                >
                  <path d={icon} />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                  className="block text-[15px] text-[#1B2333]"
                >
                  {label}
                </span>
                <span
                  style={{ fontFamily: "var(--font-body)" }}
                  className="block truncate text-[13px] text-[#0C0F1A]/50"
                >
                  {desc}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="shrink-0 text-sm text-[#0C0F1A]/25 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[#4F6EF7]"
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
