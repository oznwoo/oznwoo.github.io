import cochatLogo from "@/imports/cochat-logo.png"
import cochatAboutHero from "@/imports/cochat/cochat-about-hero.webp"
import cochatAboutRole from "@/imports/cochat/cochat-about-role.webp"
import cochatDemoVideo from "@/imports/cochat/cochat-demo.mp4"
import cochatDemoPoster from "@/imports/cochat/cochat-demo-poster.webp"
import cochatProblemScattered from "@/imports/cochat/cochat-problem-scattered.webp"
import cochatProblemPriority from "@/imports/cochat/cochat-problem-priority.webp"
import cochatProblemContent from "@/imports/cochat/cochat-problem-content.webp"
import cochatOutcomeScattered from "@/imports/cochat/cochat-outcome-scattered.webp"
import cochatOutcomePriority from "@/imports/cochat/cochat-outcome-priority.webp"
import cochatOutcomeContent from "@/imports/cochat/cochat-outcome-content.webp"
import cochatSolutionFlow1 from "@/imports/cochat/cochat-solution-integration-1.webp"
import cochatSolutionFlow2 from "@/imports/cochat/cochat-solution-integration-2.webp"
import cochatSolutionFlow3 from "@/imports/cochat/cochat-solution-integration-3.webp"
import cochatSolutionFlow4 from "@/imports/cochat/cochat-solution-integration-4.webp"
import cochatStackArchitecture from "@/imports/cochat/cochat-stack-architecture.webp"
import cochatSolutionContextCompare from "@/imports/cochat/cochat-solution-context-compare.webp"
import cochatSolutionSummary1 from "@/imports/cochat/cochat-solution-summary-1.webp"
import cochatSolutionSummary2 from "@/imports/cochat/cochat-solution-summary-2.webp"
import type { ProjectDetail } from "./types"

export const cochatDetail: ProjectDetail = {
  period: "2024.09 – 2025.06",
  role: "기획 총괄 | 모바일 풀스택 개발 | 논문 작성 (졸업 프로젝트)",
  logoSrc: cochatLogo,
  // 정사각형 심볼 로고 — CoChat for Business(로고 아래 'for Business' 텍스트가
  // 더 있는)보다 한 단계 작게 잡는다
  logoClassName: "h-20 sm:h-24 w-auto",
  // 심볼에 서비스명이 없어 로고 아래에 별도 텍스트로 표시
  logoShowName: true,
  overviewHeadline: "Co(함께) + Chat(대화하자)",
  overviewBody:
    "여러 메신저에 흩어진 알림을 한 곳에 모으고, AI가 취향에 맞는 메시지만 골라 요약해 주는 메신저 통합 앱",
  // About '프로젝트 소개' 탭 히어로 — Gopssl about-hero와 동일 포맷(폰 목업 + 큐브
  // 로고 + "Co-Chat" 워드마크 + 태그라인). About 탭 컨테이너 비율에 맞춰 1830×1014
  aboutImage: cochatAboutHero,
  roleHeadline:
    "한양대학교 ERICA 컴퓨터공학 [캡스톤 디자인]에 참여한 졸업 프로젝트입니다.",
  roleBody:
    "5인 팀의 대표로 전체 시스템을 설계하고 일정과 역할을 조율했습니다. **OAuth 계정 통합**과 **백엔드 서버**는 직접 개발했고, 연구 내용을 정리해 KIPS 정보처리학회 학술대회에 **제1저자로 발표**했습니다.",
  // '담당 업무' 탭 이미지 — CoChat for Business about-role와 같은 3D 클레이 계열이되,
  // 더 이전 학생 캡스톤 프로젝트라 아이 같은 3인 + 역할 3분할(가운데 리더 / 왼쪽
  // 기획·디자인 / 오른쪽 개발), 쿨 페리윙클 팔레트로 차별화. 1830×1014
  roleImage: cochatAboutRole,
  demoHeadline: "캡스톤 발표에서 선보인 메신저 연동·선별·요약 시연",
  demoBody:
    "여러 메신저를 한 앱에 모으고, AI가 취향에 맞는 메시지만 골라 요약해 알려줍니다. 이 과정을 캡스톤 디자인 발표 영상에 담았습니다.",
  demoVideo: cochatDemoVideo,
  demoPoster: cochatDemoPoster,
  githubUrl: "https://github.com/oznwoo/cochat-frontend",
  problem: [
    {
      title: "메신저의 다양화",
      body: "SMS·카카오톡만 쓰던 시절과 달리, 지금은 인스타그램 DM·텔레그램·슬랙·이메일 등 소통 수단이 지나치게 많아졌습니다. 세대와 성향에 따라 주로 쓰는 메신저가 갈리면서, 상대가 어느 채널을 보는지 몰라 메시지가 닿지 않는 일이 잦아졌습니다.",
      shortBody: [
        "소통 수단이 **지나치게 많아짐**",
        "세대·성향에 따라 **쓰는 메신저가 갈림**",
        "상대가 **어느 채널을 보는지 모름**",
      ],
      icon: "duplicate",
      tags: ["채널파편화", "세대별단절"],
      // CoChat for Business problem-scattered와 같은 3D 클레이 계열이되, 아이 같은
      // 클레이 캐릭터 + 쿨 페리윙클 팔레트 + B2C 소셜 메신저 아이콘으로 차별화
      image: cochatProblemScattered,
    },
    {
      title: "우선순위 부재",
      body: "흩어진 알림을 한곳에 모으기만 하면, 이번엔 알림 양이 감당하기 어려울 만큼 늘어납니다. 쏟아지는 알림 속에서 정작 중요한 메시지는 묻히고, 무엇이 급한지는 사람마다 기준이 달라 단순히 모으는 것만으로는 우선순위를 가릴 수 없습니다.",
      shortBody: [
        "메신저를 통합만 하면 **알림이 폭증함**",
        "쏟아지는 알림에 **중요한 메시지가 묻힘**",
        "급한 기준은 사람마다 달라 **우선순위를 못 가림**",
      ],
      icon: "alert",
      tags: ["정보과부하", "기준제각각"],
      // 돋보기로 쏟아지는 알림 속 중요한 메시지를 찾는 장면 — 페리윙클 팔레트
      image: cochatProblemPriority,
    },
    {
      title: "내용 파악 부담",
      body: "알림을 받아도 결국 메시지를 하나하나 열어 전체를 읽어야 무슨 일인지 알 수 있습니다. 확인할 메시지가 줄어도, 매번 전문을 훑는 일 자체가 계속 부담으로 남습니다.",
      shortBody: [
        "알림이 와도 **메시지를 다 열어 읽어야 함**",
        "핵심만 **빠르게 파악하기 어려움**",
        "확인할 때마다 **읽는 시간·피로가 쌓임**",
      ],
      icon: "trend-down",
      tags: ["확인부담", "읽기피로"],
      // 긴 텍스트 두루마리를 붙잡고 다 읽어야 하는 장면으로 "내용 파악 부담"을
      // 표현 — 페리윙클 클레이
      image: cochatProblemContent,
    },
  ],
  solution: [
    {
      title: "여러 메신저와 계정을 한 앱으로 통합",
      body: "사용자가 고른 메신저에 안전하게 연결해 계정과 메시지를 불러옵니다. 한 서비스에 같은 사람이 여러 계정을 두고 있어도 자동으로 찾아, 놓치고 있던 계정까지 한 화면에 모아 줍니다.",
      comparison: {
        before: [
          {
            title: "메신저마다 따로 확인",
            detail: [
              "채널이 갈려 **앱을 계속 오가야 함**",
              "쓰는 메신저가 달라 **소통이 끊김**",
            ],
          },
          {
            title: "계정이 흩어져 있음",
            detail: [
              "한 서비스에 여러 계정이 흩어짐",
              "안 보던 계정의 메시지를 **놓침**",
            ],
          },
        ],
        after: [
          {
            title: "선택한 메신저를 한 곳에 연결",
            detail: [
              "고른 메신저에 **안전하게 연결**해 계정·메시지를 불러옴",
              "채널 상관없이 **한 화면에서 확인**",
            ],
          },
          {
            title: "흩어진 계정까지 자동 검색",
            detail: [
              "같은 서비스의 **여러 계정을 한 번에** 탐색",
              "놓치던 계정도 **빠짐없이 통합**",
            ],
          },
        ],
      },
      // 온보딩 플로우 — 로그인 → 메신저 선택 → 받을 알림 유형 선택 → 계정 연동 완료.
      // 실제 앱(Android) 스크린샷에서 에뮬레이터 크롬을 걷어내고 화면만 크롭
      images: [
        cochatSolutionFlow1,
        cochatSolutionFlow2,
        cochatSolutionFlow3,
        cochatSolutionFlow4,
      ],
      icon: "layers",
    },
    {
      title: "AI가 나에게 중요한 메시지만 선별",
      body: "로그인할 때 받고 싶은 알림 종류(마감·결제·공지 등)를 고르면 그걸 ‘나만의 관심사’로 삼습니다. 새 메시지가 오면 내용이 관심사와 얼마나 가까운지 따져 가까운 것만 알림으로 보냅니다. 이때 ‘플젝’ 같은 은어나 ‘어제 그거’처럼 앞 대화를 알아야 하는 표현은 예전 대화·자료를 찾아(RAG) 문맥을 채운 뒤 판단해, 잘못 걸러내는 일을 줄였습니다.",
      comparison: {
        before: [
          {
            title: "모든 알림이 같은 무게로 도착",
            detail: [
              "쏟아지는 알림 사이에 **중요한 게 묻힘**",
              "급한 기준은 **사람마다 다름**",
            ],
          },
          {
            title: "은어·앞 대화를 놓쳐 잘못 걸러냄",
            detail: [
              "줄임말·은어는 **뜻을 제대로 못 읽음**",
              "앞 대화를 몰라 **엉뚱하게 해석**",
            ],
          },
        ],
        after: [
          {
            title: "내 관심사와 비교해 선별",
            detail: [
              "받고 싶은 알림 종류로 **관심사를 정해 둠**",
              "메시지가 **관심사와 가까우면 알림**",
            ],
          },
          {
            title: "RAG로 문맥까지 채워 판단",
            detail: [
              "은어는 **뜻을 풀고**, 앞 대화는 **예전 대화·자료로 보충**",
              "문맥을 채운 뒤 비교해 **정확도를 높임**",
            ],
          },
        ],
      },
      // 문맥 보정 파이프라인 인포그래픽 한 장 — 위: LLM 단독(잘못 보정) /
      // 아래: 웹 검색·지난 기록으로 문맥 보완(제대로 보정)을 상하로 비교.
      // 다른 탭 이미지와 같은 높이(최대 260px)로 표시한다.
      image: cochatSolutionContextCompare,
      icon: "sparkle",
    },
    {
      title: "핵심만 요약해서 알림",
      body: "알림을 보내기로 정해진 메시지는 LLM이 핵심만 짧게 요약합니다. 요약이 푸시 알림에 함께 표시돼, 메시지를 열지 않고도 무슨 일인지 바로 알 수 있습니다.",
      comparison: {
        before: [
          {
            title: "내용을 다 읽어야 파악",
            detail: [
              "중요한 메시지도 **전문을 열어 읽어야 함**",
              "핵심만 **빠르게 못 봄**",
            ],
          },
          {
            title: "확인할 때마다 시간이 듦",
            detail: [
              "알림이 와도 **매번 앱을 열어 확인**",
              "쌓일수록 **읽는 부담이 커짐**",
            ],
          },
        ],
        after: [
          {
            title: "LLM이 메시지를 요약",
            detail: [
              "알림 보낼 메시지를 **핵심만 짧게 정리**",
              "긴 내용도 **한눈에 들어옴**",
            ],
          },
          {
            title: "알림에서 바로 핵심 확인",
            detail: [
              "요약이 **푸시 알림에 함께 표시**",
              "열어보지 않아도 **무슨 일인지 파악**",
            ],
          },
        ],
      },
      // 요약 푸시 알림 예시 — 실제 앱 화면에서 알림 배너만 확대 크롭(상태바·
      // 아이콘 일부는 남겨 폰임을 인지). 메일(마감 공지)·문자(요금 명세) 두 컷을
      // 화살표 없이 부채꼴로 겹쳐 보여준다.
      images: [cochatSolutionSummary1, cochatSolutionSummary2],
      imagesShowArrows: false,
      imagesOverlap: true,
      icon: "filter",
    },
  ],
  outcome: [
    {
      stat: "논문 1편",
      label: "KIPS 정보처리학회 학술대회 발표 (제1저자)",
      icon: "sparkle",
    },
    { stat: "5인", label: "팀 대표·PM로 기획·계정 연동·서버 담당", icon: "layers" },
    { stat: "→ B2B", label: "CoChat for Business로 이어짐", icon: "target" },
  ],
  outcomeGallery: [
    {
      title: "메신저의 다양화 → 해결",
      body: "",
      shortBody: [
        "여러 메신저의 메시지를 **한 앱에서 모아 봄**",
        "같은 서비스에 흩어진 계정도 **자동으로 찾아 연결**",
        "채널이 갈려도 **놓치는 메시지 없이 확인**",
      ],
      tags: ["메신저통합", "계정자동검색"],
      image: cochatOutcomeScattered,
    },
    {
      title: "우선순위 부재 → 해결",
      body: "",
      shortBody: [
        "받고 싶은 알림 종류로 만든 **관심사로 걸러냄**",
        "쏟아지는 알림 중 **중요한 것만 통과**",
        "은어·앞 대화는 **RAG로 문맥을 채워 판단**",
      ],
      tags: ["관심사선별", "문맥보완"],
      image: cochatOutcomePriority,
    },
    {
      title: "내용 파악 부담 → 해결",
      body: "",
      shortBody: [
        "알림 보낼 메시지를 **LLM이 핵심만 요약**",
        "요약이 **푸시 알림에 함께 표시**",
        "메시지를 **열지 않아도 무슨 일인지 파악**",
      ],
      tags: ["핵심요약", "즉시파악"],
      image: cochatOutcomeContent,
    },
  ],
  tech: [
    { category: "App", items: ["React Native", "TypeScript"] },
    { category: "Backend", items: ["FastAPI", "Python", "PostgreSQL"] },
    {
      category: "AI",
      items: [
        "GPT-4o-mini",
        "RAG",
        "sentence-transformers",
        "Cosine Similarity",
      ],
    },
    { category: "Auth", items: ["OAuth 2.0"] },
  ],
  // KIPS 학술대회에 발표한 시스템 설계도 — 카테고리 목록 대신 이 다이어그램만 표시
  stackDiagram: cochatStackArchitecture,
  stackDiagramNote:
    "KIPS 정보처리학회 학술대회에서 발표한 CoChat 시스템 설계도입니다. 메신저 계정을 연동해 메시지를 모으고(계정 관리자) → 은어·앞 대화의 문맥을 RAG로 보완해 벡터로 바꾼 뒤 → 사용자 관심사와 비교해 중요·사소를 나누고 → 중요한 메시지는 LLM으로 요약해 전달하는 흐름을 담았습니다.",
}
