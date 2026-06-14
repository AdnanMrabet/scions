'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, LogOut, Wallet, AlertTriangle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { WalletState } from '@/hooks/useWallet';
import { shortAddress } from '@/lib/format';
import { Copyable } from './Copyable';

interface WalletControlProps {
  wallet: WalletState;
}

export function WalletControl({ wallet }: WalletControlProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!wallet.address) {
    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="btn btn-primary btn-pressed"
        onClick={wallet.connect}
        disabled={wallet.connecting}
      >
        <Wallet size={17} aria-hidden />
        {wallet.connecting ? 'Reaching out...' : 'Connect wallet'}
      </motion.button>
    );
  }

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="btn btn-ghost btn-pressed focusable"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{ gap: 8 }}
      >
        {!wallet.onChain ? (
          <AlertTriangle size={15} color="var(--danger)" aria-hidden />
        ) : (
          <span className="dot" style={{ background: 'var(--mint)' }} aria-hidden />
        )}
        <span className="font-mono" style={{ fontSize: 14 }}>
          {shortAddress(wallet.address)}
        </span>
        <ChevronDown size={15} aria-hidden style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.18s' }} />
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="clay"
            style={{
              position: 'absolute',
              top: 'calc(100% + 12px)',
              right: 0,
              width: 290,
              maxWidth: '86vw',
              padding: 18,
              zIndex: 60,
            }}
          >
            <p className="eyebrow" style={{ margin: 0 }}>
              Connected wallet
            </p>
            <div style={{ marginTop: 10, wordBreak: 'break-all' }}>
              <Copyable
                value={wallet.address}
                display={wallet.address}
                label="Copy full wallet address"
                className="font-mono"
              />
            </div>

            <div className="divider" style={{ margin: '16px 0' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>Balance</span>
              <span className="font-mono" style={{ fontSize: 14, fontWeight: 600 }}>
                {wallet.balance ?? '0'} GEN
              </span>
            </div>

            {!wallet.onChain ? (
              <p style={{ marginTop: 12, fontSize: 12.5, color: 'var(--danger)', lineHeight: 1.5 }}>
                Wrong network. Reconnect to hop onto Bradbury Testnet.
              </p>
            ) : null}

            <button
              className="btn btn-ghost btn-pressed focusable"
              onClick={() => {
                wallet.disconnect();
                setOpen(false);
              }}
              style={{ marginTop: 16, width: '100%', color: 'var(--danger)' }}
            >
              <LogOut size={16} aria-hidden />
              Disconnect
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
