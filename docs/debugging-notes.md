# Debugging Notes (concise)

## Tested
- Build pipeline: ✅ `npm run build`
- WebGPU unavailable fallback: ✅ auto switch to WASM
- Model load failure handling: ✅ returns fallback text/vision message
- Touch gestures: tap/drag/pinch/rotate/long-press/double-tap wired
- Upload flows: file picker + drag/drop + clipboard paste
- Save/export flows: local settings + PNG/HiRes export

## Known limits
- True on-device diffusion inpainting/generation is not enabled by default (too heavy on mid-range phones).
- Edit workspace currently uses robust procedural i2i fallback + mask-center region operation.
- Animated export is placeholder (planned via MediaRecorder WebM).

## Performance choices
- Dynamic quality reduction when tab hidden
- Low default model tier on mobile
- Single model queue to avoid overlapping inference
- Lazy model loading only when feature opened
