export function TimelineItem({
  item,
}: {
  item: { name: string; sub: string; date: string; link?: string }
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-1.5">
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.name} 증명서 PDF 열기`}
              className="shrink-0 self-center -m-2 p-2 text-[#0C0F1A]/30 transition-colors duration-150 hover:text-[#4F6EF7]"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="sm:w-3 sm:h-3"
              >
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </a>
          )}
          <div
            style={{ fontFamily: "var(--font-nanum)", fontWeight: 700 }}
            className="text-[11px] leading-snug text-[#0C0F1A] sm:text-[12px] md:text-[13px]"
          >
            {item.name}
          </div>
        </div>
        <div
          style={{ fontFamily: "var(--font-mono)" }}
          className="shrink-0 whitespace-nowrap text-[9px] text-[#0C0F1A]/30 sm:text-[10px]"
        >
          {item.date}
        </div>
      </div>
      <div
        style={{ fontFamily: "var(--font-body)" }}
        className="text-[10px] font-light leading-snug text-[#0C0F1A]/40 sm:text-[11px] sm:leading-relaxed"
      >
        {item.sub}
      </div>
    </div>
  )
}
