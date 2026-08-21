import type { HeroVisualKey } from "@/data/projects"

// Overview 히어로 배경의 대형 장식 비주얼. 실사진이 없는 코드 포트폴리오라
// 프로젝트 성격(Fintag는 현금흐름 예측 모델 고도화)을 은유하는 추상 그래픽을
// 직접 그린다. 텍스트 칼럼과 겹치지 않도록 xl 이상에서만 화면 우측에 별도
// 컬럼으로 렌더링한다 (아래 slides 배열의 wrapper 참고).
export function HeroVisual({ name, color }: { name: HeroVisualKey; color: string }) {
  switch (name) {
    case "chart": {
      // 미니멀한 성장 막대 — 컴파운드 인터레스트 다이어그램처럼 가는 선
      // 막대가 꾸준히 높아지는 실루엣만으로 "고도화·성장"을 은유한다.
      // 배경을 물들이는 채움·그라디언트·그리드 없이 획(stroke)만 사용해
      // 다른 슬라이드와 배경 톤이 완전히 동일하게 유지된다
      const barCount = 18
      const xStart = 50
      const xEnd = 510
      const gap = (xEnd - xStart) / (barCount - 1)
      const baseline = 460
      const minH = 14
      const maxH = 230
      return (
        <svg
          viewBox="0 0 560 700"
          preserveAspectRatio="xMaxYMax meet"
          className="w-full h-full"
        >
          {Array.from({ length: barCount }, (_, i) => {
            const x = xStart + i * gap
            const t = i / (barCount - 1)
            const h = minH + Math.pow(t, 1.7) * (maxH - minH)
            return (
              <line
                key={i}
                x1={x}
                y1={baseline}
                x2={x}
                y2={baseline - h}
                stroke={color}
                strokeOpacity="0.6"
                strokeWidth="3"
                strokeLinecap="round"
                className="chart-bar-rise"
                style={{
                  transformOrigin: `${x}px ${baseline}px`,
                  animationDelay: `${0.4 + i * 0.035}s`,
                }}
              />
            )
          })}
        </svg>
      )
    }
  }
}
