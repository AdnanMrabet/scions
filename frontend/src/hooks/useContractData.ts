'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchScions, fetchStats, Scion, Stats } from '@/lib/contract';

const POLL_MS = 90_000;

export interface ContractData {
  scions: Scion[];
  stats: Stats | null;
  loading: boolean;
  error: string | null;
  diagnostic: boolean;
  refresh: () => Promise<void>;
  setBusy: (busy: boolean) => void;
}

interface Classified {
  message: string;
  diagnostic: boolean;
}

function classifyError(e: unknown): Classified {
  const msg = String(e);
  if (/contract not found|execution reverted|no contract|not deployed/i.test(msg)) {
    return {
      message: 'No Scions contract answers at the configured address on Bradbury yet.',
      diagnostic: true,
    };
  }
  if (/rate limit|429|too many/i.test(msg)) {
    return { message: 'The lineage is rate limiting reads. Retrying shortly.', diagnostic: false };
  }
  return {
    message: 'Could not reach the menagerie. Check your connection and retry.',
    diagnostic: false,
  };
}

export function useContractData(): ContractData {
  const [scions, setScions] = useState<Scion[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [diagnostic, setDiagnostic] = useState(false);

  const alive = useRef(true);
  const busy = useRef(false);

  const load = useCallback(async () => {
    try {
      const [sc, st] = await Promise.all([fetchScions(0), fetchStats()]);
      if (!alive.current) return;
      setScions(sc);
      setStats(st);
      setError(null);
      setDiagnostic(false);
    } catch (e) {
      if (!alive.current) return;
      const c = classifyError(e);
      setError(c.message);
      setDiagnostic(c.diagnostic);
    } finally {
      if (alive.current) setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading((prev) => prev || scions.length === 0);
    await load();
  }, [load, scions.length]);

  const setBusy = useCallback((b: boolean) => {
    busy.current = b;
  }, []);

  useEffect(() => {
    alive.current = true;
    load();
    const id = setInterval(() => {
      if (busy.current) return; // pause polling entirely while a tx is in flight
      load();
    }, POLL_MS);
    return () => {
      alive.current = false;
      clearInterval(id);
    };
  }, [load]);

  return { scions, stats, loading, error, diagnostic, refresh, setBusy };
}
