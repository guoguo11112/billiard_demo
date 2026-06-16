import { KnowledgeNode, KickingScenario, AimingScenario } from './types';

// ==========================================
// 1. KICKING KNOWLEDGE TREE (颗星解球模拟器 · 功能大纲)
// ==========================================
export const KICKING_KNOWLEDGE_TREE: KnowledgeNode[] = [
  // 1. 解球基础原理
  {
    id: 'k_1_1',
    title: '颗星与星点系统定义',
    section: '解球基础原理',
    type: 'kicking',
    difficulty: 'easy',
    description: '认识台边菱形「星点钻石点」。学习用星点给库边编号计算，是进行高阶几何运算的数字基础。',
    isUnlocked: true,
    scenarioIndex: 0,
    championTip: '斯蒂芬·亨得利：在斯诺克与九球中，库边的钻石点是上帝留给球手的‘标尺r。将长边记为10至80，端边记为10至50，本节演示课我将带你标注、理解标尺的基础读数。'
  },
  {
    id: 'k_1_2',
    title: '入射角 = 反射角（理想状态）',
    section: '解球基础原理',
    type: 'kicking',
    difficulty: 'easy',
    description: '当母球无塞（不带侧旋）且中等力度击出时，撞击库边后的行进轨迹完美遵循中心对称与反射定律。',
    isUnlocked: true,
    scenarioIndex: 1,
    championTip: '潘晓婷：记住，理想状况只存在于无塞。平时训练不仅是用眼，更是用心去感悟纯中杆击退时，两边角度的绝对镜像对称美感。'
  },
  {
    id: 'k_1_3',
    title: '力度、侧旋、台呢对反射角的影响',
    section: '解球基础原理',
    type: 'kicking',
    difficulty: 'medium',
    description: '实战中速度越快角度越收缩，慢速下呢绒摩擦会让弹开角变膨胀；顺塞会极大拉开反射角，而反塞则能把路线拉扁甚至直角折返。',
    isUnlocked: true,
    scenarioIndex: 2,
    championTip: '孔德京：中式台球桌的呢子通常比九球台更涩，台路变化更大。加左塞撞击右库，会像轮胎在地面打滑一样产生猛烈的弹射！'
  },

  // 2. 一库解球
  {
    id: 'k_2_1',
    title: '对称点法（几何镜像解法）',
    section: '一库解球',
    type: 'kicking',
    difficulty: 'easy',
    description: '一库解球的王牌法则。在脑海中对目标球以库边做对称镜像，用母球直接瞄准这个镜像虚球，即可在无塞下精准击中。',
    isUnlocked: true,
    scenarioIndex: 3,
    championTip: '潘晓婷：在打对称镜像球时，最容易受障碍球遮挡的干扰。盯着库边镜像点，平稳出杆，就当障碍球不存在。'
  },
  {
    id: 'k_2_2',
    title: '平行线法',
    section: '一库解球',
    type: 'kicking',
    difficulty: 'easy',
    description: '在母球与目标球之间拉出中轴，画一根中线平行移到库边，即可快速找到中等点位，速度极快无须公式口算。',
    isUnlocked: true,
    scenarioIndex: 4,
    championTip: '孔德京：平行线法在打遭遇斯诺克防守时能进行盲解，主要靠瞬间的立体空间直觉，中式快棋里极为实用。'
  },
  {
    id: 'k_2_3',
    title: '颗星公式法（九球台专用）',
    section: '一库解球',
    type: 'kicking',
    difficulty: 'medium',
    description: '九球台框点距标准，采用经典算术：母球点数 + 第一反射角偏差比值 = 精确击打坐标点。',
    isUnlocked: true,
    scenarioIndex: 5,
    championTip: '斯蒂芬·亨得利：在美式大台（九球台）上这套方法具有惊人的统计准度，中杆中力击出，九球天后晓婷在转打美式时便精通常用公式。'
  },

  // 3. 二库解球
  {
    id: 'k_3_1',
    title: '加二制公式（第一岸短边）',
    section: '二库解球',
    type: 'kicking',
    difficulty: 'medium',
    description: '利用“母球发射点 +/- 常数 = 二库终点”几何差。当第一击砸中短边，再反弹长边时，此公式可以轻松避开双侧死塞。',
    isUnlocked: true,
    scenarioIndex: 6,
    championTip: '孔德京：中式台球二库是破僵局的主要打法。使用‘加二制’时，中低杆发力，给球一个向后的内缩，两库间角度极度容易在第二库反弹时锁定。'
  },
  {
    id: 'k_3_2',
    title: '钻石制公式（第一岸长边）',
    section: '二库解球',
    type: 'kicking',
    difficulty: 'hard',
    description: '以长库钻石点为50作为基准线，利用斜率比对公式：起点 - 瞄准点 = 终点进行反推。',
    isUnlocked: true,
    scenarioIndex: 7,
    championTip: '斯蒂芬·亨得利：练习钻石制时，一定要保持母球没有‘混塞’。一丁点无意的旋转偏塞都会导致两库误差扩大3到4寸。'
  },
  {
    id: 'k_3_3',
    title: '等距二库解球法',
    section: '二库解球',
    type: 'kicking',
    difficulty: 'medium',
    description: '基于对称比例的中线推演，适合两端完全对称分布的台风布局，常用于破角袋死卡局。',
    isUnlocked: true,
    scenarioIndex: 8,
    championTip: '潘晓婷：当目标球被贴死在远端死角时，用等距两折是保稳的选择。记住，重点在利用桌角弹力！'
  },
  {
    id: 'k_3_4',
    title: 'N形解球（对折二库）',
    section: '二库解球',
    type: 'kicking',
    difficulty: 'hard',
    description: '大角度底沙切，双长库折叠呈N字或W字形状的超高视觉享受解球。',
    isUnlocked: true,
    scenarioIndex: 9,
    championTip: '斯蒂芬·亨得利：此球不仅需要高精度计算，更需要极强的高爆杆力。在斯诺克中，这种N型走位常在一打三防的极度下风中创造逆转奇迹。'
  },

  // 4. 三库及以上解球
  {
    id: 'k_4_1',
    title: '钻石制延伸（三库）',
    section: '三库及以上解球',
    type: 'kicking',
    difficulty: 'hard',
    description: '最经典的全台钻石算法。终点公式：母球起点点位 × 目标球所在落点系数 = 第一库瞄准刻度。绕行全台三库防守反击。',
    isUnlocked: true,
    scenarioIndex: 10,
    championTip: '斯蒂芬·亨得利：掌握三库计算的人，在台球思维上已经超凡脱俗。它是对全台几何律动的终极掌控，斯诺克大师必修中的必修。'
  },
  {
    id: 'k_4_2',
    title: '对称点法三库',
    section: '三库及以上解球',
    type: 'kicking',
    difficulty: 'hard',
    description: '利用三度空间镜像原理，将球台在两侧无限复制，拉出长直线，寻找相交的折射中轴点进行高精解球。',
    isUnlocked: true,
    scenarioIndex: 11,
    championTip: '潘晓婷：在脑中叠出两张隐形球台，这很玄妙，但只要经过数百次训练，你的大脑就会像投影仪一样自动投出镜像。'
  },
  {
    id: 'k_4_3',
    title: '四库解球（对称点拆解法）',
    section: '三库及以上解球',
    type: 'kicking',
    difficulty: 'hard',
    description: '通过对多边形对称线的不断微量分割，逆推出发射至四库后，回归原象限对角下球的可行折线。',
    isUnlocked: true,
    scenarioIndex: 12,
    championTip: '孔德京：打到四库基本是一场表演。除了基本弧度，对台面呢子弹性的‘预判’重于计算。在比赛中不要轻易尝试，除非没得解。'
  },

  // 5. 实战应用
  {
    id: 'k_5_1',
    title: '安全球解球策略',
    section: '实战应用',
    type: 'kicking',
    difficulty: 'easy',
    description: '不仅要能碰响球，还要计算球碰撞后的第二落点。如何做到碰球后主球缩回障碍区，给对手留下反制造斯诺克？',
    isUnlocked: true,
    scenarioIndex: 13,
    championTip: '斯蒂芬·亨得利：防守是台球的另一半灵魂。用最轻的力度轻轻触碰，将目标球死死贴在短库，主球拉远。你折折解解，对手痛若万箭穿心。'
  },
  {
    id: 'k_5_2',
    title: '杆法与力度控制',
    section: '实战应用',
    type: 'kicking',
    difficulty: 'medium',
    description: '同样的反射角度，使用中高杆会让弹出角度发生圆弧型收宿变小；用中低杆则会增大弹角度。',
    isUnlocked: true,
    scenarioIndex: 14,
    championTip: '孔德京：许多人以为解球就是瞄准。错！同样的力度，换高低杆点，落点相差整整一尺！'
  },
  {
    id: 'k_5_3',
    title: '公式结果的经验微调',
    section: '实战应用',
    type: 'kicking',
    difficulty: 'hard',
    description: '每个台球馆的湿度、球台质量、呢子新旧、温度都不同。教你学会如何试杆两局后，凭借大师直觉快速纠偏计算差。',
    isUnlocked: true,
    scenarioIndex: 15,
    championTip: '潘晓婷：公式是死的，球台和风速是活的。九球台呢干燥时，弹射会更清脆偏大，此时瞄准要比理论物理点偏外2至3公厘。'
  }
];

// ==========================================
// 2. AIMING KNOWLEDGE TREE (台球准度瞄准模拟器 · 功能大纲)
// ==========================================
export const AIMING_KNOWLEDGE_TREE: KnowledgeNode[] = [
  // 1. 瞄准物理原理
  {
    id: 'a_1_1',
    title: '弹性碰撞与球心连线',
    section: '瞄准物理原理',
    type: 'aiming',
    difficulty: 'easy',
    description: '台球进袋的终极物理机制：目标球被向前推进时，其受力方向百分之百是碰撞瞬间，两颗球物理切点之球心连线的沿伸方向。',
    isUnlocked: true,
    scenarioIndex: 0,
    championTip: '潘晓婷：不要看着球网去推球，那是不对的。找到目标球和袋底中心的那根‘黄金直线’，直线穿戴出的那个‘相交背面点’，就是你受力的正中心线。'
  },
  {
    id: 'a_1_2',
    title: '下球线路确定',
    section: '瞄准物理原理',
    type: 'aiming',
    difficulty: 'easy',
    description: '确定球路的起点到终点在台呢上的摩擦压痕。掌握顺延瞄准线的透视，排除人眼由于斜视角导致的假平行线偏差。',
    isUnlocked: true,
    scenarioIndex: 1,
    championTip: '孔德京：站位很重要，俯身前就要把下球线路在眼神里‘定死’。一旦弯下腰再去微调左右角度，你的准星已经废了一半。'
  },

  // 2. 核心瞄准方法
  {
    id: 'a_2_1',
    title: '假想球法（幽灵球法）',
    section: '核心瞄准方法',
    type: 'aiming',
    difficulty: 'medium',
    description: '全球教案通用的基础：在目标球后面脑补一颗紧贴着的影子母球。把真实母球的轴心，当成子弹射向极度逼真的影子中心，形成绝杀必进撞击。',
    isUnlocked: true,
    scenarioIndex: 2,
    championTip: '斯蒂芬·亨得利：每一个斯诺克职业选手，在瞄准时眼里看到的都是一个白色的‘幽灵影子’。只要你的白球中心点完全滑入这个影子圆心中，球必落。'
  },
  {
    id: 'a_2_2',
    title: '找尾巴法',
    section: '核心瞄准方法',
    type: 'aiming',
    difficulty: 'easy',
    description: '一种极简找点法：从目标球背向袋口反方向延长一个球半径的距离，那里有个虚拟的‘发力小尾巴’，出杆直指这个小尾巴。',
    isUnlocked: true,
    scenarioIndex: 3,
    championTip: '孔德京：这个方法极其适合粗犷的重切角度球，只要把心一横，把母球向着死界延长出来的点一撞，球想不进都难！'
  },
  {
    id: 'a_2_3',
    title: '厚薄法（比例法）',
    section: '核心瞄准方法',
    type: 'aiming',
    difficulty: 'medium',
    description: '将目标球从正面对视进行切分，根据两球重合比例（如1/2, 3/4, 1/4）对应的经典偏角：1/2重合是30度角，3/4重合是14.5度角等。',
    isUnlocked: true,
    scenarioIndex: 4,
    championTip: '潘晓婷：在九球这种偏快、重在球位衔接的比赛里，厚薄比例是非常直观的心算。打得熟练了，根本不用算公式，看一眼重合面积就大概知晓偏角分离。'
  },
  {
    id: 'a_2_4',
    title: '接触点法',
    section: '核心瞄准方法',
    type: 'aiming',
    difficulty: 'hard',
    description: '终极点点对瞄准。两颗球表面最先发生接触的那一瞬间相撞切点，排除圆心透视体积，直接实现物理粒子相吻。',
    isUnlocked: true,
    scenarioIndex: 5,
    championTip: '斯蒂芬·亨得利：接触点在微薄斯诺克薄球、强贴死球时，精度无出其右。它像是一场微米级别的精研手术。'
  },

  // 3. 瞄准系统化流程
  {
    id: 'a_3_1',
    title: '站位与入位（冠军站姿）',
    section: '瞄准系统化流程',
    type: 'aiming',
    difficulty: 'medium',
    description: '双脚后撤，让视线从全局高度对准切球中轴线重合，随后脊椎俯下、下巴轻触球击杆、肩膀后拉。本节课我们将交互模拟黄金出杆姿态下的一线准度。',
    isUnlocked: true,
    scenarioIndex: 6,
    championTip: '潘晓婷：女生打球容易因为身体姿势导致出杆摇摆。后脚撑定、重心压实是稳定的核心诀窍。站稳了，你出杆的一刹那，母球才会是一条干净清爽的射击。'
  },
  {
    id: 'a_3_2',
    title: '瞄准的视觉训练（看线不看点）',
    section: '瞄准系统化流程',
    type: 'aiming',
    difficulty: 'easy',
    description: '人的眼部容易造成错觉。纠正反复在白球、红球来回乱瞟导致的焦点游移，将视线在两点之间凝成一条实体钢轨通道。',
    isUnlocked: true,
    scenarioIndex: 7,
    championTip: '斯蒂芬·亨得利：在我的职业黄金期，每次俯身，目标带口到红球之间就有一条粗粗的金色亮轨。只看那些由远及近的轨迹，不去看单点盲瞄。'
  },
  {
    id: 'a_3_3',
    title: '出杆前确认步骤（三击一放）',
    section: '瞄准系统化流程',
    type: 'aiming',
    difficulty: 'easy',
    description: '出杆前杆头进行2至3次轻柔试杆，平复心跳。确认在第三次试杆杆端静止瞬间拉回至极点，松肩发射。',
    isUnlocked: true,
    scenarioIndex: 8,
    championTip: '孔德京：许多业余球手为了赶节奏直接推。你必须像狙击手屏息一样冷静，养成至少两次小推试探的完美肌肉记忆习惯。'
  },

  // 4. 不同球型瞄准策略
  {
    id: 'a_4_1',
    title: '直线球瞄准',
    section: '不同球型瞄准策略',
    type: 'aiming',
    difficulty: 'easy',
    description: '最简单也是最考验基本功的球。两球心与口袋心绝对三点一线。纠正由于微小‘出杆左右歪下塞’导致的弹射漂移。',
    isUnlocked: true,
    scenarioIndex: 9,
    championTip: '潘晓婷：直来直去最容易因为发力过猛而跑偏。高杆中低力度击打白球中心点，让白球顺着自己的轨道滑行。'
  },
  {
    id: 'a_4_2',
    title: '角度球瞄准（厚球/薄球）',
    section: '不同球型瞄准策略',
    type: 'aiming',
    difficulty: 'medium',
    description: '薄球击打接触点极少，摩擦力大，需要调整白球抛物线补偿值；厚球则需要强力直推，使目标球不被白球重量强行偏轨。',
    isUnlocked: true,
    scenarioIndex: 10,
    championTip: '孔德京：切薄球时，如果手紧很容易把重合度打大，导致厚。一定要敢于把手架抬高一些，出虚影打击。'
  },
  {
    id: 'a_4_3',
    title: '长台瞄准',
    section: '不同球型瞄准策略',
    type: 'aiming',
    difficulty: 'hard',
    description: '超过2.5米的远端台面。任何0.5毫米的出杆滑移，运动到远端都会放大为5公分的惊异偏差。',
    isUnlocked: true,
    scenarioIndex: 11,
    championTip: '斯蒂芬·亨得利：长台需要的是完全卸力，轻轻敲出高弹中杆。越是发狠想砸死红球，动作必定变形，长台必飞。'
  },

  // 5. 进阶与误区
  {
    id: 'a_5_1',
    title: '瞄准与出杆的联动关系',
    section: '进阶与误区',
    type: 'aiming',
    difficulty: 'medium',
    description: '瞄得完美，但是出杆时手腕有撇、捏或下沉动作，会导致球杆轨迹成为弧线，瞄点彻底丧失作用。',
    isUnlocked: true,
    scenarioIndex: 12,
    championTip: '孔德京：记住‘瞄准决定上限，出杆决定下限r。没有正脊挺胸的稳健中轴，你脑子算得像计算机，手也只会出废杆。'
  },
  {
    id: 'a_5_2',
    title: '常见瞄准误区',
    section: '进阶与误区',
    type: 'aiming',
    difficulty: 'easy',
    description: '包括紧盯袋口忽视碰撞面、瞄准时侧头偏心、以及高加塞下没有算反射错转角。',
    isUnlocked: true,
    scenarioIndex: 13,
    championTip: '潘晓婷：绝对不要盯着袋口下球！袋口只是一个目的，碰撞白球瞬间，它和空气产生的撞击交汇核心影子才是你要征服的目的地。'
  },
  {
    id: 'a_5_3',
    title: '从方法到感觉的内化路径',
    section: '进阶与误区',
    type: 'aiming',
    difficulty: 'hard',
    description: '当你打过1万个球，你将彻底忘掉加二制、平行法、假想影子。一俯身，球路自动发出淡淡幽光亮起，这就是职业肌肉记忆。',
    isUnlocked: true,
    scenarioIndex: 14,
    championTip: '斯蒂芬·亨得利：重剑无锋，大巧不工。冠军是枯燥练习中提炼出来的极致本能。当你俯身闭眼都觉得能进，你就已经完成了向真正大师一跃。'
  }
];

// ==========================================
// 3. KICKING SCENARIOS (完美对应KICKING_KNOWLEDGE_TREE的16关卡，解球图完全真实显示)
// ==========================================
export const KICKING_SCENARIOS: KickingScenario[] = [
  // 1. (Interactive k_1_1)
  {
    id: 'k_sc_1',
    title: '星点与基本颗星轨道基础演练',
    subtitle: '解球基础原理 · 颗星与星点系统定义',
    description: '在台壁的边缘（Top Rail）排列着金黄色钻石星点，每颗星点标注着计算标尺。请点击拖拽黄色的【颗星控制点】或者底部的母球，让轨道落入下方空旷区域中进行物理反弹测试，深度体会入射角等于反射角。',
    cushions: 1,
    cueBall: { x: 180, y: 260 },
    targetBall: { x: 540, y: 300 },
    obstacleBalls: [
      { x: 360, y: 200, r: 12 }
    ],
    initialCushionAim: { x: 360, y: 30 },
    diamonds: [
      { x: 112.5, y: 15, label: '10' },
      { x: 195, y: 15, label: '20' },
      { x: 277.5, y: 15, label: '30' },
      { x: 360, y: 15, label: '40 (中点)' },
      { x: 442.5, y: 15, label: '50' },
      { x: 525, y: 15, label: '60' },
      { x: 607.5, y: 15, label: '70' },
    ],
    champion: {
      name: '斯蒂芬·亨得利',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      title: '斯诺克台球皇帝 · 7届世锦赛冠军',
      tip: '“拖拽黄色滑块，观察对称的反弹轨迹。中路40点是几何中轴线。请试着随意用手拖拽两侧的白球、黄色目标球，轨迹会自动随之反切！这会帮你把物理动线和大脑融为一体。”'
    }
  },
  // 2. (Locked k_1_2)
  {
    id: 'k_sc_4',
    title: '反射定理物理极度解析模型',
    subtitle: '解球基础原理 · 入射角=反射角',
    description: '母球与靶球分居对角，通过对长边中部的黄金切点反弹实现全包容轨迹。系统已自动代入100%完美的折射计算公式，可直接击球。',
    cushions: 1,
    cueBall: { x: 180, y: 120 },
    targetBall: { x: 540, y: 240 },
    obstacleBalls: [],
    initialCushionAim: { x: 360, y: 345 },
    diamonds: [
      { x: 360, y: 345, label: '黄金中点' }
    ],
    champion: {
      name: '潘晓婷',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      title: '九球天后 · 世界冠军课程导师',
      tip: '“本关为教研自运行课：系统利用一库反射对称关系，为您完美解算出黄金中点撞击轨迹。高精物理模型已锁定，开始击球，尽情观摩其完美的几何精度吧！”'
    }
  },
  // 3. (Locked k_1_3)
  {
    id: 'k_sc_5',
    title: '高阶旋转侧塞与力度对冲模型',
    subtitle: '解球基础原理 · 侧塞力度影响',
    description: '当母球面临中央防守红球时，需要依靠偏塞调整反射角度。本关自动锁定中塞偏折，实现圆滑飞掠贴合。',
    cushions: 1,
    cueBall: { x: 150, y: 150 },
    targetBall: { x: 450, y: 150 },
    obstacleBalls: [{ x: 300, y: 150, r: 15 }],
    initialCushionAim: { x: 300, y: 15 },
    diamonds: [
      { x: 300, y: 15, label: '上边反射星点' }
    ],
    champion: {
      name: '孔德京',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      title: '中式台球名宿 · 冠军控球大师',
      tip: '“加偏塞击打会让反射角产生大范围偏位。我们在这个案例中为您锁定了最佳偏倚差，请直接点击‘开始击球模拟’体验这股奇妙的反弹力。”'
    }
  },
  // 4. (Interactive k_2_1)
  {
    id: 'k_sc_2',
    title: '对称点镜像法：一库翻跃绕过防守红球',
    subtitle: '一库解球 · 对称点法',
    description: '红球把直接通路挡得死死的，但下方有一个金黄的9号目标球。用我们推荐的“一库对称点反射法”，拖动左侧长库上的【颗星控制点】，把它的落点反射角调整到完美重合，越过封锁线碰击9号球！',
    cushions: 1,
    cueBall: { x: 420, y: 310 },
    targetBall: { x: 620, y: 100 },
    obstacleBalls: [
      { x: 500, y: 220, r: 16 },
      { x: 530, y: 220, r: 16 }
    ],
    initialCushionAim: { x: 30, y: 240 },
    diamonds: [
      { x: 15, y: 90, label: 'D1' },
      { x: 15, y: 180, label: 'D2' },
      { x: 15, y: 270, label: 'D3' },
    ],
    champion: {
      name: '潘晓婷',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      title: '九球天后 · 世界冠军课程导师',
      tip: '“拖动左侧红色的障碍点或者反弹轴，用无塞中等力度推出。对称点镜像的诀窍在左侧滑轴上，你可以拖移白球或黄色9号球来重建你自己的斯诺克防守死角。多维物理引擎会帮你进行镜像计算哦！”'
    }
  },
  // 5. (Locked k_2_2)
  {
    id: 'k_sc_6',
    title: '无塞平行线法快速瞄点观摩',
    subtitle: '一库解球 · 平行线法',
    description: '当白球与黄球处于平行分布，在中轴处切分，即可得到无需数字的落位中心。案例已锁定，方便直接感受中置平行弹射。',
    cushions: 1,
    cueBall: { x: 260, y: 260 },
    targetBall: { x: 460, y: 260 },
    obstacleBalls: [{ x: 360, y: 200, r: 16 }],
    initialCushionAim: { x: 360, y: 15 },
    diamonds: [
      { x: 360, y: 15, label: '平行对称轴点' }
    ],
    champion: {
      name: '孔德京',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      title: '中式台球名宿 · 冠军控球大师',
      tip: '“不需要任何加减计算。找出两球连线的平行对称线，直推母球即可！请直接启动击球查看。”'
    }
  },
  // 6. (Locked k_2_3)
  {
    id: 'k_sc_7',
    title: '标准九球台颗星比值反射案例',
    subtitle: '一库解球 · 颗星公式法',
    description: '利用比值计算：母球发射点与上长库的第一瞄准点进行斜率对冲。锁定黄金折线轨。',
    cushions: 1,
    cueBall: { x: 180, y: 290 },
    targetBall: { x: 540, y: 80 },
    obstacleBalls: [{ x: 360, y: 185, r: 16 }],
    initialCushionAim: { x: 15, y: 145 },
    diamonds: [
      { x: 15, y: 145, label: '算术钻石点' }
    ],
    champion: {
      name: '斯蒂芬·亨得利',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      title: '斯诺克台球皇帝 · 7届世锦赛冠军',
      tip: '“美式九球的精确度得益于标准钻石外框。经典点位对齐算术已在此锁定。直接球模拟可保百分百极准擦击。”'
    }
  },
  // 7. (Interactive k_3_1)
  {
    id: 'k_sc_3',
    title: '加二公式系统：二库连续反弹直击对角',
    subtitle: '二库解球 · 加二制公式（短岸长岸）',
    description: '超强二库折弯！障碍群挡住全部上台，目标黄色球贴于右下底库。我们需要借助“加二制”，让母球发射往左下的短端库，再沿着下长库双折射，最终闪击并干掉目标球！',
    cushions: 2,
    cueBall: { x: 460, y: 120 },
    targetBall: { x: 640, y: 300 },
    obstacleBalls: [
      { x: 500, y: 210, r: 16 },
      { x: 560, y: 180, r: 16 },
      { x: 410, y: 220, r: 16 }
    ],
    initialCushionAim: { x: 30, y: 190 },
    diamonds: [
      { x: 15, y: 90, label: '10' },
      { x: 15, y: 180, label: '20' },
      { x: 15, y: 270, label: '30' },
      { x: 120, y: 345, label: '40' },
      { x: 280, y: 345, label: '50' },
    ],
    champion: {
      name: '孔德京',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      title: '中式台球名宿 · 冠军控球大师',
      tip: '“中式黑八极度讲究加二公式的运用。请在这里体验短岸打点（Y轴190上下），双弹库像闪电划破死局！用你的鼠标自由拖拽白球与目标，感觉球台反弹的张力，这就是高阶实战。”'
    }
  },
  // 8. (Locked k_3_2)
  {
    id: 'k_sc_8',
    title: '长岸钻石斜率比二库物理映射',
    subtitle: '二库解球 · 折算钻石制',
    description: '母球从上大角砸入长库。在无塞纯中杆状态下，完美利用第二长边反弹。高精二星折线已自动锁定。',
    cushions: 2,
    cueBall: { x: 200, y: 100 },
    targetBall: { x: 520, y: 260 },
    obstacleBalls: [{ x: 360, y: 180, r: 15 }],
    initialCushionAim: { x: 360, y: 345 },
    diamonds: [
      { x: 360, y: 345, label: '长岸打点' }
    ],
    champion: {
      name: '斯蒂芬·亨得利',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      title: '斯诺克台球皇帝 · 7届世锦赛冠军',
      tip: '“这是最完美的斜向大折叠轨道。我常利用这个二库反切线路跳出斯诺克绞防局。点击击球，享受纯物理轨迹吧！”'
    }
  },
  // 9. (Locked k_3_3)
  {
    id: 'k_sc_9',
    title: '等距对称底角二库特训案例',
    subtitle: '二库解球 · 等距二库解法',
    description: '适用于目标球死卡角袋口时。通过两短边的等比例拉扯。轨迹已演算完美锁定。',
    cushions: 2,
    cueBall: { x: 150, y: 120 },
    targetBall: { x: 570, y: 120 },
    obstacleBalls: [{ x: 360, y: 150, r: 16 }],
    initialCushionAim: { x: 360, y: 345 },
    diamonds: [
      { x: 360, y: 345, label: '对称中线' }
    ],
    champion: {
      name: '潘晓婷',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      title: '九球天后 · 世界冠军课程导师',
      tip: '“等比例折线虽然看起来绕路，但在解救死定中袋的目标球时成功率高极了。案例已配载。一键点击开始仿真模拟。”'
    }
  },
  // 10. (Locked k_3_4)
  {
    id: 'k_sc_10',
    title: '高爆N极弹射折叠二库观摩',
    subtitle: '二库解球 · N形折线',
    description: '极高难度：让母球在长岸侧重力横向反射，依靠高爆能量直接把反向大角拉薄、弹落。',
    cushions: 2,
    cueBall: { x: 180, y: 120 },
    targetBall: { x: 300, y: 240 },
    obstacleBalls: [{ x: 240, y: 180, r: 15 }],
    initialCushionAim: { x: 705, y: 180 },
    diamonds: [
      { x: 705, y: 180, label: '回折端岸' }
    ],
    champion: {
      name: '斯蒂芬·亨得利',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      title: '斯诺克台球皇帝 · 7届世锦赛冠军',
      tip: '“这需要对球库橡胶的形变力有绝佳感知。N形轨道已经过精研矫正，直接双库砸折吧！”'
    }
  },
  // 11. (Locked k_4_1)
  {
    id: 'k_sc_11',
    title: '绕行全台三岸黄金落位全解析',
    subtitle: '三库及以上解球 · 三库钻石制',
    description: '最负盛名的钻石制乘除计算。绕行全台长边-短边-长边，完美绕过重叠障碍群直切要害。',
    cushions: 3,
    cueBall: { x: 120, y: 100 },
    targetBall: { x: 500, y: 260 },
    obstacleBalls: [{ x: 280, y: 180, r: 16 }],
    initialCushionAim: { x: 520, y: 345 },
    diamonds: [
      { x: 520, y: 345, label: '初点瞄位' }
    ],
    champion: {
      name: '斯蒂芬·亨得利',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      title: '斯诺克台球皇帝 · 7届世锦赛冠军',
      tip: '“真正的大师特训。大范围三折线，绕行整个绿茵，最终贴地滑入。直接击球模拟起飞！”'
    }
  },
  // 12. (Locked k_4_2)
  {
    id: 'k_sc_12',
    title: '三叠空间投影三库物理复刻',
    subtitle: '三库及以上解球 · 三库对称镜像',
    description: '假设台面像镜子一样朝周围平展无限延伸。连成一直线并映射撞击，三折精准归位。',
    cushions: 3,
    cueBall: { x: 240, y: 110 },
    targetBall: { x: 480, y: 250 },
    obstacleBalls: [{ x: 380, y: 180, r: 15 }],
    initialCushionAim: { x: 15, y: 220 },
    diamonds: [
      { x: 15, y: 220, label: '左岸击打点' }
    ],
    champion: {
      name: '潘晓婷',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      title: '九球天后 · 世界冠军课程导师',
      tip: '“不需要被杂乱障碍红球迷惑。盯着系统自动解耦出来的多库镜像滑轴，启动解围！”'
    }
  },
  // 13. (Locked k_4_3)
  {
    id: 'k_sc_13',
    title: '极地超越：完美反弹四星绝境击落',
    subtitle: '三库及以上解球 · 四库拆解法',
    description: '四星反弹，台面最高维度几何演出。沿着上、左、下、右四壁极速滑动碰撞！',
    cushions: 4,
    cueBall: { x: 160, y: 240 },
    targetBall: { x: 580, y: 120 },
    obstacleBalls: [{ x: 370, y: 180, r: 15 }],
    initialCushionAim: { x: 400, y: 345 },
    diamonds: [
      { x: 400, y: 345, label: '一岸起发点' }
    ],
    champion: {
      name: '孔德京',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      title: '中式台球名宿 · 冠军控球大师',
      tip: '“四库撞痕已精确校验。直接点击模拟，这是台球馆里最耀眼的华丽弧线绝杀场面。”'
    }
  },
  // 14. (Locked k_5_1)
  {
    id: 'k_sc_14',
    title: '撞碰贴防守斯诺克安全策略',
    subtitle: '实战应用 · 安全球防御',
    description: '精研碰击力度，使目标球撞开之后，母球缓缓向短端顶库滑动，给对方埋设极致防御陷阱。',
    cushions: 1,
    cueBall: { x: 200, y: 140 },
    targetBall: { x: 520, y: 140 },
    obstacleBalls: [{ x: 360, y: 220, r: 16 }],
    initialCushionAim: { x: 360, y: 15 },
    diamonds: [
      { x: 360, y: 15, label: '顶库对心' }
    ],
    champion: {
      name: '斯蒂芬·亨得利',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      title: '斯诺克台球皇帝 · 7届世锦赛冠军',
      tip: '“碰击后不仅要球进，更要做防守。点击模拟，体会白球最后温柔落位的斯诺克终极控速。”'
    }
  },
  // 15. (Locked k_5_2)
  {
    id: 'k_sc_15',
    title: '推进低高杆弧线反射补偿校对',
    subtitle: '实战应用 · 杆法力度对撞',
    description: '通过高低杆造成的抛物线形变偏移，校零理论弹射点。黄金物理摩擦补偿已锁定。',
    cushions: 1,
    cueBall: { x: 150, y: 160 },
    targetBall: { x: 570, y: 200 },
    obstacleBalls: [{ x: 360, y: 180, r: 16 }],
    initialCushionAim: { x: 360, y: 345 },
    diamonds: [
      { x: 360, y: 345, label: '弹痕库点' }
    ],
    champion: {
      name: '孔德京',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      title: '中式台球名宿 · 冠军控球大师',
      tip: '“加塞会让反射轨迹产生细微弧度挪移。点击模拟看白球带着迷人塞线切入。”'
    }
  },
  // 16. (Locked k_5_3)
  {
    id: 'k_sc_16',
    title: '实战呢绒磨旧度物理感知微调',
    subtitle: '实战应用 · 经验法则避差',
    description: '终极微调：为旧呢子球台多偏离2公厘，实战黄金校准案例。完美对折。',
    cushions: 1,
    cueBall: { x: 140, y: 200 },
    targetBall: { x: 580, y: 140 },
    obstacleBalls: [{ x: 360, y: 180, r: 16 }],
    initialCushionAim: { x: 360, y: 15 },
    diamonds: [
      { x: 360, y: 15, label: '修正瞄点' }
    ],
    champion: {
      name: '潘晓婷',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      title: '九球天后 · 世界冠军课程导师',
      tip: '“经验微调能让你免遭球台老化影响。理论模型已修正阻尼，点击直接开始完美折射吧。”'
    }
  }
];

// ==========================================
// 4. AIMING SCENARIOS (完美对应AIMING_KNOWLEDGE_TREE的15关卡，瞄准图完全真实显示)
// ==========================================
export const AIMING_SCENARIOS: AimingScenario[] = [
  // 1. (Interactive a_1_1)
  {
    id: 'a_sc_1',
    title: '球心连线受力原理及碰撞点追踪',
    subtitle: '瞄准物理原理 · 弹性碰撞与球心连线',
    description: '基础教学：任何偏角下，目标球的弹开线一定处于「接触瞬间，白球圆心到黄球圆心的连线」上。尝试随意移动白球或黄色9号球，拉拽底部右侧滑条对准并点击“击球模拟”，观察那根黄色的碰击中轴。',
    cueBall: { x: 180, y: 220 },
    objectBall: { x: 440, y: 150 },
    pocket: { x: 690, y: 30, r: 24, label: '右上角袋' },
    initialAimAngle: -0.22,
    champion: {
      name: '潘晓婷',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      title: '九球天后 · 世界冠军课程导师',
      tip: '“白球只要碰黄球，连成的轴线绝对是进球的方向，这是永恒的公式。用你的鼠标随意拖动白球、黄球的位置，出杆手感和矢量线会立刻跟随你的布置变化。点击模拟，打入右上角袋吧！”'
    }
  },
  // 2. (Locked a_1_2)
  {
    id: 'a_sc_4',
    title: '下球物理线路与摩擦轨迹规划',
    subtitle: '瞄准物理原理 · 下球线纠偏',
    description: '锁定中偏角度进底袋线路。系统精密计算重力压痕，排查斜切人眼偏差，保证纯直推入网。',
    cueBall: { x: 200, y: 250 },
    objectBall: { x: 410, y: 180 },
    pocket: { x: 690, y: 30, r: 24, label: '右上角袋' },
    initialAimAngle: -0.32,
    champion: {
      name: '孔德京',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      title: '中式台球名宿 · 冠军控球大师',
      tip: '“看清中轴连线，站得笔直能助你完全避开下半身视觉偏差带来的歪杆。锁定黄金准角，点击直接轰入底袋！”'
    }
  },
  // 3. (Interactive a_2_1)
  {
    id: 'a_sc_2',
    title: '经典假想影子球：经典30度切角进袋',
    subtitle: '核心瞄准方法 · 假想球法/幽灵球法',
    description: '著名的“Ghost Ball（幽灵假想球）”可视化教程。在目标黄色球正后方，我们渲染出了一个淡淡的「白色虚影」。将出杆准星线不偏不倚正好打向白色虚球的轴心，便可带出一发完美落袋。',
    cueBall: { x: 220, y: 290 },
    objectBall: { x: 460, y: 170 },
    pocket: { x: 690, y: 30, r: 24, label: '右上角袋' },
    initialAimAngle: -0.45,
    champion: {
      name: '斯蒂芬·亨得利',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      title: '斯诺克台球皇帝 · 7届世锦赛冠军',
      tip: '“在这里，幽灵虚球（Ghost Ball）已被我们用白光点圈了出来。拖动滑轨射准影子正中心，你会看到白球到位切断目标，使其坠入网袋！拖拽改动两球间距，感悟那颗隐形球在不同位置的变化。”'
    }
  },
  // 4. (Locked a_2_2)
  {
    id: 'a_sc_5',
    title: '延长线‘找尾巴’中折射落袋大纲',
    subtitle: '核心瞄准方法 · 找尾巴极简法',
    description: '在目标球向外引出球半径的一毫米短线上，作为枪星。案例已精确解析并锁死。',
    cueBall: { x: 180, y: 270 },
    objectBall: { x: 430, y: 190 },
    pocket: { x: 690, y: 185, r: 24, label: '右中袋' },
    initialAimAngle: -0.25,
    champion: {
      name: '孔德京',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      title: '中式台球名宿 · 冠军控球大师',
      tip: '“薄切中袋最适合倒推尾部切口点。幽灵线路已备好，点击击球即可验证。”'
    }
  },
  // 5. (Locked a_2_3)
  {
    id: 'a_sc_6',
    title: '重合重叠面积几何比例切入特训',
    subtitle: '核心瞄准方法 · 厚薄法（比例法）',
    description: '通过切分切点体积重合（如1/2或3/4等比例）自动转换夹角进袋。经典30度黄金厚度关。',
    cueBall: { x: 220, y: 280 },
    objectBall: { x: 450, y: 200 },
    pocket: { x: 690, y: 30, r: 24, label: '右上角袋' },
    initialAimAngle: -0.40,
    champion: {
      name: '潘晓婷',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      title: '九球天后 · 世界冠军课程导师',
      tip: '“半球重叠角就是天然的30度夹角，无需精算，一看便知。点击直接完成碰撞仿真。”'
    }
  },
  // 6. (Locked a_2_4)
  {
    id: 'a_sc_7',
    title: '质心相吻粒子接触面极度点瞄准',
    subtitle: '核心瞄准方法 · 接触点法',
    description: '在微距放大视野下，校零最先触碰的吻合圆切点，完美避开体积惯性引起的切薄。',
    cueBall: { x: 150, y: 220 },
    objectBall: { x: 420, y: 150 },
    pocket: { x: 690, y: 30, r: 24, label: '右上角袋' },
    initialAimAngle: -0.22,
    champion: {
      name: '斯蒂芬·亨得利',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      title: '斯诺克台球皇帝 · 7届世锦赛冠军',
      tip: '“打超薄球或斯诺克贴死局时，紧盯着这个皮垫物理触点便能绝杀成功。点击模拟发射。”'
    }
  },
  // 7. (Interactive a_3_1)
  {
    id: 'a_sc_3',
    title: '中八冠军级站姿：偏角切入与出杆校验',
    subtitle: '瞄准系统化流程 · 站位与入位',
    description: '大角度实战演习：母球偏下侧，目标球靠近上壁。切击时受视距误差影响极大。调整夹角，对正幽灵球相切线，使球旋转切落，测试在长台远距离位下如何站稳，做到出杆如刀切般利落。',
    cueBall: { x: 140, y: 260 },
    objectBall: { x: 450, y: 220 },
    pocket: { x: 690, y: 185, r: 24, label: '右中袋' },
    initialAimAngle: -0.15,
    champion: {
      name: '孔德京',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      title: '中式台球名宿 · 冠军控球大师',
      tip: '“大斜角切中袋是中式台路最要命的难关，稍不留神就会手腕抖动导致失准。保持中腰俯身低伏，拖动画板尝试把它调整得恰到好处。我教你一招：拖动白球靠更近，摩擦变大，就需要再薄0.5毫米！”'
    }
  },
  // 8. (Locked a_3_2)
  {
    id: 'a_sc_8',
    title: '视线锁定视网亮轨钢信通道模型',
    subtitle: '瞄准系统化流程 · 亮轨钢线眼力',
    description: '将母球、目标球、网袋串切为无偏纯中轨中袋。高维黄金轨道已连成。',
    cueBall: { x: 160, y: 200 },
    objectBall: { x: 440, y: 200 },
    pocket: { x: 690, y: 200, r: 24, label: '右中袋' },
    initialAimAngle: 0,
    champion: {
      name: '斯蒂芬·亨得利',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      title: '斯诺克台球皇帝 · 7届世锦赛冠军',
      tip: '“直线球重点在彻底摒弃袋口，将目光凝成一束钢梁。点击，体会这条完美顺推轨迹。”'
    }
  },
  // 9. (Locked a_3_3)
  {
    id: 'a_sc_9',
    title: '轻柔回推‘三击一放’静息校正演示',
    subtitle: '瞄准系统化流程 · 出杆试击频率',
    description: '推杆前后晃动二次，在第三次静止时轻轻松拉爆发，实现完美能量传递。线路已锁定。',
    cueBall: { x: 150, y: 240 },
    objectBall: { x: 400, y: 180 },
    pocket: { x: 690, y: 30, r: 24, label: '右上角袋' },
    initialAimAngle: -0.28,
    champion: {
      name: '孔德京',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      title: '中式台球名宿 · 冠军控球大师',
      tip: '“肌肉节奏平复能让白球受力不产生一丝打滑，点击直接发射，看其完美的落网。”'
    }
  },
  // 10. (Locked a_4_1)
  {
    id: 'a_sc_10',
    title: '绝对三点一线无转偏摆推进特训',
    subtitle: '不同球型瞄准策略 · 三点一线中杆',
    description: '母球、中袋、黄球毫无夹角。纠正出手时不经意的加左右塞，极简纯净推演。',
    cueBall: { x: 180, y: 180 },
    objectBall: { x: 440, y: 180 },
    pocket: { x: 690, y: 180, r: 24, label: '右中袋' },
    initialAimAngle: 0,
    champion: {
      name: '潘晓婷',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      title: '九球天后 · 世界冠军课程导师',
      tip: '“越简单越容易粗心导致滑塞飞出。锁定中心，中击直接开始一杆穿心！”'
    }
  },
  // 11. (Locked a_4_2)
  {
    id: 'a_sc_11',
    title: '超斜角厚薄抛物面阻力抵消补偿',
    subtitle: '不同球型瞄准策略 · 偏斜角薄球',
    description: '切擦大角度进袋，考虑球呢表面由于球旋转带出的反向扭动力偏离。完美修正方案锁定。',
    cueBall: { x: 220, y: 290 },
    objectBall: { x: 440, y: 180 },
    pocket: { x: 690, y: 30, r: 24, label: '右上角袋' },
    initialAimAngle: -0.5,
    champion: {
      name: '孔德京',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      title: '中式台球名宿 · 冠军控球大师',
      tip: '“切角度极大的薄球时有下潜摩擦。我们已经矫正了最佳切入点，点击完美击落。”'
    }
  },
  // 12. (Locked a_4_3)
  {
    id: 'a_sc_12',
    title: '2.8米极速卸力长台一发绝杀对顶',
    subtitle: '不同球型瞄准策略 · 远距长台一击',
    description: '斯诺克皇帝名震天下的绝活：完全卸力中速轻轻推撞，将2.8米外目标稳稳切底。',
    cueBall: { x: 120, y: 180 },
    objectBall: { x: 500, y: 180 },
    pocket: { x: 690, y: 180, r: 24, label: '右中袋' },
    initialAimAngle: 0,
    champion: {
      name: '斯蒂芬·亨得利',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      title: '斯诺克台球皇帝 · 7届世锦赛冠军',
      tip: '“长台永远不要想砸碎台面，手架搭定，出杆轻柔弹落。点击让白球长途绝杀！”'
    }
  },
  // 13. (Locked a_5_1)
  {
    id: 'a_sc_13',
    title: '腕关节水平推杆不偏移校验仿真',
    subtitle: '进阶与误区 · 手腕下摆纠邪',
    description: '通过物理轨迹推演，校准直进出杆，克服击发时胳膊有撇角、捏弧的恶劣坏习惯。',
    cueBall: { x: 160, y: 250 },
    objectBall: { x: 420, y: 160 },
    pocket: { x: 690, y: 30, r: 24, label: '右上角袋' },
    initialAimAngle: -0.32,
    champion: {
      name: '孔德京',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      title: '中式台球名宿 · 冠军控球大师',
      tip: '“本案例帮您彻底锁定水平轴杆，排除出杆瞬间由于甩腕造成的偏航。一键击发。”'
    }
  },
  // 14. (Locked a_5_2)
  {
    id: 'a_sc_14',
    title: '排除死视距及偏头视觉扭曲误差',
    subtitle: '进阶与误区 · 视轴同轴校验',
    description: '修正单眼主导由于侧脸造成的进球线往右偏移现象。高精平衡线已就绪。',
    cueBall: { x: 230, y: 270 },
    objectBall: { x: 460, y: 150 },
    pocket: { x: 690, y: 30, r: 24, label: '右上角袋' },
    initialAimAngle: -0.42,
    champion: {
      name: '潘晓婷',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      title: '九球天后 · 世界冠军课程导师',
      tip: '“俯身时，下巴擦过球杆，能将眼睛里造成的偏差归零。直接模拟查看进袋。”'
    }
  },
  // 15. (Locked a_5_3)
  {
    id: 'a_sc_15',
    title: '人机一体万次对撞后肌肉记忆本能',
    subtitle: '进阶与误区 · 从技巧彻底过渡到直觉',
    description: '终极合一：俯身即是轨迹高亮。神级高精切入，百分百进网仿真。',
    cueBall: { x: 180, y: 220 },
    objectBall: { x: 450, y: 150 },
    pocket: { x: 690, y: 30, r: 24, label: '右上角袋' },
    initialAimAngle: -0.22,
    champion: {
      name: '斯蒂芬·亨得利',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      title: '斯诺克台球皇帝 · 7届世锦赛冠军',
      tip: '“在万次击打后，大脑只需感觉。物理终极轨迹已高亮，点击发射感受重剑无锋的极致力量吧！”'
    }
  }
];
