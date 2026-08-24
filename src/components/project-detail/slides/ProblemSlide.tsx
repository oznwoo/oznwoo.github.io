import type { ProjectDetailCardItem } from "@/data/projects"
import type { ProjectAccent } from "@/lib/color"
import { CardGridSlide } from "./CardGridSlide"

interface ProblemSlideProps {
  items: ProjectDetailCardItem[]
  accent: ProjectAccent | null
  accentColor: string
  projectId: string
  isMobile: boolean
  isActive: boolean
}

export function ProblemSlide({
  items,
  accent,
  accentColor,
  projectId,
  isMobile,
  isActive,
}: ProblemSlideProps) {
  return (
    <CardGridSlide
      eyebrow="Problem"
      items={items}
      accent={accent}
      accentColor={accentColor}
      projectId={projectId}
      imageWidth={1024}
      imageHeight={765}
      isMobile={isMobile}
      isActive={isActive}
    />
  )
}
