import { useState, useEffect, useRef, useCallback } from "react"
import profilePhoto from "@/imports/____________________.jpeg"
import logoImg from "@/imports/______________.png"
import fintagLogo from "@/imports/fintag-logo.png"
import fintagProblemPreprocessing from "@/imports/fintag/fintag-problem-preprocessing.webp"
import fintagProblemAccuracy from "@/imports/fintag/fintag-problem-accuracy.webp"
import fintagProblemExplain from "@/imports/fintag/fintag-problem-explain.webp"
import fintagSolutionPipeline from "@/imports/fintag/fintag-solution-pipeline.webp"
import fintagSolutionSteps from "@/imports/fintag/fintag-solution-steps.webp"
import fintagSolutionExplainUi from "@/imports/fintag/fintag-solution-explain-ui.webp"
import fintagOutcomeChart from "@/imports/fintag/fintag-outcome-chart.webp"
import { SkillIcon } from "@/lib/skillIcons"

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = ["Home", "About", "Resume", "Projects", "Contact"]

// 프로젝트 카드 호버 시 반영할 브랜드 컬러 (로고/배너 기반). 로고를 받은 프로젝트만
// 등록되어 있고, 없는 프로젝트는 호버해도 색이 바뀌지 않는다.
// - primary: DotNav dot, 캔버스 톤, 태그 pill처럼 단색이 필요한 곳
// - blobs: 배경 blob a/b/c 각각에 입힐 색 — 그라디언트 브랜드는 여러 색을 넣어 재현
type ProjectAccent = { primary: string; blobs: [string, string, string] }

const PROJECT_ACCENT: Record<string, ProjectAccent> = {
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
const PROJECT_PULL: Record<string, { x: number; y: number }> = {
  "01": { x: -1, y: -1 },
  "02": { x: 1, y: -1 },
  "03": { x: -1, y: 1 },
  "04": { x: 1, y: 1 },
}

const DEFAULT_ACCENT: ProjectAccent = {
  primary: "#4F6EF7",
  blobs: ["#4F6EF7", "#4F6EF7", "#4F6EF7"],
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "")
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

// DotNav dot·태그 pill처럼 작은 UI에 브랜드 컬러를 입힐 때 쓰는 그라디언트.
// blobs 3색이 모두 같은 단색 프로젝트는 자연히 flat color로 보이고,
// CoChat/CoChat for Business처럼 3색이 다른 프로젝트는 그 다색이 그대로 드러난다.
function accentGradient(accent: ProjectAccent): string {
  return `linear-gradient(135deg, ${accent.blobs[0]}, ${accent.blobs[1]}, ${accent.blobs[2]})`
}

// hex를 흰색과 섞어 옅게 만든다. 상세 페이지에서는 opacity를 낮추는 대신 이걸
// 써서 색 자체를 옅은 톤으로 바꾼다 — opacity만 낮추면 blob overlay가 밑에
// 깔린 파랑/보라 앰비언트 base를 다 못 가려서 색이 탁하게 섞여 보이기 때문.
function mixWithWhite(hex: string, ratio: number): string {
  const h = hex.replace("#", "")
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const mix = (c: number) => Math.round(c + (255 - c) * ratio)
  const toHex = (c: number) => c.toString(16).padStart(2, "0")
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`
}

const PROJECTS = [
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

type DetailIconKey =
  | "duplicate"
  | "target"
  | "alert"
  | "filter"
  | "layers"
  | "sparkle"
  | "trend-down"

// Overview 슬라이드 배경에 까는 대형 장식 비주얼. 실제 사진/렌더링이 없는
// 코드 포트폴리오라 프로젝트 성격을 대변하는 추상 그래픽을 직접 그려 넣는다.
type HeroVisualKey = "chart"

const PROJECT_DETAILS: Record<string, {
  period: string
  role: string
  overview: string
  heroVisual?: HeroVisualKey
  // Overview 히어로에서 타이틀 텍스트 대신 보여줄 실제 로고. 있으면 텍스트
  // 타이틀을 대체한다 (Fintag처럼 워드마크 자체가 브랜드를 대변하는 경우)
  logoSrc?: string
  problem: { title: string; body: string; icon?: DetailIconKey; tags?: string[]; image?: string }[]
  solution: { title: string; body: string; icon?: DetailIconKey; tags?: string[]; image?: string }[]
  outcome: { stat: string; label: string; icon?: DetailIconKey }[]
  // Outcome 슬라이드 하단 인용구 위에 곁들이는 성과 증빙 차트(선택)
  outcomeImage?: string
  tech: { category: string; items: string[] }[]
}> = {
  "01": {
    period: "2026.04 – 2026.06",
    role: "백엔드 개발 · ML 엔지니어링 (인턴십)",
    overview:
      "중소기업이 통장에 묶어두는 유휴 자금을 실시간으로 감지하고, 적합한 금융 상품을 제안하는 자금 관리 SaaS. 실제 거래 내역 데이터를 기반으로 미래 현금흐름을 예측하는 모델과 이를 서빙하는 백엔드 시스템을 담당했습니다.",
    heroVisual: "chart",
    logoSrc: fintagLogo,
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

const CORE_SKILLS = [
  "Python",
  "TypeScript",
  "React",
  "Next.js",
  "FastAPI",
  "PostgreSQL",
  "Claude Code",
]

const EXP_COLS = [
  {
    title: "교육",
    items: [
      {
        name: "핀테크 인턴십 코스 4기",
        sub: "풀스택 과정 수료",
        date: "2025.12 – 2026.06",
        link: "/documents/fintech-internship-certificate.pdf",
      },
      {
        name: "한양대학교 ERICA",
        sub: "컴퓨터전공 졸업 · GPA 4.22 / 4.5",
        date: "2020 – 2026",
        link: "/documents/hanyang-graduation-certificate.pdf",
      },
    ],
  },
  {
    title: "활동",
    items: [
      {
        name: "구름 DEEP DIVE 해커톤",
        sub: "CoChat for Business 팀 리더",
        date: "2026.04",
      },
      { name: "KIPS 종합학술대회", sub: "CoChat 논문 발표", date: "2025.05" },
    ],
  },
  {
    title: "자격증",
    items: [
      { name: "정보처리기사", sub: "한국산업인력공단", date: "2026.09" },
      { name: "GTQ 1급", sub: "한국생산성본부", date: "2024.09" },
    ],
  },
]

// ─── Gradient Background ──────────────────────────────────────────────────────

function GradientBackground({
  progress,
  page,
  warping,
  rotation,
  accentSlots,
  activeSlot,
  accentOn,
  flashNonce,
  flashColor,
  burstOffset,
  pull,
  pulseActive,
  detailMode,
  detailSectionWarp,
  enteringDetail,
  // 두 슬롯에 색을 번갈아 담아, 호버 대상이 바로 다른 프로젝트로 바뀌어도
  // (A 색 슬롯이 빠지는 동안 B 색 슬롯이 들어오며) 실제로 색이 섞여 보이는
  // 크로스페이드가 일어나게 한다 — 하나의 배경에 색만 스냅되는 것을 방지.
  // 미호버 → 호버로 처음 진입할 때마다 1씩 증가 — 값이 바뀔 때마다 웜프 버스트를
  // remount시켜 페이지 전환과 같은 버스트 애니메이션을 프로젝트 색으로 재생한다.
  // 버스트가 매번 다른 지점에서 퍼지도록 살짝 흔드는 무작위 오프셋(vw/vh).
  // 호버 중인 카드의 사분면 방향으로 blob을 밀어 위치 자체도 반응하게 한다.
  // 호버 대상이 바뀔 때마다 짧게 튕기며 "살아있는" 느낌을 주는 펄스.
  // 상세 페이지에서는 이 색이 잠깐의 호버가 아니라 계속 떠 있는 배경이라,
  // 리스트 호버와 같은 강도면 텍스트 가독성을 해친다 — blob 강도를 낮추고
  // 대신 전체 wash를 살짝 올려 "너무 하얗지도, 너무 진하지도 않게" 만든다.
  // 상세 페이지에 진입/퇴장하는 가로 슬라이드는 웜프 버스트 없이 조용히
  // 넘어가지만, 상세 내부에서 섹션을 넘기는 세로 슬라이드는 메인 페이지
  // 전환과 동일한 버스트를 재생해야 한다 — 이 플래그가 그 경우만 구분한다.
  // 리스트에서 상세로 가로 슬라이드가 진행되는 동안(detailMode가 늦게 켜지기
  // 전까지) true. 이 동안은 리스트 호버 강도의 blob이 카드와 상관없이 화면에
  // 그대로 떠 있으면 어색하므로 blob 자체를 꺼서 자연스럽게 페이드아웃시키고,
  // 슬라이드가 끝나 detailMode가 켜지면 그 자리에서 프로젝트 색으로 다시
  // 페이드인한다.
}: {
  progress: number
  page: number
  warping: boolean
  rotation: number
  accentSlots: [ProjectAccent, ProjectAccent]
  activeSlot: 0 | 1
  accentOn: boolean
  flashNonce: number
  flashColor: string
  burstOffset: { x: number; y: number }
  pull: { x: number; y: number }
  pulseActive: boolean
  detailMode: boolean
  detailSectionWarp: boolean
  enteringDetail: boolean
}) {
  const p = progress

  const pulseTransition = pulseActive
    ? "scale 0.16s cubic-bezier(0.34,1.56,0.64,1), translate 0.5s cubic-bezier(0.22,1,0.36,1)"
    : "scale 0.45s cubic-bezier(0.22,1,0.36,1), translate 0.5s cubic-bezier(0.22,1,0.36,1)"
  const pulseScale = pulseActive ? 1.1 : 1

  // 슬롯별 crossfade 오버레이 두 장을 렌더링하는 헬퍼. alpha/targetOpacity/전환
  // 속도는 blob마다 달라 인자로 받는다.
  function renderAccentSlots(
    blobIndex: 0 | 1 | 2,
    alpha: number,
    targetOpacity: number,
    inMs: number,
    outMs: number,
  ) {
    return [0, 1].map((slot) => {
      const isVisible = accentOn && activeSlot === slot && !enteringDetail
      // 상세 페이지는 메인 페이지의 파랑 앰비언트 base를 꺼둔 상태라(위 background:
      // detailMode ? "transparent" 참고) 이 색이 화면에 남는 유일한 색이다.
      // 흰색을 과하게 섞으면 파스텔로 washed-out돼 위에 얹히는 저채도 텍스트와
      // 명도 대비가 부족해지므로, 그라디언트 자체의 커버리지(effectiveAlpha)는
      // 그대로 두고 색 톤만 조금 더 짙게 유지한다.
      const color = detailMode
        ? mixWithWhite(accentSlots[slot].blobs[blobIndex], 0.42)
        : accentSlots[slot].blobs[blobIndex]
      // 배경 밝기(위 흰색 혼합 비율)는 그대로 두고, 그라디언트 자체의 존재감만
      // alpha(커버리지)를 살짝 올려서 더 뚜렷하게 만든다 — 메인 페이지 호버 강도에는
      // 영향을 주지 않도록 detailMode일 때만 적용한다.
      const effectiveAlpha = detailMode ? Math.min(1, alpha * 1.35) : alpha
      return (
        <div
          key={slot}
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(ellipse at center, ${hexToRgba(
              color,
              effectiveAlpha,
            )} 0%, transparent ${blobIndex === 2 ? 65 : 70}%)`,
            opacity: isVisible ? targetOpacity : 0,
            // background(색 자체)도 함께 트랜지션시켜, 상세 페이지 진입 슬라이드가
            // 끝난 뒤 detailMode가 늦게 켜질 때 색이 툭 바뀌지 않고 서서히 옅어지듯
            // 바뀌게 한다.
            transition: isVisible
              ? `opacity ${inMs}ms ease-out, background 0.6s ease`
              : `opacity ${outMs}ms ease-in, background 0.6s ease`,
          }}
        />
      )
    })
  }

  // 페이지 슬라이드(0.75s)와 정확히 같은 속도로 튕기듯 크게 움직였다가,
  // 워프가 끝나면 훨씬 느린 이징으로 가라앉는다.
  const warpEase = "cubic-bezier(0.34,1.56,0.64,1)"
  const settleEase = "cubic-bezier(0.22,1,0.36,1)"
  const SLIDE_S = "0.75s"

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ background: "#EEF1F9" }}
    >
      {/* 프로젝트 호버 시 캔버스 바탕색 자체도 브랜드 컬러 쪽으로 은은하게 물든다.
          blob과 별개로 회전 wrapper 바깥에 둬서 화면 전체가 고르게 톤이 바뀐다.
          여기도 두 슬롯을 겹쳐 크로스페이드시켜 호버 대상이 바로 바뀌어도
          이전 색에서 다음 색으로 자연스럽게 섞이며 넘어가게 한다 */}
      {[0, 1].map((slot) => {
        const isVisible = accentOn && activeSlot === slot && !enteringDetail
        return (
          <div
            key={slot}
            className="absolute inset-0"
            style={{
              backgroundColor: accentSlots[slot].primary,
              opacity: isVisible ? (detailMode ? 0.13 : 0.09) : 0,
              transition: isVisible
                ? "opacity 0.3s ease-out"
                : "opacity 0.7s ease-in",
            }}
          />
        )
      })}
      {/* 전환마다 화면 중앙을 기준으로 조금씩 더 돌아간다(아래로 이동=시계, 위로 이동=반시계)
          — 되돌아오지 않고 누적된 각도에 머무른 채 강조색만 자연스럽게 옅어진다.
          프로젝트 호버가 처음 시작될 때도 같은 회전을 쓰되, 이번엔 방향 없이
          무작위 각도로 돌아 페이지 전환과는 다른 우발적인 움직임을 준다 */}
      <div
        className="absolute inset-0"
        style={{
          rotate: `${rotation}deg`,
          transition: `rotate ${SLIDE_S} ${warpEase}`,
        }}
      >
        <div
          key={`page-${page}`}
          className="gradient-warp-burst absolute rounded-full"
          style={{
            width: "42vw",
            height: "42vw",
            top: "50%",
            left: "50%",
            marginTop: "-21vw",
            marginLeft: "-21vw",
            background:
              "radial-gradient(circle, rgba(79,110,247,0.32) 0%, rgba(79,110,247,0) 70%)",
          }}
        />
        {/* 미호버 → 호버로 처음 진입하는 순간에만 재생되는 버스트 — 페이지 전환의
            웜프 버스트를 그대로 재사용하되 프로젝트 색으로 물들이고, 매번 중심
            위치를 살짝 무작위로 흔들어 퍼지는 느낌을 다양하게 준다 */}
        {flashNonce > 0 && (
          <div
            key={`hover-${flashNonce}`}
            className="gradient-warp-burst absolute rounded-full"
            style={{
              width: "46vw",
              height: "46vw",
              top: "50%",
              left: "50%",
              marginTop: `calc(-23vw + ${burstOffset.y}vh)`,
              marginLeft: `calc(-23vw + ${burstOffset.x}vw)`,
              background: `radial-gradient(circle, ${hexToRgba(flashColor, 0.7)} 0%, ${hexToRgba(flashColor, 0)} 70%)`,
            }}
          />
        )}
        <div
          className="gradient-blob-a absolute"
          style={{
            // 상세 페이지에서는 채도(색 자체)는 그대로 두되, blob이 퍼지는 면적만
            // 줄여서 색이 화면 전체를 덮지 않고 좀 더 국소적으로 보이게 한다.
            width: detailMode ? "46vw" : "70vw",
            height: detailMode ? "46vw" : "70vw",
            top: "-20%",
            left: "-15%",
            translate: `${p * -16}vw ${p * 26}vh`,
            scale: warping ? 1.16 : 1,
            borderRadius: "50%",
            // 상세 페이지(detailMode)뿐 아니라 상세로 넘어가는 슬라이드 도중
            // (enteringDetail)에도 이 메인 파란/보라 앰비언트 base를 꺼서, 슬라이드
            // 내내 이 blob이 카드와 무관하게 떠 있지 않고 다른 blob들과 함께 자연스럽게
            // 페이드아웃되게 한다. "transparent" 키워드 대신 같은 그래디언트에서
            // alpha만 0으로 낮춰, 값이 바뀔 때 background가 매끄럽게 트랜지션되게
            // 한다("transparent" ↔ 그래디언트는 매끄럽게 보간되지 않는다).
            background: `radial-gradient(ellipse at center, rgba(199,210,254,${
              detailMode || enteringDetail ? 0 : 0.8
            }) 0%, transparent 70%)`,
            filter: warping ? "blur(58px)" : detailMode ? "blur(30px)" : "blur(40px)",
            transition:
              (warping
                ? `translate ${SLIDE_S} ${warpEase}, scale 0.5s ${warpEase}, filter 0.35s ease-out`
                : `translate 0.5s ${settleEase}, scale 0.6s ${settleEase}, filter 0.6s ease-out`) +
              ", background 0.6s ease, width 0.6s ease, height 0.6s ease",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              // detailSectionWarp가 아니라 detailMode로 색을 고른다 — detailSectionWarp는
              // warping과 같은 타이밍(750ms)에 꺼지는데, opacity는 그 뒤로도 0.55s에 걸쳐
              // 서서히 페이드아웃된다. detailSectionWarp로 갈랐다면 opacity가 아직 다 안
              // 꺼진 상태에서 배경색만 먼저 파란색으로 툭 바뀌어 보이는 문제가 생긴다.
              // detailMode는 상세 페이지에 머무는 동안 계속 true이므로 페이드아웃 내내
              // 프로젝트 색을 유지한다.
              background: detailMode
                ? `radial-gradient(circle at 28% 32%, ${hexToRgba(accentSlots[activeSlot].blobs[0], 0.9)} 0%, ${hexToRgba(accentSlots[activeSlot].blobs[0], 0.25)} 42%, transparent 70%)`
                : "radial-gradient(circle at 28% 32%, rgba(79,110,247,0.9) 0%, rgba(79,110,247,0.25) 42%, transparent 70%)",
              opacity: warping && (!detailMode || detailSectionWarp) ? 0.65 : 0,
              transition: warping
                ? "opacity 0.16s ease-out"
                : "opacity 0.55s ease-in",
            }}
          />
          {/* 프로젝트 카드 호버 시 브랜드 컬러로 완전히 갈아치움 — base blob과 동일한
              falloff로 덮어써서 밑에 깔린 파란/보라가 비쳐 보이지 않게 한다.
              pull/pulse 래퍼로 감싸서 호버할 때마다 위치가 밀리고 튕기며
              들어오게 한다 */}
          <div
            className="absolute inset-0"
            style={{
              translate: `${pull.x * 5}vw ${pull.y * 5}vh`,
              scale: pulseScale,
              transition: pulseTransition,
            }}
          >
            {renderAccentSlots(0, 0.6, 0.75, 300, 600)}
          </div>
        </div>
        <div
          className="gradient-blob-b absolute"
          style={{
            width: detailMode ? "38vw" : "60vw",
            height: detailMode ? "38vw" : "60vw",
            bottom: "-10%",
            right: "-10%",
            translate: `${p * 13}vw ${p * -19}vh`,
            scale: warping ? 1.11 : 1,
            borderRadius: "50%",
            background: `radial-gradient(ellipse at center, rgba(165,180,252,${
              detailMode || enteringDetail ? 0 : 0.7
            }) 0%, transparent 70%)`,
            filter: warping ? "blur(64px)" : detailMode ? "blur(34px)" : "blur(46px)",
            transition:
              (warping
                ? `translate ${SLIDE_S} ${warpEase}, scale 0.55s ${warpEase}, filter 0.35s ease-out`
                : `translate 0.65s ${settleEase}, scale 0.65s ${settleEase}, filter 0.65s ease-out`) +
              ", background 0.6s ease, width 0.6s ease, height 0.6s ease",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: detailMode
                ? `radial-gradient(circle at 72% 30%, ${hexToRgba(accentSlots[activeSlot].blobs[1], 0.85)} 0%, ${hexToRgba(accentSlots[activeSlot].blobs[1], 0.22)} 42%, transparent 70%)`
                : "radial-gradient(circle at 72% 30%, rgba(67,93,235,0.85) 0%, rgba(67,93,235,0.22) 42%, transparent 70%)",
              opacity: warping && (!detailMode || detailSectionWarp) ? 0.6 : 0,
              transition: warping
                ? "opacity 0.2s ease-out"
                : "opacity 0.6s ease-in",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              translate: `${pull.x * -4}vw ${pull.y * -4}vh`,
              scale: pulseScale,
              transition: pulseTransition,
            }}
          >
            {renderAccentSlots(1, 0.5, 0.65, 340, 650)}
          </div>
        </div>
        <div
          className="gradient-blob-c absolute"
          style={{
            width: detailMode ? "34vw" : "55vw",
            height: detailMode ? "34vw" : "55vw",
            top: "30%",
            left: "28%",
            translate: `${p * -9}vw ${p * 13}vh`,
            scale: warping ? 1.19 : 1,
            borderRadius: "50%",
            background: `radial-gradient(ellipse at center, rgba(224,231,255,${
              detailMode || enteringDetail ? 0 : 0.62
            }) 0%, transparent 65%)`,
            filter: warping ? "blur(70px)" : detailMode ? "blur(40px)" : "blur(54px)",
            transition:
              (warping
                ? `translate ${SLIDE_S} ${warpEase}, scale 0.6s ${warpEase}, filter 0.35s ease-out`
                : `translate 0.8s ${settleEase}, scale 0.7s ${settleEase}, filter 0.7s ease-out`) +
              ", background 0.6s ease, width 0.6s ease, height 0.6s ease",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: detailMode
                ? `radial-gradient(ellipse at center, ${hexToRgba(accentSlots[activeSlot].blobs[2], 0.6)} 0%, transparent 65%)`
                : "radial-gradient(ellipse at center, rgba(124,95,212,0.6) 0%, transparent 65%)",
              opacity: warping && (!detailMode || detailSectionWarp) ? 0.55 : 0,
              transition: warping
                ? "opacity 0.24s ease-out"
                : "opacity 0.65s ease-in",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              translate: `${pull.x * 3}vw ${pull.y * 6}vh`,
              scale: pulseScale,
              transition: pulseTransition,
            }}
          >
            {renderAccentSlots(2, 0.42, 0.55, 400, 700)}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Dot Nav ──────────────────────────────────────────────────────────────────

function DotNav({
  current,
  total,
  onChange,
  accentSlots,
  activeSlot,
  accentOn,
  // 현재 페이지 dot의 색. 두 슬롯을 크로스페이드시켜, 호버 대상이 바로 다른
  // 프로젝트로 바뀌어도 dot 색이 스냅되지 않고 배경과 같은 방식으로 섞이며
  // 전환된다. 프로젝트가 다색 브랜드면 그라디언트로 그 다색이 그대로 보인다.
}: {
  current: number
  total: number
  onChange: (i: number) => void
  accentSlots: [ProjectAccent, ProjectAccent]
  activeSlot: 0 | 1
  accentOn: boolean
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <nav
      aria-label="페이지 이동"
      className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-start"
      style={{ gap: "10px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 로고 — Home 페이지 dot 역할 */}
      <button
        onClick={() => onChange(0)}
        className="flex items-center gap-2.5 shrink-0"
        aria-label="Home"
        style={{ height: "20px" }}
      >
        <span
          className="flex items-center shrink-0"
          style={{ width: "24px", height: "20px" }}
        >
          {/* 로고 아이콘은 dot보다 훨씬 넓어서 좌측 정렬만으로는 시각적 중심이 dot들보다 오른쪽으로 치우쳐 보임 —
              dot의 시각적 중심(비활성 3px / 활성 10px)에 맞춰 음수 마진으로 보정 */}
          <img
            src={logoImg}
            alt="홈"
            style={{
              width: current === 0 ? "24px" : "16px",
              height: current === 0 ? "24px" : "16px",
              marginLeft: current === 0 ? "-2px" : "-5px",
              objectFit: "contain",
              opacity: current === 0 ? 0.75 : 0.22,
              transition:
                "opacity 0.3s, width 0.3s, height 0.3s, margin-left 0.3s",
              flexShrink: 0,
            }}
          />
        </span>
        <span
          className="hidden md:inline-block"
          style={{
            fontFamily: "var(--font-mono)",
            opacity: current === 0 ? 0.65 : hovered ? 0.3 : 0,
            color: "#0C0F1A",
            fontSize: "0.65rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase" as const,
            transition: "opacity 0.25s",
            fontWeight: current === 0 ? 500 : 400,
            whiteSpace: "nowrap",
          }}
        >
          {SECTIONS[0]}
        </span>
      </button>

      {/* 나머지 섹션 dot */}
      {Array.from({ length: total - 1 }).map((_, idx) => {
        const i = idx + 1
        return (
          <button
            key={i}
            onClick={() => onChange(i)}
            aria-label={SECTIONS[i]}
            className="flex items-center gap-2.5 shrink-0"
            style={{ height: "20px" }}
          >
            <span
              className="flex items-center shrink-0"
              style={{ width: "24px", height: "20px" }}
            >
              <span
                className="relative block rounded-full overflow-hidden transition-all duration-300"
                style={{
                  width: i === current ? "20px" : "6px",
                  height: "6px",
                  background: i === current ? "#4F6EF7" : "rgba(12,15,26,0.22)",
                }}
              >
                {i === current && (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background: accentGradient(accentSlots[0]),
                        opacity: accentOn && activeSlot === 0 ? 1 : 0,
                        transition:
                          accentOn && activeSlot === 0
                            ? "opacity 0.45s ease-out"
                            : "opacity 0.6s ease-in",
                      }}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background: accentGradient(accentSlots[1]),
                        opacity: accentOn && activeSlot === 1 ? 1 : 0,
                        transition:
                          accentOn && activeSlot === 1
                            ? "opacity 0.45s ease-out"
                            : "opacity 0.6s ease-in",
                      }}
                    />
                  </>
                )}
              </span>
            </span>
            <span
              className="hidden md:inline-block"
              style={{
                fontFamily: "var(--font-mono)",
                opacity: i === current ? 0.65 : hovered ? 0.3 : 0,
                color: "#0C0F1A",
                fontSize: "0.65rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase" as const,
                transition: "opacity 0.25s",
                fontWeight: i === current ? 500 : 400,
                whiteSpace: "nowrap",
              }}
            >
              {SECTIONS[i]}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

// ─── Top Nav ──────────────────────────────────────────────────────────────────

// ─── Section wrapper ──────────────────────────────────────────────────────────

// 데스크톱/태블릿(md 이상)은 기존처럼 페이지 하나가 정확히 한 화면(100vh)을
// 채우는 세로 슬라이드 방식을 쓰지만, 모바일은 콘텐츠 밀도가 높은 페이지(Resume 등)가
// 한 화면에 안 들어가 잘리는 문제가 있어 "stack" 모드에서는 자연스러운 문서
// 스크롤로 전환한다. Page 컴포넌트를 호출하는 모든 페이지가 이 값을 몰라도
// 되도록 컨텍스트로 전달한다.
function useIsMobile(breakpointPx: number = 767): boolean {
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(`(max-width: ${breakpointPx}px)`).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx}px)`)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [breakpointPx])
  return isMobile
}

// stack 모드에서 각 섹션의 가시성을 관찰해 "현재 보고 있는 섹션" 인덱스를
// 돌려준다 — 스크롤 이벤트 핸들러 대신 IntersectionObserver를 써서 스크롤
// 성능에 영향을 주지 않는다.
function useSectionObserver(ids: string[], enabled: boolean): number {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!enabled) return
    const ratios = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio)
        }
        let bestId = ids[0]
        let bestRatio = -1
        for (const id of ids) {
          const r = ratios.get(id) ?? 0
          if (r > bestRatio) {
            bestRatio = r
            bestId = id
          }
        }
        const idx = ids.indexOf(bestId)
        if (idx !== -1) setActive(idx)
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    )
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ids.join(",")])

  return active
}

// 모바일도 데스크톱과 동일하게 "페이지 하나 = 화면 하나"를 유지한다 — 대신
// 콘텐츠 쪽(PageResume 등)에서 타이포·간격을 모바일 우선으로 압축해 실제로
// 한 화면에 들어오게 한다. 왼쪽 네비게이터 여백만 화면 크기별로 다르다.
function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full flex items-center justify-center overflow-y-auto pl-6 pr-6 sm:pl-20 md:pl-[164px] md:pr-12 shrink-0">
      <div className="w-full max-w-5xl">{children}</div>
    </div>
  )
}

// ─── Pages ────────────────────────────────────────────────────────────────────

const STATUS_MESSAGES = [
  "적극적으로 기회를 찾고 있습니다",
  "새로운 문제를 풀고 싶습니다",
  "AI로 세상을 바꾸는 중입니다",
  "오늘도 코드를 작성하고 있습니다",
  "좋은 팀을 만나고 싶습니다",
  "사용자의 문제를 해결하고 싶습니다",
]

function StatusTicker() {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<"visible" | "exit" | "enter">("visible")

  useEffect(() => {
    const id = setInterval(() => {
      setPhase("exit")
      setTimeout(() => {
        setIndex((i) => (i + 1) % STATUS_MESSAGES.length)
        setPhase("enter")
        setTimeout(() => setPhase("visible"), 20)
      }, 300)
    }, 2800)
    return () => clearInterval(id)
  }, [])

  const transform =
    phase === "exit"
      ? "translateY(-8px)"
      : phase === "enter"
        ? "translateY(8px)"
        : "translateY(0)"

  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        display: "inline-block",
        transform,
        opacity: phase === "visible" ? 1 : 0,
        transition:
          phase === "enter" ? "none" : "transform 0.3s ease, opacity 0.3s ease",
        fontSize: "0.75rem",
        color: "rgba(12,15,26,0.3)",
      }}
    >
      {STATUS_MESSAGES[index]}
    </span>
  )
}

function PageHome() {
  return (
    <Page>
      <div className="flex flex-col gap-8">
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/30 tracking-[0.04em] uppercase"
        >
          Fullstack Developer
        </span>
        <h1
          style={{ fontFamily: "var(--font-display)", lineHeight: 1.15 }}
          className="text-[clamp(2.1rem,9vw,6.5rem)] font-light tracking-tight text-[#0C0F1A]"
        >
          <span>아이디어를</span>
          <br />
          <span className="font-semibold">현실로 만듭니다.</span>
        </h1>
        <div className="border-t border-[#0C0F1A]/10 pt-7 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <p
            style={{ fontFamily: "var(--font-body)" }}
            className="max-w-sm text-[#0C0F1A]/45 text-base leading-loose font-light"
          >
            오진우
          </p>
          <div className="flex items-center gap-4 sm:gap-8 shrink-0 flex-wrap">
            {[
              { label: "GitHub", href: "https://github.com/oznwoo" },
              { label: "RESUME", href: "https://oznwoo.github.io" },
              { label: "Email", href: "mailto:luvmoire@gmail.com" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs text-[#0C0F1A]/30 hover:text-[#0C0F1A] transition-colors uppercase tracking-[0.02em]"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#4F6EF7] animate-pulse shrink-0" />
          <StatusTicker />
        </div>
      </div>
    </Page>
  )
}

function PageAbout() {
  return (
    <Page>
      <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:gap-12">
        {/* "About" 라벨은 모바일에서만 사진보다 먼저 보이는 독립 요소 —
            데스크톱은 텍스트 블록 맨 위에 있는 라벨을 그대로 쓴다 */}
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase md:hidden"
        >
          About
        </span>
        <div
          className="overflow-hidden shrink-0 w-36 sm:w-40 md:w-[180px]"
          style={{
            aspectRatio: "3/4",
            borderRadius: "16px",
            boxShadow:
              "0 20px 48px rgba(12,15,26,0.18), 0 4px 12px rgba(12,15,26,0.10)",
            border: "none",
          }}
        >
          <img
            src={profilePhoto}
            alt="오진우"
            className="w-full h-full object-cover object-top"
            style={{ borderRadius: "16px" }}
          />
        </div>
        <div>
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="hidden text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase md:inline-block"
          >
            About
          </span>
          <h2
            style={{ fontFamily: "var(--font-display)", lineHeight: 1.3 }}
            className="text-[clamp(1.3rem,6vw,2.8rem)] font-light text-[#0C0F1A] mt-2 mb-4 md:mt-3 md:mb-6"
          >
            결국,
            <br />
            <span className="font-semibold">문제를 해결해야 합니다.</span>
          </h2>
          <div
            style={{ fontFamily: "var(--font-body)" }}
            className="space-y-2 text-[#0C0F1A]/50 font-light text-xs leading-relaxed max-w-lg md:space-y-3 md:text-sm md:leading-loose"
          >
            <p className="hidden sm:block">
              안녕하세요. 세상의 다양한 문제를 해결하고 싶은 오진우입니다.
            </p>
            <p>
              AI 발전으로 누구나 적은 전문 지식으로도 원하는 결과를 구현할 수
              있는 시대가 되었다고 생각합니다. 이제는 왜, 어떻게 잘 구현하는
              것이 중요하다고 느낍니다.
            </p>
            <p className="hidden md:block">
              일의 본질은 인간 세상의 문제를 해결하는 것이고 공감이 이에 대한
              마스터키라고 생각합니다.
            </p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[#0C0F1A]/8 pt-4 sm:gap-6 sm:pt-5 md:mt-8 md:pt-7">
            {[
              ["4.22", "GPA / 4.5"],
              ["4건", "주요 프로젝트"],
              ["1편", "학술 논문"],
            ].map(([n, l]) => (
              <div key={l}>
                <div
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-base font-semibold text-[#0C0F1A] sm:text-xl md:text-2xl"
                >
                  {n}
                </div>
                <div
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-[9px] text-[#0C0F1A]/30 uppercase tracking-[0.02em] mt-1 sm:text-xs"
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  )
}

function PageProjects({
  onOpen,
  onHover,
}: {
  onOpen: (id: string) => void
  onHover: (id: string | null) => void
}) {
  const [hovered, setHovered] = useState<string | null>(null)
  return (
    <Page>
      <div>
        <div className="flex items-end justify-between mb-8">
          <div>
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase"
            >
              Projects
            </span>
            <h2
              style={{ fontFamily: "var(--font-nanum)", fontWeight: 700 }}
              className="text-[clamp(1.4rem,3vw,2.2rem)] text-[#0C0F1A] mt-1"
            >
              주요 프로젝트
            </h2>
          </div>
          <a
            href="https://github.com/oznwoo"
            target="_blank"
            rel="noreferrer"
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-xs text-[#0C0F1A]/30 hover:text-[#0C0F1A] transition-colors uppercase tracking-[0.02em]"
          >
            GitHub →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROJECTS.map((p) => {
            const cardAccent = PROJECT_ACCENT[p.id] ?? null
            const cardActive = hovered === p.id
            return (
            <button
              key={p.id}
              onClick={() => onOpen(p.id)}
              onMouseEnter={() => {
                setHovered(p.id)
                onHover(p.id)
              }}
              onMouseLeave={() => {
                setHovered(null)
                onHover(null)
              }}
              className="group text-left rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200"
              style={{
                // 한쪽에서 옅어지는 선형 그라디언트 대신, 카드 곳곳에 부드러운
                // blob 여러 개를 겹쳐 얼룩덜룩하게 번진 느낌을 낸다. 단색
                // 브랜드(Fintag/Gopssl)도 alpha·위치·크기가 제각각이라 균일하지
                // 않게 보이고, 다색 브랜드는 여기에 색상 차이까지 더해진다
                background: cardActive
                  ? cardAccent
                    ? [
                        `radial-gradient(circle at 18% 22%, ${hexToRgba(cardAccent.blobs[0], 0.13)} 0%, transparent 52%)`,
                        `radial-gradient(circle at 78% 15%, ${hexToRgba(cardAccent.blobs[1], 0.1)} 0%, transparent 46%)`,
                        `radial-gradient(circle at 60% 85%, ${hexToRgba(cardAccent.blobs[2], 0.11)} 0%, transparent 50%)`,
                        `radial-gradient(circle at 12% 88%, ${hexToRgba(cardAccent.blobs[0], 0.07)} 0%, transparent 40%)`,
                        `radial-gradient(circle at 92% 65%, ${hexToRgba(cardAccent.blobs[2], 0.07)} 0%, transparent 42%)`,
                        "rgba(248,250,255,0.9)",
                      ].join(", ")
                    : "rgba(248,250,255,0.88)"
                  : "transparent",
                boxShadow: cardActive
                  ? "0 12px 40px rgba(79,110,247,0.10), 0 2px 10px rgba(12,15,26,0.07)"
                  : "none",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((t) => {
                    const accent = PROJECT_ACCENT[p.id] ?? null
                    const active = hovered === p.id && accent !== null
                    // CoChat for Business는 blobs[0](골드)가 흰색과 반씩 섞이면
                    // 너무 밝은 파스텔이 되어 흰 글자 대비가 떨어져서, 이 프로젝트만
                    // 살짝 덜 섞어 배경을 조금 더 진하게 유지한다
                    const pillWhiteMix = p.id === "02" ? 0.2 : 0.5
                    // 카드를 호버하면 pill 배경이 프로젝트 고유 색으로 옅게 채워지고
                    // 글자는 밝은 흰색이 된다. 흰색과 65% 섞어 톤을 낮춘 파스텔에
                    // 가까운 색이라 진하게 채웠던 이전 버전보다 은은하다. 배경은
                    // 그라디언트라 색 값 자체는 애니메이션할 수 없으므로, 항상 채워둔
                    // 오버레이를 opacity로만 페이드시킨다 — CoChat류 다색 브랜드도
                    // 그 여러 색이 배경에 옅게 드러난다.
                    return (
                      <span
                        key={t}
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: active
                            ? "rgba(255,255,255,0.95)"
                            : "rgba(12,15,26,0.38)",
                          // font-weight를 바꾸면 글자 폭이 변해 pill이 넓어지며 옆
                          // pill들이 밀리므로, 폭에 영향 없는 text-stroke로 굵기감만 더한다
                          WebkitTextStroke: active
                            ? "0.35px currentColor"
                            : "0px transparent",
                          boxShadow: active
                            ? `0 6px 16px ${hexToRgba(accent!.primary, 0.18)}, 0 1px 3px rgba(12,15,26,0.08)`
                            : "none",
                          transition:
                            "color 0.35s ease-out, box-shadow 0.35s ease-out",
                        }}
                        className="relative flex items-center text-[9px] px-2.5 py-1 rounded-full uppercase tracking-[0.08em]"
                      >
                        {accent && (
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 rounded-full"
                            style={{
                              // 중심에 은은한 accent 글로우를 얹고, 그 아래 더 옅은
                              // 다색 베이스를 깔아 가장자리로 갈수록 자연스럽게
                              // 퍼지듯 옅어지게 한다
                              background: `radial-gradient(ellipse at center, ${hexToRgba(accent.primary, 0.3)} 0%, transparent 72%), linear-gradient(135deg, ${mixWithWhite(accent.blobs[0], pillWhiteMix)}, ${mixWithWhite(accent.blobs[1], pillWhiteMix)}, ${mixWithWhite(accent.blobs[2], pillWhiteMix)})`,
                              opacity: active ? 1 : 0,
                              transition: active
                                ? "opacity 0.35s ease-out"
                                : "opacity 0.5s ease-in",
                            }}
                          />
                        )}
                        <span className="relative">{t}</span>
                      </span>
                    )
                  })}
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: cardActive
                      ? "rgba(12,15,26,0.4)"
                      : "rgba(12,15,26,0.2)",
                    transition: "color 0.35s ease-out",
                  }}
                  className="text-xs shrink-0"
                >
                  {p.year}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 flex-wrap mb-2">
                  <h3
                    style={{ fontFamily: "var(--font-nanum)", fontWeight: 800 }}
                    className="text-xl text-[#0C0F1A] leading-snug"
                  >
                    {p.title}
                  </h3>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      color: cardActive
                        ? "rgba(12,15,26,0.55)"
                        : "rgba(12,15,26,0.35)",
                      // font-weight를 바꾸면 글자 폭이 변해 옆 요소가 밀리므로
                      // (pill과 동일한 이유), 폭에 영향 없는 text-stroke로 굵기감만 더한다
                      WebkitTextStroke: cardActive
                        ? "0.3px currentColor"
                        : "0px transparent",
                      transition: "color 0.35s ease-out",
                    }}
                    className="text-xs font-light"
                  >
                    {p.subtitle}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    color: cardActive
                      ? "rgba(12,15,26,0.65)"
                      : "rgba(12,15,26,0.45)",
                    WebkitTextStroke: cardActive
                      ? "0.25px currentColor"
                      : "0px transparent",
                    transition: "color 0.35s ease-out",
                  }}
                  className="text-xs leading-relaxed font-light"
                >
                  {p.description}
                </p>
              </div>
            </button>
            )
          })}
        </div>
      </div>
    </Page>
  )
}

// 모바일에서는 4개 카드를 한 화면에 욱여넣는 대신, 프로젝트마다 화면 하나를
// 통째로 준다 — 가로 스와이프/화살표로 넘기는 페이지 하나하나가 프로젝트 한 개.
function MobileProjectPage({
  project,
  index,
  total,
  onOpen,
}: {
  project: (typeof PROJECTS)[number]
  index: number
  total: number
  onOpen: (id: string) => void
}) {
  const accent = PROJECT_ACCENT[project.id] ?? null
  return (
    <Page>
      <button
        onClick={() => onOpen(project.id)}
        className="w-full text-left flex flex-col gap-5"
      >
        <div className="flex items-center justify-between">
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase"
          >
            Projects · {String(index + 1).padStart(2, "0")}/
            {String(total).padStart(2, "0")}
          </span>
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-xs text-[#0C0F1A]/30"
          >
            {project.year}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "var(--font-mono)",
                background: accent
                  ? hexToRgba(accent.primary, 0.08)
                  : "rgba(12,15,26,0.05)",
                color: accent
                  ? hexToRgba(accent.primary, 0.85)
                  : "rgba(12,15,26,0.4)",
              }}
              className="text-[9px] px-2.5 py-1 rounded-full uppercase tracking-[0.08em]"
            >
              {t}
            </span>
          ))}
        </div>
        <div>
          <h2
            style={{ fontFamily: "var(--font-nanum)", fontWeight: 800 }}
            className="text-2xl text-[#0C0F1A] leading-snug"
          >
            {project.title}
          </h2>
          <p
            style={{ fontFamily: "var(--font-body)" }}
            className="text-sm text-[#0C0F1A]/40 font-light mt-1"
          >
            {project.subtitle}
          </p>
        </div>
        <p
          style={{ fontFamily: "var(--font-body)" }}
          className="text-sm text-[#0C0F1A]/55 leading-relaxed font-light"
        >
          {project.description}
        </p>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            color: accent?.primary ?? "#4F6EF7",
          }}
          className="text-xs uppercase tracking-[0.04em]"
        >
          자세히 보기 →
        </span>
      </button>
    </Page>
  )
}

// 모바일 전용 네비게이션 — 왼쪽 세로 dot rail 대신, 홈으로 가는 로고(좌상단)와
// 이전/다음 화살표(우하단)로 가로 페이지를 넘긴다.
function MobileNav({
  current,
  total,
  onPrev,
  onNext,
  onHome,
}: {
  current: number
  total: number
  onPrev: () => void
  onNext: () => void
  onHome: () => void
}) {
  return (
    <>
      <button
        onClick={onHome}
        aria-label="Home"
        className="fixed left-5 top-5 z-50 flex h-9 w-9 items-center justify-center"
      >
        <img
          src={logoImg}
          alt=""
          style={{ width: 20, height: 20, objectFit: "contain", opacity: 0.55 }}
        />
      </button>
      <div
        style={{ fontFamily: "var(--font-mono)" }}
        className="fixed bottom-6 left-6 z-50 text-xs text-[#0C0F1A]/25 select-none"
      >
        {String(current + 1).padStart(2, "0")} /{" "}
        {String(total).padStart(2, "0")}
      </div>
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={current === 0}
          aria-label="이전 페이지"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#0C0F1A]/10 text-[#0C0F1A]/50 backdrop-blur-md transition active:scale-95 disabled:opacity-25"
          style={{ background: "rgba(255,255,255,0.55)" }}
        >
          ←
        </button>
        <button
          onClick={onNext}
          disabled={current === total - 1}
          aria-label="다음 페이지"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#0C0F1A]/10 text-[#0C0F1A]/50 backdrop-blur-md transition active:scale-95 disabled:opacity-25"
          style={{ background: "rgba(255,255,255,0.55)" }}
        >
          →
        </button>
      </div>
    </>
  )
}

const CATEGORY_COLOR: Record<string, string> = {
  교육: "#4F6EF7",
  활동: "#7C5FD4",
  자격증: "#2BA68A",
}

function ResumeCardHeader({ label, color }: { label: string; color: string }) {
  return (
    <div
      style={{ fontFamily: "var(--font-mono)", color }}
      className="mb-2 text-[11px] font-semibold uppercase tracking-[0.04em] opacity-70 sm:mb-3 sm:text-sm md:mb-4 md:text-base"
    >
      {label}
    </div>
  )
}

function TimelineItem({
  item,
}: {
  item: { name: string; sub: string; date: string; link?: string }
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-1.5">
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.name} 증명서 PDF 열기`}
              className="shrink-0 self-center -m-2 p-2 text-[#0C0F1A]/30 transition-colors duration-150 hover:text-[#4F6EF7]"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="sm:w-3 sm:h-3"
              >
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </a>
          )}
          <div
            style={{ fontFamily: "var(--font-nanum)", fontWeight: 700 }}
            className="text-[11px] leading-snug text-[#0C0F1A] sm:text-[12px] md:text-[13px]"
          >
            {item.name}
          </div>
        </div>
        <div
          style={{ fontFamily: "var(--font-mono)" }}
          className="shrink-0 whitespace-nowrap text-[9px] text-[#0C0F1A]/30 sm:text-[10px]"
        >
          {item.date}
        </div>
      </div>
      <div
        style={{ fontFamily: "var(--font-body)" }}
        className="text-[10px] font-light leading-snug text-[#0C0F1A]/40 sm:text-[11px] sm:leading-relaxed"
      >
        {item.sub}
      </div>
    </div>
  )
}

function PageResume() {
  const education = EXP_COLS.find((col) => col.title === "교육")
  const activity = EXP_COLS.find((col) => col.title === "활동")
  const certificate = EXP_COLS.find((col) => col.title === "자격증")

  return (
    <Page>
      <div>
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase"
        >
          Resume
        </span>
        <h2
          style={{ fontFamily: "var(--font-nanum)", fontWeight: 700 }}
          className="text-[clamp(1.1rem,5vw,2.2rem)] text-[#0C0F1A] mt-1 mb-4 sm:mb-6 md:mb-8"
        >
          이력
        </h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:gap-x-8 sm:gap-y-6 md:grid-cols-2 md:gap-x-14 md:gap-y-10">
          <div>
            <ResumeCardHeader label="Education" color={CATEGORY_COLOR.교육} />
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {education?.items.map((item) => (
                <TimelineItem key={item.name} item={item} />
              ))}
            </div>
          </div>
          <div>
            <ResumeCardHeader label="Activities" color={CATEGORY_COLOR.활동} />
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {activity?.items.map((item) => (
                <TimelineItem key={item.name} item={item} />
              ))}
            </div>
          </div>
          <div>
            <ResumeCardHeader label="Skills" color="rgba(12,15,26,0.35)" />
            <div className="grid grid-cols-3 gap-x-2 gap-y-1.5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3">
              {CORE_SKILLS.map((item) => (
                <div key={item} className="group flex items-center gap-1.5 sm:gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md border border-[#0C0F1A]/10 p-[3px] text-[#0C0F1A]/45 transition-colors duration-150 group-hover:border-[#4F6EF7]/40 group-hover:text-[#4F6EF7] sm:h-6 sm:w-6 sm:p-[5px]">
                    <SkillIcon name={item} />
                  </span>
                  <span
                    style={{ fontFamily: "var(--font-body)" }}
                    className="text-[9px] font-light text-[#0C0F1A]/60 transition-colors duration-150 group-hover:text-[#0C0F1A]/80 sm:text-xs"
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <ResumeCardHeader label="Certifications" color={CATEGORY_COLOR.자격증} />
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {certificate?.items.map((item) => (
                <TimelineItem key={item.name} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

function PageContact() {
  const isMobile = useIsMobile()
  const [status, setStatus] = useState<"idle" | "sent">("idle")
  const [form, setForm] = useState({ name: "", email: "", message: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sent")
  }

  const inputCls =
    "w-full rounded-xl px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm text-[#0C0F1A] placeholder-[#0C0F1A]/20 focus:outline-none transition-all duration-200"
  const inputStyle = {
    fontFamily: "var(--font-body)",
    background: "rgba(255,255,255,0.45)",
    border: "1px solid rgba(12,15,26,0.08)",
  }
  const focusStyle = "focus:bg-white/70 focus:border-[#4F6EF7]/30"

  return (
    <Page>
      <div className="grid md:grid-cols-2 gap-6 items-start md:gap-14">
        <div>
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase"
          >
            Contact
          </span>
          <h2
            style={{ fontFamily: "var(--font-display)", lineHeight: 1.3 }}
            className="text-[clamp(1.5rem,6vw,3rem)] font-light text-[#0C0F1A] mt-2"
          >
            <span>함께</span>
            <br />
            <span className="font-semibold">만들어봐요.</span>
          </h2>
          <p
            style={{ fontFamily: "var(--font-body)" }}
            className="hidden mt-5 text-[#0C0F1A]/40 font-light text-sm leading-loose max-w-xs sm:block"
          >
            풀타임 포지션, 프리랜스, 사이드 프로젝트 등 다양한 기회에 열려
            있습니다.
          </p>
          <div className="mt-3 space-y-1.5 sm:mt-8 sm:space-y-3">
            {[
              { label: "Email", value: "luvmoire@gmail.com" },
              { label: "GitHub", value: "github.com/oznwoo" },
              { label: "Phone", value: "010-5115-7895" },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-5 items-center">
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-[10px] text-[#0C0F1A]/25 uppercase tracking-[0.04em] w-14 shrink-0"
                >
                  {label}
                </span>
                <span
                  style={{ fontFamily: "var(--font-body)" }}
                  className="text-xs text-[#0C0F1A]/55 font-light sm:text-sm"
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          {status === "sent" ? (
            <div
              className="rounded-2xl p-6 text-center sm:p-10"
              style={{
                background: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(79,110,247,0.15)",
              }}
            >
              <div
                style={{ fontFamily: "var(--font-nanum)", fontWeight: 700 }}
                className="text-lg text-[#0C0F1A]"
              >
                메시지가 전송됐습니다.
              </div>
              <p
                style={{ fontFamily: "var(--font-body)" }}
                className="mt-3 text-sm text-[#0C0F1A]/40 font-light"
              >
                빠른 시일 내에 답장 드리겠습니다.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
              {[
                {
                  id: "name",
                  label: "이름",
                  type: "text",
                  placeholder: "홍길동",
                },
                {
                  id: "email",
                  label: "Email",
                  type: "email",
                  placeholder: "you@example.com",
                },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id}>
                  <label
                    htmlFor={id}
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="block text-[10px] text-[#0C0F1A]/30 uppercase tracking-[0.04em] mb-1.5"
                  >
                    {label}
                  </label>
                  <input
                    id={id}
                    type={type}
                    required
                    placeholder={placeholder}
                    value={form[(id as keyof typeof form)]}
                    onChange={(e) => setForm({ ...form, [id]: e.target.value })}
                    className={`${inputCls} ${focusStyle}`}
                    style={inputStyle}
                  />
                </div>
              ))}
              <div>
                <label
                  htmlFor="message"
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="block text-[10px] text-[#0C0F1A]/30 uppercase tracking-[0.04em] mb-1.5"
                >
                  메시지
                </label>
                <textarea
                  id="message"
                  required
                  rows={isMobile ? 2 : 4}
                  placeholder="어떤 프로젝트인가요?"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className={`${inputCls} ${focusStyle} resize-none`}
                  style={inputStyle}
                />
              </div>
              <button
                type="submit"
                style={{
                  fontFamily: "var(--font-nanum)",
                  fontWeight: 700,
                  background: "#0C0F1A",
                }}
                className="w-full rounded-xl py-2.5 text-xs sm:py-3.5 sm:text-sm text-white transition-all duration-300 active:scale-[0.98]"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#4F6EF7")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#0C0F1A")
                }
              >
                보내기
              </button>
            </form>
          )}
        </div>
      </div>
    </Page>
  )
}

// ─── Project Detail Pages (세로 슬라이더) ────────────────────────────────────

const DETAIL_PAGE_LABELS = [
  "Overview",
  "Problem",
  "Solution",
  "Outcome",
  "Stack",
]

// Problem/Solution/Outcome 카드 아이콘. 획일적인 아이콘 라이브러리 대신 사이트
// 톤(가는 획, 둥근 끝)에 맞춘 최소한의 프리미티브 조합으로 직접 그린다.
function DetailIcon({ name }: { name: DetailIconKey }) {
  const p = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "w-full h-full",
  }
  switch (name) {
    case "duplicate":
      return (
        <svg {...p}>
          <rect x="3" y="3" width="13" height="13" rx="2.5" opacity="0.4" />
          <rect x="8" y="8" width="13" height="13" rx="2.5" />
        </svg>
      )
    case "target":
      return (
        <svg {...p}>
          <circle cx="10" cy="10" r="7.5" />
          <circle cx="10" cy="10" r="4" />
          <circle cx="10" cy="10" r="0.6" fill="currentColor" stroke="none" />
          <path d="M16.5 3.5 H21 V8" />
          <path d="M21 3.5 L15 9.5" />
        </svg>
      )
    case "alert":
      return (
        <svg {...p}>
          <path d="M4 20 H20" />
          <rect x="6" y="13" width="3" height="7" opacity="0.4" />
          <rect x="11" y="9" width="3" height="11" opacity="0.4" />
          <rect x="16" y="14" width="3" height="6" opacity="0.4" />
          <circle cx="17.5" cy="4.5" r="2.6" />
          <path d="M17.5 3.2 V4.9" />
          <circle cx="17.5" cy="6.1" r="0.15" fill="currentColor" stroke="none" />
        </svg>
      )
    case "filter":
      return (
        <svg {...p}>
          <path d="M4 5 H20 L14 12.5 V18.5 L10 20.5 V12.5 Z" />
        </svg>
      )
    case "layers":
      return (
        <svg {...p}>
          <path d="M12 3 L21 8 L12 13 L3 8 Z" />
          <path d="M3 13 L12 18 L21 13" />
          <path d="M3 17.5 L12 22 L21 17.5" opacity="0.4" />
        </svg>
      )
    case "sparkle":
      return (
        <svg {...p}>
          <path d="M12 3 L13.8 9.4 L20 11 L13.8 12.6 L12 19 L10.2 12.6 L4 11 L10.2 9.4 Z" />
        </svg>
      )
    case "trend-down":
      return (
        <svg {...p}>
          <path d="M3 6 L10 13 L14 9 L21 16" />
          <path d="M21 9.5 V16 H14.5" />
        </svg>
      )
  }
}

// Overview 히어로 배경의 대형 장식 비주얼. 실사진이 없는 코드 포트폴리오라
// 프로젝트 성격(Fintag는 현금흐름 예측 모델 고도화)을 은유하는 추상 그래픽을
// 직접 그린다. 텍스트 칼럼과 겹치지 않도록 xl 이상에서만 화면 우측에 별도
// 컬럼으로 렌더링한다 (아래 slides 배열의 wrapper 참고).
function HeroVisual({ name, color }: { name: HeroVisualKey; color: string }) {
  switch (name) {
    case "chart": {
      // 미니멀한 성장 막대 — 컴파운드 인터레스트 다이어그램처럼 가는 선
      // 막대가 꾸준히 높아지는 실루엣만으로 "고도화·성장"을 은유한다.
      // 배경을 물들이는 채움·그라디언트·그리드 없이 획(stroke)만 사용해
      // 다른 슬라이드와 배경 톤이 완전히 동일하게 유지된다
      const barCount = 18
      const xStart = 50
      const xEnd = 510
      const gap = (xEnd - xStart) / (barCount - 1)
      const baseline = 460
      const minH = 14
      const maxH = 230
      return (
        <svg
          viewBox="0 0 560 700"
          preserveAspectRatio="xMaxYMax meet"
          className="w-full h-full"
        >
          {Array.from({ length: barCount }, (_, i) => {
            const x = xStart + i * gap
            const t = i / (barCount - 1)
            const h = minH + Math.pow(t, 1.7) * (maxH - minH)
            return (
              <line
                key={i}
                x1={x}
                y1={baseline}
                x2={x}
                y2={baseline - h}
                stroke={color}
                strokeOpacity="0.6"
                strokeWidth="3"
                strokeLinecap="round"
                className="chart-bar-rise"
                style={{
                  transformOrigin: `${x}px ${baseline}px`,
                  animationDelay: `${0.4 + i * 0.035}s`,
                }}
              />
            )
          })}
        </svg>
      )
    }
  }
}

function DetailNav({
  slide,
  onClose,
  goSlide,
  accent,
  isMobile,
  // 등록된 프로젝트면 그 브랜드 그라디언트를, 아니면 기본 블루를 dot에 쓴다.
}: {
  slide: number
  onClose: () => void
  goSlide: (i: number) => void
  accent: ProjectAccent | null
  isMobile: boolean
}) {
  const dotBackground = accent ? accentGradient(accent) : "#4F6EF7"
  const [hovered, setHovered] = useState(false)
  return (
    <nav
      // 데스크톱/태블릿에서는 이 nav가 메인↔상세 패널을 옆으로 밀어내는
      // translateX 래퍼 "안"에 있다 — transform이 있는 조상은 fixed 자식의
      // containing block이 되므로, 여기서 fixed를 쓰면 패널이 슬라이드될 때
      // nav도 화면 밖으로 같이 끌려나가 사라진다. absolute라야 래퍼 박스
      // 기준으로 정상적으로 같이 슬라이드-인 된다. 모바일은 그 transform
      // 래퍼 자체가 없는(overlay) 구조라 fixed로 뷰포트에 고정해야 한다.
      className={
        (isMobile ? "fixed" : "absolute") +
        " left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-start"
      }
      style={{ gap: "10px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 뒤로가기 */}
      <button
        onClick={onClose}
        className="flex items-center gap-2.5 shrink-0"
        style={{ height: "20px" }}
      >
        <span
          className="flex items-center justify-center shrink-0"
          style={{ width: "24px", height: "20px" }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              color: "rgba(12,15,26,0.35)",
            }}
          >
            ←
          </span>
        </span>
        <span
          className="hidden md:inline-block"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#0C0F1A",
            whiteSpace: "nowrap",
            opacity: hovered ? 0.35 : 0,
            transition: "opacity 0.25s",
          }}
        >
          Back
        </span>
      </button>

      {/* 슬라이드 dot + 타이틀 */}
      {DETAIL_PAGE_LABELS.map((label, i) => (
        <button
          key={label}
          onClick={() => goSlide(i)}
          className="flex items-center gap-2.5 shrink-0"
          style={{ height: "20px" }}
        >
          <span
            className="flex items-center shrink-0"
            style={{ width: "24px", height: "20px" }}
          >
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: i === slide ? "20px" : "6px",
                height: "6px",
                background: i === slide ? dotBackground : "rgba(12,15,26,0.22)",
              }}
            />
          </span>
          <span
            className="hidden md:inline-block"
            style={{
              fontFamily: "var(--font-mono)",
              opacity: i === slide ? 0.65 : hovered ? 0.3 : 0,
              color: "#0C0F1A",
              fontSize: "0.65rem",
              letterSpacing: "0.04em",
              textTransform: "uppercase" as const,
              transition: "opacity 0.25s",
              fontWeight: i === slide ? 500 : 400,
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
        </button>
      ))}
    </nav>
  )
}

function ProjectDetailView({
  projectId,
  onClose,
  onTransition,
  // 상세 내부 슬라이드 전환마다 공유 배경의 웜프(회전·버스트)를 같이 재생해
  // 메인 페이지 전환과 동일한 애니메이션 언어를 쓰게 한다.
}: {
  projectId: string
  onClose: () => void
  onTransition: (direction: 1 | -1) => void
}) {
  const [slide, setSlide] = useState(0)
  const animating = useRef(false)
  const touchStart = useRef<number | null>(null)
  const detail = PROJECT_DETAILS[projectId]
  const project = PROJECTS.find((p) => p.id === projectId)!
  const accentColor = PROJECT_ACCENT[projectId]?.primary ?? "#4F6EF7"
  const TOTAL_D = DETAIL_PAGE_LABELS.length
  const isMobile = useIsMobile()
  const detailSlideIds = DETAIL_PAGE_LABELS.map((_, i) => `detail-slide-${i}`)
  // 모바일(stack 모드)에서는 세로 슬라이드 트랙 대신 자연스러운 문서 스크롤을
  // 쓰므로, 활성 dot은 goSlide가 아니라 실제로 보이는 섹션을 관찰해 정한다.
  const observedSlide = useSectionObserver(detailSlideIds, isMobile)
  const displaySlide = isMobile ? observedSlide : slide

  useEffect(() => {
    setSlide(0)
  }, [projectId])

  const goSlide = useCallback(
    (idx: number) => {
      const next = Math.max(0, Math.min(TOTAL_D - 1, idx))
      if (next === slide || animating.current) return
      animating.current = true
      onTransition(next > slide ? 1 : -1)
      setSlide(next)
      setTimeout(() => {
        animating.current = false
      }, 800)
    },
    [slide, onTransition],
  )

  const prevSlide = useCallback(() => goSlide(slide - 1), [slide, goSlide])
  const nextSlide = useCallback(() => goSlide(slide + 1), [slide, goSlide])

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // 모바일(stack 모드)에서는 세로 트랙을 강제 전환하지 않고 일반 문서
      // 스크롤을 그대로 둔다.
      if (isMobile) return
      e.preventDefault()
      if (Math.abs(e.deltaY) < 20) return
      e.deltaY > 0 ? nextSlide() : prevSlide()
    }
    window.addEventListener("wheel", onWheel, { passive: false })
    return () => window.removeEventListener("wheel", onWheel)
  }, [nextSlide, prevSlide, isMobile])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
        return
      }
      if (isMobile) return
      if (e.key === "ArrowDown") nextSlide()
      if (e.key === "ArrowUp") prevSlide()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [nextSlide, prevSlide, onClose, isMobile])

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientY
    }
    const onEnd = (e: TouchEvent) => {
      if (isMobile || touchStart.current === null) return
      const delta = touchStart.current - e.changedTouches[0].clientY
      if (Math.abs(delta) > 50) delta > 0 ? nextSlide() : prevSlide()
      touchStart.current = null
    }
    window.addEventListener("touchstart", onStart, { passive: true })
    window.addEventListener("touchend", onEnd, { passive: true })
    return () => {
      window.removeEventListener("touchstart", onStart)
      window.removeEventListener("touchend", onEnd)
    }
  }, [nextSlide, prevSlide, isMobile])

  const slideWrapClass = isMobile
    ? "min-h-screen w-full flex items-center justify-center px-6 pl-16 py-20"
    : "h-screen flex items-center justify-center px-8 md:px-20 shrink-0"

  const handleDotClick = isMobile
    ? (i: number) =>
        document
          .getElementById(`detail-slide-${i}`)
          ?.scrollIntoView({ behavior: "smooth", block: "start" })
    : goSlide

  const slides = [
    // 개요 — 실사진이 없는 대신, 큰 타이틀(또는 로고)이 세로 중앙에 걸리는
    // 에디토리얼 케이스 스터디 구성(레퍼런스 레이아웃)으로 바꿨다.
    // 좌측 고정 네비게이터(DetailNav, left-6 + 라벨 폭 ~130px)와 겹치지 않도록
    // 텍스트 칼럼은 항상 충분한 좌측 여백을 확보한다. 모바일은 DetailNav 라벨이
    // 숨겨져 dot만 보이므로(hidden md:inline-block) pl-16이면 충분하다.
    <div
      className={
        isMobile
          ? "min-h-screen w-full flex items-center pl-16 pr-6 py-20 relative overflow-hidden"
          : "h-screen flex items-center pl-32 md:pl-44 lg:pl-56 pr-8 md:pr-16 shrink-0 relative overflow-hidden"
      }
    >
      {/* 장식 차트는 텍스트 칼럼(max-w-xl, 최대 우측 끝 ~800px)과 절대 겹치지
          않도록 화면 폭이 충분한 xl(1280px)부터만 우측 고정폭 컬럼에 그린다 */}
      {detail.heroVisual && (
        <div
          className="hidden xl:block absolute inset-y-0 right-0 w-[420px] 2xl:w-[520px]"
          aria-hidden="true"
        >
          <HeroVisual name={detail.heroVisual} color={accentColor} />
        </div>
      )}
      <div className="max-w-xl w-full relative z-10">
        {detail.logoSrc ? (
          <img
            src={detail.logoSrc}
            alt={project.title}
            className="relative h-24 sm:h-28 md:h-32 lg:h-36 w-auto mb-2"
          />
        ) : (
          <h2
            style={{ fontFamily: "var(--font-display)", lineHeight: 0.95 }}
            className="relative text-[clamp(3rem,8vw,6.5rem)] font-light text-[#0C0F1A]"
          >
            {project.title}
          </h2>
        )}
        <p
          style={{ fontFamily: "var(--font-body)" }}
          className="relative text-base italic text-[#0C0F1A]/45 font-light mt-3 mb-6"
        >
          {project.subtitle}
        </p>
        <div className="w-16 h-px mb-6" style={{ background: accentColor }} />
        <p
          style={{ fontFamily: "var(--font-body)" }}
          className="text-sm text-[#0C0F1A]/55 leading-relaxed font-light max-w-md mb-8"
        >
          {detail.overview}
        </p>
        <div className="flex gap-10">
          {[
            ["Period", detail.period],
            ["Role", detail.role],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1.5">
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs text-[#0C0F1A]/25 uppercase tracking-[0.04em]"
              >
                {k}
              </span>
              <span
                style={{ fontFamily: "var(--font-body)" }}
                className="text-sm text-[#0C0F1A]/55 font-light"
              >
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    // 문제 — PPT 발표자료의 카드 레이아웃(헤더 색 바 + 아이콘 + 태그)만 가져오고
    // 색/폰트 등 PPT 자체 템플릿 스타일은 따르지 않는다
    <div
      className={
        isMobile
          ? "min-h-screen w-full flex items-center justify-center px-6 pl-16 py-20"
          : "min-h-screen flex items-center justify-center px-8 md:px-16 shrink-0 py-24"
      }
    >
      <div className="max-w-6xl w-full">
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase mb-10 block"
        >
          Problem
        </span>
        <div className="grid md:grid-cols-3 gap-5">
          {detail.problem.map((item, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-[#0C0F1A]/8 bg-white/50 backdrop-blur-sm flex flex-col"
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 z-10"
                style={{ background: accentColor }}
              />
              {item.image && (
                <div className="h-36 md:h-40 overflow-hidden bg-[#0C0F1A]/[0.03]">
                  <img
                    src={item.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    width={531}
                    height={386}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div className="flex items-start justify-between">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center p-2.5 shrink-0"
                    style={{ background: hexToRgba(accentColor, 0.1), color: accentColor }}
                  >
                    {item.icon && <DetailIcon name={item.icon} />}
                  </div>
                  <span
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="text-xs text-[#0C0F1A]/20"
                  >
                    0{i + 1}
                  </span>
                </div>
                <div>
                  <h3
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-base font-medium text-[#0C0F1A] mb-2"
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{ fontFamily: "var(--font-body)" }}
                    className="text-sm text-[#0C0F1A]/50 leading-relaxed font-light"
                  >
                    {item.body}
                  </p>
                </div>
                {item.tags && (
                  <div className="flex flex-wrap gap-2 mt-auto pt-1">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: accentColor,
                          borderColor: hexToRgba(accentColor, 0.25),
                        }}
                        className="text-[10px] px-2.5 py-1 rounded-full border tracking-[0.02em]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    // 해결
    <div
      className={
        isMobile
          ? "min-h-screen w-full flex items-center justify-center px-6 pl-16 py-20"
          : "min-h-screen flex items-center justify-center px-8 md:px-16 shrink-0 py-24"
      }
    >
      <div className="max-w-6xl w-full">
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase mb-10 block"
        >
          Solution
        </span>
        <div className="grid md:grid-cols-3 gap-5">
          {detail.solution.map((item, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-[#0C0F1A]/8 bg-white/50 backdrop-blur-sm flex flex-col"
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 z-10"
                style={{ background: accentColor }}
              />
              {item.image && (
                <div className="h-36 md:h-40 overflow-hidden bg-[#0C0F1A]/[0.03]">
                  <img
                    src={item.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    width={1400}
                    height={460}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div className="flex items-start justify-between">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center p-2.5 shrink-0"
                    style={{ background: hexToRgba(accentColor, 0.1), color: accentColor }}
                  >
                    {item.icon && <DetailIcon name={item.icon} />}
                  </div>
                  <span
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="text-xs text-[#0C0F1A]/20"
                  >
                    0{i + 1}
                  </span>
                </div>
                <div>
                  <h3
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-base font-medium text-[#0C0F1A] mb-2"
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{ fontFamily: "var(--font-body)" }}
                    className="text-sm text-[#0C0F1A]/50 leading-relaxed font-light"
                  >
                    {item.body}
                  </p>
                </div>
                {item.tags && (
                  <div className="flex flex-wrap gap-2 mt-auto pt-1">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: accentColor,
                          borderColor: hexToRgba(accentColor, 0.25),
                        }}
                        className="text-[10px] px-2.5 py-1 rounded-full border tracking-[0.02em]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    // 성과
    <div
      className={
        isMobile
          ? "min-h-screen w-full flex items-center justify-center px-6 pl-16 py-20"
          : "min-h-screen flex items-center justify-center px-8 md:px-16 shrink-0 py-24"
      }
    >
      <div className="max-w-6xl w-full">
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase mb-10 block"
        >
          Outcome
        </span>
        <div className="grid md:grid-cols-3 gap-5 mb-6">
          {detail.outcome.map((item) => (
            <div
              key={item.label}
              className="relative overflow-hidden rounded-2xl border border-[#0C0F1A]/8 bg-white/50 backdrop-blur-sm p-6 flex flex-col gap-4"
            >
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1"
                style={{ background: accentColor }}
              />
              {item.icon && (
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center p-2.5"
                  style={{ background: hexToRgba(accentColor, 0.1), color: accentColor }}
                >
                  <DetailIcon name={item.icon} />
                </div>
              )}
              <div>
                <div
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-[clamp(1.5rem,3vw,2.2rem)] font-semibold text-[#0C0F1A] leading-none mb-2"
                >
                  {item.stat}
                </div>
                <div
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-xs text-[#0C0F1A]/35 uppercase tracking-[0.02em] leading-relaxed"
                >
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
        {detail.outcomeImage && (
          <div className="relative overflow-hidden rounded-2xl border border-[#0C0F1A]/8 bg-white/50 backdrop-blur-sm mb-6 h-40 md:h-48">
            <img
              src={detail.outcomeImage}
              alt="전처리 및 잔차 보정 적용 후 30일 Walk-forward 예측이 실제 잔액을 촘촘히 따라가는 것을 보여주는 차트"
              loading="lazy"
              width={1000}
              height={807}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="bg-[#0C0F1A] rounded-2xl px-10 py-10">
          <p
            style={{ fontFamily: "var(--font-display)", lineHeight: 1.5 }}
            className="text-xl font-light text-[#F0F3F9]"
          >
            "{project.description}"
          </p>
        </div>
      </div>
    </div>,
    // 기술
    <div className={slideWrapClass}>
      <div className="max-w-2xl w-full">
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase mb-12 block"
        >
          Stack
        </span>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-12">
          {detail.tech.map((group) => (
            <div key={group.category}>
              <div
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs text-[#4F6EF7] uppercase tracking-[0.04em] mb-4"
              >
                {group.category}
              </div>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    style={{ fontFamily: "var(--font-body)" }}
                    className="text-sm text-[#0C0F1A]/55 font-light"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <a
          href="https://github.com/oznwoo"
          target="_blank"
          rel="noreferrer"
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/40 hover:text-[#0C0F1A] transition-colors uppercase tracking-[0.04em] border-b border-[#0C0F1A]/15 pb-0.5"
        >
          GitHub →
        </a>
      </div>
    </div>,
  ]

  const accent = PROJECT_ACCENT[projectId] ?? null

  return (
    <div
      className={
        isMobile
          ? "fixed inset-0 z-40 overflow-y-auto bg-[#EEF1F9]"
          : "w-screen h-screen relative overflow-hidden"
      }
    >
      {/* 배경은 자체 색을 칠하지 않고 App의 공유 GradientBackground를 그대로
          비쳐 보이게 둔다 — 리스트 호버와 같은 방식으로 이 프로젝트의 색이
          깔린다 */}
      {/* 좌측 네비게이터 — 메인과 동일한 구조 */}
      <DetailNav
        slide={displaySlide}
        onClose={onClose}
        goSlide={handleDotClick}
        accent={accent}
        isMobile={isMobile}
      />

      {/* 세로 슬라이드 트랙: 모바일은 자연스러운 문서 스크롤, 데스크톱/태블릿은
          transform 기반 세로 슬라이드 */}
      <div
        className="flex flex-col"
        style={
          isMobile
            ? undefined
            : {
                transform: `translateY(-${slide * 100}vh)`,
                transition: "transform 0.75s cubic-bezier(0.77,0,0.18,1)",
                height: `${TOTAL_D * 100}vh`,
                willChange: "transform",
              }
        }
      >
        {slides.map((s, i) => (
          <div
            key={i}
            id={isMobile ? detailSlideIds[i] : undefined}
            className={isMobile ? "w-full" : "h-screen w-full shrink-0"}
          >
            {s}
          </div>
        ))}
      </div>

      {/* 하단 카운터 — DetailNav와 같은 이유로 데스크톱에서는 absolute를 써야
          translateX 래퍼와 함께 슬라이드-인 된다 */}
      <div
        style={{ fontFamily: "var(--font-mono)" }}
        className={
          (isMobile ? "fixed" : "absolute") +
          " bottom-6 left-6 text-xs text-[#0C0F1A]/25 select-none"
        }
      >
        {String(displaySlide + 1).padStart(2, "0")} /{" "}
        {String(TOTAL_D).padStart(2, "0")}
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

const TOTAL = SECTIONS.length

export default function App() {
  const [current, setCurrent] = useState(0)
  const [activeProject, setActiveProject] = useState<string | null>(null)
  // 상세 패널에 실제로 마운트되는 프로젝트. 닫힐 때는 가로 슬라이드(0.75s)가
  // 끝날 때까지 activeProject보다 늦게 null이 되어, 애니메이션 도중 콘텐츠가
  // 먼저 사라지지 않도록 한다.
  const [renderedProject, setRenderedProject] = useState<string | null>(null)
  const closeDetailTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // 배경이 "상세 페이지 색 모드"로 들어갈지 여부. renderedProject와 달리 열릴 때도
  // 가로 슬라이드(0.75s)가 끝날 때까지 기다렸다가 바뀐다 — 그래야 슬라이드 도중에는
  // 기존 파란 배경이 그대로 보이고, 상세 페이지로 다 넘어간 뒤에야 서서히 프로젝트
  // 색으로 바뀐다. 닫힐 때도 같은 타이밍으로 되돌아간다.
  const [detailBgActive, setDetailBgActive] = useState(false)
  const detailBgTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const animating = useRef(false)
  const touchStart = useRef<number | null>(null)
  // 페이지가 실제로 전환될 때만 잠깐 켜지는 "웜프" 상태 — 색 강조/스케일/블러 펄스에 쓰인다.
  const [warping, setWarping] = useState(false)
  // 지금의 웜프가 상세 페이지 "내부" 섹션 전환에서 온 것인지 표시 — true일 때만
  // 상세 모드에서도 색 버스트를 (프로젝트 색으로) 재생한다.
  const [detailSectionWarp, setDetailSectionWarp] = useState(false)
  const warpTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // 배경 전체의 누적 회전각 — 전환마다 시계 방향으로 더해지기만 하고 되돌아오지 않는다.
  const [rotation, setRotation] = useState(0)
  // 프로젝트 카드 호버 시 blob에 반영할 브랜드 컬러. hoverId는 현재 호버 중인
  // 카드(없으면 null). 상세 페이지가 열려있으면 그 프로젝트 색이 우선한다 —
  // 배경/DotNav/상세 네비게이터가 모두 이 값을 공유해 리스트 호버와 동일한
  // 크로스페이드·펄스·플래시 효과로 상세 페이지 색을 표시한다.
  const [hoverId, setHoverId] = useState<string | null>(null)
  const displayAccentId = renderedProject ?? hoverId
  const hoverAccent = displayAccentId
    ? (PROJECT_ACCENT[displayAccentId] ?? null)
    : null
  // 두 슬롯에 색을 번갈아 담아둔다. 호버 대상이 A→B로 바로 바뀔 때 A가 담긴
  // 슬롯은 페이드아웃, B가 담긴 슬롯은 페이드인 되며 실제로 색이 크로스페이드된다.
  const [slotColors, setSlotColors] = useState<[ProjectAccent, ProjectAccent]>([
    DEFAULT_ACCENT,
    DEFAULT_ACCENT,
  ])
  const [activeSlot, setActiveSlot] = useState<0 | 1>(0)
  // 호버 대상이 바뀔 때마다(호버→호버 직행 포함) 짧게 튕기는 펄스를 재생한다.
  const [pulseActive, setPulseActive] = useState(false)
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevDisplayId = useRef<string | null>(null)
  // 미호버 → 호버로 "처음" 진입하는 순간에만, 페이지 전환에 쓰이는 웜프 버스트를
  // 프로젝트 색으로 재생한다. 호버 중인 카드가 바로 다른 카드로 바뀌는 전환에는
  // 켜지지 않아, 크로스페이드와 역할이 겹치지 않고 "지금 막 반응을 시작했다"는
  // 신호로만 쓰인다.
  const [flashNonce, setFlashNonce] = useState(0)
  const [flashColor, setFlashColor] = useState(DEFAULT_ACCENT.primary)
  const [burstOffset, setBurstOffset] = useState({ x: 0, y: 0 })
  const prevAccentOn = useRef(false)

  useEffect(() => {
    if (hoverAccent && slotColors[activeSlot].primary !== hoverAccent.primary) {
      const nextSlot: 0 | 1 = activeSlot === 0 ? 1 : 0
      setSlotColors((prev) => {
        const next = [...prev] as [ProjectAccent, ProjectAccent]
        next[nextSlot] = hoverAccent
        return next
      })
      setActiveSlot(nextSlot)
    }
    if (displayAccentId && displayAccentId !== prevDisplayId.current) {
      setPulseActive(true)
      if (pulseTimer.current) clearTimeout(pulseTimer.current)
      pulseTimer.current = setTimeout(() => setPulseActive(false), 420)
    }
    const accentOn = hoverAccent !== null
    if (accentOn && !prevAccentOn.current && hoverAccent) {
      setFlashColor(hoverAccent.primary)
      setFlashNonce((n) => n + 1)
      setBurstOffset({
        x: (Math.random() - 0.5) * 26,
        y: (Math.random() - 0.5) * 26,
      })
      // 페이지 전환의 회전을 그대로 재사용하되, 이번엔 방향에 매이지 않고
      // 무작위 각도·방향으로 돌려 매번 다른 방식으로 흩어지게 한다.
      const spin = (Math.random() * 50 + 20) * (Math.random() < 0.5 ? 1 : -1)
      setRotation((r) => r + spin)
    }
    prevAccentOn.current = accentOn
    prevDisplayId.current = displayAccentId
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayAccentId, hoverAccent])

  const pull = hoverId
    ? (PROJECT_PULL[hoverId] ?? { x: 0, y: 0 })
    : { x: 0, y: 0 }

  // 페이지 전환마다 배경을 회전·웜프시키는 공통 트리거. 세로 섹션 이동뿐 아니라
  // 상세 페이지 열기/닫기, 상세 내부 슬라이드에도 동일하게 재사용해 어떤
  // 전환이든 같은 애니메이션 언어를 쓰게 한다. resetHover가 true면 전환 시작과
  // 동시에 리스트 호버를 해제한다 — 상세를 여는 순간에는 열리는 프로젝트의 색이
  // 끊기지 않아야 하므로 false로 호출한다. isDetailSection이 true면 상세
  // 페이지 "내부" 섹션 전환임을 표시해, 진입/퇴장 슬라이드는 조용히 넘어가되
  // 내부 섹션 전환만 메인 페이지와 같은 색 버스트를 (프로젝트 색으로) 재생한다.
  const triggerWarp = useCallback(
    (
      direction: 1 | -1,
      resetHover: boolean = true,
      isDetailSection: boolean = false,
    ) => {
      setWarping(true)
      setDetailSectionWarp(isDetailSection)
      if (resetHover) setHoverId(null)
      setRotation((r) => r + direction * 34)
      if (warpTimer.current) clearTimeout(warpTimer.current)
      warpTimer.current = setTimeout(() => {
        setWarping(false)
        setDetailSectionWarp(false)
      }, 750)
    },
    [],
  )

  const goTo = useCallback(
    (idx: number) => {
      const n = Math.max(0, Math.min(TOTAL - 1, idx))
      if (n === current || animating.current) return
      animating.current = true
      triggerWarp(n > current ? 1 : -1)
      setCurrent(n)
      setTimeout(() => {
        animating.current = false
      }, 800)
    },
    [current, triggerWarp],
  )

  const prev = useCallback(() => goTo(current - 1), [current, goTo])
  const next = useCallback(() => goTo(current + 1), [current, goTo])

  // ref로 최신 isDetail 값을 읽어 deps 배열 크기를 고정
  const isDetail = activeProject !== null
  const isDetailRef = useRef(isDetail)
  isDetailRef.current = isDetail

  // 모바일(stack 모드)에서는 세로 슬라이드 트랙 자체를 렌더링하지 않고 일반
  // 문서 스크롤을 쓰므로, 전역 wheel/touch/keydown 페이지 전환 핸들러는 꺼둔다.
  const isMobile = useIsMobile()
  const isMobileRef = useRef(isMobile)
  isMobileRef.current = isMobile

  useEffect(() => {
    if (closeDetailTimer.current) clearTimeout(closeDetailTimer.current)
    if (activeProject !== null) {
      setRenderedProject(activeProject)
    } else {
      closeDetailTimer.current = setTimeout(() => setRenderedProject(null), 750)
    }
  }, [activeProject])

  useEffect(() => {
    if (detailBgTimer.current) clearTimeout(detailBgTimer.current)
    detailBgTimer.current = setTimeout(() => {
      setDetailBgActive(activeProject !== null)
    }, 750)
  }, [activeProject])

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (isDetailRef.current || isMobileRef.current) return
      e.preventDefault()
      if (Math.abs(e.deltaY) < 20) return
      e.deltaY > 0 ? next() : prev()
    }
    window.addEventListener("wheel", onWheel, { passive: false })
    return () => window.removeEventListener("wheel", onWheel)
  }, [next, prev])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isDetailRef.current || isMobileRef.current) return
      if (e.key === "ArrowDown") next()
      if (e.key === "ArrowUp") prev()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [next, prev])

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientY
    }
    const onEnd = (e: TouchEvent) => {
      if (isDetailRef.current || isMobileRef.current || touchStart.current === null)
        return
      const delta = touchStart.current - e.changedTouches[0].clientY
      if (Math.abs(delta) > 50) delta > 0 ? next() : prev()
      touchStart.current = null
    }
    window.addEventListener("touchstart", onStart, { passive: true })
    window.addEventListener("touchend", onEnd, { passive: true })
    return () => {
      window.removeEventListener("touchstart", onStart)
      window.removeEventListener("touchend", onEnd)
    }
  }, [next, prev])

  const progress = TOTAL > 1 ? current / (TOTAL - 1) : 0

  // 모바일은 세로 대신 가로로 페이지를 넘긴다 — 세로 스크롤/스와이프는
  // 브라우저 자체의 pull-to-refresh와 겹치기 때문. Projects는 카드 4개를
  // 한 화면에 욱여넣지 않고 프로젝트마다 화면 하나를 쓰도록 쪼갠다.
  const MOBILE_TOTAL = 3 + PROJECTS.length + 1
  const [mobilePage, setMobilePage] = useState(0)
  const mobileProgress = MOBILE_TOTAL > 1 ? mobilePage / (MOBILE_TOTAL - 1) : 0
  // 데스크톱의 goTo와 동일하게 triggerWarp를 태워야 배경 blob의 웜프(회전·
  // 스케일·버스트 플래시) 반응이 모바일 페이지 전환에도 재생된다 — 이걸
  // 빼먹었더니 모바일에서만 배경이 그냥 멈춰있는 것처럼 보였음.
  const goMobile = useCallback(
    (idx: number) => {
      const next = Math.max(0, Math.min(MOBILE_TOTAL - 1, idx))
      if (next === mobilePage) return
      triggerWarp(next > mobilePage ? 1 : -1)
      setMobilePage(next)
    },
    [MOBILE_TOTAL, mobilePage, triggerWarp],
  )
  const mobileTouchStart = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!isMobile) return
    const EDGE_GUARD = 24 // 화면 가장자리에서 시작한 스와이프는 OS 뒤로가기 제스처로 넘긴다
    const onStart = (e: TouchEvent) => {
      if (isDetailRef.current) return
      const t = e.touches[0]
      if (t.clientX < EDGE_GUARD || t.clientX > window.innerWidth - EDGE_GUARD) {
        mobileTouchStart.current = null
        return
      }
      mobileTouchStart.current = { x: t.clientX, y: t.clientY }
    }
    const onEnd = (e: TouchEvent) => {
      if (isDetailRef.current || !mobileTouchStart.current) return
      const t = e.changedTouches[0]
      const dx = t.clientX - mobileTouchStart.current.x
      const dy = t.clientY - mobileTouchStart.current.y
      mobileTouchStart.current = null
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return
      goMobile(mobilePage + (dx < 0 ? 1 : -1))
    }
    window.addEventListener("touchstart", onStart, { passive: true })
    window.addEventListener("touchend", onEnd, { passive: true })
    return () => {
      window.removeEventListener("touchstart", onStart)
      window.removeEventListener("touchend", onEnd)
    }
  }, [isMobile, mobilePage, goMobile])

  const mobilePages = [
    <PageHome key="home" />,
    <PageAbout key="about" />,
    <PageResume key="resume" />,
    ...PROJECTS.map((p, i) => (
      <MobileProjectPage
        key={p.id}
        project={p}
        index={i}
        total={PROJECTS.length}
        onOpen={setActiveProject}
      />
    )),
    <PageContact key="contact" />,
  ]

  const pages = [
    <PageHome />,
    <PageAbout />,
    <PageResume />,
    <PageProjects
      // 상세 페이지로 들어갈 때는 웜프(회전·blob 강조) 없이 가로 슬라이드만
      // 재생한다. 호버 중이던 색은 renderedProject가 이어받아 끊기지 않는다.
      onOpen={setActiveProject}
      // 세로 슬라이드 중에는 마우스가 카드를 스쳐도 호버로 잡지 않아, 전환
      // 도중에는 슬라이드 애니메이션만 보이고 색 반응은 끼어들지 않는다.
      onHover={(id) => {
        if (!warping) setHoverId(id)
      }}
    />,
    <PageContact />,
  ]

  const background = (
    <GradientBackground
      progress={isMobile ? mobileProgress : progress}
      page={isMobile ? mobilePage : current}
      warping={warping}
      rotation={rotation}
      accentSlots={slotColors}
      activeSlot={activeSlot}
      accentOn={hoverAccent !== null}
      flashNonce={flashNonce}
      flashColor={flashColor}
      burstOffset={burstOffset}
      pull={pull}
      pulseActive={pulseActive}
      detailMode={detailBgActive}
      detailSectionWarp={detailSectionWarp}
      enteringDetail={activeProject !== null && !detailBgActive}
    />
  )

  const detailOverlay = renderedProject && (
    <ProjectDetailView
      projectId={renderedProject}
      onClose={() => {
        triggerWarp(-1)
        setActiveProject(null)
      }}
      onTransition={(direction) => triggerWarp(direction, false, true)}
    />
  )

  // 모바일은 데스크톱과 같은 "페이지 하나 = 화면 하나" 원칙을 유지하되 축만
  // 세로 → 가로로 바꾼다. 세로 스크롤이 브라우저 pull-to-refresh와 겹치는
  // 문제를 원천적으로 피하면서, Projects는 화면 하나에 4개를 욱여넣는 대신
  // 프로젝트마다 한 페이지씩 준다.
  if (isMobile) {
    return (
      <div className="fixed inset-0 overflow-hidden">
        {background}
        {!isDetail && (
          <MobileNav
            current={mobilePage}
            total={MOBILE_TOTAL}
            onPrev={() => goMobile(mobilePage - 1)}
            onNext={() => goMobile(mobilePage + 1)}
            onHome={() => goMobile(0)}
          />
        )}
        <div
          className="flex h-full"
          style={{
            transform: `translateX(-${mobilePage * 100}vw)`,
            transition: "transform 0.6s cubic-bezier(0.77,0,0.18,1)",
            width: `${MOBILE_TOTAL * 100}vw`,
            willChange: "transform",
          }}
        >
          {mobilePages.map((page, i) => (
            <div key={i} className="h-screen w-screen shrink-0">
              {page}
            </div>
          ))}
        </div>
        {detailOverlay}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      {background}

      {/* 가로 슬라이드: 메인(0) ↔ 상세(1) */}
      <div
        className="flex h-full"
        style={{
          transform: `translateX(${isDetail ? "-100vw" : "0"})`,
          transition: "transform 0.75s cubic-bezier(0.77,0,0.18,1)",
          width: "200vw",
          willChange: "transform",
        }}
      >
        {/* 메인 세로 슬라이더 */}
        <div className="w-screen h-screen shrink-0 relative overflow-hidden">
          <DotNav
            current={current}
            total={TOTAL}
            onChange={goTo}
            accentSlots={slotColors}
            activeSlot={activeSlot}
            accentOn={hoverAccent !== null}
          />
          <div
            className="flex flex-col h-full"
            style={{
              transform: `translateY(-${current * 100}vh)`,
              transition: "transform 0.75s cubic-bezier(0.77,0,0.18,1)",
              height: `${TOTAL * 100}vh`,
              willChange: "transform",
            }}
          >
            {pages.map((page, i) => (
              <div key={i} className="h-screen w-full shrink-0">
                {page}
              </div>
            ))}
          </div>
          <div
            style={{ fontFamily: "var(--font-mono)" }}
            className="fixed bottom-6 left-6 md:left-12 text-xs text-[#0C0F1A]/25 select-none"
          >
            {String(current + 1).padStart(2, "0")} /{" "}
            {String(TOTAL).padStart(2, "0")}
          </div>
        </div>

        {/* 상세 세로 슬라이더 */}
        <div className="w-screen h-screen shrink-0">{detailOverlay}</div>
      </div>
    </div>
  )
}
