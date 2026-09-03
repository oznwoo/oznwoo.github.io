import { siGithub, siGmail } from "simple-icons"
import { Page } from "@/components/layout/Page"
import { hexToRgba } from "@/lib/color"
import { Reveal } from "@/components/ui/Reveal"
import { useSlideReveal } from "@/hooks/useSlideReveal"

const EMAIL = "luvmoire@gmail.com"

// simple-icons에서 LinkedIn 로고는 상표 요청으로 빠져서 path를 직접 둔다.
const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"

// 문서(이력서 PDF) 아이콘 — 모서리 접힌 페이지
const DOC_PATH =
  "M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H14a1 1 0 0 1-1-1V3.5zM8 13h8v1.5H8V13zm0 3.5h8V18H8v-1.5z"

// desc는 Email만 노출한다 (제목 오른쪽에 작게). 나머지는 채널명만.
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
    desc: null,
    href: "https://www.linkedin.com/in/%EC%A7%84%EC%9A%B0-%EC%98%A4-9a2133327/",
    external: true,
    icon: LINKEDIN_PATH,
    tint: "#0A66C2",
  },
  {
    label: "GitHub",
    desc: null,
    href: "https://github.com/oznwoo",
    external: true,
    icon: siGithub.path,
    tint: "#1B2333",
  },
  {
    label: "Resume",
    desc: null,
    href: "/documents/resume.pdf",
    external: true,
    icon: DOC_PATH,
    tint: "#5B6577",
  },
]

export function PageContact({ isActive = true }: { isActive?: boolean }) {
  // 페이지 전환이 끝나면 헤드라인 → 본문·연락처 카드가 차례로 나타난다. 라벨만 고정.
  const headlineRevealed = useSlideReveal(isActive)
  const contentRevealed = useSlideReveal(isActive, 850)

  return (
    <Page>
      <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-center md:gap-16">
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
              className="text-[clamp(2rem,7vw,3.9rem)] font-light text-[#1B2333] mt-2"
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

        {/* 연락처 카드 — 아이콘 타일 + 채널명 + 주소, 우측 화살표. 호버 시
            떠오름·그림자·테두리 효과는 ABOUT 증명사진과 동일(.lift-surface). */}
        <Reveal
          show={contentRevealed}
          className="w-full space-y-3.5 md:w-[30rem] md:shrink-0"
        >
          {CHANNELS.map(({ label, desc, href, external, icon, tint }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="lift-surface group flex items-center gap-4 rounded-2xl bg-white/65 px-4 py-3 backdrop-blur-sm"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ background: hexToRgba(tint, 0.1), color: tint }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d={icon} />
                </svg>
              </span>
              <span className="flex min-w-0 flex-1 items-baseline gap-2.5">
                <span
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                  className="shrink-0 text-[15px] text-[#1B2333]"
                >
                  {label}
                </span>
                {desc && (
                  <span
                    style={{ fontFamily: "var(--font-body)" }}
                    className="truncate text-[13px] text-[#0C0F1A]/45"
                  >
                    {desc}
                  </span>
                )}
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
