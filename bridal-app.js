// ===================================================================
// 30日ブライダルボディメイク — メインコントローラ
// 問診 → プロファイル → 30日プラン生成 → カレンダー → 日別詳細
// ===================================================================
import { QUESTIONS, buildProfile, planTitle, messageFor, foodFor, SLEEP_CARE,
         DISCLAIMER, PREGNANCY_NOTICE, SAFETY_NOTE, DX_LABEL } from './bridal-data.js?v=31';
import { build30Day, PHASE_INFO, prescriptionFor } from './bridal-program.js?v=31';
import { AREA_LABEL } from './bridal-engine.js?v=31';
import { EVIDENCE } from './evidence-map.js?v=31';

const $ = s => document.querySelector(s);
const PROGRESS_KEY = 'memoro-bridal-progress-v1';
const RECORD_KEY = 'memoro-bridal-record-v1';
const WEDDING_KEY = 'memoro-bridal-wedding';
const SLOT_LABEL = { start:'開始時', d10:'10日目', d20:'20日目', d30:'30日目' };
let CURRENT_DAYS = [];

// ---- 姿勢診断の結果を受け取る（無料診断ツールから ?dx=key1,key2&type=... で連携）----
const DIAGNOSIS = (() => {
  const p = new URLSearchParams(location.search);
  const dx = p.get('dx');
  if (!dx) return null;
  const keys = dx.split(',').map(s => s.trim()).filter(Boolean);
  return keys.length ? { keys, type: p.get('type') || null } : null;
})();

// ---- LP: ツールを開く ----
document.querySelectorAll('.js-reveal').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  const s = $('#start'); s.hidden = false; s.scrollIntoView({ behavior:'smooth', block:'start' });
}));

// ---- 免責の差し込み ----
$('#bm-foot-disc').textContent = DISCLAIMER;
$('#bm-start-disc').textContent = '※ ' + DISCLAIMER;

// ---- 問診描画 ----
function buildQuestions(){
  const wrap = $('#bm-questions'); wrap.innerHTML = '';
  QUESTIONS.forEach((q, qi) => {
    const fs = document.createElement('fieldset'); fs.className = 'bm-q';
    const hint = q.hint ? `<p class="bm-q-hint">${q.hint}</p>` : '';
    const multi = q.type === 'multi';
    fs.innerHTML = `<legend>Q${qi+1}. ${q.q}${multi?' <span class="bm-multi">複数選択OK</span>':''}</legend>${hint}`;
    const opts = document.createElement('div'); opts.className = 'bm-opts';
    q.o.forEach(op => {
      const lab = document.createElement('label'); lab.className = 'bm-opt';
      const input = multi
        ? `<input type="checkbox" name="${q.id}" value="${op.v}">`
        : `<input type="radio" name="${q.id}" value="${op.v}">`;
      lab.innerHTML = `${input}<span>${op.t}</span>`;
      opts.appendChild(lab);
    });
    fs.appendChild(opts); wrap.appendChild(fs);
  });
  wrap.addEventListener('change', onAnswerChange);
  updateProgress();
}

// 「特にない」と他項目の排他（Q7 safety）
function onAnswerChange(e){
  const t = e.target;
  if (t && t.name === 'safety'){
    if (t.value === 'none' && t.checked){
      document.querySelectorAll('input[name="safety"]').forEach(i => { if (i.value!=='none') i.checked=false; });
    } else if (t.value !== 'none' && t.checked){
      const none = document.querySelector('input[name="safety"][value="none"]'); if (none) none.checked=false;
    }
  }
  updateProgress();
}

function collect(){
  const ans = {};
  QUESTIONS.forEach(q => {
    if (q.type === 'multi'){
      ans[q.id] = [...document.querySelectorAll(`input[name="${q.id}"]:checked`)].map(i => i.value);
    } else {
      const sel = document.querySelector(`input[name="${q.id}"]:checked`);
      ans[q.id] = sel ? sel.value : null;
    }
  });
  return ans;
}
function isComplete(ans){
  return QUESTIONS.every(q => q.type==='multi' ? (ans[q.id] && ans[q.id].length>0) : !!ans[q.id]);
}
function updateProgress(){
  const ans = collect();
  const total = QUESTIONS.length;
  let done = 0;
  QUESTIONS.forEach(q => { if (q.type==='multi' ? (ans[q.id] && ans[q.id].length) : ans[q.id]) done++; });
  $('#bm-progress-bar').style.width = (done/total*100) + '%';
  const txt = $('#bm-progress-text');
  if (done >= total){ txt.textContent = 'すべて回答できました ✓ プランを作成できます'; txt.classList.add('bm-ready'); }
  else { txt.textContent = `${done} / ${total} 問`; txt.classList.remove('bm-ready'); }
}

// ---- 生成 ----
$('#bm-generate').addEventListener('click', async () => {
  const ans = collect();
  if (!isComplete(ans)){ alert('すべての質問にお答えください。'); return; }
  const profile = buildProfile(ans, DIAGNOSIS);
  await runAnalyzing();   // 進捗リング＋項目チェックの演出（診断→結果の"間"を作り込む・kogao統一）
  let days, pregnant = false;
  if (profile.pregnant){
    pregnant = true;
    days = build30Day({ focusAreas:[], careAreas:['lymph','posture'], minutes:10, level:'beginner', careOnly:true });
  } else {
    days = build30Day(profile);
  }
  renderPlan(profile, days, pregnant);
  const r = $('#bm-result'); r.hidden = false; r.scrollIntoView({ behavior:'smooth', block:'start' });
});

// 解析中の演出（進捗リング0→100%＋診断項目が順次チェック）— kogao統一
function runAnalyzing(){
  return new Promise(resolve => {
    const items = ['体のバランス', 'ドレス映えの部位', '姿勢のクセ', '柔軟性・可動域', '当日までの日数'];
    const ov = document.createElement('div');
    ov.className = 'analyzing-ov';
    ov.innerHTML = `
      <div class="az-card">
        <div class="az-ring">
          <svg viewBox="0 0 80 80"><circle class="az-track" cx="40" cy="40" r="34"/><circle class="az-prog" cx="40" cy="40" r="34"/></svg>
          <span class="az-pct">0%</span>
        </div>
        <p class="az-title">あなた専用のプランを組み立てています</p>
        <ul class="az-list">${items.map(t => `<li><span class="az-check"></span>${t}</li>`).join('')}</ul>
      </div>`;
    document.body.appendChild(ov);
    requestAnimationFrame(() => ov.classList.add('in'));
    const lis = ov.querySelectorAll('.az-list li');
    lis.forEach((li, i) => setTimeout(() => li.classList.add('done'), 380 + i * 330));
    const pctEl = ov.querySelector('.az-pct'), progEl = ov.querySelector('.az-prog');
    let p = 0;
    const tick = setInterval(() => {
      p = Math.min(100, p + 2); pctEl.textContent = p + '%';
      progEl.style.strokeDashoffset = String(214 * (1 - p / 100));
      if (p >= 100) clearInterval(tick);
    }, 34);
    setTimeout(() => { ov.classList.add('out'); setTimeout(() => { ov.remove(); resolve(); }, 400); }, 2200);
  });
}

function showLoading(t){ $('#bm-loading-text').textContent = t || '処理中…'; $('#bm-loading').hidden = false; }
function hideLoading(){ $('#bm-loading').hidden = true; }

// ---- 進捗保存(localStorage) ----
function loadProgress(){ try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); } catch(e){ return {}; } }
function saveProgress(p){ try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch(e){} }
function toggleDone(day){ const p = loadProgress(); if (p[day]) delete p[day]; else p[day] = true; saveProgress(p); return p; }

// ---- プラン描画 ----
function renderPlan(profile, days, pregnant){
  CURRENT_DAYS = days;
  const prog = loadProgress();
  const title = pregnant ? 'やさしいマタニティ・ケアプラン' : planTitle(profile);
  const focusLabels = profile.focusAreas.map(a => AREA_LABEL[a]).filter(Boolean).join('・');
  const focusChips = (pregnant ? ['むくみ・巡り','姿勢'] : profile.focusAreas.map(a => AREA_LABEL[a]).filter(Boolean))
    .map(l => `<span class="dx-chip">${l}</span>`).join('');

  const phaseCards = [1,2,3].map(p => {
    const info = PHASE_INFO[p];
    const range = p===1 ? '1-10' : p===2 ? '11-20' : '21-30';
    return `<div class="bm-phase bm-phase-${p}"><span class="bm-phase-en">PHASE ${p}</span>
      <h4>${info.name}<small>Day ${range}</small></h4><p>${info.note}</p></div>`;
  }).join('');

  const cal = days.map(d => {
    const done = prog[d.day] ? ' bm-done' : '';
    const kind = d.isRest ? ' bm-rest' : (d.taper ? ' bm-taper' : '');
    const label = d.isRest ? 'ケア' : (d.taper ? '仕上げ' : `${(d.training||[]).length}種目`);
    return `<button class="bm-cell bm-phase-b${d.phase}${kind}${done}" data-day="${d.day}">
      <span class="bm-cell-day">${d.day}</span><span class="bm-cell-label">${label}</span></button>`;
  }).join('');

  const pregNotice = pregnant ? `<div class="bm-notice">${PREGNANCY_NOTICE}</div>` : '';
  const safetyNotes = (profile.safety||[]).filter(s => SAFETY_NOTE[s]).map(s => `<li>${SAFETY_NOTE[s]}</li>`).join('');
  const safetyBlock = safetyNotes
    ? `<div class="bm-block"><h4>あなたへの注意ポイント</h4><ul class="bm-safety">${safetyNotes}</ul></div>` : '';

  $('#bm-result-body').innerHTML = `
    <section class="result-hero">
      <div class="rh-visual">
        <img src="assets/result-visual.png?v=31" alt="" onerror="this.closest('.rh-visual').classList.add('no-img')">
        <span class="rh-script">your yoga care</span>
      </div>
      <div class="rh-body">
        <p class="announce">YOUR 30-DAY PLAN</p>
        <h2 class="type-name">${title}</h2>
        <div class="dx-chips">${focusChips}</div>
        <p class="type-desc">${focusLabels ? focusLabels+'を中心に／' : ''}挙式まで約${profile.days}日・1日約${profile.minutes}分・自宅でOK</p>
      </div>
    </section>
    <div id="bm-dashboard" class="bm-dashboard">${dashboardHtml()}</div>
    ${pregNotice}
    <div class="bm-phases">${phaseCards}</div>
    ${safetyBlock}
    <div class="bm-block">
      <h4>30日カレンダー</h4>
      <p class="bm-cal-help">日付をタップすると、その日のメニューがひらきます。7・14・21・28日目はリセット（ケア中心）の日です。</p>
      <div class="bm-cal">${cal}</div>
    </div>
    <div class="bm-block bm-record-block">
      <h4>📸 変化を記録する</h4>
      <p class="bm-cal-help">開始時・10日・20日・30日で記録すると、変化がひと目でわかります。🔒 記録は端末内だけに保存され、外部には送信されません。</p>
      <div class="bm-record-slots">
        ${['start','d10','d20','d30'].map(s=>`<button class="bm-rec-slot" data-slot="${s}">${SLOT_LABEL[s]}</button>`).join('')}
      </div>
      <div id="bm-comparison"></div>
    </div>
    <div class="bm-block bm-sleep-block">
      <h4>🌙 いちばん輝くための「眠り」</h4>
      <p class="bm-cal-help">運動・食事と並ぶ第3の柱。睡眠は肌・むくみ・当日のコンディションを大きく左右します。</p>
      <div class="bm-sleep-grid">
        ${SLEEP_CARE.map(x=>`<div class="bm-sleep-item"><span class="bm-sleep-ico">${x.icon}</span><div class="bm-sleep-txt"><b>${x.title}</b><p>${x.body}</p></div></div>`).join('')}
      </div>
    </div>
    <div class="bm-actions"><button class="lx-btn lx-btn-ghost" id="bm-restart">もう一度作る</button></div>
    <p class="pc-disclaimer">${DISCLAIMER}</p>
  `;

  $('#bm-result-body').querySelectorAll('.bm-cell').forEach(b => {
    b.addEventListener('click', () => openDay(+b.dataset.day));
  });
  $('#bm-result-body').querySelectorAll('.bm-rec-slot').forEach(b => {
    b.addEventListener('click', () => openRecordModal(b.dataset.slot));
  });
  renderComparison();
  bindDashboard();
  $('#bm-restart').addEventListener('click', () => {
    $('#bm-result').hidden = true; $('#start').scrollIntoView({ behavior:'smooth', block:'start' });
  });
}

// ---- 日別詳細 ----
// 実写図解があるポーズ(assets/poses/{id}.png)。上司FB「静止イラストでは動きが分からない」→実写＋番号ステップ＋矢印で理解を上げる
const POSE_PHOTOS = new Set(['yg_br_cobra_decolte','yg_br_side_plank','yg_cow_face','yg_seated_twist_y','yg_locust','yg_br_high_plank','yg_half_boat','yg_upward_dog','yg_br_reverse_plank','yg_br_dolphin_plank','yg_dolphin_pose','yg_br_revolved_chair','yg_half_lord_of_fishes',
  'yg_ujjayi','yg_nadi_shodhana','yg_kapalbhati','yg_bhramari','yg_lion_breath','yg_alternate_nostril','yg_kapalabhati','yg_ujjayi_long','yg_body_scan','yg_breath_count','yg_easy_pose','yg_loving_kindness','yg_mantra_meditation','yg_pratipaksha','yg_walking_meditation',
  'yg_corpse','yg_child_pose','yg_legs_up_wall','yg_supine_butterfly','yg_boat_pose','yg_revolved_triangle','yg_sphinx','yg_br_wall_angel',
  'yg_chair','yg_tree','yg_wide_squat','yg_forward_fold_std','yg_br_twist_boat','yg_br_side_plank_twist',
  'yg_seated_fold_y','yg_one_leg_fold','yg_half_pigeon','yg_hero','yg_lotus_prep',
  'yg_locust_pose','yg_cobra','yg_savasana_with_count','yg_legs_wall_y','yg_side_plank_yoga','st_belly_breath','st_box_breath','st_478_breath','st_rib_breath','pl_relaxation_breath',
  'yg_seated_forward_fold','yg_head_to_knee','yg_chair_pose','yg_standing_forward_fold','st_sphinx_release','yg_hero_pose','st_lying_relax','st_seated_fold','st_legs_up_wall','st_pigeon',
  'yg_br_chaturanga','yg_lunge_low','yg_wide_legged_fold','yg_seated_side','yg_spinal_twist','yg_seated_wide_legs','yg_butterfly_pose','yg_supported_bridge','st_butterfly','yg_butterfly_yoga',
  'yg_crow_pose','yg_compass','yg_camel_pose','yg_bow_pose','yg_fish_pose','yg_lizard_pose','yg_br_gate','yg_rag_doll','yg_plow_pose','yg_br_standing_backbend','yg_warrior_reverse','yg_extended_side_angle','yg_br_mermaid','yg_br_reverse_prayer','st_hip_flexor','st_9090_hip','st_supine_figure4','st_neck_lateral','yg_br_thread_needle',
  'st_supine_twist','st_reverse_prayer','st_thread_needle','st_lizard',
  'yg_reclining_hero','st_cat_cow','st_shoulder_circles','yg_frog_pose','st_neck_rotation','st_low_back_rocker','yg_br_table_top','st_wrist_extension','st_outer_hip_stretch','st_hip_circle','st_happy_baby','st_qlrunner','st_calf_stretch','st_quad_stretch','st_inner_thigh_stretch','st_psoas_stretch',
  'st_frog','st_hip_circles','st_shoulder_roll','st_lat_stretch','st_eagle_arm']);
// 瞑想系は姿勢が共通・呼吸の派生は本家と同姿勢→共通画像を共有して枚数を節約（idごとに別画像を作らない）
const POSE_IMG_MAP = {
  yg_alternate_nostril:'yg_nadi_shodhana', yg_kapalabhati:'yg_kapalbhati', yg_ujjayi_long:'yg_ujjayi',
  yg_body_scan:'yg_meditation', yg_breath_count:'yg_meditation', yg_easy_pose:'yg_meditation',
  yg_loving_kindness:'yg_meditation', yg_mantra_meditation:'yg_meditation', yg_pratipaksha:'yg_meditation',
  yg_locust_pose:'yg_locust', yg_cobra:'yg_br_cobra_decolte', yg_savasana_with_count:'yg_corpse', yg_legs_wall_y:'yg_legs_up_wall', yg_side_plank_yoga:'yg_br_side_plank',
  st_belly_breath:'yg_ujjayi', st_box_breath:'yg_ujjayi', st_478_breath:'yg_ujjayi', st_rib_breath:'yg_ujjayi', pl_relaxation_breath:'yg_ujjayi',
  yg_seated_forward_fold:'yg_seated_fold_y', yg_head_to_knee:'yg_one_leg_fold', yg_chair_pose:'yg_chair', yg_standing_forward_fold:'yg_forward_fold_std', st_sphinx_release:'yg_sphinx',
  yg_hero_pose:'yg_hero', st_lying_relax:'yg_corpse', st_seated_fold:'yg_seated_fold_y', st_legs_up_wall:'yg_legs_up_wall', st_pigeon:'yg_half_pigeon',
  st_butterfly:'yg_butterfly_pose', yg_butterfly_yoga:'yg_butterfly_pose',
  st_supine_twist:'yg_spinal_twist', st_reverse_prayer:'yg_br_reverse_prayer', st_thread_needle:'yg_br_thread_needle', st_lizard:'yg_lizard_pose',
  st_frog:'yg_frog_pose', st_hip_circles:'st_hip_circle',
};
// 開始肢位の写真({id}-start.png)があるポーズ。開始→完成の2枚で動きの流れを見せる（上司FB「動きが分からない」対応）
const POSE_STARTS = new Set(['yg_br_cobra_decolte','yg_br_side_plank','yg_cow_face','yg_seated_twist_y','yg_locust','yg_br_high_plank','yg_half_boat','yg_upward_dog','yg_br_reverse_plank','yg_br_dolphin_plank','yg_dolphin_pose','yg_br_revolved_chair','yg_half_lord_of_fishes']);
// ポーズ別オーバーレイ(部位バッジ／2枚の間の動きラベル／1枚時の写真上矢印・番号ピン)
const POSE_OVERLAY = {
  yg_br_cobra_decolte: { target:['背中','デコルテ','お腹の伸び'], flowLabel:'胸を開く',
    arrow:{label:'胸を開く↗',x:26,y:20,w:34,h:44,d:'M20,120 Q10,55 60,18'},
    pins:[{n:1,x:44,y:74},{n:2,x:22,y:40}] },
  yg_br_side_plank:   { target:['二の腕','くびれ'], flowLabel:'腰を持ち上げる' },
  yg_cow_face:        { target:['肩まわり','二の腕'], flowLabel:'背中で組む' },
  yg_seated_twist_y:  { target:['くびれ','背中'], flowLabel:'ねじる' },
  yg_locust:          { target:['背中','お尻'], flowLabel:'持ち上げる' },
  yg_br_high_plank:   { target:['体幹','二の腕'], flowLabel:'一直線に支える' },
  yg_half_boat:       { target:['お腹'], flowLabel:'脚を持ち上げる' },
  yg_upward_dog:      { target:['背中','デコルテ'], flowLabel:'反らす' },
  yg_br_reverse_plank:    { target:['二の腕','背中'], flowLabel:'腰を持ち上げる' },
  yg_br_dolphin_plank:    { target:['二の腕','体幹'], flowLabel:'脚を伸ばす' },
  yg_dolphin_pose:        { target:['肩まわり','背中'], flowLabel:'お尻を上げる' },
  yg_br_revolved_chair:   { target:['くびれ','太もも'], flowLabel:'ねじる' },
  yg_half_lord_of_fishes: { target:['くびれ','背中'], flowLabel:'深くねじる' },
  yg_chair:               { target:['太もも','お尻','体幹'] },
  yg_tree:                { target:['体幹','美姿勢'] },
  yg_wide_squat:          { target:['股関節','内もも','ヒップ'] },
  yg_forward_fold_std:    { target:['もも裏','背中'] },
  yg_br_twist_boat:       { target:['お腹','くびれ'] },
  yg_br_side_plank_twist: { target:['くびれ','二の腕'] },
  yg_seated_fold_y:       { target:['もも裏','背中'] },
  yg_one_leg_fold:        { target:['もも裏','背中'] },
  yg_half_pigeon:         { target:['股関節','お尻'] },
  yg_hero:                { target:['太もも前','美姿勢'] },
  yg_lotus_prep:          { target:['股関節','美姿勢'] },
  yg_br_chaturanga:       { target:['二の腕','体幹'] },
  yg_lunge_low:           { target:['股関節','もも前','デコルテ'] },
  yg_wide_legged_fold:    { target:['もも裏','内もも'] },
  yg_seated_side:         { target:['くびれ','脇腹'] },
  yg_spinal_twist:        { target:['背中','くびれ'] },
  yg_seated_wide_legs:    { target:['内もも','もも裏'] },
  yg_butterfly_pose:      { target:['股関節','内もも'] },
  yg_supported_bridge:    { target:['お尻','もも裏'] },
  st_butterfly:           { target:['股関節','内もも'] },
  yg_butterfly_yoga:      { target:['股関節','内もも'] },
  yg_crow_pose:           { target:['体幹','二の腕'] },
  yg_compass:             { target:['もも裏','肩'] },
  yg_camel_pose:          { target:['デコルテ','背中','お腹の伸び'] },
  yg_bow_pose:            { target:['背中','デコルテ','もも前'] },
  yg_fish_pose:           { target:['デコルテ','首'] },
  yg_lizard_pose:         { target:['股関節','もも裏'] },
  yg_br_gate:             { target:['脇腹','くびれ'] },
  yg_rag_doll:            { target:['背中','もも裏'] },
  yg_plow_pose:           { target:['背中','肩'] },
  yg_br_standing_backbend:{ target:['デコルテ','背中'] },
  yg_warrior_reverse:     { target:['脇腹','太もも'] },
  yg_extended_side_angle: { target:['脇腹','太もも'] },
  yg_br_mermaid:          { target:['脇腹','くびれ'] },
  yg_br_reverse_prayer:   { target:['肩','デコルテ'] },
  st_hip_flexor:          { target:['股関節前','もも前'] },
  st_9090_hip:            { target:['股関節','お尻'] },
  st_supine_figure4:      { target:['お尻','股関節'] },
  st_neck_lateral:        { target:['首','肩'] },
  yg_br_thread_needle:    { target:['肩甲骨','背中'] },
  yg_reclining_hero:      { target:['もも前','股関節前'] },
  st_cat_cow:             { target:['背中','体幹'] },
  st_shoulder_circles:    { target:['肩','肩甲骨'] },
  yg_frog_pose:           { target:['内もも','股関節'] },
  st_neck_rotation:       { target:['首','肩'] },
  st_low_back_rocker:     { target:['腰','お尻'] },
  yg_br_table_top:        { target:['デコルテ','二の腕','体幹'] },
  st_wrist_extension:     { target:['手首','前腕'] },
  st_outer_hip_stretch:   { target:['お尻','股関節'] },
  st_hip_circle:          { target:['股関節','お尻'] },
  st_happy_baby:          { target:['股関節','内もも'] },
  st_qlrunner:            { target:['脇腹','腰'] },
  st_calf_stretch:        { target:['ふくらはぎ'] },
  st_quad_stretch:        { target:['もも前'] },
  st_inner_thigh_stretch: { target:['内もも'] },
  st_psoas_stretch:       { target:['股関節前','もも前'] },
  st_shoulder_roll:       { target:['肩','肩甲骨'] },
  st_lat_stretch:         { target:['脇腹','背中'] },
  st_eagle_arm:           { target:['肩甲骨','肩'] },
};

function exerciseCard(ex, phase, taper){
  // 手順末尾の時間・回数は処方バッジと二重になるため表示時に除去。「3秒キープ」等の途中の動作数値は保持
  const cleanStep = h => h
    .replace(/[、。]?\s*各?\d+\s*(回|秒|分|カウント|呼吸)(\s*×\s*\d+\s*セット)?\s*。?\s*$/, '。')
    .replace(/\d+\s*(回|秒|分|カウント|呼吸)。?\s*(反対も|左右交互|逆も|反対側も|反対側)/, '。$2')
    .replace(/^。+\s*/, '')
    .replace(/。。+/g,'。');
  const steps = (ex.how||[]).map(cleanStep).filter(h => h && h!=='。');
  const presc = prescriptionFor(ex, phase, taper);
  const breath = ex.breath ? `<p class="bm-ex-breath">🌬 呼吸：${ex.breath}</p>` : '';
  const modify = ex.modify ? `<p class="bm-ex-modify">💡 きつい時は：${ex.modify}</p>` : '';
  const evHTML = (()=>{ const ev=EVIDENCE[ex.id]; return ev?`<p class="bm-ex-evidence">🔬 ${ev.badge}<small>${ev.muscle}・${ev.activation} ／ 出典: ${ev.src}</small></p>`:''; })();
  const head = `<div class="bm-ex-head"><h5>${ex.name}</h5><span class="bm-ex-presc">${presc}</span></div>`;
  const purpose = ex.purpose ? `<p class="bm-ex-purpose">${ex.purpose}</p>` : '';

  // ===== 実写図解モード（写真＋部位バッジ＋番号ステップ＋矢印＋◎✕）=====
  if (POSE_PHOTOS.has(ex.id)){
    const ov = POSE_OVERLAY[ex.id] || {};
    const imgId = POSE_IMG_MAP[ex.id] || ex.id;
    const target = (ov.target||[]).length ? `<div class="bm-ex-target">${ov.target.map(t=>`<span>${t}</span>`).join('')}</div>` : '';
    const arrow = ov.arrow ? `<div class="bm-ex-arrow" style="left:${ov.arrow.x}%;top:${ov.arrow.y}%;width:${ov.arrow.w}%;height:${ov.arrow.h}%"><svg viewBox="0 0 100 130"><defs><marker id="ah-${ex.id}" markerWidth="7" markerHeight="7" refX="4" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#C88A82"/></marker></defs><path d="${ov.arrow.d}" fill="none" stroke="#C88A82" stroke-width="4" stroke-linecap="round" stroke-dasharray="1 9" marker-end="url(#ah-${ex.id})"/></svg><span class="bm-ex-arrow-label">${ov.arrow.label}</span></div>` : '';
    const pins = (ov.pins||[]).map(p=>`<span class="bm-ex-pin" style="left:${p.x}%;top:${p.y}%">${p.n}</span>`).join('');
    const stepCards = steps.map((h,i)=>`<div class="bm-fig-step"><span class="n">${i+1}</span><p>${h}</p></div>`).join('');
    const cues = ex.cues ? `<div class="bm-fig-cues"><div class="bm-fig-cue ok"><h6>◎ ポイント</h6><p>${ex.cues.do||''}</p></div><div class="bm-fig-cue ng"><h6>✕ 注意</h6><p>${ex.cues.dont||''}</p></div></div>` : '';
    const stage = POSE_STARTS.has(ex.id)
      ? `<div class="bm-ex-flow">
           <figure class="bm-ex-shot"><img src="assets/poses/${imgId}-start.png?v=31" alt="${ex.name} 開始肢位"><figcaption>① 開始のかたち</figcaption></figure>
           <div class="bm-ex-flow-arrow">${ov.flowLabel?`<span>${ov.flowLabel}</span>`:''}<b>→</b></div>
           <figure class="bm-ex-shot"><img src="assets/poses/${imgId}.png?v=31" alt="${ex.name} 完成肢位"><figcaption>② 完成のかたち</figcaption></figure>
         </div>`
      : `<div class="bm-ex-stage"><img src="assets/poses/${imgId}.png?v=31" alt="${ex.name}">${arrow}${pins}</div>`;
    return `<div class="bm-ex bm-ex-fig">
      ${head}${target}
      ${stage}
      ${purpose}${evHTML}
      <div class="bm-fig-steps">${stepCards}</div>
      ${breath}${cues}${modify}
    </div>`;
  }

  // ===== 現状（SVGイラスト）モード =====
  const how = steps.map(h => `<li>${h}</li>`).join('');
  const cues = ex.cues ? `<p class="bm-cue"><b>◎</b> ${ex.cues.do||''}　<b>×</b> ${ex.cues.dont||''}</p>` : '';
  return `<div class="bm-ex">
    <div class="bm-ex-illust">${ex.illustration || ''}</div>
    <div class="bm-ex-body">
      ${head}${purpose}${evHTML}
      <ol class="bm-ex-how">${how}</ol>
      ${breath}${cues}${modify}
    </div>
  </div>`;
}
function openDay(day){
  const d = CURRENT_DAYS.find(x => x.day === day); if (!d) return;
  const info = PHASE_INFO[d.phase];
  const done = !!loadProgress()[day];
  const card = ex => exerciseCard(ex, d.phase, d.taper);
  const openingHtml = (d.opening||[]).map(card).join('');
  const trainHtml   = (d.training||[]).map(card).join('');
  const careHtml    = (d.care||[]).map(card).join('');
  const closingHtml = (d.closing||[]).map(card).join('');

  $('#bm-day-body').innerHTML = `
    <div class="bm-day-head bm-phase-b${d.phase}">
      <span class="bm-day-phase">PHASE ${d.phase}・${info.name}</span>
      <h3>Day ${d.day}${d.isRest ? '　リセットの日' : ''}</h3>
      <p class="bm-day-msg">${messageFor(d.day)}</p>
    </div>
    ${openingHtml ? `<div class="bm-day-sec"><h4>🌬 ととのえる呼吸</h4>${openingHtml}</div>` : ''}
    ${d.training && d.training.length
      ? `<div class="bm-day-sec"><h4>🔥 効かせる・メイン <small>${info.sets}</small></h4>${trainHtml}</div>` : ''}
    <div class="bm-day-sec"><h4>🌿 ${d.isRest ? '今日のケア' : 'ゆるめる・巡らす'}</h4>${careHtml}</div>
    ${closingHtml ? `<div class="bm-day-sec"><h4>😌 整える</h4>${closingHtml}</div>` : ''}
    <div class="bm-day-food"><b>🍽 今日の食事ワンポイント</b><p>${foodFor(d.day, d.phase)}</p></div>
    <button class="lx-btn ${done ? 'lx-btn-ghost' : 'lx-btn-green'} bm-done-btn" id="bm-done-btn">
      ${done ? '✓ 完了済み（取り消す）' : '今日の分を完了にする'}
    </button>
  `;
  $('#bm-done-btn').addEventListener('click', () => {
    toggleDone(day);
    const cell = document.querySelector(`.bm-cell[data-day="${day}"]`);
    if (cell) cell.classList.toggle('bm-done', !!loadProgress()[day]);
    updateDashboard();
    openDay(day);
  });
  $('#bm-day-modal').hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeDay(){ $('#bm-day-modal').hidden = true; document.body.style.overflow = ''; }
$('#bm-day-close').addEventListener('click', closeDay);
$('#bm-day-modal').addEventListener('click', e => { if (e.target === $('#bm-day-modal')) closeDay(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#bm-day-modal').hidden) closeDay(); });

// ==== 変化の記録（Before/After・端末内のみ保存・外部送信なし）====
function loadRecord(){ try { return JSON.parse(localStorage.getItem(RECORD_KEY)||'{}'); } catch(e){ return {}; } }
function saveRecord(r){ try { localStorage.setItem(RECORD_KEY, JSON.stringify(r)); return true; } catch(e){ alert('保存容量の上限に達しました。写真の枚数を減らして保存してください。'); return false; } }
function closeRecordModal(){ $('#bm-record-modal').hidden = true; document.body.style.overflow=''; }

// 写真は端末内保存のため長辺640pxに縮小（容量節約・外部送信なし）
function shrinkPhoto(file, cb){
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      const max = 640, scale = Math.min(1, max/Math.max(img.width,img.height));
      const cv = document.createElement('canvas');
      cv.width = Math.round(img.width*scale); cv.height = Math.round(img.height*scale);
      cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);
      cb(cv.toDataURL('image/jpeg', 0.72));
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function openRecordModal(slot){
  const rec = loadRecord();
  const d = rec[slot] || {};
  let photo = d.photo || null;
  $('#bm-record-body').innerHTML = `
    <div class="bm-day-head bm-phase-b1">
      <span class="bm-day-phase">RECORD</span>
      <h3>${SLOT_LABEL[slot]}の記録</h3>
      <p class="bm-day-msg">数字と写真で30日の変化を残しましょう。🔒 端末内のみ保存・外部送信なし。</p>
    </div>
    <div class="bm-rec-form">
      <label>二の腕まわり<span>cm</span><input type="number" step="0.1" inputmode="decimal" id="rec-arm" value="${d.arm??''}"></label>
      <label>ウエスト<span>cm</span><input type="number" step="0.1" inputmode="decimal" id="rec-waist" value="${d.waist??''}"></label>
      <label>太もも<span>cm</span><input type="number" step="0.1" inputmode="decimal" id="rec-thigh" value="${d.thigh??''}"></label>
      <label>体重（任意）<span>kg</span><input type="number" step="0.1" inputmode="decimal" id="rec-weight" value="${d.weight??''}"></label>
    </div>
    <label class="bm-rec-photo"><span>写真（任意・全身がおすすめ）</span><input type="file" accept="image/*" id="rec-photo"></label>
    <div id="rec-photo-preview">${photo?`<img src="${photo}" alt="記録写真">`:''}</div>
    <button class="lx-btn lx-btn-green bm-rec-save" id="rec-save">この内容で保存</button>
  `;
  $('#rec-photo').addEventListener('change', e => {
    const f = e.target.files && e.target.files[0]; if(!f) return;
    shrinkPhoto(f, url => { photo = url; $('#rec-photo-preview').innerHTML = `<img src="${url}" alt="記録写真">`; });
  });
  $('#rec-save').addEventListener('click', () => {
    const num = id => { const v = parseFloat($(id).value); return isNaN(v)?null:v; };
    const rec2 = loadRecord();
    rec2[slot] = { date:new Date().toISOString().slice(0,10), arm:num('#rec-arm'), waist:num('#rec-waist'), thigh:num('#rec-thigh'), weight:num('#rec-weight'), photo };
    if (saveRecord(rec2)){ closeRecordModal(); renderComparison(); }
  });
  $('#bm-record-modal').hidden = false;
  document.body.style.overflow = 'hidden';
}

function renderComparison(){
  const box = $('#bm-comparison'); if(!box) return;
  const rec = loadRecord();
  const done = ['start','d10','d20','d30'].filter(s => rec[s]);
  if (!done.length){ box.innerHTML = '<p class="bm-rec-empty">まだ記録がありません。まずは「開始時」をタップして、今の数字を残しましょう。</p>'; return; }
  const first = rec[done[0]], last = rec[done[done.length-1]], hasTwo = done.length > 1;
  const rows = [['arm','二の腕'],['waist','ウエスト'],['thigh','太もも'],['weight','体重']].map(([k,label]) => {
    if (first[k]==null && last[k]==null) return '';
    const dv = (hasTwo && first[k]!=null && last[k]!=null) ? +(last[k]-first[k]).toFixed(1) : null;
    const cls = dv!=null ? (dv<0?'bm-down':(dv>0?'bm-up':'')) : '';
    const dtxt = dv!=null ? (dv<0?'':'+')+dv+(k==='weight'?'kg':'cm') : '—';
    return `<tr><td>${label}</td><td>${first[k]??'—'}</td><td>${hasTwo?(last[k]??'—'):'—'}</td><td class="${cls}">${dtxt}</td></tr>`;
  }).join('');
  const photos = (first.photo || (hasTwo && last.photo)) ? `
    <div class="bm-rec-photos">
      ${first.photo?`<figure><img src="${first.photo}"><figcaption>${SLOT_LABEL[done[0]]}</figcaption></figure>`:''}
      ${hasTwo && last.photo?`<figure><img src="${last.photo}"><figcaption>${SLOT_LABEL[done[done.length-1]]}</figcaption></figure>`:''}
    </div>` : '';
  box.innerHTML = `<div class="bm-rec-compare">
      <table class="bm-rec-table">
        <thead><tr><th>項目</th><th>${SLOT_LABEL[done[0]]}</th><th>${hasTwo?SLOT_LABEL[done[done.length-1]]:'…'}</th><th>変化</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>${photos}
    </div>`;
}

$('#bm-record-close')?.addEventListener('click', closeRecordModal);
$('#bm-record-modal')?.addEventListener('click', e => { if (e.target === $('#bm-record-modal')) closeRecordModal(); });

// ==== 継続ダッシュボード（挙式カウントダウン＋進捗）====
function daysToWedding(){
  const w = localStorage.getItem(WEDDING_KEY);
  if(!w) return null;
  return Math.ceil((new Date(w+'T00:00:00') - new Date()) / 86400000);
}
function progressStats(){
  const p = loadProgress();
  let done=0, streak=0, max=0;
  for(let d=1; d<=30; d++){ if(p[d]){ done++; streak++; max=Math.max(max,streak); } else streak=0; }
  return { doneCount:done, streak:max, rate:Math.round(done/30*100) };
}
function dashboardHtml(){
  const cd = daysToWedding();
  const st = progressStats();
  const cdBlock = cd!=null
    ? `<div class="bm-dash-cdnum">あと<b>${cd<0?0:cd}</b>日</div><div class="bm-dash-cdlabel">挙式・前撮りまで</div><button class="bm-dash-edit" id="bm-wedding-edit">日付を変更</button>`
    : `<div class="bm-dash-cdset"><label>挙式・前撮りの日を入れると、カウントダウンが始まります<input type="date" id="bm-wedding-input"></label></div>`;
  return `
    <div class="bm-dash-cd">${cdBlock}</div>
    <div class="bm-dash-stats">
      <div class="bm-stat"><span class="bm-stat-num">${st.doneCount}<small>/30</small></span><span class="bm-stat-label">達成した日</span></div>
      <div class="bm-stat"><span class="bm-stat-num">${st.streak}<small>日</small></span><span class="bm-stat-label">連続記録</span></div>
      <div class="bm-stat"><span class="bm-stat-num">${st.rate}<small>%</small></span><span class="bm-stat-label">達成率</span></div>
    </div>`;
}
function bindDashboard(){
  const inp = $('#bm-wedding-input');
  if(inp) inp.addEventListener('change', e => { if(e.target.value){ localStorage.setItem(WEDDING_KEY, e.target.value); updateDashboard(); } });
  const edit = $('#bm-wedding-edit');
  if(edit) edit.addEventListener('click', () => { localStorage.removeItem(WEDDING_KEY); updateDashboard(); });
}
function updateDashboard(){
  const el = $('#bm-dashboard'); if(!el) return;
  el.innerHTML = dashboardHtml();
  bindDashboard();
}

// 姿勢診断があれば、問診に反映＋バナー表示（無料診断→有料ヨガ連携）
function applyDiagnosis(){
  if (!DIAGNOSIS) return;
  const postureCb = document.querySelector('input[name="goal"][value="posture"]');
  if (postureCb) postureCb.checked = true;     // 姿勢改善を目標に自動チェック
  updateProgress();
  const labels = DIAGNOSIS.keys.map(k => DX_LABEL[k]).filter(Boolean);
  const head = document.querySelector('#start .lx-sec-head');
  if (head && labels.length){
    const banner = document.createElement('div');
    banner.className = 'bm-dx-banner';
    banner.innerHTML = `<b>✓ 姿勢診断の結果を反映します</b>`
      + `<span>${DIAGNOSIS.type ? DIAGNOSIS.type + '／' : ''}${labels.join('・')} を整えるヨガを重点的に組みます</span>`;
    head.appendChild(banner);
  }
  const s = $('#start'); if (s) s.hidden = false;  // 診断ありは問診をすぐ開く
}

buildQuestions();
applyDiagnosis();
