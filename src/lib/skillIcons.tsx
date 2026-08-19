import {
  siPython,
  siTypescript,
  siJavascript,
  siReact,
  siNextdotjs,
  siTailwindcss,
  siFastapi,
  siNodedotjs,
  siPostgresql,
  siMysql,
  siClaudecode,
  siGooglegemini,
} from "simple-icons"

// 브랜드 로고가 있는 기술만 실제 심볼을 사용 — currentColor로 렌더링해
// 부모가 지정한 색(기본 회색, hover 시 브랜드 블루)을 그대로 물려받는다.
const SKILL_ICON_PATHS: Record<string, string> = {
  Python: siPython.path,
  TypeScript: siTypescript.path,
  JavaScript: siJavascript.path,
  React: siReact.path,
  "Next.js": siNextdotjs.path,
  "Tailwind CSS": siTailwindcss.path,
  FastAPI: siFastapi.path,
  "Node.js": siNodedotjs.path,
  PostgreSQL: siPostgresql.path,
  MySQL: siMysql.path,
  "Claude Code": siClaudecode.path,
  Gemini: siGooglegemini.path,
}

// 브랜드 로고가 없는 항목은 실제 로고를 지어내지 않고 모노스페이스
// 이니셜로 대체한다 (simple-icons에 React Native·GPT 전용 로고 없음).
const SKILL_INITIALS: Record<string, string> = {
  "React Native": "RN",
  GPT: "GPT",
}

export function SkillIcon({ name }: { name: string }) {
  const path = SKILL_ICON_PATHS[name]

  if (path) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d={path} />
      </svg>
    )
  }

  const initials = SKILL_INITIALS[name] ?? name.slice(0, 2).toUpperCase()
  return (
    <span
      style={{ fontFamily: "var(--font-mono)" }}
      className="text-[9px] leading-none tracking-tight"
    >
      {initials}
    </span>
  )
}
