'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlaskConical, Sparkles, RefreshCw } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useContractData } from '@/hooks/useContractData';
import { useTransaction } from '@/hooks/useTransaction';
import { breed as breedTx, conjure as conjureTx, fetchScions, Scion } from '@/lib/contract';
import { CenteredHeader } from '@/components/CenteredHeader';
import { ClayHero } from '@/components/ClayHero';
import { HowItWorks } from '@/components/HowItWorks';
import { ScionCard } from '@/components/ScionCard';
import { ScionCardSkeleton, SlowNote } from '@/components/Skeleton';
import { LineageTree } from '@/components/LineageTree';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { ConjureModal } from '@/components/ConjureModal';
import { BreedModal } from '@/components/BreedModal';
import { ConsensusTheater } from '@/components/ConsensusTheater';
import { BirthReveal } from '@/components/BirthReveal';
import { ToastStack, ToastData, ToastKind } from '@/components/Toast';
import { ClaySlabFooter } from '@/components/ClaySlabFooter';

let toastSeq = 0;

export default function Page() {
  const wallet = useWallet();
  const data = useContractData();
  const conjure = useTransaction();
  const breed = useTransaction();

  const [conjureOpen, setConjureOpen] = useState(false);
  const [breedOpen, setBreedOpen] = useState(false);
  const [birthChild, setBirthChild] = useState<Scion | null>(null);
  const [birthParents, setBirthParents] = useState<{ a: Scion | null; b: Scion | null }>({ a: null, b: null });
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const breedPair = useRef<{ a: string; b: string } | null>(null);

  const pushToast = useCallback((kind: ToastKind, title: string, message?: string, hash?: string) => {
    const id = `t${++toastSeq}`;
    setToasts((prev) => [...prev.slice(-3), { id, kind, title, message, hash }]);
    return id;
  }, []);

  const updateToast = useCallback((id: string, patch: Partial<ToastData>) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ---- conjure ----------------------------------------------------------
  const conjureToastId = useRef<string | null>(null);

  const runConjure = useCallback(
    (seed: string) => {
      if (!wallet.address) {
        pushToast('error', 'No wallet connected', 'Connect a wallet to conjure a scion.');
        return;
      }
      conjureToastId.current = pushToast('loading', 'Conjuring a primordial', `Shaping "${seed}" on Bradbury.`);
      conjure.run({
        account: wallet.address,
        send: (client) => conjureTx(client, seed),
        onBusy: data.setBusy,
        onConfirmed: () => {
          if (conjureToastId.current) {
            updateToast(conjureToastId.current, {
              kind: 'success',
              title: 'A primordial joined the menagerie',
              message: `"${seed}" was conjured and added to the tree.`,
            });
          }
          setConjureOpen(false);
          wallet.refreshBalance();
          data.refresh();
        },
      });
    },
    [wallet, conjure, data, pushToast, updateToast],
  );

  // surface conjure submit + errors through the toast
  const lastConjurePhase = useRef(conjure.state.phase);
  useEffect(() => {
    const prev = lastConjurePhase.current;
    const cur = conjure.state.phase;
    if (prev !== cur) {
      if (cur === 'submitted' && conjureToastId.current && conjure.state.hash) {
        updateToast(conjureToastId.current, { hash: conjure.state.hash });
      }
      if (cur === 'error' && conjureToastId.current) {
        updateToast(conjureToastId.current, {
          kind: 'error',
          title: 'The conjuring stalled',
          message: conjure.state.error ?? 'Please try again.',
        });
        conjureToastId.current = null;
      }
      lastConjurePhase.current = cur;
    }
  }, [conjure.state, updateToast]);

  // ---- breed ------------------------------------------------------------
  const runBreed = useCallback(
    (a: string, b: string) => {
      if (!wallet.address) {
        pushToast('error', 'No wallet connected', 'Connect a wallet to breed a pair.');
        return;
      }
      breedPair.current = { a, b };
      setBreedOpen(false);
      breed.run({
        account: wallet.address,
        send: (client) => breedTx(client, a, b),
        onBusy: data.setBusy,
        onConfirmed: async () => {
          wallet.refreshBalance();
          try {
            const fresh = await fetchScions(0);
            const child = fresh[0] ?? null;
            const pair = breedPair.current;
            const findP = (id?: string) => (id ? fresh.find((s) => s.id === id) ?? null : null);
            setBirthParents({ a: findP(pair?.a), b: findP(pair?.b) });
            setBirthChild(child);
          } catch {
            /* the tree refresh below still reflects the new child */
          }
          data.refresh();
          pushToast('success', 'A new scion hatched', 'The cross settled under consensus and joined the tree.');
        },
      });
    },
    [wallet, breed, data, pushToast],
  );

  const closeTheater = useCallback(() => {
    breed.reset();
  }, [breed]);

  const closeBirth = useCallback(() => {
    setBirthChild(null);
    breed.reset();
    // bring the freshly hatched child into view
    if (typeof document !== 'undefined') {
      document.getElementById('lineage')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [breed]);

  const busy =
    conjure.state.phase === 'wallet' ||
    conjure.state.phase === 'submitted' ||
    conjure.state.phase === 'consensus' ||
    breed.state.phase === 'wallet';

  const canBreed = data.scions.length >= 2;

  const newestId = useMemo(() => (data.scions[0]?.id ?? null), [data.scions]);

  const openConjure = () => setConjureOpen(true);
  const openBreed = () => {
    if (!canBreed) {
      pushToast('info', 'Conjure two first', 'You need at least two scions before you can breed.');
      setConjureOpen(true);
      return;
    }
    setBreedOpen(true);
  };

  return (
    <>
      <CenteredHeader wallet={wallet} />

      <main>
        <ClayHero
          stats={data.stats}
          loading={data.loading}
          onConjure={openConjure}
          onBreed={openBreed}
          canBreed={canBreed}
        />

        <HowItWorks />

        {/* THE MENAGERIE */}
        <section className="section" id="menagerie" aria-labelledby="menagerie-title" style={{ paddingBottom: 40 }}>
          <div className="shell">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <p className="eyebrow">The menagerie</p>
                <h2 id="menagerie-title" style={{ fontSize: 'clamp(28px, 4vw, 42px)', marginTop: 8 }}>
                  Every scion in the lineage
                </h2>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="btn btn-ghost btn-pressed focusable" onClick={() => data.refresh()} aria-label="Refresh the menagerie">
                  <RefreshCw size={15} aria-hidden />
                  Refresh
                </button>
                <button className="btn btn-primary btn-pressed focusable" onClick={openConjure}>
                  <Sparkles size={16} aria-hidden />
                  Conjure
                </button>
                <button className="btn btn-coral btn-pressed focusable" onClick={openBreed} disabled={!canBreed}>
                  <FlaskConical size={16} aria-hidden />
                  Breed
                </button>
              </div>
            </div>

            <div style={{ marginTop: 28 }}>
              {data.error && data.scions.length === 0 ? (
                <ErrorState message={data.error} diagnostic={data.diagnostic} onRetry={() => data.refresh()} />
              ) : data.loading && data.scions.length === 0 ? (
                <>
                  <div className="card-grid">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <ScionCardSkeleton key={i} />
                    ))}
                  </div>
                  <SlowNote active={data.loading} />
                </>
              ) : data.scions.length === 0 ? (
                <EmptyState onConjure={openConjure} />
              ) : (
                <div className="card-grid">
                  {data.scions.map((s) => (
                    <ScionCard key={s.id} scion={s} highlight={s.id === newestId && !!birthChild} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* LINEAGE TREE */}
        <section className="section" id="lineage" aria-labelledby="lineage-title" style={{ paddingTop: 20 }}>
          <div className="shell">
            <p className="eyebrow">Lineage</p>
            <h2 id="lineage-title" style={{ fontSize: 'clamp(28px, 4vw, 42px)', marginTop: 8 }}>
              The branching genealogy
            </h2>
            <div style={{ marginTop: 24 }}>
              {data.scions.length === 0 ? (
                <div className="clay" style={{ padding: '40px 28px', textAlign: 'center', color: 'var(--ink-muted)' }}>
                  The tree takes root once the first scions are conjured.
                </div>
              ) : (
                <LineageTree scions={data.scions} />
              )}
            </div>
          </div>
        </section>
      </main>

      <ClaySlabFooter />

      {/* modals + theater + reveal + toasts */}
      <ConjureModal open={conjureOpen} wallet={wallet} busy={busy} onClose={() => setConjureOpen(false)} onConfirm={runConjure} />
      <BreedModal open={breedOpen} scions={data.scions} wallet={wallet} busy={busy} onClose={() => setBreedOpen(false)} onConfirm={runBreed} />
      <ConsensusTheater state={breed.state} onClose={closeTheater} />
      <BirthReveal child={birthChild} parentA={birthParents.a} parentB={birthParents.b} onClose={closeBirth} />
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <style>{`
        .card-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        }
        @media (max-width: 480px) {
          .card-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
