type InkDividerProps = {
  className?: string;
};

export function InkDivider({ className }: InkDividerProps) {
  return (
    <div className={`w-full overflow-hidden ${className ?? ""}`} aria-hidden="true">
      <svg
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className="h-6 w-full text-ink/15"
      >
        <path
          d="M0 20 C 100 0, 200 40, 300 20 S 500 0, 600 20 S 800 40, 900 20 S 1100 0, 1200 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
