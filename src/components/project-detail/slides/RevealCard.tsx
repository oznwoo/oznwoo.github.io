import { useEffect, useState } from "react"
import type { ProjectDetailCardItem } from "@/data/projects"
import type { ProjectAccent } from "@/lib/color"
import { hexToRgba, mixWithWhite } from "@/lib/color"
import { renderWithEmphasis } from "@/lib/emphasis"
import { AccentPill } from "../AccentPill"
import { MediaPlaceholder } from "../MediaPlaceholder"

// 세로 슬라이드 트랙 전환(ProjectDetailView, 0.75s)이 끝난 뒤에야 설명이
// 내려오며 나타난다.
const SLIDE_TRANSITION_MS = 750

interface RevealCardProps {
  item: ProjectDetailCardItem
  accent: ProjectAccent | null
  accentColor: string
  projectId: string
  imageWidth: number
  imageHeight: number
  // 이 카드가 속한 슬라이드(Problem/Solution)가 지금 화면에 보이는지 —
  // true가 되고 슬라이드 전환이 끝나면 설명이 이미지 아래에서 내려오며 나타난다.
  isActive: boolean
}

// Problem/Solution 카드 — 번호는 없애고 타이틀을 이미지 위로 올린다. 태그는
// 이미지 밖 맨 아래에 두고, 설명 문단은 상시 노출하되 이 카드가 속한
// 슬라이드로 전환해 들어올 때마다 이미지 아래에서 내려오며 나타나는
// 연출을 다시 재생한다.
export function RevealCard({
  item,
  accent,
  accentColor,
  projectId,
  imageWidth,
  imageHeight,
  isActive,
}: RevealCardProps) {
  // 이미지 자체의 hover 살짝 뜨는 효과 — 설명 노출과는 별개로 마우스
  // 호버에만 반응한다.
  const [imgHovered, setImgHovered] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!isActive) {
      setRevealed(false)
      return
    }
    const timer = setTimeout(() => setRevealed(true), SLIDE_TRANSITION_MS)
    return () => clearTimeout(timer)
  }, [isActive])

  return (
    <div className="flex flex-col gap-3">
      {/* 타이틀은 Hahmlet(세리프) 대신 본문과 같은 Pretendard로 — 카드
          맨 위에서 눈에 먼저 띄는 자리라 더 깔끔하고 또렷하게 보이게 한다 */}
      <h3
        style={{ fontFamily: "var(--font-body)" }}
        className="text-base font-semibold text-[#0C0F1A]"
      >
        {item.title}
      </h3>
      {item.image ? (
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
      ) : (
        // 아직 실제 스크린샷을 받지 못한 카드 — 영역을 접지 않고 같은
        // 비율의 자리표시자를 보여줘 이후 이미지만 채워 넣으면 되게 한다
        <MediaPlaceholder
          kind="image"
          accentColor={accentColor}
          style={{ aspectRatio: `${imageWidth} / ${imageHeight}` }}
        />
      )}
      {/* 설명 문단 — 바깥 grid-template-rows(0fr<->1fr)로 아래 태그가 밀려날
          공간을 부드럽게 확보하고, 안쪽 translateY+opacity로 실제로 이미지
          아래에서 내려오며 나타나는 움직임을 만든다. 설명이 없는 카드(예:
          Outcome 갤러리)는 이 블록 자체를 렌더링하지 않는다 */}
      {(item.body || item.shortBody) && (
        <div
          style={{
            display: "grid",
            gridTemplateRows: revealed ? "1fr" : "0fr",
            transition: "grid-template-rows 0.5s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="overflow-hidden">
            <div
              style={{
                transform: revealed ? "translateY(0)" : "translateY(-10px)",
                opacity: revealed ? 1 : 0,
                transition:
                  "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease-out",
              }}
            >
              <div
                className="rounded-2xl p-4 backdrop-blur-sm"
                style={{
                  // 완전한 흰색은 화면과 겉돌아 어색하다 — 흰색에 accent를
                  // 아주 옅게만 섞어 "거의 흰색인데 은은히 톤이 있는" 색을
                  // 반투명하게 얹는다
                  background: hexToRgba(mixWithWhite(accentColor, 0.93), 0.62),
                  border: "1px solid rgba(12,15,26,0.06)",
                }}
              >
                {item.shortBody ? (
                  <ul className="flex flex-col gap-1.5">
                    {item.shortBody.map((line, i) => (
                      <li
                        key={i}
                        style={{ fontFamily: "var(--font-body)" }}
                        className="text-sm text-[#0C0F1A]/70 leading-relaxed font-normal flex items-start gap-2"
                      >
                        <span
                          aria-hidden="true"
                          className="w-1 h-1 rounded-full shrink-0 mt-2"
                          style={{ background: accentColor }}
                        />
                        <span>{renderWithEmphasis(line)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    style={{ fontFamily: "var(--font-body)" }}
                    className="text-sm text-[#0C0F1A]/70 leading-relaxed font-normal"
                  >
                    {item.body}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {item.tags && (
        <div className="flex flex-wrap gap-2">
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
  )
}
