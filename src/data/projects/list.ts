export const PROJECTS = [
  {
    id: "01",
    title: "Fintag",
    subtitle: "중소기업 자금 관리 에이전트",
    description:
      "유휴자금으로 현금흐름을 예측해 맞춤 금융 상품을 제안하는 웹 서비스",
    // ML과 Backend 역할을 둘 다 겸했어서 예외적으로 4개
    tags: ["Web", "ML", "Backend", "FastAPI"],
    year: "2026",
    link: "https://github.com/oznwoo",
  },
  {
    id: "02",
    title: "CoChat for Business",
    subtitle: "B2B 메신저 통합 플랫폼",
    description:
      "여러 메신저의 업무 알림을 모아 AI가 급한 순서로 정리하는 웹 서비스",
    // 프론트(Next.js)와 백엔드(FastAPI)를 둘 다 겸했어서 예외적으로 4개
    tags: ["Web", "Fullstack", "Next.js", "FastAPI"],
    year: "2026",
    link: "https://github.com/oznwoo",
  },
  {
    id: "03",
    title: "Gopssl",
    subtitle: "미용실 매출·고객 관리 앱",
    description:
      "수기 장부를 쓰던 어머니의 미용실에서 출발한, 예약 없는 소규모 매장용 관리 앱",
    // 기술스택(React Native·FastAPI)과 배포 인프라(OCI)를 모두 겸했어서 예외적으로 5개
    tags: ["Mobile", "Fullstack", "React Native", "FastAPI", "OCI"],
    year: "2025",
    link: "https://github.com/oznwoo",
  },
  {
    id: "04",
    title: "CoChat",
    subtitle: "메신저 통합 플랫폼",
    description:
      "여러 메신저의 알림을 모아 AI가 취향에 맞는 것만 요약해 주는 앱",
    // AI 요약·분류에 RAG 파이프라인을 활용해서 예외적으로 5개
    tags: ["Mobile", "Fullstack", "React Native", "FastAPI", "RAG"],
    year: "2024",
    link: "https://github.com/oznwoo",
  },
]

export type Project = typeof PROJECTS[number]
