import { detectWebGPU } from './engine/webgpu-core.js';
const TEXT={low:'HuggingFaceTB/SmolLM2-135M-Instruct',medium:'Qwen/Qwen2.5-0.5B-Instruct',high:'microsoft/Phi-3-mini-4k-instruct'};
const VISION={primary:'Xenova/moondream2',fallback:'Xenova/vit-gpt2-image-captioning'};
export class ModelManager{
  constructor(onState){this.onState=onState;this.device='wasm';this.tier='low';this.handles={};this.loading=new Map();this.queue=Promise.resolve();}
  async init(){const gpu=await detectWebGPU();this.device=gpu.supported?'webgpu':'wasm';const mobile=matchMedia('(max-width: 820px)').matches;this.tier=mobile?'low':(gpu.supported?'medium':'low');this.emit({device:this.device,tier:this.tier,ready:this.readyState()});}
  readyState(){return Object.fromEntries(Object.entries(this.handles).map(([k,v])=>[k,!!v]));}
  emit(s){this.onState?.(s);} enqueue(fn){this.queue=this.queue.then(fn);return this.queue;}
  async load(kind){if(this.handles[kind])return this.handles[kind];if(this.loading.has(kind))return this.loading.get(kind);
    const p=this.enqueue(async()=>{this.emit({loading:kind,device:this.device,tier:this.tier});const { pipeline }=await import('@huggingface/transformers');
      let task='text-generation',model=TEXT[this.tier],opts={device:this.device,dtype:this.device==='webgpu'?'q4':'q8'};
      if(kind==='embed'){task='feature-extraction';model='mixedbread-ai/mxbai-embed-xsmall-v1';}
      if(kind==='vision'){task='image-to-text';model=VISION.primary;}
      try {
        this.handles[kind] = await pipeline(task, model, opts);
      } catch (e) {
        if (kind === 'vision') {
          try {
            this.handles[kind] = await pipeline('image-to-text', VISION.fallback, opts);
          } catch {
            this.handles[kind] = null;
          }
        } else {
          this.handles[kind] = null;
        }
      }
      this.emit({ready:kind,readyState:this.readyState(), failed: this.handles[kind] === null});
      return this.handles[kind];
    }).finally(()=>this.loading.delete(kind));
    this.loading.set(kind,p); return p;
  }
}
