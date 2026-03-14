import { fitCanvas } from './engine/canvas-core.js';
import { ParticleSystem } from './engine/particle-system.js';
import { flowVector } from './engine/flow-field.js';
import { ReactionDiffusion } from './engine/reaction-diffusion.js';
import { drawFractal } from './engine/fractals.js';
import { CellularLife } from './engine/cellular-life.js';
import { brushStroke } from './engine/brush-engine.js';
import { getPalette, MOODS } from './engine/color-engine.js';
import { ModelManager } from './model-manager.js';
import { applyProceduralEdit } from './image-edit.js';
import { proceduralGenerate } from './image-gen.js';
import { loadSettings, saveSettings, readUploadFile } from './file-manager.js';
import { exportPNG } from './export/export-image.js';
import { mountToolbar } from './ui/toolbar.js';
import { setStatus } from './ui/status-indicator.js';
import { bindGestures } from './ui/gesture-controls.js';
import { openUploadPanel } from './ui/upload-panel.js';
import { openSavePanel } from './ui/save-panel.js';
import { openExportPanel } from './ui/export-panel.js';
import { makePanel, clearPanel } from './ui/panels.js';

const canvas=document.getElementById('canvas'), toolbar=document.getElementById('toolbar'), statusEl=document.getElementById('status-indicator'), host=document.getElementById('panel-host');
const {ctx}=fitCanvas(canvas);
const settings={mode:'Generate',mood:'Neon',zoom:1,rot:0,brush:'glow',...loadSettings()};
let palette=getPalette(settings.mood), t=0, quality=1;
const particles=new ParticleSystem(); const rd=new ReactionDiffusion(); const life=new CellularLife();
const mm=new ModelManager((s)=>setStatus(statusEl,`${s.loading?`Loading ${s.loading}… `:''}${s.ready?`Ready ${s.ready}${s.failed?' (fallback)':''} `:''}${s.device?`${s.device}/${s.tier}`:''}`)); await mm.init();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});

function render(){t+=0.016;const w=innerWidth,h=innerHeight;ctx.fillStyle='rgba(10,13,22,.12)';ctx.fillRect(0,0,w,h);
  if(settings.mode==='Generate') proceduralGenerate(ctx,w,h,palette);
  if(settings.mode==='Flow'||settings.mode==='Particles'||settings.mode==='Paint'){particles.update(1,(x,y)=>flowVector(x,y,t));particles.draw(ctx); if(settings.mode==='Flow')particles.emit(w*0.5+Math.sin(t)*w*0.2,h*0.5+Math.cos(t*0.8)*h*0.2,2*quality,palette);}
  if(settings.mode==='Fractal') drawFractal(ctx,w,h,settings.zoom,settings.rot,palette);
  if(settings.mode==='Life'){life.step();life.draw(ctx,w,h);} if(settings.mode==='Color'){const g=ctx.createLinearGradient(0,0,w,h);palette.colors.forEach((c,i)=>g.addColorStop(i/(palette.colors.length-1),c));ctx.fillStyle=g;ctx.fillRect(0,0,w,h);} 
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

mountToolbar(toolbar, async (tool,meta={})=>{
  settings.mode=tool;
  if(meta.advanced){if(tool==='Color'){settings.mood=MOODS[(MOODS.indexOf(settings.mood)+1)%MOODS.length];palette=getPalette(settings.mood);} return;}
  if(tool==='Reset'){ctx.clearRect(0,0,innerWidth,innerHeight);particles.items.length=0;return;}
  if(tool==='AI Assist'){
    const p=makePanel(host,'AI Assist',`<div class='row'><button id='name'>Name</button><button id='palette'>Palette</button></div><div class='row'><button id='mood'>Mood</button><button id='remix'>Remix</button></div><div class='row'><button id='next'>Next Tool</button><button id='describe'>Describe</button></div><small>Short, playful, local helper.</small><div id='aiout'></div>`);
    const outEl = p.querySelector('#aiout');
    const run = async (prompt, fallback) => {
      const m = await mm.load('text');
      if (!m) { outEl.innerHTML = `<p>${fallback}</p>`; return; }
      const out = await m(prompt,{max_new_tokens:36,temperature:.8});
      outEl.innerHTML = `<p>${(out?.[0]?.generated_text||fallback).slice(0,220)}</p>`;
    };
    p.querySelector('#name').onclick=()=>run('Give one short artwork name from abstract colors.','Neon Drift Bloom');
    p.querySelector('#palette').onclick=()=>run(`Suggest one ${settings.mood} palette with 4 hex colors.`,'#00F5FF #FF00D4 #6FFF00 #FFE600');
    p.querySelector('#mood').onclick=()=>run('Describe this abstract art mood in one sentence.','Dreamlike, electric, and fluid.');
    p.querySelector('#remix').onclick=()=>run('Give one line remix idea for abstract art.','Add slow glow dust trails and deeper shadows.');
    p.querySelector('#next').onclick=()=>run(`Given current mode ${settings.mode}, suggest next tool in one line.`,'Try Color next for contrast depth.');
    p.querySelector('#describe').onclick=async()=>{
      const v = await mm.load('vision');
      if (!v) { outEl.innerHTML = '<p>Vision model unavailable, fallback: luminous abstract gradient with energetic particles.</p>'; return; }
      try {
        const image = canvas.toDataURL('image/png');
        const cap = await v(image);
        outEl.innerHTML = `<p>${(Array.isArray(cap)?cap[0]?.generated_text:cap?.generated_text)||'Abstract visual scene.'}</p>`;
      } catch {
        outEl.innerHTML = '<p>Could not analyze image now. Try again after model load.</p>';
      }
    };
    return;
  }
  if(tool==='Upload'){
    openUploadPanel(host, async (kind) => {
      if (kind === 'file') {
        const i = document.createElement('input');
        i.type = 'file';
        i.accept = 'image/*';
        i.onchange = async () => {
          const f = i.files?.[0];
          if (!f) return;
          const img = await readUploadFile(f);
          ctx.drawImage(img, 0, 0, innerWidth, innerHeight);
        };
        i.click();
      }
      if (kind === 'paste') {
        const items = (await navigator.clipboard.read?.()) || [];
        for (const it of items) {
          const t = it.types.find((x) => x.startsWith('image/'));
          if (!t) continue;
          const b = await it.getType(t);
          const img = await readUploadFile(new File([b], 'paste.png', { type: t }));
          ctx.drawImage(img, 0, 0, innerWidth, innerHeight);
          break;
        }
      }
    });
    return;
  }
  if(tool==='Edit'){
    const before = ctx.getImageData(0,0,canvas.width,canvas.height);
    const p=makePanel(host,'Edit',`<label>Strength</label><input id='str' type='range' min='0' max='1' step='0.05' value='0.5'><div class='row'><button id='sty'>Style</button><button id='rep'>Repaint</button></div><div class='row'><button id='mask'>Mask Center</button><button id='compare'>Compare</button></div><small>Model path optional; procedural i2i fallback always available.</small>`);
    let showingBefore=false;
    const centerMask = ()=>{const m=new Uint8Array(canvas.width*canvas.height);const cx=canvas.width/2,cy=canvas.height/2,r=Math.min(canvas.width,canvas.height)*0.22;for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){const i=y*canvas.width+x;m[i]=(Math.hypot(x-cx,y-cy)<r)?1:0;}return m;};
    p.querySelector('#sty').onclick=()=>applyProceduralEdit(ctx,canvas.width,canvas.height,{mode:'style',strength:+p.querySelector('#str').value});
    p.querySelector('#rep').onclick=()=>applyProceduralEdit(ctx,canvas.width,canvas.height,{mode:'repaint',strength:+p.querySelector('#str').value});
    p.querySelector('#mask').onclick=()=>applyProceduralEdit(ctx,canvas.width,canvas.height,{mode:'style',strength:+p.querySelector('#str').value,mask:centerMask()});
    p.querySelector('#compare').onclick=()=>{if(!showingBefore){ctx.putImageData(before,0,0);showingBefore=true;} else location.reload();};
    return;
  }
  if(tool==='Save'){openSavePanel(host,()=>{saveSettings(settings);setStatus(statusEl,'Session saved locally');});return;}
  if(tool==='Export'){openExportPanel(host,(scale)=>exportPNG(canvas,scale));return;}
  clearPanel(host); saveSettings(settings);
});

bindGestures(canvas,{
  tap:(x,y)=>{if(settings.mode==='Particles'||settings.mode==='Flow'||settings.mode==='Paint')particles.emit(x,y,10*quality,palette); if(settings.mode==='Life')life.paint(x/innerWidth,y/innerHeight); if(settings.mode==='Fractal'){settings.zoom*=1.02;}},
  drag:(x,y)=>{if(settings.mode==='Paint') brushStroke(ctx,x,y,settings.brush,palette.colors[(Math.random()*palette.colors.length)|0]); if(settings.mode==='Life') life.paint(x/innerWidth,y/innerHeight); if(settings.mode==='Flow')particles.emit(x,y,4*quality,palette); if(settings.mode==='Reaction') rd.poke(x/innerWidth,y/innerHeight);},
  pinch:(s)=>{settings.zoom=Math.max(.5,Math.min(8,settings.zoom*s));},
  rotate:(a)=>{settings.rot+=a*0.02;},
  longPress:()=>{palette=getPalette('Random');settings.mood=palette.mood;},
  doubleTap:()=>{settings.mode=settings.mode==='Paint'?'Flow':'Paint';setStatus(statusEl,`Mode: ${settings.mode}`);}
});

addEventListener('resize',()=>fitCanvas(canvas));
document.addEventListener('visibilitychange',()=>{if(document.hidden) quality=.7; else quality=1;});

// Desktop drag/drop upload
addEventListener('dragover',(e)=>e.preventDefault());
addEventListener('drop',async(e)=>{
  e.preventDefault();
  const f=e.dataTransfer?.files?.[0];
  if(!f||!f.type.startsWith('image/')) return;
  const img=await readUploadFile(f);
  ctx.drawImage(img,0,0,innerWidth,innerHeight);
});

setStatus(statusEl,`${mm.device}/${mm.tier} • mood ${settings.mood}`);
