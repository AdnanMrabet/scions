import { createClient } from 'genlayer-js';
import { testnetBradbury } from 'genlayer-js/chains';

// Placeholder until the Scions contract is deployed on Bradbury. The frontend
// reads and writes through these; deployment swaps the zero address in.
export const CONTRACT_ADDRESS =
  '0x07E265c5fE3E6aDA8F9E693584d3af35e50bDD8F' as const;
export const DEPLOY_TX =
  '0x1674d38002cbefaf537275b32e12b59efc8d4f7d5b2bd89f5576b694421eeb13' as const;
export const EXPLORER = 'https://explorer-bradbury.genlayer.com';
export const FAUCET = 'https://testnet-faucet.genlayer.foundation/';
export const DOCS = 'https://docs.genlayer.com';

export const readClient = createClient({ chain: testnetBradbury });

export const makeWalletClient = (account: `0x${string}`) =>
  createClient({ chain: testnetBradbury, account });

export type WalletClient = ReturnType<typeof makeWalletClient>;

const ADDRESS = CONTRACT_ADDRESS as `0x${string}`;

// ---- shapes returned by the contract views ------------------------------

export type Element =
  | 'EMBER'
  | 'TIDE'
  | 'GALE'
  | 'STONE'
  | 'SPARK'
  | 'SHADE'
  | 'BLOOM'
  | 'FROST'
  | string;

export type Outcome =
  | 'PRIMORDIAL'
  | 'DOMINANT_A'
  | 'DOMINANT_B'
  | 'HYBRID'
  | 'MUTATION'
  | string;

export interface Scion {
  id: string;
  name: string;
  element: Element;
  power: number;
  generation: number;
  parent_a: string;
  parent_b: string;
  outcome: Outcome;
  vigor: number;
  breeder: string;
}

export interface Stats {
  scions: number;
  broods: number;
  elements: number;
}

// ---- resilient reads ----------------------------------------------------

export async function withRpcRetry<T>(fn: () => Promise<T>, tries = 4): Promise<T> {
  let last: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (!/rate limit|429|timeout|network|fetch|too many/i.test(String(e))) throw e;
      // backoff: 2.5s, 5s, 10s, 20s
      await new Promise((r) => setTimeout(r, 2500 * 2 ** i));
    }
  }
  throw last;
}

function toRecord<T>(value: unknown): T {
  if (value instanceof Map) {
    const obj: Record<string, unknown> = {};
    for (const [k, v] of value.entries()) obj[String(k)] = normalize(v);
    return obj as T;
  }
  return value as T;
}

function normalize(value: unknown): unknown {
  if (value instanceof Map) return toRecord(value);
  if (Array.isArray(value)) return value.map(normalize);
  if (typeof value === 'bigint') return value.toString();
  return value;
}

function num(v: unknown): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'bigint') return Number(v);
  const n = Number(String(v ?? '0'));
  return Number.isFinite(n) ? n : 0;
}

function asScion(raw: unknown): Scion {
  const r = toRecord<Record<string, unknown>>(raw);
  return {
    id: String(r.id ?? ''),
    name: String(r.name ?? ''),
    element: String(r.element ?? ''),
    power: num(r.power),
    generation: num(r.generation),
    parent_a: String(r.parent_a ?? ''),
    parent_b: String(r.parent_b ?? ''),
    outcome: String(r.outcome ?? ''),
    vigor: num(r.vigor),
    breeder: String(r.breeder ?? ''),
  };
}

export async function fetchScions(start = 0): Promise<Scion[]> {
  const raw = await withRpcRetry(() =>
    readClient.readContract({ address: ADDRESS, functionName: 'get_scions', args: [start] }),
  );
  const arr = (normalize(raw) as unknown[]) ?? [];
  return arr.map(asScion);
}

export async function fetchScion(id: string): Promise<Scion> {
  const raw = await withRpcRetry(() =>
    readClient.readContract({ address: ADDRESS, functionName: 'get_scion', args: [id] }),
  );
  return asScion(normalize(raw));
}

export async function fetchStats(): Promise<Stats> {
  const raw = await withRpcRetry(() =>
    readClient.readContract({ address: ADDRESS, functionName: 'get_stats', args: [] }),
  );
  const r = toRecord<Record<string, unknown>>(normalize(raw));
  return {
    scions: num(r.scions),
    broods: num(r.broods),
    elements: num(r.elements),
  };
}

// ---- writes -------------------------------------------------------------

export function conjure(client: WalletClient, seed: string) {
  return client.writeContract({
    address: ADDRESS,
    functionName: 'conjure',
    args: [seed],
    value: 0n,
  });
}

export function breed(client: WalletClient, parentA: string, parentB: string) {
  return client.writeContract({
    address: ADDRESS,
    functionName: 'breed',
    args: [parentA, parentB],
    value: 0n,
  });
}

// ---- transaction polling ------------------------------------------------

const STATUS_NAME: Record<string, string> = {
  '1': 'PENDING',
  '2': 'PROPOSING',
  '3': 'COMMITTING',
  '4': 'REVEALING',
  '5': 'ACCEPTED',
  '6': 'UNDETERMINED',
  '7': 'FINALIZED',
  '8': 'CANCELED',
  '12': 'VALIDATORS_TIMEOUT',
  '13': 'LEADER_TIMEOUT',
};

export const statusName = (s: unknown): string =>
  STATUS_NAME[String(s)] ?? String(s ?? 'PENDING').toUpperCase();

// LEADER_TIMEOUT (13) / VALIDATORS_TIMEOUT (12) are intentionally absent from
// the terminal set: the network rotates the leader and retries, so keep polling
// through them rather than treating them as failures.
const TERMINAL = new Set(['ACCEPTED', 'FINALIZED', 'UNDETERMINED', 'CANCELED']);

export interface LeaderDraft {
  outcome: string;
  vigor?: number;
  name?: string;
}

function pick(obj: unknown, key: string): unknown {
  if (obj instanceof Map) return obj.get(key);
  if (obj && typeof obj === 'object') return (obj as Record<string, unknown>)[key];
  return undefined;
}

// The Geneticist seals its read into the leader receipt's base64 eq_outputs.
// Peek it so the UI can show the leaning {outcome, vigor} before consensus.
export function extractLeaderDraft(tx: unknown): LeaderDraft | null {
  try {
    const receipts = pick(pick(tx, 'consensus_data'), 'leader_receipt');
    const first = Array.isArray(receipts) ? receipts[0] : receipts;
    const b64 = pick(pick(first, 'eq_outputs'), '0');
    if (typeof b64 !== 'string' || b64.length === 0) return null;
    const text = atob(b64);
    for (let i = text.length - 1; i >= 0; i--) {
      if (text[i] !== '{') continue;
      try {
        const obj = JSON.parse(text.slice(i));
        if (obj && typeof obj === 'object' && 'outcome' in obj) return obj as LeaderDraft;
      } catch {
        /* keep scanning toward the start for a parseable object */
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function pollUntilDecided(
  client: WalletClient,
  hash: `0x${string}`,
  onUpdate?: (status: string, draft: LeaderDraft | null) => void,
): Promise<{ status: string; draft: LeaderDraft | null }> {
  let draft: LeaderDraft | null = null;
  for (let i = 0; i < 150; i++) {
    const tx = await client
      .getTransaction({ hash } as Parameters<typeof client.getTransaction>[0])
      .catch(() => null);
    const status = statusName(tx ? (tx as { status?: unknown }).status : 'PENDING');
    draft = extractLeaderDraft(tx) ?? draft;
    onUpdate?.(status, draft);
    if (TERMINAL.has(status)) return { status, draft };
    await new Promise((r) => setTimeout(r, 8000));
  }
  return { status: 'TIMEOUT', draft };
}
