'use client';

import { motion } from 'framer-motion';
import { Boxes, GitBranch, Palette } from 'lucide-react';
import type { Stats } from '@/lib/contract';
import { formatInt } from '@/lib/format';

interface StatsBandProps {
  stats: Stats | null;
  loading: boolean;
}

const spring = { type: 'spring', stiffness: 260, damping: 22 } as const;

interface Tile {
  key: keyof Stats;
  label: string;
  caption: string;
  hue: string;
  icon: typeof Boxes;
}

const TILES: Tile[] = [
  { key: 'scions', label: 'Scions', caption: 'creatures alive in the menagerie', hue: 'var(--lilac)', icon: Boxes },
  { key: 'broods', label: 'Broods', caption: 'crosses ruled under consensus', hue: 'var(--coral)', icon: GitBranch },
  { key: 'elements', label: 'Elements', caption: 'distinct elemental lines in play', hue: 'var(--periwinkle)', icon: Palette },
];

// Three chunky clay stat tiles in their own horizontal band, distinct from the
// nursery band above and the tree below.
export function StatsBand({ stats, loading }: StatsBandProps) {
  return (
    <section aria-label="Lineage at a glance" style={{ padding: '8px 0 18px' }}>
      <div className="shell">
        <div className="stats-band">
          {TILES.map((t, i) => {
            const Icon = t.icon;
            const value = stats ? stats[t.key] : 0;
            return (
              <motion.div
                key={t.key}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ ...spring, delay: i * 0.06 }}
                className="clay stat-tile"
                style={{ padding: '24px 22px', display: 'flex', alignItems: 'center', gap: 18 }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 18,
                    background: t.hue,
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    boxShadow: '-3px -3px 8px rgba(255,255,255,0.7), 3px 3px 8px rgba(159,168,200,0.4)',
                  }}
                >
                  <Icon size={26} color="#2c2c46" />
                </span>
                <div style={{ minWidth: 0 }}>
                  <div
                    className="font-display"
                    style={{ fontSize: 'clamp(30px, 5vw, 44px)', fontWeight: 700, lineHeight: 1 }}
                  >
                    {loading && !stats ? '...' : formatInt(value)}
                  </div>
                  <div style={{ marginTop: 6, fontWeight: 700, color: 'var(--ink-mid)' }}>{t.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>{t.caption}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        .stats-band {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 820px) {
          .stats-band { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
