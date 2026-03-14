import { makePanel } from './panels.js';
export function openUploadPanel(host,onPick){const p=makePanel(host,'Upload',`<div class='row'><button id='up-file'>Choose Image</button><button id='up-paste'>Paste</button></div><small>Camera roll / drag&drop / paste supported.</small>`);
  p.querySelector('#up-file').onclick=()=>onPick('file');
  p.querySelector('#up-paste').onclick=()=>onPick('paste');
}
