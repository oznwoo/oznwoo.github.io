import type { ProjectDetailCardItem } from "@/data/projects"
import type { ProjectAccent } from "@/lib/color"
import { CardGridSlide } from "./CardGridSlide"
import { FintagProblemCard } from "./FintagProblemCard"

interface ProblemSlideProps {
  items: ProjectDetailCardItem[]
  accent: ProjectAccent | null
  accentColor: string
  projectId: string
  isMobile: boolean
  // Problem이 지금 화면에 보이는 슬라이드인지 — Fintag 실험 카드가 슬라이드
  // 전환 이후 설명을 내려서 보여주는 타이밍을 잡는 데 쓴다.
  isActive: boolean
}

const IMAGE_WIDTH = 1024
const IMAGE_HEIGHT = 765

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
      imageWidth={IMAGE_WIDTH}
      imageHeight={IMAGE_HEIGHT}
      isMobile={isMobile}
      // Fintag만 우선 실험: 타이틀을 이미지 위로, 태그는 이미지 밖 아래로,
      // 설명은 슬라이드 전환 후 이미지 아래에서 내려오며 나타나는 카드로.
      // 다른 프로젝트는 기존 CardGridItem(기본값) 그대로 유지한다.
      renderItem={
        projectId === "01"
          ? (item) => (
              <FintagProblemCard
                item={item}
                accent={accent}
                accentColor={accentColor}
                projectId={projectId}
                imageWidth={IMAGE_WIDTH}
                imageHeight={IMAGE_HEIGHT}
                isActive={isActive}
              />
            )
          : undefined
      }
    />
  )
}
