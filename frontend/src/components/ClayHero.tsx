'use client';

import { motion } from 'framer-motion';
import { Sparkles, FlaskConical, ArrowDown } from 'lucide-react';
import type { Stats } from '@/lib/contract';
import { formatInt } from '@/lib/format';
import { VoxelCreature } from './VoxelCreature';

interface ClayHeroProps {
  stats: Stats | null;
  loading: boolean;
  onConjure: () => void;
  onBreed: () => void;
  canBreed: boolean;
}

const spring = { type: 'spring', stiffness: 300, damping: 22 } as const;

export function ClayHero({ stats, loading, onConjure, onBreed, canBreed }: ClayHeroProps) {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      style={{
        position: 'relative',
        minHeight: 'calc(100svh - 70px)',
        display: 'flex',
        alignItems: 'center',
        padding: '48px 0',
      }}
    >
      <div
        className="shell"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.95fr)',
          gap: 40,
          alignItems: 'center',
        }}
      >
        {/* copy column */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="hero-copy"
        >
          <span className="chip" style={{ color: 'var(--ink-mid)' }}>
            <Sparkles size={14} color="var(--lilac)" aria-hidden />
            On-chain AI breeding lineage
          </span>

          <h1
            id="hero-title"
            style={{
              marginTop: 20,
              fontSize: 'clamp(40px, 6.4vw, 76px)',
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
            }}
          >
            Conjure clay creatures.
            <br />
            Breed a living tree.
          </h1>

          <p
            style={{
              marginTop: 20,
              fontSize: 'clamp(16px, 2vw, 19px)',
              color: 'var(--ink-mid)',
              lineHeight: 1.6,
              maxWidth: 540,
            }}
          >
            Spin up primordials from a seed, then cross any two. An on-chain AI Geneticist rules
            each pairing under validator consensus, deciding the outcome and naming the child, while
            the genealogy branches out for everyone.
          </p>

          <div style={{ marginTop: 30, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="btn btn-primary btn-pressed"
              onClick={onConjure}
              style={{ fontSize: 16, padding: '15px 28px' }}
            >
              <Sparkles size={18} aria-hidden />
              Conjure or breed
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="btn btn-coral btn-pressed"
              onClick={onBreed}
              disabled={!canBreed}
              title={canBreed ? undefined : 'Conjure two primordials first'}
              style={{ fontSize: 16, padding: '15px 28px' }}
            >
              <FlaskConical size={18} aria-hidden />
              Breed a pair
            </motion.button>
          </div>

          {/* live chips */}
          <div style={{ marginTop: 30, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <span className="chip">
              <span className="dot" style={{ background: 'var(--mint)' }} aria-hidden /> Bradbury
              Testnet
            </span>
            <span className="chip">
              <span className="dot" style={{ background: 'var(--periwinkle)' }} aria-hidden />
              {loading && !stats ? '...' : formatInt(stats?.scions ?? 0)} scions
            </span>
            <span className="chip">
              <span className="dot" style={{ background: 'var(--coral)' }} aria-hidden />
              {loading && !stats ? '...' : formatInt(stats?.broods ?? 0)} broods
            </span>
          </div>
        </motion.div>

        {/* clay scene column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, delay: 0.08 }}
          className="hero-scene clay"
          style={{
            position: 'relative',
            padding: 28,
            borderRadius: 'var(--radius-xl)',
            minHeight: 420,
            display: 'grid',
            placeItems: 'center',
            overflow: 'hidden',
          }}
        >
          {/* soft clay backdrop blobs */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              width: 240,
              height: 240,
              borderRadius: '40% 60% 55% 45%',
              background: 'radial-gradient(circle at 35% 30%, rgba(189,178,255,0.5), rgba(160,196,255,0.3))',
              top: 24,
              left: 30,
              filter: 'blur(2px)',
            }}
          />
          <div
            aria-hidden
            style={{
              position: 'absolute',
              width: 180,
              height: 180,
              borderRadius: '55% 45% 50% 50%',
              background: 'radial-gradient(circle at 60% 40%, rgba(255,194,226,0.5), rgba(255,180,162,0.3))',
              bottom: 30,
              right: 26,
              filter: 'blur(2px)',
            }}
          />

          {/* the star: a big bouncy voxel creature */}
          <div style={{ position: 'relative', zIndex: 1 }} className="bob">
            <VoxelCreature element="SHADE" power={88} seed="hero-star" size={260} title="The lineage's first scion" />
          </div>

          {/* little companions */}
          <div style={{ position: 'absolute', bottom: 26, left: 30, zIndex: 1 }}>
            <VoxelCreature element="BLOOM" power={48} seed="hero-pal-1" size={78} />
          </div>
          <div style={{ position: 'absolute', top: 34, right: 30, zIndex: 1 }}>
            <VoxelCreature element="SPARK" power={64} seed="hero-pal-2" size={68} />
          </div>
        </motion.div>
      </div>

      <a
        href="#how"
        aria-label="Scroll to how it works"
        className="scroll-cue"
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: 18,
          color: 'var(--ink-muted)',
        }}
      >
        <ArrowDown size={22} aria-hidden className="bob" />
      </a>

      <style>{`
        @media (max-width: 880px) {
          .hero-copy { text-align: center; }
          .hero-copy .chip, .hero-copy h1, .hero-copy p { margin-left: auto; margin-right: auto; }
          #top .shell { grid-template-columns: 1fr; }
          .hero-scene { order: -1; min-height: 340px; }
          .hero-copy > div { justify-content: center; }
        }
        @media (max-width: 880px) { .scroll-cue { display: none; } }
      `}</style>
    </section>
  );
}
