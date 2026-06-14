'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { VoxelCreature } from './VoxelCreature';

interface EmptyStateProps {
  onConjure: () => void;
}

export function EmptyState({ onConjure }: EmptyStateProps) {
  return (
    <div className="clay" style={{ padding: '48px 28px', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
        <div style={{ opacity: 0.5 }}>
          <VoxelCreature element="STONE" power={30} seed="empty-egg-1" size={66} />
        </div>
        <div className="bob">
          <VoxelCreature element="GALE" power={50} seed="empty-egg-2" size={84} />
        </div>
        <div style={{ opacity: 0.5 }}>
          <VoxelCreature element="FROST" power={30} seed="empty-egg-3" size={66} />
        </div>
      </div>
      <h3 style={{ marginTop: 18, fontSize: 24 }}>The nursery is still quiet</h3>
      <p
        style={{
          margin: '12px auto 0',
          maxWidth: 460,
          color: 'var(--ink-mid)',
          lineHeight: 1.6,
        }}
      >
        No scions have been conjured yet. Type a seed name of 2 to 40 characters to shape the first
        primordial, then come back to cross it with another and start the family tree.
      </p>
      <motion.button
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        className="btn btn-primary btn-pressed"
        onClick={onConjure}
        style={{ marginTop: 24 }}
      >
        <Sparkles size={18} aria-hidden />
        Conjure the first scion
      </motion.button>
    </div>
  );
}
