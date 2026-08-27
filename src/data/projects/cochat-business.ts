import cochatBusinessLogo from "@/imports/cochat-business-logo.png"
import cochatBusinessAboutHero from "@/imports/cochat-business/cochat-business-about-hero.webp"
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
  demoHeadline: "메신저 알림 통합부터 AI 긴급도 분류까지 이어지는 흐름",
  demoBody:
    "Slack·Discord 알림이 통합 대시보드에 모이고, AI가 긴급도를 분류해 집중모드로 필터링되는 과정을 시연 영상으로 담을 예정입니다.",
  problem: [
    {
      title: "메신저 파편화로 인한 정보 누락",
      body: "업무 채널이 Slack, Discord, 카카오톡으로 분산되면서 중요한 알림을 놓치는 일이 잦아졌습니다. 탭을 오가는 컨텍스트 스위칭 비용도 생산성을 크게 낮췄습니다.",
      shortBody: [
        "업무 채널이 **Slack·Discord·카카오톡**으로 분산",
        "중요한 알림을 **놓치는 일이 잦음**",
        "탭 전환에 따른 **컨텍스트 스위칭 비용** 증가",
      ],
      icon: "duplicate",
      tags: ["멀티채널", "알림누락"],
    },
    {
      title: "긴급도 판단의 주관성",
      body: "같은 메시지라도 사람마다 긴급도를 다르게 판단합니다. 일관된 기준 없이 알림을 처리하다 보니 우선순위 혼란이 발생했습니다.",
      shortBody: [
        "같은 메시지도 **사람마다 긴급도 판단이 다름**",
        "일관된 기준 없이 알림 처리",
        "**우선순위 혼란** 발생",
      ],
      icon: "alert",
      tags: ["일관성부재", "우선순위혼란"],
    },
  ],
  solution: [
    {
      title: "Webhook 기반 통합 수신",
      body: "Slack Event API, Discord Webhook을 연결해 메시지를 단일 서버로 수신하는 파이프라인을 구축했습니다. OAuth 인증으로 워크스페이스별 연동을 지원합니다.",
      comparison: {
        before: [
          {
            title: "업무 알림이 여러 메신저에 분산",
            detail: [
              "Slack·Discord·카카오톡 등 채널마다 **따로 확인**해야 함",
              "탭을 오가며 **컨텍스트 스위칭 비용** 증가",
            ],
          },
          {
            title: "중요한 알림을 놓치는 일이 잦음",
            detail: [
              "여러 채널을 오가다 **알림을 놓침**",
              "긴급한 메시지가 묻히는 경우 발생",
            ],
          },
        ],
        after: [
          {
            title: "Slack·Discord Webhook 통합 수신",
            detail: [
              "Slack Event API·Discord Webhook을 **단일 서버로 연결**",
              "**OAuth 인증**으로 워크스페이스별 연동 지원",
            ],
          },
          {
            title: "하나의 대시보드로 통합 확인",
            detail: [
              "모든 채널 알림이 **한 화면에 모임**",
              "채널 전환 없이 **한눈에 파악** 가능",
            ],
          },
        ],
      },
      icon: "filter",
    },
    {
      title: "LLM 긴급도 분류기",
      body: "GPT API를 활용해 메시지 맥락을 분석하고 긴급/보통/낮음 3단계로 분류합니다. 프롬프트 엔지니어링으로 업무 도메인에 맞는 분류 기준을 적용했습니다.",
      comparison: {
        before: [
          {
            title: "사람마다 다른 긴급도 판단",
            detail: [
              "같은 메시지도 **판단 기준이 제각각**",
              "일관된 기준 없이 알림 처리",
            ],
          },
          {
            title: "우선순위 혼란",
            detail: [
              "긴급한 메시지와 그렇지 않은 메시지가 **뒤섞임**",
              "무엇부터 확인해야 할지 판단하기 어려움",
            ],
          },
        ],
        after: [
          {
            title: "AI가 메시지 맥락을 분석",
            detail: [
              "GPT API로 메시지 내용·맥락을 **자동 분석**",
              "**긴급/보통/낮음 3단계**로 분류",
            ],
          },
          {
            title: "업무 도메인에 맞춘 분류 기준",
            detail: [
              "프롬프트 엔지니어링으로 **분류 기준을 도메인에 맞게 조정**",
              "일관된 기준으로 우선순위 정리",
            ],
          },
        ],
      },
      icon: "sparkle",
    },
    {
      title: "집중모드 기능",
      body: "긴급 메시지만 필터링해 표시하는 집중모드를 구현해 딥워크 중 방해를 최소화할 수 있게 했습니다.",
      comparison: {
        before: [
          {
            title: "모든 알림이 한꺼번에 노출",
            detail: [
              "긴급하지 않은 알림까지 **한 번에 노출**",
              "딥워크 중 **집중이 자주 끊김**",
            ],
          },
        ],
        after: [
          {
            title: "긴급 메시지만 필터링해 표시",
            detail: [
              "**집중모드**로 긴급 메시지만 필터링",
              "딥워크 중 **방해 최소화**",
            ],
          },
        ],
      },
      icon: "target",
    },
  ],
  outcome: [
    { stat: "2종", label: "메신저 연동 (Slack · Discord)", icon: "layers" },
    { stat: "1일", label: "해커톤 당일 MVP 완성" },
    { stat: "6인", label: "팀 리드" },
  ],
  outcomeGallery: [
    {
      title: "메신저 파편화로 인한 정보 누락 → 해결",
      body: "",
      shortBody: [
        "Slack·Discord 알림을 **하나의 대시보드로 통합**",
        "채널 전환 없이 **한눈에 확인** 가능",
      ],
      tags: ["통합수신", "OAuth연동"],
    },
    {
      title: "긴급도 판단의 주관성 → 해결",
      body: "",
      shortBody: [
        "AI가 메시지 맥락을 분석해 **자동으로 긴급도 분류**",
        "**집중모드**로 중요한 메시지만 필터링",
      ],
      tags: ["AI분류", "집중모드"],
    },
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
}
