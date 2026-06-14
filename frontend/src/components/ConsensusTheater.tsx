'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ExternalLink, Loader2, X } from 'lucide-react';
import type { TxState } from '@/hooks/useTransaction';
import { EXPLORER } from '@/lib/contract';
import { outcomeStyle, shortAddress, vigorColor } from '@/lib/format';
import { VoxelCreature } from './VoxelCreature';

interface ConsensusTheaterProps {
  state: TxState;
  onClose: () => void;
}

interface Step {
  key: string;
  label: string;
  caption: string;
}

const STEPS: Step[] = [
  { key: 'submitted', label: 'Cross submitted', caption: 'Your pairing is on chain.' },
  { key: 'reading', label: 'Geneticist reading', caption: 'A leader validator judges the cross and names the child.' },
  { key: 'rerun', label: 'Validators re-running', caption: 'The network re-runs the read and agrees on the outcome.' },
  { key: 'sealing', label: 'Sealing the brood', caption: 'The child is written into the lineage for everyone.' },
];

function stageIndex(state: TxState): number {
  if (state.phase === 'submitted') return 0;
  if (state.phase === 'confirmed') return STEPS.length;
  const s = state.liveStatus;
  if (state.draft) {
    if (s === 'REVEALING' || s === 'COMMITTING') return 3;
    return 2;
  }
  if (s === 'PROPOSING' || s === 'COMMITTING' || s === 'REVEALING') return 2;
  return 1;
}

function rotating(status: string): boolean {
  return status === 'LEADER_TIMEOUT' || status === 'VALIDATORS_TIMEOUT';
}

export function ConsensusTheater({ state, onClose }: ConsensusTheaterProps) {
  // The page shows BirthReveal on confirmed, so the theater covers in-flight and error.
  const open = state.phase === 'submitted' || state.phase === 'consensus' || state.phase === 'error';
  const errored = state.phase === 'error';
  const active = stageIndex(state);
  const draft = state.draft;
  const os = draft ? outcomeStyle(draft.outcome) : null;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="The Geneticist at work"
          className="modal-overlay"
          style={overlayStyle}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 240, damping: 26 }}
            className="clay modal-card"
            style={{ width: 660 }}
          >
            {errored ? (
              <button onClick={onClose} aria-label="Close" className="btn-ghost btn-pressed focusable" style={closeBtnStyle}>
                <X size={18} aria-hidden />
              </button>
            ) : null}

            {/* animated centerpiece */}
            <div
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(160deg, rgba(189,178,255,0.3), rgba(255,194,226,0.22))',
                boxShadow: 'var(--shadow-inset)',
                padding: '28px 20px',
                textAlign: 'center',
                overflow: 'hidden',
              }}
            >
              <div className={errored ? undefined : 'bob'} style={{ display: 'inline-block' }}>
                <VoxelCreature
                  element={draft ? outcomeToElement(draft.outcome) : 'SHADE'}
                  power={draft?.vigor ?? 60}
                  seed="theater"
                  size={120}
                />
              </div>
              <h2 className="font-display" style={{ marginTop: 12, fontSize: 28, color: errored ? 'var(--danger)' : 'var(--ink-high)' }}>
                {errored ? 'The cross did not settle' : 'The Geneticist is at work'}
              </h2>
              {!errored ? (
                <p style={{ margin: '8px auto 0', maxWidth: 420, fontSize: 14, color: 'var(--ink-mid)', lineHeight: 1.6 }}>
                  Validators are re-running the read to agree on the outcome. An AI write takes one
                  to five minutes or more.
                </p>
              ) : null}
            </div>

            {errored ? (
              <div style={{ marginTop: 20 }}>
                <p style={{ margin: 0, color: 'var(--ink-mid)', lineHeight: 1.6 }}>{state.error}</p>
                {state.hash ? (
                  <a href={`${EXPLORER}/tx/${state.hash}`} target="_blank" rel="noopener noreferrer" className="font-mono" style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--ink-mid)', fontSize: 13 }}>
                    Track on explorer <ExternalLink size={13} aria-hidden />
                  </a>
                ) : null}
                <div style={{ marginTop: 20 }}>
                  <button className="btn btn-ghost btn-pressed focusable" onClick={onClose}>
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* leader peek */}
                <AnimatePresence>
                  {draft && os ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="clay-sm"
                      style={{ padding: 16, marginTop: 20 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                        <span className="pill" style={{ background: os.hue, color: os.ink }}>
                          {os.label}
                          {typeof draft.vigor === 'number' ? ` . vigor ${draft.vigor}` : ''}
                        </span>
                        <span className="eyebrow">The Geneticist&rsquo;s read, sealing under consensus</span>
                      </div>
                      {draft.name ? (
                        <p style={{ margin: '12px 0 0', fontSize: 15, color: 'var(--ink-high)', lineHeight: 1.5 }}>
                          Leaning to name the child{' '}
                          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                            &ldquo;{draft.name}&rdquo;
                          </span>
                        </p>
                      ) : null}
                      {typeof draft.vigor === 'number' ? (
                        <div style={{ marginTop: 12 }}>
                          <div className="clay-sunk" style={{ height: 10, borderRadius: 999, overflow: 'hidden', padding: 0 }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.max(4, Math.min(100, draft.vigor))}%` }}
                              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                              style={{ height: '100%', borderRadius: 999, background: vigorColor(draft.vigor) }}
                            />
                          </div>
                        </div>
                      ) : null}
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                {/* phase steps */}
                <ol style={{ listStyle: 'none', margin: '20px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {STEPS.map((step, i) => {
                    const done = i < active;
                    const current = i === active;
                    return (
                      <li key={step.key} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', opacity: done || current ? 1 : 0.4 }}>
                        <span
                          style={{
                            marginTop: 2,
                            width: 24,
                            height: 24,
                            borderRadius: 999,
                            flexShrink: 0,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: done ? 'var(--mint)' : current ? 'rgba(160,196,255,0.3)' : 'var(--surface-sunk)',
                            color: done ? '#1f5b46' : 'var(--ink-mid)',
                            boxShadow: done || current ? 'none' : 'var(--shadow-inset)',
                          }}
                        >
                          {done ? (
                            <CheckCircle2 size={14} aria-hidden />
                          ) : current ? (
                            <Loader2 size={13} className="spin" aria-hidden />
                          ) : (
                            <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--ink-muted)' }} aria-hidden />
                          )}
                        </span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15 }}>{step.label}</div>
                          <div style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.5 }}>{step.caption}</div>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                <div className="divider" style={{ margin: '20px 0' }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>Live status</span>
                    <span className="pill font-mono" style={{ background: 'var(--surface-sunk)', color: 'var(--ink-mid)' }}>
                      {state.liveStatus || 'PENDING'}
                    </span>
                  </div>
                  {state.hash ? (
                    <a href={`${EXPLORER}/tx/${state.hash}`} target="_blank" rel="noopener noreferrer" className="font-mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--ink-mid)', fontSize: 12 }}>
                      {shortAddress(state.hash, 8, 6)} <ExternalLink size={12} aria-hidden />
                    </a>
                  ) : null}
                </div>

                {rotating(state.liveStatus) ? (
                  <p style={{ margin: '14px 0 0', fontSize: 13, color: 'var(--ink-mid)' }}>
                    The lineage rotated to a fresh leader and is still working. This is normal for an
                    AI write, nothing has failed.
                  </p>
                ) : (
                  <p style={{ margin: '14px 0 0', fontSize: 13, color: 'var(--ink-muted)' }}>
                    Keep this open and watch the cross resolve, or check back later.
                  </p>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

// A playful hint colour for the centerpiece while the read leans one way.
function outcomeToElement(outcome: string): string {
  switch (String(outcome).toUpperCase()) {
    case 'DOMINANT_A':
      return 'GALE';
    case 'DOMINANT_B':
      return 'BLOOM';
    case 'HYBRID':
      return 'TIDE';
    case 'MUTATION':
      return 'SHADE';
    default:
      return 'SHADE';
  }
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 105,
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
