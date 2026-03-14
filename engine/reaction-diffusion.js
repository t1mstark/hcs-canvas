// Lightweight Gray-Scott style approximation for playful textures
export class ReactionDiffusion{
  constructor(w=220,h=220){this.w=w;this.h=h;this.a=new Float32Array(w*h).fill(1);this.b=new Float32Array(w*h);}
  poke(nx,ny,r=8){const x=(nx*this.w)|0,y=(ny*this.h)|0;for(let j=-r;j<r;j++)for(let i=-r;i<r;i++){const xx=x+i,yy=y+j;if(xx<1||yy<1||xx>=this.w-1||yy>=this.h-1)continue;this.b[yy*this.w+xx]=1;}}
  step(iter=2){const {w,h,a,b}=this;for(let k=0;k<iter;k++){for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;const lapA=a[i-1]+a[i+1]+a[i-w]+a[i+w]-4*a[i];const lapB=b[i-1]+b[i+1]+b[i-w]+b[i+w]-4*b[i];const feed=0.036,kill=0.062,da=1,db=.5;const av=a[i],bv=b[i];a[i]=av+(da*lapA-av*bv*bv+feed*(1-av))*0.5;b[i]=bv+(db*lapB+av*bv*bv-(kill+feed)*bv)*0.5;}}}
  draw(ctx,w,h,palette){const img=ctx.createImageData(w,h);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const si=((y*this.h/h|0)*this.w+(x*this.w/w|0));const v=Math.max(0,Math.min(1,this.a[si]-this.b[si]));const i=(y*w+x)*4;img.data[i]=v*220;img.data[i+1]=v*140;img.data[i+2]=255-v*190;img.data[i+3]=255;}ctx.putImageData(img,0,0);} }
