import { useState } from "react"
import { Page } from "@/components/layout/Page"
import { PROJECTS, PROJECT_ACCENT } from "@/data/projects"
import { hexToRgba, mixWithWhite } from "@/lib/color"

export function PageProjects({
  onOpen,
  onHover,
}: {
  onOpen: (id: string) => void
  onHover: (id: string | null) => void
}) {
  const [hovered, setHovered] = useState<string | null>(null)
  return (
    <Page>
      <div>
        <div className="flex items-end justify-between mb-8">
          <div>
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase"
            >
              Projects
            </span>
            <h2
              style={{ fontFamily: "var(--font-nanum)", fontWeight: 700 }}
              className="text-[clamp(1.4rem,3vw,2.2rem)] text-[#0C0F1A] mt-1"
            >
              주요 프로젝트
            </h2>
          </div>
          <a
            href="https://github.com/oznwoo"
            target="_blank"
            rel="noreferrer"
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-xs text-[#0C0F1A]/30 hover:text-[#0C0F1A] transition-colors uppercase tracking-[0.02em]"
          >
            GitHub →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROJECTS.map((p) => {
            const cardAccent = PROJECT_ACCENT[p.id] ?? null
            const cardActive = hovered === p.id
            return (
            <button
              key={p.id}
              onClick={() => onOpen(p.id)}
              onMouseEnter={() => {
                setHovered(p.id)
                onHover(p.id)
              }}
              onMouseLeave={() => {
                setHovered(null)
                onHover(null)
              }}
              className="group text-left rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200"
              style={{
                // 한쪽에서 옅어지는 선형 그라디언트 대신, 카드 곳곳에 부드러운
                // blob 여러 개를 겹쳐 얼룩덜룩하게 번진 느낌을 낸다. 단색
                // 브랜드(Fintag/Gopssl)도 alpha·위치·크기가 제각각이라 균일하지
                // 않게 보이고, 다색 브랜드는 여기에 색상 차이까지 더해진다
                background: cardActive
                  ? cardAccent
                    ? [
                        `radial-gradient(circle at 18% 22%, ${hexToRgba(cardAccent.blobs[0], 0.13)} 0%, transparent 52%)`,
                        `radial-gradient(circle at 78% 15%, ${hexToRgba(cardAccent.blobs[1], 0.1)} 0%, transparent 46%)`,
                        `radial-gradient(circle at 60% 85%, ${hexToRgba(cardAccent.blobs[2], 0.11)} 0%, transparent 50%)`,
                        `radial-gradient(circle at 12% 88%, ${hexToRgba(cardAccent.blobs[0], 0.07)} 0%, transparent 40%)`,
                        `radial-gradient(circle at 92% 65%, ${hexToRgba(cardAccent.blobs[2], 0.07)} 0%, transparent 42%)`,
                        "rgba(248,250,255,0.9)",
                      ].join(", ")
                    : "rgba(248,250,255,0.88)"
                  : "transparent",
                boxShadow: cardActive
                  ? "0 12px 40px rgba(79,110,247,0.10), 0 2px 10px rgba(12,15,26,0.07)"
                  : "none",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((t) => {
                    const accent = PROJECT_ACCENT[p.id] ?? null
                    const active = hovered === p.id && accent !== null
                    // CoChat for Business는 blobs[0](골드)가 흰색과 반씩 섞이면
                    // 너무 밝은 파스텔이 되어 흰 글자 대비가 떨어져서, 이 프로젝트만
                    // 살짝 덜 섞어 배경을 조금 더 진하게 유지한다
                    const pillWhiteMix = p.id === "02" ? 0.2 : 0.5
                    // 카드를 호버하면 pill 배경이 프로젝트 고유 색으로 옅게 채워지고
                    // 글자는 밝은 흰색이 된다. 흰색과 65% 섞어 톤을 낮춘 파스텔에
                    // 가까운 색이라 진하게 채웠던 이전 버전보다 은은하다. 배경은
                    // 그라디언트라 색 값 자체는 애니메이션할 수 없으므로, 항상 채워둔
                    // 오버레이를 opacity로만 페이드시킨다 — CoChat류 다색 브랜드도
                    // 그 여러 색이 배경에 옅게 드러난다.
                    return (
                      <span
                        key={t}
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: active
                            ? "rgba(255,255,255,0.95)"
                            : "rgba(12,15,26,0.38)",
                          // font-weight를 바꾸면 글자 폭이 변해 pill이 넓어지며 옆
                          // pill들이 밀리므로, 폭에 영향 없는 text-stroke로 굵기감만 더한다
                          WebkitTextStroke: active
                            ? "0.35px currentColor"
                            : "0px transparent",
                          boxShadow: active
                            ? `0 6px 16px ${hexToRgba(accent!.primary, 0.18)}, 0 1px 3px rgba(12,15,26,0.08)`
                            : "none",
                          transition:
                            "color 0.35s ease-out, box-shadow 0.35s ease-out",
                        }}
                        className="relative flex items-center text-[9px] px-2.5 py-1 rounded-full uppercase tracking-[0.08em]"
                      >
                        {accent && (
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 rounded-full"
                            style={{
                              // 중심에 은은한 accent 글로우를 얹고, 그 아래 더 옅은
                              // 다색 베이스를 깔아 가장자리로 갈수록 자연스럽게
                              // 퍼지듯 옅어지게 한다
                              background: `radial-gradient(ellipse at center, ${hexToRgba(accent.primary, 0.3)} 0%, transparent 72%), linear-gradient(135deg, ${mixWithWhite(accent.blobs[0], pillWhiteMix)}, ${mixWithWhite(accent.blobs[1], pillWhiteMix)}, ${mixWithWhite(accent.blobs[2], pillWhiteMix)})`,
                              opacity: active ? 1 : 0,
                              transition: active
                                ? "opacity 0.35s ease-out"
                                : "opacity 0.5s ease-in",
                            }}
                          />
                        )}
                        <span className="relative">{t}</span>
                      </span>
                    )
                  })}
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: cardActive
                      ? "rgba(12,15,26,0.4)"
                      : "rgba(12,15,26,0.2)",
                    transition: "color 0.35s ease-out",
                  }}
                  className="text-xs shrink-0"
                >
                  {p.year}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 flex-wrap mb-2">
                  <h3
                    style={{ fontFamily: "var(--font-nanum)", fontWeight: 800 }}
                    className="text-xl text-[#0C0F1A] leading-snug"
                  >
                    {p.title}
                  </h3>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      color: cardActive
                        ? "rgba(12,15,26,0.55)"
                        : "rgba(12,15,26,0.35)",
                      // font-weight를 바꾸면 글자 폭이 변해 옆 요소가 밀리므로
                      // (pill과 동일한 이유), 폭에 영향 없는 text-stroke로 굵기감만 더한다
                      WebkitTextStroke: cardActive
                        ? "0.3px currentColor"
                        : "0px transparent",
                      transition: "color 0.35s ease-out",
                    }}
                    className="text-xs font-light"
                  >
                    {p.subtitle}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    color: cardActive
                      ? "rgba(12,15,26,0.65)"
                      : "rgba(12,15,26,0.45)",
                    WebkitTextStroke: cardActive
                      ? "0.25px currentColor"
                      : "0px transparent",
                    transition: "color 0.35s ease-out",
                  }}
                  className="text-xs leading-relaxed font-light"
                >
                  {p.description}
                </p>
              </div>
            </button>
            )
          })}
        </div>
      </div>
    </Page>
  )
}
