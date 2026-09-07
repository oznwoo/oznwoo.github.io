import type { ProjectDetailCardItem } from "@/data/projects"
import type { ProjectAccent } from "@/lib/color"
import { RevealCard } from "./RevealCard"

interface CardGridSlideProps {
  eyebrow: string
  items: ProjectDetailCardItem[]
  accent: ProjectAccent | null
  accentColor: string
  projectId: string
  // 카드 이미지의 실제 크기(CLS 방지용 힌트). Problem/Solution 슬라이드가
  // 서로 다른 원본 비율의 발표자료 이미지를 쓰기 때문에 호출부에서 넘겨받는다.
  imageWidth: number
  imageHeight: number
  isMobile: boolean
  // 이 슬라이드가 지금 화면에 보이는지 — RevealCard가 슬라이드 전환 후
  // 설명을 내려서 보여주는 타이밍을 잡는 데 쓴다.
  isActive: boolean
}

// Problem/Solution 슬라이드가 공유하는 카드 그리드 — 레이아웃만 담당하고
// 카드 자체(이미지 프레임·텍스트 카드·pill)는 RevealCard에 위임한다.
export function CardGridSlide({
  eyebrow,
  items,
  accent,
  accentColor,
  projectId,
  imageWidth,
  imageHeight,
  isMobile,
  isActive,
}: CardGridSlideProps) {
  return (
    <div
      className={
        isMobile
          ? "min-h-screen w-full flex items-center justify-center px-6 pl-16 py-20"
          : "min-h-screen flex items-center justify-center px-8 md:px-16 shrink-0 py-24"
      }
    >
      <div className="max-w-6xl w-full">
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase mb-10 block"
        >
          {eyebrow}
        </span>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <RevealCard
              key={i}
              item={item}
              accent={accent}
              accentColor={accentColor}
              projectId={projectId}
              imageWidth={imageWidth}
              imageHeight={imageHeight}
              isActive={isActive}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
