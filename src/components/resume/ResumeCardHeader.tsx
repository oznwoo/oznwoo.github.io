export function ResumeCardHeader({
  label,
  color,
}: {
  label: string
  color: string
}) {
  return (
    <div
      style={{ fontFamily: "var(--font-mono)", color }}
      className="mb-2 text-[11px] font-semibold uppercase tracking-[0.04em] opacity-85 sm:mb-3 sm:text-sm md:mb-4 md:text-base"
    >
      {label}
    </div>
  )
}
