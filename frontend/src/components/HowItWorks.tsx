'use client';

import { motion } from 'framer-motion';
import { Egg, FlaskConical, Network } from 'lucide-react';
import { VoxelCreature } from './VoxelCreature';

const spring = { type: 'spring', stiffness: 260, damping: 24 } as const;

export function HowItWorks() {
  return (
    <section className="section" id="how" aria-labelledby="how-title">
      <div className="shell">
        <p className="eyebrow" style={{ textAlign: 'center' }}>
          The breeding loop
        </p>
        <h2 id="how-title" style={{ fontSize: 'clamp(28px, 4vw, 42px)', textAlign: 'center', marginTop: 8 }}>
          Three moves grow a whole lineage
        </h2>

        <div
          style={{
            marginTop: 44,
            display: 'grid',
            gap: 22,
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            alignItems: 'start',
          }}
        >
          {/* Step 1 - wide, leads the row */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={spring}
            className="clay"
            style={{ padding: 26, gridColumn: 'span 1', minWidth: 0 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span className="step-badge" style={badgeStyle('var(--lilac)')}>1</span>
              <Egg size={22} color="var(--ink-mid)" aria-hidden />
            </div>
            <h3 style={{ marginTop: 18, fontSize: 22 }}>Conjure a primordial</h3>
            <p style={{ marginTop: 10, color: 'var(--ink-mid)', lineHeight: 1.6 }}>
              Type a seed name of 2 to 40 characters. That word becomes the creature name and, with
              no AI at all, deterministically settles its element and power. A gen-0 root, quick and
              free of consensus.
            </p>
            <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
              <VoxelCreature element="SPARK" power={60} seed="how-1a" size={56} />
              <VoxelCreature element="TIDE" power={40} seed="how-1b" size={56} />
            </div>
          </motion.div>

          {/* Step 2 - tall accent */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ ...spring, delay: 0.06 }}
            className="clay"
            style={{
              padding: 26,
              background: 'linear-gradient(160deg, rgba(160,196,255,0.32), rgba(189,178,255,0.22))',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span className="step-badge" style={badgeStyle('var(--periwinkle)')}>2</span>
              <FlaskConical size={22} color="var(--ink-mid)" aria-hidden />
            </div>
            <h3 style={{ marginTop: 18, fontSize: 22 }}>Breed any two</h3>
            <p style={{ marginTop: 10, color: 'var(--ink-mid)', lineHeight: 1.6 }}>
              Choose two different scions and send the cross. An on-chain AI Geneticist judges the
              outcome, DOMINANT_A, DOMINANT_B, HYBRID, or MUTATION, then sets a vigor and names the
              child. Validators re-run the read and seal it under consensus.
            </p>
            <p style={{ marginTop: 12, fontSize: 13, color: 'var(--ink-muted)' }}>
              An AI write takes one to five minutes or more.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ ...spring, delay: 0.12 }}
            className="clay"
            style={{ padding: 26 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span className="step-badge" style={badgeStyle('var(--coral)')}>3</span>
              <Network size={22} color="var(--ink-mid)" aria-hidden />
            </div>
            <h3 style={{ marginTop: 18, fontSize: 22 }}>Watch the tree branch</h3>
            <p style={{ marginTop: 10, color: 'var(--ink-mid)', lineHeight: 1.6 }}>
              The child inherits traits derived from its parents and the ruled outcome, then hatches
              into the menagerie and threads up to both parents in the lineage tree. The genealogy
              keeps growing for everyone.
            </p>
          </motion.div>
        </div>
      </div>

      <style>{`
        .step-badge {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 22px;
          width: 46px;
          height: 46px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          color: #2c2c46;
        }
      `}</style>
    </section>
  );
}

function badgeStyle(hue: string): React.CSSProperties {
  return {
    background: hue,
    boxShadow: '-3px -3px 8px rgba(255,255,255,0.7), 3px 3px 8px rgba(159,168,200,0.4)',
  };
}
