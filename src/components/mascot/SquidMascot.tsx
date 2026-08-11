type SquidMascotProps = {
  className?: string;
};

export function SquidMascot({ className }: SquidMascotProps) {
  return (
    <svg
      viewBox="0 0 240 220"
      role="img"
      aria-label="오징어 마스코트"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="120" cy="82" rx="58" ry="46" />

      <circle cx="99" cy="76" r="6" fill="currentColor" stroke="none" />
      <circle cx="141" cy="76" r="6" fill="currentColor" stroke="none" />

      <path d="M60 118 C 52 148, 66 168, 54 196" />
      <path d="M84 126 C 80 156, 96 174, 86 204" />
      <path d="M104 130 C 102 160, 114 180, 108 208" />
      <path d="M136 130 C 138 160, 126 180, 132 208" />
      <path d="M156 126 C 160 156, 144 174, 154 204" />
      <path d="M180 118 C 188 148, 174 168, 186 196" />
    </svg>
  );
}
