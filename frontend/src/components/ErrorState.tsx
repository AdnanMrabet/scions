'use client';

import { motion } from 'framer-motion';
import { RefreshCw, ExternalLink, AlertTriangle } from 'lucide-react';
import { CONTRACT_ADDRESS, EXPLORER } from '@/lib/contract';
import { Copyable } from './Copyable';

interface ErrorStateProps {
  message: string;
  diagnostic: boolean;
  onRetry: () => void;
}

export function ErrorState({ message, diagnostic, onRetry }: ErrorStateProps) {
  return (
    <div className="clay" style={{ padding: '40px 28px', textAlign: 'center' }}>
      <div
        style={{
          width: 60,
          height: 60,
          margin: '0 auto',
          borderRadius: 18,
          display: 'grid',
          placeItems: 'center',
          background: 'rgba(255,143,143,0.18)',
          boxShadow: 'var(--shadow-inset)',
        }}
      >
        <AlertTriangle size={28} color="var(--danger)" aria-hidden />
      </div>
      <h3 style={{ marginTop: 18, fontSize: 22 }}>
        {diagnostic ? 'The lineage is not answering' : 'Could not reach the menagerie'}
      </h3>
      <p style={{ margin: '12px auto 0', maxWidth: 480, color: 'var(--ink-mid)', lineHeight: 1.6 }}>
        {message}
      </p>

      {diagnostic ? (
        <div
          className="clay-sunk"
          style={{ margin: '18px auto 0', maxWidth: 460, padding: 14, textAlign: 'left' }}
        >
          <p style={{ margin: 0, fontSize: 12.5, color: 'var(--ink-muted)', lineHeight: 1.6 }}>
            The frontend is pointed at this address on Bradbury. If it reads all zeros, the contract
            has not been deployed and wired in yet.
          </p>
          <div style={{ marginTop: 10, fontSize: 12.5 }}>
            <Copyable value={CONTRACT_ADDRESS} display={CONTRACT_ADDRESS} label="Copy contract address" className="font-mono" />
          </div>
        </div>
      ) : null}

      <div style={{ marginTop: 22, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          className="btn btn-primary btn-pressed"
          onClick={onRetry}
        >
          <RefreshCw size={16} aria-hidden />
          Try again
        </motion.button>
        <a
          href={EXPLORER}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost btn-pressed"
        >
          Open explorer
          <ExternalLink size={15} aria-hidden />
        </a>
      </div>
    </div>
  );
}
