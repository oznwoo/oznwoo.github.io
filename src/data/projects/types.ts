export type DetailIconKey = "duplicate" | "target" | "alert" | "filter" | "layers" | "sparkle" | "trend-down"

// AS-IS/TO-BE 비교 항목 하나 — 짧은 제목(title)과, 그 제목이 왜/어떻게
// 그렇게 됐는지 풀어주는 글머리 기호 설명(detail) 목록의 쌍
export interface ComparisonEntry {
  title: string
  detail: string[]
}

// Outcome 슬라이드/Overview 히어로에서 쓰는 성과 지표 하나
export interface ProjectOutcomeStat {
  stat: string
  label: string
  icon?: DetailIconKey
}

// STACK 슬라이드의 카테고리별 기술 목록 한 묶음
export interface ProjectTechGroup {
  category: string
  items: string[]
}

// Problem/Solution 카드 슬라이드에서 쓰는 항목 하나
export interface ProjectDetailCardItem {
  title: string
  body: string
  // 카드 UI에 따라 body 대신 보여줄 불릿 포인트 목록(선택) — 한 줄에 핵심
  // 하나씩, 문장이 아니라 키워드 위주 짧은 구로 스캔하기 쉽게 쓴다. 각
  // 줄 안에서 **강조**로 핵심 단어만 진하게 표시할 수 있다.
  shortBody?: string[]
  // 기존 상태(before)를 개선된 상태(after)로 바꾼 항목에 한해, shortBody
  // 대신 이걸 쓰면 SOLUTION 쇼케이스가 AS-IS/TO-BE 두 영역을 화살표로
  // 잇는 비교 구조로 렌더링한다. 각 항목은 짧은 제목(title)과, 그 제목을
  // 왜/어떻게 그렇게 됐는지 풀어주는 글머리 기호 설명(detail) 목록의 쌍이다.
  comparison?: {
    before: ComparisonEntry[]
    after: ComparisonEntry[]
  }
  icon?: DetailIconKey
  tags?: string[]
  image?: string
  // 하나의 합성 스크린샷 대신 개별 스텝 이미지 여러 장을 나란히 보여주고
  // 싶을 때 image 대신 이걸 쓴다 — 이미지 사이 화살표는 이미지에 미리
  // 박아 넣지 않고, SolutionShowcase가 직접 그린다.
  images?: string[]
  // images가 순차적인 파이프라인 스텝이 아니라(예: 서로 독립된 다이어그램
  // 여러 장) 화살표로 잇는 게 부적절할 때 false로 끈다. 기본값은 true.
  imagesShowArrows?: boolean
  // 여러 장을 나란히 두기엔 폭이 부족할 때 true로 켜면, 데스크톱에서
  // 카드를 서로 살짝 겹쳐 부채꼴로 펼쳐 보여준다(hover 시 앞으로 올라옴).
  // 겹침 모드에서는 사이 화살표를 그리지 않는다.
  imagesOverlap?: boolean
}

export interface ProjectDetail {
  period: string
  role: string
  // About 슬라이드에서 마크다운 h1처럼 크고 진하게 보여줄 한 줄 — 서비스가
  // 무엇인지 설명하는 소개 문단의 첫 문장
  overviewHeadline: string
  // h2/본문처럼 작고 옅게 보여줄 나머지 문장 — 담당 역할·과정 설명
  overviewBody: string
  // Overview 히어로에서 타이틀 텍스트 대신 보여줄 실제 로고. 있으면 텍스트
  // 타이틀을 대체한다 (Fintag처럼 워드마크 자체가 브랜드를 대변하는 경우)
  logoSrc?: string
  // 로고 크기(Tailwind height 클래스). 가로로 넓은 워드마크 로고는 기본값
  // (h-20 sm:h-24)으로 충분하지만, 정사각형 심볼 로고는 같은 높이에서
  // 체감 크기가 작아 보여 프로젝트별로 더 큰 값을 지정할 수 있다.
  logoClassName?: string
  // 로고가 워드마크가 아니라 심볼만 있어 서비스명이 로고 안에 없는
  // 경우(true) 로고 아래에 프로젝트명을 별도 텍스트로 보여준다.
  logoShowName?: boolean
  // About 슬라이드에서 소개 문단과 함께 보여줄 실제 서비스 화면 스크린샷(선택)
  aboutImage?: string
  // 담당 역할을 구체적으로 보여줄 헤드라인/본문/스크린샷(선택). roleHeadline이
  // 있으면 About 슬라이드가 "무엇을 만들었나"(overview) / "내가 맡은
  // 역할"(role) 2컬럼으로 나뉜다. roleImage가 아직 없어도 headline·body만
  // 있으면 스텝은 생기고 이미지 자리는 자리표시자로 채워진다.
  roleHeadline?: string
  roleBody?: string
  roleImage?: string
  // 시연 영상(선택) — demoHeadline이 있으면 About 슬라이드에 "시연 영상"
  // 탭이 하나 더 생긴다. demoVideo가 아직 없어도 탭은 생기고 자리표시자로
  // 채워진다. demoPoster는 영상 재생 전 보여줄 정지 프레임.
  demoHeadline?: string
  demoBody?: string
  demoVideo?: string
  demoPoster?: string
  // Overview 히어로 뒤에 까는 장식 배경 효과(선택). "bars"는 하단 이퀄라이저
  // 막대(HeroBarChart), "falling-messages"는 메신저 말풍선이 위에서 아래로
  // 흘러내리는 레이어(FallingMessages), "salon-tools"는 히어로 곳곳에 고정
  // 배치된 미용 도구 라인아트가 호버 시 도구별로 움직이는 레이어(SalonTools).
  // 없으면 정적인 히어로.
  heroEffect?: "bars" | "falling-messages" | "salon-tools"
  // 이 프로젝트의 GitHub 저장소(프론트엔드 repo). 있으면 상세 우측 하단에
  // 항상 GitHub로 가는 링크 버튼이 뜬다.
  githubUrl?: string
  problem: ProjectDetailCardItem[]
  solution: ProjectDetailCardItem[]
  outcome: ProjectOutcomeStat[]
  // 성과 증빙 차트(선택) — Overview 히어로에서 쓴다
  outcomeImage?: string
  // PROBLEM 이미지와 같은 순서로 짝지은 '해결된 버전' 스크린샷 갤러리(선택).
  // 있으면 Outcome 슬라이드 전체가 PROBLEM/SOLUTION과 동일한 CardGridSlide
  // 구조(타이틀+이미지 카드 그리드)로 렌더링된다.
  outcomeGallery?: ProjectDetailCardItem[]
  tech: ProjectTechGroup[]
  // 시스템 아키텍처 다이어그램(선택) — 있으면 STACK 슬라이드가 카테고리별
  // 텍스트 목록 대신 이 이미지 하나만 보여준다.
  stackDiagram?: string
  // stackDiagram과 달리 카테고리 목록을 대체하지 않고 그 아래에 함께 놓는
  // 다이어그램(선택). 짧은 설명(stackDiagramNote)과 같이 렌더링된다.
  stackDiagramBelow?: string
  stackDiagramNote?: string
}
