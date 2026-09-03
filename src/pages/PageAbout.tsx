import { useState } from "react"
import profilePhoto from "@/imports/____________________.jpeg"
import { Page } from "@/components/layout/Page"
import { Reveal } from "@/components/ui/Reveal"
import { useSlideReveal } from "@/hooks/useSlideReveal"

export function PageAbout({ isActive = true }: { isActive?: boolean }) {
  // 페이지 전환이 끝나면 헤드라인 → 본문 → 스탯이 차례로 위에서 아래로 나타난다
  const headlineRevealed = useSlideReveal(isActive)
  const bodyRevealed = useSlideReveal(isActive, 850)
  const statsRevealed = useSlideReveal(isActive, 980)
  const [photoHovered, setPhotoHovered] = useState(false)

  return (
    <Page>
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:gap-12">
        {/* "About" 라벨은 모바일에서만 사진보다 먼저 보이는 독립 요소 —
            데스크톱은 텍스트 블록 맨 위에 있는 라벨을 그대로 쓴다 */}
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/45 tracking-[0.04em] uppercase md:hidden"
        >
          About
        </span>
        <div
          onMouseEnter={() => setPhotoHovered(true)}
          onMouseLeave={() => setPhotoHovered(false)}
          className="overflow-hidden shrink-0 w-36 sm:w-40 md:w-[180px] cursor-default"
          style={{
            aspectRatio: "3/4",
            borderRadius: "16px",
            boxShadow: photoHovered
              ? "0 30px 64px rgba(12,15,26,0.26), 0 10px 24px rgba(12,15,26,0.16)"
              : "0 20px 48px rgba(12,15,26,0.18), 0 4px 12px rgba(12,15,26,0.10)",
            transform: photoHovered
              ? "translateY(-5px) scale(1.02)"
              : "translateY(0) scale(1)",
            transition:
              "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease-out",
            border: "none",
          }}
        >
          <img
            src={profilePhoto}
            alt="오진우"
            className="w-full h-full object-cover object-top"
            style={{
              borderRadius: "16px",
              transform: photoHovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        </div>
        <div>
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
              안녕하세요. 세상의 다양한 문제를 해결하고 싶은 오진우입니다.
            </p>
            <p style={{ fontFamily: "var(--font-body)" }}>
              AI 발전으로 누구나 적은 전문 지식으로도 원하는 결과를 구현할 수
              있는 시대가 되었다고 생각합니다. 이제는 왜, 어떻게 잘 구현하는
              것이 중요하다고 느낍니다.
            </p>
            <p
              style={{ fontFamily: "var(--font-body)" }}
              className="hidden md:block"
            >
              일의 본질은 인간 세상의 문제를 해결하는 것이고 공감이 이에 대한
              마스터키라고 생각합니다.
            </p>
          </Reveal>
          <Reveal
            show={statsRevealed}
            className="mt-4 grid grid-cols-3 gap-3 border-t border-[#0C0F1A]/8 pt-4 sm:gap-6 sm:pt-5 md:mt-8 md:pt-7"
          >
            {[
              ["24세", "AGE"],
              ["INFJ", "MBTI"],
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
