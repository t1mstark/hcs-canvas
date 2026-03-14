const K='hcs-canvas-settings';
export const saveSettings=(obj)=>localStorage.setItem(K,JSON.stringify(obj));
export const loadSettings=()=>{try{return JSON.parse(localStorage.getItem(K)||'{}')}catch{return {}}};
export function timestampName(prefix='hcs-canvas',ext='png'){const d=new Date();const p=(n)=>String(n).padStart(2,'0');return `${prefix}-${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}.${ext}`;}
export async function readUploadFile(file){const img=new Image();img.src=URL.createObjectURL(file);await img.decode();return img;}
