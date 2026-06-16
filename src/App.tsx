import React, { useState } from 'react';
import { 
  KICKING_SCENARIOS, 
  AIMING_SCENARIOS,
  KICKING_KNOWLEDGE_TREE,
  AIMING_KNOWLEDGE_TREE
} from './data';
import KickingSimulator from './components/KickingSimulator';
import AimingSimulator from './components/AimingSimulator';
import { 
  Award, 
  BookOpen, 
  Zap, 
  Compass, 
  ChevronRight, 
  ChevronDown,
  Layers, 
  Sparkles,
  Volume2,
  Target,
  Trophy,
  Bookmark,
  FileText,
  Lock,
  Unlock,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  // Active simulator type: 'kicking' (台球颗星解球模拟器) or 'aiming' (台球准度瞄准模拟器)
  const [activeMode, setActiveMode] = useState<'kicking' | 'aiming'>('kicking');
  const [kickingIndex, setKickingIndex] = useState(0);
  const [aimingIndex, setAimingIndex] = useState(0);

  // Collapsible case picker state: default is fully collapsed (尽量折叠)
  const [isPickerExpanded, setIsPickerExpanded] = useState(false);
  // Accordion expanded group section name state
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const activeKickingScenario = KICKING_SCENARIOS[kickingIndex];
  const activeAimingScenario = AIMING_SCENARIOS[aimingIndex];

  // Group syllabus indexes by chapter name
  const kickingChapters = [
    { name: '解球基础原理', indexes: [0, 1, 2] },
    { name: '一库解球', indexes: [3, 4, 5] },
    { name: '二库解球', indexes: [6, 7, 8, 9] },
    { name: '三库及以上解球', indexes: [10, 11, 12] },
    { name: '实战应用', indexes: [13, 14, 15] },
  ];

  const aimingChapters = [
    { name: '瞄准物理原理', indexes: [0, 1] },
    { name: '核心瞄准方法', indexes: [2, 3, 4, 5] },
    { name: '瞄准系统化流程', indexes: [6, 7, 8] },
    { name: '不同球型瞄准策略', indexes: [9, 10, 11] },
    { name: '进阶与误区', indexes: [12, 13, 14] },
  ];

  const currentChapters = activeMode === 'kicking' ? kickingChapters : aimingChapters;
  const currentSyllabus = activeMode === 'kicking' ? KICKING_KNOWLEDGE_TREE : AIMING_KNOWLEDGE_TREE;
  const currentIndex = activeMode === 'kicking' ? kickingIndex : aimingIndex;
  const activeScenario = activeMode === 'kicking' ? activeKickingScenario : activeAimingScenario;

  // Find the chapter containing the currently selected scenario
  const activeChapterInfo = currentChapters.find(ch => ch.indexes.includes(currentIndex)) || currentChapters[0];

  const handleLessonSelect = (index: number, chapterName: string) => {
    if (activeMode === 'kicking') {
      setKickingIndex(index);
    } else {
      setAimingIndex(index);
    }
    // Maintain focus but don't force closure if they want to browse
  };

  // Determine if a scenario is interactive
  const checkIfInteractive = (scId: string) => {
    return scId === 'k_sc_1' || scId === 'k_sc_2' || scId === 'k_sc_3' ||
           scId === 'a_sc_1' || scId === 'a_sc_2' || scId === 'a_sc_3';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" id="main-app">
      {/* Premium Sticky Top Ribbon Banner with world champions names */}
      <header className="bg-slate-900/80 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-30" id="header">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 shrink-0">
              <Trophy className="w-6 h-6 text-amber-500 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-sky-400 to-amber-500 bg-clip-text text-transparent">
                  与王牌世界冠军打台球 · 尊享特训小程序
                </h1>
                <span className="text-[9px] tracking-widest uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">
                  官方联名教研版
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5 font-mono">
                课程导师: 潘晓婷 (九球天后) • 斯蒂芬·亨得利 (台球皇帝) • 孔德京 (中式控球名宿)
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs bg-slate-950 border border-slate-800 rounded-full px-4 py-2 text-slate-400" id="announcement">
              <Volume2 className="w-3.5 h-3.5 text-amber-500" />
              <span>2026台球多维几何高精度物理解析系统</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Welcome Intro (Aesthetic & Professional) */}
      <div className="bg-slate-900/20 border-b border-slate-900 px-4 py-5" id="hero-intro">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="max-w-3xl">
            <h2 className="text-sm font-bold text-amber-400 font-mono tracking-wider flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> SPECIAL MASTERCLASS SIMULATORS
            </h2>
            <p className="text-slate-300 text-xs leading-relaxed mt-1">
              台球不仅是物理，更是精确的空间反射法则与极限撞击微米切割。我们把官方大纲全套关卡融入 2D 物理矢量反射解围。请选择以下任一特训大纲，并可在下方折叠框中筛选体验。
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
            <span>仿真教学数据联动就绪</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6" id="app-body">
        
        {/* SECTION 1: Dual Banners as Interactive Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="banner-filters-group">
          
          {/* Banner-Filter 1: 台球颗星解球模拟器 */}
          <div 
            onClick={() => {
              setActiveMode('kicking');
              // Automatically match active section for newly switched mode
              setExpandedSection(null);
            }}
            className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 cursor-pointer ${
              activeMode === 'kicking' 
                ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-500 shadow-xl shadow-emerald-950/20 scale-[1.01]' 
                : 'bg-slate-900/40 hover:bg-slate-900/80 border-slate-800'
            }`}
            id="banner-filter-kicking"
          >
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 pointer-events-none">
              <Compass className="w-40 h-40 text-emerald-400" />
            </div>
            
            <div className="flex justify-between items-start min-h-[24px]">
              <span className={`text-[9px] tracking-wider uppercase font-mono px-2 py-0.5 rounded font-bold ${
                activeMode === 'kicking' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                大纲一 • 颗星几何反射系统
              </span>
              {activeMode === 'kicking' && (
                <span className="text-xs bg-emerald-500/10 text-emerald-400 p-1 rounded-full flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </span>
              )}
            </div>
            
            <h2 className="text-2xl font-extrabold text-slate-100 mt-4 font-sans flex items-center gap-2">
              台球颗星解球模拟器
              <Sparkles className="w-5 h-5 text-amber-400" />
            </h2>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
              学习斯诺克与中八/九球的“对称镜像”、“平行双轨”与“钻石常数”。在贴库防守和极限封锁下，一杆弹库突围。
            </p>
            
            <div className="flex gap-2 mt-4 text-[10px] text-slate-200 flex-wrap">
              <span className="bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded">一库镜像解法</span>
              <span className="bg-slate-950/40 px-2.5 py-1 rounded">二库加二制</span>
              <span className="bg-slate-950/40 px-2.5 py-1 rounded">多库钻石公式</span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-900 text-xs flex justify-between items-center text-slate-500">
              <span className="truncate">⭐ 共 16 段冠军理论与经典战案大纲</span>
              <ChevronRight className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
            </div>
          </div>

          {/* Banner-Filter 2: 台球准度瞄准模拟器 */}
          <div 
            onClick={() => {
              setActiveMode('aiming');
              // Automatically match active section for newly switched mode
              setExpandedSection(null);
            }}
            className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 pointer-events-auto cursor-pointer ${
              activeMode === 'aiming' 
                ? 'bg-gradient-to-br from-sky-950/40 via-slate-900 to-slate-950 border-sky-500 shadow-xl shadow-sky-950/20 scale-[1.01]' 
                : 'bg-slate-900/40 hover:bg-slate-900/80 border-slate-800'
            }`}
            id="banner-filter-aiming"
          >
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 pointer-events-none">
              <Layers className="w-40 h-40 text-sky-400" />
            </div>

            <div className="flex justify-between items-start min-h-[24px]">
              <span className={`text-[9px] tracking-wider uppercase font-mono px-2 py-0.5 rounded font-bold ${
                activeMode === 'aiming' ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                大纲二 • 碰撞切厚与假想影子球
              </span>
              {activeMode === 'aiming' && (
                <span className="text-xs bg-sky-500/10 text-sky-400 p-1 rounded-full flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                </span>
              )}
            </div>

            <h2 className="text-2xl font-extrabold text-slate-100 mt-4 font-sans flex items-center gap-2">
              台球准度瞄准模拟器
              <Zap className="w-5 h-5 text-sky-400" />
            </h2>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
              脑补“Ghost Ball (影子球)”与切口受力轴。实操切口厚薄、出杆偏航对位、离心角黄金走线训练。
            </p>
            
            <div className="flex gap-2 mt-4 text-[10px] text-slate-200 flex-wrap">
              <span className="bg-sky-950/40 border border-sky-500/20 px-2.5 py-1 rounded">幽灵假想球</span>
              <span className="bg-slate-950/40 px-2.5 py-1 rounded">厚度百分比切角</span>
              <span className="bg-slate-950/40 px-2.5 py-1 rounded">站姿三击一放</span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-900 text-xs flex justify-between items-center text-slate-500">
              <span className="truncate">⭐ 共 15 段瞄角与击断重载训练大纲</span>
              <ChevronRight className="w-4 h-4 text-sky-400 animate-pulse shrink-0" />
            </div>
          </div>

        </div>

        {/* SECTION 2: Collapsible structured case selection system (大纲的文字嵌入关卡筛选) */}
        <div id="syllabus-filter-accordion" className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
          {/* Main Collapsible Selector Header */}
          <div 
            onClick={() => setIsPickerExpanded(!isPickerExpanded)}
            className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-slate-850/40 transition duration-150 select-none group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/25 text-amber-400">
                <BookOpen className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <span>选择特训大纲案例分类筛选</span>
                  <span className="text-[10px] bg-slate-950 border border-slate-800 text-amber-400 font-mono px-2 py-0.5 rounded-full">
                    {activeMode === 'kicking' ? '16岸库几何大纲解案' : '15准度几何大纲瞄案'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span>当前大纲小节:</span>
                  <span className="text-amber-400 font-semibold font-mono bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">{activeChapterInfo.name}</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-slate-200 font-bold">{activeScenario.title}</span>
                </p>
              </div>
            </div>

            <button
              className="w-full md:w-auto text-xs font-bold text-amber-400 border border-amber-500/30 group-hover:border-amber-500/60 px-4 py-2.5 rounded-xl transition duration-200 flex items-center justify-center gap-2 shrink-0 bg-slate-950/40"
            >
              <span>{isPickerExpanded ? '折叠收起本章课程' : '展开系统完整教案大纲'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isPickerExpanded ? 'rotate-180 text-amber-400' : 'text-slate-500'}`} />
            </button>
          </div>

          {/* Expanded Chapter Accordion Rows (尽量折叠，点击展开可以选择不同的案例) */}
          {isPickerExpanded && (
            <div className="border-t border-slate-800/85 p-4 md:p-6 bg-slate-950/60 flex flex-col gap-3">
              <div className="text-xs text-slate-500 mb-2 font-mono flex items-center gap-1.5 uppercase">
                <Layers className="w-3.5 h-3.5" />
                <span>与世界冠军手把手同行：点击对应篇章折叠展开筛选</span>
              </div>
              
              {currentChapters.map((chapter, idx) => {
                const isChapterActive = chapter.indexes.includes(currentIndex);
                // Determine if this specific chapter accordion row is open in the UI
                const isOpened = expandedSection === null 
                  ? isChapterActive // Defaults to actively selected chapter open
                  : expandedSection === chapter.name;

                return (
                  <div 
                    key={chapter.name}
                    className={`border rounded-xl transition duration-200 ${
                      isOpened 
                        ? 'border-slate-800 bg-slate-900/60 shadow-lg' 
                        : 'border-slate-850 hover:border-slate-800 bg-slate-900/15'
                    }`}
                  >
                    {/* Chapter Title Trigger */}
                    <div
                      onClick={() => setExpandedSection(isOpened ? '' : chapter.name)}
                      className="px-4 py-3.5 flex justify-between items-center cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-bold text-slate-500">
                          0{idx + 1}
                        </span>
                        <div className="text-xs sm:text-sm font-bold text-slate-200">
                          {chapter.name}
                        </div>
                        <div className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/50 text-slate-400 font-mono font-semibold">
                          {chapter.indexes.length}个教研课
                        </div>
                        {isChapterActive && (
                          <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-bold animate-pulse">
                            特训中
                          </span>
                        )}
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpened ? 'rotate-180 text-amber-400' : ''}`} />
                    </div>

                    {/* Chapter Cases Sub List */}
                    {isOpened && (
                      <div className="p-3 border-t border-slate-800/40 bg-slate-950/30 grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {chapter.indexes.map(lessonIndex => {
                          const lesson = currentSyllabus[lessonIndex];
                          const lessonScenario = (activeMode === 'kicking' ? KICKING_SCENARIOS : AIMING_SCENARIOS)[lessonIndex];
                          const isSelected = currentIndex === lessonIndex;
                          const isInteractive = checkIfInteractive(lessonScenario?.id || '');

                          return (
                            <div
                              key={lesson.id}
                              onClick={() => handleLessonSelect(lessonIndex, chapter.name)}
                              className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col gap-2 relative group ${
                                isSelected
                                  ? activeMode === 'kicking'
                                    ? 'bg-gradient-to-r from-emerald-950/30 to-slate-900 border-emerald-500 shadow-md shadow-emerald-500/5'
                                    : 'bg-gradient-to-r from-sky-950/30 to-slate-900 border-sky-500 shadow-md shadow-sky-500/5'
                                  : 'bg-slate-900/30 hover:bg-slate-850/60 border-slate-850 hover:border-slate-800'
                              }`}
                            >
                              {/* Top Bar inside Card */}
                              <div className="flex justify-between items-start gap-2">
                                <span className={`text-[10px] font-bold py-0.5 px-2 rounded-full ${
                                  isSelected 
                                    ? 'bg-amber-500 text-slate-950 font-sans' 
                                    : 'bg-slate-900 text-slate-400'
                                }`}>
                                  NO.{lessonIndex + 1}
                                </span>
                                
                                <div className="flex items-center gap-1.5">
                                  {isInteractive ? (
                                    <span className="text-[9px] bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold">
                                      ⚡ 交互实战
                                    </span>
                                  ) : (
                                    <span className="text-[9px] bg-slate-900 text-rose-400/90 border border-slate-840 px-1.5 py-0.5 rounded font-mono font-semibold flex items-center gap-0.5">
                                      <Lock className="w-2.5 h-2.5 shrink-0" />
                                      <span>教研观摩</span>
                                    </span>
                                  )}
                                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                                    lesson.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400' :
                                    lesson.difficulty === 'medium' ? 'bg-sky-500/10 text-sky-400' :
                                    'bg-amber-500/10 text-amber-400'
                                  }`}>
                                    {lesson.difficulty === 'easy' ? '入门' :
                                     lesson.difficulty === 'medium' ? '进阶' : '大师'}
                                  </span>
                                </div>
                              </div>

                              {/* Lesson Title & Brief */}
                              <div>
                                <h4 className={`text-xs font-bold leading-tight ${isSelected ? 'text-amber-400' : 'text-slate-200 group-hover:text-white'}`}>
                                  {lesson.title}
                                </h4>
                                <p className="text-[10px] text-slate-400 mt-1 leading-normal line-clamp-2">
                                  {lesson.description}
                                </p>
                              </div>

                              {/* Interactive checkmark or click indicator */}
                              {isSelected && (
                                <div className={`absolute bottom-3 right-3 text-xs flex items-center gap-1 font-bold ${
                                  activeMode === 'kicking' ? 'text-emerald-400' : 'text-sky-400'
                                }`}>
                                  <CheckCircle2 className="w-4 h-4 fill-current text-slate-950" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SECTION 3: Deep Visual Applet Viewports matching reality */}
        <div className="w-full" id="simulator-container-row">
          {activeMode === 'kicking' ? (
            <KickingSimulator scenario={activeKickingScenario} />
          ) : (
            <AimingSimulator scenario={activeAimingScenario} />
          )}
        </div>

      </main>

      {/* Elegant minimalist footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 text-center text-xs text-slate-500" id="global-footer">
        <p>© 2026 向冠军学台球训练营. World Champions Pool Masterclass Coaching System. All rights reserved.</p>
        <p className="mt-1 flex justify-center items-center gap-1.5 text-[11px] text-slate-600">
          <span>高精2D矢量物理轨道引擎 3.0</span>
          <span>•</span>
          <span>高精物理模型教研大纲包</span>
        </p>
      </footer>
    </div>
  );
}
