export class CellularLife{
  constructor(w=140,h=200){this.w=w;this.h=h;this.grid=new Uint8Array(w*h);for(let i=0;i<w*h;i++)this.grid[i]=Math.random()>.82?1:0;}
  paint(nx,ny){const x=(nx*this.w)|0,y=(ny*this.h)|0;for(let j=-2;j<=2;j++)for(let i=-2;i<=2;i++){const xx=x+i,yy=y+j;if(xx<0||yy<0||xx>=this.w||yy>=this.h)continue;this.grid[yy*this.w+xx]=1;}}
  step(){const n=new Uint8Array(this.grid.length);for(let y=0;y<this.h;y++)for(let x=0;x<this.w;x++){let c=0;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){if(!i&&!j)continue;const xx=(x+i+this.w)%this.w,yy=(y+j+this.h)%this.h;c+=this.grid[yy*this.w+xx];}const idx=y*this.w+x;const alive=this.grid[idx];n[idx]=(alive&&(c===2||c===3))||(!alive&&c===3)?1:0;}this.grid=n;}
  draw(ctx,w,h){ctx.fillStyle='rgba(8,13,26,.12)';ctx.fillRect(0,0,w,h);const sx=w/this.w,sy=h/this.h;for(let y=0;y<this.h;y++)for(let x=0;x<this.w;x++)if(this.grid[y*this.w+x]){ctx.fillStyle='rgba(120,255,230,.75)';ctx.fillRect(x*sx,y*sy,sx,sy);}}
}
