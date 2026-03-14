export function applyProceduralEdit(ctx,w,h,{mode='style',strength=.5,mask=null}={}){const img=ctx.getImageData(0,0,w,h);const d=img.data;
  for(let i=0;i<d.length;i+=4){const m=mask?mask[i/4]:1;if(!m)continue;const r=d[i],g=d[i+1],b=d[i+2];
    if(mode==='style'){d[i]=Math.min(255,r*(1+0.2*strength)+20*strength);d[i+1]=Math.min(255,g*(1-0.05*strength));d[i+2]=Math.min(255,b*(1+0.25*strength));}
    if(mode==='repaint'){const gray=(r+g+b)/3;d[i]=gray*(1-strength)+r*strength;d[i+1]=gray*(1-strength)+g*strength;d[i+2]=gray*(1-strength)+b*strength;}
  }ctx.putImageData(img,0,0);
}
