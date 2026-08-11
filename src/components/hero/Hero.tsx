import { SquidMascot } from "@/components/mascot/SquidMascot";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 py-24 md:grid-cols-2 md:py-32"
    >
      <div>
        <span className="inline-flex items-center rounded-full border border-ink/15 bg-paper2 px-4 py-1.5 text-sm font-medium tracking-wide text-ink/70">
          FULLSTACK DEVELOPER · 2026 신입 개발자
        </span>

        <h1
          id="hero-heading"
          className="mt-6 font-display text-5xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-6xl"
        >
          코드를 쓰는 건 사람,
          <br />
          속도를 내는 건 <em className="font-medium italic text-coral">AI</em>.
        </h1>

        <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/70">
          한양대 ERICA 컴퓨터공학과를 졸업하고, 핀테크 스타트업에서 백엔드·ML
          인턴으로 경력을 쌓았습니다. Claude Code를 도구로 쓰는 인간
          개발자입니다 — 판단과 설계는 사람의 몫으로 남겨둡니다.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#projects"
            className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3.5 font-medium text-paper transition-colors duration-normal hover:bg-coral"
          >
            프로젝트 보기
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full border border-ink/20 px-7 py-3.5 font-medium text-ink transition-colors duration-normal hover:border-ink hover:bg-ink hover:text-paper"
          >
            연락하기
          </a>
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <div
          aria-hidden="true"
          className="absolute h-72 w-72 rounded-[42%_58%_65%_35%/45%_45%_55%_55%] bg-coral/15 blur-2xl sm:h-96 sm:w-96"
        />
        <div
          aria-hidden="true"
          className="absolute h-56 w-56 translate-x-10 translate-y-6 rounded-[58%_42%_35%_65%/55%_65%_35%_45%] bg-navy/10 blur-2xl sm:h-72 sm:w-72"
        />
        <SquidMascot className="relative h-64 w-64 animate-float text-ink sm:h-80 sm:w-80" />
      </div>
    </section>
  );
}
