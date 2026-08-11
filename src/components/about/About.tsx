const TECH_STACK = [
  "Next.js",
  "FastAPI",
  "PostgreSQL / Prisma",
  "AWS Bedrock",
  "React Native",
  "Python / ML",
  "Claude Code",
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <span className="font-display text-sm font-semibold tracking-[0.2em] text-teal">
        ABOUT
      </span>
      <h2 id="about-heading" className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        사람 개발자, AI 도구를 다루다
      </h2>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-paper2 p-8">
          <h3 className="font-display text-2xl font-semibold">Human-first</h3>
          <p className="mt-4 leading-relaxed text-ink/70">
            기획과 설계, 그리고 최종 판단은 언제나 사람의 몫입니다. Claude
            Code는 손을 빠르게 움직여주는 도구일 뿐, 무엇을 만들지와 왜
            만드는지는 제가 직접 결정합니다.
          </p>
        </div>

        <div className="rounded-3xl bg-paper2 p-8">
          <h3 className="font-display text-2xl font-semibold">
            공감에서 시작하는 개발
          </h3>
          <p className="mt-4 leading-relaxed text-ink/70">
            Gopssl은 가족이 겪던 미용실 운영의 불편함에서, CoChat은 여러
            메신저를 오가며 쌓이는 피로감에서, Fintag의 SHAP 설명 기능은
            비개발자인 대표님도 이해할 수 있어야 한다는 문제의식에서
            출발했습니다.
          </p>
        </div>
      </div>

      <ul className="mt-10 flex flex-wrap gap-3">
        {TECH_STACK.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-ink/15 bg-paper px-4 py-2 text-sm font-medium text-ink/80"
          >
            {tech}
          </li>
        ))}
      </ul>
    </section>
  );
}
