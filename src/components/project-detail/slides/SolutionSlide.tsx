import type { ProjectDetailCardItem } from "@/data/projects"
import type { ProjectAccent } from "@/lib/color"
import { CardGridSlide } from "./CardGridSlide"

interface SolutionSlideProps {
  items: ProjectDetailCardItem[]
  accent: ProjectAccent | null
  accentColor: string
  projectId: string
  isMobile: boolean
}

export function SolutionSlide({
  items,
  accent,
  accentColor,
  projectId,
  isMobile,
}: SolutionSlideProps) {
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
    />
  )
}
