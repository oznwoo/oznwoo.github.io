import { useState, useEffect, useRef, useCallback } from "react";
import profilePhoto from "@/imports/____________________.jpeg";
import logoImg from "@/imports/______________.png";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  "Home",
  "About",
  "Projects",
  "Skills",
  "Experience",
  "Contact",
];

// 프로젝트 카드 호버 시 반영할 브랜드 컬러 (로고/배너 기반). 로고를 받은 프로젝트만
// 등록되어 있고, 없는 프로젝트는 호버해도 색이 바뀌지 않는다.
// - primary: DotNav dot, 캔버스 톤, 태그 pill처럼 단색이 필요한 곳
// - blobs: 배경 blob a/b/c 각각에 입힐 색 — 그라디언트 브랜드는 여러 색을 넣어 재현
type ProjectAccent = { primary: string; blobs: [string, string, string] };

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
};

// 카드 그리드(2열)에서 프로젝트가 위치한 사분면 방향으로 blob이 살짝 쏠리게 해
// 호버할 때마다 그라디언트가 실제로 "반응"하는 느낌을 준다. x/y는 -1~1.
const PROJECT_PULL: Record<string, { x: number; y: number }> = {
  "01": { x: -1, y: -1 },
  "02": { x: 1, y: -1 },
  "03": { x: -1, y: 1 },
  "04": { x: 1, y: 1 },
};

const DEFAULT_ACCENT: ProjectAccent = {
  primary: "#4F6EF7",
  blobs: ["#4F6EF7", "#4F6EF7", "#4F6EF7"],
};

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// DotNav dot·태그 pill처럼 작은 UI에 브랜드 컬러를 입힐 때 쓰는 그라디언트.
// blobs 3색이 모두 같은 단색 프로젝트는 자연히 flat color로 보이고,
// CoChat/CoChat for Business처럼 3색이 다른 프로젝트는 그 다색이 그대로 드러난다.
function accentGradient(accent: ProjectAccent): string {
  return `linear-gradient(135deg, ${accent.blobs[0]}, ${accent.blobs[1]}, ${accent.blobs[2]})`;
}

const PROJECTS = [
  {
    id: "01",
    title: "Fintag",
    subtitle: "중소기업 자금 관리 에이전트",
    description:
      "유휴 자금 감지 및 수익화 제안 SaaS. 복합 모델 구조로 고도화해 예측 오차율 67% 감소.",
    tags: ["Python", "FastAPI", "ML"],
    year: "2026",
    link: "https://github.com/oznwoo",
  },
  {
    id: "02",
    title: "CoChat for Business",
    subtitle: "B2B 메신저 통합 플랫폼",
    description:
      "업무 알림을 AI가 긴급도 분류하는 SaaS. 6인 팀 리더, Slack·Discord 연동 구현.",
    tags: ["Fullstack", "AI", "SaaS"],
    year: "2026",
    link: "https://github.com/oznwoo",
  },
  {
    id: "03",
    title: "Gopssl",
    subtitle: "미용실 매출·고객 관리 앱",
    description:
      "기획·디자인·개발 전 과정 단독 진행. 2025년 8월부터 실사용자가 실제로 사용 중.",
    tags: ["Flutter", "Mobile"],
    year: "2025",
    link: "https://github.com/oznwoo",
  },
  {
    id: "04",
    title: "CoChat",
    subtitle: "메신저 통합 플랫폼",
    description:
      "다양한 메신저 알림 필터링·요약 앱. KIPS 정보처리학회 학술대회 논문 발표.",
    tags: ["Mobile", "AI", "NLP"],
    year: "2024",
    link: "https://github.com/oznwoo",
  },
];

const PROJECT_DETAILS: Record<
  string,
  {
    period: string;
    role: string;
    overview: string;
    problem: { title: string; body: string }[];
    solution: { title: string; body: string }[];
    outcome: { stat: string; label: string }[];
    tech: { category: string; items: string[] }[];
  }
> = {
  "01": {
    period: "2026.04 – 2026.06",
    role: "백엔드 개발 · ML 엔지니어링 (인턴십)",
    overview:
      "중소기업이 통장에 묶어두는 유휴 자금을 실시간으로 감지하고, 적합한 금융 상품을 제안하는 자금 관리 SaaS. 실제 거래 내역 데이터를 기반으로 미래 현금흐름을 예측하는 모델과 이를 서빙하는 백엔드 시스템을 담당했습니다.",
    problem: [
      {
        title: "낮은 예측 정확도",
        body: "초기 단일 ARIMA 모델은 불규칙한 소규모 기업 거래 패턴을 제대로 학습하지 못해 예측 오차율이 높았습니다. 계절성, 이벤트성 지출이 혼재된 데이터에 단일 모델은 한계가 명확했습니다.",
      },
      {
        title: "예측 결과의 불투명성",
        body: "왜 이 금액을 예측했는지 설명할 수 없어 실무 담당자가 결과를 신뢰하기 어려웠습니다. 금융 도메인에서 설명 가능성은 신뢰의 기본 조건입니다.",
      },
      {
        title: "이상 거래 탐지 부재",
        body: "비정상적인 대규모 출금이나 반복 이체 패턴을 감지하는 기능이 없어 실사용자의 리스크 관리가 불가능했습니다.",
      },
    ],
    solution: [
      {
        title: "복합 모델 앙상블 구조",
        body: "ARIMA + LightGBM + Prophet을 앙상블하는 구조로 재설계했습니다. 각 모델이 잘 포착하는 패턴(추세, 계절성, 잔차)을 분리해 학습시키고 가중 평균으로 최종 예측값을 산출했습니다.",
      },
      {
        title: "SHAP 기반 예측 근거 설명",
        body: "SHAP 라이브러리를 도입해 각 피처(최근 매출, 고정비, 계절 요인 등)가 예측에 미친 영향도를 수치화하고 API 응답에 포함시켰습니다.",
      },
      {
        title: "Isolation Forest 이상 탐지",
        body: "거래 내역에서 통계적 이상치를 자동 탐지하는 Isolation Forest 모델을 별도 파이프라인으로 구성해 알림 API와 연결했습니다.",
      },
    ],
    outcome: [
      { stat: "67%", label: "예측 오차율 감소" },
      { stat: "3종", label: "앙상블 모델 구성" },
      { stat: "2개", label: "신규 API 기능 추가" },
    ],
    tech: [
      { category: "Backend", items: ["Python", "FastAPI", "PostgreSQL"] },
      {
        category: "ML",
        items: ["LightGBM", "Prophet", "ARIMA", "SHAP", "Isolation Forest"],
      },
      { category: "Infra", items: ["Docker", "AWS EC2", "S3"] },
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
      { category: "Backend", items: ["Node.js", "Express", "PostgreSQL"] },
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
      "예약제 없이 운영되는 소규모 미용실을 위한 고객·매출 관리 앱. 어머니의 미용실이 수기로 장부를 관리하는 것을 보고 직접 기획했습니다. UI/UX 설계부터 Flutter 앱 개발, 백엔드 서버 배포까지 전 과정을 혼자 진행했습니다.",
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
      { category: "App", items: ["Flutter", "Dart", "Provider"] },
      { category: "Backend", items: ["FastAPI", "Python", "SQLite"] },
      { category: "Infra", items: ["Raspberry Pi", "Ngrok"] },
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
      { category: "App", items: ["Flutter", "Dart"] },
      {
        category: "AI",
        items: ["OpenAI API", "LangChain", "Prompt Engineering"],
      },
      { category: "Backend", items: ["FastAPI", "Firebase", "PostgreSQL"] },
    ],
  },
};

const SKILLS = [
  {
    category: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "Dart"],
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "Flutter", "Tailwind CSS"],
  },
  {
    category: "Backend",
    items: ["FastAPI", "Node.js", "REST API", "PostgreSQL"],
  },
  {
    category: "AI / ML",
    items: ["LLM Integration", "예측 모델링", "SHAP / LIME", "RAG"],
  },
];

const EXP_COLS = [
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
    title: "교육",
    items: [
      {
        name: "핀테크 인턴십 코스 4기",
        sub: "풀스택 과정 수료",
        date: "2025.12 – 2026.06",
      },
      {
        name: "한양대학교 ERICA",
        sub: "컴퓨터전공 졸업 · GPA 4.22 / 4.5",
        date: "2020 – 2026",
      },
    ],
  },
  {
    title: "자격증",
    items: [
      { name: "정보처리기사", sub: "한국산업인력공단", date: "2026.09" },
      { name: "GTQ 1급", sub: "한국생산성본부", date: "2024.09" },
    ],
  },
];

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
}: {
  progress: number;
  page: number;
  warping: boolean;
  rotation: number;
  // 두 슬롯에 색을 번갈아 담아, 호버 대상이 바로 다른 프로젝트로 바뀌어도
  // (A 색 슬롯이 빠지는 동안 B 색 슬롯이 들어오며) 실제로 색이 섞여 보이는
  // 크로스페이드가 일어나게 한다 — 하나의 배경에 색만 스냅되는 것을 방지.
  accentSlots: [ProjectAccent, ProjectAccent];
  activeSlot: 0 | 1;
  accentOn: boolean;
  // 미호버 → 호버로 처음 진입할 때마다 1씩 증가 — 값이 바뀔 때마다 웜프 버스트를
  // remount시켜 페이지 전환과 같은 버스트 애니메이션을 프로젝트 색으로 재생한다.
  flashNonce: number;
  flashColor: string;
  // 버스트가 매번 다른 지점에서 퍼지도록 살짝 흔드는 무작위 오프셋(vw/vh).
  burstOffset: { x: number; y: number };
  // 호버 중인 카드의 사분면 방향으로 blob을 밀어 위치 자체도 반응하게 한다.
  pull: { x: number; y: number };
  // 호버 대상이 바뀔 때마다 짧게 튕기며 "살아있는" 느낌을 주는 펄스.
  pulseActive: boolean;
}) {
  const p = progress;

  const pulseTransition = pulseActive
    ? "scale 0.16s cubic-bezier(0.34,1.56,0.64,1), translate 0.5s cubic-bezier(0.22,1,0.36,1)"
    : "scale 0.45s cubic-bezier(0.22,1,0.36,1), translate 0.5s cubic-bezier(0.22,1,0.36,1)";
  const pulseScale = pulseActive ? 1.1 : 1;

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
      const isVisible = accentOn && activeSlot === slot;
      return (
        <div
          key={slot}
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(ellipse at center, ${hexToRgba(
              accentSlots[slot].blobs[blobIndex],
              alpha,
            )} 0%, transparent ${blobIndex === 2 ? 65 : 70}%)`,
            opacity: isVisible ? targetOpacity : 0,
            transition: isVisible
              ? `opacity ${inMs}ms ease-out`
              : `opacity ${outMs}ms ease-in`,
          }}
        />
      );
    });
  }

  // 페이지 슬라이드(0.75s)와 정확히 같은 속도로 튕기듯 크게 움직였다가,
  // 워프가 끝나면 훨씬 느린 이징으로 가라앉는다.
  const warpEase = "cubic-bezier(0.34,1.56,0.64,1)";
  const settleEase = "cubic-bezier(0.22,1,0.36,1)";
  const SLIDE_S = "0.75s";

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
        const isVisible = accentOn && activeSlot === slot;
        return (
          <div
            key={slot}
            className="absolute inset-0"
            style={{
              backgroundColor: accentSlots[slot].primary,
              opacity: isVisible ? 0.09 : 0,
              transition: isVisible
                ? "opacity 0.3s ease-out"
                : "opacity 0.7s ease-in",
            }}
          />
        );
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
            width: "70vw",
            height: "70vw",
            top: "-20%",
            left: "-15%",
            translate: `${p * -16}vw ${p * 26}vh`,
            scale: warping ? 1.16 : 1,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(199,210,254,0.8) 0%, transparent 70%)",
            filter: warping ? "blur(58px)" : "blur(40px)",
            transition: warping
              ? `translate ${SLIDE_S} ${warpEase}, scale 0.5s ${warpEase}, filter 0.35s ease-out`
              : `translate 0.5s ${settleEase}, scale 0.6s ${settleEase}, filter 0.6s ease-out`,
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 28% 32%, rgba(79,110,247,0.9) 0%, rgba(79,110,247,0.25) 42%, transparent 70%)",
              opacity: warping ? 0.65 : 0,
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
            width: "60vw",
            height: "60vw",
            bottom: "-10%",
            right: "-10%",
            translate: `${p * 13}vw ${p * -19}vh`,
            scale: warping ? 1.11 : 1,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(165,180,252,0.7) 0%, transparent 70%)",
            filter: warping ? "blur(64px)" : "blur(46px)",
            transition: warping
              ? `translate ${SLIDE_S} ${warpEase}, scale 0.55s ${warpEase}, filter 0.35s ease-out`
              : `translate 0.65s ${settleEase}, scale 0.65s ${settleEase}, filter 0.65s ease-out`,
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 72% 30%, rgba(67,93,235,0.85) 0%, rgba(67,93,235,0.22) 42%, transparent 70%)",
              opacity: warping ? 0.6 : 0,
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
            width: "55vw",
            height: "55vw",
            top: "30%",
            left: "28%",
            translate: `${p * -9}vw ${p * 13}vh`,
            scale: warping ? 1.19 : 1,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(224,231,255,0.62) 0%, transparent 65%)",
            filter: warping ? "blur(70px)" : "blur(54px)",
            transition: warping
              ? `translate ${SLIDE_S} ${warpEase}, scale 0.6s ${warpEase}, filter 0.35s ease-out`
              : `translate 0.8s ${settleEase}, scale 0.7s ${settleEase}, filter 0.7s ease-out`,
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(124,95,212,0.6) 0%, transparent 65%)",
              opacity: warping ? 0.55 : 0,
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
  );
}

// ─── Dot Nav ──────────────────────────────────────────────────────────────────

function DotNav({
  current,
  total,
  onChange,
  accentSlots,
  activeSlot,
  accentOn,
}: {
  current: number;
  total: number;
  onChange: (i: number) => void;
  // 현재 페이지 dot의 색. 두 슬롯을 크로스페이드시켜, 호버 대상이 바로 다른
  // 프로젝트로 바뀌어도 dot 색이 스냅되지 않고 배경과 같은 방식으로 섞이며
  // 전환된다. 프로젝트가 다색 브랜드면 그라디언트로 그 다색이 그대로 보인다.
  accentSlots: [ProjectAccent, ProjectAccent];
  activeSlot: 0 | 1;
  accentOn: boolean;
}) {
  const [hovered, setHovered] = useState(false);
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
        const i = idx + 1;
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
        );
      })}
    </nav>
  );
}

// ─── Top Nav ──────────────────────────────────────────────────────────────────

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="h-screen w-full flex items-center justify-center pr-6 md:pr-12 shrink-0"
      style={{ paddingLeft: "calc(1.5rem + 140px)" }}
    >
      <div className="w-full max-w-5xl">{children}</div>
    </div>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────

const STATUS_MESSAGES = [
  "적극적으로 기회를 찾고 있습니다",
  "새로운 문제를 풀고 싶습니다",
  "AI로 세상을 바꾸는 중입니다",
  "오늘도 코드를 작성하고 있습니다",
  "좋은 팀을 만나고 싶습니다",
  "사용자의 문제를 해결하고 싶습니다",
];

function StatusTicker() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"visible" | "exit" | "enter">("visible");

  useEffect(() => {
    const id = setInterval(() => {
      setPhase("exit");
      setTimeout(() => {
        setIndex((i) => (i + 1) % STATUS_MESSAGES.length);
        setPhase("enter");
        setTimeout(() => setPhase("visible"), 20);
      }, 300);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  const transform =
    phase === "exit"
      ? "translateY(-8px)"
      : phase === "enter"
        ? "translateY(8px)"
        : "translateY(0)";

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
  );
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
          className="text-[clamp(3rem,8vw,6.5rem)] font-light tracking-tight text-[#0C0F1A]"
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
          <div className="flex items-center gap-8 shrink-0">
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
  );
}

function PageAbout() {
  return (
    <Page>
      <div className="grid md:grid-cols-[180px_1fr] gap-12 items-center">
        <div
          className="overflow-hidden"
          style={{
            aspectRatio: "3/4",
            borderRadius: "24px",
            boxShadow:
              "0 20px 48px rgba(12,15,26,0.18), 0 4px 12px rgba(12,15,26,0.10)",
            border: "none",
          }}
        >
          <img
            src={profilePhoto}
            alt="오진우"
            className="w-full h-full object-cover object-top"
            style={{ borderRadius: "24px" }}
          />
        </div>
        <div>
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase"
          >
            About
          </span>
          <h2
            style={{ fontFamily: "var(--font-display)", lineHeight: 1.3 }}
            className="text-[clamp(1.6rem,3.5vw,2.8rem)] font-light text-[#0C0F1A] mt-3 mb-6"
          >
            결국,
            <br />
            <span className="font-semibold">문제를 해결해야 합니다.</span>
          </h2>
          <div
            style={{ fontFamily: "var(--font-body)" }}
            className="space-y-3 text-[#0C0F1A]/50 font-light text-sm leading-loose max-w-lg"
          >
            <p>안녕하세요. 세상의 다양한 문제를 해결하고 싶은 오진우입니다.</p>
            <p>
              AI 발전으로 인해 누구나 원하고자 하는 결과를 보다 적은 전문
              지식으로 쉽게 구현할 수 있는 시대가 되었다고 생각합니다. 이제는
              무언가를 구현하는 기술보다는 왜, 어떻게, 잘 구현하는 것이
              중요하다고 느끼고 해결책으로 가는 경로도 다양해져야 한다고
              생각합니다.
            </p>
            <p>
              일의 본질은 인간 세상의 문제를 해결하는 것이고 공감이 이에 대한
              마스터키라고 생각합니다.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-6 border-t border-[#0C0F1A]/8 pt-7">
            {[
              ["4.22", "GPA / 4.5"],
              ["4건", "주요 프로젝트"],
              ["1편", "학술 논문"],
            ].map(([n, l]) => (
              <div key={l}>
                <div
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-2xl font-semibold text-[#0C0F1A]"
                >
                  {n}
                </div>
                <div
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-xs text-[#0C0F1A]/30 uppercase tracking-[0.02em] mt-1"
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}

function PageProjects({
  onOpen,
  onHover,
}: {
  onOpen: (id: string) => void;
  onHover: (id: string | null) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
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
          {PROJECTS.map((p) => (
            <button
              key={p.id}
              onClick={() => onOpen(p.id)}
              onMouseEnter={() => {
                setHovered(p.id);
                onHover(p.id);
              }}
              onMouseLeave={() => {
                setHovered(null);
                onHover(null);
              }}
              className="group text-left rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200"
              style={{
                background:
                  hovered === p.id ? "rgba(248,250,255,0.88)" : "transparent",
                boxShadow:
                  hovered === p.id
                    ? "0 12px 40px rgba(79,110,247,0.10), 0 2px 10px rgba(12,15,26,0.07)"
                    : "none",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map((t) => {
                    const accent = PROJECT_ACCENT[p.id] ?? null;
                    const active = hovered === p.id && accent !== null;
                    return (
                      <span
                        key={t}
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: active ? hexToRgba(accent!.primary, 0.85) : undefined,
                          transition: "color 0.4s ease-out",
                        }}
                        className="relative overflow-hidden text-[10px] px-2 py-0.5 rounded-full bg-[#4F6EF7]/8 text-[#4F6EF7]/70 tracking-wide"
                      >
                        {/* 배경은 그라디언트라 색 값 자체는 애니메이션할 수 없으므로,
                            항상 이 프로젝트 고유 색으로 고정해두고 opacity만 은은하게
                            페이드시킨다 — 다색 브랜드(CoChat 등)도 그 색이 그대로 보인다 */}
                        {accent && (
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: accentGradient(accent),
                              opacity: active ? 0.16 : 0,
                              transition: active
                                ? "opacity 0.4s ease-out"
                                : "opacity 0.6s ease-in",
                            }}
                          />
                        )}
                        <span className="relative">{t}</span>
                      </span>
                    );
                  })}
                </div>
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-xs text-[#0C0F1A]/20 shrink-0"
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
                    style={{ fontFamily: "var(--font-body)" }}
                    className="text-xs text-[#0C0F1A]/35 font-light"
                  >
                    {p.subtitle}
                  </span>
                </div>
                <p
                  style={{ fontFamily: "var(--font-body)" }}
                  className="text-xs text-[#0C0F1A]/45 font-light leading-relaxed"
                >
                  {p.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Page>
  );
}

function PageSkills() {
  return (
    <Page>
      <div>
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase"
        >
          Skills
        </span>
        <h2
          style={{ fontFamily: "var(--font-nanum)", fontWeight: 700 }}
          className="text-[clamp(1.4rem,3vw,2.2rem)] text-[#0C0F1A] mt-1 mb-10"
        >
          기술 스택
        </h2>
        <div className="space-y-8">
          {SKILLS.map((group) => (
            <div key={group.category} className="flex gap-6 items-start">
              <div
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-[10px] text-[#4F6EF7]/60 uppercase tracking-[0.04em] w-20 shrink-0 pt-0.5"
              >
                {group.category}
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    style={{ fontFamily: "var(--font-body)" }}
                    className="text-sm text-[#0C0F1A]/60 font-light px-3 py-1 rounded-full border border-[#0C0F1A]/10 hover:border-[#4F6EF7]/30 hover:text-[#0C0F1A]/80 transition-colors duration-150"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

const CATEGORY_COLOR: Record<string, string> = {
  교육: "#4F6EF7",
  활동: "#7C5FD4",
  자격증: "#2BA68A",
};

// 6 items → 6 equally-spaced columns
const EXP_ITEMS = [
  {
    name: "한양대학교 ERICA",
    sub: "컴퓨터전공 졸업 · GPA 4.22 / 4.5",
    date: "2020 – 2026",
    category: "교육",
    duration: true,
    side: "above" as const,
  },
  {
    name: "GTQ 1급",
    sub: "한국생산성본부",
    date: "2024.09",
    category: "자격증",
    duration: false,
    side: "below" as const,
  },
  {
    name: "KIPS 종합학술대회",
    sub: "CoChat 논문 발표",
    date: "2025.05",
    category: "활동",
    duration: false,
    side: "above" as const,
  },
  {
    name: "핀테크 인턴십 코스 4기",
    sub: "풀스택 과정 수료",
    date: "2025.12 – 2026.06",
    category: "교육",
    duration: true,
    side: "below" as const,
  },
  {
    name: "구름 DEEP DIVE 해커톤",
    sub: "CoChat for Business 팀 리더",
    date: "2026.04",
    category: "활동",
    duration: false,
    side: "above" as const,
  },
  {
    name: "정보처리기사",
    sub: "한국산업인력공단",
    date: "2026.09",
    category: "자격증",
    duration: false,
    side: "below" as const,
  },
];

function PageExperience() {
  const c = (cat: string) => CATEGORY_COLOR[cat];

  return (
    <Page>
      <div>
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase"
        >
          Experience
        </span>
        <h2
          style={{ fontFamily: "var(--font-nanum)", fontWeight: 700 }}
          className="text-[clamp(1.4rem,3vw,2.2rem)] text-[#0C0F1A] mt-1 mb-8"
        >
          경력 및 학력
        </h2>

        {/* legend */}
        <div className="flex gap-5 mb-10">
          {Object.entries(CATEGORY_COLOR).map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className="w-[10px] h-[3px] rounded-full shrink-0"
                style={{ background: color, opacity: 0.5 }}
              />
              <span
                style={{ fontFamily: "var(--font-mono)", color }}
                className="text-[10px] uppercase tracking-[0.04em] opacity-55"
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* timeline: 6 equal columns */}
        <div
          className="grid gap-0"
          style={{ gridTemplateColumns: `repeat(${EXP_ITEMS.length}, 1fr)` }}
        >
          {/* ROW 1: labels above axis */}
          {EXP_ITEMS.map((item) => (
            <div
              key={item.name + "-above"}
              className="flex flex-col items-start pr-2 pb-3"
              style={{
                minHeight: "72px",
                justifyContent: item.side === "above" ? "flex-end" : "flex-end",
                visibility: item.side === "above" ? "visible" : "hidden",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  color: c(item.category),
                }}
                className="text-[9px] opacity-50 mb-0.5"
              >
                {item.date}
              </div>
              <div
                style={{ fontFamily: "var(--font-nanum)", fontWeight: 700 }}
                className="text-[11px] text-[#0C0F1A] leading-snug"
              >
                {item.name}
              </div>
              <div
                style={{ fontFamily: "var(--font-body)" }}
                className="text-[10px] text-[#0C0F1A]/35 font-light leading-relaxed"
              >
                {item.sub}
              </div>
            </div>
          ))}

          {/* ROW 2: axis line + markers */}
          {EXP_ITEMS.map((item) => (
            <div
              key={item.name + "-axis"}
              className="relative flex items-center"
              style={{ height: "16px" }}
            >
              {/* axis segment (full width of cell) */}
              <div
                className="absolute inset-y-[7px] left-0 right-0 bg-[#0C0F1A]/10"
                style={{ height: "1px", top: "50%" }}
              />
              {/* marker */}
              {item.duration ? (
                <div
                  className="relative z-10 h-[5px] rounded-full ml-0 mr-3"
                  style={{
                    background: c(item.category),
                    opacity: 0.5,
                    width: "calc(100% - 12px)",
                  }}
                />
              ) : (
                <div
                  className="relative z-10 w-[7px] h-[7px] rounded-full shrink-0"
                  style={{ background: c(item.category), opacity: 0.5 }}
                />
              )}
            </div>
          ))}

          {/* ROW 3: labels below axis */}
          {EXP_ITEMS.map((item) => (
            <div
              key={item.name + "-below"}
              className="flex flex-col items-start pr-2 pt-3"
              style={{
                minHeight: "72px",
                visibility: item.side === "below" ? "visible" : "hidden",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  color: c(item.category),
                }}
                className="text-[9px] opacity-50 mb-0.5"
              >
                {item.date}
              </div>
              <div
                style={{ fontFamily: "var(--font-nanum)", fontWeight: 700 }}
                className="text-[11px] text-[#0C0F1A] leading-snug"
              >
                {item.name}
              </div>
              <div
                style={{ fontFamily: "var(--font-body)" }}
                className="text-[10px] text-[#0C0F1A]/35 font-light leading-relaxed"
              >
                {item.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

function PageContact() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sent");
  };

  const inputCls =
    "w-full rounded-xl px-4 py-3 text-sm text-[#0C0F1A] placeholder-[#0C0F1A]/20 focus:outline-none transition-all duration-200";
  const inputStyle = {
    fontFamily: "var(--font-body)",
    background: "rgba(255,255,255,0.45)",
    border: "1px solid rgba(12,15,26,0.08)",
  };
  const focusStyle = "focus:bg-white/70 focus:border-[#4F6EF7]/30";

  return (
    <Page>
      <div className="grid md:grid-cols-2 gap-14 items-start">
        <div>
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase"
          >
            Contact
          </span>
          <h2
            style={{ fontFamily: "var(--font-display)", lineHeight: 1.3 }}
            className="text-[clamp(1.8rem,4vw,3rem)] font-light text-[#0C0F1A] mt-2"
          >
            <span>함께</span>
            <br />
            <span className="font-semibold">만들어봐요.</span>
          </h2>
          <p
            style={{ fontFamily: "var(--font-body)" }}
            className="mt-5 text-[#0C0F1A]/40 font-light text-sm leading-loose max-w-xs"
          >
            풀타임 포지션, 프리랜스, 사이드 프로젝트 등 다양한 기회에 열려
            있습니다.
          </p>
          <div className="mt-8 space-y-3">
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
                  className="text-sm text-[#0C0F1A]/55 font-light"
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
              className="rounded-2xl p-10 text-center"
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
            <form onSubmit={handleSubmit} className="space-y-3">
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
                    value={form[id as keyof typeof form]}
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
                  rows={4}
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
                className="w-full rounded-xl py-3.5 text-sm text-white transition-all duration-300 active:scale-[0.98]"
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
  );
}

// ─── Project Detail Pages (세로 슬라이더) ────────────────────────────────────

const DETAIL_PAGE_LABELS = [
  "Overview",
  "Problem",
  "Solution",
  "Outcome",
  "Stack",
];

function DetailNav({
  slide,
  onClose,
  goSlide,
}: {
  slide: number;
  onClose: () => void;
  goSlide: (i: number) => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <nav
      className="absolute left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-start"
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
                background: i === slide ? "#4F6EF7" : "rgba(12,15,26,0.22)",
              }}
            />
          </span>
          <span
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
  );
}

function ProjectDetailView({
  projectId,
  onClose,
}: {
  projectId: string;
  onClose: () => void;
}) {
  const [slide, setSlide] = useState(0);
  const animating = useRef(false);
  const touchStart = useRef<number | null>(null);
  const detail = PROJECT_DETAILS[projectId];
  const project = PROJECTS.find((p) => p.id === projectId)!;
  const TOTAL_D = DETAIL_PAGE_LABELS.length;

  useEffect(() => {
    setSlide(0);
  }, [projectId]);

  const goSlide = useCallback(
    (idx: number) => {
      const next = Math.max(0, Math.min(TOTAL_D - 1, idx));
      if (next === slide || animating.current) return;
      animating.current = true;
      setSlide(next);
      setTimeout(() => {
        animating.current = false;
      }, 800);
    },
    [slide],
  );

  const prevSlide = useCallback(() => goSlide(slide - 1), [slide, goSlide]);
  const nextSlide = useCallback(() => goSlide(slide + 1), [slide, goSlide]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 20) return;
      e.deltaY > 0 ? nextSlide() : prevSlide();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [nextSlide, prevSlide]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown") nextSlide();
      if (e.key === "ArrowUp") prevSlide();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextSlide, prevSlide, onClose]);

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientY;
    };
    const onEnd = (e: TouchEvent) => {
      if (touchStart.current === null) return;
      const delta = touchStart.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 50) delta > 0 ? nextSlide() : prevSlide();
      touchStart.current = null;
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [nextSlide, prevSlide]);

  const slides = [
    // 개요
    <div className="h-screen flex items-center justify-center px-8 md:px-20 shrink-0">
      <div className="max-w-2xl w-full">
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase"
        >
          {project.id} — {project.subtitle}
        </span>
        <h2
          style={{ fontFamily: "var(--font-display)", lineHeight: 1.2 }}
          className="text-[clamp(2.2rem,5vw,4rem)] font-light text-[#0C0F1A] mt-4 mb-8"
        >
          {project.title}
        </h2>
        <p
          style={{ fontFamily: "var(--font-body)" }}
          className="text-base text-[#0C0F1A]/55 leading-loose font-light mb-10"
        >
          {detail.overview}
        </p>
        <div className="flex flex-col gap-3 border-t border-[#0C0F1A]/8 pt-8">
          {[
            ["Period", detail.period],
            ["Role", detail.role],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-8 items-baseline">
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs text-[#0C0F1A]/25 uppercase tracking-[0.04em] w-8 shrink-0"
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
    // 문제
    <div className="h-screen flex items-center justify-center px-8 md:px-20 shrink-0">
      <div className="max-w-2xl w-full">
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase mb-10 block"
        >
          Problem
        </span>
        <div className="space-y-8">
          {detail.problem.map((item, i) => (
            <div key={i} className="flex gap-6">
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs text-[#0C0F1A]/20 mt-1 shrink-0"
              >
                0{i + 1}
              </span>
              <div>
                <h3
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-lg font-medium text-[#0C0F1A] mb-2"
                >
                  {item.title}
                </h3>
                <p
                  style={{ fontFamily: "var(--font-body)" }}
                  className="text-sm text-[#0C0F1A]/50 leading-loose font-light"
                >
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    // 해결
    <div className="h-screen flex items-center justify-center px-8 md:px-20 shrink-0">
      <div className="max-w-2xl w-full">
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase mb-10 block"
        >
          Solution
        </span>
        <div className="space-y-8">
          {detail.solution.map((item, i) => (
            <div key={i} className="flex gap-6">
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs text-[#4F6EF7]/60 mt-1 shrink-0"
              >
                0{i + 1}
              </span>
              <div>
                <h3
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-lg font-medium text-[#0C0F1A] mb-2"
                >
                  {item.title}
                </h3>
                <p
                  style={{ fontFamily: "var(--font-body)" }}
                  className="text-sm text-[#0C0F1A]/50 leading-loose font-light"
                >
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    // 성과
    <div className="h-screen flex items-center justify-center px-8 md:px-20 shrink-0">
      <div className="max-w-2xl w-full">
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/25 tracking-[0.04em] uppercase mb-12 block"
        >
          Outcome
        </span>
        <div className="grid grid-cols-3 gap-8 mb-14">
          {detail.outcome.map((item) => (
            <div key={item.label}>
              <div
                style={{ fontFamily: "var(--font-display)" }}
                className="text-[clamp(1.8rem,4vw,3rem)] font-semibold text-[#0C0F1A] leading-none mb-3"
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
          ))}
        </div>
        <div className="bg-[#0C0F1A] px-10 py-10">
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
    <div className="h-screen flex items-center justify-center px-8 md:px-20 shrink-0">
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
  ];

  return (
    <div
      className="w-screen h-screen relative overflow-hidden"
      style={{ background: "#EEF1F9" }}
    >
      {/* 좌측 네비게이터 — 메인과 동일한 구조 */}
      <DetailNav slide={slide} onClose={onClose} goSlide={goSlide} />

      {/* 세로 슬라이드 트랙 */}
      <div
        className="flex flex-col"
        style={{
          transform: `translateY(-${slide * 100}vh)`,
          transition: "transform 0.75s cubic-bezier(0.77,0,0.18,1)",
          height: `${TOTAL_D * 100}vh`,
          willChange: "transform",
        }}
      >
        {slides.map((s, i) => (
          <div key={i} className="h-screen w-full shrink-0">
            {s}
          </div>
        ))}
      </div>

      {/* 하단 카운터 */}
      <div
        style={{ fontFamily: "var(--font-mono)" }}
        className="absolute bottom-6 left-6 text-xs text-[#0C0F1A]/25 select-none"
      >
        {String(slide + 1).padStart(2, "0")} /{" "}
        {String(TOTAL_D).padStart(2, "0")}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

const TOTAL = SECTIONS.length;

export default function App() {
  const [current, setCurrent] = useState(0);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  // 상세 패널에 실제로 마운트되는 프로젝트. 닫힐 때는 가로 슬라이드(0.75s)가
  // 끝날 때까지 activeProject보다 늦게 null이 되어, 애니메이션 도중 콘텐츠가
  // 먼저 사라지지 않도록 한다.
  const [renderedProject, setRenderedProject] = useState<string | null>(null);
  const closeDetailTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animating = useRef(false);
  const touchStart = useRef<number | null>(null);
  // 페이지가 실제로 전환될 때만 잠깐 켜지는 "웜프" 상태 — 색 강조/스케일/블러 펄스에 쓰인다.
  const [warping, setWarping] = useState(false);
  const warpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 배경 전체의 누적 회전각 — 전환마다 시계 방향으로 더해지기만 하고 되돌아오지 않는다.
  const [rotation, setRotation] = useState(0);
  // 프로젝트 카드 호버 시 blob에 반영할 브랜드 컬러. hoverId는 현재 호버 중인
  // 카드(없으면 null), hoverAccent는 그 색상 데이터.
  const [hoverId, setHoverId] = useState<string | null>(null);
  const hoverAccent = hoverId ? (PROJECT_ACCENT[hoverId] ?? null) : null;
  // 두 슬롯에 색을 번갈아 담아둔다. 호버 대상이 A→B로 바로 바뀔 때 A가 담긴
  // 슬롯은 페이드아웃, B가 담긴 슬롯은 페이드인 되며 실제로 색이 크로스페이드된다.
  const [slotColors, setSlotColors] = useState<[ProjectAccent, ProjectAccent]>(
    [DEFAULT_ACCENT, DEFAULT_ACCENT],
  );
  const [activeSlot, setActiveSlot] = useState<0 | 1>(0);
  // 호버 대상이 바뀔 때마다(호버→호버 직행 포함) 짧게 튕기는 펄스를 재생한다.
  const [pulseActive, setPulseActive] = useState(false);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevHoverId = useRef<string | null>(null);
  // 미호버 → 호버로 "처음" 진입하는 순간에만, 페이지 전환에 쓰이는 웜프 버스트를
  // 프로젝트 색으로 재생한다. 호버 중인 카드가 바로 다른 카드로 바뀌는 전환에는
  // 켜지지 않아, 크로스페이드와 역할이 겹치지 않고 "지금 막 반응을 시작했다"는
  // 신호로만 쓰인다.
  const [flashNonce, setFlashNonce] = useState(0);
  const [flashColor, setFlashColor] = useState(DEFAULT_ACCENT.primary);
  const [burstOffset, setBurstOffset] = useState({ x: 0, y: 0 });
  const prevAccentOn = useRef(false);

  useEffect(() => {
    if (hoverAccent && slotColors[activeSlot].primary !== hoverAccent.primary) {
      const nextSlot: 0 | 1 = activeSlot === 0 ? 1 : 0;
      setSlotColors((prev) => {
        const next = [...prev] as [ProjectAccent, ProjectAccent];
        next[nextSlot] = hoverAccent;
        return next;
      });
      setActiveSlot(nextSlot);
    }
    if (hoverId && hoverId !== prevHoverId.current) {
      setPulseActive(true);
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
      pulseTimer.current = setTimeout(() => setPulseActive(false), 420);
    }
    const accentOn = hoverAccent !== null;
    if (accentOn && !prevAccentOn.current && hoverAccent) {
      setFlashColor(hoverAccent.primary);
      setFlashNonce((n) => n + 1);
      setBurstOffset({
        x: (Math.random() - 0.5) * 26,
        y: (Math.random() - 0.5) * 26,
      });
      // 페이지 전환의 회전을 그대로 재사용하되, 이번엔 방향에 매이지 않고
      // 무작위 각도·방향으로 돌려 매번 다른 방식으로 흩어지게 한다.
      const spin = (Math.random() * 50 + 20) * (Math.random() < 0.5 ? 1 : -1);
      setRotation((r) => r + spin);
    }
    prevAccentOn.current = accentOn;
    prevHoverId.current = hoverId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoverId, hoverAccent]);

  const pull = hoverId ? (PROJECT_PULL[hoverId] ?? { x: 0, y: 0 }) : { x: 0, y: 0 };

  const goTo = useCallback(
    (idx: number) => {
      const n = Math.max(0, Math.min(TOTAL - 1, idx));
      if (n === current || animating.current) return;
      animating.current = true;
      setWarping(true);
      setRotation((r) => r + (n > current ? 34 : -34));
      if (warpTimer.current) clearTimeout(warpTimer.current);
      warpTimer.current = setTimeout(() => setWarping(false), 750);
      setCurrent(n);
      setTimeout(() => {
        animating.current = false;
      }, 800);
    },
    [current],
  );

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  // ref로 최신 isDetail 값을 읽어 deps 배열 크기를 고정
  const isDetail = activeProject !== null;
  const isDetailRef = useRef(isDetail);
  isDetailRef.current = isDetail;

  useEffect(() => {
    if (closeDetailTimer.current) clearTimeout(closeDetailTimer.current);
    if (activeProject !== null) {
      setRenderedProject(activeProject);
    } else {
      closeDetailTimer.current = setTimeout(
        () => setRenderedProject(null),
        750,
      );
    }
  }, [activeProject]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (isDetailRef.current) return;
      e.preventDefault();
      if (Math.abs(e.deltaY) < 20) return;
      e.deltaY > 0 ? next() : prev();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isDetailRef.current) return;
      if (e.key === "ArrowDown") next();
      if (e.key === "ArrowUp") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientY;
    };
    const onEnd = (e: TouchEvent) => {
      if (isDetailRef.current || touchStart.current === null) return;
      const delta = touchStart.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 50) delta > 0 ? next() : prev();
      touchStart.current = null;
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [next, prev]);

  const progress = TOTAL > 1 ? current / (TOTAL - 1) : 0;

  const pages = [
    <PageHome />,
    <PageAbout />,
    <PageProjects onOpen={setActiveProject} onHover={setHoverId} />,
    <PageSkills />,
    <PageExperience />,
    <PageContact />,
  ];

  return (
    <div className="fixed inset-0 overflow-hidden">
      <GradientBackground
        progress={progress}
        page={current}
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
      />

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
        <div className="w-screen h-screen shrink-0">
          {renderedProject && (
            <ProjectDetailView
              projectId={renderedProject}
              onClose={() => setActiveProject(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
