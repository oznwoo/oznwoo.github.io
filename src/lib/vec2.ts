// 화면 좌표 벡터 하나. 배경 blob의 버스트 오프셋(vw/vh)이나 카드 사분면
// 쏠림(-1~1 정규화), 터치 스와이프 시작점(px) 등 x/y 한 쌍이 필요한 곳에 쓴다.
export type Vec2 = {
  x: number
  y: number
}
