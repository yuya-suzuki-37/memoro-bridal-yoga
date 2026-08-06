// ===================================================================
// ヨガ (YOGA) — 花嫁向け拡充パック（ドレス映え部位を厚く）
// 既存 db-yoga.js(98種) は姿勢改善が主軸で、二の腕/デコルテ/くびれが手薄。
// ここを補う16種を追加し、全部位をヨガだけでカバーする。
//
// 追加フィールド（花嫁メタ情報 — このパック固有）:
//   bridalArea    : ドレス映え部位キー（arm/back/decolte/waist/hip_leg）
//   bridalBenefit : 当日どう活きるか（※効果は断定しない・薬機/景表配慮）
//   breath        : 呼吸のタイミング（初心者が正しく行うため）
//   modify        : 軽減法（きつい人向け・安全に続けるため）
// イラストは既存 svg-library.js のSVGを流用（新規手描きなし）。
// ===================================================================

import { SVG2 } from './svg-library.js';

export const DB_YOGA_BRIDAL = [

  // ============== 二の腕 ARM (6種) — ノースリーブ・オフショル映え ==============
  {
    id:'yg_br_chaturanga', name:'チャトランガ・ダンダーサナ', courses:['yoga'],
    targetProblems:['roundedShoulders','general'],
    category:'strength', technique:'strength', bodyPart:'arm', intensity:3,
    equipment:'マット', position:'prone', duration:'20秒 × 2セット',
    illustration: SVG2.pushup,
    purpose:'二の腕(上腕三頭筋)と体幹を同時に使う基本の支持ポーズ。',
    how:['板のポーズから、体を一直線に保つ。','息を吐きながら肘を後ろへ曲げ、体を床すれすれまで下ろす。','肘は体側に沿わせ、肩の高さまでで止めて20秒キープ。'],
    cues:{do:'肩を耳から遠ざけ、お腹を引き込む。',dont:'肘を外に開かない・お尻を突き上げない。'},
    why:'上腕裏側と肩甲帯の連動を鍛える。',
    breath:'板で息を吸い、吐きながら下ろす。キープ中は自然な呼吸を止めない。',
    modify:'膝を床についた「膝つきチャトランガ」でOK。まず10秒から、下ろす深さも浅めで。',
    bridalArea:'arm', bridalBenefit:'ノースリーブドレスで気になる二の腕まわりの引き締めをめざす。'
  },
  {
    id:'yg_br_high_plank', name:'板のポーズ(クンバカーサナ)', courses:['yoga'],
    targetProblems:['roundedShoulders','anteriorPelvicTilt','general'],
    category:'core', technique:'isometric', bodyPart:'arm', intensity:2,
    equipment:'マット', position:'prone', duration:'30秒 × 2セット',
    illustration: SVG2.plank,
    purpose:'腕・肩・体幹を一枚板で支える土台のポーズ。',
    how:['四つ這いから足を後ろに伸ばし、頭からかかとまで一直線に。','手は肩の真下、指を大きく開いて床を押す。','お腹を引き込んだまま30秒キープ。'],
    cues:{do:'お腹と太ももに軽く力を入れる。',dont:'腰を反らせない・お尻を上げ下げしない。'},
    why:'二の腕と体幹の持久力の基礎。',
    breath:'キープ中は止めず、ゆっくり鼻で吸って吐くを繰り返す。',
    modify:'つらければ膝を床について。手首が痛い時は肘をついた前腕プランクに。まず15秒から。',
    bridalArea:'arm', bridalBenefit:'腕から背中まで一本の美しいラインを作る土台に。'
  },
  {
    id:'yg_br_side_plank', name:'サイドプランク(花嫁向け)', courses:['yoga'],
    targetProblems:['lateralAsymmetry','roundedShoulders'],
    category:'core', technique:'isometric', bodyPart:'arm', intensity:2,
    equipment:'マット', position:'side', duration:'各20秒',
    illustration: SVG2.sidePlank,
    purpose:'片腕支持で二の腕と体側を同時に引き締める。',
    how:['横向きになり、下の手を肩の真下に置く。','息を吐きながら腰を持ち上げ、頭から足まで一直線に。','上の手は天井へ。20秒キープしたら反対側も。'],
    cues:{do:'支える肩を安定させ、腰を高く保つ。',dont:'腰を落とさない・下の肩に沈み込まない。'},
    why:'二の腕外側とウエスト側面を同時に刺激。',
    breath:'腰を持ち上げる時に吐き、キープ中は自然な呼吸を続ける。',
    modify:'下の膝を曲げて床につけると安定する（膝つきサイドプランク）。首がつらければ視線は正面へ。',
    bridalArea:'arm', bridalBenefit:'二の腕とくびれを一度に。横からのドレス姿に効く。'
  },
  {
    id:'yg_br_reverse_plank', name:'逆板のポーズ(プルヴォッタナーサナ)', courses:['yoga'],
    targetProblems:['roundedShoulders','thoracicKyphosis'],
    category:'strength', technique:'isometric', bodyPart:'arm', intensity:2,
    equipment:'マット', position:'sitting', duration:'20秒 × 2セット',
    illustration: SVG2.reversePlank,
    purpose:'体の後面全体で支え、二の腕裏とデコルテを開く。',
    how:['長座で手を腰の後ろに、指先は前(お尻)向きに置く。','息を吸いながらお尻を持ち上げ、胸を天井へ開く。','体を一直線にして20秒キープ。'],
    cues:{do:'胸を大きく開き、お尻を締める。',dont:'首を強く後ろに倒さない。'},
    why:'上腕裏側の引き締めと胸郭オープンを同時に。',
    breath:'お尻を持ち上げる時に吸って胸を開き、下ろす時に吐く。',
    modify:'膝を立てた「テーブルトップ」に切り替えてOK。指先を外向きにすると手首が楽。',
    bridalArea:'arm', bridalBenefit:'二の腕裏とデコルテを同時に。バックスタイルの上半身を美しく。'
  },
  {
    id:'yg_br_table_top', name:'テーブルトップ(膝つき逆板)', courses:['yoga'],
    targetProblems:['roundedShoulders','general'],
    category:'strength', technique:'isometric', bodyPart:'arm', intensity:1,
    equipment:'マット', position:'sitting', duration:'30秒 × 2セット',
    illustration: SVG2.tableTop,
    purpose:'逆板の初級版。無理なく二の腕裏を使う。',
    how:['膝を立てて座り、手を腰の後ろ・指先は前向きに。','息を吸いながらお尻を持ち上げ、膝から肩を一直線に。','30秒キープ。'],
    cues:{do:'お尻を高く保ち、胸を開く。',dont:'肩をすくめない。'},
    why:'手首・肩に優しい二の腕の入門。',
    breath:'持ち上げる時に吸い、下ろす時に吐く。',
    modify:'お尻を床すれすれで小さく上げるだけでもOK。回数を分けて休みながらでも。',
    bridalArea:'arm', bridalBenefit:'運動が苦手でも始めやすい二の腕ケアの第一歩。'
  },
  {
    id:'yg_br_dolphin_plank', name:'ドルフィンプランク', courses:['yoga'],
    targetProblems:['roundedShoulders','thoracicKyphosis','general'],
    category:'core', technique:'isometric', bodyPart:'arm', intensity:2,
    equipment:'マット', position:'prone', duration:'30秒 × 2セット',
    illustration: SVG2.plank,
    purpose:'前腕支持で二の腕と肩甲帯を安定させる。',
    how:['前腕を床につけ、肘を肩の真下に。','足を後ろに伸ばし、頭からかかとまで一直線に。','前腕で床を押しながら30秒キープ。'],
    cues:{do:'前腕で床を押し、肩甲骨を安定させる。',dont:'腰を反らせない・お尻を上げすぎない。'},
    why:'肩関節に優しく二の腕〜背中を強化。',
    breath:'キープ中はゆっくり鼻呼吸を続ける。',
    modify:'膝を床について負荷を軽く。肩がつらければ15秒からで。',
    bridalArea:'arm', bridalBenefit:'手首が痛くなりにくい二の腕トレ。肩まわりもすっきり。'
  },

  // ============== デコルテ DECOLTE (5種) — 鎖骨・胸元・肩甲骨 ==============
  {
    id:'yg_br_cobra_decolte', name:'コブラ(デコルテ強調)', courses:['yoga'],
    targetProblems:['thoracicKyphosis','roundedShoulders','forwardHead'],
    category:'strength', technique:'strength', bodyPart:'chest', intensity:2,
    equipment:'マット', position:'prone', duration:'20秒 × 2セット',
    illustration: SVG2.cobra,
    purpose:'背筋で上体を起こし胸を前へ押し出す。',
    how:['うつ伏せで手を胸の横、肘は体に沿わせる。','息を吸いながら肩甲骨を寄せ、背筋の力で胸を持ち上げる。','鎖骨を左右に広げ、肩を下げて20秒。'],
    cues:{do:'肩を耳から離し、胸を前へ開く。',dont:'手で床を押しすぎない(背筋で起こす)・あごを上げすぎない。'},
    why:'胸椎伸展＋肩甲骨内転で胸元を開く。',
    breath:'吸いながら胸を持ち上げ、吐いて肩を下げて安定させる。',
    modify:'胸を少しだけ上げる「低いコブラ」でOK。腰に響く時は高さを下げ、脚を軽く開く。',
    bridalArea:'decolte', bridalBenefit:'丸まった肩を開き、鎖骨と胸元をきれいに見せる姿勢へ。'
  },
  {
    id:'yg_br_wall_angel', name:'壁エンジェル(肩甲骨寄せ)', courses:['yoga'],
    targetProblems:['roundedShoulders','thoracicKyphosis','forwardHead'],
    category:'strength', technique:'isometric', bodyPart:'shoulder', intensity:1,
    equipment:'壁', position:'standing', duration:'10回 × 2セット',
    illustration: SVG2.wallAngel,
    purpose:'壁に沿って腕を上下し肩甲骨を寄せる。',
    how:['壁に背中・腰・後頭部をつけて立つ。','肘を90度に曲げ、肘と手の甲を壁につける。','壁から離さないよう腕をゆっくり上下に10回。'],
    cues:{do:'手の甲を壁につけたまま動かす。',dont:'腰を反らせて壁から浮かせない。'},
    why:'巻き肩を戻し肩甲骨の可動を回復。',
    breath:'腕を上げる時に吸い、下ろす時に吐く。ゆっくり動かす。',
    modify:'手の甲が壁から離れない範囲でOK。無理に大きく動かさず、可動域は狭くて構わない。',
    bridalArea:'decolte', bridalBenefit:'巻き肩をリセットし、デコルテがすっと開いた立ち姿に。'
  },
  {
    id:'yg_br_reverse_prayer', name:'背面合掌(逆祈りのポーズ)', courses:['yoga'],
    targetProblems:['roundedShoulders','lateralAsymmetry'],
    category:'selfcare', technique:'stretch', bodyPart:'shoulder', intensity:1,
    equipment:'なし', position:'standing', duration:'1分',
    illustration: SVG2.shoulderBlade,
    purpose:'背中で手を合わせ胸と肩の前面を開く。',
    how:['背中側で両手のひらを合わせる（難しければ肘を反対の手でつかむ）。','胸を前に開き、肩甲骨を軽く寄せる。','ゆっくり呼吸しながら1分キープ。'],
    cues:{do:'胸を前に開き、背筋を伸ばす。',dont:'肩をすくめない・前かがみにならない。'},
    why:'胸筋と肩前面のストレッチ。',
    breath:'深い呼吸を続けながら、吐く息で胸を開いていく。',
    modify:'合掌が難しければ、背中で肘を反対の手でつかむ形で十分。タオルを使っても。',
    bridalArea:'decolte', bridalBenefit:'胸の前側をほぐし、デコルテのつまりをすっきり。'
  },
  {
    id:'yg_br_standing_backbend', name:'立位後屈(胸開き)', courses:['yoga'],
    targetProblems:['thoracicKyphosis','roundedShoulders'],
    category:'selfcare', technique:'stretch', bodyPart:'chest', intensity:2,
    equipment:'なし', position:'standing', duration:'30秒 × 2セット',
    illustration: SVG2.standBackbend,
    purpose:'立ったまま胸を天井へ開く軽い後屈。',
    how:['両手を腰に当て、お腹を軽く引き込み骨盤を安定させる。','息を吸いながら胸を斜め上へ持ち上げるように開く。','30秒キープしてゆっくり戻す。'],
    cues:{do:'胸(胸椎)から反る。',dont:'腰だけで反らない・首を落とさない。'},
    why:'デスクワークで閉じた胸郭を開く。',
    breath:'吸いながら胸を開き、吐きながらゆっくり戻す。',
    modify:'反る角度は小さくてOK。腰に響く・めまいがする時はすぐ戻す。',
    bridalArea:'decolte', bridalBenefit:'胸元を開き、写真で猫背に見えない上半身へ。'
  },
  {
    id:'yg_br_gate', name:'門のポーズ(パリガーサナ)', courses:['yoga'],
    targetProblems:['lateralAsymmetry','thoracicKyphosis'],
    category:'selfcare', technique:'stretch', bodyPart:'chest', intensity:2,
    equipment:'マット', position:'kneeling', duration:'各30秒',
    illustration: SVG2.sideStretch,
    purpose:'体側と胸の側面を大きく伸ばす。',
    how:['膝立ちから片脚を真横に伸ばす。','息を吐きながら伸ばした脚側へ上体を倒す。','上の腕を頭上から弧を描くように伸ばし30秒。反対も。'],
    cues:{do:'胸を天井に向けて開く。',dont:'前に倒れ込まない・肩をすくめない。'},
    why:'肋間・体側の伸展で呼吸を深める。',
    breath:'吐きながら体側を伸ばし、吸って軽く戻すを繰り返す。',
    modify:'伸ばした脚の膝が痛ければ、つま先を立てるか、脚を少し曲げて。倒す角度は浅くてOK。',
    bridalArea:'decolte', bridalBenefit:'胸の横〜脇のラインを伸ばし、上半身をすっきり見せる。'
  },

  // ============== くびれ WAIST (5種) — ウエスト・お腹の引き上げ ==============
  {
    id:'yg_br_twist_boat', name:'ねじり船のポーズ', courses:['yoga'],
    targetProblems:['anteriorPelvicTilt','lateralAsymmetry'],
    category:'core', technique:'isometric', bodyPart:'core', intensity:3,
    equipment:'マット', position:'sitting', duration:'各20秒',
    illustration: SVG2.boatPose,
    purpose:'V字姿勢に回旋を加え腹斜筋を使う。',
    how:['座って膝を曲げ、脛を床と平行に持ち上げてV字に。','両手を胸前で合わせ、背筋を伸ばす。','息を吐きながら左右へ交互にねじる。各20秒。'],
    cues:{do:'背筋を伸ばしたまま、おへそから捻る。',dont:'背中を丸めない・首だけで捻らない。'},
    why:'腹直筋＋腹斜筋でくびれ形成を狙う。',
    breath:'ねじる時に吐き、中央に戻る時に吸う。',
    modify:'脚を下ろしかかとを床につけてOK。背中が丸まるなら手を後ろについて支える。',
    bridalArea:'waist', bridalBenefit:'ウエストのくびれと下腹の引き上げをめざす。'
  },
  {
    id:'yg_br_side_plank_twist', name:'サイドプランク・ツイスト', courses:['yoga'],
    targetProblems:['lateralAsymmetry','roundedShoulders'],
    category:'core', technique:'isometric', bodyPart:'core', intensity:3,
    equipment:'マット', position:'side', duration:'各15秒',
    illustration: SVG2.sidePlank,
    purpose:'サイドプランクで上の腕を体の下へ通す。',
    how:['サイドプランクの姿勢から上の手を天井へ伸ばす。','息を吐きながら、その手を体の下(脇の下)へくぐらせ上体を捻る。','戻して各15秒。反対も。'],
    cues:{do:'腰の高さを保ったまま捻る。',dont:'腰を落とさない・肩に痛みが出たら中止。'},
    why:'腹斜筋を回旋で強く動員。',
    breath:'手をくぐらせる時に吐き、戻す時に吸う。',
    modify:'下の膝を床について安定させる。肩に不安があれば通常のサイドプランクで代用。',
    bridalArea:'waist', bridalBenefit:'脇腹〜くびれを集中的に。横からのシルエットに効く。'
  },
  {
    id:'yg_br_revolved_chair', name:'ねじった椅子のポーズ(くびれ)', courses:['yoga'],
    targetProblems:['lateralAsymmetry','thoracicKyphosis'],
    category:'balance', technique:'integration', bodyPart:'core', intensity:2,
    equipment:'マット', position:'standing', duration:'各30秒',
    illustration: SVG2.spineTwist,
    purpose:'椅子のポーズに回旋を足し下半身とくびれを同時に。',
    how:['足を揃え、膝を曲げて椅子に座る形をつくり胸前で合掌。','息を吐きながら片肘を反対の太ももの外へかける。','胸から捻り30秒キープ。反対も。'],
    cues:{do:'胸から捻り、膝の高さを揃える。',dont:'膝が内に入らない・背中を丸めない。'},
    why:'脚力＋腹斜筋＋胸椎回旋の複合。',
    breath:'合掌して吸い、ねじりながら吐く。キープ中も呼吸を続ける。',
    modify:'ねじりは浅くてOK。膝がつらければ曲げを浅く、バランスが不安なら壁の近くで。',
    bridalArea:'waist', bridalBenefit:'くびれと下半身を同時に。代謝アップも狙える一石二鳥。'
  },
  {
    id:'yg_br_mermaid', name:'人魚のポーズ(サイドベンド)', courses:['yoga'],
    targetProblems:['lateralAsymmetry'],
    category:'selfcare', technique:'stretch', bodyPart:'core', intensity:2,
    equipment:'マット', position:'sitting', duration:'各30秒',
    illustration: SVG2.mermaid,
    purpose:'横座りから体側を長く伸ばす。',
    how:['両脚を横に流す横座りになり、片手を床に軽く添える。','息を吐きながら反対の腕を頭上から弧を描くように倒す。','脇腹の伸びを感じ30秒。反対も。'],
    cues:{do:'坐骨を床に保ち、脇腹を長く伸ばす。',dont:'肩をすくめない・前に倒れない。'},
    why:'体側(腹斜筋・広背筋)の伸展でくびれを整える。',
    breath:'吐きながら体側を伸ばし、吸って軽く戻す。',
    modify:'横座りがつらければあぐらで座って。伸びる範囲でOK、無理に深く倒さない。',
    bridalArea:'waist', bridalBenefit:'脇腹を伸ばし、詰まって見えないすっきりウエストへ。'
  },
  {
    id:'yg_br_thread_needle', name:'糸通しのねじり', courses:['yoga'],
    targetProblems:['lateralAsymmetry','thoracicKyphosis'],
    category:'mobility', technique:'stretch', bodyPart:'core', intensity:1,
    equipment:'マット', position:'quadruped', duration:'各30秒',
    illustration: SVG2.threadNeedle,
    purpose:'四つ這いから腕を通し背中と体側を捻る。',
    how:['四つ這いになり、片手を反対の手と膝の間から横へ通す。','肩と側頭部を床に軽く預ける。','吐く息で肩を沈め30秒。反対も。'],
    cues:{do:'吐く息で肩を深く沈める。',dont:'首に体重を乗せない・反動をつけない。'},
    why:'胸椎回旋と背面のリリース。',
    breath:'ゆっくり吐く息のたびに、肩を少しずつ床へ沈める。',
    modify:'肩が痛ければ通す腕を浅く。首がつらい時は下の腕を枕代わりにして高さを出す。',
    bridalArea:'waist', bridalBenefit:'背中〜脇のこわばりをほぐし、しなやかな上半身に。'
  },

];
