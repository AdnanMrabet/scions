'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { FlaskConical, X, AlertCircle, Wallet, ArrowLeftRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { Scion } from '@/lib/contract';
import type { WalletState } from '@/hooks/useWallet';
import { elementStyle } from '@/lib/format';
import { VoxelCreature } from './VoxelCreature';

interface BreedModalProps {
  open: boolean;
  scions: Scion[];
  wallet: WalletState;
  busy: boolean;
  onClose: () => void;
  onConfirm: (parentA: string, parentB: string) => void;
}

function ParentSlot({ scion, label }: { scion: Scion | null; label: string }) {
  if (!scion) {
    return (
      <div className="clay-sunk" style={{ flex: 1, minWidth: 0, padding: 14, textAlign: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>{label}</span>
        <div style={{ marginTop: 8, fontSize: 13, color: 'var(--ink-muted)' }}>Not chosen</div>
      </div>
    );
  }
  const es = elementStyle(scion.element);
  return (
    <div className="clay-sm" style={{ flex: 1, minWidth: 0, padding: 12, display: 'flex', alignItems: 'center', gap: 10, border: `2px solid ${es.hue}` }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: es.soft, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <VoxelCreature element={scion.element} power={scion.power} seed={scion.id} size={32} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {scion.name}
        </div>
        <div className="font-mono" style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
          {scion.id} . {es.label}
        </div>
      </div>
    </div>
  );
}

export function BreedModal({ open, scions, wallet, busy, onClose, onConfirm }: BreedModalProps) {
  const [a, setA] = useState<string | null>(null);
  const [b, setB] = useState<string | null>(null);
  const [stage, setStage] = useState<'pick' | 'confirm'>('pick');

  useEffect(() => {
    if (open) {
      setA(null);
      setB(null);
      setStage('pick');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, busy, onClose]);

  const byId = useMemo(() => {
    const m = new Map<string, Scion>();
    for (const s of scions) m.set(s.id, s);
    return m;
  }, [scions]);

  const scionA = a ? byId.get(a) ?? null : null;
  const scionB = b ? byId.get(b) ?? null : null;
  const valid = !!a && !!b && a !== b;
  const connected = !!wallet.address;

  const choose = (s: Scion) => {
    if (a === s.id) {
      setA(null);
      return;
    }
    if (b === s.id) {
      setB(null);
      return;
    }
    if (!a) {
      setA(s.id);
      return;
    }
    if (!b) {
      setB(s.id);
      return;
    }
    // both filled: replace the second
    setB(s.id);
  };

  const swap = () => {
    setA(b);
    setB(a);
  };

  const handlePrimary = () => {
    if (!valid) return;
    if (stage === 'pick') {
      setStage('confirm');
      return;
    }
    onConfirm(a!, b!);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Breed two scions"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !busy) onClose();
          }}
          className="modal-overlay"
          style={overlayStyle}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="clay modal-card"
            style={{ width: 640 }}
          >
            <button onClick={onClose} disabled={busy} aria-label="Close" className="btn-ghost btn-pressed focusable" style={closeBtnStyle}>
              <X size={18} aria-hidden />
            </button>

            <p className="eyebrow">Breed</p>
            <h2 style={{ marginTop: 6, fontSize: 28 }}>Cross two scions</h2>
            <p style={{ marginTop: 10, color: 'var(--ink-mid)', lineHeight: 1.6 }}>
              Pick two different creatures. The AI Geneticist rules the cross under consensus, then
              the child inherits derived traits and joins the tree.
            </p>

            {/* chosen pair */}
            <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <ParentSlot scion={scionA} label="Parent A" />
              <button
                className="btn-ghost btn-pressed focusable"
                onClick={swap}
                disabled={!a && !b}
                aria-label="Swap parents"
                style={{ borderRadius: 999, padding: 10, minHeight: 44, minWidth: 44, display: 'grid', placeItems: 'center', cursor: 'pointer', flexShrink: 0 }}
              >
                <ArrowLeftRight size={16} aria-hidden />
              </button>
              <ParentSlot scion={scionB} label="Parent B" />
            </div>

            {stage === 'pick' ? (
              <>
                <p className="eyebrow" style={{ marginTop: 22 }}>
                  The menagerie ({scions.length})
                </p>
                <div className="menagerie-pick" style={{ marginTop: 12 }}>
                  {scions.map((s) => {
                    const selected = s.id === a || s.id === b;
                    const es = elementStyle(s.element);
                    return (
                      <motion.button
                        key={s.id}
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        onClick={() => choose(s)}
                        aria-pressed={selected}
                        className="clay-sm focusable"
                        style={{
                          padding: 10,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 9,
                          cursor: 'pointer',
                          textAlign: 'left',
                          border: selected ? `2px solid ${es.hue}` : '1px solid rgba(255,255,255,0.5)',
                        }}
                      >
                        <div style={{ width: 38, height: 38, borderRadius: 11, background: es.soft, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                          <VoxelCreature element={s.element} power={s.power} seed={s.id} size={30} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 110 }}>
                            {s.name}
                          </div>
                          <div className="font-mono" style={{ fontSize: 10.5, color: 'var(--ink-muted)' }}>
                            {s.id} . g{s.generation}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="clay-sunk" style={{ marginTop: 22, padding: 18 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <AlertCircle size={18} color="var(--coral)" aria-hidden style={{ marginTop: 2 }} />
                  <div>
                    <p style={{ margin: 0, fontWeight: 700 }}>
                      Cross {scionA?.name} with {scionB?.name}?
                    </p>
                    <p style={{ margin: '8px 0 0', fontSize: 13.5, color: 'var(--ink-mid)', lineHeight: 1.6 }}>
                      This submits a transaction on Bradbury Testnet. Network fees apply. An AI write
                      can take one to five minutes or more. Continue?
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!connected ? (
              <div className="clay-sunk" style={noteStyle}>
                <Wallet size={15} color="var(--coral)" aria-hidden />
                <span>Connect your wallet to sign the cross.</span>
              </div>
            ) : null}

            <div style={{ marginTop: 22, display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              {stage === 'confirm' ? (
                <button className="btn btn-ghost btn-pressed focusable" onClick={() => setStage('pick')} disabled={busy}>
                  Back
                </button>
              ) : null}
              <motion.button
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                className="btn btn-coral btn-pressed focusable"
                onClick={handlePrimary}
                disabled={!valid || busy || !connected}
              >
                <FlaskConical size={17} aria-hidden />
                {busy ? 'Crossing...' : stage === 'confirm' ? 'Confirm and breed' : 'Review the cross'}
              </motion.button>
            </div>
          </motion.div>

          <style>{`
            .menagerie-pick {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
              gap: 10px;
              max-height: 230px;
              overflow-y: auto;
              padding-right: 4px;
            }
          `}</style>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 100,
  background: 'rgba(58,58,82,0.42)',
  backdropFilter: 'blur(8px)',
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

const noteStyle: React.CSSProperties = {
  marginTop: 16,
  padding: 14,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  fontSize: 13,
  color: 'var(--ink-mid)',
};
