// ===================================================================
// エビデンス・マップ — ポーズID → 研究データ
// 既存DB(db-yoga.js / db-yoga-bridal.js)を汚さず後付けする層。
// engine が処方優先度に、UI が「研究データ」表示に使う。
//
// grade（エビデンスの強さ）: 'meta'（メタ分析）> 'RCT' > 'EMG' > 'qualitative'（定性）
// strong: 筋活動が筋力向上域(>45〜50%MVIC)に届く＝各部位のエビデンス最強ポーズ
// activation: 筋名を含めず「数値/レベル」のみ（muscleと重複させない）
// 出典は scratchpad/evidence-*.md（姿勢/体組成/EMG）に基づく。断定を避けた表現に。
// ===================================================================

export const EVIDENCE = {
  // ── くびれ・お腹（腹斜筋・腹直筋）──
  yg_boat_pose:          { area:'お腹',   muscle:'腹直筋・腹横筋', activation:'>50%MVC', grade:'EMG', strong:true,  badge:'腹部の活動がヨガ内で最も高い', src:'Ni 2014 (PubMed 24731894)' },
  yg_half_boat:          { area:'お腹',   muscle:'腹直筋',        activation:'中〜高',   grade:'EMG', strong:false, badge:'舟の初級版・腹部に効く',       src:'Ni 2014' },
  yg_side_plank_yoga:    { area:'くびれ', muscle:'外腹斜筋',      activation:'69%MVIC', grade:'EMG', strong:true,  badge:'くびれ(腹斜筋)の刺激がヨガ最強', src:'Ekstrom / IJOY (PMC5433114)' },
  yg_br_side_plank:      { area:'くびれ', muscle:'外腹斜筋',      activation:'69%MVIC', grade:'EMG', strong:true,  badge:'くびれ(腹斜筋)の刺激がヨガ最強', src:'Ekstrom / IJOY (PMC5433114)' },
  yg_br_side_plank_twist:{ area:'くびれ', muscle:'外腹斜筋(回旋)', activation:'高',      grade:'EMG', strong:true,  badge:'回旋を足しくびれに集中',        src:'Ekstrom / IJOY' },
  yg_br_twist_boat:      { area:'くびれ', muscle:'腹直筋・腹斜筋', activation:'>50%MVC', grade:'EMG', strong:true,  badge:'舟＋回旋でお腹とくびれを同時に', src:'Ni 2014 / IJOY' },
  yg_br_high_plank:      { area:'お腹',   muscle:'腹直筋・腹斜筋', activation:'高',      grade:'EMG', strong:false, badge:'体幹前面をまとめて安定',        src:'プランクEMG研究' },
  yg_revolved_triangle:  { area:'くびれ', muscle:'腹斜筋(回旋)',  activation:'中〜高',   grade:'EMG', strong:false, badge:'回旋で腹斜筋を動員',            src:'IJOY (PMC5433114)' },
  yg_chair_twist:        { area:'くびれ', muscle:'大腿四頭筋・腹斜筋', activation:'中〜高', grade:'EMG', strong:false, badge:'脚とくびれを同時に刺激',      src:'IJOY / Ni 2014' },
  yg_br_revolved_chair:  { area:'くびれ', muscle:'大腿四頭筋・腹斜筋', activation:'中〜高', grade:'EMG', strong:false, badge:'脚とくびれを同時に刺激',      src:'IJOY / Ni 2014' },
  yg_br_mermaid:         { area:'くびれ', muscle:'腹斜筋・体側',  activation:'中(定性)', grade:'qualitative', strong:false, badge:'脇腹を伸ばしくびれを整える', src:'体側伸展の知見' },

  // ── ヒップ・脚（大臀筋・中臀筋・大腿四頭筋）──
  yg_half_moon:  { area:'ヒップ', muscle:'大臀筋・中臀筋', activation:'63%MVIC', grade:'EMG', strong:true,  badge:'お尻の活動がヨガ内で最強クラス', src:'IJSPT臀筋研究' },
  yg_warrior3:   { area:'ヒップ', muscle:'大臀筋・中臀筋', activation:'46%MVIC', grade:'EMG', strong:true,  badge:'片脚で大臀筋・中臀筋を強く動員', src:'IJSPT臀筋研究' },
  yg_warrior_3:  { area:'ヒップ', muscle:'大臀筋・中臀筋', activation:'46%MVIC', grade:'EMG', strong:true,  badge:'片脚で大臀筋・中臀筋を強く動員', src:'IJSPT臀筋研究' },
  yg_chair:      { area:'脚',    muscle:'大腿四頭筋・大臀筋', activation:'最高クラス', grade:'EMG', strong:true,  badge:'脚(大腿四頭筋)の活動が最も高い', src:'IJOYコア研究 / Ni 2014' },
  yg_chair_pose: { area:'脚',    muscle:'大腿四頭筋・大臀筋', activation:'最高クラス', grade:'EMG', strong:true,  badge:'脚(大腿四頭筋)の活動が最も高い', src:'IJOYコア研究 / Ni 2014' },
  yg_warrior1:   { area:'ヒップ', muscle:'大臀筋・腹直筋', activation:'50%MVC', grade:'EMG', strong:true,  badge:'下半身と体幹を同時に使う',      src:'IJOY (戦士 腹直筋50.4%)' },
  yg_warrior2:   { area:'ヒップ', muscle:'内転筋・臀筋',  activation:'中',    grade:'EMG', strong:false, badge:'下半身の安定と引き締め',        src:'IJSPT臀筋研究' },
  yg_tree:       { area:'ヒップ', muscle:'腹直筋・中臀筋', activation:'50%MVC', grade:'EMG', strong:true,  badge:'片脚バランスで体幹・お尻に効く', src:'IJOY (木 腹直筋50.1%)' },
  yg_bridge_y:   { area:'ヒップ', muscle:'大臀筋・多裂筋', activation:'片脚で大臀筋〜90%MVIC', grade:'EMG', strong:true, badge:'片脚の橋でお尻を最大級に動員',      src:'単脚ブリッジEMG / IJOY' },
  yg_lunge_low:  { area:'ヒップ', muscle:'腹直筋・腸腰筋', activation:'56%MVC', grade:'EMG', strong:true,  badge:'三日月で体幹前面を強く動員',    src:'IJOY (三日月 腹直筋56.1%)' },

  // ── 背中（脊柱起立筋・僧帽筋下部）──
  yg_locust:      { area:'背中', muscle:'脊柱起立筋', activation:'77〜82%MVIC', grade:'EMG', strong:true, badge:'背面の活動がヨガ内で最強', src:'JOSPT背部リハ (PubMed 25025322)' },
  yg_locust_pose: { area:'背中', muscle:'脊柱起立筋', activation:'77〜82%MVIC', grade:'EMG', strong:true, badge:'背面の活動がヨガ内で最強', src:'JOSPT背部リハ (PubMed 25025322)' },
  yg_cow_face:    { area:'背中', muscle:'僧帽筋・肩関節', activation:'姿勢改善', grade:'RCT', strong:false, badge:'肩を開き巻き肩・背中を整える', src:'Iyengar RCT' },

  // ── デコルテ・姿勢（胸椎伸展・僧帽筋下部・巻き肩改善）──
  yg_cobra:            { area:'姿勢',   muscle:'脊柱起立筋・僧帽筋下部', activation:'44%MVIC', grade:'RCT', strong:false, badge:'8週ヨガで巻き肩・猫背が改善(RCT)', src:'Iyengar RCT / JOSPT肩甲骨' },
  yg_br_cobra_decolte: { area:'デコルテ', muscle:'脊柱起立筋・僧帽筋下部', activation:'44%MVIC', grade:'RCT', strong:false, badge:'胸を開き猫背改善→デコルテ映え(RCT)', src:'Iyengar RCT / JOSPT肩甲骨' },
  yg_br_wall_angel:    { area:'デコルテ', muscle:'前鋸筋・僧帽筋下部', activation:'前鋸筋37〜75%MVIC', grade:'RCT', strong:true, badge:'巻き肩改善RCT＋前鋸筋EMG→肩まわりすっきり', src:'Iyengar RCT / 壁スライドEMG JOSPT2006' },
  yg_camel:            { area:'姿勢',   muscle:'胸椎伸展',      activation:'姿勢改善', grade:'RCT', strong:false, badge:'胸椎後弯(猫背)改善のRCTあり',   src:'Greendale 2009 RCT' },
  yg_camel_pose:       { area:'姿勢',   muscle:'胸椎伸展',      activation:'姿勢改善', grade:'RCT', strong:false, badge:'胸椎後弯(猫背)改善のRCTあり',   src:'Greendale 2009 RCT' },
  yg_downdog_y:        { area:'姿勢',   muscle:'前三角筋・肩',   activation:'中(定性)', grade:'qualitative', strong:false, badge:'全身を伸ばし肩まわりを活性', src:'定性' },

  // ── 二の腕（上腕三頭筋）──
  yg_br_chaturanga:    { area:'二の腕', muscle:'上腕三頭筋・大胸筋', activation:'74%MVC', grade:'EMG', strong:true,  badge:'二の腕(三頭筋)の活動がヨガ最強', src:'腕立てEMG (MDPI 2026)' },
  yg_br_reverse_plank: { area:'二の腕', muscle:'上腕三頭筋・脊柱起立筋', activation:'背面＋腕で支持', grade:'qualitative', strong:false, badge:'二の腕裏と背面を支える',   src:'逆プランクEMG(背部)' },
  yg_br_dolphin_plank: { area:'二の腕', muscle:'上腕三頭筋・肩', activation:'支持(定性)', grade:'qualitative', strong:false, badge:'肩に優しく二の腕〜背中を安定', src:'支持筋群の知見' },

  // ── むくみ・循環 ──
  yg_legs_wall_y:  { area:'むくみ', muscle:'下肢循環・リンパ', activation:'循環促進', grade:'qualitative', strong:false, badge:'脚を上げ下肢のむくみ・巡りをケア', src:'Cleveland Clinic ほか' },
  yg_legs_up_wall: { area:'むくみ', muscle:'下肢循環・リンパ', activation:'循環促進', grade:'qualitative', strong:false, badge:'脚を上げ下肢のむくみ・巡りをケア', src:'Cleveland Clinic ほか' },

  // ── 柔軟性・可動域（ストレッチ系: ハム/股関節ROM改善のRCT・レビューに基づく）──
  yg_forward_fold_std:    { area:'柔軟性', muscle:'ハムストリング・背面', activation:'ROM改善', grade:'RCT', strong:false, badge:'背面の柔軟性を高める(ストレッチRCT)', src:'ハム柔軟性RCT / JOSPT2005レビュー' },
  yg_standing_forward_fold:{area:'柔軟性', muscle:'ハムストリング・背面', activation:'ROM改善', grade:'RCT', strong:false, badge:'立位前屈で背面を伸ばす(RCT)', src:'ハム柔軟性RCT / JOSPT2005' },
  yg_seated_fold_y:       { area:'柔軟性', muscle:'ハムストリング・背面', activation:'ROM改善', grade:'RCT', strong:false, badge:'座位前屈で背面を伸ばす(RCT)', src:'ハム柔軟性RCT / JOSPT2005' },
  yg_seated_forward_fold: { area:'柔軟性', muscle:'ハムストリング・背面', activation:'ROM改善', grade:'RCT', strong:false, badge:'座位前屈で背面を伸ばす(RCT)', src:'ハム柔軟性RCT / JOSPT2005' },
  yg_one_leg_fold:        { area:'柔軟性', muscle:'ハムストリング(片脚)', activation:'ROM改善', grade:'RCT', strong:false, badge:'片脚ずつハムを伸ばす(RCT)', src:'ハム柔軟性RCT' },
  yg_head_to_knee:        { area:'柔軟性', muscle:'ハムストリング・内転筋', activation:'ROM改善', grade:'RCT', strong:false, badge:'片脚前屈で柔軟性を高める(RCT)', src:'ハム柔軟性RCT' },
  yg_wide_legged_fold:    { area:'柔軟性', muscle:'内転筋・ハム', activation:'ROM改善', grade:'RCT', strong:false, badge:'開脚前屈で内もも・背面を伸ばす', src:'ハム柔軟性RCT' },
  yg_wide_squat:          { area:'柔軟性', muscle:'股関節・足首', activation:'股関節ROM', grade:'RCT', strong:false, badge:'深いしゃがみで股関節・足首を開く(RCT)', src:'股関節ROM改善RCT (PMC4763548)' },
  yg_half_pigeon:         { area:'柔軟性', muscle:'臀筋・股関節外旋', activation:'股関節ROM', grade:'RCT', strong:false, badge:'お尻と股関節外旋を伸ばす(ROM改善)', src:'股関節ROM改善RCT' },
  yg_butterfly_yoga:      { area:'柔軟性', muscle:'股関節内転', activation:'股関節ROM', grade:'RCT', strong:false, badge:'股関節内側を開く(ROM改善RCT)', src:'股関節ROM改善RCT (PMC4763548)' },
  yg_butterfly_pose:      { area:'柔軟性', muscle:'股関節内転', activation:'股関節ROM', grade:'RCT', strong:false, badge:'股関節内側を開く(ROM改善RCT)', src:'股関節ROM改善RCT' },
  yg_seated_wide_legs:    { area:'柔軟性', muscle:'内転筋・ハム', activation:'ROM改善', grade:'RCT', strong:false, badge:'開脚で内もも・背面を伸ばす', src:'柔軟性RCT' },
  yg_lizard_pose:         { area:'柔軟性', muscle:'股関節屈筋', activation:'股関節ROM', grade:'RCT', strong:false, badge:'股関節前面を深く開く', src:'股関節ROM改善RCT' },
  yg_lotus_prep:          { area:'柔軟性', muscle:'股関節外旋', activation:'股関節ROM', grade:'qualitative', strong:false, badge:'股関節を開く準備', src:'股関節可動性の知見' },
  yg_ankle_to_knee:       { area:'柔軟性', muscle:'股関節外側', activation:'股関節ROM', grade:'qualitative', strong:false, badge:'股関節外側を深く開く', src:'股関節可動性の知見' },
  yg_compass:             { area:'柔軟性', muscle:'股関節・ハム', activation:'股関節ROM(高度)', grade:'qualitative', strong:false, badge:'高度な股関節オープナー', src:'股関節可動性の知見' },
  yg_supine_butterfly:    { area:'柔軟性', muscle:'股関節内転', activation:'股関節ROM(リラックス)', grade:'qualitative', strong:false, badge:'寝ながら股関節をゆるめる', src:'股関節可動性の知見' },
  yg_frog_pose:           { area:'柔軟性', muscle:'股関節内転', activation:'股関節ROM', grade:'qualitative', strong:false, badge:'股関節を大きく開く', src:'股関節可動性の知見' },
  yg_hero:                { area:'柔軟性', muscle:'大腿四頭筋', activation:'ROM改善', grade:'qualitative', strong:false, badge:'前ももを伸ばす', src:'柔軟性の知見' },
  yg_hero_pose:           { area:'柔軟性', muscle:'大腿四頭筋', activation:'ROM改善', grade:'qualitative', strong:false, badge:'前ももを伸ばす', src:'柔軟性の知見' },

  // ── 脊柱の回旋・可動性（ツイスト系）──
  yg_seated_twist_y:      { area:'背骨', muscle:'脊柱回旋・腹斜筋', activation:'脊柱可動性', grade:'qualitative', strong:false, badge:'背骨をねじり可動性を保つ', src:'脊柱モビリティの知見' },
  yg_half_lord_of_fishes: { area:'背骨', muscle:'脊柱回旋・腹斜筋', activation:'脊柱可動性', grade:'qualitative', strong:false, badge:'座位ねじりで背骨を可動', src:'脊柱モビリティの知見' },
  yg_spinal_twist:        { area:'背骨', muscle:'脊柱回旋', activation:'脊柱可動性(リラックス)', grade:'qualitative', strong:false, badge:'寝ながら背骨をゆるめる', src:'脊柱モビリティの知見' },

  // ── 胸椎伸展（後屈・姿勢: 猫背/巻き肩改善のRCTと同系）──
  yg_upward_dog:  { area:'姿勢', muscle:'脊柱起立筋・胸椎伸展', activation:'胸椎伸展', grade:'RCT', strong:false, badge:'胸を開き猫背・巻き肩を整える(RCT系)', src:'Iyengar/Greendale 後屈RCT' },
  yg_sphinx:      { area:'姿勢', muscle:'脊柱起立筋(優しい)', activation:'胸椎伸展', grade:'RCT', strong:false, badge:'優しい後屈で胸を開く(RCT系)', src:'Iyengar/Greendale 後屈RCT' },
  yg_seated_side: { area:'くびれ', muscle:'体側(腹斜筋)', activation:'体側ストレッチ', grade:'qualitative', strong:false, badge:'脇腹を伸ばしくびれを整える', src:'体側伸展の知見' },

  // ── 肩・体幹の支持（アームバランス系: 正直に定性）──
  yg_dolphin_pose: { area:'二の腕', muscle:'肩・体幹・上腕', activation:'支持', grade:'qualitative', strong:false, badge:'肩と二の腕を支持で使う', src:'支持筋群の知見' },
  yg_crow_pose:    { area:'二の腕', muscle:'体幹・上腕・肩', activation:'支持(高度)', grade:'qualitative', strong:false, badge:'腕と体幹で全身を支える', src:'支持筋群の知見' },
  yg_br_table_top: { area:'二の腕', muscle:'上腕三頭筋(膝つき)', activation:'支持(軽)', grade:'qualitative', strong:false, badge:'二の腕裏の入門・支持', src:'支持筋群の知見' },

  // ── 呼吸法（pranayama: 自律神経・ストレス低減のRCT/レビュー）──
  yg_ujjayi:          { area:'自律神経', muscle:'呼吸筋・副交感神経', activation:'ストレス低減', grade:'RCT', strong:false, badge:'ゆっくりした呼吸で自律神経を整える(RCT)', src:'徐呼吸/ヨガ呼吸のストレスRCT' },
  yg_ujjayi_long:     { area:'自律神経', muscle:'呼吸筋・副交感神経', activation:'ストレス低減', grade:'RCT', strong:false, badge:'長い呼吸で深いリラックス(RCT)', src:'徐呼吸RCT' },
  yg_nadi_shodhana:   { area:'自律神経', muscle:'呼吸・自律神経', activation:'自律神経調整', grade:'RCT', strong:false, badge:'片鼻呼吸で自律神経を整える(RCT)', src:'ナディショーダナRCT' },
  yg_alternate_nostril:{area:'自律神経', muscle:'呼吸・自律神経', activation:'自律神経調整', grade:'RCT', strong:false, badge:'片鼻呼吸で自律神経を整える(RCT)', src:'ナディショーダナRCT' },
  yg_kapalbhati:      { area:'自律神経', muscle:'腹筋・呼吸筋', activation:'覚醒・代謝', grade:'qualitative', strong:false, badge:'お腹の火の呼吸で代謝を促す', src:'カパラバティの知見' },
  yg_kapalabhati:     { area:'自律神経', muscle:'腹筋・呼吸筋', activation:'覚醒・代謝', grade:'qualitative', strong:false, badge:'お腹の火の呼吸で代謝を促す', src:'カパラバティの知見' },
  yg_bhramari:        { area:'自律神経', muscle:'呼吸・迷走神経', activation:'不安低減', grade:'RCT', strong:false, badge:'蜂の呼吸で不安をやわらげる(RCT)', src:'ブラマリRCT' },
  yg_lion_breath:     { area:'自律神経', muscle:'表情筋・呼吸', activation:'緊張解放', grade:'qualitative', strong:false, badge:'顔の緊張と気持ちを解放', src:'呼吸法の知見' },
  yg_breath_count:    { area:'メンタル', muscle:'呼吸・集中', activation:'集中・鎮静', grade:'RCT', strong:false, badge:'呼吸を数えて心を鎮める(マインドフルネスRCT)', src:'マインドフルネスRCT' },
  pl_relaxation_breath:{area:'自律神経', muscle:'呼吸・副交感神経', activation:'リラックス', grade:'RCT', strong:false, badge:'呼吸でリラックスを促す(RCT)', src:'徐呼吸RCT' },
  st_belly_breath:    { area:'自律神経', muscle:'横隔膜・副交感神経', activation:'リラックス', grade:'RCT', strong:false, badge:'腹式呼吸で自律神経を整える(RCT)', src:'徐呼吸RCT' },
  st_box_breath:      { area:'自律神経', muscle:'呼吸・自律神経', activation:'鎮静', grade:'RCT', strong:false, badge:'ボックス呼吸で落ち着く(RCT)', src:'徐呼吸RCT' },
  st_478_breath:      { area:'自律神経', muscle:'呼吸・副交感神経', activation:'入眠・鎮静', grade:'RCT', strong:false, badge:'4-7-8呼吸で入眠しやすく(RCT)', src:'徐呼吸RCT' },
  st_rib_breath:      { area:'自律神経', muscle:'肋間・横隔膜', activation:'呼吸拡張', grade:'qualitative', strong:false, badge:'肋骨を広げ呼吸を深める', src:'呼吸法の知見' },

  // ── 瞑想（マインドフルネス: ストレス・睡眠改善のRCT/メタ分析）──
  yg_loving_kindness: { area:'メンタル', muscle:'心・情動', activation:'ストレス低減', grade:'RCT', strong:false, badge:'慈悲の瞑想で心を整える(RCT)', src:'マインドフルネスRCT/メタ分析' },
  yg_mantra_meditation:{area:'メンタル', muscle:'心・集中', activation:'集中・鎮静', grade:'RCT', strong:false, badge:'マントラで集中と鎮静(RCT)', src:'マインドフルネスRCT' },
  yg_pratipaksha:     { area:'メンタル', muscle:'心・認知', activation:'感情調整', grade:'qualitative', strong:false, badge:'思考を切り替え心を整える', src:'瞑想の知見' },

  // ── 胸開き・後屈・体側（姿勢/柔軟: 猫背改善RCT系）──
  yg_bow_pose:        { area:'姿勢', muscle:'胸椎伸展・前面', activation:'胸椎伸展', grade:'RCT', strong:false, badge:'前面を開き猫背を整える(RCT系)', src:'後屈/姿勢RCT' },
  yg_fish_pose:       { area:'デコルテ', muscle:'胸郭・喉', activation:'胸椎伸展', grade:'RCT', strong:false, badge:'胸を開き巻き肩・デコルテを整える', src:'Iyengar/後屈RCT' },
  yg_supported_bridge:{ area:'姿勢', muscle:'胸椎伸展(優しい)', activation:'胸椎伸展', grade:'RCT', strong:false, badge:'優しい後屈で胸を開く', src:'後屈/姿勢RCT' },
  yg_plow_pose:       { area:'姿勢', muscle:'背面・脊柱', activation:'背面ストレッチ', grade:'qualitative', strong:false, badge:'背面全体を伸ばす', src:'柔軟性の知見' },
  yg_warrior_reverse: { area:'くびれ', muscle:'体側(腹斜筋)', activation:'体側ストレッチ', grade:'qualitative', strong:false, badge:'体側を伸ばしくびれを整える', src:'体側伸展の知見' },
  yg_extended_side_angle:{area:'くびれ', muscle:'体側・脚', activation:'体側＋下肢', grade:'qualitative', strong:false, badge:'体側を伸ばし下半身も使う', src:'体側伸展の知見' },
  yg_reclining_hero:  { area:'柔軟性', muscle:'大腿四頭筋・前面', activation:'ROM改善', grade:'qualitative', strong:false, badge:'前ももを深く伸ばす', src:'柔軟性の知見' },
  yg_rag_doll:        { area:'姿勢', muscle:'首肩・背面', activation:'脱力・ROM', grade:'qualitative', strong:false, badge:'首肩を脱力しゆるめる', src:'柔軟性の知見' },
  yg_child_pose:      { area:'リラックス', muscle:'背中・股関節', activation:'鎮静', grade:'qualitative', strong:false, badge:'背中をゆるめ心を落ち着ける', src:'休息の知見' },
  yg_easy_pose:       { area:'リラックス', muscle:'姿勢・呼吸', activation:'鎮静', grade:'qualitative', strong:false, badge:'座って呼吸を整える基本姿勢', src:'休息の知見' },

  // ── ケアのストレッチ・モビリティ（首肩/股関節/背骨: 柔軟性ROMの知見）──
  yg_br_reverse_prayer:  { area:'デコルテ', muscle:'胸筋・肩前面', activation:'胸ひらき', grade:'qualitative', strong:false, badge:'胸の前を開きデコルテすっきり', src:'柔軟性の知見' },
  yg_br_standing_backbend:{area:'デコルテ', muscle:'胸椎伸展', activation:'胸椎伸展', grade:'RCT', strong:false, badge:'胸を開き猫背を整える(RCT系)', src:'後屈/姿勢RCT' },
  yg_br_gate:            { area:'くびれ', muscle:'体側', activation:'体側ストレッチ', grade:'qualitative', strong:false, badge:'脇腹〜胸の側面を伸ばす', src:'体側伸展の知見' },
  yg_br_thread_needle:   { area:'背骨', muscle:'胸椎回旋・背面', activation:'脊柱可動性', grade:'qualitative', strong:false, badge:'背中〜脇のこわばりをほぐす', src:'脊柱モビリティの知見' },
  st_neck_lateral:   { area:'首肩', muscle:'首側面', activation:'ROM改善', grade:'qualitative', strong:false, badge:'首の側面をゆるめる', src:'柔軟性の知見' },
  st_neck_rotation:  { area:'首肩', muscle:'首回旋', activation:'ROM改善', grade:'qualitative', strong:false, badge:'首の回旋可動域を保つ', src:'柔軟性の知見' },
  st_shoulder_roll:  { area:'首肩', muscle:'肩まわり', activation:'ROM改善', grade:'qualitative', strong:false, badge:'肩まわりをほぐす', src:'柔軟性の知見' },
  st_shoulder_circles:{area:'首肩', muscle:'肩まわり', activation:'ROM改善', grade:'qualitative', strong:false, badge:'肩を大きく回してほぐす', src:'柔軟性の知見' },
  st_eagle_arm:      { area:'首肩', muscle:'肩甲骨まわり', activation:'肩ストレッチ', grade:'qualitative', strong:false, badge:'肩甲骨の間をひらく', src:'柔軟性の知見' },
  st_lat_stretch:    { area:'背中', muscle:'広背筋', activation:'背面ストレッチ', grade:'qualitative', strong:false, badge:'脇〜背中を伸ばす', src:'柔軟性の知見' },
  st_thread_needle:  { area:'背骨', muscle:'胸椎回旋', activation:'脊柱可動性', grade:'qualitative', strong:false, badge:'背骨をねじり可動性を保つ', src:'脊柱モビリティの知見' },
  st_cat_cow:        { area:'背骨', muscle:'脊柱屈伸', activation:'脊柱可動性', grade:'qualitative', strong:false, badge:'背骨をしなやかに動かす', src:'脊柱モビリティの知見' },
  st_supine_twist:   { area:'背骨', muscle:'脊柱回旋', activation:'脊柱可動性', grade:'qualitative', strong:false, badge:'寝ながら背骨をゆるめる', src:'脊柱モビリティの知見' },
  st_qlrunner:       { area:'背中', muscle:'腰方形筋', activation:'腰側面ストレッチ', grade:'qualitative', strong:false, badge:'腰の側面をゆるめる', src:'柔軟性の知見' },
  st_low_back_rocker:{ area:'背中', muscle:'腰・背面', activation:'腰ほぐし', grade:'qualitative', strong:false, badge:'腰をやさしくほぐす', src:'柔軟性の知見' },
  st_sphinx_release: { area:'姿勢', muscle:'胸椎伸展(優しい)', activation:'胸椎伸展', grade:'RCT', strong:false, badge:'優しい後屈で胸を開く(RCT系)', src:'後屈/姿勢RCT' },
  st_reverse_prayer: { area:'デコルテ', muscle:'胸筋・肩前面', activation:'胸ひらき', grade:'qualitative', strong:false, badge:'胸の前を開く', src:'柔軟性の知見' },
  st_wrist_extension:{ area:'手首', muscle:'前腕', activation:'手首ケア', grade:'qualitative', strong:false, badge:'支持ポーズ前後の手首ケア', src:'柔軟性の知見' },
  st_hip_flexor:     { area:'柔軟性', muscle:'腸腰筋', activation:'股関節ROM', grade:'RCT', strong:false, badge:'反り腰につながる前ももを伸ばす', src:'股関節ROM改善RCT' },
  st_9090_hip:       { area:'柔軟性', muscle:'股関節内外旋', activation:'股関節ROM', grade:'RCT', strong:false, badge:'股関節の内外旋を整える', src:'股関節ROM改善RCT' },
  st_pigeon:         { area:'柔軟性', muscle:'臀筋・股関節外旋', activation:'股関節ROM', grade:'RCT', strong:false, badge:'お尻と股関節を深く開く(ROM改善)', src:'股関節ROM改善RCT' },
  st_butterfly:      { area:'柔軟性', muscle:'股関節内転', activation:'股関節ROM', grade:'RCT', strong:false, badge:'股関節内側を開く(ROM改善)', src:'股関節ROM改善RCT' },
  st_frog:           { area:'柔軟性', muscle:'股関節内転', activation:'股関節ROM', grade:'qualitative', strong:false, badge:'股関節を大きく開く', src:'股関節可動性の知見' },
  st_outer_hip_stretch:{area:'柔軟性', muscle:'股関節外側', activation:'股関節ROM', grade:'qualitative', strong:false, badge:'股関節外側をゆるめる', src:'股関節可動性の知見' },
  st_supine_figure4: { area:'柔軟性', muscle:'臀筋', activation:'股関節ROM', grade:'RCT', strong:false, badge:'寝ながらお尻を伸ばす(ROM改善)', src:'股関節ROM改善RCT' },
  st_lizard:         { area:'柔軟性', muscle:'股関節屈筋', activation:'股関節ROM', grade:'qualitative', strong:false, badge:'股関節前面を深く開く', src:'股関節可動性の知見' },
  st_hip_circle:     { area:'柔軟性', muscle:'股関節', activation:'股関節モビリティ', grade:'qualitative', strong:false, badge:'股関節を回してほぐす', src:'股関節可動性の知見' },
  st_happy_baby:     { area:'柔軟性', muscle:'股関節・内もも', activation:'股関節ROM(リラックス)', grade:'qualitative', strong:false, badge:'寝ながら股関節をゆるめる', src:'股関節可動性の知見' },

  // ── 瞑想・休息（マインドフルネス／リラクゼーションのRCT）──
  yg_body_scan:          { area:'メンタル', muscle:'心・身体感覚', activation:'ストレス低減', grade:'RCT', strong:false, badge:'全身に意識を巡らせ心を整える(マインドフルネスRCT)', src:'マインドフルネスRCT/メタ分析' },
  yg_walking_meditation: { area:'メンタル', muscle:'心・集中', activation:'鎮静', grade:'RCT', strong:false, badge:'歩く瞑想で心を整える(マインドフルネス)', src:'マインドフルネスRCT' },
  yg_corpse:             { area:'リラックス', muscle:'全身脱力・副交感神経', activation:'深いリラックス', grade:'RCT', strong:false, badge:'全身を脱力し自律神経を整える(RCT)', src:'リラクゼーションRCT' },
  yg_savasana_with_count:{ area:'リラックス', muscle:'全身脱力・呼吸', activation:'入眠・鎮静', grade:'RCT', strong:false, badge:'呼吸を数えて入眠しやすく(RCT)', src:'徐呼吸/リラクゼーションRCT' },
  st_lying_relax:        { area:'リラックス', muscle:'全身脱力', activation:'リラックス', grade:'qualitative', strong:false, badge:'仰向けで全身をゆるめる', src:'休息の知見' },
};

// エビデンスの強さを数値スコア化（処方優先度に使う）
const GRADE_SCORE = { meta:4, RCT:3, EMG:2, qualitative:1 };
export function evidenceScore(id){
  const e = EVIDENCE[id];
  if (!e) return 0;
  return (GRADE_SCORE[e.grade] || 0) + (e.strong ? 2 : 0);
}
