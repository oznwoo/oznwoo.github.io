// EXP_COLS 각 컬럼의 항목 하나 — 이력/활동/수상 타임라인에서 공통으로 쓴다
export type TimelineEntry = {
  name: string
  sub: string
  date: string
  link?: string
}

export const CORE_SKILLS = [
  "Python",
  "TypeScript",
  "React",
  "Next.js",
  "FastAPI",
  "PostgreSQL",
  "Claude Code",
]

export const EXP_COLS = [
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

// RESUME 섹션 헤더(EDUCATION/ACTIVITIES/SKILLS/CERTIFICATIONS) 색 —
// 좌측 네비게이터의 현재 선택 dot과 같은 메인 컬러로 통일한다.
export const RESUME_HEADER_COLOR = "#4F6EF7"
