// ===================================================================
// 30日ブライダルボディメイク — 30日プログラム生成
// Phase 1 (Day1-10)  ととのえる（フォーム習得・慣らし）
// Phase 2 (Day11-20) ひきしめる（強度アップ）
// Phase 3 (Day21-30) しあげる（仕上げ＋当日コンディション調整）
// Day 7,14,21,28 = リセット日（ケアのみ） / Day27-30 = テーパー(追い込み減)
// ===================================================================
import { buildBridalPool, buildFlowPools } from './bridal-engine.js?v=31';
import { evidenceScore } from './evidence-map.js?v=31';

// ポーズの「基本形」名（(くびれ)等の部位サフィックスを除いた核）。同じ基本ポーズが同日に並ぶ重複感を防ぐ
function baseName(ex){
  return (ex.name || ex.id || '').replace(/[（(].*$/, '').trim();
}

// 使用回数が少ない種目から選ぶ（同じ種目の連投＋同じ基本ポーズの同日重複を避ける）
function pickLeastUsed(list, usage, count, excludeIds, excludeBases){
  const ex = new Set(excludeIds);
  const usedBases = new Set(excludeBases || []);
  const sorted = list.filter(e => !ex.has(e.id)).sort((a,b)=>{
    const u = (usage[a.id]||0)-(usage[b.id]||0);
    return u !== 0 ? u : evidenceScore(b.id)-evidenceScore(a.id);  // 同回数ならエビデンスの強いポーズを優先
  });
  const picked = [];
  for (const e of sorted){
    if (picked.length >= count) break;
    const b = baseName(e);
    if (usedBases.has(b)) continue;   // 同じ基本ポーズは同日に入れない
    picked.push(e); usedBases.add(b);
  }
  // 基本名制約で足りない分は制約を外して補完（プールが小さい時の0件防止）
  if (picked.length < count){
    for (const e of sorted){ if (picked.length>=count) break; if (!picked.includes(e)) picked.push(e); }
  }
  if (picked.length < count){
    const rest = list.filter(e => !picked.includes(e)).sort((a,b)=>(usage[a.id]||0)-(usage[b.id]||0));
    while (picked.length < count && rest.length) picked.push(rest.shift());
  }
  return picked;
}

export const PHASE_INFO = {
  1: { key:'phase1', name:'ととのえる', en:'PREPARE',  sets:'各1〜2セット', note:'フォームを覚え、体を動かす習慣を作る10日間。' },
  2: { key:'phase2', name:'ひきしめる', en:'BUILD',    sets:'各2〜3セット', note:'負荷を上げて、気になる部位を集中的に引き締める10日間。' },
  3: { key:'phase3', name:'しあげる',   en:'POLISH',   sets:'各2〜3セット', note:'仕上げ＋当日ベストの肌・コンディションへ整える10日間。' },
};

// 強度3(=負荷が一番高い時期)の目安セット表示をphaseで補正（漸進性の可視化）
export function prescriptionFor(ex, phase, taper){
  const base = ex.duration || '';
  if (taper) return base + '（仕上げ・軽めでOK）';
  if (phase === 1) return base + '（まずはフォーム重視）';
  if (phase === 2) return base + '＋もう1セット';
  return base + '＋しっかり効かせる';
}

// フェーズ別の強度傾斜（漸進性: 週が進むほど負荷が上がり、見た目の変化につながる）
// 過負荷の原則 — 同じ刺激の反復では体は変わらない。高強度(3)はPhase3に温存し単調増加させる。
function poolForPhase(list, phase){
  const lo  = list.filter(e => (e.intensity || 1) <= 2);  // 低〜中(1-2)
  const mid = list.filter(e => (e.intensity || 1) === 2); // 中(2)
  const hi  = list.filter(e => (e.intensity || 1) >= 2);  // 中〜高(2-3)
  if (phase === 1) return lo.length  >= 4 ? lo  : list;   // Day1-10: フォーム習得(低〜中)
  if (phase === 2) return mid.length >= 4 ? mid : (lo.length >= 4 ? lo : list); // Day11-20: 中強度中心(3は温存)
  return hi.length >= 4 ? hi : list;                      // Day21-30: 高強度(3)で仕上げ
}

// ===== メイン: 30日生成 =====
// opts: { focusAreas:[], careAreas:[], minutes:10|20|30, level:'beginner'|'intermediate' }
export function build30Day(opts){
  const { focusAreas=[], careAreas=[], diagnosisKeys=[], safety=[], minutes=20, level='beginner', careOnly=false } = opts||{};
  const pool = buildBridalPool(focusAreas, careAreas, diagnosisKeys, safety);
  const flow = buildFlowPools();
  const tList = pool.training, cList = pool.care;
  const oList = flow.opening, clList = flow.closing;

  // 1日のトレ種目数（時間で調整。中級は+1）
  let trainPerDay = minutes>=30 ? 4 : minutes>=20 ? 3 : 2;
  if (level==='intermediate') trainPerDay += 1;

  const tUsage = Object.fromEntries(tList.map(e=>[e.id,0]));
  const cUsage = Object.fromEntries(cList.map(e=>[e.id,0]));
  const oUsage = Object.fromEntries(oList.map(e=>[e.id,0]));
  const clUsage = Object.fromEntries(clList.map(e=>[e.id,0]));
  const days = [];

  for (let day=1; day<=30; day++){
    const phase  = day<=10 ? 1 : day<=20 ? 2 : 3;
    const isRest = (day % 7 === 0);       // 7,14,21,28
    const taper  = (day >= 27);           // 挙式直前はコンディション優先
    const prev   = days[days.length-1];
    const prevIds = prev ? [...(prev.training||[]), ...(prev.care||[])].map(e=>e.id) : [];

    // 🌬 呼吸(オープニング)・😌 整える(クロージング)は毎日1種ずつ
    const opening = pickLeastUsed(oList, oUsage, 1, prev ? (prev.opening||[]).map(e=>e.id) : []);
    const closing = pickLeastUsed(clList, clUsage, 1, prev ? (prev.closing||[]).map(e=>e.id) : []);

    // 当日の呼吸(opening)・整える(closing)と重複させない（id＋基本ポーズ名の両方で）
    const flowIds = [...opening, ...closing].map(e => e.id);
    const flowBases = [...opening, ...closing].map(baseName);

    let training = [], care = [];
    if (careOnly){
      care = pickLeastUsed(cList, cUsage, isRest ? 2 : 3, [...prevIds, ...flowIds], flowBases);
    } else if (isRest){
      care = pickLeastUsed(cList, cUsage, 3, [...prevIds, ...flowIds], flowBases);
    } else {
      const tCount = taper ? Math.max(2, trainPerDay-1) : trainPerDay;
      training = pickLeastUsed(poolForPhase(tList, phase), tUsage, tCount, [...prevIds, ...flowIds], flowBases);
      const usedIds = training.map(e=>e.id);
      const usedBases = [...flowBases, ...training.map(baseName)];
      care = pickLeastUsed(cList, cUsage, taper ? 3 : 2, [...prevIds, ...usedIds, ...flowIds], usedBases);
    }
    opening.forEach(e => oUsage[e.id]++);
    closing.forEach(e => clUsage[e.id]++);
    training.forEach(e => tUsage[e.id]++);
    care.forEach(e => cUsage[e.id]++);

    days.push({ day, phase, isRest, taper, opening, training, care, closing });
  }
  return days;
}
