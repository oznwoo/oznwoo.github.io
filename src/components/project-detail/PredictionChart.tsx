// Overview 히어로에 넣는 손그림 스타일 현금흐름 예측 차트. 실제 발표자료
// 캡처(matplotlib 기본 스타일) 대신, 사이트 톤(가는 획·accent 컬러·은은한
// 애니메이션)에 맞춰 "실제값 vs 예측값이 촘촘히 겹쳐 따라가는" 형태만
// 벡터로 직접 그린다 — 정확한 수치 재현이 아니라 스토리(예측이 실제를
// 촘촘히 따라간다)를 전달하는 장식 차트다.
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
  const areaPath = `${predictedPath} L${last.x.toFixed(1)},${HEIGHT - PAD_Y} L${PAD_X},${HEIGHT - PAD_Y} Z`

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full h-auto"
      role="img"
      aria-label="시간에 따라 우상향하며 실제값을 촘촘히 따라가는 현금흐름 예측 그래프"
    >
      <defs>
        <linearGradient id="prediction-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.16" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* 은은한 기준선 4개 — 그리드 느낌만 살짝 */}
      {[0.22, 0.44, 0.66, 0.88].map((r) => (
        <line
          key={r}
          x1={PAD_X}
          x2={WIDTH - PAD_X}
          y1={PAD_Y + r * (HEIGHT - PAD_Y * 2)}
          y2={PAD_Y + r * (HEIGHT - PAD_Y * 2)}
          stroke="#0C0F1A"
          strokeOpacity="0.05"
          strokeWidth="1"
        />
      ))}
      <path d={areaPath} fill="url(#prediction-fill)" />
      <path
        d={actualPath}
        pathLength={1}
        fill="none"
        stroke="#0C0F1A"
        strokeOpacity="0.28"
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
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1"
        className="chart-line-draw"
        style={{ animationDelay: "0.15s" }}
      />
      <circle cx={last.x} cy={last.y} r="4.5" fill={color} />
      <circle
        cx={last.x}
        cy={last.y}
        r="4.5"
        fill={color}
        className="chart-dot-pulse"
      />
    </svg>
  )
}
