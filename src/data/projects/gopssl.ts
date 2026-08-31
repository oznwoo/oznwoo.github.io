import gopsslLogo from "@/imports/gopssl-logo.png"
import gopsslAboutHero from "@/imports/gopssl/gopssl-about-hero.webp"
import gopsslAboutRole from "@/imports/gopssl/gopssl-about-role.webp"
import gopsslProblemFit from "@/imports/gopssl/gopssl-problem-fit.webp"
import gopsslProblemLedger from "@/imports/gopssl/gopssl-problem-ledger.webp"
import gopsslProblemInsight from "@/imports/gopssl/gopssl-problem-insight.webp"
import gopsslOutcomeFit from "@/imports/gopssl/gopssl-outcome-fit.webp"
import gopsslOutcomeLedger from "@/imports/gopssl/gopssl-outcome-ledger.webp"
import gopsslOutcomeInsight from "@/imports/gopssl/gopssl-outcome-insight.webp"
import gopsslSolutionHome from "@/imports/gopssl/gopssl-solution-home.webp"
import gopsslSolutionSettings from "@/imports/gopssl/gopssl-solution-settings.webp"
import gopsslSolutionFigmaDesign from "@/imports/gopssl/gopssl-solution-figma-design.webp"
import gopsslSolutionCustomerList from "@/imports/gopssl/gopssl-solution-customer-list.webp"
import gopsslSolutionSaleAdd from "@/imports/gopssl/gopssl-solution-sale-add.webp"
import gopsslSolutionCustomerCard from "@/imports/gopssl/gopssl-solution-customer-card.webp"
import gopsslSolutionRevenue from "@/imports/gopssl/gopssl-solution-revenue.webp"
import gopsslStackArchitecture from "@/imports/gopssl/gopssl-stack-architecture.webp"
import type { ProjectDetail } from "./types"

export const gopsslDetail: ProjectDetail = {
  period: "2025.06 – 진행 중",
  role: "기획 | 디자인 | 풀스택 개발 (개인 프로젝트)",
  logoSrc: gopsslLogo,
  // 히어로 곳곳에 고정 배치된 미용 도구(가위·바리깡·손거울·스프레이·드라이기·고데기)가 호버 시 도구별로 움직임
  heroEffect: "salon-tools",
  overviewHeadline:
    "예약제 없이 운영되는 소규모 미용실을 위한 고객·매출 관리 앱.",
  overviewBody:
    "어머니의 미용실이 수기로 장부를 관리하는 것을 보고 직접 기획했습니다. UI/UX 설계부터 React Native 앱 개발, 백엔드 서버 배포까지 전 과정을 혼자 진행했습니다.",
  aboutImage: gopsslAboutHero,
  roleHeadline:
    "개인 프로젝트로 [기획] [디자인] [모바일 풀스택 개발] [배포]를 모두 담당",
  roleBody:
    "어머니의 미용실 운영을 곁에서 지켜보며 꼭 필요한 기능만 추렸고, 화면 설계와 앱·서버 개발, 배포를 이어서 진행했습니다.",
  roleImage: gopsslAboutRole,
  demoHeadline: "고객 카드 등록부터 매출 입력, 월별 대시보드 확인까지",
  demoBody:
    "고객을 카드로 관리하고 시술 뒤 몇 번의 탭으로 매출을 기록하는 흐름을 시연 영상으로 담을 예정입니다.",
  githubUrl: "https://github.com/oznwoo/gopssl-frontend",
  problem: [
    {
      title: "맞춤 서비스 부재",
      body: "시중의 미용실 관리 솔루션은 예약제로 운영하는 매장에 맞춰 설계돼 있고, 이용하려면 매달 구독료를 내야 했습니다. 예약 없이 워크인으로 운영하는 작은 미용실에 맞는 선택지는 없었습니다.",
      shortBody: [
        "대부분 **예약제 매장 전용**으로 설계",
        "워크인 매장엔 **맞는 선택지가 없음**",
        "이용하려면 **매달 구독료** 부담",
      ],
      icon: "alert",
      tags: ["예약제전용", "구독료"],
      image: gopsslProblemFit,
    },
    {
      title: "수기 장부 관리",
      body: "고객별 방문 이력과 시술·결제 내역을 종이 장부로 관리하다 보니 기록 실수가 잦고, 지난 기록을 찾는 것도 번거로웠습니다.",
      shortBody: [
        "방문 이력·시술·결제 내역을 **종이에 기록**",
        "옮겨 적다 **누락·오기**가 잦음",
        "지난 기록을 **찾기 번거로움**",
      ],
      icon: "duplicate",
      tags: ["수기관리", "기록실수"],
      image: gopsslProblemLedger,
    },
    {
      title: "경영 현황 파악 어려움",
      body: "월 매출을 월말에 일일이 합산해야 해서 시간이 오래 걸리고 계산 실수도 있었으며, 전월 대비 추세나 현금·카드 비율처럼 운영에 필요한 정보를 한눈에 보기 어려웠습니다.",
      shortBody: [
        "월 매출을 **월말에 일일이 합산**",
        "합산에 **시간 소요·계산 실수**",
        "추세·결제 비율 등 **운영 데이터 부재**",
      ],
      icon: "trend-down",
      tags: ["집계시간", "데이터부재"],
      image: gopsslProblemInsight,
    },
  ],
  solution: [
    {
      title: "워크인 미용실에 맞춘 단순한 앱",
      body: "예약 기능을 걷어내고 고객·시술·매출에 꼭 필요한 화면만 직접 설계했고, 실사용자(어머니) 피드백을 반영해 반복 개선했습니다. 무료 인프라로 운영해 매달 나가는 구독료도 없습니다.",
      images: [
        gopsslSolutionHome,
        gopsslSolutionSettings,
        gopsslSolutionFigmaDesign,
      ],
      imagesShowArrows: false,
      imagesOverlap: true,
      comparison: {
        before: [
          {
            title: "예약제 매장 전용 설계",
            detail: [
              "예약 없이 운영하는 **워크인 매장엔 안 맞음**",
              "안 쓰는 예약 기능이 **화면을 채움**",
            ],
          },
          {
            title: "매달 구독료 부담",
            detail: ["이용하려면 **월 구독료** 필요", "작은 매장엔 **비용 부담**"],
          },
        ],
        after: [
          {
            title: "워크인 매장 전용으로 직접 설계",
            detail: [
              "고객·시술·매출 **꼭 필요한 화면만**",
              "예약 관련 기능은 **아예 제거**",
            ],
          },
          {
            title: "매달 나가는 비용 없음",
            detail: [
              "직접 만들어 **월 구독료 0원**",
              "서버도 **무료 티어로 운영비 0원**",
            ],
          },
        ],
      },
      icon: "filter",
    },
    {
      title: "고객 카드로 정보 통합",
      body: "고객별 방문 이력과 시술·결제 내역을 카드 한 장에 모아 저장하고, 이름 검색이나 초성 정렬로 빠르게 찾습니다. 방문 횟수도 함께 표시돼 단골을 한눈에 알 수 있습니다.",
      images: [
        gopsslSolutionCustomerList,
        gopsslSolutionSaleAdd,
        gopsslSolutionCustomerCard,
      ],
      imagesShowArrows: false,
      imagesOverlap: true,
      comparison: {
        before: [
          {
            title: "정보가 종이에 흩어짐",
            detail: [
              "방문 이력·시술·결제 내역을 **종이 장부에 기록**",
              "지난 기록을 **뒤져서 찾음**",
            ],
          },
          {
            title: "찾기도 파악도 어려움",
            detail: ["옮겨 적다 **누락·오기**", "누가 단골인지 **감으로 파악**"],
          },
        ],
        after: [
          {
            title: "고객 카드 한 장에 통합",
            detail: [
              "방문 이력·시술·결제 내역을 **한 곳에 저장**",
              "지난 방문도 **바로 조회**",
            ],
          },
          {
            title: "찾기 쉽고 단골이 보임",
            detail: [
              "**이름 검색·초성 정렬**로 바로 찾기",
              "고객마다 **방문 횟수 표시**",
            ],
          },
        ],
      },
      icon: "layers",
    },
    {
      title: "매출 자동 집계와 월별 대시보드",
      body: "시술 항목을 미리 등록해두고 탭 몇 번으로 매출을 기록하면, 일별·월별 매출과 현금·카드 비율, 전월 대비 증감이 자동으로 대시보드에 집계됩니다. 실사용자 피드백을 반영해 입력 흐름을 여러 차례 다듬었습니다.",
      image: gopsslSolutionRevenue,
      comparison: {
        before: [
          {
            title: "매출을 손으로 합산",
            detail: [
              "수기 기록을 **월말에 일일이 더함**",
              "**계산 실수** 위험",
            ],
          },
          {
            title: "운영에 필요한 데이터가 없음",
            detail: ["매출 추세·구성을 **알 수 없음**", "판단할 근거가 부족"],
          },
        ],
        after: [
          {
            title: "탭 몇 번으로 매출 기록",
            detail: [
              "시술 항목을 **미리 등록**해두고 선택만",
              "기록과 동시에 **자동 집계**",
            ],
          },
          {
            title: "월별 대시보드로 현황 파악",
            detail: [
              "일별·월별 매출을 **그래프·평균선**으로 확인",
              "**현금·카드 비율**과 **전월 대비 증감**까지",
            ],
          },
        ],
      },
      icon: "sparkle",
    },
  ],
  outcome: [
    { stat: "약 350명", label: "실사용 누적 등록 고객" },
    { stat: "100%", label: "단독 설계·개발" },
    { stat: "0원", label: "월 운영비 (무료 티어)" },
  ],
  outcomeGallery: [
    {
      title: "맞춤 서비스 부재 → 해결",
      body: "",
      shortBody: [
        "예약 없이 **워크인으로 운영하는 매장** 전용으로 설계",
        "고객·시술·매출 **꼭 필요한 화면만** 남김",
        "직접 만들어 **매달 나가는 구독료 없음**",
      ],
      tags: ["워크인전용", "구독료없음"],
      image: gopsslOutcomeFit,
    },
    {
      title: "수기 장부 관리 → 해결",
      body: "",
      shortBody: [
        "방문 이력·시술·결제 내역을 **고객 카드 한 장에 통합**",
        "**이름 검색·초성 정렬**로 바로 찾기",
        "실사용 중 **누적 약 350명** 등록·관리",
      ],
      tags: ["고객카드", "빠른검색"],
      image: gopsslOutcomeLedger,
    },
    {
      title: "경영 현황 파악 어려움 → 해결",
      body: "",
      shortBody: [
        "탭 몇 번 입력으로 **매출 자동 집계**",
        "일별·월별 매출을 **그래프·평균선**으로 확인",
        "**현금·카드 비율**과 **전월 대비 증감**까지",
      ],
      tags: ["자동집계", "매출대시보드"],
      image: gopsslOutcomeInsight,
    },
  ],
  tech: [
    {
      category: "App",
      items: ["React Native", "Expo", "TypeScript", "Redux Toolkit"],
    },
    { category: "Backend", items: ["FastAPI", "Python", "SQLAlchemy", "JWT"] },
    { category: "Database", items: ["PostgreSQL"] },
    { category: "Infra", items: ["Oracle Cloud (OCI)"] },
    { category: "External", items: ["카카오 로컬 API"] },
  ],
  stackDiagram: gopsslStackArchitecture,
}
