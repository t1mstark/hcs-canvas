export const TOOLS=['Generate','Paint','Flow','Particles','Fractal','Life','Color','AI Assist','Upload','Edit','Save','Export','Reset'];
export function mountToolbar(el,onAction){TOOLS.forEach((t,i)=>{const b=document.createElement('button');b.className='tool'+(i===0?' active':'');b.textContent=t;
  b.addEventListener('click',()=>{el.querySelectorAll('.tool').forEach(x=>x.classList.remove('active'));b.classList.add('active');onAction(t);});
  b.addEventListener('contextmenu',(e)=>{e.preventDefault();onAction(t,{advanced:true});});
  el.appendChild(b);
});}
