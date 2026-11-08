import assert from 'node:assert/strict';
import {EXPRESSION_NAMES,validateTimeline,expressionTargets,findRow} from './timeline_viseme.mjs';
const row = {frame_index:0,time_s:0,head_tracking_ok:true,screen_left_eye:'open',screen_right_eye:'open',mouth:'closed'};
for(const [label,index] of [['closed',-1],['a',2],['i',3],['u',4],['e',5],['o',6],['unknown',-1]]){
 const r={...row,mouth:label};validateTimeline({schema_version:2,fps:25,rows:[r]});
 assert.deepEqual(expressionTargets(r),EXPRESSION_NAMES.map((_,i)=>i===index?.7:0));
}
assert.deepEqual(expressionTargets({...row,screen_left_eye:'closed'}),[0,1,0,0,0,0,0]);
assert.deepEqual(expressionTargets({...row,screen_left_eye:'closed'},true),[1,0,0,0,0,0,0]);
assert.deepEqual(expressionTargets({...row,mouth:'a',mouth_crop_valid:false}),[0,0,0,0,0,0,0]);
assert.deepEqual(expressionTargets({...row,mouth:'a',head_tracking_ok:false}),[0,0,0,0,0,0,0]);
assert.deepEqual(expressionTargets({...row,mouth:'o'},false,2),[0,0,0,0,0,0,1]);
assert.deepEqual(expressionTargets(null),[0,0,0,0,0,0,0]);
assert.deepEqual(expressionTargets({...row,mouth:'open'}),[0,0,.7,0,0,0,0]);
assert.throws(()=>validateTimeline({schema_version:2,fps:25,rows:[{...row,mouth:'open'}]}));
assert.throws(()=>validateTimeline({schema_version:2,fps:25,rows:[row,{...row}]}));
const timeline=validateTimeline({schema_version:2,fps:25,rows:[row,{...row,time_s:.04,frame_index:1,mouth:'o'}]});
assert.equal(findRow(timeline,.039).mouth,'closed');assert.equal(findRow(timeline,.04).mouth,'o');
assert.equal(findRow(timeline,.08),null);assert.equal(findRow(timeline,-1),null);
let weights=expressionTargets({...row,mouth:'a'}), targets=expressionTargets({...row,mouth:'o'});
for(let i=0;i<60;i++)weights=weights.map((w,j)=>w+(1-Math.exp(-(1/60)/.05))*(targets[j]-w));
assert.ok(weights[2]<1e-8);assert.ok(Math.abs(weights[6]-.7)<1e-8);
for(const [label,amt] of [['small',.4],['wide',1]]){const r={...row,mouth:label};validateTimeline({schema_version:2,fps:25,rows:[r]});
 assert.ok(Math.abs(expressionTargets(r,false,1)[2]-amt)<1e-9);}
console.log('通过：三类开合 small/wide 映射。');
console.log('通过：六类映射、左右眼交换、无效ROI、时间同步、旧数据兼容及嘴型淡入淡出。');
