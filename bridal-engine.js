// ===================================================================
// 30日ブライダルボディメイク — 種目プール生成エンジン
// 既存の3DB(personal=引き締め / pilates=コア / seitai=ケア)を
// 「ブライダル部位」でまとめ、花嫁向けに安全キュレーションする層。
// ===================================================================
import { DB_PERSONAL } from './db-personal.js';
import { DB_PILATES } from './db-pilates.js';
import { DB_SEITAI } from './db-seitai.js';
import { DB_YOGA } from './db-yoga.js?v=17';
import { DB_YOGA_BRIDAL } from './db-yoga-bridal.js?v=17';
import { evidenceScore } from './evidence-map.js?v=17';

// ヨガ主軸: ヨガ(花嫁向け拡充→標準の順)を先頭に置き、同条件ならヨガが優先採用される。
// personal/pilates/seitai は、ヨガで埋まらない部位の「補完」に回る。
const ALL = [...DB_YOGA_BRIDAL, ...DB_YOGA, ...DB_PERSONAL, ...DB_PILATES, ...DB_SEITAI];
export const BY_ID = Object.fromEntries(ALL.map(e => [e.id, e]));

// --- ブライダル部位ラベル ---
export const AREA_LABEL = {
  arm:'二の腕', back:'背中・肩甲骨', decolte:'デコルテ・バスト',
  waist:'ウエスト・お腹', hip_leg:'ヒップ・美脚',
  lymph:'むくみ・スッキリ', posture:'姿勢・立ち姿',
};

// 引き締めトレ対象: 部位 → 既存bodyPart
const AREA_TRAIN_BODYPARTS = {
  arm:     ['arm'],
  back:    ['back','shoulder'],
  decolte: ['chest','shoulder','back'],  // 胸を開く後屈(コブラ/ラクダ等)は back 扱いのため含める
  waist:   ['core','spine'],
  hip_leg: ['leg','hip','hamstring'],
};
// ケア対象(むくみ/姿勢) → 既存bodyPart
const AREA_CARE_BODYPARTS = {
  lymph:   ['leg','foot','neck'],
  posture: ['back','neck','chest','spine','shoulder'],
};

// --- 花嫁向け安全フィルタ ---
// 自宅で無理なくできる道具のみ許可（フォームローラー/ボール/ドア枠/バー/机/階段は除外）
const OK_EQUIP = new Set(['なし','マット','壁','椅子','ソファ/椅子','タオル','クッション']);
// ジャンプ・高衝撃有酸素は花嫁向けに除外。ピラティス固有種目(ソー/スワン等)もヨガツールから除外
const NG_TECH = new Set(['plyometric','cardio','pilates']);

function equipOk(eq){ return !eq || OK_EQUIP.has(eq); }
function safe(ex, safety){
  if (NG_TECH.has(ex.technique)) return false;
  if (!equipOk(ex.equipment)) return false;
  if (ex.intensity >= 4) return false;   // 花嫁(20〜30代)向けに中強度(3)まで許可
  // 不安部位に負担のかかるポーズを除外（中強度i2以上のみ・軽いポーズi1は残してプール枯渇を防ぐ）
  if (safety && safety.length && (ex.intensity||1) >= 2){
    const n = ex.name || '';
    if (safety.includes('waist') &&    // 腰: 強い後屈・脊柱を反らす
        (ex.technique==='backbend' || ex.bodyPart==='spine' ||
         /コブラ|アップドッグ|上向きの犬|ラクダ|ウシュトラ|弓|ダヌラ|ローカスト|バッタ|ブリッジ|橋|反ら/.test(n))) return false;
    if (safety.includes('knee') &&     // 膝: 深く曲げる立位・膝荷重
        (/ウォリアー|戦士|英雄|ヴィーラ|椅子|チェア|ランジ|三角|トリコナ|ピジョン|鳩|正座/.test(n))) return false;
    if (safety.includes('shoulder') && // 肩: 腕で体重を支える
        (ex.bodyPart==='arm' || ex.bodyPart==='shoulder' ||
         /プランク|チャトランガ|ダウンドッグ|下向きの犬|ドルフィン|イルカ|クロウ|鶴|逆転|肩立ち|ヘッドスタンド|プッシュ/.test(n))) return false;
  }
  return true;
}

// --- ケア / トレ 分類 ---
const CARE_TECH = new Set(['stretch','release','mobility','breathing','breath','meditation','massage','pranayama','restorative']);
export function isCare(ex){
  return ex.category==='selfcare' || ex.category==='mobility' || ex.category==='breath'
    || CARE_TECH.has(ex.technique);
}
export function isTraining(ex){ return !isCare(ex); }

const isYogaEx = ex => ex.courses && ex.courses.includes('yoga');
function byBodyParts(parts, pred, yogaOnly, safety){
  const set = new Set(parts);
  return ALL.filter(ex => safe(ex, safety) && set.has(ex.bodyPart) && pred(ex) && (!yogaOnly || isYogaEx(ex)));
}
function addUnique(map, list){ list.forEach(ex => { if (!map.has(ex.id)) map.set(ex.id, ex); }); }

// 姿勢診断の problemKeys に効くヨガ（targetProblemsマッチ）を集める。
// 姿勢連携で最優先に採用する種目群。診断なし(空)なら [] を返す。
export function byProblems(problemKeys, pred, safety){
  const keys = new Set(problemKeys || []);
  if (!keys.size) return [];
  return ALL.filter(ex => safe(ex, safety) && isYogaEx(ex) && pred(ex)
    && ex.targetProblems && ex.targetProblems.some(p => keys.has(p)));
}

// 同じ基本ポーズ(例: コブラ(ブジャンガーサナ)とコブラ(デコルテ強調))はプールに1つだけ残す。
// 「DBが命」— 重複ポーズはエビデンスの強い方を優先、同点なら花嫁特化版、それも同点なら配列順(ヨガ拡充が先頭)を維持。
function baseName(ex){ return (ex.name || ex.id || '').replace(/[（(].*$/, '').trim(); }
function dedupeByBase(list){
  const best = new Map();
  for (const ex of list){
    const b = baseName(ex);
    const cur = best.get(b);
    if (!cur){ best.set(b, ex); continue; }
    const ds = evidenceScore(ex.id) - evidenceScore(cur.id);
    if (ds > 0){ best.set(b, ex); continue; }
    if (ds === 0){
      const exBridal = !!(ex.bridalArea || ex.bridalBenefit);
      const curBridal = !!(cur.bridalArea || cur.bridalBenefit);
      if (exBridal && !curBridal) best.set(b, ex);
    }
  }
  return [...best.values()];  // 各基本ポーズ1つ・id/基本名ともにユニーク・挿入順(≒元の並び)を維持
}

// ===== プール生成 =====
// focusAreas: 引き締めたい部位(Q4) / careAreas: むくみ・姿勢など(Q5派生)
export function buildBridalPool(focusAreas, careAreas, diagnosisKeys, safety){
  const train = new Map();
  const care  = new Map();
  const TRAIN_MIN = 8, CARE_MIN = 10;

  // ===== 0) 姿勢診断があれば、その姿勢問題に効くヨガを最優先で入れる =====
  addUnique(train, byProblems(diagnosisKeys, isTraining, safety));
  addUnique(care,  byProblems(diagnosisKeys, isCare, safety));

  // ===== 1) まずヨガだけで集める（ヨガ主軸）=====
  (focusAreas||[]).forEach(a => {
    const parts = AREA_TRAIN_BODYPARTS[a];
    if (parts) addUnique(train, byBodyParts(parts, isTraining, true, safety));
  });
  (careAreas||[]).forEach(a => {
    const parts = AREA_CARE_BODYPARTS[a];
    if (parts) addUnique(care, byBodyParts(parts, isCare, true, safety));
  });
  // 選択部位のヨガのストレッチ/リリースもケアに混ぜる
  (focusAreas||[]).forEach(a => {
    const parts = AREA_TRAIN_BODYPARTS[a];
    if (parts) addUnique(care, byBodyParts(parts, isCare, true, safety));
  });
  // ケアはヨガの休息・呼吸・ストレッチ系を部位に縛られず広く採用（ヨガ主軸を維持）
  addUnique(care, ALL.filter(ex => isYogaEx(ex) && isCare(ex) && safe(ex, safety)));

  // ===== 2) ヨガで不足する分だけ、他DB(自重/ピラティス/整体)で補完 =====
  if (train.size < TRAIN_MIN){
    (focusAreas||[]).forEach(a => {
      const parts = AREA_TRAIN_BODYPARTS[a];
      if (parts) addUnique(train, byBodyParts(parts, isTraining, false, safety));
    });
  }
  if (train.size < TRAIN_MIN){
    addUnique(train, ALL.filter(ex =>
      safe(ex, safety) && isTraining(ex) && ['core','leg','fullbody','whole','hip'].includes(ex.bodyPart)));
  }
  if (care.size < CARE_MIN){
    (careAreas||[]).forEach(a => {
      const parts = AREA_CARE_BODYPARTS[a];
      if (parts) addUnique(care, byBodyParts(parts, isCare, false, safety));
    });
  }
  if (care.size < CARE_MIN){
    addUnique(care, byBodyParts(['leg','foot','neck','back','chest','spine','core'], isCare, false, safety));
  }

  return { training: dedupeByBase([...train.values()]), care: dedupeByBase([...care.values()]) };
}

// UI用: プール統計
export function poolStats(focusAreas, careAreas){
  const p = buildBridalPool(focusAreas, careAreas);
  return { training:p.training.length, care:p.care.length, total:p.training.length+p.care.length };
}

// レッスンの流れ用: 呼吸(オープニング)と休息(クロージング)のヨガプール
export function buildFlowPools(){
  const opening = ALL.filter(ex => isYogaEx(ex) && safe(ex) &&
    (ex.category==='breath' || ex.category==='pranayama' || ex.category==='meditation'
     || ex.technique==='breathing' || ex.technique==='pranayama' || ex.technique==='meditation'));
  const closing = ALL.filter(ex => isYogaEx(ex) && safe(ex) && ex.technique==='restorative');
  return { opening, closing };
}
