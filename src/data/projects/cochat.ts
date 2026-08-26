import type { ProjectDetail } from "./types"

export const cochatDetail: ProjectDetail = {
  period: "2024.09 – 2025.06",
  role: "기획 · UI/UX · 풀스택 개발 · 논문 저자",
  overviewHeadline:
    "카카오톡, 문자, 이메일 등 다양한 채널의 알림을 통합하고 AI가 중요도를 분류·요약해주는 모바일 앱.",
  overviewBody:
    "메신저 다양화가 오히려 소통의 장애를 유발한다는 문제를 인식하고, 소통의 본질을 회복하기 위해 기획했습니다. 한양대 졸업 프로젝트로 진행했으며 KIPS 학술대회에 논문을 발표했습니다.",
  roleHeadline: "기획·UI/UX 설계부터 개발, 논문 작성까지 전 과정 주도",
  roleBody:
    "소통의 본질을 회복한다는 문제의식에서 출발해 서비스를 기획하고 UI/UX를 설계했으며, **React Native 앱 개발**과 **AI 분류 파이프라인 구현**, KIPS 학술대회 논문 작성까지 맡았습니다.",
  demoHeadline: "여러 채널의 알림이 통합 타임라인으로 모여 요약되는 흐름",
  demoBody:
    "카카오톡·문자·이메일 알림이 중요도 순으로 정렬된 단일 피드에 모이고, AI가 대화 스레드를 3줄로 요약하는 과정을 시연 영상으로 담을 예정입니다.",
  problem: [
    {
      title: "알림 과부하 (Notification Overload)",
      body: "스마트폰 사용자는 하루 평균 80개 이상의 푸시 알림을 받습니다. 채널이 늘어날수록 진짜 중요한 메시지는 오히려 묻히는 역설이 발생합니다.",
      shortBody: [
        "하루 평균 **80개 이상**의 푸시 알림",
        "채널이 늘수록 **중요한 메시지가 오히려 묻힘**",
      ],
      icon: "alert",
      tags: ["알림과부하", "정보묻힘"],
    },
    {
      title: "메신저별 맥락 단절",
      body: "같은 주제의 대화가 여러 채널에 나뉘어 있어 전체 맥락을 파악하기 위해 앱을 계속 전환해야 합니다.",
      shortBody: [
        "같은 주제 대화가 **여러 채널에 분산**",
        "맥락 파악을 위해 **앱을 계속 전환**해야 함",
      ],
      icon: "duplicate",
      tags: ["채널전환", "맥락단절"],
    },
  ],
  solution: [
    {
      title: "AI 긴급도 판별 엔진",
      body: "메시지 텍스트와 발신자, 시간대, 채널 특성을 종합적으로 분석하는 분류 모델을 설계했습니다. Fine-tuning 없이 프롬프트 설계만으로 도메인 적응성을 확보했습니다.",
      comparison: {
        before: [
          {
            title: "하루 평균 80개 이상의 푸시 알림",
            detail: [
              "채널이 늘어날수록 **중요한 메시지가 오히려 묻힘**",
              "일일이 확인하는 데 많은 시간 소요",
            ],
          },
        ],
        after: [
          {
            title: "메시지 맥락을 종합 분석해 자동 분류",
            detail: [
              "텍스트·발신자·시간대·채널 특성을 **종합 분석**",
              "**추가 학습(Fine-tuning) 없이 프롬프트 설계**만으로 도메인 적응",
            ],
          },
        ],
      },
      icon: "sparkle",
    },
    {
      title: "통합 타임라인 UI",
      body: "채널에 관계없이 모든 메시지를 중요도 순으로 정렬해 단일 피드에 표시합니다. 긴급 메시지는 상단 고정, 낮은 중요도는 자동 그룹화합니다.",
      comparison: {
        before: [
          {
            title: "같은 주제 대화가 여러 채널에 분산",
            detail: [
              "전체 맥락 파악을 위해 **앱을 계속 전환**해야 함",
              "대화 흐름을 따라가기 어려움",
            ],
          },
        ],
        after: [
          {
            title: "중요도 순 단일 피드로 통합",
            detail: [
              "채널에 관계없이 **중요도 순으로 단일 피드**에 표시",
              "긴급 메시지는 **상단 고정**, 낮은 중요도는 **자동 그룹화**",
            ],
          },
        ],
      },
      icon: "layers",
    },
    {
      title: "문맥 요약 기능",
      body: "대화 스레드를 LLM이 3줄로 요약해 전체 내용을 읽지 않아도 핵심을 파악할 수 있게 했습니다.",
      comparison: {
        before: [
          {
            title: "긴 대화 스레드를 모두 읽어야 함",
            detail: [
              "전체 내용을 읽지 않으면 **핵심을 파악하기 어려움**",
              "확인에 많은 시간 소요",
            ],
          },
        ],
        after: [
          {
            title: "AI가 대화를 3줄로 요약",
            detail: [
              "LLM이 대화 스레드를 **3줄로 요약**",
              "전체를 읽지 않아도 **핵심 파악 가능**",
            ],
          },
        ],
      },
      icon: "filter",
    },
  ],
  outcome: [
    { stat: "1편", label: "KIPS 학술대회 논문 발표" },
    { stat: "졸업", label: "한양대 졸업 프로젝트" },
    { stat: "→ B2B", label: "CoChat for Business로 발전" },
  ],
  outcomeGallery: [
    {
      title: "알림 과부하 → 해결",
      body: "",
      shortBody: [
        "AI가 메시지 맥락을 분석해 **자동으로 긴급도 분류**",
        "중요한 메시지가 묻히지 않도록 개선",
      ],
      tags: ["AI분류", "종합분석"],
    },
    {
      title: "메신저별 맥락 단절 → 해결",
      body: "",
      shortBody: [
        "채널 관계없이 **중요도 순 단일 피드**로 통합",
        "AI 요약으로 **핵심을 빠르게 파악**",
      ],
      tags: ["통합피드", "AI요약"],
    },
  ],
  tech: [
    { category: "App", items: ["React Native", "TypeScript"] },
    {
      category: "AI",
      items: ["OpenAI API", "LangChain", "RAG", "Prompt Engineering"],
    },
    { category: "Backend", items: ["FastAPI", "Firebase", "PostgreSQL"] },
  ],
}
