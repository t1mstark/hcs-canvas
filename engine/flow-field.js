import { noise2 } from './noise.js';
export const flowVector=(x,y,t)=>{const a=noise2(x*0.003+t*0.2,y*0.003-t*0.2)*Math.PI*2;return [Math.cos(a)*0.8,Math.sin(a)*0.8];};