'use client';

import { motion } from 'framer-motion';
import { GitBranch, Sparkles, Zap } from 'lucide-react';
import type { Scion } from '@/lib/contract';
import { elementStyle, outcomeStyle, shortAddress, vigorColor } from '@/lib/format';
import { VoxelCreature } from './VoxelCreature';
import { Copyable } from './Copyable';

interface ScionCardProps {
  scion: Scion;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (scion: Scion) => void;
  highlight?: boolean;
}

// Trait pips: a chunky voxel row that fills to represent power (0-100ish).
function PowerPips({ power, hue }: { power: number; hue: string }) {
  const total = 5;
  const filled = Math.max(1, Math.min(total, Math.round((power / 100) * total)));
  return (
    <span style={{ display: 'inline-flex', gap: 4 }} aria-label={`Power ${power}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: 4,
            background: i < filled ? hue : 'var(--surface-sunk)',
            boxShadow: i < filled ? 'none' : 'var(--shadow-inset)',
          }}
        />
      ))}
    </span>
  );
}

export function ScionCard({ scion, selectable, selected, onSelect, highlight }: ScionCardProps) {
  const es = elementStyle(scion.element);
  const os = outcomeStyle(scion.outcome);
  const isPrimordial = scion.generation === 0;

  const interactive = selectable && onSelect;

  const inner = (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: es.soft,
            boxShadow: 'var(--shadow-inset)',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <VoxelCreature element={scion.element} power={scion.power} seed={scion.id} size={52} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: 19, lineHeight: 1.15, wordBreak: 'break-word' }}>{scion.name}</h3>
          </div>
          <div
            style={{
              marginTop: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            <span
              className="pill"
              style={{ background: es.soft, color: es.ink }}
            >
              <span className="dot" style={{ background: es.hue }} aria-hidden />
              {es.label}
            </span>
            <span
              className="pill"
              style={{ background: 'var(--surface-sunk)', color: 'var(--ink-mid)' }}
            >
              <GitBranch size={12} aria-hidden /> Gen {scion.generation}
            </span>
            <span className="font-mono" style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
              {scion.id}
            </span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-mid)', fontWeight: 600 }}>
          <Zap size={14} color={es.hue} aria-hidden /> Power {scion.power}
        </span>
        <PowerPips power={scion.power} hue={es.hue} />
      </div>

      <div style={{ marginTop: 14 }}>
        <span
          className="pill"
          style={{ background: 'transparent', color: os.ink, padding: 0, fontSize: 12 }}
        >
          <Sparkles size={13} color={os.hue} aria-hidden />
          {os.label}
        </span>
        {!isPrimordial ? (
          <div style={{ marginTop: 9 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-muted)', marginBottom: 5 }}>
              <span>Vigor</span>
              <span className="font-mono" style={{ color: vigorColor(scion.vigor) }}>{scion.vigor}</span>
            </div>
            <div className="clay-sunk" style={{ height: 10, borderRadius: 999, overflow: 'hidden', padding: 0 }}>
              <div
                style={{
                  width: `${Math.max(4, Math.min(100, scion.vigor))}%`,
                  height: '100%',
                  borderRadius: 999,
                  background: vigorColor(scion.vigor),
                }}
              />
            </div>
          </div>
        ) : (
          <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.5 }}>
            {os.blurb}
          </p>
        )}
      </div>

      <div className="divider" style={{ margin: '14px 0' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', fontSize: 12 }}>
        {!isPrimordial ? (
          <span style={{ color: 'var(--ink-muted)' }}>
            from{' '}
            <span className="font-mono" style={{ color: 'var(--ink-mid)' }}>
              {scion.parent_a}
            </span>{' '}
            +{' '}
            <span className="font-mono" style={{ color: 'var(--ink-mid)' }}>
              {scion.parent_b}
            </span>
          </span>
        ) : (
          <span style={{ color: 'var(--ink-muted)' }}>conjured from a seed</span>
        )}
        <span style={{ color: 'var(--ink-muted)' }}>
          by{' '}
          <Copyable
            value={scion.breeder}
            display={shortAddress(scion.breeder)}
            label="Copy breeder address"
          />
        </span>
      </div>

      {interactive ? (
        <div
          aria-hidden
          style={{
            marginTop: 14,
            textAlign: 'center',
            fontSize: 13,
            fontWeight: 700,
            color: selected ? es.ink : 'var(--ink-muted)',
          }}
        >
          {selected ? 'Chosen for the cross' : 'Tap to choose'}
        </div>
      ) : null}
    </>
  );

  if (interactive) {
    return (
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        onClick={() => onSelect?.(scion)}
        aria-pressed={selected}
        className="clay-sm focusable"
        style={{
          padding: 18,
          textAlign: 'left',
          cursor: 'pointer',
          border: selected ? `2px solid ${es.hue}` : '1px solid rgba(255,255,255,0.5)',
          width: '100%',
        }}
      >
        {inner}
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={highlight ? { scale: 0.8, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="clay-sm"
      style={{
        padding: 18,
        border: highlight ? `2px solid ${es.hue}` : '1px solid rgba(255,255,255,0.5)',
      }}
    >
      {inner}
    </motion.div>
  );
}
