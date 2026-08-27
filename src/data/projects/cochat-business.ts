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
    "여러 메신저에 흩어진 알림을 한 곳에 모으고, AI가 급한 정도를 가려 알려주는 업무용 메신저 통합 플랫폼",
  aboutImage: cochatBusinessAboutHero,
  roleHeadline:
    "6인 팀 리더로서 서비스 기획을 총괄하고 프론트엔드·백엔드 개발에 직접 참여",
  roleBody:
    "해커톤 당일 아이디어 제안부터 팀 구성, 기능 우선순위 결정까지 총괄했고 **Next.js 프론트엔드**와 **FastAPI 백엔드** 개발에 직접 참여했습니다.",
  roleImage: cochatBusinessAboutRole,
  demoHeadline: "메신저 알림을 모으고 AI가 급한 순서대로 정리하기까지",
  demoBody:
    "여러 메신저 알림이 하나의 대시보드에 모이고, AI가 급한 정도를 가려 집중모드에서 걸러 주는 과정을 시연 영상으로 담을 예정입니다.",
  problem: [
    {
      title: "알림이 여러 메신저에 흩어져 있음",
      body: "업무 알림이 여러 메신저와 앱에 흩어져 있어서, 하루에도 수십 번 이 앱 저 앱을 오가야 했습니다. 여기저기 흩어진 내용을 하나로 이어 맞추는 것도 사람 몫이었습니다.",
      shortBody: [
        "업무 알림이 **여러 메신저에 흩어짐**",
        "하루에도 수십 번 **앱을 오감**",
        "흩어진 내용을 **직접 이어 맞춰야 함**",
      ],
      icon: "duplicate",
      tags: ["여러메신저", "흩어진알림"],
    },
    {
      title: "급한 알림과 안 급한 알림이 뒤섞임",
      body: "서버가 멈춘 것 같은 급한 알림과 단순 공지가 똑같은 무게로 왔습니다. 무엇부터 봐야 할지 매번 사람이 판단해야 해서, 훑어보는 데만 시간이 많이 들었습니다.",
      shortBody: [
        "**급한 알림**과 **단순 공지**가 같은 무게",
        "무엇부터 볼지 **매번 사람이 판단**",
        "훑어보는 데만 **시간이 많이 듦**",
      ],
      icon: "alert",
      tags: ["우선순위없음", "알림과다"],
    },
    {
      title: "중요한 알림 때문에 집중할 수 없음",
      body: "중요한 문제를 놓칠까 봐 방해금지 모드조차 켜지 못했습니다. 결국 집중해서 일하는 중에도 모든 알림이 다 들어와서 집중이 계속 끊겼습니다.",
      shortBody: [
        "놓칠까 봐 **방해금지 모드도 못 켬**",
        "집중하는 중에도 **알림이 다 들어옴**",
        "집중이 **계속 끊김**",
      ],
      icon: "target",
      tags: ["집중불가", "알림피로"],
    },
  ],
  solution: [
    {
      title: "여러 메신저 알림을 한 곳에 모으기",
      body: "여러 메신저의 알림을 한 서버로 받아 하나의 대시보드에 모았습니다. 서로 다른 메신저에 흩어진 관련 알림도 AI가 하나로 묶어 정리해 줍니다.",
      comparison: {
        before: [
          {
            title: "알림이 여러 메신저에 흩어짐",
            detail: [
              "메신저마다 **따로 확인**해야 함",
              "앱을 오갈 때마다 **흐름이 끊김**",
            ],
          },
          {
            title: "흩어진 내용을 사람이 직접 연결",
            detail: [
              "관련된 알림을 **하나하나 찾아 맞춤**",
              "전체 상황 파악에 시간 소요",
            ],
          },
        ],
        after: [
          {
            title: "여러 메신저 알림을 한 서버로 수집",
            detail: [
              "모든 알림을 **하나의 대시보드**에 모음",
              "**계정 연결**로 메신저별 연동",
            ],
          },
          {
            title: "관련 알림을 하나로 묶어 정리",
            detail: [
              "여러 메신저에 흩어진 알림을 **묶어서 전달**",
              "메신저를 오갈 필요 없이 **한눈에 파악**",
            ],
          },
        ],
      },
      icon: "filter",
    },
    {
      title: "AI가 대화 내용을 읽고 급한 순서대로 정리",
      body: "단어만 보는 게 아니라 대화의 맥락과 받는 사람이 하는 일까지 함께 살펴서, 알림을 급한 정도에 따라 4단계(긴급·높음·보통·낮음)로 나눕니다. 알림마다 한 줄 요약도 붙이고, 색으로 급한 정도를 한눈에 구분되게 했습니다.",
      comparison: {
        before: [
          {
            title: "모든 알림이 같은 무게로 도착",
            detail: [
              "급한 알림과 단순 공지가 **뒤섞임**",
              "무엇부터 볼지 **매번 판단**",
            ],
          },
          {
            title: "메시지를 하나씩 열어봐야 파악",
            detail: ["요약 없이 **원문 그대로** 나열", "훑어보는 데 시간 낭비"],
          },
        ],
        after: [
          {
            title: "맥락을 읽어 4단계로 자동 구분",
            detail: [
              "단어가 아닌 **대화 맥락과 하는 일**을 함께 봄",
              "**긴급→낮음** 4단계 + 색으로 구분",
            ],
          },
          {
            title: "알림마다 한 줄 요약",
            detail: [
              "핵심만 **한 줄로 요약**",
              "열어보지 않아도 **중요한지 판단** 가능",
            ],
          },
        ],
      },
      icon: "sparkle",
    },
    {
      title: "집중모드 + 카메라로 몰입 상태 파악",
      body: "집중모드에서는 가장 급한 알림만 통과시키고 나머지는 조용히 모아둡니다. 카메라로 사용자의 시선·자세를 살펴 실제로 몰입하고 있는지 파악해 알림을 언제 보낼지 자동으로 조절하고, 집중이 끝나거나 퇴근하기 전에 안 본 알림을 중요한 순서대로 정리해 줍니다.",
      comparison: {
        before: [
          {
            title: "방해금지 모드를 켤 수 없음",
            detail: [
              "중요한 걸 **놓칠까 봐** 못 끔",
              "집중하는 중에도 **알림이 다 들어옴**",
            ],
          },
          {
            title: "놓친 알림을 나중에 다시 훑어야 함",
            detail: [
              "안 본 알림이 **그대로 쌓임**",
              "돌아와서 처음부터 다시 확인",
            ],
          },
        ],
        after: [
          {
            title: "집중모드 + 카메라로 알림 시점 조절",
            detail: [
              "**가장 급한 알림만 통과**, 나머지는 모아둠",
              "카메라로 몰입 상태를 보고 **보낼 타이밍 조절**",
            ],
          },
          {
            title: "집중 후·퇴근 전에 중요한 순서로 정리",
            detail: [
              "안 본 알림을 **중요한 순서대로 정리**",
              '"지금 봐야 할 것"만 한 번에',
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
      label: "메신저 알림 실시간 연동",
      icon: "layers",
    },
    {
      stat: "4단계",
      label: "AI가 대화 맥락을 읽고 급한 정도 구분",
      icon: "sparkle",
    },
    {
      stat: "1일",
      label: "해커톤 당일 통합 대시보드·집중모드까지 구현",
      icon: "target",
    },
  ],
  outcomeGallery: [
    {
      title: "알림이 여러 메신저에 흩어져 있음 → 해결",
      body: "",
      shortBody: [
        "여러 메신저 알림을 **하나의 대시보드로 통합**",
        "관련된 알림까지 **묶어서 정리**",
        "메신저를 오갈 필요 없이 한눈에 확인",
      ],
      tags: ["알림통합", "맥락파악"],
    },
    {
      title: "급한 알림과 안 급한 알림이 뒤섞임 → 해결",
      body: "",
      shortBody: [
        "대화 맥락을 읽어 **4단계로 자동 구분**",
        "알림마다 **한 줄 요약** 제공",
        "색으로 급한 정도를 한눈에",
      ],
      tags: ["AI구분", "한줄요약"],
    },
    {
      title: "중요한 알림 때문에 집중할 수 없음 → 해결",
      body: "",
      shortBody: [
        "**집중모드**로 가장 급한 알림만 통과",
        "카메라로 몰입 상태를 보고 **알림 타이밍 조절**",
        "집중 후·퇴근 전 **중요한 순서로 정리**",
      ],
      tags: ["집중모드", "몰입감지"],
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
