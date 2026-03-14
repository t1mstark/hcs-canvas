import { gradientAt } from './color-engine.js';
export class ParticleSystem{
  constructor(){this.items=[];this.max=3000;}
  emit(x,y,count=10,palette){for(let i=0;i<count&&this.items.length<this.max;i++) this.items.push({x,y,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,life:40+Math.random()*90,t:Math.random(),palette});}
  update(dt,flow){for(let i=this.items.length-1;i>=0;i--){const p=this.items[i];const [fx,fy]=flow(p.x,p.y);p.vx+=fx*dt;p.vy+=fy*dt;p.x+=p.vx;p.y+=p.vy;p.life-=dt*60;if(p.life<=0)this.items.splice(i,1);} }
  draw(ctx){for(const p of this.items){ctx.fillStyle=gradientAt(p.t,p.palette.colors);ctx.globalAlpha=Math.max(0,p.life/120);ctx.beginPath();ctx.arc(p.x,p.y,1.5,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;}
}