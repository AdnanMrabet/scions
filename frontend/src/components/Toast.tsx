'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, Loader2, X, XCircle, ExternalLink } from 'lucide-react';
import { useEffect } from 'react';
import { EXPLORER } from '@/lib/contract';

export type ToastKind = 'loading' | 'success' | 'error' | 'info';

export interface ToastData {
  id: string;
  kind: ToastKind;
  title: string;
  message?: string;
  hash?: string;
}

interface ToastItemProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const TONE: Record<ToastKind, string> = {
  loading: 'var(--periwinkle)',
  success: 'var(--mint)',
  error: 'var(--danger)',
  info: 'var(--lilac)',
};

function ToastIcon({ kind }: { kind: ToastKind }) {
  const color = TONE[kind];
  if (kind === 'loading') return <Loader2 size={18} color={color} className="spin" aria-hidden />;
  if (kind === 'success') return <CheckCircle2 size={18} color={color} aria-hidden />;
  if (kind === 'error') return <XCircle size={18} color={color} aria-hidden />;
  return <Info size={18} color={color} aria-hidden />;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  useEffect(() => {
    if (toast.kind === 'info' || toast.kind === 'success') {
      const t = setTimeout(() => onDismiss(toast.id), 8000);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [toast, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 340, damping: 26 }}
      role="status"
      className="clay-sm"
      style={{ padding: '14px 16px', width: 348, maxWidth: '90vw' }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ marginTop: 2 }}>
          <ToastIcon kind={toast.kind} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: 'var(--ink-high)' }}>
            {toast.title}
          </p>
          {toast.message ? (
            <p
              style={{
                margin: '5px 0 0',
                fontSize: 13,
                color: 'var(--ink-muted)',
                lineHeight: 1.5,
                wordBreak: 'break-word',
              }}
            >
              {toast.message}
            </p>
          ) : null}
          {toast.hash ? (
            <a
              href={`${EXPLORER}/tx/${toast.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono"
              style={{
                marginTop: 8,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                color: 'var(--ink-mid)',
              }}
            >
              View on explorer
              <ExternalLink size={12} aria-hidden />
            </a>
          ) : null}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          aria-label="Dismiss notification"
          className="btn-ghost btn-pressed"
          style={{
            border: 'none',
            padding: 6,
            color: 'var(--ink-muted)',
            minHeight: 'auto',
            borderRadius: 999,
            background: 'transparent',
            boxShadow: 'none',
            cursor: 'pointer',
          }}
        >
          <X size={16} aria-hidden />
        </button>
      </div>
    </motion.div>
  );
}

interface ToastStackProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  return (
    <div
      style={{
        position: 'fixed',
        right: 18,
        bottom: 18,
        zIndex: 120,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        pointerEvents: 'none',
      }}
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: 'auto' }}>
            <ToastItem toast={t} onDismiss={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
