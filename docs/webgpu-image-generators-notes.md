# WebGPU Local Image Generator Notes

Evaluated practical browser-local paths:

1. ONNX Runtime Web + WebGPU + SD-Turbo style models
- Fastest true local T2I path currently for browser demos.
- Heavy on VRAM/RAM; best on desktop/laptop GPUs.

2. Transformers.js text-to-image compatible ONNX exports
- Easiest to integrate with existing stack.
- Model availability/compat varies by export; requires graceful fallback.

3. MLC Web Stable Diffusion style runtimes
- Strong local demos, but larger integration and packaging overhead.

Adopted strategy in app:
- Try lightweight local text-to-image pipeline first.
- If unavailable/fails, use procedural generation + image-to-image style transforms.
- Never block UI, never crash the app.
