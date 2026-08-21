// Overview 히어로 배경에 크게 까는 장식 애니메이션. 실제 발표자료 캡처
// (matplotlib 기본 스타일) 대신, "실제값 vs 예측값이 촘촘히 겹쳐
// 우상향한다"는 차트의 실루엣만 가져와 벡터로 직접 그린다. 정확한 수치를
// 보여주는 정보 그래픽이 아니라, 텍스트 뒤에서 은은하게 존재감을 주는
// 히어로 애니메이션이라 획을 옅게 하고 그리드·배경 채움은 넣지 않는다.
const WIDTH = 600
const HEIGHT = 260
const PAD_X = 24
const PAD_Y = 28
const POINT_COUNT = 32

function buildPoints(seedOffset: number, noiseAmp: number, trendPower: number) {
  const points: { x: number; y: number }[] = []
  for (let i = 0; i < POINT_COUNT; i++) {
    const t = i / (POINT_COUNT - 1)
    const x = PAD_X + t * (WIDTH - PAD_X * 2)
    const trend = Math.pow(t, trendPower)
    const noise =
      Math.sin(i * 1.7 + seedOffset) * 0.5 + Math.cos(i * 0.9 + seedOffset) * 0.5
    const y =
      HEIGHT - PAD_Y - trend * (HEIGHT - PAD_Y * 2) + noise * noiseAmp
    points.push({ x, y })
  }
  return points
}

function toPath(points: { x: number; y: number }[]) {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ")
}

export function PredictionChart({ color }: { color: string }) {
  // 실제값: 등락이 잦은 얇은 선. 예측값: 그보다 매끈하게 같은 추세를 따라간다.
  const actual = buildPoints(0, 9, 1.5)
  const predicted = buildPoints(2.4, 3.5, 1.5)
  const actualPath = toPath(actual)
  const predictedPath = toPath(predicted)
  const last = predicted[predicted.length - 1]

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full h-auto"
      role="img"
      aria-label="시간에 따라 우상향하며 실제값을 촘촘히 따라가는 현금흐름 예측 그래프"
    >
      <path
        d={actualPath}
        pathLength={1}
        fill="none"
        stroke="#0C0F1A"
        strokeOpacity="0.12"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1"
        className="chart-line-draw"
      />
      <path
        d={predictedPath}
        pathLength={1}
        fill="none"
        stroke={color}
        strokeOpacity="0.4"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1"
        className="chart-line-draw"
        style={{ animationDelay: "0.15s" }}
      />
      <circle cx={last.x} cy={last.y} r="4.5" fill={color} fillOpacity="0.5" />
      <circle
        cx={last.x}
        cy={last.y}
        r="4.5"
        fill={color}
        fillOpacity="0.5"
        className="chart-dot-pulse"
      />
    </svg>
  )
}
