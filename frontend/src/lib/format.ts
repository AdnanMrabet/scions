import type { Element, Outcome } from './contract';

export function shortAddress(addr: string, lead = 6, tail = 4): string {
  if (!addr) return '';
  if (addr.length <= lead + tail + 2) return addr;
  return `${addr.slice(0, lead)}...${addr.slice(-tail)}`;
}

const intFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export function formatInt(n: number): string {
  return intFormatter.format(Math.round(Number.isFinite(n) ? n : 0));
}

// ---- element -> pastel hue ----------------------------------------------

export interface ElementStyle {
  label: string;
  hue: string; // solid pastel
  soft: string; // translucent wash for backgrounds
  ink: string; // readable ink on the hue
}

const ELEMENT_STYLE: Record<string, ElementStyle> = {
  EMBER: { label: 'Ember', hue: '#ffb4a2', soft: 'rgba(255,180,162,0.26)', ink: '#7a3a2c' },
  TIDE: { label: 'Tide', hue: '#9bd8d2', soft: 'rgba(155,216,210,0.28)', ink: '#1f5b56' },
  GALE: { label: 'Gale', hue: '#a0c4ff', soft: 'rgba(160,196,255,0.28)', ink: '#2f4a82' },
  STONE: { label: 'Stone', hue: '#d8c7b4', soft: 'rgba(216,199,180,0.32)', ink: '#5e4f3c' },
  SPARK: { label: 'Spark', hue: '#ffe29a', soft: 'rgba(255,226,154,0.34)', ink: '#7a5e1f' },
  SHADE: { label: 'Shade', hue: '#bdb2ff', soft: 'rgba(189,178,255,0.28)', ink: '#453a7a' },
  BLOOM: { label: 'Bloom', hue: '#ffc2e2', soft: 'rgba(255,194,226,0.30)', ink: '#7a3560' },
  FROST: { label: 'Frost', hue: '#c7e6ff', soft: 'rgba(199,230,255,0.34)', ink: '#2f5a82' },
};

export function elementStyle(element: Element): ElementStyle {
  return (
    ELEMENT_STYLE[String(element).toUpperCase()] ?? {
      label: String(element || 'Unknown'),
      hue: '#cfd2e6',
      soft: 'rgba(207,210,230,0.3)',
      ink: '#4a4a64',
    }
  );
}

export const ALL_ELEMENTS: Element[] = [
  'EMBER',
  'TIDE',
  'GALE',
  'STONE',
  'SPARK',
  'SHADE',
  'BLOOM',
  'FROST',
];

// ---- outcome styling -----------------------------------------------------

export interface OutcomeStyle {
  label: string;
  hue: string;
  ink: string;
  blurb: string;
}

const OUTCOME_STYLE: Record<string, OutcomeStyle> = {
  PRIMORDIAL: {
    label: 'Primordial',
    hue: '#d8c7b4',
    ink: '#5e4f3c',
    blurb: 'Conjured from a seed, first of its line.',
  },
  DOMINANT_A: {
    label: 'Dominant A',
    hue: '#a0c4ff',
    ink: '#2f4a82',
    blurb: "Parent A's bloodline carried the cross.",
  },
  DOMINANT_B: {
    label: 'Dominant B',
    hue: '#ffc2e2',
    ink: '#7a3560',
    blurb: "Parent B's bloodline carried the cross.",
  },
  HYBRID: {
    label: 'Hybrid',
    hue: '#a7e8c4',
    ink: '#1f5b46',
    blurb: 'A balanced blend of both parents.',
  },
  MUTATION: {
    label: 'Mutation',
    hue: '#bdb2ff',
    ink: '#453a7a',
    blurb: 'Something unexpected surfaced in the cross.',
  },
};

export function outcomeStyle(outcome: Outcome): OutcomeStyle {
  return (
    OUTCOME_STYLE[String(outcome).toUpperCase()] ?? {
      label: String(outcome || 'Unknown'),
      hue: '#cfd2e6',
      ink: '#4a4a64',
      blurb: '',
    }
  );
}

// Vigor tone: low vitality leans coral, high leans mint.
export function vigorColor(v: number): string {
  if (v >= 70) return '#7fcf9f';
  if (v >= 40) return '#e8c46a';
  return '#ff9a8a';
}
