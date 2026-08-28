import gopsslLogo from "@/imports/gopssl-logo.png"
import gopsslAboutHero from "@/imports/gopssl/gopssl-about-hero.webp"
import gopsslStackArchitecture from "@/imports/gopssl/gopssl-stack-architecture.webp"
import type { ProjectDetail } from "./types"

export const gopsslDetail: ProjectDetail = {
  period: "2025.06 – 진행 중",
  role: "기획 | 디자인 | 풀스택 개발 (개인 프로젝트)",
  logoSrc: gopsslLogo,
  overviewHeadline:
    "예약제 없이 운영되는 소규모 미용실을 위한 고객·매출 관리 앱.",
  overviewBody:
    "어머니의 미용실이 수기로 장부를 관리하는 것을 보고 직접 기획했습니다. UI/UX 설계부터 React Native 앱 개발, 백엔드 서버 배포까지 전 과정을 혼자 진행했습니다.",
  aboutImage: gopsslAboutHero,
  roleHeadline:
    "기획부터 디자인, React Native 앱 개발, 백엔드 서버 배포까지 전 과정 단독 진행",
  roleBody:
    "어머니의 미용실 운영 방식을 직접 관찰하며 요구사항을 정의했고, **UI/UX 설계**와 **React Native 프론트엔드**, **FastAPI 백엔드**, **OCI 서버 배포**까지 혼자 맡았습니다.",
  demoHeadline: "고객 카드 등록부터 매출 입력, 대시보드 확인까지의 흐름",
  demoBody:
    "고객 정보를 카드로 저장하고 시술 후 몇 번의 탭으로 매출을 기록해 월별 대시보드에서 확인하는 과정을 시연 영상으로 담을 예정입니다.",
  githubUrl: "https://github.com/oznwoo/gopssl-frontend",
  problem: [
    {
      title: "맞춤 서비스 부재",
      body: "시중의 미용실 관리 솔루션은 대부분 예약 시스템 중심이라, 예약 없이 워크인으로 운영하는 소규모 미용실에는 안 쓰는 기능이 많고 설정도 복잡했습니다.",
      shortBody: [
        "기존 솔루션은 **예약 시스템 중심**",
        "워크인 매장엔 **안 쓰는 기능**이 대부분",
        "설정·사용법이 **복잡함**",
      ],
      icon: "alert",
      tags: ["예약중심", "과한기능"],
    },
    {
      title: "수기 장부 관리",
      body: "고객별 방문 이력, 선호 시술, 미수금을 종이 장부로 관리하다 보니 기록 실수가 잦고, 지난 기록을 찾는 것도 번거로웠습니다.",
      shortBody: [
        "방문 이력·선호 시술·미수금을 **종이에 기록**",
        "옮겨 적다 **누락·오기**가 잦음",
        "지난 기록을 **찾기 번거로움**",
      ],
      icon: "duplicate",
      tags: ["수기관리", "기록실수"],
    },
    {
      title: "경영 현황 파악 어려움",
      body: "월 매출을 월말에 일일이 합산해야 해서 시간이 오래 걸리고 계산 실수도 있었으며, 시술 종류별 비중처럼 운영에 필요한 정보를 알기 어려웠습니다.",
      shortBody: [
        "월 매출을 **월말에 일일이 합산**",
        "합산에 **시간 소요·계산 실수**",
        "시술 비중 등 **운영 데이터 부재**",
      ],
      icon: "trend-down",
      tags: ["집계시간", "데이터부재"],
    },
  ],
  solution: [
    {
      title: "워크인 미용실에 맞춘 단순한 앱",
      body: "예약 기능을 걷어내고 고객·시술·매출 관리에 꼭 필요한 화면만 남겼습니다. 실사용자(어머니)가 설명 없이 바로 쓸 수 있는 수준을 목표로 UI/UX를 설계했습니다.",
      comparison: {
        before: [
          {
            title: "예약 중심의 복잡한 솔루션",
            detail: [
              "안 쓰는 예약·직원 관리 기능이 **화면을 채움**",
              "무엇부터 봐야 할지 **한눈에 안 들어옴**",
            ],
          },
          {
            title: "설정·학습 비용이 큼",
            detail: ["쓰기 전에 **설정할 게 많음**", "익히는 데 시간이 듦"],
          },
        ],
        after: [
          {
            title: "필요한 기능만 남긴 화면",
            detail: [
              "고객·시술·매출 **3가지에 집중**",
              "예약 관련 기능은 **아예 제거**",
            ],
          },
          {
            title: "설명 없이 바로 쓰는 UX",
            detail: [
              "실사용자가 **바로 이해**하는 수준으로 설계",
              "피드백을 반영해 **반복 개선**",
            ],
          },
        ],
      },
      icon: "filter",
    },
    {
      title: "고객 카드로 정보 통합",
      body: "고객별 방문 이력, 시술 내용, 결제·미수금을 카드 한 장에 모아 저장하고 검색할 수 있게 했습니다. 자주 오는 고객은 즐겨찾기로 빠르게 찾습니다.",
      comparison: {
        before: [
          {
            title: "정보가 종이에 흩어짐",
            detail: [
              "방문 이력·선호 시술·미수금을 **종이 장부에 기록**",
              "지난 기록을 **뒤져서 찾음**",
            ],
          },
          {
            title: "기록 실수가 잦음",
            detail: ["옮겨 적다 **누락·오기**", "미수금을 **놓치기 쉬움**"],
          },
        ],
        after: [
          {
            title: "고객 카드 한 장에 통합",
            detail: [
              "방문 이력·시술·결제·미수금을 **한 곳에 저장**",
              "이름으로 **바로 검색**, 단골은 **즐겨찾기**",
            ],
          },
          {
            title: "미수금까지 한눈에",
            detail: [
              "미결제 내역을 **카드에 표시**",
              "다음 방문 때 **바로 확인**",
            ],
          },
        ],
      },
      icon: "layers",
    },
    {
      title: "매출 자동 집계와 월별 대시보드",
      body: "시술 항목을 미리 등록해두고 탭 몇 번으로 매출을 기록하면, 일별·월별 매출과 시술 종류별 비중이 자동으로 대시보드에 집계됩니다. 실사용자 피드백을 반영해 입력 흐름을 여러 차례 다듬었습니다.",
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
            detail: ["시술 비중·추세를 **알 수 없음**", "판단할 근거가 부족"],
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
              "일별·월별 매출을 **그래프로 확인**",
              "시술 종류별 **비중까지 시각화**",
            ],
          },
        ],
      },
      icon: "sparkle",
    },
  ],
  outcome: [
    { stat: "실사용", label: "2025년 8월 ~ 현재" },
    { stat: "100%", label: "단독 설계·개발" },
    { stat: "0원", label: "인프라 비용 (무료 티어)" },
  ],
  outcomeGallery: [
    {
      title: "맞춤 서비스 부재 → 해결",
      body: "",
      shortBody: [
        "예약 기능을 뺀 **워크인 매장 전용 앱**",
        "고객·시술·매출 **3가지에 집중한 화면**",
        "실사용자가 **설명 없이 바로 사용**",
      ],
      tags: ["워크인전용", "간편UX"],
    },
    {
      title: "수기 장부 관리 → 해결",
      body: "",
      shortBody: [
        "방문 이력·시술·미수금을 **고객 카드 한 장에 통합**",
        "이름으로 **바로 검색**, 단골은 즐겨찾기",
        "미수금을 **카드에서 바로 확인**",
      ],
      tags: ["고객카드", "미수금관리"],
    },
    {
      title: "경영 현황 파악 어려움 → 해결",
      body: "",
      shortBody: [
        "탭 몇 번 입력으로 **매출 자동 집계**",
        "일별·월별 매출을 **대시보드로 확인**",
        "시술 종류별 **비중까지 시각화**",
      ],
      tags: ["자동집계", "매출대시보드"],
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
