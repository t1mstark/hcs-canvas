// Feasible fallback: export short animated GIF is intentionally omitted to avoid heavy deps.
// This module can later stream canvas frames into WebM via MediaRecorder.
export function exportAnimationPlaceholder(){return {ok:false,message:'Animated export planned (WebM via MediaRecorder).'};}
