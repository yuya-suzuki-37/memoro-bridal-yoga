// ===================================================================
// 30日ブライダルボディメイク — メインコントローラ
// 問診 → プロファイル → 30日プラン生成 → カレンダー → 日別詳細
// ===================================================================
import { QUESTIONS, buildProfile, planTitle, messageFor, foodFor, SLEEP_CARE,
         DISCLAIMER, PREGNANCY_NOTICE, SAFETY_NOTE, DX_LABEL } from './bridal-data.js?v=16';
import { build30Day, PHASE_INFO, prescriptionFor } from './bridal-program.js?v=16';
import { AREA_LABEL } from './bridal-engine.js?v=16';
import { EVIDENCE } from './evidence-map.js?v=16';

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
        <img src="assets/result-visual.png?v=16" alt="" onerror="this.closest('.rh-visual').classList.add('no-img')">
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
function exerciseCard(ex, phase, taper){
  // 手順末尾の時間・回数(「〜1分。」「45秒。反対も」)は処方バッジと二重になるため表示時に除去。「3秒キープ」等の途中の動作数値は保持
  const cleanStep = h => h
    .replace(/[、。]?\s*各?\d+\s*(回|秒|分|カウント|呼吸)(\s*×\s*\d+\s*セット)?\s*。?\s*$/, '。')
    .replace(/\d+\s*(回|秒|分|カウント|呼吸)。?\s*(反対も|左右交互|逆も|反対側も|反対側)/, '。$2')
    .replace(/^。+\s*/, '')
    .replace(/。。+/g,'。');
  const how = (ex.how||[]).map(cleanStep).filter(h => h && h!=='。').map(h => `<li>${h}</li>`).join('');
  const cues = ex.cues ? `<p class="bm-cue"><b>◎</b> ${ex.cues.do||''}　<b>×</b> ${ex.cues.dont||''}</p>` : '';
  const presc = prescriptionFor(ex, phase, taper);
  const breath = ex.breath ? `<p class="bm-ex-breath">🌬 呼吸：${ex.breath}</p>` : '';
  const modify = ex.modify ? `<p class="bm-ex-modify">💡 きつい時は：${ex.modify}</p>` : '';
  return `<div class="bm-ex">
    <div class="bm-ex-illust">${ex.illustration || ''}</div>
    <div class="bm-ex-body">
      <div class="bm-ex-head"><h5>${ex.name}</h5><span class="bm-ex-presc">${presc}</span></div>
      ${ex.purpose ? `<p class="bm-ex-purpose">${ex.purpose}</p>` : ''}
      ${(()=>{ const ev=EVIDENCE[ex.id]; return ev?`<p class="bm-ex-evidence">🔬 ${ev.badge}<small>${ev.muscle}・${ev.activation} ／ 出典: ${ev.src}</small></p>`:''; })()}
      <ol class="bm-ex-how">${how}</ol>
      ${breath}
      ${cues}
      ${modify}
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
