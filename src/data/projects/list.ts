export const PROJECTS = [
  {
    id: "01",
    title: "Fintag",
    subtitle: "중소기업 자금 관리 에이전트",
    description:
      "유휴 자금 감지 및 수익화 제안 SaaS. Prophet·LightGBM 파이프라인으로 고도화해 예측 오차율 평균 76% 감소.",
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
      "업무 알림을 AI가 긴급도 분류하는 SaaS. 6인 팀 리더, Slack·Discord 연동 구현.",
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
      "기획·디자인·개발 전 과정 단독 진행. 2025년 8월부터 실사용자가 실제로 사용 중.",
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
      "다양한 메신저 알림 필터링·요약 앱. KIPS 정보처리학회 학술대회 논문 발표.",
    // AI 요약·분류에 RAG 파이프라인을 활용해서 예외적으로 5개
    tags: ["Mobile", "Fullstack", "React Native", "FastAPI", "RAG"],
    year: "2024",
    link: "https://github.com/oznwoo",
  },
]

export type Project = typeof PROJECTS[number]
