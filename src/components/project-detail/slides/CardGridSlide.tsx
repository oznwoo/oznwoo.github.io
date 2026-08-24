import { hexToRgba } from "@/lib/color"
import type { ProjectDetailCardItem } from "@/data/projects"
import { DetailIcon } from "../DetailIcon"

interface CardGridSlideProps {
  eyebrow: string
  items: ProjectDetailCardItem[]
  accentColor: string
  // 카드 상단 미리보기 이미지의 실제 크기(CLS 방지용 힌트). Problem/Solution
  // 슬라이드가 서로 다른 원본 비율의 발표자료 이미지를 쓰기 때문에 호출부에서
  // 넘겨받는다.
  imageWidth: number
  imageHeight: number
  isMobile: boolean
}

// Problem/Solution 슬라이드가 공유하는 카드 그리드 — PPT 발표자료의 카드
// 레이아웃(헤더 색 바 + 아이콘 + 태그)만 가져오고 색/폰트 등 PPT 자체
// 템플릿 스타일은 따르지 않는다
export function CardGridSlide({
  eyebrow,
  items,
  accentColor,
  imageWidth,
  imageHeight,
  isMobile,
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
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-[#0C0F1A]/8 bg-white/50 backdrop-blur-sm flex flex-col"
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 z-10"
                style={{ background: accentColor }}
              />
              {item.image && (
                <div className="h-36 md:h-40 overflow-hidden bg-[#0C0F1A]/[0.03]">
                  <img
                    src={item.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    width={imageWidth}
                    height={imageHeight}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div className="flex items-start justify-between">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center p-2.5 shrink-0"
                    style={{ background: hexToRgba(accentColor, 0.1), color: accentColor }}
                  >
                    {item.icon && <DetailIcon name={item.icon} />}
                  </div>
                  <span
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="text-xs text-[#0C0F1A]/20"
                  >
                    0{i + 1}
                  </span>
                </div>
                <div>
                  <h3
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-base font-medium text-[#0C0F1A] mb-2"
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{ fontFamily: "var(--font-body)" }}
                    className="text-sm text-[#0C0F1A]/50 leading-relaxed font-light"
                  >
                    {item.body}
                  </p>
                </div>
                {item.tags && (
                  <div className="flex flex-wrap gap-2 mt-auto pt-1">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: accentColor,
                          borderColor: hexToRgba(accentColor, 0.25),
                        }}
                        className="text-[10px] px-2.5 py-1 rounded-full border tracking-[0.02em]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
