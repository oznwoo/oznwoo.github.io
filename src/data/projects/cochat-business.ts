import cochatBusinessLogo from "@/imports/cochat-business-logo.png"
import cochatBusinessAboutHero from "@/imports/cochat-business/cochat-business-about-hero.webp"
import cochatBusinessAboutRole from "@/imports/cochat-business/cochat-business-about-role.webp"
import cochatBusinessStackArchitecture from "@/imports/cochat-business/cochat-business-stack-architecture.webp"
import type { ProjectDetail } from "./types"

export const cochatBusinessDetail: ProjectDetail = {
  period: "2026.03 – 2026.04",
  role: "서비스 기획 총괄 | 풀스택 개발 | 팀 리더",
  // 여러 메신저 알림에 파묻히는 문제의식을 히어로 배경에 은은하게 암시
  heroEffect: "falling-messages",
  logoSrc: cochatBusinessLogo,
  // 정사각형 심볼 로고라 Fintag 워드마크와 같은 높이(h-20/h-24)를 주면
  // 체감상 훨씬 작아 보여 더 크게 지정한다
  logoClassName: "h-24 sm:h-28 w-auto",
  // 심볼에 서비스명이 포함되어 있지 않아 로고 아래에 별도로 표시한다
  logoShowName: true,
  overviewHeadline: "Co(함께) + Chat(대화하자)",
  overviewBody:
    "메신저의 다양화로 인해 흩어진 알림을 통합하고 AI가 긴급도를 분류하는 업무용 메신저 통합 플랫폼",
  aboutImage: cochatBusinessAboutHero,
  roleHeadline:
    "6인 팀 리더로서 서비스 기획을 총괄하고 프론트엔드·백엔드 개발에 직접 참여",
  roleBody:
    "해커톤 당일 아이디어 제안부터 팀 구성, 기능 우선순위 결정까지 총괄했고 **Next.js 프론트엔드**와 **FastAPI 백엔드** 개발에 직접 참여했습니다.",
  roleImage: cochatBusinessAboutRole,
  demoHeadline: "메신저 알림 통합부터 AI 긴급도 분류까지 이어지는 흐름",
  demoBody:
    "Slack·Discord 알림이 통합 대시보드에 모이고, AI가 긴급도를 분류해 집중모드로 필터링되는 과정을 시연 영상으로 담을 예정입니다.",
  problem: [
    {
      title: "알림 파편화로 인한 맥락 단절",
      body: "업무 알림이 Slack, Discord, Jira, Gmail 등 여러 협업 툴로 흩어지면서 하루에도 수십 번 툴을 오가야 했습니다. 툴 사이에 흩어진 정보(예: Jira 이슈와 Slack 논의)의 연관성도 사람이 직접 이어 붙여야 했습니다.",
      shortBody: [
        "업무 알림이 **Slack·Discord·Jira·Gmail**로 분산",
        "하루 수십 번 **툴 전환(컨텍스트 스위칭)**",
        "툴에 흩어진 정보의 **연관성을 직접 파악**",
      ],
      icon: "duplicate",
      tags: ["멀티채널", "맥락단절"],
    },
    {
      title: "우선순위 없는 알림 전달",
      body: "서버 장애 같은 크리티컬한 알림과 단순 회식 공지가 동일한 비중으로 전달됐습니다. 무엇부터 봐야 할지 매번 사람이 판단해야 해, 정보를 훑는 데만 불필요한 리소스가 들었습니다.",
      shortBody: [
        "**장애 알림**과 **단순 공지**가 같은 비중",
        "무엇부터 볼지 **매번 사람이 판단**",
        "정보 파악에 **불필요한 리소스 낭비**",
      ],
      icon: "alert",
      tags: ["우선순위부재", "정보과부하"],
    },
    {
      title: "중요 알림 때문에 집중할 수 없음",
      body: "서버 다운 같은 중요한 이슈를 놓칠까 봐 방해금지 모드조차 켜지 못했습니다. 결국 딥워크 중에도 모든 알림에 노출되며 집중이 반복적으로 끊겼습니다.",
      shortBody: [
        "중요 알림을 놓칠까 봐 **방해금지 모드도 못 켬**",
        "딥워크 중에도 **모든 알림에 노출**",
        "집중이 **반복적으로 끊김**",
      ],
      icon: "target",
      tags: ["집중불가", "알림피로"],
    },
  ],
  solution: [
    {
      title: "다채널 Webhook 통합 수집 + 교차 플랫폼 문맥 인지",
      body: "Slack Event API·Discord Webhook을 단일 서버로 연결해 모든 알림을 한 대시보드로 모았습니다. 서로 다른 플랫폼의 알림(Jira 이슈 ↔ Slack 논의) 사이 연관성을 AI가 하나의 맥락으로 이어 브리핑합니다.",
      comparison: {
        before: [
          {
            title: "업무 알림이 여러 메신저에 분산",
            detail: [
              "채널마다 **따로 확인**해야 함",
              "툴을 오가며 **컨텍스트 스위칭 비용** 증가",
            ],
          },
          {
            title: "흩어진 정보를 사람이 직접 연결",
            detail: [
              "Jira 이슈와 Slack 논의를 **직접 이어붙임**",
              "전체 맥락 파악에 시간 소요",
            ],
          },
        ],
        after: [
          {
            title: "Slack·Discord Webhook 단일 서버 수집",
            detail: [
              "Event API·Webhook을 **하나의 서버로 연결**",
              "**OAuth 인증**으로 워크스페이스별 연동",
            ],
          },
          {
            title: "교차 플랫폼 연관성을 하나의 맥락으로",
            detail: [
              "플랫폼 간 관련 알림을 **묶어서 브리핑**",
              "채널 전환 없이 **한눈에 파악**",
            ],
          },
        ],
      },
      icon: "filter",
    },
    {
      title: "LLM 문맥 기반 4단계 긴급도 분류 + 한 줄 요약",
      body: "단순 키워드가 아니라 메시지 문맥과 사용자 직무를 함께 분석해 긴급도를 Critical·High·Medium·Low 4단계로 분류하고, 각 알림에 한 줄 요약을 붙였습니다. 응급도에 따른 3색(Red·Yellow·Blue) 체계로 상황을 즉시 인지하게 합니다.",
      comparison: {
        before: [
          {
            title: "모든 알림이 같은 비중으로 도착",
            detail: [
              "장애 알림과 단순 공지가 **뒤섞임**",
              "무엇부터 볼지 **매번 판단**",
            ],
          },
          {
            title: "메시지를 하나씩 열어봐야 파악",
            detail: [
              "요약 없이 **원문 그대로** 나열",
              "정보 훑는 데 리소스 낭비",
            ],
          },
        ],
        after: [
          {
            title: "문맥·직무 기반 4단계 자동 분류",
            detail: [
              "키워드가 아닌 **문맥과 직무**를 함께 분석",
              "**Critical→Low** 4단계 + 3색 우선순위",
            ],
          },
          {
            title: "알림마다 한 줄 요약 제공",
            detail: [
              "핵심만 **한 줄로 압축**",
              "열어보지 않아도 **중요도 판단** 가능",
            ],
          },
        ],
      },
      icon: "sparkle",
    },
    {
      title: "능동적 딥워크 지원 — 집중모드 + 시각 AI",
      body: "집중모드는 Critical 알림만 통과시키고 나머지는 조용히 쌓아둡니다. 웹캠(OpenCV) 기반 시선·자세 분석으로 실제 몰입 상태를 감지해 알림 전달 시점을 자동 조절하고, 집중 해제·퇴근 전에는 미확인 알림을 중요도 순으로 브리핑합니다.",
      comparison: {
        before: [
          {
            title: "방해금지 모드를 켤 수 없음",
            detail: [
              "중요 알림을 **놓칠까 봐** 못 끔",
              "딥워크 중에도 **모든 알림에 노출**",
            ],
          },
          {
            title: "놓친 알림을 나중에 다시 훑어야 함",
            detail: [
              "미확인 알림이 **그대로 쌓임**",
              "복귀 후 처음부터 다시 확인",
            ],
          },
        ],
        after: [
          {
            title: "집중모드 + 시각 AI로 전달 시점 조절",
            detail: [
              "**Critical만 통과**, 나머지는 조용히 보관",
              "웹캠 몰입 감지로 **알림 타이밍 자동 조절**",
            ],
          },
          {
            title: "복귀·퇴근 전 중요도 순 브리핑",
            detail: [
              "미확인 알림을 **중요도 순으로 정리**",
              '"지금 확인해야 할 일"만 한 번에',
            ],
          },
        ],
      },
      icon: "target",
    },
  ],
  outcome: [
    {
      stat: "2종",
      label: "Slack · Discord 실시간 Webhook 연동",
      icon: "layers",
    },
    {
      stat: "4단계",
      label: "LLM 문맥 기반 긴급도 분류 + 한 줄 요약",
      icon: "sparkle",
    },
    {
      stat: "1일",
      label: "해커톤 당일 통합 대시보드·집중모드 MVP 완성",
      icon: "target",
    },
  ],
  outcomeGallery: [
    {
      title: "알림 파편화로 인한 맥락 단절 → 해결",
      body: "",
      shortBody: [
        "Slack·Discord 알림을 **하나의 대시보드로 통합**",
        "교차 플랫폼 연관성까지 **묶어서 브리핑**",
        "채널 전환 없이 한눈에 확인",
      ],
      tags: ["통합수신", "문맥인지"],
    },
    {
      title: "우선순위 없는 알림 전달 → 해결",
      body: "",
      shortBody: [
        "문맥·직무 분석으로 **4단계 자동 분류**",
        "알림마다 **한 줄 요약** 제공",
        "3색 우선순위로 즉시 인지",
      ],
      tags: ["AI분류", "한줄요약"],
    },
    {
      title: "중요 알림 때문에 집중할 수 없음 → 해결",
      body: "",
      shortBody: [
        "**집중모드**로 Critical 알림만 통과",
        "웹캠 몰입 감지로 **알림 타이밍 조절**",
        "복귀·퇴근 전 **중요도 순 브리핑**",
      ],
      tags: ["집중모드", "시각AI"],
    },
  ],
  tech: [
    { category: "Frontend", items: ["Next.js", "TypeScript", "Tailwind CSS"] },
    { category: "Backend", items: ["FastAPI", "Python", "SQLAlchemy"] },
    { category: "Database", items: ["PostgreSQL", "pgvector"] },
    { category: "AI", items: ["LangGraph", "RAG", "GPT API", "OpenCV"] },
    {
      category: "Integration",
      items: ["Slack API", "Discord Webhook", "OAuth 2.0"],
    },
    { category: "Infra", items: ["Docker", "Docker Compose", "AWS"] },
  ],
  stackDiagram: cochatBusinessStackArchitecture,
}
