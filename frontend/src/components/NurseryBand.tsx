'use client';

import { motion } from 'framer-motion';
import { Sparkles, FlaskConical } from 'lucide-react';
import type { Scion, Stats } from '@/lib/contract';
import { elementStyle, formatInt } from '@/lib/format';
import { VoxelCreature } from './VoxelCreature';

interface NurseryBandProps {
  stats: Stats | null;
  scions: Scion[];
  loading: boolean;
  onConjure: () => void;
  onBreed: () => void;
  canBreed: boolean;
}

const spring = { type: 'spring', stiffness: 300, damping: 22 } as const;

// A COMPACT opening band, not a tall marketing hero. Live data and the primary
// actions sit right at the top, with the latest hatchlings shown inline beside
// a single bouncy clay creature.
export function NurseryBand({ stats, scions, loading, onConjure, onBreed, canBreed }: NurseryBandProps) {
  const latest = scions.slice(0, 4);

  return (
    <section
      id="top"
      aria-labelledby="nursery-title"
      style={{ padding: '34px 0 26px' }}
    >
      <div className="shell">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="clay nursery-band"
          style={{
            padding: 26,
            display: 'grid',
            gridTemplateColumns: 'auto minmax(0, 1fr)',
            gap: 28,
            alignItems: 'center',
          }}
        >
          {/* the living scene: one bouncy creature on a soft clay pad */}
          <div
            className="nursery-scene clay-sunk"
            style={{
              position: 'relative',
              width: 188,
              height: 188,
              borderRadius: 28,
              display: 'grid',
              placeItems: 'center',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <div
              aria-hidden
              style={{
                position: 'absolute',
                width: 150,
                height: 150,
                borderRadius: '46% 54% 52% 48%',
                background:
                  'radial-gradient(circle at 38% 32%, rgba(189,178,255,0.45), rgba(160,196,255,0.25))',
                filter: 'blur(2px)',
              }}
            />
            <div className="bob" style={{ position: 'relative', zIndex: 1 }}>
              <VoxelCreature element="BLOOM" power={70} seed="nursery-star" size={150} title="A scion stirring in the nursery" />
            </div>
          </div>

          {/* title, actions, and the latest hatchlings, all inline */}
          <div style={{ minWidth: 0 }}>
            <span className="chip" style={{ color: 'var(--ink-mid)' }}>
              <span className="dot" style={{ background: 'var(--mint)' }} aria-hidden />
              The living nursery
            </span>

            <h1
              id="nursery-title"
              style={{
                marginTop: 14,
                fontSize: 'clamp(28px, 4.4vw, 44px)',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
              }}
            >
              Conjure a primordial, then breed the tree
            </h1>

            <div style={{ marginTop: 18, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                className="btn btn-primary btn-pressed focusable"
                onClick={onConjure}
                style={{ fontSize: 15, padding: '13px 24px' }}
              >
                <Sparkles size={17} aria-hidden />
                Conjure a scion
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                className="btn btn-coral btn-pressed focusable"
                onClick={onBreed}
                disabled={!canBreed}
                title={canBreed ? undefined : 'Conjure two primordials first'}
                style={{ fontSize: 15, padding: '13px 24px' }}
              >
                <FlaskConical size={17} aria-hidden />
                Breed a pair
              </motion.button>
              <span className="chip">
                <span className="dot" style={{ background: 'var(--periwinkle)' }} aria-hidden />
                {loading && !stats ? '...' : formatInt(stats?.scions ?? 0)} in the menagerie
              </span>
            </div>

            {/* latest hatchlings, shown right here at the top */}
            <div style={{ marginTop: 22 }}>
              <p className="eyebrow" style={{ marginBottom: 10 }}>
                Latest hatchlings
              </p>
              {loading && latest.length === 0 ? (
                <div style={{ display: 'flex', gap: 12 }}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="skeleton" style={{ width: 76, height: 92, borderRadius: 18 }} />
                  ))}
                </div>
              ) : latest.length === 0 ? (
                <p style={{ color: 'var(--ink-muted)', fontSize: 14, margin: 0 }}>
                  No scions yet. Conjure the first to wake the nursery.
                </p>
              ) : (
                <div className="hatchling-row">
                  {latest.map((s) => {
                    const es = elementStyle(s.element);
                    return (
                      <div
                        key={s.id}
                        className="clay-sm hatchling"
                        title={`${s.name} - ${es.label}`}
                        style={{ padding: '12px 10px 10px', textAlign: 'center', width: 88 }}
                      >
                        <div style={{ display: 'grid', placeItems: 'center' }}>
                          <VoxelCreature element={s.element} power={s.power} seed={s.id} size={52} />
                        </div>
                        <div
                          style={{
                            marginTop: 6,
                            fontSize: 12,
                            fontWeight: 700,
                            color: 'var(--ink-mid)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {s.name}
                        </div>
                        <div style={{ fontSize: 11, color: es.ink }}>{es.label}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .hatchling-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        @media (max-width: 760px) {
          .nursery-band { grid-template-columns: 1fr !important; justify-items: center; text-align: center; }
          .nursery-band .chip, .nursery-band h1 { margin-left: auto; margin-right: auto; }
          .nursery-band > div:last-child > div { justify-content: center; }
          .hatchling-row { justify-content: center; }
        }
      `}</style>
    </section>
  );
}
