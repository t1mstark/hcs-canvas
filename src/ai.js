export class AIManager {
  constructor(panel) {
    this.panel = panel;
    this.device = 'wasm';
    this.ready = { text: false, image: false, embed: false };
    this.queue = Promise.resolve();
    this.models = {};
  }

  async detect() {
    if (navigator.gpu) {
      try {
        const adapter = await navigator.gpu.requestAdapter();
        if (adapter) this.device = 'webgpu';
      } catch {}
    }
    return this.device;
  }

  run(task) {
    this.queue = this.queue.then(task).catch((e) => ({ error: e?.message || String(e) }));
    return this.queue;
  }

  async ensureTextModel(level = 'tiny') {
    if (this.models.text) return;
    this.panel.innerHTML = `<b>AI Assist</b><p>Lade lokales Modell (${level}, ${this.device})…</p>`;
    this.panel.classList.remove('hidden');

    const { pipeline } = await import('@huggingface/transformers');
    const model = level === 'tiny' ? 'HuggingFaceTB/SmolLM2-135M-Instruct' : 'Qwen/Qwen2.5-0.5B-Instruct';
    this.models.text = await pipeline('text-generation', model, {
      device: this.device,
      dtype: this.device === 'webgpu' ? 'q4' : 'q8',
      progress_callback: (p) => {
        this.panel.innerHTML = `<b>AI Assist</b><p>Model lädt… ${Math.round((p.progress||0)*100)}%</p>`;
      }
    });
    this.ready.text = true;
    this.panel.innerHTML = `<b>AI Assist</b><p>Bereit (${model}). Alles lokal.</p>`;
  }

  async suggest(prompt) {
    return this.run(async () => {
      await this.ensureTextModel('tiny');
      const out = await this.models.text(prompt, { max_new_tokens: 48, temperature: 0.8 });
      return out?.[0]?.generated_text || 'Keine Antwort';
    });
  }
}
