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
      body: "메신저별로 흩어진 알림을 한곳에 모으기만 하면, 이번엔 알림 양이 감당하기 어려울 만큼 늘어나 중요한 메시지가 그 사이에 묻힙니다. 게다가 무엇이 급한지는 사람마다 기준이 달라, 단순히 모으는 것만으로는 우선순위를 가리기 어렵고 오히려 내용을 파악하기 더 힘들어집니다.",
      shortBody: [
        "메신저 통합만 하면 **알림 양이 너무 많아짐**",
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
      body: "중요한 메시지라도 전체 내용을 다 읽어야 무슨 일인지 알 수 있었습니다. ‘플젝’ 같은 은어나 앞선 대화를 알아야 이해되는 말은 뜻을 잘못 읽기도 쉬웠습니다.",
      shortBody: [
        "핵심을 알려면 **내용을 다 읽어야 함**",
        "은어·줄임말은 **뜻이 헷갈림**",
        "앞 대화를 모르면 **의미를 오해**",
      ],
      icon: "trend-down",
      tags: ["확인부담", "문맥오해"],
      // for Business("업무 집중 불가")와 달리 CoChat 고유 문제라 새 장면 —
      // 긴 텍스트 두루마리를 다 읽어야 하고, 은어 말풍선엔 물음표, 앞 대화가
      // 빠진 끊긴 말풍선 체인으로 "내용 파악 부담"을 표현
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
      body: "로그인할 때 받고 싶은 알림 종류(마감·결제·공지 등)를 고르면, 그걸 기준으로 ‘나만의 관심사’를 만들어 둡니다. 새 메시지가 오면 그 내용이 내 관심사와 얼마나 가까운지 따져, 충분히 가까우면 알림을 보냅니다. 이때 ‘플젝’ 같은 은어는 AI가 뜻을 풀어 주고, ‘어제 그거’처럼 앞 대화를 알아야 하는 말은 예전 대화·자료를 찾아 맥락을 채운 뒤 비교해 오해를 줄였고, 읽음·관심 반응을 반영해 관심사를 계속 다듬습니다.",
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
            title: "은어·문맥을 놓쳐 잘못 판단",
            detail: [
              "줄임말은 **의미를 제대로 못 읽음**",
              "앞 대화를 몰라 **엉뚱하게 해석**",
            ],
          },
        ],
        after: [
          {
            title: "내 관심사와 비교해 선별",
            detail: [
              "받고 싶은 알림 종류로 **나만의 관심사를 정해 둠**",
              "메시지가 **관심사와 가까우면 알림**",
            ],
          },
          {
            title: "은어·앞 대화까지 이해해서 판단",
            detail: [
              "은어는 **AI가 뜻을 풀고**, 앞 대화는 **예전 대화를 찾아 보충**",
              "읽음·관심 반응으로 **관심사가 계속 학습**",
            ],
          },
        ],
      },
      icon: "sparkle",
    },
    {
      title: "핵심만 요약해서 알림",
      body: "중요하다고 분류된 메시지는 다시 한 번 AI가 사용자가 정한 키워드·주제에 맞는 내용만 뽑아 요약합니다. 요약이 알림에 함께 떠서, 메시지를 열어보지 않아도 무슨 일인지 바로 파악할 수 있습니다.",
      comparison: {
        before: [
          {
            title: "내용을 다 읽어야 파악",
            detail: [
              "중요한 메시지도 **전문을 읽어야 함**",
              "핵심만 **빠르게 못 봄**",
            ],
          },
          {
            title: "모아두면 오히려 부담",
            detail: [
              "여러 메신저를 모을수록 **읽을 게 많아짐**",
              "확인에 시간이 계속 듦",
            ],
          },
        ],
        after: [
          {
            title: "키워드·주제에 맞춰 요약",
            detail: [
              "내 관심사에 해당하는 부분만 **선별 요약**",
              "불필요한 내용은 걸러냄",
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
        "받고 싶은 알림 종류로 만든 **‘나만의 관심사’로 걸러냄**",
        "쏟아지는 알림 중 **중요한 것만 통과**, 나머지는 모아둠",
        "훑어볼 양이 줄어 **확인 시간이 단축**",
      ],
      tags: ["관심사선별", "중요알림만"],
      image: cochatOutcomePriority,
    },
    {
      title: "내용 파악 부담 → 해결",
      body: "",
      shortBody: [
        "긴 메시지도 **CoChat이 핵심만 요약**해 전달",
        "은어·예전 대화는 **AI가 알아서 맥락을 보충**",
        "요약이 **알림에 함께 떠서**, 안 열어봐도 파악",
      ],
      tags: ["핵심요약", "맥락보충"],
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
}
