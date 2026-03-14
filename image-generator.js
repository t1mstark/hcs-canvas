import { proceduralGenerate } from './image-gen.js';

// Local-first generator with graceful fallback.
export class LocalImageGenerator {
  constructor(modelManager) {
    this.mm = modelManager;
    this.backend = 'procedural';
    this.pipe = null;
    this.loading = null;
  }

  async init() {
    if (this.loading) return this.loading;
    this.loading = (async () => {
      try {
        const { pipeline } = await import('@huggingface/transformers');
        // Experimental: may not be available on all devices/builds.
        this.pipe = await pipeline('text-to-image', 'onnx-community/sdxl-turbo', {
          device: this.mm?.device || 'wasm',
          dtype: this.mm?.device === 'webgpu' ? 'q4' : 'q8',
        });
        this.backend = 'text-to-image';
      } catch {
        this.pipe = null;
        this.backend = 'procedural';
      }
    })();
    return this.loading;
  }

  async generate({ prompt, ctx, w, h, palette }) {
    await this.init();
    if (this.pipe) {
      try {
        const out = await this.pipe(prompt || 'abstract colorful art', {
          num_inference_steps: 1,
          guidance_scale: 0,
        });
        const img = out?.[0] || out?.image || null;
        if (img) {
          ctx.drawImage(img, 0, 0, w, h);
          return { ok: true, mode: this.backend };
        }
      } catch {
        // fallthrough
      }
    }
    proceduralGenerate(ctx, w, h, palette);
    return { ok: true, mode: 'procedural-fallback' };
  }
}
