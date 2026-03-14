import { timestampName } from '../file-manager.js';
export function exportPNG(canvas,scale=1){const c=document.createElement('canvas');c.width=canvas.width*scale;c.height=canvas.height*scale;const x=c.getContext('2d');x.drawImage(canvas,0,0,c.width,c.height);const a=document.createElement('a');a.download=timestampName('hcs-canvas','png');a.href=c.toDataURL('image/png');a.click();}
