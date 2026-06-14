'use client';

import { useMemo, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import type { Scion } from '@/lib/contract';
import { elementStyle } from '@/lib/format';
import { VoxelCreature } from './VoxelCreature';

interface LineageTreeProps {
  scions: Scion[];
}

const NODE_W = 158;
const NODE_H = 96;
const GAP_X = 26;
const ROW_H = 168;
const PAD = 28;

interface Placed {
  scion: Scion;
  x: number;
  y: number;
}

// Lay the menagerie out as a descent tree: gen-0 primordials at the roots up
// top, each child one row below, with connectors drawn up to both parents.
function layout(scions: Scion[]): { placed: Placed[]; width: number; height: number } {
  if (scions.length === 0) return { placed: [], width: 0, height: 0 };

  const byGen = new Map<number, Scion[]>();
  let maxGen = 0;
  for (const s of scions) {
    const g = s.generation;
    maxGen = Math.max(maxGen, g);
    if (!byGen.has(g)) byGen.set(g, []);
    byGen.get(g)!.push(s);
  }

  const rows: Scion[][] = [];
  for (let g = 0; g <= maxGen; g++) {
    const row = (byGen.get(g) ?? []).slice().sort((a, b) => {
      const na = Number(a.id.replace(/\D/g, '')) || 0;
      const nb = Number(b.id.replace(/\D/g, '')) || 0;
      return na - nb;
    });
    rows.push(row);
  }

  const rowWidths = rows.map((r) => (r.length ? r.length * NODE_W + (r.length - 1) * GAP_X : 0));
  const width = Math.max(NODE_W, ...rowWidths) + PAD * 2;

  const placed: Placed[] = [];
  rows.forEach((row, g) => {
    const rw = rowWidths[g];
    const startX = (width - rw) / 2;
    row.forEach((s, i) => {
      placed.push({
        scion: s,
        x: startX + i * (NODE_W + GAP_X),
        y: PAD + g * ROW_H,
      });
    });
  });

  const height = PAD * 2 + (maxGen + 1) * NODE_H + maxGen * (ROW_H - NODE_H);
  return { placed, width, height };
}

export function LineageTree({ scions }: LineageTreeProps) {
  const [zoom, setZoom] = useState(1);
  const { placed, width, height } = useMemo(() => layout(scions), [scions]);
  const posById = useMemo(() => {
    const m = new Map<string, Placed>();
    for (const p of placed) m.set(p.scion.id, p);
    return m;
  }, [placed]);

  const connectors = useMemo(() => {
    const lines: { id: string; d: string; hue: string }[] = [];
    for (const p of placed) {
      const { scion } = p;
      for (const parentId of [scion.parent_a, scion.parent_b]) {
        if (!parentId) continue;
        const parent = posById.get(parentId);
        if (!parent) continue;
        const cx = p.x + NODE_W / 2;
        const cy = p.y;
        const px = parent.x + NODE_W / 2;
        const py = parent.y + NODE_H;
        const mid = (cy + py) / 2;
        lines.push({
          id: `${parentId}-${scion.id}`,
          d: `M${px} ${py} C ${px} ${mid}, ${cx} ${mid}, ${cx} ${cy}`,
          hue: elementStyle(parent.scion.element).hue,
        });
      }
    }
    return lines;
  }, [placed, posById]);

  if (scions.length === 0) return null;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 14,
          flexWrap: 'wrap',
        }}
      >
        <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-muted)' }}>
          Roots up top are the primordials. Every child threads down to the two it came from.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            className="btn-ghost btn-pressed focusable"
            aria-label="Zoom out the lineage"
            onClick={() => setZoom((z) => Math.max(0.5, Math.round((z - 0.1) * 10) / 10))}
            style={{ borderRadius: 999, padding: 10, minHeight: 44, minWidth: 44, cursor: 'pointer', display: 'grid', placeItems: 'center' }}
          >
            <Minus size={16} aria-hidden />
          </button>
          <span className="font-mono" style={{ fontSize: 13, color: 'var(--ink-mid)', minWidth: 44, textAlign: 'center' }}>
            {Math.round(zoom * 100)}%
          </span>
          <button
            className="btn-ghost btn-pressed focusable"
            aria-label="Zoom in the lineage"
            onClick={() => setZoom((z) => Math.min(1.4, Math.round((z + 0.1) * 10) / 10))}
            style={{ borderRadius: 999, padding: 10, minHeight: 44, minWidth: 44, cursor: 'pointer', display: 'grid', placeItems: 'center' }}
          >
            <Plus size={16} aria-hidden />
          </button>
        </div>
      </div>

      <div
        className="clay-sunk scroll-x"
        style={{ padding: 18, borderRadius: 'var(--radius-lg)' }}
      >
        <div style={{ width: width * zoom, height: height * zoom }}>
          <div
            style={{
              position: 'relative',
              width,
              height,
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
            }}
          >
            <svg
              width={width}
              height={height}
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
              aria-hidden
            >
              {connectors.map((c) => (
                <path
                  key={c.id}
                  d={c.d}
                  fill="none"
                  stroke={c.hue}
                  strokeWidth={3}
                  strokeLinecap="round"
                  opacity={0.7}
                />
              ))}
            </svg>

            {placed.map(({ scion, x, y }) => {
              const es = elementStyle(scion.element);
              return (
                <div
                  key={scion.id}
                  className="clay-sm"
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: NODE_W,
                    height: NODE_H,
                    padding: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: es.soft,
                      boxShadow: 'var(--shadow-inset)',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <VoxelCreature element={scion.element} power={scion.power} seed={scion.id} size={34} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 600,
                        fontSize: 14,
                        lineHeight: 1.1,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 86,
                      }}
                      title={scion.name}
                    >
                      {scion.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <span className="dot" style={{ background: es.hue }} aria-hidden />
                      <span className="font-mono" style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
                        {scion.id} . g{scion.generation}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
