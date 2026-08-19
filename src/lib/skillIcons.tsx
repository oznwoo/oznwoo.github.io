import {
  siPython,
  siTypescript,
  siJavascript,
  siDart,
  siReact,
  siNextdotjs,
  siFlutter,
  siTailwindcss,
  siFastapi,
  siNodedotjs,
  siPostgresql,
} from "simple-icons"

// 브랜드 로고가 있는 기술만 실제 심볼을 사용 — currentColor로 렌더링해
// 부모가 지정한 색(기본 회색, hover 시 브랜드 블루)을 그대로 물려받는다.
const SKILL_ICON_PATHS: Record<string, string> = {
  Python: siPython.path,
  TypeScript: siTypescript.path,
  JavaScript: siJavascript.path,
  Dart: siDart.path,
  React: siReact.path,
  "Next.js": siNextdotjs.path,
  Flutter: siFlutter.path,
  "Tailwind CSS": siTailwindcss.path,
  FastAPI: siFastapi.path,
  "Node.js": siNodedotjs.path,
  PostgreSQL: siPostgresql.path,
}

// 브랜드 로고가 없는 개념/기법형 항목은 실제 로고를 지어내지 않고
// 모노스페이스 이니셜로 대체한다.
const SKILL_INITIALS: Record<string, string> = {
  "REST API": "API",
  "LLM Integration": "LLM",
  "예측 모델링": "PM",
  "SHAP / LIME": "SL",
  RAG: "RAG",
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
