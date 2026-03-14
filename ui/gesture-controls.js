export function bindGestures(canvas,handlers){let pointers=new Map(),lastTap=0,longPressTimer=null;
  const getCenter=()=>{const arr=[...pointers.values()];if(arr.length<2)return null;return {x:(arr[0].x+arr[1].x)/2,y:(arr[0].y+arr[1].y)/2,d:Math.hypot(arr[0].x-arr[1].x,arr[0].y-arr[1].y),a:Math.atan2(arr[1].y-arr[0].y,arr[1].x-arr[0].x)};};
  let pinchStart=null;
  canvas.addEventListener('pointerdown',(e)=>{canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});handlers.tap?.(e.clientX,e.clientY);
    const now=performance.now(); if(now-lastTap<280) handlers.doubleTap?.(); lastTap=now;
    longPressTimer=setTimeout(()=>handlers.longPress?.(e.clientX,e.clientY),420);
  });
  canvas.addEventListener('pointermove',(e)=>{if(!pointers.has(e.pointerId))return;clearTimeout(longPressTimer);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pointers.size===1) handlers.drag?.(e.clientX,e.clientY);
    if(pointers.size===2){const c=getCenter(); if(!pinchStart) pinchStart=c; handlers.pinch?.(c.d/pinchStart.d); handlers.rotate?.(c.a-pinchStart.a);} });
  const end=(e)=>{pointers.delete(e.pointerId);if(pointers.size<2)pinchStart=null;clearTimeout(longPressTimer);};
  canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
}
