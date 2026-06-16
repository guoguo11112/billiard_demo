import React, { useRef, useEffect, useState } from 'react';
import { KickingScenario } from '../types';
import { Play, RotateCcw, HelpCircle, Award, Compass, Move, Volume2, Smartphone, Sliders, Info, Eye } from 'lucide-react';

// Unified exact configuration maps from the attachment
const TABLE_CONFIGS = {
  eight: {
    name: '中式八球', W: 1310, H: 705, CUSHION: 30,
    BOUND: { l: 68.5, r: 1241.5, t: 68.5, b: 636.5 },
    BALL_R: 13.5, HIT_R: 42, DOT_R: 6,
    tableL: 55, tableR: 1255, tableT: 55, tableB: 650, borderW: 25,
    pockets: [[47, 47], [655, 35], [1263, 47], [47, 658], [655, 670], [1263, 658]],
    pocketR: 22, cushionC: '#473d2a', innerC: '#13823f', tableC: '#0e5f2e', pathC: '#6b1414', pathW: 2,
    marks: { topY: 40, bottomY: 665, leftX: 40, rightX: 1270, dotR: 15, fontSize: 22 },
    hard: { leftX: 356, rightX: 912, lineLen: 166, centerY: 352.5 },
    initCue: { x: 355, y: 352.5 },
    initTarget: { x: 955, y: 352.5 }
  },
  snooker: {
    name: '斯诺克', W: 1280, H: 677, CUSHION: 22,
    BOUND: { l: 48.8, r: 1231.2, t: 48.8, b: 628.2 },
    BALL_R: 8.8, HIT_R: 28, DOT_R: 4,
    tableL: 40, tableR: 1240, tableT: 40, tableB: 637, borderW: 18,
    pockets: [[33, 33], [640, 25], [1247, 33], [33, 644], [640, 642], [1247, 644]],
    pocketR: 14, cushionC: '#473d2a', innerC: '#13823f', tableC: '#0e5f2e', pathC: '#6b1414', pathW: 2,
    marks: { topY: 25, bottomY: 652, leftX: 25, rightX: 1255, dotR: 12, fontSize: 19.5 },
    hard: { leftX: 289, dLeftX: 190, rightX: 287, lineLen: 0, centerY: 338.5, dRadius: 98 },
    initCue: { x: 287, y: 338.5 },
    initTarget: { x: 940, y: 338.5 }
  },
  nine: {
    name: '美式九球', W: 1310, H: 710, CUSHION: 30,
    BOUND: { l: 68.5, r: 1241.5, t: 68.5, b: 641.5 },
    BALL_R: 13.5, HIT_R: 42, DOT_R: 6,
    tableL: 55, tableR: 1255, tableT: 55, tableB: 655, borderW: 25,
    pockets: [[47, 47], [655, 30], [1263, 47], [47, 663], [655, 680], [1263, 663]],
    pocketR: 24, cushionC: '#26221b', innerC: '#275e9c', tableC: '#1b416b', pathC: '#6b1414', pathW: 2,
    marks: { topY: 40, bottomY: 665, leftX: 40, rightX: 1270, dotR: 15, fontSize: 22 },
    hard: { leftX: 356, rightX: 955, lineLen: 123, centerY: 355 },
    initCue: { x: 356, y: 355 },
    initTarget: { x: 955, y: 355 }
  }
};

// Active simulator type: 'kicking' or 'aiming'
const COLORS = { cue: '#ffffff', target: '#f1c40f' };

// Path-following animator helper
const getAnimatedCuePosOnPath = (path: { x: number, y: number }[], t: number) => {
  if (path.length === 0) return { x: 0, y: 0 };
  if (path.length === 1 || t <= 0) return path[0];
  if (t >= 1) return path[path.length - 1];

  const lengths = [];
  let totalLen = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const d = Math.hypot(path[i + 1].x - path[i].x, path[i + 1].y - path[i].y);
    lengths.push(d);
    totalLen += d;
  }

  let targetD = t * totalLen;
  let accumulated = 0;
  for (let i = 0; i < path.length - 1; i++) {
    if (accumulated + lengths[i] >= targetD) {
      const segT = (targetD - accumulated) / lengths[i];
      return {
        x: path[i].x + segT * (path[i + 1].x - path[i].x),
        y: path[i].y + segT * (path[i + 1].y - path[i].y)
      };
    }
    accumulated += lengths[i];
  }
  return path[path.length - 1];
};

interface KickingSimulatorProps {
  scenario: KickingScenario;
}

export default function KickingSimulator({ scenario }: KickingSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Active table configurations
  const [activeTable, setActiveTable] = useState<'eight' | 'snooker' | 'nine'>('eight');
  const [tableMode, setTableMode] = useState<'star' | 'grid' | 'hard'>('star');
  const [maxBounce, setMaxBounce] = useState<number>(4);

  // Ball positions (initialized from config or current table)
  const [cueBallPos, setCueBallPos] = useState({ x: TABLE_CONFIGS.eight.initCue.x, y: TABLE_CONFIGS.eight.initCue.y });
  const [targetBallPos, setTargetBallPos] = useState({ x: TABLE_CONFIGS.eight.initTarget.x, y: TABLE_CONFIGS.eight.initTarget.y });

  // Interactive control items
  const [isManualMode, setIsManualMode] = useState<boolean>(false);
  const [assistMoveEnabled, setAssistMoveEnabled] = useState<boolean>(false);
  const [cueMoveAngle, setCueMoveAngle] = useState<number | null>(null);
  const [targetMoveAngle, setTargetMoveAngle] = useState<number | null>(null);

  const [cuePower, setCuePower] = useState(60); // 30, 60, 100 %
  const [cueSpin, setCueSpin] = useState<'center' | 'top' | 'bottom' | 'left' | 'right'>('center');

  // Math calculated states
  const [trajectoryPath, setTrajectoryPath] = useState<{ x: number, y: number }[]>([]);
  const [contactPoints, setContactPoints] = useState<{ x: number, y: number, type: string }[]>([]);
  const [lastAimPoint, setLastAimPoint] = useState<{ x: number, y: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [infoText, setInfoText] = useState<string>('选择颗星一键解算或自由点击桌面');

  // Auto path cycling indices
  const [autoPaths, setAutoPaths] = useState<{ description: string, hitPoint: { x: number, y: number } }[]>([]);
  const [pathCycleIdx, setPathCycleIdx] = useState<number>(0);
  const [activeStarCount, setActiveStarCount] = useState<number | null>(null);

  // Dynamic animations state
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [animationFrame, setAnimationFrame] = useState<number>(0);

  // Drag interaction states
  const [dragState, setDragState] = useState<{
    dragging: boolean;
    dragBall: { x: number, y: number } | null;
    dragMoveCircle: boolean;
    dragStartPos: { x: number, y: number };
    dragStartBall: { x: number, y: number };
    aimAdjust: boolean;
  }>({
    dragging: false,
    dragBall: null,
    dragMoveCircle: false,
    dragStartPos: { x: 0, y: 0 },
    dragStartBall: { x: 0, y: 0 },
    aimAdjust: false,
  });

  const cfg = TABLE_CONFIGS[activeTable];

  // Map the professional curriculum scenario to our simulator state upon load
  useEffect(() => {
    // Determine the corresponding table layout based on scenario details
    let nextTable: 'eight' | 'snooker' | 'nine' = 'eight';
    if (scenario.id.includes('snooker') || scenario.subtitle.includes('斯诺克')) {
      nextTable = 'snooker';
    } else if (scenario.id.includes('nine') || scenario.subtitle.includes('九球')) {
      nextTable = 'nine';
    }
    setActiveTable(nextTable);

    const currentCfg = TABLE_CONFIGS[nextTable];
    
    // Position balls relatively based on table resolution
    const rx = currentCfg.W / 720;
    const ry = currentCfg.H / 360;
    const nextCue = { x: scenario.cueBall.x * rx, y: scenario.cueBall.y * ry };
    const nextTarget = { x: scenario.targetBall.x * rx, y: scenario.targetBall.y * ry };

    setCueBallPos(nextCue);
    setTargetBallPos(nextTarget);

    setIsManualMode(false);
    setAssistMoveEnabled(false);
    setLastAimPoint(null);
    setTrajectoryPath([]);
    setContactPoints([]);
    setErrorMessage('');
    setAutoPaths([]);
    setActiveStarCount(null);
    setTableMode('star');
    setMaxBounce(4);
    setIsAnimating(false);
    setAnimationFrame(0);
    
    const isInteractive = scenario.id === 'k_sc_1' || scenario.id === 'k_sc_2' || scenario.id === 'k_sc_3';
    setInfoText(`特训课载入：【${scenario.title}】${isInteractive ? '请自主点击 1/2/3 颗星开始实战解算' : '高精观摩模型已锁定 perfect 反射轨道'}`);

    if (!isInteractive) {
      setTimeout(() => {
        const tgtCushions = scenario.cushions || 1;
        const paths = generateCushionPaths(tgtCushions, nextCue, nextTarget);
        if (paths.length > 0) {
          const chosen = paths[0];
          setPathCycleIdx(0);
          setAutoPaths(paths);
          setActiveStarCount(tgtCushions);
          
          const { points, contacts } = calculateTrajectories(chosen.hitPoint.x, chosen.hitPoint.y, currentCfg.BOUND, nextCue, cueSpin, tgtCushions + 1);
          setTrajectoryPath(points);
          setContactPoints(contacts);
          setLastAimPoint(chosen.hitPoint);
        }
      }, 50);
    }
  }, [scenario]);

  // Clamp balls on boundaries helper
  const clampBall = (pos: { x: number, y: number }, bounds: { l: number, r: number, t: number, b: number }) => {
    return {
      x: Math.max(bounds.l, Math.min(bounds.r, pos.x)),
      y: Math.max(bounds.t, Math.min(bounds.b, pos.y)),
    };
  };

  const getAngleForBall = (ball: { x: number, y: number }) => {
    const midX = cfg.W / 2;
    return ball.x <= midX ? 0 : 180;
  };

  // Math helper for ray intersection
  const segmentIntersectsCircle = (p1: { x: number, y: number }, p2: { x: number, y: number }, c: { x: number, y: number }, r: number) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const fx = p1.x - c.x;
    const fy = p1.y - c.y;
    const a = dx * dx + dy * dy;
    if (a === 0) return Math.hypot(p1.x - c.x, p1.y - c.y) < r;
    const b = 2 * (fx * dx + fy * dy);
    const c_val = fx * fx + fy * fy - r * r;
    const delta = b * b - 4 * a * c_val;
    if (delta < 0) return false;
    const t1 = (-b - Math.sqrt(delta)) / (2 * a);
    const t2 = (-b + Math.sqrt(delta)) / (2 * a);
    return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
  };

  // Dynamic trajectories engine
  const calculateTrajectories = (
    aimX: number,
    aimY: number,
    bounds: { l: number, r: number, t: number, b: number },
    cue: { x: number, y: number },
    spin: 'center' | 'top' | 'bottom' | 'left' | 'right',
    maxB: number
  ) => {
    const points: { x: number; y: number }[] = [{ x: cue.x, y: cue.y }];
    const contacts: { x: number, y: number, type: string }[] = [];
    let currentX = cue.x;
    let currentY = cue.y;

    let dx = aimX - currentX;
    let dy = aimY - currentY;
    const len = Math.hypot(dx, dy);
    if (len < 0.1) return { points, contacts };

    let vx = dx / len;
    let vy = dy / len;

    const eps = 0.001;
    let bounceCount = 0;

    while (bounceCount < maxB) {
      let hits: { t: number, type: string, x: number, y: number }[] = [];
      if (vx > eps) hits.push({ t: (bounds.r - currentX) / vx, type: 'r', x: bounds.r, y: currentY + vy * ((bounds.r - currentX) / vx) });
      if (vx < -eps) hits.push({ t: (bounds.l - currentX) / vx, type: 'l', x: bounds.l, y: currentY + vy * ((bounds.l - currentX) / vx) });
      if (vy > eps) hits.push({ t: (bounds.b - currentY) / vy, type: 'b', y: bounds.b, x: currentX + vx * ((bounds.b - currentY) / vy) });
      if (vy < -eps) hits.push({ t: (bounds.t - currentY) / vy, type: 't', y: bounds.t, x: currentX + vx * ((bounds.t - currentY) / vy) });

      // Clean sorting
      hits = hits.filter(h => h.t > 0.01).sort((a, b) => a.t - b.t);
      if (!hits.length) break;

      const firstHit = hits[0];
      currentX = firstHit.x;
      currentY = firstHit.y;

      points.push({ x: currentX, y: currentY });
      contacts.push({ x: currentX, y: currentY, type: firstHit.type });
      bounceCount++;

      // Change dynamic velocity and inject cue spins for realistic deflection angles
      if (firstHit.type === 'l') {
        vx = -vx;
        if (spin === 'left') vy += 0.22;
        if (spin === 'right') vy -= 0.22;
      } else if (firstHit.type === 'r') {
        vx = -vx;
        if (spin === 'left') vy -= 0.22;
        if (spin === 'right') vy += 0.22;
      } else if (firstHit.type === 't') {
        vy = -vy;
        if (spin === 'left') vx -= 0.25;
        if (spin === 'right') vx += 0.25;
      } else if (firstHit.type === 'b') {
        vy = -vy;
        if (spin === 'left') vx += 0.25;
        if (spin === 'right') vx -= 0.25;
      }

      // Re-normalize to prevent acceleration anomalies
      const lenV = Math.hypot(vx, vy);
      if (lenV > 0) {
        vx /= lenV;
        vy /= lenV;
      }
    }

    return { points, contacts };
  };

  // Perform physical ray tracing calculation
  const calcAimPath = (aimX: number, aimY: number, spinVal = cueSpin, maxB = maxBounce) => {
    setErrorMessage('');
    const dx = aimX - cueBallPos.x;
    const dy = aimY - cueBallPos.y;
    if (Math.hypot(dx, dy) < 0.1) {
      setErrorMessage('请点击白球外区域以指向弹射方向');
      return;
    }

    const { points, contacts } = calculateTrajectories(aimX, aimY, cfg.BOUND, cueBallPos, spinVal, maxB);
    setTrajectoryPath(points);
    setContactPoints(contacts);
    setLastAimPoint({ x: aimX, y: aimY });
  };

  // Upgraded mirror projection formula logic (1, 2, 3 cushion calculations)
  const generateCushionPaths = (stars: number, customP?: { x: number, y: number }, customQ?: { x: number, y: number }) => {
    const P = customP || cueBallPos;
    const Q = customQ || targetBallPos;
    const b = cfg.BOUND;
    const generated: { description: string, hitPoint: { x: number, y: number } }[] = [];

    const edges = [
      { name: '上边库', type: 'top', val: b.t, isVertical: false },
      { name: '右边库', type: 'right', val: b.r, isVertical: true },
      { name: '下边库', type: 'bottom', val: b.b, isVertical: false },
      { name: '左边库', type: 'left', val: b.l, isVertical: true }
    ];

    const isPathClear = (p1: { x: number, y: number }, p2: { x: number, y: number }, target: { x: number, y: number }) => {
      const clearanceRadius = cfg.BALL_R * 2 + 0.5;
      return !segmentIntersectsCircle(p1, p2, target, clearanceRadius);
    };

    if (stars === 1) {
      // 1-Cushion (一库解球)
      for (const e of edges) {
        let mirror = { x: Q.x, y: Q.y };
        if (e.type === 'top') mirror = { x: Q.x, y: 2 * b.t - Q.y };
        else if (e.type === 'bottom') mirror = { x: Q.x, y: 2 * b.b - Q.y };
        else if (e.type === 'left') mirror = { x: 2 * b.l - Q.x, y: Q.y };
        else mirror = { x: 2 * b.r - Q.x, y: Q.y };

        let hit = { x: 0, y: 0 };
        if (e.isVertical) {
          const t = (e.val - P.x) / (mirror.x - P.x);
          if (t < 0 || t > 1) continue;
          hit = { x: e.val, y: P.y + t * (mirror.y - P.y) };
          if (hit.y < b.t || hit.y > b.b) continue;
        } else {
          const t = (e.val - P.y) / (mirror.y - P.y);
          if (t < 0 || t > 1) continue;
          hit = { x: P.x + t * (mirror.x - P.x), y: e.val };
          if (hit.x < b.l || hit.x > b.r) continue;
        }

        if (!isPathClear(P, hit, Q)) continue;
        generated.push({ description: `${e.name}【一库解球】法`, hitPoint: hit });
      }
    } else if (stars === 2) {
      // 2-Cushions (二库解球)
      for (const e1 of edges) {
        const candidates = (e1.type === 'top' || e1.type === 'bottom') 
          ? [edges[1], edges[3]] // vertical edges
          : [edges[0], edges[2]]; // horizontal edges

        for (const e2 of candidates) {
          let mirror = { x: Q.x, y: Q.y };
          // Flip relative to second cushion
          if (e2.type === 'top') mirror = { x: mirror.x, y: 2 * b.t - mirror.y };
          else if (e2.type === 'bottom') mirror = { x: mirror.x, y: 2 * b.b - mirror.y };
          else if (e2.type === 'left') mirror = { x: 2 * b.l - mirror.x, y: mirror.y };
          else mirror = { x: 2 * b.r - mirror.x, y: mirror.y };

          // Flip relative to first cushion
          if (e1.type === 'top') mirror = { x: mirror.x, y: 2 * b.t - mirror.y };
          else if (e1.type === 'bottom') mirror = { x: mirror.x, y: 2 * b.b - mirror.y };
          else if (e1.type === 'left') mirror = { x: 2 * b.l - mirror.x, y: mirror.y };
          else mirror = { x: 2 * b.r - mirror.x, y: mirror.y };

          let hit = { x: 0, y: 0 };
          if (e1.isVertical) {
            const t = (e1.val - P.x) / (mirror.x - P.x);
            if (t < 0 || t > 1) continue;
            hit = { x: e1.val, y: P.y + t * (mirror.y - P.y) };
            if (hit.y < b.t || hit.y > b.b) continue;
          } else {
            const t = (e1.val - P.y) / (mirror.y - P.y);
            if (t < 0 || t > 1) continue;
            hit = { x: P.x + t * (mirror.x - P.x), y: e1.val };
            if (hit.x < b.l || hit.x > b.r) continue;
          }

          if (!isPathClear(P, hit, Q)) continue;
          generated.push({ description: `${e1.name} ➔ ${e2.name}【二库防守折线解】`, hitPoint: hit });
        }
      }
    } else {
      // 3-Cushions (三库解球)
      for (const e1 of edges) {
        const candidates = (e1.type === 'top' || e1.type === 'bottom') 
          ? [edges[1], edges[3]] 
          : [edges[0], edges[2]];

        let third;
        if (e1.type === 'top') third = edges[2];
        else if (e1.type === 'bottom') third = edges[0];
        else if (e1.type === 'left') third = edges[1];
        else third = edges[3];

        for (const e2 of candidates) {
          let mirror = { x: Q.x, y: Q.y };
          // 3rd mirror
          if (third.type === 'top') mirror = { x: mirror.x, y: 2 * b.t - mirror.y };
          else if (third.type === 'bottom') mirror = { x: mirror.x, y: 2 * b.b - mirror.y };
          else if (third.type === 'left') mirror = { x: 2 * b.l - mirror.x, y: mirror.y };
          else mirror = { x: 2 * b.r - mirror.x, y: mirror.y };

          // 2nd mirror
          if (e2.type === 'top') mirror = { x: mirror.x, y: 2 * b.t - mirror.y };
          else if (e2.type === 'bottom') mirror = { x: mirror.x, y: 2 * b.b - mirror.y };
          else if (e2.type === 'left') mirror = { x: 2 * b.l - mirror.x, y: mirror.y };
          else mirror = { x: 2 * b.r - mirror.x, y: mirror.y };

          // 1st mirror
          if (e1.type === 'top') mirror = { x: mirror.x, y: 2 * b.t - mirror.y };
          else if (e1.type === 'bottom') mirror = { x: mirror.x, y: 2 * b.b - mirror.y };
          else if (e1.type === 'left') mirror = { x: 2 * b.l - mirror.x, y: mirror.y };
          else mirror = { x: 2 * b.r - mirror.x, y: mirror.y };

          let hit = { x: 0, y: 0 };
          if (e1.isVertical) {
            const t = (e1.val - P.x) / (mirror.x - P.x);
            if (t < 0 || t > 1) continue;
            hit = { x: e1.val, y: P.y + t * (mirror.y - P.y) };
            if (hit.y < b.t || hit.y > b.b) continue;
          } else {
            const t = (e1.val - P.y) / (mirror.y - P.y);
            if (t < 0 || t > 1) continue;
            hit = { x: P.x + t * (mirror.x - P.x), y: e1.val };
            if (hit.x < b.l || hit.x > b.r) continue;
          }

          if (!isPathClear(P, hit, Q)) continue;
          generated.push({ description: `${e1.name} ➔ ${e2.name} ➔ ${third.name}【三库全台钻石解】`, hitPoint: hit });
        }
      }
    }

    return generated;
  };

  // Auto solver dispatcher
  const solveStarsCount = (count: number, customP?: { x: number, y: number }, customQ?: { x: number, y: number }) => {
    // Disable assistive movement overlays
    setAssistMoveEnabled(false);
    
    const paths = generateCushionPaths(count, customP, customQ);
    if (!paths.length) {
      setErrorMessage(`当前球位没有可避开红球障碍的几何【${count}颗星】下球路线`);
      return;
    }

    let nextCycle = 0;
    if (activeStarCount === count) {
      nextCycle = (pathCycleIdx + 1) % paths.length;
    } else {
      setActiveStarCount(count);
    }
    
    setPathCycleIdx(nextCycle);
    setAutoPaths(paths);

    const chosen = paths[nextCycle];
    setInfoText(`计算已匹配：${count}颗星 ➔ ${chosen.description}`);
    
    // Set parameters and compute path
    calcAimPath(chosen.hitPoint.x, chosen.hitPoint.y, cueSpin, count + 1);
  };

  // Run physics rolling animation
  const runShotAnimation = () => {
    if (trajectoryPath.length < 2) {
      setErrorMessage('请先进行颗星反射一键解算，或启用手动绘图，然后再开始模拟击球！');
      return;
    }
    setErrorMessage('');
    setIsAnimating(true);
    setAnimationFrame(0);
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setAnimationFrame(frame);
      if (frame >= 80) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 22); // ~45fps for extremely smooth visual feedback
  };

  // Randomizer for Hard mode
  const triggerRandomHardSetup = () => {
    setErrorMessage('');
    const boundary = cfg.BOUND;
    const r = cfg.BALL_R;

    // Place target ball
    let tarX = boundary.l + Math.random() * (boundary.r - boundary.l);
    let tarY = boundary.t + Math.random() * (boundary.b - boundary.t);

    // Place cue ball without overlap
    let cueX = 0, cueY = 0, safetyLimit = 300;
    while (safetyLimit-- > 0) {
      cueX = boundary.l + Math.random() * (boundary.r - boundary.l);
      cueY = boundary.t + Math.random() * (boundary.b - boundary.t);
      if (Math.hypot(cueX - tarX, cueY - tarY) >= 2 * r + 20) {
        break;
      }
    }

    setCueBallPos({ x: cueX, y: cueY });
    setTargetBallPos({ x: tarX, y: tarY });
    setTrajectoryPath([]);
    setContactPoints([]);
    setLastAimPoint(null);
    setInfoText('随机死角考核球局生成成功！请点击上方 [1/2/3颗星] 分析突破口。');
  };

  const handleTableReset = () => {
    setCueBallPos({ x: cfg.initCue.x, y: cfg.initCue.y });
    setTargetBallPos({ x: cfg.initTarget.x, y: cfg.initTarget.y });
    setTrajectoryPath([]);
    setContactPoints([]);
    setLastAimPoint(null);
    setIsManualMode(false);
    setAssistMoveEnabled(false);
    setCuePower(60);
    setCueSpin('center');
    setAutoPaths([]);
    setActiveStarCount(null);
    setErrorMessage('');
    setInfoText('球台完全重置！请点击 [1/2/3颗星] 自动计算反射线或进行手动绘图。');
  };

  // Find dynamic cut intercept point for auxiliary circle projection
  const getFirstIntersectionInfo = () => {
    if (trajectoryPath.length < 2) return null;
    const points = trajectoryPath;
    const C = targetBallPos;
    const triggerRadius = cfg.BALL_R * 2 + 1;

    for (let i = 0; i < points.length - 1; i++) {
      const A = points[i];
      const B = points[i + 1];
      const Vx = B.x - A.x;
      const Vy = B.y - A.y;
      const Ax = A.x - C.x;
      const Ay = A.y - C.y;

      const a = Vx * Vx + Vy * Vy;
      if (a < 1e-6) continue;

      const b = 2 * (Vx * Ax + Vy * Ay);
      const c = Ax * Ax + Ay * Ay - triggerRadius * triggerRadius;
      const delta = b * b - 4 * a * c;

      if (delta >= 0) {
        const sqrtDelta = Math.sqrt(delta);
        const t1 = (-b - sqrtDelta) / (2 * a);
        const t2 = (-b + sqrtDelta) / (2 * a);
        let t = null;
        if (t1 >= 0 && t1 <= 1) t = t1;
        else if (t2 >= 0 && t2 <= 1) t = t2;

        if (t !== null) {
          const Px = A.x + t * Vx;
          const Py = A.y + t * Vy;
          const lenSeg = Math.hypot(Vx, Vy);
          return {
            point: { x: Px, y: Py },
            segmentDir: { dx: Vx / (lenSeg || 1), dy: Vy / (lenSeg || 1) },
            segmentIndex: i
          };
        }
      }
    }
    return null;
  };

  const interceptInfo = getFirstIntersectionInfo();

  // Draw the entire scene on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear Canvas
    ctx.clearRect(0, 0, cfg.W, cfg.H);

    // 1. Draw solid felt background table area
    ctx.fillStyle = cfg.tableC;
    ctx.fillRect(0, 0, cfg.W, cfg.H);

    // 2. Draw thick outer wooden cushions rail blockages
    ctx.fillStyle = cfg.cushionC;
    ctx.fillRect(0, 0, cfg.W, cfg.CUSHION);
    ctx.fillRect(0, cfg.H - cfg.CUSHION, cfg.W, cfg.CUSHION);
    ctx.fillRect(0, 0, cfg.CUSHION, cfg.H);
    ctx.fillRect(cfg.W - cfg.CUSHION, 0, cfg.CUSHION, cfg.H);

    // 3. Draw inner cushioned green linings
    const bw = cfg.borderW;
    const outerT = cfg.CUSHION;
    const outerB = cfg.H - cfg.CUSHION;
    const outerL = cfg.CUSHION;
    const outerR = cfg.W - cfg.CUSHION;
    const innerT = outerT + bw;
    const innerB = outerB - bw;
    const innerL = outerL + bw;
    const innerR = outerR - bw;
    const off45 = bw;
    const off72 = bw / Math.tan(72 * Math.PI / 180);

    ctx.fillStyle = cfg.innerC;

    // Render precise 6 cushion sloped segments
    let seg;
    if (cfg.name === '中式八球') {
      seg = { tL: { s: 57, e: 634 }, tR: { s: 676, e: 1253 }, bL: { s: 57, e: 634 }, bR: { s: 676, e: 1253 }, lV: { s: 57, e: 648 }, rV: { s: 57, e: 648 } };
    } else if (cfg.name === '斯诺克') {
      seg = { tL: { s: 42, e: 626 }, tR: { s: 654, e: 1240 }, bL: { s: 42, e: 626 }, bR: { s: 654, e: 1240 }, lV: { s: 42, e: 635 }, rV: { s: 42, e: 635 } };
    } else {
      seg = { tL: { s: 62, e: 631 }, tR: { s: 679, e: 1248 }, bL: { s: 62, e: 631 }, bR: { s: 679, e: 1248 }, lV: { s: 62, e: 648 }, rV: { s: 62, e: 648 } };
    }

    // Top linings
    ctx.beginPath(); ctx.moveTo(seg.tL.s, outerT); ctx.lineTo(seg.tL.e, outerT); ctx.lineTo(seg.tL.e - off72, innerT); ctx.lineTo(seg.tL.s + off45, innerT); ctx.fill();
    ctx.beginPath(); ctx.moveTo(seg.tR.s, outerT); ctx.lineTo(seg.tR.e, outerT); ctx.lineTo(seg.tR.e - off45, innerT); ctx.lineTo(seg.tR.s + off72, innerT); ctx.fill();
    // Bottom linings
    ctx.beginPath(); ctx.moveTo(seg.bL.s, outerB); ctx.lineTo(seg.bL.e, outerB); ctx.lineTo(seg.bL.e - off72, innerB); ctx.lineTo(seg.bL.s + off45, innerB); ctx.fill();
    ctx.beginPath(); ctx.moveTo(seg.bR.s, outerB); ctx.lineTo(seg.bR.e, outerB); ctx.lineTo(seg.bR.e - off45, innerB); ctx.lineTo(seg.bR.s + off72, innerB); ctx.fill();
    // Sides linings
    ctx.beginPath(); ctx.moveTo(outerL, seg.lV.s); ctx.lineTo(outerL, seg.lV.e); ctx.lineTo(innerL, seg.lV.e - off45); ctx.lineTo(innerL, seg.lV.s + off45); ctx.fill();
    ctx.beginPath(); ctx.moveTo(outerR, seg.rV.s); ctx.lineTo(outerR, seg.rV.e); ctx.lineTo(innerR, seg.rV.e - off45); ctx.lineTo(innerR, seg.rV.s + off45); ctx.fill();

    // 4. Draw dark pocket entries
    ctx.fillStyle = '#0a0d14';
    cfg.pockets.forEach(p => {
      ctx.beginPath();
      ctx.arc(p[0], p[1], cfg.pocketR, 0, Math.PI * 2);
      ctx.fill();
    });

    // 5. Draw table visual markers (Star layout, Grid, or D-zone)
    if (tableMode !== 'hard') {
      const L = cfg.tableL, R = cfg.tableR, T = cfg.tableT, B = cfg.tableB;
      const stepX = (R - L) / 8;
      const stepY = (B - T) / 4;

      ctx.save();
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1.2;

      // Draw dashed reference gridlines
      for (let i = 1; i <= 7; i++) {
        const x = L + i * stepX;
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.beginPath(); ctx.moveTo(x, T); ctx.lineTo(x, B); ctx.stroke();
      }
      for (let i = 1; i <= 3; i++) {
        const y = T + i * stepY;
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke();
      }

      ctx.restore();

      // Draw Diamond Points / Rail markings
      if (tableMode === 'grid') {
        const dotR = cfg.DOT_R;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        for (let i = 0; i <= 8; i++) {
          const x = L + i * stepX;
          ctx.beginPath(); ctx.arc(x, T, dotR, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(x, B, dotR, 0, Math.PI * 2); ctx.fill();
        }
        for (let i = 1; i <= 3; i++) {
          const y = T + i * stepY;
          ctx.beginPath(); ctx.arc(L, y, dotR, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(R, y, dotR, 0, Math.PI * 2); ctx.fill();
        }
      } else if (tableMode === 'star') {
        // Star alignment diamonds
        const nf = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        const nh = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
        const sn = [6, 7, 8];
        const isCueLeft = cueBallPos.x < targetBallPos.x;
        const my = (T + B) / 2;
        const targetIsBottom = targetBallPos.y > my;
        
        let tl = targetIsBottom ? nf : nh;
        let bl = targetIsBottom ? nh : nf;
        if (!isCueLeft) {
          tl = [...tl].reverse();
          bl = [...bl].reverse();
        }
        const sl = targetIsBottom ? [...sn].reverse() : sn;

        ctx.font = `bold ${cfg.marks.fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const dotR = cfg.marks.dotR;
        const topY = cfg.marks.topY;
        const bottomY = cfg.marks.bottomY;
        const leftX = cfg.marks.leftX;
        const rightX = cfg.marks.rightX;

        // Draw circles & numbers
        const drawMarkSymbol = (x: number, y: number, textVal: number) => {
          ctx.beginPath(); ctx.arc(x, y, dotR, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff'; ctx.fill();
          ctx.fillStyle = '#1e293b'; ctx.fillText(textVal.toString(), x, y + 1);
        };

        for (let i = 0; i <= 8; i++) {
          const x = i === 0 ? leftX : i === 8 ? rightX : L + i * stepX;
          drawMarkSymbol(x, topY, tl[i]);
          drawMarkSymbol(x, bottomY, bl[i]);
        }

        const leftY = [T + stepY, T + 2 * stepY, T + 3 * stepY];
        if (isCueLeft) {
          for (let i = 0; i < 3; i++) {
            const y = leftY[i];
            ctx.beginPath(); ctx.arc(leftX, y, dotR, 0, Math.PI * 2); ctx.fillStyle = '#ffffff'; ctx.fill();
            ctx.save(); ctx.translate(leftX, y); ctx.rotate(-Math.PI / 2);
            ctx.fillStyle = '#1e293b'; ctx.fillText(sl[i].toString(), 0, 0); ctx.restore();
          }
        } else {
          for (let i = 0; i < 3; i++) {
            const y = leftY[i];
            ctx.beginPath(); ctx.arc(rightX, y, dotR, 0, Math.PI * 2); ctx.fillStyle = '#ffffff'; ctx.fill();
            ctx.save(); ctx.translate(rightX, y); ctx.rotate(Math.PI / 2);
            ctx.fillStyle = '#1e293b'; ctx.fillText(sl[i].toString(), 0, 0); ctx.restore();
          }
        }
      }
    } else {
      // Hard mode: draw Snooker / Pool specialized target markings
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 1.5;

      if (cfg.name === '斯诺克') {
        // Draw Snooker D-zone Line and Arc
        const leftX = cfg.hard.leftX!;
        const dLeftX = cfg.hard.dLeftX!;
        const topY = cfg.tableT;
        const bottomY = cfg.tableB;

        ctx.beginPath(); ctx.moveTo(leftX, topY); ctx.lineTo(leftX, bottomY); ctx.stroke();
        const cy = cfg.hard.centerY;
        const dRadius = cfg.hard.dRadius!;
        const cx = dLeftX + dRadius;
        ctx.beginPath(); ctx.arc(cx, cy, dRadius, Math.PI / 2, 3 * Math.PI / 2); ctx.stroke();

        ctx.fillStyle = '#ffffff';
        // Draw snooker spot dots
        [[288, 240.5], [288, 338.5], [288, 436.5], [640, 338.5], [939.5, 338.5], [1131, 338.5]].forEach(pt => {
          ctx.beginPath(); ctx.arc(pt[0], pt[1], 1.5, 0, Math.PI * 2); ctx.fill();
        });
      } else {
        // Chinese 8-Ball or 9-Ball spot zones
        const leftX = cfg.hard.leftX!;
        const topY = cfg.tableT;
        const bottomY = cfg.tableB;
        ctx.beginPath(); ctx.moveTo(leftX, topY); ctx.lineTo(leftX, bottomY); ctx.stroke();

        const cy = cfg.hard.centerY;
        const rightStart = cfg.hard.rightX;
        const rightEnd = rightStart + cfg.hard.lineLen;
        ctx.beginPath(); ctx.moveTo(rightStart, cy); ctx.lineTo(rightEnd, cy); ctx.stroke();

        if (cfg.name === '中式八球') {
          ctx.beginPath(); ctx.moveTo(351, cy); ctx.lineTo(361, cy); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(955, cy - 15); ctx.lineTo(955, cy + 15); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(1070, cy - 5); ctx.lineTo(1070, cy + 5); ctx.stroke();
        } else if (cfg.name === '美式九球') {
          ctx.beginPath(); ctx.moveTo(354, cy); ctx.lineTo(358, cy); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(955, cy - 15); ctx.lineTo(955, cy + 15); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(55, 253); ctx.lineTo(leftX, 253); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(55, 452); ctx.lineTo(leftX, 452); ctx.stroke();
        }
      }
      ctx.restore();
    }

    // 6. Draw assist mover rings if enabled (touch-screen controls helper)
    if (assistMoveEnabled) {
      const ballR = cfg.BALL_R;
      const moveR = 40;

      // Draw cue mover ring
      const cueAngle = (cueMoveAngle !== null) ? cueMoveAngle : getAngleForBall(cueBallPos);
      const cueRad = cueAngle * Math.PI / 180;
      const cueMoveCenter = {
        x: cueBallPos.x + Math.cos(cueRad) * 150,
        y: cueBallPos.y + Math.sin(cueRad) * 150
      };

      // Draw connection lines to show linkage
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.moveTo(cueBallPos.x, cueBallPos.y);
      ctx.lineTo(cueMoveCenter.x, cueMoveCenter.y);
      ctx.stroke();

      // Mover ring circle
      ctx.beginPath(); ctx.arc(cueMoveCenter.x, cueMoveCenter.y, moveR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'; ctx.fill();
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 3.5; ctx.stroke();

      // Draw target mover ring
      const tarAngle = (targetMoveAngle !== null) ? targetMoveAngle : getAngleForBall(targetBallPos);
      const tarRad = tarAngle * Math.PI / 180;
      const tarMoveCenter = {
        x: targetBallPos.x + Math.cos(tarRad) * 150,
        y: targetBallPos.y + Math.sin(tarRad) * 150
      };

      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(241, 196, 15, 0.45)';
      ctx.moveTo(targetBallPos.x, targetBallPos.y);
      ctx.lineTo(tarMoveCenter.x, tarMoveCenter.y);
      ctx.stroke();

      ctx.beginPath(); ctx.arc(tarMoveCenter.x, tarMoveCenter.y, moveR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(241, 196, 15, 0.22)'; ctx.fill();
      ctx.strokeStyle = '#854d0e'; ctx.lineWidth = 3.5; ctx.stroke();
    }

    // 7. Render Trajectories (Clipped around target ball, incorporating exact separation angle lines)
    const interceptInfo = getFirstIntersectionInfo();
    let clippedPath = trajectoryPath;
    let clippedContacts = contactPoints;

    if (interceptInfo) {
      // Squeeze path up to impact
      clippedPath = trajectoryPath.slice(0, interceptInfo.segmentIndex + 1);
      clippedPath.push(interceptInfo.point);

      // Squeeze cushion hits labels
      const pointsRef = trajectoryPath;
      const idxCut = interceptInfo.segmentIndex;
      clippedContacts = [];
      for (const cp of contactPoints) {
        let matchedIndex = -1;
        for (let i = 0; i < pointsRef.length; i++) {
          if (Math.hypot(pointsRef[i].x - cp.x, pointsRef[i].y - cp.y) < 0.2) {
            matchedIndex = i;
            break;
          }
        }
        if (matchedIndex !== -1 && matchedIndex <= idxCut) {
          clippedContacts.push(cp);
        }
      }
    }

    if (clippedPath.length >= 2) {
      const startp = clippedPath[0];

      // Ambient outer paths glow
      ctx.beginPath();
      ctx.lineWidth = 10;
      ctx.strokeStyle = 'rgba(220, 38, 38, 0.15)';
      ctx.moveTo(startp.x, startp.y);
      for (let i = 1; i < clippedPath.length; i++) {
        ctx.lineTo(clippedPath[i].x, clippedPath[i].y);
      }
      ctx.stroke();

      // Core razor line
      ctx.beginPath();
      ctx.lineWidth = cfg.pathW + 1;
      ctx.strokeStyle = cfg.pathC;
      ctx.moveTo(startp.x, startp.y);
      for (let i = 1; i < clippedPath.length; i++) {
        ctx.lineTo(clippedPath[i].x, clippedPath[i].y);
      }
      ctx.stroke();

      // Render numeric cushion bounce markers
      clippedContacts.forEach((cp, idx) => {
        ctx.beginPath();
        ctx.arc(cp.x, cp.y, cfg.BALL_R * 1.1, 0, Math.PI * 2);
        ctx.fillStyle = '#1e3a8a';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText((idx + 1).toString(), cp.x, cp.y + 1.5);
      });
    }

    // 8. Render the dynamic "辅助线新参数" (Collision Separation Projection) on intercept
    if (interceptInfo) {
      const P = interceptInfo.point;
      const stdDir = interceptInfo.segmentDir;
      const C = targetBallPos;
      const R = cfg.BALL_R;

      // Render semitransparent Ghost ball at point of contact
      ctx.beginPath(); ctx.arc(P.x, P.y, R, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'; ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'; ctx.lineWidth = 1.2; ctx.stroke();

      // Compute impact split angles
      const v2x = C.x - P.x;
      const v2y = C.y - P.y;
      const len2 = Math.hypot(v2x, v2y);
      
      if (len2 > 0.01) {
        const dot = stdDir.dx * v2x + stdDir.dy * v2y;
        const cross = stdDir.dx * v2y - stdDir.dy * v2x;
        const angleRad = Math.atan2(cross, dot);
        const angleDeg = angleRad * 180 / Math.PI;
        let absAngle = Math.abs(angleDeg);
        if (absAngle > 90) absAngle = 90;

        // Custom scaled parameters as provided in attachment instructions:
        // Yellow Line (Target progress): |θ|=0 ➔ len 330, |θ|=90 ➔ len 12
        const yellowLen = 330 - (absAngle / 90) * (330 - 12);
        // White Line (Cue orthogonal split): |θ|=0 ➔ len 0, |θ|=90 ➔ len 280
        const whiteLen = (absAngle / 90) * 280;

        // Draw yellow forward target indicator
        const dirX = v2x / len2;
        const dirY = v2y / len2;
        const yellowEndX = C.x + dirX * yellowLen;
        const yellowEndY = C.y + dirY * yellowLen;

        ctx.beginPath();
        ctx.moveTo(C.x, C.y);
        ctx.lineTo(yellowEndX, yellowEndY);
        ctx.strokeStyle = '#fef08a'; // Light pale yellow
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // Draw white cue ball tangent split line
        if (whiteLen > 0.1) {
          const perpX = -v2y / len2;
          const perpY = v2x / len2;
          let direction = 1;
          if (angleDeg > 0 && angleDeg <= 90) direction = -1;
          else if (angleDeg < 0 && angleDeg >= -90) direction = 1;
          else direction = 0;

          if (direction !== 0) {
            const whiteEndX = P.x + perpX * whiteLen * direction;
            const whiteEndY = P.y + perpY * whiteLen * direction;

            ctx.beginPath();
            ctx.moveTo(P.x, P.y);
            ctx.lineTo(whiteEndX, whiteEndY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3.5;
            ctx.stroke();
          }
        }
      }
    }

    // 9. Draw balls (Cue and Target) with professional tactile outer glows
    let drawCuePos = cueBallPos;
    let drawTargetPos = targetBallPos;
    let currentTargetRadius = cfg.BALL_R;

    if (isAnimating) {
      const activePath = trajectoryPath;
      if (activePath.length >= 2) {
        if (animationFrame <= 50) {
          const t = animationFrame / 50;
          drawCuePos = getAnimatedCuePosOnPath(activePath, t);
          drawTargetPos = targetBallPos;
        } else {
          const t2 = (animationFrame - 50) / 30; // 0 to 1
          drawCuePos = activePath[activePath.length - 1];
          
          if (interceptInfo) {
            const P = interceptInfo.point;
            const C = targetBallPos;
            const v2x = C.x - P.x;
            const v2y = C.y - P.y;
            const len2 = Math.hypot(v2x, v2y);
            
            if (len2 > 0.01) {
              const stdDir = interceptInfo.segmentDir;
              const dot = stdDir.dx * v2x + stdDir.dy * v2y;
              const cross = stdDir.dx * v2y - stdDir.dy * v2x;
              const angleRad = Math.atan2(cross, dot);
              const angleDeg = angleRad * 180 / Math.PI;
              let absAngle = Math.abs(angleDeg);
              if (absAngle > 90) absAngle = 90;
              
              const whiteLen = (absAngle / 90) * 120;
              const yellowLen = 220 - (absAngle / 90) * (220 - 12);
              
              const dirX = v2x / len2;
              const dirY = v2y / len2;
              
              const perpX = -v2y / len2;
              const perpY = v2x / len2;
              let direction = 1;
              if (angleDeg > 0 && angleDeg <= 90) direction = -1;
              else if (angleDeg < 0 && angleDeg >= -90) direction = 1;
              else direction = 0;
              
              drawCuePos = {
                x: P.x + perpX * whiteLen * direction * t2,
                y: P.y + perpY * whiteLen * direction * t2
              };
              
              drawTargetPos = {
                x: C.x + dirX * yellowLen * t2,
                y: C.y + dirY * yellowLen * t2
              };
              
              if (t2 > 0.6) {
                currentTargetRadius = cfg.BALL_R * (1 - (t2 - 0.6) / 0.4);
              }
            }
          }
        }
      }
    }

    [
      { ...drawCuePos, r: cfg.BALL_R, color: COLORS.cue, label: '白' },
      { ...drawTargetPos, r: currentTargetRadius, color: COLORS.target, label: '9' }
    ].forEach((ball, bidx) => {
      if (ball.r <= 0.01) return; // Completely pocketed/hidden
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.fill();

      // Outer rings
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner text
      ctx.fillStyle = '#0f172a';
      ctx.font = `bold ${ball.r * 0.9}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ball.label, ball.x, ball.y + 1.2);
    });

    // 10. Draw manual direction aim pointer handler on the rail if in Manual Mode
    if (lastAimPoint) {
      ctx.beginPath();
      ctx.arc(lastAimPoint.x, lastAimPoint.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.2;
      ctx.stroke();
    }

  }, [activeTable, tableMode, maxBounce, cueBallPos, targetBallPos, trajectoryPath, contactPoints, assistMoveEnabled, cueMoveAngle, targetMoveAngle, isAnimating, animationFrame, interceptInfo]);


  // Pointer interaction loops mapping touchscreen and click coords
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (isAnimating) return;

    const isInteractive = scenario.id === 'k_sc_1' || scenario.id === 'k_sc_2' || scenario.id === 'k_sc_3';
    if (!isInteractive) {
      setErrorMessage('🔒 冠军教研观摩：母球与靶球位置已锁定。请切换至前三关激活实战拖拽特训！');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = cfg.W / rect.width;
    const scaleY = cfg.H / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;
    const clickPt = { x: clickX, y: clickY };

    // 1. If Manual Shooting Mode is active, click anywhere triggers laser calculation
    if (isManualMode) {
      setDragState(prev => ({ ...prev, aimAdjust: true }));
      calcAimPath(clickX, clickY);
      return;
    }

    // 2. Assist move handles click collision
    if (assistMoveEnabled) {
      const moveR = 40;
      for (const bRef of [
        { key: 'cue' as const, ball: cueBallPos, angle: cueMoveAngle },
        { key: 'target' as const, ball: targetBallPos, angle: targetMoveAngle }
      ]) {
        const curAngle = (bRef.angle !== null) ? bRef.angle : getAngleForBall(bRef.ball);
        const rad = curAngle * Math.PI / 180;
        const handleCenter = {
          x: bRef.ball.x + Math.cos(rad) * 150,
          y: bRef.ball.y + Math.sin(rad) * 150
        };

        if (Math.hypot(clickX - handleCenter.x, clickY - handleCenter.y) < moveR) {
          setDragState({
            dragging: true,
            dragBall: bRef.key === 'cue' ? cueBallPos : targetBallPos,
            dragMoveCircle: true,
            dragStartPos: clickPt,
            dragStartBall: bRef.key === 'cue' ? cueBallPos : targetBallPos,
            aimAdjust: false
          });
          return;
        }
      }
    }

    // 3. Regular direct drag selection on the sphere
    let chosenBall = null;
    if (Math.hypot(clickX - cueBallPos.x, clickY - cueBallPos.y) < cfg.HIT_R) {
      chosenBall = cueBallPos;
    } else if (Math.hypot(clickX - targetBallPos.x, clickY - targetBallPos.y) < cfg.HIT_R) {
      chosenBall = targetBallPos;
    }

    if (chosenBall) {
      setDragState({
        dragging: true,
        dragBall: chosenBall,
        dragMoveCircle: false,
        dragStartPos: clickPt,
        dragStartBall: chosenBall,
        aimAdjust: false
      });
      
      // Auto assign standard side angles
      if (chosenBall === cueBallPos) {
        setCueMoveAngle(getAngleForBall(cueBallPos));
      } else {
        setTargetMoveAngle(getAngleForBall(targetBallPos));
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = cfg.W / rect.width;
    const scaleY = cfg.H / rect.height;

    const moveX = (e.clientX - rect.left) * scaleX;
    const moveY = (e.clientY - rect.top) * scaleY;

    if (dragState.dragging && dragState.dragBall) {
      let updatedX = moveX;
      let updatedY = moveY;

      if (dragState.dragMoveCircle) {
        // Drag helper offsetting
        const dx = moveX - dragState.dragStartPos.x;
        const dy = moveY - dragState.dragStartPos.y;
        updatedX = dragState.dragStartBall.x + dx;
        updatedY = dragState.dragStartBall.y + dy;
      }

      // Clamp target within cloth bounds
      const clamped = clampBall({ x: updatedX, y: updatedY }, cfg.BOUND);

      if (dragState.dragBall === cueBallPos) {
        setCueBallPos(clamped);
      } else {
        setTargetBallPos(clamped);
      }
      return;
    }

    if (dragState.aimAdjust) {
      calcAimPath(moveX, moveY);
    }
  };

  const handlePointerUp = () => {
    setDragState(prev => ({
      ...prev,
      dragging: false,
      dragBall: null,
      dragMoveCircle: false,
      aimAdjust: false,
    }));
    setCueMoveAngle(getAngleForBall(cueBallPos));
    setTargetMoveAngle(getAngleForBall(targetBallPos));
  };


  return (
    <div className="flex flex-col gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6" id="kicking-simulator-container">
      
      {/* Table & Mode selections block */}
      <div className="flex flex-col gap-3 pb-3 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">
              {cfg.name} ➔ 吃库反弹解围大样
            </span>
            <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-1.5 mt-0.5">
              台球颗星解球模拟器
              <Compass className="w-4.5 h-4.5 text-amber-500 animate-spin-slow" />
            </h3>
          </div>

          {/* Table select buttons */}
          <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
            {(['eight', 'snooker', 'nine'] as const).map(type => (
              <button
                key={type}
                onClick={() => {
                  setActiveTable(type);
                  setCueBallPos({ x: TABLE_CONFIGS[type].initCue.x, y: TABLE_CONFIGS[type].initCue.y });
                  setTargetBallPos({ x: TABLE_CONFIGS[type].initTarget.x, y: TABLE_CONFIGS[type].initTarget.y });
                  setTrajectoryPath([]);
                  setContactPoints([]);
                  setLastAimPoint(null);
                  setAutoPaths([]);
                  setActiveStarCount(null);
                }}
                className={`text-[11px] px-3.5 py-1.5 rounded-lg font-bold transition ${
                  activeTable === type
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {TABLE_CONFIGS[type].name}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode selecting buttons */}
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-1.5">
            {[
              { id: 'star', label: '颗星模式 (含公式辅助码)' },
              { id: 'grid', label: '网格模式 (星点分布刻度)' },
              { id: 'hard', label: '难度挑战 (随机死角出题)' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => {
                  setTableMode(m.id as any);
                  if (m.id === 'hard') {
                    triggerRandomHardSetup();
                  }
                }}
                className={`text-[10px] md:text-xs px-3 py-1.5 rounded-lg border font-semibold transition ${
                  tableMode === m.id
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-950 hover:bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-500">
            {tableMode === 'star' && '💡 颗星：标准一/二/三星定位常数。'}
            {tableMode === 'grid' && '💡 网格：提供精确球桌等分交线，测算对称点。'}
            {tableMode === 'hard' && '💡 挑战：随机在端边、库脚区域落位，点击下方1/2/3星盲解。'}
          </div>
        </div>
      </div>

      {/* Simulator view area */}
      <div className="relative overflow-hidden w-full bg-slate-950 rounded-xl border border-slate-850 cursor-crosshair flex flex-col items-center">
        <canvas
          ref={canvasRef}
          width={cfg.W}
          height={cfg.H}
          className="w-full h-auto block"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />

        {/* Dynamic Canvas Floating tip badge */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
          {errorMessage && (
            <span className="bg-rose-500/95 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg animate-pulse">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{errorMessage}</span>
            </span>
          )}

          {interceptInfo ? (
            <span className="bg-emerald-500/95 backdrop-blur-sm text-white text-[11px] font-extrabold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <Award className="w-3.5 h-3.5 animate-bounce" />
              <span>完美切射入路！【淡黄线】为目标9号球前进线，【白线】为白球碰击后分离角。</span>
            </span>
          ) : (
            trajectoryPath.length >= 2 && !isManualMode && (
              <span className="bg-rose-500/95 backdrop-blur-sm text-white text-[11px] font-medium px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <Eye className="w-3.5 h-3.5" />
                <span>未解中目标球（障碍遮挡/偏角不吻合），请尝试切换反弹星次</span>
              </span>
            )
          )}
        </div>

        <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded px-2.5 py-1 text-[10px] text-slate-400 flex items-center gap-1.5">
          <Smartphone className="w-3 h-3 text-amber-400" />
          <span>手机触屏操作：可拖动白球、黄球在案上自由架设解围演练</span>
        </div>
      </div>

      {/* Automatic Cushion calculation controls row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-850">
        
        {/* Core Formula Calculation Trigger buttons */}
        <div className="md:col-span-2 flex flex-col gap-2">
          <span className="text-xs text-slate-400 block font-semibold flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" /> 一键自动颗星解算（根据目前白黄球位智能反推）
          </span>
          
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map(count => (
              <button
                key={count}
                onClick={() => solveStarsCount(count)}
                className={`text-[11px] font-bold py-2.5 rounded-xl border transition ${
                  activeStarCount === count
                    ? 'bg-emerald-500 text-slate-950 border-emerald-500 active:scale-95 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-200 active:scale-95'
                }`}
              >
                {count} 颗星定位
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 leading-normal">
            * 连续点击同按钮可循环切换所有可行的翻岸反射点。解算不带侧塞，中杆发射最为精准。
          </p>
        </div>

        {/* Rebound limits & Manual drag buttons */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-slate-400 block font-semibold">手动与自由模式架设</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setIsManualMode(!isManualMode);
                setAssistMoveEnabled(false);
                setTrajectoryPath([]);
                setContactPoints([]);
                setLastAimPoint(null);
                setErrorMessage('');
              }}
              className={`text-[11px] font-bold py-2.5 rounded-xl border transition ${
                isManualMode
                  ? 'bg-amber-500 text-slate-950 border-amber-500'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-slate-100'
              }`}
            >
              {isManualMode ? '关闭手动绘图' : '启用手动绘图'}
            </button>

            <button
              onClick={() => {
                if (isManualMode) {
                  setErrorMessage('请先关闭手动手动绘图模式');
                  return;
                }
                setAssistMoveEnabled(!assistMoveEnabled);
              }}
              className={`text-[11px] font-bold py-2.5 rounded-xl border transition ${
                assistMoveEnabled
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-slate-100'
              }`}
            >
              {assistMoveEnabled ? '✅ 关闭辅助圈' : '启用触控圈'}
            </button>
          </div>
          <p className="text-[10px] text-slate-500">
            触控圈：在球旁伸展出手柄控制环，更利于小屏触摸架设。
          </p>
        </div>

        {/* Cushion drop parameters limits */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-slate-400 block font-semibold">库边反射上限设置</span>
          <select
            value={maxBounce}
            onChange={e => {
              const val = parseInt(e.target.value);
              setMaxBounce(val);
              if (lastAimPoint) {
                calcAimPath(lastAimPoint.x, lastAimPoint.y, cueSpin, val);
              }
            }}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none"
          >
            <option value="2">2次碰库限制</option>
            <option value="3">3次碰库限制</option>
            <option value="4">4次碰库限制 (全场长效钻石折页)</option>
          </select>
          <p className="text-[10px] text-slate-500">
            限制手动绘击时光束的最大反弹撞击界限。
          </p>
        </div>

      </div>

      {/* Physics spin / power controller and RESET button block below */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 font-sans">
        
        {/* Left: Strength tuning */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-slate-400 font-medium">出杆实操力度 (决定弹射和碰撞后滑行位移)</span>
          <div className="grid grid-cols-3 gap-1">
            {[
              { label: '温和推 (30%)', value: 30 },
              { label: '中等力 (60%)', value: 60 },
              { label: '强力冲 (100%)', value: 100 }
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => setCuePower(p.value)}
                className={`text-[11px] py-2 rounded-lg border font-semibold transition ${
                  cuePower === p.value
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-850 hover:bg-slate-850'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Spin tuning */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-slate-400 font-medium">打点与避塞杆法 (侧向旋转由于摩擦会改变出库夹角)</span>
          <div className="grid grid-cols-5 gap-1">
            {[
              { label: '中杆', id: 'center', desc: '定' },
              { label: '高杆', id: 'top', desc: '跟' },
              { label: '低杆', id: 'bottom', desc: '缩' },
              { label: '左塞', id: 'left', desc: '左偏' },
              { label: '右塞', id: 'right', desc: '右偏' }
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setCueSpin(s.id as any);
                  if (lastAimPoint) {
                    calcAimPath(lastAimPoint.x, lastAimPoint.y, s.id as any);
                  }
                }}
                className={`flex flex-col items-center py-1.5 rounded-lg border transition ${
                  cueSpin === s.id
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-850 hover:bg-slate-850'
                }`}
                title={s.desc}
              >
                <span className="text-[10px] leading-tight font-bold">{s.label}</span>
                <span className="text-[8.5px] opacity-75">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Reset and Animate triggers */}
        <div className="flex flex-col gap-2 justify-end">
          <button
            onClick={runShotAnimation}
            disabled={isAnimating || trajectoryPath.length < 2}
            className={`w-full flex items-center justify-center gap-2 text-xs font-bold py-3.5 px-4 rounded-xl border transition active:scale-[0.98] ${
              trajectoryPath.length >= 2
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Play className={`w-4 h-4 ${isAnimating ? 'animate-pulse' : ''}`} />
            <span>{isAnimating ? '击球进行中...' : '⚡ 开始击球模拟'}</span>
          </button>
          <button
            onClick={handleTableReset}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 text-xs font-bold text-slate-200 py-2.5 px-4 rounded-xl border border-slate-700 active:scale-[0.98] transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>重置球局</span>
          </button>
        </div>

      </div>

      {/* Sleek minimalist Status HUD Board */}
      {infoText && (
        <div className="flex items-center gap-2.5 bg-slate-950/80 p-4 rounded-xl border border-slate-850 text-xs text-sky-400 font-medium shadow-inner">
          <Volume2 className="w-4 h-4 text-amber-500 animate-bounce shrink-0" />
          <span id="billiards-live-hud-info">系统提示：{infoText}</span>
        </div>
      )}

    </div>
  );
}
