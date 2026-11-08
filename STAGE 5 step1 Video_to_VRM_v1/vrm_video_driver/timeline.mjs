// Timeline logic is decoupled from rendering and can be verified independently using node tests.mjs.
export function validateTimeline(data) {
  if(data.schema_version!==1 || !Number.isFinite(data.fps) || data.fps<=0 || !Array.isArray(data.rows) || !data.rows.length)
    throw new Error('不是有效的 expressions.json');
  let previous=-1;
  for(const row of data.rows){
    if(!Number.isFinite(row.time_s)||row.time_s<0||row.time_s<=previous)throw new Error('Expression timestamps must be strictly increasing.');
    previous=row.time_s;
    for(const name of ['screen_left_eye','screen_right_eye','mouth'])
      if(!['open','closed','unknown'].includes(row[name]))throw new Error('未知状态：'+name);
  }
  return data;
}
export function findRow(data,time){
  if(!data || !Number.isFinite(time) || time<0)return null;
  const rows=data.rows;
  if(time<rows[0].time_s||time>=rows[rows.length-1].time_s+1/data.fps)return null;
  let low=0,high=rows.length-1;
  while(low<high){const mid=Math.ceil((low+high)/2);if(rows[mid].time_s<=time)low=mid;else high=mid-1;}
  return rows[low];
}
export function expressionTargets(row,swap=false,mouthGain=0.7){
  if(!row)return [0,0,0];
  // In an unmirrored front-facing video, the eye on the left side of the frame is the person's right eye.
  const left=row[swap?'screen_left_eye':'screen_right_eye']==='closed'?1:0;
  const right=row[swap?'screen_right_eye':'screen_left_eye']==='closed'?1:0;
  return [left,right,row.mouth==='open'?mouthGain:0];
}
