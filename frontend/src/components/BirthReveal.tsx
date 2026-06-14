'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import type { Scion } from '@/lib/contract';
import { elementStyle, outcomeStyle, vigorColor } from '@/lib/format';
import { VoxelCreature } from './VoxelCreature';

interface BirthRevealProps {
  child: Scion | null;
  parentA: Scion | null;
  parentB: Scion | null;
  onClose: () => void;
}

function ParentChip({ scion, label }: { scion: Scion | null; label: string }) {
  if (!scion) {
    return (
      <div style={{ textAlign: 'center', opacity: 0.7 }}>
        <div className="clay-sunk" style={{ width: 52, height: 52, borderRadius: 16, display: 'grid', placeItems: 'center', margin: '0 auto' }}>
          <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>?</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 6 }}>{label}</div>
      </div>
    );
  }
  const es = elementStyle(scion.element);
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: 52, height: 52, borderRadius: 16, background: es.soft, display: 'grid', placeItems: 'center', margin: '0 auto' }}>
        <VoxelCreature element={scion.element} power={scion.power} seed={scion.id} size={42} />
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--ink-mid)', marginTop: 6, maxWidth: 80, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginInline: 'auto' }} title={scion.name}>
        {scion.name}
      </div>
      <div className="font-mono" style={{ fontSize: 10, color: 'var(--ink-muted)' }}>{scion.id}</div>
    </div>
  );
}

export function BirthReveal({ child, parentA, parentB, onClose }: BirthRevealProps) {
  const open = !!child;
  const es = child ? elementStyle(child.element) : null;
  const os = child ? outcomeStyle(child.outcome) : null;

  return (
    <AnimatePresence>
      {open && child && es && os ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${child.name} has hatched`}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="modal-overlay"
          style={overlayStyle}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="clay modal-card"
            style={{ textAlign: 'center' }}
          >
            <button onClick={onClose} aria-label="Close" className="btn-ghost btn-pressed focusable" style={closeBtnStyle}>
              <X size={18} aria-hidden />
            </button>

            <p className="eyebrow" style={{ color: os.ink }}>
              {os.label} . a new scion hatched
            </p>

            {/* the bouncy birth */}
            <motion.div
              initial={{ scale: 0.2, rotate: -12 }}
              animate={{ scale: [0.2, 1.18, 1], rotate: [-12, 6, 0] }}
              transition={{ type: 'spring', stiffness: 220, damping: 12, delay: 0.05 }}
              style={{
                margin: '14px auto 0',
                width: 168,
                height: 168,
                borderRadius: 36,
                background: es.soft,
                boxShadow: 'var(--shadow-inset)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <VoxelCreature element={child.element} power={child.power} seed={child.id} size={130} animated />
            </motion.div>

            <h2 className="font-display" style={{ marginTop: 16, fontSize: 32 }}>
              {child.name}
            </h2>

            <div style={{ marginTop: 12, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <span className="pill" style={{ background: es.soft, color: es.ink }}>
                <span className="dot" style={{ background: es.hue }} aria-hidden /> {es.label}
              </span>
              <span className="pill" style={{ background: 'var(--surface-sunk)', color: 'var(--ink-mid)' }}>
                Gen {child.generation}
              </span>
              <span className="pill" style={{ background: 'var(--surface-sunk)', color: 'var(--ink-mid)' }}>
                Power {child.power}
              </span>
              <span className="pill" style={{ background: 'var(--surface-sunk)', color: vigorColor(child.vigor) }}>
                Vigor {child.vigor}
              </span>
            </div>

            <p style={{ margin: '14px auto 0', maxWidth: 380, fontSize: 14, color: 'var(--ink-mid)', lineHeight: 1.6 }}>
              {os.blurb} The traits above were derived from its parents and the ruled outcome.
            </p>

            {/* descent: child links up to both parents */}
            <div className="clay-sunk" style={{ marginTop: 20, padding: '18px 14px' }}>
              <p className="eyebrow" style={{ marginBottom: 12 }}>
                Its descent
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28 }}>
                <ParentChip scion={parentA} label="Parent A" />
                <ParentChip scion={parentB} label="Parent B" />
              </div>
              <svg width="100%" height="36" viewBox="0 0 200 36" preserveAspectRatio="none" aria-hidden style={{ display: 'block', marginTop: 4 }}>
                <path d="M60 0 C 60 20, 100 16, 100 34" fill="none" stroke={es.hue} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
                <path d="M140 0 C 140 20, 100 16, 100 34" fill="none" stroke={es.hue} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
              </svg>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span className="pill" style={{ background: es.soft, color: es.ink }}>
                  <Sparkles size={12} aria-hidden /> {child.name} . {child.id}
                </span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="btn btn-primary btn-pressed focusable"
              onClick={onClose}
              style={{ marginTop: 22 }}
            >
              See it in the tree
            </motion.button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 110,
  background: 'rgba(58,58,82,0.5)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const closeBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: 14,
  right: 14,
  border: 'none',
  padding: 8,
  borderRadius: 999,
  color: 'var(--ink-muted)',
  minHeight: 'auto',
  background: 'transparent',
  boxShadow: 'none',
  cursor: 'pointer',
};
