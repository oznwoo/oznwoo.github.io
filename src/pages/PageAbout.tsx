import profilePhoto from "@/imports/profile-photo.webp"
import { Page } from "@/components/layout/Page"
import { PhotoLightbox } from "@/components/about/PhotoLightbox"
import { Reveal } from "@/components/ui/Reveal"
import { useSlideReveal } from "@/hooks/useSlideReveal"

export function PageAbout({ isActive = true }: { isActive?: boolean }) {
  // 페이지 전환이 끝나면 헤드라인 → 본문 → 스탯 → (마지막에) 사진이
  // 750ms부터 100ms 간격으로 차례로 나타난다 (전 페이지 공통 리듬)
  const headlineRevealed = useSlideReveal(isActive)
  const bodyRevealed = useSlideReveal(isActive, 850)
  const statsRevealed = useSlideReveal(isActive, 950)
  const photoRevealed = useSlideReveal(isActive, 1050)

  return (
    <Page>
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-center md:gap-16">
        {/* "About" 라벨은 모바일에서만 사진보다 먼저 보이는 독립 요소 —
            데스크톱은 텍스트 블록 맨 위에 있는 라벨을 그대로 쓴다 */}
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/45 tracking-[0.04em] uppercase md:hidden"
        >
          About
        </span>
        {/* 사진은 등장 순서상 가장 마지막에 나타난다 (헤드라인·본문·스탯 뒤).
            호버 떠오름·그림자·테두리 효과는 .lift-surface로 CONTACT 카드와 통일.
            클릭하면 그 자리에서부터 커지는 라이트박스로 확대된다. */}
        <Reveal show={photoRevealed} className="shrink-0 md:order-2">
          <PhotoLightbox
            src={profilePhoto}
            alt="오진우"
            frameClassName="lift-surface w-40 sm:w-44 md:w-[260px]"
            frameStyle={{ aspectRatio: "3/4", borderRadius: "16px" }}
          />
        </Reveal>
        <div className="md:order-1">
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="hidden text-xs text-[#0C0F1A]/45 tracking-[0.04em] uppercase md:inline-block"
          >
            About
          </span>
          <Reveal show={headlineRevealed}>
            <h2
              style={{ fontFamily: "var(--font-display)", lineHeight: 1.3 }}
              className="text-[clamp(1.3rem,6vw,2.8rem)] font-light text-[#1B2333] mt-2 mb-4 md:mt-3 md:mb-6"
            >
              <span className="text-[0.8em]">결국,</span>
              <br />
              <span className="shimmer-title font-semibold">문제를 해결해야 합니다.</span>
            </h2>
          </Reveal>
          <Reveal
            show={bodyRevealed}
            className="space-y-2 text-[#0C0F1A]/70 font-normal text-xs leading-relaxed max-w-lg md:space-y-3 md:text-sm md:leading-loose"
          >
            <p
              style={{ fontFamily: "var(--font-body)" }}
              className="hidden sm:block"
            >
              안녕하세요. 아이디어를 현실에서 작동하는 서비스로 만드는 개발자
              오진우입니다.
            </p>
            <p style={{ fontFamily: "var(--font-body)" }}>
              사용자의 불편을 표면적으로 해결하는 데 그치지 않고, 다양한
              관점에서 근본 원인을 살펴 쓸모 있는 해결책으로 구현하는 일을
              좋아합니다.
            </p>
            <p
              style={{ fontFamily: "var(--font-body)" }}
              className="hidden md:block"
            >
              AI를 생각과 실행을 확장하는 도구로 활용하되, 무엇을 왜 만들고
              어떻게 활용할지는 개발자가 판단해야 한다고 믿습니다. 과정을
              꾸준히 쌓고, 의미 있는 결과로 증명하겠습니다.
            </p>
          </Reveal>
          <Reveal
            show={statsRevealed}
            className="mt-4 grid grid-cols-3 gap-3 border-t border-[#0C0F1A]/8 pt-4 sm:gap-6 sm:pt-5 md:mt-8 md:pt-7"
          >
            {[
              ["24세", "AGE"],
              ["INFP", "MBTI"],
              ["4.22", "GPA / 4.5"],
            ].map(([n, l]) => (
              <div key={l}>
                <div
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-base font-semibold text-[#0C0F1A] sm:text-xl md:text-2xl"
                >
                  {n}
                </div>
                <div
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-[9px] text-[#0C0F1A]/50 uppercase tracking-[0.02em] mt-1 sm:text-xs"
                >
                  {l}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </Page>
  )
}
