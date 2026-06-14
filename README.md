# Scions

Conjure a creature from a word. Breed two of them and let an on-chain AI decide whose bloodline wins, whether the cross is a balanced hybrid, or whether something unexpected mutates into being. A family tree grows, generation by generation. Built on GenLayer.

## How a creature comes to be

Two ways.

1. Conjure a gen-0 primordial from a seed word. Its element and power are derived from the seed by the contract, no AI involved, so anyone can start a bloodline.
2. Breed any two existing creatures. Here an AI Geneticist judges the cross and rules one of four outcomes, then the contract derives the child from its parents and that ruling. The child remembers both parents, so the menagerie becomes a branching genealogy.

## The four outcomes

- DOMINANT_A: parent A's bloodline leads, and the child leans toward A.
- DOMINANT_B: parent B's bloodline leads.
- HYBRID: a balanced blend of the two.
- MUTATION: something new and unexpected surfaces.

The Geneticist also returns a vigor (0 to 100) and an evocative name for the child.

## Why GenLayer

Deciding how two creatures cross is an open-ended creative judgement, the kind only a language model makes well, but its exact words vary run to run, which a chain cannot agree on. Scions keeps the settlement crisp:

- The Geneticist returns an OUTCOME (one of the four) and a vigor. Validators independently re-run the cross and must agree on the outcome exactly and the vigor within a tolerance. The child's name is flavor and is never compared.
- The child's element and power are derived in deterministic code from the two parents and the agreed outcome, so every validator breeds the identical creature. Gen-0 primordials are fully deterministic from their seed.

The agreement rule is a custom validator passed to `gl.vm.run_nondet_unsafe`, never `strict_eq`.

## Calls

`conjure(seed)` mints a gen-0 primordial (deterministic). `breed(parent_a, parent_b)` is the consensus cross that births a child from two parents. Reads: `get_scions(start)`, `get_scion(id)`, `get_stats()`. No backend, no database, no stake; the whole lineage is contract state.

## The nursery

A soft, playful scrolling page in clay and voxels: a centered logo with the network badge and wallet flanking it, a bouncy clay hero, the menagerie of puffy creature cards, and a branching lineage tree where each child links up to both parents. The footer is one big rounded clay slab. Built with Next.js (static export), framer-motion, and hand-drawn SVG; type in Fredoka, Quicksand, and Noto Sans Mono. No images, every creature is drawn.

## Coordinates

[![play scions](https://img.shields.io/badge/play-scions-bdb2ff?style=for-the-badge)](https://adnanmrabet.github.io/scions/)
[![explorer](https://img.shields.io/badge/explorer-bradbury-a0c4ff?style=for-the-badge)](https://explorer-bradbury.genlayer.com/address/0x07E265c5fE3E6aDA8F9E693584d3af35e50bDD8F)
[![faucet](https://img.shields.io/badge/faucet-test%20GEN-ffb4a2?style=for-the-badge)](https://testnet-faucet.genlayer.foundation/)

Contract: `0x07E265c5fE3E6aDA8F9E693584d3af35e50bDD8F`
Genesis transaction: `0x1674d38002cbefaf537275b32e12b59efc8d4f7d5b2bd89f5576b694421eeb13`

## Run it

```bash
genvm-lint lint contracts/contract.py
gltest tests/integration/ -v -s --network studionet
cd frontend && npm install && npm run dev
```

A browser wallet on GenLayer Bradbury Testnet and a little faucet GEN cover the fees. Conjure the first primordial, then start a bloodline.
