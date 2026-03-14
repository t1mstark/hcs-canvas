import { CanvasEngine, createControls } from './engine.js';
import { AIManager } from './ai.js';

const canvas = document.getElementById('canvas');
const hud = document.getElementById('hud');
const panel = document.getElementById('ai-panel');

const engine = new CanvasEngine(canvas);
const ai = new AIManager(panel);

await ai.detect();
engine.tick();

canvas.addEventListener('pointerdown', (e) => {
  engine.pointer.down = true;
  engine.pointer.x = e.clientX;
  engine.pointer.y = e.clientY;
  engine.pointer.pressure = e.pressure || 0.5;
});
canvas.addEventListener('pointermove', (e) => {
  engine.pointer.x = e.clientX;
  engine.pointer.y = e.clientY;
  engine.pointer.pressure = e.pressure || 0.5;
});
addEventListener('pointerup', () => (engine.pointer.down = false));

let snapshot = null;

createControls(hud, async (action, btn) => {
  [...hud.children].forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');

  if (action === 'AI Assist') {
    const seed = prompt('Kurz-Idee? z.B. neon ocean dream') || 'give me one playful abstract color palette idea';
    const suggestion = await ai.suggest(seed);
    panel.classList.remove('hidden');
    panel.innerHTML = `<b>AI Assist</b><p>${String(suggestion).slice(0, 500)}</p>`;
    return;
  }

  if (action === 'Upload') {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const img = new Image();
      img.onload = () => {
        engine.ctx.drawImage(img, 0, 0, innerWidth, innerHeight);
      };
      img.src = URL.createObjectURL(file);
    };
    input.click();
    return;
  }

  if (action === 'Save') {
    snapshot = engine.ctx.getImageData(0,0,canvas.width,canvas.height);
    panel.classList.remove('hidden');
    panel.innerHTML = '<b>Save</b><p>Snapshot lokal im Speicher abgelegt.</p>';
    return;
  }

  if (action === 'Export') {
    const a = document.createElement('a');
    a.download = `hcs-canvas-${Date.now()}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
    return;
  }

  if (action === 'Reset') {
    engine.particles = [];
    engine.ctx.fillStyle = '#080a13';
    engine.ctx.fillRect(0,0,innerWidth,innerHeight);
    panel.classList.add('hidden');
    return;
  }

  if (action === 'Edit') {
    panel.classList.remove('hidden');
    panel.innerHTML = '<b>Edit</b><p>Fallback aktiv: lokale prozedurale Bearbeitung (Blur/Color Shift kommt als nächstes).</p>';
    return;
  }

  engine.setMode(action);
});
