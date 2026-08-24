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
  onTransition: (direction: 1 | -1) => void
}

// Fintag만 PROBLEM과 1:1로 짝지은 3단계 쇼케이스를 쓰고, 나머지 프로젝트는
// Problem과 동일한 카드 그리드를 그대로 쓴다.
export function SolutionSlide({
  problemItems,
  items,
  accent,
  accentColor,
  projectId,
  isMobile,
  isActive,
  onTransition,
}: SolutionSlideProps) {
  if (projectId === "01") {
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
        onTransition={onTransition}
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
