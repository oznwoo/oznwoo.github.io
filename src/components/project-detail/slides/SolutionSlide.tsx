import type { ProjectDetailCardItem } from "@/data/projects"
import type { ProjectAccent } from "@/lib/color"
import { CardGridSlide } from "./CardGridSlide"
import { SolutionShowcase } from "./SolutionShowcase"

interface SolutionSlideProps {
  problemItems: ProjectDetailCardItem[]
  items: ProjectDetailCardItem[]
  accent: ProjectAccent | null
  accentColor: string
  projectId: string
  isMobile: boolean
  isActive: boolean
}

// solution 항목이 AS-IS/TO-BE 비교 구조(comparison)를 갖는 프로젝트는
// PROBLEM 탭 + 화살표로 스텝을 넘기는 쇼케이스를 쓰고, 그렇지 않은
// 프로젝트는 Problem과 동일한 카드 그리드를 그대로 쓴다.
export function SolutionSlide({
  problemItems,
  items,
  accent,
  accentColor,
  projectId,
  isMobile,
  isActive,
}: SolutionSlideProps) {
  const useShowcase = items.some((item) => item.comparison)
  if (useShowcase) {
    return (
      <SolutionShowcase
        problems={problemItems}
        solutions={items}
        accent={accent}
        accentColor={accentColor}
        projectId={projectId}
        imageWidth={1400}
        imageHeight={460}
        isMobile={isMobile}
        isActive={isActive}
      />
    )
  }

  return (
    <CardGridSlide
      eyebrow="Solution"
      items={items}
      accent={accent}
      accentColor={accentColor}
      projectId={projectId}
      imageWidth={1400}
      imageHeight={460}
      isMobile={isMobile}
      isActive={isActive}
    />
  )
}
