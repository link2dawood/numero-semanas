type IconProps = {
  className?: string;
};

// Country flag icons as SVG components
export function FlagFinland({ className = "size-5" }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 18" className={className}>
      <rect width="24" height="18" fill="#fff" />
      <rect x="6" y="0" width="4" height="18" fill="#003580" />
      <rect x="0" y="7" width="24" height="4" fill="#003580" />
    </svg>
  );
}

export function FlagNetherlands({ className = "size-5" }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 18" className={className}>
      <rect width="24" height="6" fill="#AE1C28" />
      <rect y="6" width="24" height="6" fill="#fff" />
      <rect y="12" width="24" height="6" fill="#21468B" />
    </svg>
  );
}

export function ArrowRightIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function ArrowLeftIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}
