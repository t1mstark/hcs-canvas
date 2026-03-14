import { makePanel } from './panels.js';
export function openSavePanel(host,onSave){const p=makePanel(host,'Save',`<div class='row'><button id='save-art'>Save Session</button></div><small>Saves mode, mood, and settings locally.</small>`);p.querySelector('#save-art').onclick=onSave;}
