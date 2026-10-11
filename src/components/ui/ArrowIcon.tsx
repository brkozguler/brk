/** Carousel ok ikonu — 1rem yüksek, ince çizgi, currentColor */
export function ArrowIcon({ direction }: { direction: 'prev' | 'next' }) {
  return (
    <svg
      viewBox="0 0 14 10"
      fill="none"
      aria-hidden="true"
      style={direction === 'prev' ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path d="M8.5 1 13 5l-4.5 4M13 5H1" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
    </svg>
  );
}
