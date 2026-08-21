import profilePhoto from "@/imports/____________________.jpeg"
import { Page } from "@/components/layout/Page"

export function PageAbout() {
  return (
    <Page>
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:gap-12">
        {/* "About" 라벨은 모바일에서만 사진보다 먼저 보이는 독립 요소 —
            데스크톱은 텍스트 블록 맨 위에 있는 라벨을 그대로 쓴다 */}
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase md:hidden"
        >
          About
        </span>
        <div
          className="overflow-hidden shrink-0 w-36 sm:w-40 md:w-[180px]"
          style={{
            aspectRatio: "3/4",
            borderRadius: "16px",
            boxShadow:
              "0 20px 48px rgba(12,15,26,0.18), 0 4px 12px rgba(12,15,26,0.10)",
            border: "none",
          }}
        >
          <img
            src={profilePhoto}
            alt="오진우"
            className="w-full h-full object-cover object-top"
            style={{ borderRadius: "16px" }}
          />
        </div>
        <div>
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="hidden text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase md:inline-block"
          >
            About
          </span>
          <h2
            style={{ fontFamily: "var(--font-display)", lineHeight: 1.3 }}
            className="text-[clamp(1.3rem,6vw,2.8rem)] font-light text-[#0C0F1A] mt-2 mb-4 md:mt-3 md:mb-6"
          >
            결국,
            <br />
            <span className="font-semibold">문제를 해결해야 합니다.</span>
          </h2>
          <div
            style={{ fontFamily: "var(--font-body)" }}
            className="space-y-2 text-[#0C0F1A]/50 font-light text-xs leading-relaxed max-w-lg md:space-y-3 md:text-sm md:leading-loose"
          >
            <p className="hidden sm:block">
              안녕하세요. 세상의 다양한 문제를 해결하고 싶은 오진우입니다.
            </p>
            <p>
              AI 발전으로 누구나 적은 전문 지식으로도 원하는 결과를 구현할 수
              있는 시대가 되었다고 생각합니다. 이제는 왜, 어떻게 잘 구현하는
              것이 중요하다고 느낍니다.
            </p>
            <p className="hidden md:block">
              일의 본질은 인간 세상의 문제를 해결하는 것이고 공감이 이에 대한
              마스터키라고 생각합니다.
            </p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[#0C0F1A]/8 pt-4 sm:gap-6 sm:pt-5 md:mt-8 md:pt-7">
            {[
              ["4.22", "GPA / 4.5"],
              ["4건", "주요 프로젝트"],
              ["1편", "학술 논문"],
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
                  className="text-[9px] text-[#0C0F1A]/30 uppercase tracking-[0.02em] mt-1 sm:text-xs"
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  )
}
