const moodPalettes={
  Neon:['#00f5ff','#ff00d4','#6fff00','#ffe600'],
  Sunset:['#ff6b6b','#ff8e53','#ffd166','#7b2cbf'],
  Ocean:['#001f54','#034078','#1282a2','#73d2de'],
  Forest:['#1b4332','#2d6a4f','#40916c','#95d5b2'],
  Cyber:['#00ffd1','#0d1b2a','#7b2cbf','#ff4d6d'],
  Monochrome:['#111111','#444444','#888888','#f0f0f0'],
};
export const MOODS=[...Object.keys(moodPalettes),'Random'];
export function getPalette(mood='Random'){if(mood==='Random'){const keys=Object.keys(moodPalettes);mood=keys[Math.floor(Math.random()*keys.length)];} return {mood,colors:moodPalettes[mood]};}
export function gradientAt(t, colors){const n=colors.length-1; const p=Math.max(0,Math.min(0.999,t))*n; const i=Math.floor(p); const f=p-i;
  const a=hexToRgb(colors[i]), b=hexToRgb(colors[i+1]);
  return `rgb(${mix(a.r,b.r,f)|0},${mix(a.g,b.g,f)|0},${mix(a.b,b.b,f)|0})`; }
const mix=(a,b,t)=>a+(b-a)*t;
function hexToRgb(h){const v=parseInt(h.replace('#',''),16); return {r:(v>>16)&255,g:(v>>8)&255,b:v&255};}
