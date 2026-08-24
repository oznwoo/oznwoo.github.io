import { useState } from "react"
import type { ProjectDetailCardItem } from "@/data/projects"
import type { ProjectAccent } from "@/lib/color"
import { hexToRgba, mixWithWhite } from "@/lib/color"
import { AccentPill } from "../AccentPill"

interface CardGridItemProps {
  item: ProjectDetailCardItem
  index: number
  accent: ProjectAccent | null
  accentColor: string
  projectId: string
  imageWidth: number
  imageHeight: number
}

// Problem/Solution 카드 하나 — 이미지는 About 스크린샷과 동일한
// border+hover(lift, accent 그림자·테두리) 프레임으로, 텍스트(번호·제목·
// 본문·태그)는 그 아래 은은한 accent 틴트 배경의 별도 카드로 분리한다.
// 아이콘은 넣지 않는다.
export function CardGridItem({
  item,
  index,
  accent,
  accentColor,
  projectId,
  imageWidth,
  imageHeight,
}: CardGridItemProps) {
  const [imgHovered, setImgHovered] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      {item.image && (
        <div
          onMouseEnter={() => setImgHovered(true)}
          onMouseLeave={() => setImgHovered(false)}
          className="rounded-2xl overflow-hidden border cursor-default"
          style={{
            borderColor: imgHovered
              ? hexToRgba(accentColor, 0.35)
              : "rgba(12,15,26,0.1)",
            boxShadow: imgHovered
              ? `0 20px 45px -14px ${hexToRgba(accentColor, 0.35)}, 0 8px 18px -8px rgba(12,15,26,0.28)`
              : "0 14px 34px -18px rgba(12,15,26,0.24), 0 4px 10px -6px rgba(12,15,26,0.12)",
            transform: imgHovered
              ? "translateY(-3px) scale(1.012)"
              : "translateY(0) scale(1)",
            transition:
              "transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease-out, border-color 0.4s ease-out",
          }}
        >
          {/* 고정 높이 박스에 object-cover로 채우면 위아래가 잘려서, 원본
              비율 그대로(w-full h-auto) 보여준다 — 대신 소스 이미지 자체를
              같은 크기로 맞춰둬야 카드 세 개의 높이가 가지런히 정렬된다 */}
          <img
            src={item.image}
            alt=""
            aria-hidden="true"
            loading="lazy"
            width={imageWidth}
            height={imageHeight}
            className="w-full h-auto block"
          />
        </div>
      )}
      <div
        className="rounded-2xl p-6 flex flex-col gap-3 flex-1 backdrop-blur-sm"
        style={{
          // 완전 불투명(솔리드)은 너무 답답해 보였다 — 흰색과 섞어 밝힌 색을
          // 반투명하게(+backdrop-blur) 얹어서, 뒤에 깔린 blob 배경이 옅게
          // 비치되 본문 텍스트 대비는 충분히 확보되는 선을 맞춘다.
          background: hexToRgba(mixWithWhite(accentColor, 0.85), 0.55),
          border: "1px solid rgba(12,15,26,0.06)",
        }}
      >
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25"
        >
          0{index + 1}
        </span>
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
              <AccentPill
                key={t}
                label={t}
                accent={accent}
                accentColor={accentColor}
                projectId={projectId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
