'use client';

import { motion } from 'framer-motion';
import { VoxelCreature } from './VoxelCreature';
import type { Element } from '@/lib/contract';

interface Row {
  step: string;
  title: string;
  body: string;
  note?: string;
  element: Element;
  power: number;
  companion: Element;
  companionPower: number;
}

const ROWS: Row[] = [
  {
    step: 'First',
    title: 'A seed becomes a primordial',
    body:
      'Type a seed name of 2 to 40 characters. With no AI at all, that word deterministically settles the creature element and power and names it. A gen-0 root, quick and free of consensus.',
    element: 'SPARK',
    power: 60,
    companion: 'TIDE',
    companionPower: 40,
  },
  {
    step: 'Then',
    title: 'Two scions cross under a Geneticist',
    body:
      'Choose two different scions and send the cross. An on-chain AI Geneticist judges the outcome, DOMINANT_A, DOMINANT_B, HYBRID or MUTATION, then sets a vigor and names the child. Validators re-run the read and seal it.',
    note: 'An AI write takes one to five minutes or more.',
    element: 'SHADE',
    power: 84,
    companion: 'BLOOM',
    companionPower: 52,
  },
  {
    step: 'Always',
    title: 'The child threads into the tree',
    body:
      'The child inherits traits derived from its parents and the ruled outcome, then hatches into the menagerie and threads up to both parents in the lineage tree. The genealogy keeps branching for everyone.',
    element: 'FROST',
    power: 72,
    companion: 'GALE',
    companionPower: 46,
  },
];

const spring = { type: 'spring', stiffness: 240, damping: 24 } as const;

// "How a creature comes to be", placed LOW near the footer, as alternating
// left/right rows rather than a grid of equal numbered steps.
export function AlternatingExplainer() {
  return (
    <section className="section" id="how" aria-labelledby="how-title" style={{ paddingTop: 36 }}>
      <div className="shell">
        <p className="eyebrow" style={{ textAlign: 'center' }}>
          The long way round
        </p>
        <h2 id="how-title" style={{ fontSize: 'clamp(28px, 4vw, 42px)', textAlign: 'center', marginTop: 8 }}>
          How a creature comes to be
        </h2>

        <div style={{ marginTop: 44, display: 'flex', flexDirection: 'column', gap: 26 }}>
          {ROWS.map((row, i) => {
            const flip = i % 2 === 1;
            return (
              <motion.div
                key={row.title}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={spring}
                className="explainer-row"
              >
                {/* art side */}
                <div
                  className="clay explainer-art"
                  style={{
                    order: flip ? 2 : 1,
                    padding: 28,
                    display: 'grid',
                    placeItems: 'center',
                    minHeight: 220,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    aria-hidden
                    style={{
                      position: 'absolute',
                      width: 200,
                      height: 200,
                      borderRadius: '48% 52% 55% 45%',
                      background:
                        'radial-gradient(circle at 40% 34%, rgba(189,178,255,0.40), rgba(160,196,255,0.22))',
                      filter: 'blur(2px)',
                    }}
                  />
                  <div className="bob" style={{ position: 'relative', zIndex: 1 }}>
                    <VoxelCreature element={row.element} power={row.power} seed={`how-${i}`} size={168} />
                  </div>
                  <div style={{ position: 'absolute', bottom: 20, right: 22, zIndex: 1 }}>
                    <VoxelCreature element={row.companion} power={row.companionPower} seed={`how-pal-${i}`} size={60} />
                  </div>
                </div>

                {/* text side */}
                <div className="explainer-text" style={{ order: flip ? 1 : 2 }}>
                  <span className="eyebrow">{row.step}</span>
                  <h3 style={{ marginTop: 10, fontSize: 'clamp(22px, 3vw, 28px)' }}>{row.title}</h3>
                  <p style={{ marginTop: 12, color: 'var(--ink-mid)', lineHeight: 1.65 }}>{row.body}</p>
                  {row.note ? (
                    <p style={{ marginTop: 12, fontSize: 13, color: 'var(--ink-muted)' }}>{row.note}</p>
                  ) : null}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        .explainer-row {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: 30px;
          align-items: center;
        }
        .explainer-text { display: flex; flex-direction: column; justify-content: center; }
        @media (max-width: 820px) {
          .explainer-row { grid-template-columns: 1fr; gap: 18px; }
          .explainer-art { order: 1 !important; min-height: 180px; }
          .explainer-text { order: 2 !important; text-align: center; }
        }
      `}</style>
    </section>
  );
}
