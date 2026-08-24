import fintagLogo from "@/imports/fintag-logo.png"
import fintagAboutHero from "@/imports/fintag/fintag-about-hero.webp"
import fintagProblemPreprocessing from "@/imports/fintag/fintag-problem-preprocessing.webp"
import fintagProblemAccuracy from "@/imports/fintag/fintag-problem-accuracy.webp"
import fintagProblemExplain from "@/imports/fintag/fintag-problem-explain.webp"
import fintagSolutionPipeline from "@/imports/fintag/fintag-solution-pipeline.webp"
import fintagSolutionSteps from "@/imports/fintag/fintag-solution-steps.webp"
import fintagSolutionExplainUi from "@/imports/fintag/fintag-solution-explain-ui.webp"
import fintagOutcomeChart from "@/imports/fintag/fintag-outcome-chart.webp"
import type { ProjectAccent } from "@/lib/color"

// 프로젝트 카드 호버 시 반영할 브랜드 컬러 (로고/배너 기반). 로고를 받은 프로젝트만
// 등록되어 있고, 없는 프로젝트는 호버해도 색이 바뀌지 않는다.
// - primary: DotNav dot, 캔버스 톤, 태그 pill처럼 단색이 필요한 곳
// - blobs: 배경 blob a/b/c 각각에 입힐 색 — 그라디언트 브랜드는 여러 색을 넣어 재현
export const PROJECT_ACCENT: Record<string, ProjectAccent> = {
  "01": {
    // Fintag — 로고의 # 심볼 레드, 단색이라 세 blob 모두 동일
    primary: "#F0283C",
    blobs: ["#F0283C", "#F0283C", "#F0283C"],
  },
  "02": {
    // CoChat for Business — 배너 그라디언트(노랑 → 코랄 → 파랑). 배너 원본은 파스텔
    // 톤이라, Fintag 레드와 강조감이 비슷하게 느껴지도록 채도/명도를 확 끌어올림
    primary: "#E63E7A",
    blobs: ["#F0B400", "#1F8FE0", "#E63E7A"],
  },
  "03": {
    // Gopssl — 로고 워드마크의 플럼/퍼플, 단색이라 세 blob 모두 동일
    primary: "#7A3986",
    blobs: ["#7A3986", "#7A3986", "#7A3986"],
  },
  "04": {
    // CoChat — CoChat for Business와 같은 큐브 로고 계열(노랑/파랑/레드)이지만, 로고의
    // 짙은 네이비 말풍선 톤을 살려 자매 프로덕트인 CoChat for Business보다 전체적으로
    // 어둡고 차분한 색감으로 구분되게 함
    primary: "#B8241E",
    blobs: ["#B8860A", "#1A2B6B", "#B8241E"],
  },
}

// 카드 그리드(2열)에서 프로젝트가 위치한 사분면 방향으로 blob이 살짝 쏠리게 해
// 호버할 때마다 그라디언트가 실제로 "반응"하는 느낌을 준다. x/y는 -1~1.
export const PROJECT_PULL: Record<string, { x: number; y: number }> = {
  "01": { x: -1, y: -1 },
  "02": { x: 1, y: -1 },
  "03": { x: -1, y: 1 },
  "04": { x: 1, y: 1 },
}

export const DEFAULT_ACCENT: ProjectAccent = {
  primary: "#4F6EF7",
  blobs: ["#4F6EF7", "#4F6EF7", "#4F6EF7"],
}

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

export type Project = (typeof PROJECTS)[number]

export type DetailIconKey =
  | "duplicate"
  | "target"
  | "alert"
  | "filter"
  | "layers"
  | "sparkle"
  | "trend-down"

// Problem/Solution 카드 슬라이드에서 쓰는 항목 하나
export interface ProjectDetailCardItem {
  title: string
  body: string
  icon?: DetailIconKey
  tags?: string[]
  image?: string
}

export interface ProjectDetail {
  period: string
  role: string
  overview: string
  // Overview 히어로에서 타이틀 텍스트 대신 보여줄 실제 로고. 있으면 텍스트
  // 타이틀을 대체한다 (Fintag처럼 워드마크 자체가 브랜드를 대변하는 경우)
  logoSrc?: string
  // About 슬라이드에서 소개 문단과 함께 보여줄 실제 서비스 화면 스크린샷(선택)
  aboutImage?: string
  problem: ProjectDetailCardItem[]
  solution: ProjectDetailCardItem[]
  outcome: { stat: string; label: string; icon?: DetailIconKey }[]
  // 성과 증빙 차트(선택) — Overview 히어로와 Outcome 슬라이드 양쪽에서 쓴다
  outcomeImage?: string
  tech: { category: string; items: string[] }[]
}

export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  "01": {
    period: "2026.04 – 2026.06",
    role: "백엔드 개발 · ML 엔지니어링 (인턴십)",
    overview:
      "중소기업이 통장에 묶어두는 유휴 자금을 실시간으로 감지하고, 적합한 금융 상품을 제안하는 자금 관리 SaaS. 실제 거래 내역 데이터를 기반으로 미래 현금흐름을 예측하는 모델과 이를 서빙하는 백엔드 시스템을 담당했습니다.",
    logoSrc: fintagLogo,
    aboutImage: fintagAboutHero,
    problem: [
      {
        title: "데이터 전처리 부재",
        body: "은행·카드·보험 등에서 각각 집계한 거래가 동일 지출을 중복 반영해 학습 데이터를 왜곡시켰고, 내부 계좌 간 이동이 실제 지출로 잘못 분류되어 현금흐름이 과대 집계됐습니다.",
        icon: "duplicate",
        tags: ["#내부이체", "#중복집계"],
        image: fintagProblemPreprocessing,
      },
      {
        title: "예측 정확도 부족",
        body: "Prophet 단독 모델은 추세·계절성 같은 큰 흐름은 잘 포착했지만 급여일·카드결제일 같은 단기 반복 패턴은 노이즈로 처리해 놓쳤습니다. 기업 유형에 따라 MAPE가 최대 수백 %에 달할 만큼 오차율이 크고 미세 조정도 불가능했습니다.",
        icon: "target",
        tags: ["#단기패턴누락", "#높은오차율"],
        image: fintagProblemAccuracy,
      },
      {
        title: "예측 설명 부재",
        body: "예측값만 제공되고 왜 그런 결과가 나왔는지 근거가 없어 담당자가 신뢰하기 어려웠고, 이상거래가 필터링 없이 예측에 그대로 반영되어 결과 신뢰도를 떨어뜨렸습니다.",
        icon: "alert",
        tags: ["#근거없음", "#이상거래반영"],
        image: fintagProblemExplain,
      },
    ],
    solution: [
      {
        title: "은행 거래 기반 전처리 파이프라인",
        body: "카드·보험 등 별도 집계 대신 은행 계좌 입출금 단일 기준으로 데이터를 수집하고 Tag로 지출 성격을 분류했습니다. 내부 계좌 간 이동은 Tag로 자동 식별해 학습 데이터에서 제외하고, 순수 현금흐름만 예측에 반영되도록 정제했습니다.",
        icon: "filter",
        tags: ["#단일계좌기준", "#Tag분류"],
        image: fintagSolutionPipeline,
      },
      {
        title: "Prophet + LightGBM 잔차 보정 + 고정지출 등록",
        body: "Prophet으로 추세·계절성을 1차 예측한 뒤 LightGBM으로 Prophet이 설명하지 못한 잔차를 추가 학습시켜 오차를 줄였습니다. 급여일·카드결제일 같은 반복 패턴을 모델에 직접 등록해 예측 안정성과 정밀도를 더 끌어올렸습니다.",
        icon: "layers",
        tags: ["#잔차보정", "#고정지출등록"],
        image: fintagSolutionSteps,
      },
      {
        title: "SHAP·LLM 기반 예측 설명 및 이상거래 탐지",
        body: "LightGBM 예측 기여도를 SHAP으로 분석하고, AWS Bedrock(Claude 3)으로 예측 근거와 이상거래 의심 사유를 자연어로 생성했습니다. 규칙 기반 탐지와 IsolationForest·PyOD ECOD를 결합해 이상거래를 식별하고, 담당자가 근거를 확인한 뒤 선택적으로 제거할 수 있게 했습니다.",
        icon: "sparkle",
        tags: ["#SHAP", "#Bedrock"],
        image: fintagSolutionExplainUi,
      },
    ],
    outcome: [
      { stat: "76%", label: "평균 예측 오차율(MAPE) 감소", icon: "trend-down" },
      { stat: "3단계", label: "Prophet·LightGBM·고정지출 파이프라인", icon: "layers" },
      { stat: "SHAP+LLM", label: "예측 근거 자연어 설명 기능", icon: "sparkle" },
    ],
    outcomeImage: fintagOutcomeChart,
    tech: [
      { category: "Backend", items: ["Python", "FastAPI", "PostgreSQL"] },
      {
        category: "ML",
        items: ["Prophet", "LightGBM", "SHAP", "Isolation Forest", "PyOD ECOD"],
      },
      { category: "AI", items: ["AWS Bedrock (Claude 3)", "Prompt Engineering"] },
      { category: "Infra", items: ["AWS EC2", "AWS Lambda", "Amazon RDS"] },
    ],
  },
  "02": {
    period: "2026.03 – 2026.04",
    role: "서비스 기획 총괄 · 풀스택 개발 · 팀 리더",
    overview:
      "Slack, Discord, 카카오톡 등 여러 메신저에 흩어진 업무 알림을 하나의 대시보드로 통합하고, AI가 메시지 긴급도를 자동 분류해주는 B2B SaaS. 구름 DEEP DIVE 해커톤에서 아이디어를 제안하고 6인 팀을 리드하며 당일 풀스택 개발에 참여했습니다.",
    problem: [
      {
        title: "메신저 파편화로 인한 정보 누락",
        body: "업무 채널이 Slack, Discord, 카카오톡으로 분산되면서 중요한 알림을 놓치는 일이 잦아졌습니다. 탭을 오가는 컨텍스트 스위칭 비용도 생산성을 크게 낮췄습니다.",
      },
      {
        title: "긴급도 판단의 주관성",
        body: "같은 메시지라도 사람마다 긴급도를 다르게 판단합니다. 일관된 기준 없이 알림을 처리하다 보니 우선순위 혼란이 발생했습니다.",
      },
    ],
    solution: [
      {
        title: "Webhook 기반 통합 수신",
        body: "Slack Event API, Discord Webhook을 연결해 메시지를 단일 서버로 수신하는 파이프라인을 구축했습니다. OAuth 인증으로 워크스페이스별 연동을 지원합니다.",
      },
      {
        title: "LLM 긴급도 분류기",
        body: "GPT API를 활용해 메시지 맥락을 분석하고 긴급/보통/낮음 3단계로 분류합니다. 프롬프트 엔지니어링으로 업무 도메인에 맞는 분류 기준을 적용했습니다.",
      },
      {
        title: "집중모드 기능",
        body: "긴급 메시지만 필터링해 표시하는 집중모드를 구현해 딥워크 중 방해를 최소화할 수 있게 했습니다.",
      },
    ],
    outcome: [
      { stat: "2종", label: "메신저 연동 (Slack · Discord)" },
      { stat: "1일", label: "해커톤 당일 MVP 완성" },
      { stat: "6인", label: "팀 리드" },
    ],
    tech: [
      { category: "Frontend", items: ["React", "TypeScript", "Tailwind CSS"] },
      { category: "Backend", items: ["FastAPI", "Python", "PostgreSQL"] },
      { category: "AI", items: ["OpenAI GPT API", "Prompt Engineering"] },
      {
        category: "Integration",
        items: ["Slack API", "Discord Webhook", "OAuth 2.0"],
      },
    ],
  },
  "03": {
    period: "2025.06 – 진행 중",
    role: "기획 · 디자인 · 풀스택 개발 (개인 프로젝트)",
    overview:
      "예약제 없이 운영되는 소규모 미용실을 위한 고객·매출 관리 앱. 어머니의 미용실이 수기로 장부를 관리하는 것을 보고 직접 기획했습니다. UI/UX 설계부터 React Native 앱 개발, 백엔드 서버 배포까지 전 과정을 혼자 진행했습니다.",
    problem: [
      {
        title: "소규모 미용실을 위한 서비스 부재",
        body: "시중의 미용실 관리 솔루션은 대부분 예약 시스템 중심으로 구성되어 있어 예약 없이 운영하는 소규모 미용실에는 불필요한 기능이 많고 복잡했습니다.",
      },
      {
        title: "수기 장부의 한계",
        body: "고객별 방문 이력, 선호 시술, 미수금 등을 수기로 관리하다 보니 실수가 잦고 월 매출 집계에 많은 시간이 소요됐습니다.",
      },
    ],
    solution: [
      {
        title: "고객 카드 기반 관리",
        body: "고객별 방문 이력, 시술 내용, 결제 금액을 카드 형태로 저장하고 검색할 수 있는 UI를 설계했습니다. 자주 오는 고객은 즐겨찾기로 빠르게 접근할 수 있습니다.",
      },
      {
        title: "간편 매출 입력 플로우",
        body: "시술 항목을 사전에 등록해두고 탭 몇 번으로 매출을 기록할 수 있는 최소 동작 UX를 설계했습니다. 실사용자(어머니)의 피드백을 반영해 여러 차례 개선했습니다.",
      },
      {
        title: "월별 매출 대시보드",
        body: "일별·월별 매출 집계와 시술 종류별 비중을 시각화해 경영 현황을 한눈에 파악할 수 있게 했습니다.",
      },
    ],
    outcome: [
      { stat: "실사용", label: "2025년 8월 ~ 현재" },
      { stat: "100%", label: "단독 설계·개발" },
      { stat: "0원", label: "인프라 비용 (무료 티어)" },
    ],
    tech: [
      { category: "App", items: ["React Native", "TypeScript"] },
      { category: "Backend", items: ["FastAPI", "Python", "SQLite"] },
      { category: "Infra", items: ["OCI"] },
    ],
  },
  "04": {
    period: "2024.09 – 2025.06",
    role: "기획 · UI/UX · 풀스택 개발 · 논문 저자",
    overview:
      "카카오톡, 문자, 이메일 등 다양한 채널의 알림을 통합하고 AI가 중요도를 분류·요약해주는 모바일 앱. 메신저 다양화가 오히려 소통의 장애를 유발한다는 문제를 인식하고, 소통의 본질을 회복하기 위해 기획했습니다. 한양대 졸업 프로젝트로 진행했으며 KIPS 학술대회에 논문을 발표했습니다.",
    problem: [
      {
        title: "알림 과부하 (Notification Overload)",
        body: "스마트폰 사용자는 하루 평균 80개 이상의 푸시 알림을 받습니다. 채널이 늘어날수록 진짜 중요한 메시지는 오히려 묻히는 역설이 발생합니다.",
      },
      {
        title: "메신저별 맥락 단절",
        body: "같은 주제의 대화가 여러 채널에 나뉘어 있어 전체 맥락을 파악하기 위해 앱을 계속 전환해야 합니다.",
      },
    ],
    solution: [
      {
        title: "AI 긴급도 판별 엔진",
        body: "메시지 텍스트와 발신자, 시간대, 채널 특성을 종합적으로 분석하는 분류 모델을 설계했습니다. Fine-tuning 없이 프롬프트 설계만으로 도메인 적응성을 확보했습니다.",
      },
      {
        title: "통합 타임라인 UI",
        body: "채널에 관계없이 모든 메시지를 중요도 순으로 정렬해 단일 피드에 표시합니다. 긴급 메시지는 상단 고정, 낮은 중요도는 자동 그룹화합니다.",
      },
      {
        title: "문맥 요약 기능",
        body: "대화 스레드를 LLM이 3줄로 요약해 전체 내용을 읽지 않아도 핵심을 파악할 수 있게 했습니다.",
      },
    ],
    outcome: [
      { stat: "1편", label: "KIPS 학술대회 논문 발표" },
      { stat: "졸업", label: "한양대 졸업 프로젝트" },
      { stat: "→ B2B", label: "CoChat for Business로 발전" },
    ],
    tech: [
      { category: "App", items: ["React Native", "TypeScript"] },
      {
        category: "AI",
        items: ["OpenAI API", "LangChain", "RAG", "Prompt Engineering"],
      },
      { category: "Backend", items: ["FastAPI", "Firebase", "PostgreSQL"] },
    ],
  },
}
