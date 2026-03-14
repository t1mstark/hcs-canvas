import { makePanel } from './panels.js';
export function openExportPanel(host,onExport){const p=makePanel(host,'Export',`<div class='row'><button id='ex-png'>PNG</button><button id='ex-png2'>Hi-Res PNG</button></div>`);
  p.querySelector('#ex-png').onclick=()=>onExport(1); p.querySelector('#ex-png2').onclick=()=>onExport(2);
}
