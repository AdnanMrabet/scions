'use client';

import { ExternalLink } from 'lucide-react';
import { CONTRACT_ADDRESS, DOCS, EXPLORER, FAUCET } from '@/lib/contract';
import { Mark } from './Mark';
import { Copyable } from './Copyable';
import { shortAddress } from '@/lib/format';

const LINKS = [
  { label: 'How it works', href: '#how' },
  { label: 'The menagerie', href: '#menagerie' },
  { label: 'Lineage tree', href: '#lineage' },
];

const RESOURCES = [
  { label: 'GenLayer docs', href: DOCS },
  { label: 'Bradbury explorer', href: EXPLORER },
  { label: 'Testnet faucet', href: FAUCET },
];

export function ClaySlabFooter() {
  return (
    <footer className="section" style={{ paddingTop: 20 }}>
      <div className="shell">
        <div
          className="clay"
          style={{
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(28px, 5vw, 52px)',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 11 }}>
            <Mark size={40} />
            <span className="font-display" style={{ fontSize: 28, fontWeight: 700 }}>
              Scions
            </span>
          </div>

          <p style={{ margin: '14px auto 0', maxWidth: 460, color: 'var(--ink-mid)', lineHeight: 1.6 }}>
            A breeding lineage where an on-chain AI Geneticist rules every cross under validator
            consensus. Conjure, breed, and grow the tree.
          </p>

          {/* centered links */}
          <nav aria-label="Sections" style={{ marginTop: 26, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="chip focusable" style={{ color: 'var(--ink-mid)' }}>
                {l.label}
              </a>
            ))}
          </nav>

          {/* resources */}
          <nav aria-label="Resources" style={{ marginTop: 14, display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap' }}>
            {RESOURCES.map((r) => (
              <a
                key={r.href}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="focusable"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: 'var(--ink-mid)', fontWeight: 600 }}
              >
                {r.label}
                <ExternalLink size={13} aria-hidden />
              </a>
            ))}
          </nav>

          <div className="divider" style={{ margin: '26px auto', maxWidth: 420 }} />

          {/* contract */}
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span className="eyebrow">Contract on Bradbury</span>
            <span className="clay-sunk" style={{ padding: '8px 14px', borderRadius: 999, fontSize: 13 }}>
              <Copyable
                value={CONTRACT_ADDRESS}
                display={shortAddress(CONTRACT_ADDRESS, 10, 8)}
                label="Copy contract address"
                className="font-mono"
              />
            </span>
            <a
              href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="focusable"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--ink-muted)', marginTop: 2 }}
            >
              View on explorer
              <ExternalLink size={12} aria-hidden />
            </a>
          </div>

          <p style={{ marginTop: 26, fontSize: 12.5, color: 'var(--ink-muted)' }}>
            Runs on GenLayer Bradbury Testnet. Reads are open to all, writes need a connected wallet.
          </p>
        </div>
      </div>
    </footer>
  );
}
