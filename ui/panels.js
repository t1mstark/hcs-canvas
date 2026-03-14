export function makePanel(host,title,html){const el=document.createElement('article');el.className='panel';el.innerHTML=`<b>${title}</b><div class="body">${html}</div>`;host.innerHTML='';host.appendChild(el);return el;}
export function clearPanel(host){host.innerHTML='';}
