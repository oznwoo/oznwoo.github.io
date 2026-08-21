import { Page } from "@/components/layout/Page"
import { ResumeCardHeader } from "@/components/resume/ResumeCardHeader"
import { TimelineItem } from "@/components/resume/TimelineItem"
import { CORE_SKILLS, EXP_COLS, CATEGORY_COLOR } from "@/data/resume"
import { SkillIcon } from "@/lib/skillIcons"

export function PageResume() {
  const education = EXP_COLS.find((col) => col.title === "교육")
  const activity = EXP_COLS.find((col) => col.title === "활동")
  const certificate = EXP_COLS.find((col) => col.title === "자격증")

  return (
    <Page>
      <div>
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase"
        >
          Resume
        </span>
        <h2
          style={{ fontFamily: "var(--font-nanum)", fontWeight: 700 }}
          className="text-[clamp(1.1rem,5vw,2.2rem)] text-[#0C0F1A] mt-1 mb-4 sm:mb-6 md:mb-8"
        >
          이력
        </h2>
        {/* 모바일은 한 컬럼으로 위→아래 나열되니 섹션 사이에 얇은 divider를
            그어 구분을 준다. md 이상은 2열 그리드라 gap만으로 충분해 border는 끈다. */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:gap-x-8 sm:gap-y-6 md:grid-cols-2 md:gap-x-14 md:gap-y-10">
          <div>
            <ResumeCardHeader label="Education" color={CATEGORY_COLOR.교육} />
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {education?.items.map((item) => (
                <TimelineItem key={item.name} item={item} />
              ))}
            </div>
          </div>
          <div className="pt-5 border-t border-[#0C0F1A]/8 sm:pt-6 md:pt-0 md:border-t-0">
            <ResumeCardHeader label="Activities" color={CATEGORY_COLOR.활동} />
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {activity?.items.map((item) => (
                <TimelineItem key={item.name} item={item} />
              ))}
            </div>
          </div>
          <div className="pt-5 border-t border-[#0C0F1A]/8 sm:pt-6 md:pt-0 md:border-t-0">
            <ResumeCardHeader label="Certifications" color={CATEGORY_COLOR.자격증} />
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {certificate?.items.map((item) => (
                <TimelineItem key={item.name} item={item} />
              ))}
            </div>
          </div>
          <div className="pt-5 border-t border-[#0C0F1A]/8 sm:pt-6 md:pt-0 md:border-t-0">
            <ResumeCardHeader label="Skills" color="rgba(12,15,26,0.35)" />
            <div className="grid grid-cols-3 gap-x-2 gap-y-1.5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3">
              {CORE_SKILLS.map((item) => (
                <div key={item} className="group flex items-center gap-1.5 sm:gap-2">
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
          </div>
        </div>
      </div>
    </Page>
  )
}
