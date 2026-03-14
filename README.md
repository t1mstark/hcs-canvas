# HCS Canvas

Mobile-first creative art playground for GitHub Pages.

## Features
- Living canvas on load (no empty screen)
- Modes: Generate, Paint, Flow, Particles, Fractal, Life, Color
- Upload (file / drag-drop / paste), Edit, Save, Export PNG + Hi-Res
- AI Assist (local-first, short helper cards)
- Model manager with WebGPU -> WASM fallback
- Graceful fallback when models fail to load
- Offline support via Service Worker

## Local AI Models (on-demand)
- Text low/medium/high: SmolLM2 / Qwen2.5-0.5B / Phi-3-mini
- Vision: moondream2 with vit-gpt2 fallback
- Embeddings: mxbai-embed-xsmall-v1

## Dev
```bash
npm install --include=dev
npm run dev
npm run build
```

## GitHub Pages
- Workflow: `.github/workflows/pages.yml`
- Build uses `BASE_PATH=/<repo>/`

## Privacy
- No backend
- No external inference API
- No login required
- Prompts/images stay local in browser
