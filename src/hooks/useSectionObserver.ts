import { useEffect, useState } from "react"

// stack 모드에서 각 섹션의 가시성을 관찰해 "현재 보고 있는 섹션" 인덱스를
// 돌려준다 — 스크롤 이벤트 핸들러 대신 IntersectionObserver를 써서 스크롤
// 성능에 영향을 주지 않는다.
export function useSectionObserver(ids: string[], enabled: boolean): number {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!enabled) return
    const ratios = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio)
        }
        let bestId = ids[0]
        let bestRatio = -1
        for (const id of ids) {
          const r = ratios.get(id) ?? 0
          if (r > bestRatio) {
            bestRatio = r
            bestId = id
          }
        }
        const idx = ids.indexOf(bestId)
        if (idx !== -1) setActive(idx)
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    )
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ids.join(",")])

  return active
}
