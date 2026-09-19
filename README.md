# C_TS452 — Practical Assessment Runbook

An interactive, offline-capable runbook for the hands-on portion of
**SAP Certified Associate – Implementation Consultant – SAP S/4HANA Cloud Private Edition,
Sourcing and Procurement** (C_TS452, course version 2601).

Five system tasks, 38 graded steps, with the click paths, exact field values, and the
prerequisites the exam text leaves out.

> Study aid. Not official SAP courseware, and not affiliated with SAP SE.

---

## Use it

Open **`index.html`**, type your group number once, and every `##` on every page resolves
itself — `Y0##` → `Y007`, `C_TS452_##` → `C_TS452_07`. Set your decimal notation and every
amount reformats to what you must actually type.

| Page | What it is |
|---|---|
| `index.html` | Hub — setup, run order, silent killers, cheat sheet, final verification sweep |
| `task3.html` | Configuration & Master Data — 10 steps, 55 min |
| `task4.html` | Procure to Pay — 7 steps, 25 min |
| `task5.html` | Subcontracting — 7 steps, 30 min |
| `task6.html` | Contract Processing — 4 steps, 30 min |
| `task7.html` | Material Requirements Planning — 10 steps, 35 min |
| `edge-cases.html` | Hidden prerequisites, version forks, blocking errors |

### Features

- **Copyable chips** on every value, transaction code and amount
- **Click paths** as breadcrumbs, with the T-code as its own copy button
- Tiered callouts: ☠ silent killer · ⚠ pitfall · ⚖ judgment call · ✓ done-when
- Per-task **timer** against budget, **progress** tracking, **log fields** for document numbers
- Light/dark, responsive down to phone width, print-friendly (auto-expands everything)
- Works offline after the first visit when served over HTTPS

### Markers

**⚖ Judgment call** marks a place where the exam wording permits two readings. The
recommendation and the reasoning are both given, so the decision is made once rather than
re-argued under time pressure.

---

## Publish on GitHub Pages

The site is plain static HTML with no build step. Two ways:

**A. Publish this folder as the site root**

Put the contents of this folder at the repository root, then
*Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`*.

**B. Keep it in a subfolder**

GitHub Pages only serves from the repo root or `/docs`. Rename this folder to `docs/`, then
*Settings → Pages → Source: Deploy from a branch → `main` / `/docs`*.

### Already handled

- `.nojekyll` — stops Jekyll from processing the site and from hiding files that begin with `_`
- All links are **relative**, so the site works under a project sub-path (`user.github.io/repo/`)
- All filenames are lowercase — GitHub Pages is case-sensitive, Windows is not
- `manifest.webmanifest` + `assets/icon.svg` — installable to a phone home screen
- `sw.js` — service worker, network-first for pages and cache-first for assets, so the runbook
  keeps working with no connection. It registers only on HTTPS or localhost.

### After changing any file

Bump `CACHE` in `sw.js` (`cts452-v1` → `cts452-v2`) so returning visitors get the new version
instead of the cached one.

---

## Local use

Double-click `index.html`. Everything works from `file://` except the service worker.

Browser storage is per-origin; from `file://` some browsers block it, in which case a banner
says so — ticks and notes then last only until reload. To guarantee persistence locally:

```bash
python -m http.server 8080
```

then open <http://localhost:8080>.

---

## Source

Built from `C_TS452_EN_2601_Task_Instructions.pdf`. Content is a reconstruction of what each
task requires plus standard S/4HANA behaviour — screen positions vary between releases, and the
pages give fallback locations where that is likely.
