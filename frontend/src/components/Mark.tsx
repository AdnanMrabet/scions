'use client';

interface MarkProps {
  size?: number;
}

// A chunky voxel sigil: stacked clay cubes forming an "S" stair, the Scions mark.
export function Mark({ size = 38 }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="Scions"
    >
      <defs>
        <linearGradient id="mark-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#bdb2ff" />
          <stop offset="1" stopColor="#a0c4ff" />
        </linearGradient>
        <linearGradient id="mark-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffc2e2" />
          <stop offset="1" stopColor="#ffb4a2" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="15" height="15" rx="5" fill="url(#mark-a)" />
      <rect x="27" y="6" width="15" height="15" rx="5" fill="url(#mark-b)" opacity="0.92" />
      <rect x="16" y="17" width="15" height="15" rx="5" fill="#ffe29a" />
      <rect x="6" y="28" width="15" height="15" rx="5" fill="url(#mark-b)" />
      <rect x="27" y="28" width="15" height="15" rx="5" fill="url(#mark-a)" opacity="0.92" />
    </svg>
  );
}
