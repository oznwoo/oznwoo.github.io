// 모바일도 데스크톱과 동일하게 "페이지 하나 = 화면 하나"를 유지한다 — 대신
// 콘텐츠 쪽(PageResume 등)에서 타이포·간격을 모바일 우선으로 압축해 실제로
// 한 화면에 들어오게 한다.
//
// 좌우 패딩은 대칭이라 max-w-5xl 콘텐츠가 화면 정중앙에 온다. 왼쪽
// 네비게이터(fixed, ~x24~110)는 이 위로 떠 있고, md 패딩(128px)이 그보다
// 넉넉해 겹치지 않는다.
export function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full flex items-center justify-center overflow-y-auto px-6 sm:px-16 md:px-32 shrink-0">
      <div className="w-full max-w-5xl">{children}</div>
    </div>
  )
}
