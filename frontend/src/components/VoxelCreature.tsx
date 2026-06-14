'use client';

import { useMemo } from 'react';
import { elementStyle } from '@/lib/format';
import type { Element } from '@/lib/contract';

interface VoxelCreatureProps {
  element: Element;
  power?: number;
  seed?: string;
  size?: number;
  animated?: boolean;
  title?: string;
}

// Tiny deterministic hash so every scion grows the same body from its seed.
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

// A chunky clay voxel creature drawn from soft rounded cubes. The element drives
// hue, power drives how many crest spikes it grows, and the seed shuffles its face.
export function VoxelCreature({
  element,
  power = 50,
  seed = 'gen',
  size = 120,
  animated = false,
  title,
}: VoxelCreatureProps) {
  const es = elementStyle(element);
  const h = useMemo(() => hash(`${seed}:${element}`), [seed, element]);

  const eyeOffset = (h % 3) - 1; // -1, 0, 1
  const mouthCurve = ((h >> 3) % 3) - 1;
  const crest = Math.max(1, Math.min(4, Math.round(power / 22)));
  const blush = (h >> 5) % 2 === 0;

  const accent = es.hue;
  const ink = es.ink;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      role="img"
      aria-label={title ?? `${es.label} clay voxel creature`}
      className={animated ? 'bob' : undefined}
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={`body-${h}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.18" stopColor={accent} />
          <stop offset="1" stopColor={accent} stopOpacity="0.82" />
        </linearGradient>
        <filter id={`soft-${h}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="3" dy="4" stdDeviation="3" floodColor={ink} floodOpacity="0.22" />
        </filter>
      </defs>

      {/* shadow puddle */}
      <ellipse cx="60" cy="108" rx="30" ry="6" fill={ink} opacity="0.14" />

      {/* crest cubes (grow with power) */}
      {Array.from({ length: crest }).map((_, i) => {
        const cx = 60 + (i - (crest - 1) / 2) * 16;
        return (
          <rect
            key={i}
            x={cx - 6}
            y={16 - (i % 2) * 4}
            width="12"
            height="12"
            rx="4"
            fill={accent}
            opacity="0.9"
          />
        );
      })}

      {/* feet */}
      <rect x="36" y="86" width="18" height="16" rx="6" fill={accent} opacity="0.92" />
      <rect x="66" y="86" width="18" height="16" rx="6" fill={accent} opacity="0.92" />

      {/* body cube */}
      <rect
        x="28"
        y="34"
        width="64"
        height="58"
        rx="20"
        fill={`url(#body-${h})`}
        filter={`url(#soft-${h})`}
      />

      {/* belly panel */}
      <rect x="44" y="58" width="32" height="28" rx="12" fill="#ffffff" opacity="0.5" />

      {/* eyes */}
      <circle cx={48 + eyeOffset} cy="54" r="6" fill={ink} />
      <circle cx={72 + eyeOffset} cy="54" r="6" fill={ink} />
      <circle cx={50 + eyeOffset} cy="52" r="2" fill="#ffffff" />
      <circle cx={74 + eyeOffset} cy="52" r="2" fill="#ffffff" />

      {/* blush */}
      {blush ? (
        <>
          <circle cx="40" cy="66" r="4" fill="#ff9bb0" opacity="0.55" />
          <circle cx="80" cy="66" r="4" fill="#ff9bb0" opacity="0.55" />
        </>
      ) : null}

      {/* mouth */}
      <path
        d={
          mouthCurve > 0
            ? 'M52 72 Q60 80 68 72'
            : mouthCurve < 0
              ? 'M52 76 Q60 70 68 76'
              : 'M53 74 L67 74'
        }
        stroke={ink}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
