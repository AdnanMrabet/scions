'use client';

import { useEffect, useState } from 'react';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number;
  style?: React.CSSProperties;
}

export function Skeleton({ width = '100%', height = 16, radius = 12, style }: SkeletonProps) {
  return (
    <span
      className="skeleton"
      aria-hidden
      style={{ display: 'block', width, height, borderRadius: radius, ...style }}
    />
  );
}

// A clay card placeholder while the menagerie loads.
export function ScionCardSkeleton() {
  return (
    <div className="clay-sm" style={{ padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Skeleton width={56} height={56} radius={16} />
        <div style={{ flex: 1 }}>
          <Skeleton width="70%" height={18} />
          <div style={{ height: 8 }} />
          <Skeleton width="45%" height={12} />
        </div>
      </div>
      <div style={{ height: 16 }} />
      <Skeleton width="100%" height={12} />
      <div style={{ height: 8 }} />
      <Skeleton width="85%" height={12} />
    </div>
  );
}

// Shows a gentle note when a load runs longer than expected.
export function SlowNote({ active }: { active: boolean }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!active) {
      setShow(false);
      return;
    }
    const t = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(t);
  }, [active]);

  if (!show) return null;
  return (
    <p style={{ marginTop: 14, fontSize: 13, color: 'var(--ink-muted)', textAlign: 'center' }}>
      Still reaching the lineage. Bradbury can take a breath on a cold read.
    </p>
  );
}
