import { CONTACT_EMAIL } from "@/lib/constants";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="rounded-[2.5rem] bg-navy px-8 py-20 text-center text-paper sm:px-16">
        <h2 id="contact-heading" className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          같이 일해볼까요?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-paper/70">
          2026년 하반기 채용, 언제든 편하게 연락 주세요.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-10 inline-flex items-center justify-center rounded-full bg-coral px-8 py-3.5 font-medium text-paper transition-colors duration-normal hover:bg-coral/85"
        >
          이메일 보내기
        </a>
      </div>
    </section>
  );
}
