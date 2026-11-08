// 眼睛保持二分类，嘴巴使用六类。Eyes remain binary; mouth labels have six classes.
export const EXPRESSION_NAMES = ['blinkLeft', 'blinkRight', 'aa', 'ih', 'ou', 'ee', 'oh'];
export const MOUTH_TO_VRM = Object.freeze({closed:null, a:'aa', i:'ih', u:'ou', e:'ee', o:'oh', small:'aa', wide:'aa'});
// 三类开合模型：small/wide 都驱动 aa，只是张开程度不同。Three-class openness model drives aa with different amounts.
export const MOUTH_AMOUNT = Object.freeze({small:0.4, wide:1.0});

// 验证时间顺序和类别；不改写CSV/JSON中的原始预测。
// Validate ordering and labels without modifying the raw predictions.
export function validateTimeline(data) {
  if (!data || ![1, 2].includes(data.schema_version)
      || !Number.isFinite(data.fps) || data.fps <= 0
      || !Array.isArray(data.rows) || !data.rows.length)
    throw new Error('不是有效的 expressions.json');
  let previous = -1;
  for (const row of data.rows) {
    if (!row || !Number.isFinite(row.time_s) || row.time_s < 0 || row.time_s <= previous)
      throw new Error('表情时间必须严格递增');
    previous = row.time_s;
    for (const name of ['screen_left_eye', 'screen_right_eye'])
      if (!['open', 'closed', 'unknown'].includes(row[name]))
        throw new Error('未知眼睛状态：' + name);
    const mouthLabels = [...Object.keys(MOUTH_TO_VRM), 'unknown'];
    // schema=1允许旧二分类数据：open兼容映射到aa；新六类数据不使用open。
    // Support old binary timelines as aa-only playback for compatibility.
    if (data.schema_version === 1) mouthLabels.push('open');
    if (!mouthLabels.includes(row.mouth)) throw new Error('未知嘴型：' + row.mouth);
  }
  return data;
}

// 原视频播放时间是主时钟；二分查找对应帧，超出已处理范围返回null。
// Use the source video's time as the master clock and binary-search its row.
export function findRow(data, time) {
  if (!data || !Number.isFinite(time) || time < 0) return null;
  const rows = data.rows;
  if (time < rows[0].time_s || time >= rows.at(-1).time_s + 1 / data.fps) return null;
  let low = 0, high = rows.length - 1;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (rows[mid].time_s <= time) low = mid;
    else high = mid - 1;
  }
  return rows[low];
}

// 返回7个目标权重，顺序对应EXPRESSION_NAMES。每次从全零开始，避免嘴型残留。
// Build all seven target weights from zero to clear the previous mouth shape.
export function expressionTargets(row, swap = false, mouthGain = 0.7) {
  const targets = Array(EXPRESSION_NAMES.length).fill(0);
  if (!row || row.head_tracking_ok === false) return targets;
  const usable = name => row[name + '_crop_valid'] !== false;
  const leftSource = swap ? 'screen_left_eye' : 'screen_right_eye';
  const rightSource = swap ? 'screen_right_eye' : 'screen_left_eye';
  targets[0] = usable(leftSource) && row[leftSource] === 'closed' ? 1 : 0;
  targets[1] = usable(rightSource) && row[rightSource] === 'closed' ? 1 : 0;
  const gain = Number.isFinite(mouthGain) ? Math.min(1, Math.max(0, mouthGain)) : 0;
  const expression = row.mouth === 'open' ? 'aa' : MOUTH_TO_VRM[row.mouth];
  const index = EXPRESSION_NAMES.indexOf(expression);
  if (usable('mouth') && index >= 2) targets[index] = gain * (MOUTH_AMOUNT[row.mouth] ?? 1);
  return targets;
}
