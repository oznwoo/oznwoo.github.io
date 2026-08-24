import type { ProjectDetailCardItem } from "@/data/projects"
import { CardGridSlide } from "./CardGridSlide"

interface ProblemSlideProps {
  items: ProjectDetailCardItem[]
  accentColor: string
  isMobile: boolean
}

export function ProblemSlide({ items, accentColor, isMobile }: ProblemSlideProps) {
  return (
    <CardGridSlide
      eyebrow="Problem"
      items={items}
      accentColor={accentColor}
      imageWidth={531}
      imageHeight={386}
      isMobile={isMobile}
    />
  )
}
