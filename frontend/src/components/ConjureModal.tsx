'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X, AlertCircle, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { WalletState } from '@/hooks/useWallet';
import { FAUCET } from '@/lib/contract';

interface ConjureModalProps {
  open: boolean;
  wallet: WalletState;
  busy: boolean;
  onClose: () => void;
  onConfirm: (seed: string) => void;
}

const MIN = 2;
const MAX = 40;

export function ConjureModal({ open, wallet, busy, onClose, onConfirm }: ConjureModalProps) {
  const [seed, setSeed] = useState('');
  const [stage, setStage] = useState<'form' | 'confirm'>('form');

  useEffect(() => {
    if (open) {
      setSeed('');
      setStage('form');
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

  const trimmed = seed.trim();
  const len = trimmed.length;
  const tooShort = len < MIN;
  const tooLong = seed.length > MAX;
  const valid = !tooShort && !tooLong && len > 0;

  const connected = !!wallet.address;

  const handlePrimary = () => {
    if (!valid) return;
    if (stage === 'form') {
      setStage('confirm');
      return;
    }
    onConfirm(trimmed);
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
          aria-label="Conjure a primordial scion"
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
          >
            <button
              onClick={onClose}
              disabled={busy}
              aria-label="Close"
              className="btn-ghost btn-pressed focusable"
              style={closeBtnStyle}
            >
              <X size={18} aria-hidden />
            </button>

            <p className="eyebrow">Conjure</p>
            <h2 style={{ marginTop: 6, fontSize: 28 }}>Shape a primordial</h2>
            <p style={{ marginTop: 10, color: 'var(--ink-mid)', lineHeight: 1.6 }}>
              Your seed name settles the creature deterministically, no AI involved. The same word
              always grows the same element and power.
            </p>

            {stage === 'form' ? (
              <>
                <label htmlFor="seed-input" className="eyebrow" style={{ display: 'block', marginTop: 22 }}>
                  Seed name
                </label>
                <div className="clay-sunk" style={{ marginTop: 10, padding: '4px 6px', display: 'flex', alignItems: 'center' }}>
                  <input
                    id="seed-input"
                    value={seed}
                    autoFocus
                    maxLength={MAX + 8}
                    onChange={(e) => setSeed(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && valid) handlePrimary();
                    }}
                    placeholder="Emberdrake"
                    aria-describedby="seed-help"
                    style={inputStyle}
                  />
                  <span
                    className="font-mono"
                    style={{ fontSize: 13, color: tooLong ? 'var(--danger)' : 'var(--ink-muted)', paddingRight: 10 }}
                  >
                    {seed.length}/{MAX}
                  </span>
                </div>
                <p id="seed-help" style={{ marginTop: 10, fontSize: 13, color: tooShort && len > 0 ? 'var(--danger)' : 'var(--ink-muted)', minHeight: 18 }}>
                  {tooLong
                    ? `That is too long, trim to ${MAX} characters or fewer.`
                    : tooShort && len > 0
                      ? `A touch short, give it at least ${MIN} characters.`
                      : 'Between 2 and 40 characters. This becomes the creature name.'}
                </p>

                {!connected ? (
                  <div className="clay-sunk" style={noteStyle}>
                    <Wallet size={15} color="var(--periwinkle)" aria-hidden />
                    <span>Connect your wallet to sign the conjuring.</span>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="clay-sunk" style={{ marginTop: 22, padding: 18 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <AlertCircle size={18} color="var(--periwinkle)" aria-hidden style={{ marginTop: 2 }} />
                  <div>
                    <p style={{ margin: 0, fontWeight: 700 }}>Conjure &ldquo;{trimmed}&rdquo;?</p>
                    <p style={{ margin: '8px 0 0', fontSize: 13.5, color: 'var(--ink-mid)', lineHeight: 1.6 }}>
                      This submits a transaction on Bradbury Testnet. Network fees apply. Continue?
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              {stage === 'confirm' ? (
                <button className="btn btn-ghost btn-pressed focusable" onClick={() => setStage('form')} disabled={busy}>
                  Back
                </button>
              ) : null}
              <motion.button
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                className="btn btn-primary btn-pressed focusable"
                onClick={handlePrimary}
                disabled={!valid || busy || !connected}
              >
                <Sparkles size={17} aria-hidden />
                {busy ? 'Conjuring...' : stage === 'confirm' ? 'Confirm and conjure' : 'Review'}
              </motion.button>
            </div>

            {wallet.address && !wallet.onChain ? (
              <p style={{ marginTop: 14, fontSize: 12.5, color: 'var(--danger)' }}>
                You are off Bradbury. Reconnect to switch networks, or top up at{' '}
                <a href={FAUCET} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
                  the faucet
                </a>
                .
              </p>
            ) : null}
          </motion.div>
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

const inputStyle: React.CSSProperties = {
  flex: 1,
  border: 'none',
  background: 'transparent',
  outline: 'none',
  padding: '12px 14px',
  fontSize: 17,
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  color: 'var(--ink-high)',
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
