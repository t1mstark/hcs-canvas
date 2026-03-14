const MODES = ['Generate','Paint','Flow','Particles','Fractal','Life','Color','AI Assist','Upload','Edit','Save','Export','Reset'];

export class CanvasEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    this.mode = 'Generate';
    this.t = 0;
    this.particles = [];
    this.pointer = { down: false, x: 0, y: 0, pressure: 0.5 };
    this.resize();
    addEventListener('resize', () => this.resize());
  }
  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(innerWidth * dpr);
    this.canvas.height = Math.floor(innerHeight * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  setMode(mode) { this.mode = mode; }
  inject(x, y, count = 20) {
    for (let i=0; i<count; i++) this.particles.push({ x, y, vx:(Math.random()-0.5)*2, vy:(Math.random()-0.5)*2, life: 40+Math.random()*60, hue: (this.t*12+i*7)%360 });
  }
  tick = () => {
    const { ctx } = this;
    this.t += 0.016;
    ctx.fillStyle = 'rgba(8,10,19,0.15)';
    ctx.fillRect(0,0,innerWidth,innerHeight);

    if (this.mode === 'Generate' || this.mode === 'Flow') this.inject(innerWidth*0.5 + Math.sin(this.t*0.7)*innerWidth*0.15, innerHeight*0.5 + Math.cos(this.t*0.4)*innerHeight*0.2, 4);
    if (this.pointer.down) this.inject(this.pointer.x, this.pointer.y, this.mode === 'Particles' ? 12 : 5);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      const a = Math.sin((p.x + p.y) * 0.003 + this.t) * 0.8;
      p.vx += Math.cos(a) * 0.02; p.vy += Math.sin(a) * 0.02;
      p.x += p.vx; p.y += p.vy; p.life -= 1;
      if (p.life <= 0) { this.particles.splice(i,1); continue; }
      ctx.fillStyle = `hsla(${p.hue},100%,70%,${Math.max(0,p.life/100)})`;
      ctx.beginPath(); ctx.arc(p.x,p.y, this.mode === 'Paint' ? 2.3 : 1.6, 0, Math.PI*2); ctx.fill();
    }

    requestAnimationFrame(this.tick);
  }
}

export function createControls(hud, onAction) {
  MODES.forEach((label) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.addEventListener('click', () => onAction(label, btn));
    hud.appendChild(btn);
  });
  hud.firstElementChild?.classList.add('active');
}
