'use client';

import { Mark } from './Mark';
import { WalletControl } from './WalletControl';
import type { WalletState } from '@/hooks/useWallet';

interface CenteredHeaderProps {
  wallet: WalletState;
}

export function CenteredHeader({ wallet }: CenteredHeaderProps) {
  const live = wallet.address ? wallet.onChain : true;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '14px 0',
        background: 'rgba(238,240,247,0.78)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--hairline)',
      }}
    >
      <div
        className="shell"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {/* LEFT: network badge */}
        <div style={{ justifySelf: 'start' }}>
          <span
            className="chip"
            title="GenLayer Bradbury Testnet"
            style={{ color: live ? 'var(--ink-mid)' : 'var(--danger)' }}
          >
            <span
              className="dot"
              style={{ background: live ? 'var(--mint)' : 'var(--danger)' }}
              aria-hidden
            />
            <span className="header-net">Bradbury Testnet</span>
            <span className="header-net-short" aria-hidden>
              Bradbury
            </span>
          </span>
        </div>

        {/* CENTER: the mark */}
        <a
          href="#top"
          style={{ justifySelf: 'center', display: 'inline-flex', alignItems: 'center', gap: 11 }}
          aria-label="Scions home"
        >
          <Mark size={34} />
          <span
            className="font-display"
            style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em' }}
          >
            Scions
          </span>
        </a>

        {/* RIGHT: wallet control */}
        <div style={{ justifySelf: 'end' }}>
          <WalletControl wallet={wallet} />
        </div>
      </div>

      <style>{`
        .header-net-short { display: none; }
        @media (max-width: 600px) {
          .header-net { display: none; }
          .header-net-short { display: inline; }
        }
      `}</style>
    </header>
  );
}
