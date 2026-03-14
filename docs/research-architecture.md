# HCS Canvas — Research & Architecture (Phase 1)

## 1) WebGPU + Capability Strategy
- Use runtime detection: `navigator.gpu`, adapter request, texture limits, memory heuristics, touch device detection.
- Default execution tiers:
  - Tier A (WebGPU strong): full effects, local AI assist (small/medium model options), higher render resolution.
  - Tier B (WebGPU limited): reduced particle counts, smaller render targets, tiny model only.
  - Tier C (No WebGPU): WebGL2/2D fallback visuals, optional WASM AI pipeline with strict limits.
- Graceful fallback required because support still varies by browser/device policy and flags in some environments.

## 2) Transformers.js Local Inference
- Use `@huggingface/transformers` with `device: 'webgpu'` first, then fallback to WASM.
- Lazy-load pipelines only when user enters AI Assist / Edit flow.
- Keep model warm state in singleton manager; unload on memory pressure or idle timeout.
- Never block render loop; inference runs in Worker when possible and communicates via message channel.

## 3) Model Tiering (User-requested stack)
- Tiny default: `HuggingFaceTB/SmolLM2-135M-Instruct` for prompt remix, palette naming, micro-copy.
- Medium option: `Qwen/Qwen2.5-0.5B-Instruct` for richer guidance on capable hardware.
- Advanced option: `microsoft/Phi-3-mini-4k-instruct` only on high-capability desktop/tablet.
- Vision primary: `Xenova/moondream2` for image mood/scene analysis.
- Vision fallback: `Xenova/vit-gpt2-image-captioning`.
- Embeddings: `mixedbread-ai/mxbai-embed-xsmall-v1` for local semantic memory/style clustering.

## 4) Local Image Creation / Editing Approach
- Core art engine is procedural + simulation-based (particles, flow fields, fractals, life automata), not heavy diffusion.
- Image-to-image editing is filter + mask + brush + transform + style transfer heuristics (all local canvas processing).
- AI Assist suggests palette/style/transform parameters and text labels, but final image synthesis remains browser-local.
- Mask workflow: draw/erase mask, preview blend, commit non-destructively with snapshot history.

## 5) Mobile-first UX Principles Applied
- Open directly into animated living canvas (no blank state).
- Floating bottom control bar, large touch targets (>=44px), thumb-zone optimized.
- Gestures:
  - drag = paint/flow input
  - pinch = zoom/intensity/scale (contextual)
  - long press = quick mode menu
  - two-finger tap = undo
- Keep chrome minimal; controls collapse during active drawing.

## 6) Upload / Save / Export / Share
- Upload via file picker + drag/drop + mobile camera roll.
- Save snapshots to IndexedDB (`idb-keyval` style abstraction).
- Export PNG/JPEG/WebP via offscreen render target.
- Share via Web Share API where supported; fallback download.

## 7) Offline-first + Caching
- PWA-style service worker for static assets and model files (cache-first with version pinning).
- Staged model cache and explicit “clear model cache” setting.
- Persist user presets, palettes, and recent artworks in IndexedDB.

## 8) GitHub Pages Constraints
- Static-only deploy; no backend/session/auth.
- Must support project-base path (`/<repo>/`) with Vite `base` config.
- Bundle splitting + lazy chunks to keep first load fast.
- CI: GitHub Actions build + deploy to Pages artifact.

## 9) Performance & Memory Plan
- Dynamic resolution scaling based on FPS.
- Frame budget governor for particles/simulation iterations.
- Use OffscreenCanvas + Worker when available.
- Texture reuse pools, capped history states, and model unload on pressure.
- “Battery saver” mode auto-activates on mobile when thermal/fps drops.

## 10) Architecture Blueprint
- `src/engine/`: render loop, simulation modules (flow, particles, fractal, life)
- `src/ui/`: floating controls, gesture layer, toasts, sheets
- `src/ai/`: model manager, capability tiering, assistant adapters
- `src/edit/`: mask engine, filters, blend ops, history
- `src/storage/`: IndexedDB persistence, export/share helpers
- `src/app/`: app state and orchestration

## 11) Compliance with Product Requirements
- Browser-only, local-first, no external AI API calls.
- Optional AI, never required for core creation.
- Mobile + desktop responsive.
- Footer only credit line: `made with ❤️ by hcsmedia`.
- No other AI/dev attribution in user-facing UI.
