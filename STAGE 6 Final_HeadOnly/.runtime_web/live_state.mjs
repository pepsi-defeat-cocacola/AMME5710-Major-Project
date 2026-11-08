// Latest-state transport, not a video timeline
import {expressionTargets,EXPRESSION_NAMES} from './timeline_viseme.mjs';
export {EXPRESSION_NAMES};
export function usablePacket(packet,elapsedMs){
  return Boolean(packet&&packet.active&&Number.isFinite(packet.age_ms)&&packet.age_ms>=0&&
    Number.isFinite(elapsedMs)&&elapsedMs>=0&&packet.age_ms+elapsedMs<800&&packet.row);
}
export function liveTargets(packet,elapsedMs,swap,gain){
  if(!usablePacket(packet,elapsedMs))return Array(7).fill(0);
  const row=packet.row;
  if(packet.backend==='mediapipe'&&row.continuous&&row.head_tracking_ok){
    const clamp=v=>Number.isFinite(v)?Math.max(0,Math.min(1,v)):0;
    const c=row.continuous;
    // Screen-relative sides use the same mapping as the original player
    return [clamp(swap?c.left_closed:c.right_closed),clamp(swap?c.right_closed:c.left_closed),
      clamp(c.mouth_open)*clamp(gain),0,0,0,0];
  }
  return expressionTargets(row,swap,gain);
}
