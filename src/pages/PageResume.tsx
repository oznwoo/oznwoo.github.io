import { Page } from "@/components/layout/Page"
import { ResumeCardHeader } from "@/components/resume/ResumeCardHeader"
import { TimelineItem } from "@/components/resume/TimelineItem"
import { CORE_SKILLS, EXP_COLS, RESUME_HEADER_COLOR } from "@/data/resume"
import { SkillIcon } from "@/lib/skillIcons"
import { Reveal } from "@/components/ui/Reveal"
import { useSlideReveal } from "@/hooks/useSlideReveal"
import { useIsMobile } from "@/hooks/useIsMobile"

export function PageResume({ isActive = true }: { isActive?: boolean }) {
  const education = EXP_COLS.find((col) => col.title === "교육")
  const activity = EXP_COLS.find((col) => col.title === "활동")
  const certificate = EXP_COLS.find((col) => col.title === "자격증")

  // 페이지 전환이 끝나면 카테고리 헤더(EDUCATION 등)와 그 내용이 한 덩어리로
  // 위에서 아래로 나타난다. 페이지 라벨(RESUME)과 "이력" 타이틀만 고정.
  // 데스크톱은 2×2 그리드라 같은 가로 행끼리(교육·활동 / 스킬·자격증) 한
  // 타이밍에 등장하고, 모바일은 세로 1열이라 네 블록을 조금씩 늦춰 계단식으로 등장시킨다.
  const isMobile = useIsMobile()
  const eduRevealed = useSlideReveal(isActive)
  const actRevealed = useSlideReveal(isActive, isMobile ? 830 : 750)
  const skillRevealed = useSlideReveal(isActive, isMobile ? 910 : 850)
  const certRevealed = useSlideReveal(isActive, isMobile ? 990 : 850)

  return (
    <Page>
      <div>
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/45 tracking-[0.04em] uppercase"
        >
          Resume
        </span>
        <h2
          style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          className="text-[clamp(1.1rem,5vw,2.2rem)] text-[#0C0F1A] mt-1 mb-4 sm:mb-6 md:mb-8"
        >
          이력
        </h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:gap-x-8 sm:gap-y-6 md:grid-cols-2 md:gap-x-14 md:gap-y-10">
          <div>
            <Reveal show={eduRevealed}>
              <ResumeCardHeader label="Education" color={RESUME_HEADER_COLOR} />
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                {education?.items.map((item) => (
                  <TimelineItem key={item.name} item={item} />
                ))}
              </div>
            </Reveal>
          </div>
          <div>
            <Reveal show={actRevealed}>
              <ResumeCardHeader label="Activities" color={RESUME_HEADER_COLOR} />
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                {activity?.items.map((item) => (
                  <TimelineItem key={item.name} item={item} />
                ))}
              </div>
            </Reveal>
          </div>
          <div>
            <Reveal show={skillRevealed}>
              <ResumeCardHeader label="Skills" color={RESUME_HEADER_COLOR} />
              <div className="grid grid-cols-3 gap-x-2 gap-y-1.5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3">
                {CORE_SKILLS.map((item) => (
                  <div
                    key={item}
                    className="group flex items-center gap-1.5 sm:gap-2"
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md border border-[#0C0F1A]/10 p-[3px] text-[#0C0F1A]/45 transition-colors duration-150 group-hover:border-[#4F6EF7]/40 group-hover:text-[#4F6EF7] sm:h-6 sm:w-6 sm:p-[5px]">
                      <SkillIcon name={item} />
                    </span>
                    <span
                      style={{ fontFamily: "var(--font-body)" }}
                      className="text-[9px] font-light text-[#0C0F1A]/60 transition-colors duration-150 group-hover:text-[#0C0F1A]/80 sm:text-xs"
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <div>
            <Reveal show={certRevealed}>
              <ResumeCardHeader
                label="Certifications"
                color={RESUME_HEADER_COLOR}
              />
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                {certificate?.items.map((item) => (
                  <TimelineItem key={item.name} item={item} />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Page>
  )
}
