import { Page } from "@/components/layout/Page"
import { StatusTicker } from "@/components/ui/StatusTicker"

export function PageHome() {
  return (
    <Page>
      <div className="flex flex-col gap-8">
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-xs text-[#0C0F1A]/45 tracking-[0.04em] uppercase"
        >
          Developer
        </span>
        <h1
          style={{ fontFamily: "var(--font-display)", lineHeight: 1.15 }}
          className="text-[clamp(2.1rem,9vw,6.5rem)] font-light tracking-tight text-[#0C0F1A]"
        >
          <span>아이디어를</span>
          <br />
          <span className="font-semibold">현실로 만듭니다.</span>
        </h1>
        <div className="border-t border-[#0C0F1A]/10 pt-7 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <p
            style={{ fontFamily: "var(--font-body)" }}
            className="max-w-sm text-[#0C0F1A]/65 text-base leading-loose font-normal"
          >
            오진우
          </p>
          <div className="flex items-center gap-4 sm:gap-8 shrink-0 flex-wrap">
            {[
              { label: "GitHub", href: "https://github.com/oznwoo" },
              { label: "RESUME", href: "/documents/resume.pdf" },
              { label: "Email", href: "mailto:luvmoire@gmail.com" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs text-[#0C0F1A]/45 hover:text-[#0C0F1A] transition-colors uppercase tracking-[0.02em]"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#4F6EF7] animate-pulse shrink-0" />
          <StatusTicker />
        </div>
      </div>
    </Page>
  )
}
