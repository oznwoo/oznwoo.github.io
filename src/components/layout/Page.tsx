// 모바일도 데스크톱과 동일하게 "페이지 하나 = 화면 하나"를 유지한다 — 대신
// 콘텐츠 쪽(PageResume 등)에서 타이포·간격을 모바일 우선으로 압축해 실제로
// 한 화면에 들어오게 한다. 왼쪽 네비게이터 여백만 화면 크기별로 다르다.
export function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full flex items-center justify-center overflow-y-auto pl-6 pr-6 sm:pl-20 md:pl-[164px] md:pr-12 shrink-0">
      <div className="w-full max-w-5xl">{children}</div>
    </div>
  )
}
