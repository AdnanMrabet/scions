'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface CopyableProps {
  value: string;
  label?: string;
  display?: string;
  className?: string;
}

export function Copyable({ value, label, display, className }: CopyableProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard may be unavailable */
    }
  };

  return (
    <button
      onClick={copy}
      aria-label={label ?? `Copy ${value}`}
      className={`font-mono focusable ${className ?? ''}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        background: 'transparent',
        border: 'none',
        color: 'inherit',
        padding: 2,
        fontSize: 'inherit',
        minHeight: 'auto',
        cursor: 'pointer',
      }}
    >
      <span>{display ?? value}</span>
      {copied ? (
        <Check size={13} color="var(--mint)" aria-hidden />
      ) : (
        <Copy size={13} color="var(--ink-muted)" aria-hidden />
      )}
      <AnimatePresence>
        {copied ? (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: -2 }}
            exit={{ opacity: 0 }}
            className="clay-sm"
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'var(--ink-high)',
              fontSize: 11,
              fontWeight: 700,
              padding: '4px 9px',
              borderRadius: 8,
              whiteSpace: 'nowrap',
            }}
          >
            Copied
          </motion.span>
        ) : null}
      </AnimatePresence>
    </button>
  );
}
