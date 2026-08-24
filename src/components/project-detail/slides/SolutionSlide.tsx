import type { ProjectDetailCardItem } from "@/data/projects"
import { CardGridSlide } from "./CardGridSlide"

interface SolutionSlideProps {
  items: ProjectDetailCardItem[]
  accentColor: string
  isMobile: boolean
}

export function SolutionSlide({ items, accentColor, isMobile }: SolutionSlideProps) {
  return (
    <CardGridSlide
      eyebrow="Solution"
      items={items}
      accentColor={accentColor}
      imageWidth={1400}
      imageHeight={460}
      isMobile={isMobile}
    />
  )
}
