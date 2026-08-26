interface FlowArrowProps {
  gradientId: string
  gradientStops: string[]
  shadowColor: string
  size?: number
  rotate?: boolean
}

// AS-IS/TO-BE 비교 화살표와 이미지 스텝 사이 화살표가 공유하는 뭉툭하고
// 둥근 블록 화살표. 짧은 이음매 변에서 라운딩 반지름이 서로 교차하면
// 지그재그 결함이 생기므로, path의 각 좌표는 그 반지름이 교차하지 않도록
// 계산되어 있다 — 값을 조정할 땐 이 점을 유의한다.
export function FlowArrow({
  gradientId,
  gradientStops,
  shadowColor,
  size = 38,
  rotate,
}: FlowArrowProps) {
  return (
    <svg
      width={size}
      height={Math.round((size * 24) / 40)}
      viewBox="0 0 40 24"
      style={{
        transform: rotate ? "rotate(90deg)" : undefined,
        filter: `drop-shadow(0 6px 12px ${shadowColor})`,
      }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={gradientStops[0]} />
          <stop offset="50%" stopColor={gradientStops[1]} />
          <stop offset="100%" stopColor={gradientStops[2]} />
        </linearGradient>
      </defs>
      <path
        d="M4.2,7 L19.8,7 Q22,7 22,4.8 L22,4.2 Q22,2 23.9,3.2 L36.1,10.8 Q38,12 36.1,13.2 L23.9,20.8 Q22,22 22,19.8 L22,19.2 Q22,17 19.8,17 L4.2,17 Q2,17 2,14.8 L2,9.2 Q2,7 4.2,7 Z"
        fill={`url(#${gradientId})`}
      />
    </svg>
  )
}
