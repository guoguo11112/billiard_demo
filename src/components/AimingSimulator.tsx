import React, { useRef, useEffect, useState } from 'react';
import { AimingScenario } from '../types';
import { Play, RotateCcw, Target, Eye, Percent, Compass, Move, Award, Activity, Info, Sparkles } from 'lucide-react';

interface AimingSimulatorProps {
  scenario: AimingScenario;
}

export default function AimingSimulator({ scenario }: AimingSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Core state synced directly to training scenario
  const [cueBallPos, setCueBallPos] = useState({ x: scenario.cueBall.x, y: scenario.cueBall.y });
  const [objectBallPos, setObjectBallPos] = useState({ x: scenario.objectBall.x, y: scenario.objectBall.y });

  // Aim angle (in radians) and animation triggers
  const [aimAngle, setAimAngle] = useState(scenario.initialAimAngle);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [dragTarget, setDragTarget] = useState<'stick' | null>(null);

  // Interactive strike tuning parameters
  const [cuePower, setCuePower] = useState(60); // 30, 60, 100
  const [cueSpin, setCueSpin] = useState<'center' | 'top' | 'bottom' | 'left' | 'right'>('center');

  // Reset parameters when curriculum changes
  useEffect(() => {
    setCueBallPos({ x: scenario.cueBall.x, y: scenario.cueBall.y });
    setObjectBallPos({ x: scenario.objectBall.x, y: scenario.objectBall.y });
    setAimAngle(scenario.initialAimAngle);
    setIsAnimating(false);
    setAnimationFrame(0);
    setDragTarget(null);
    setCuePower(60);
    setCueSpin('center');
  }, [scenario]);

  const tableBounds = {
    minX: 30,
    maxX: 690,
    minY: 30,
    maxY: 330,
    width: 660,
    height: 300,
  };

  const ballRadius = 16;
  const cbRadius = 16;

  // Compute live multi-body collision dynamics
  const calculateAimPhysics = (angle: number, spin: 'center' | 'top' | 'bottom' | 'left' | 'right') => {
    const start = cueBallPos;
    const obj = objectBallPos;
    const pocket = scenario.pocket;

    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    // Vector between ball centers
    const vx = obj.x - start.x;
    const vy = obj.y - start.y;
    const proj = vx * dx + vy * dy; // projection along aim

    let isCollision = false;
    let ghostBall = { x: 0, y: 0 };
    let objTargetVector = { x: 0, y: 0 };
    let cueTargetVector = { x: 0, y: 0 };
    let overlapPct = 0;
    let distanceToPocketEntrance = 999;
    let isPocketed = false;

    if (proj > 0) {
      const closeX = start.x + proj * dx;
      const closeY = start.y + proj * dy;
      const distSq = (closeX - obj.x) ** 2 + (closeY - obj.y) ** 2;

      // Elastic threshold: cue-ball radius (16px) + object-ball radius (16px) = 32px
      if (distSq < (ballRadius + cbRadius) ** 2) {
        isCollision = true;
        const dist = Math.sqrt(distSq);
        const collisionT = proj - Math.sqrt((ballRadius + cbRadius) ** 2 - distSq);

        ghostBall = {
          x: start.x + collisionT * dx,
          y: start.y + collisionT * dy
        };

        // Post-impact direction vector of the object ball (away from ghost center)
        const objDx = obj.x - ghostBall.x;
        const objDy = obj.y - ghostBall.y;
        const objLen = Math.hypot(objDx, objDy);
        if (objLen > 0) {
          objTargetVector = { x: objDx / objLen, y: objDy / objLen };
        }

        // Cue ball separation tangent vector (nominally perpendicular to impact normal direction)
        const dot = dx * objTargetVector.x + dy * objTargetVector.y;
        let cueDx = dx - dot * objTargetVector.x;
        let cueDy = dy - dot * objTargetVector.y;

        // Apply visual adjustments to trajectory depending on the chosen spin
        if (spin === 'top') {
          // Topspeed follow-through pushes forward
          cueDx += dx * 0.45;
          cueDy += dy * 0.45;
        } else if (spin === 'bottom') {
          // Bottomspeed drawing backward
          cueDx -= dx * 0.55;
          cueDy -= dy * 0.55;
        } else if (spin === 'left') {
          cueDx -= dy * 0.35;
          cueDy += dx * 0.35;
        } else if (spin === 'right') {
          cueDx += dy * 0.35;
          cueDy -= dx * 0.35;
        }

        const cueLen = Math.hypot(cueDx, cueDy);
        if (cueLen > 0) {
          cueTargetVector = { x: cueDx / cueLen, y: cueDy / cueLen };
        }

        // Percentage overlap thick/thin (1 - ratio of separation over diameter)
        overlapPct = Math.max(0, 1 - (dist / 32));

        // Trace how close the object ball trajectory matches the goal pocket
        const pocketDx = pocket.x - obj.x;
        const pocketDy = pocket.y - obj.y;
        const dotProduct = pocketDx * objTargetVector.x + pocketDy * objTargetVector.y;

        if (dotProduct > 0) {
          const closePocketX = obj.x + dotProduct * objTargetVector.x;
          const closePocketY = obj.y + dotProduct * objTargetVector.y;
          distanceToPocketEntrance = Math.hypot(closePocketX - pocket.x, closePocketY - pocket.y);

          // Pocket radius tolerance
          if (distanceToPocketEntrance <= pocket.r - 2) {
            isPocketed = true;
          }
        }
      }
    }

    // Mathematical angle offset between Aim line and Cue-to-Target line
    const cueToObjX = obj.x - start.x;
    const cueToObjY = obj.y - start.y;
    const angleCueToObj = Math.atan2(cueToObjY, cueToObjX);
    let diffAngleDeg = Math.abs((angleCueToObj - angle) * 180 / Math.PI);
    while (diffAngleDeg > 180) diffAngleDeg -= 360;
    diffAngleDeg = Math.abs(diffAngleDeg);
    if (diffAngleDeg > 90) diffAngleDeg = 90;

    return {
      isCollision,
      ghostBall,
      objTargetVector,
      cueTargetVector,
      overlapPct,
      isPocketed,
      distanceToPocketEntrance,
      diffAngleDeg
    };
  };

  const physics = calculateAimPhysics(aimAngle, cueSpin);

  // Draw table graphics inside useEffect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawCueBall = (cx: number, cy: number, radius: number) => {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      const grad = ctx.createRadialGradient(cx - 4, cy - 4, 1, cx, cy, radius);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(1, '#cbd5e1');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = '#94a3b8';
      ctx.stroke();
    };

    const drawObjectBall = (ox: number, oy: number, radius: number) => {
      ctx.beginPath();
      ctx.arc(ox, oy, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#eab308';
      ctx.fill();
      const objGrad = ctx.createRadialGradient(ox - 4, oy - 4, 1, ox, oy, radius);
      objGrad.addColorStop(0, '#fef08a');
      objGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = objGrad;
      ctx.fill();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = '#d97706';
      ctx.stroke();

      ctx.fillStyle = '#0d0f12';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('9', ox, oy);
    };

    // Clear Canvas and draw slate bezel
    ctx.clearRect(0, 0, 720, 360);
    ctx.fillStyle = '#1e293b'; // Wood frame
    ctx.fillRect(0, 0, 720, 360);

    // Cyan High-Contrast felt
    ctx.fillStyle = '#155e75';
    ctx.fillRect(tableBounds.minX, tableBounds.minY, tableBounds.width, tableBounds.height);

    // Felt boundaries outline
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#0e7490';
    ctx.strokeRect(tableBounds.minX, tableBounds.minY, tableBounds.width, tableBounds.height);

    // Render 6 standard pockets
    const pockets = [
      { x: tableBounds.minX, y: tableBounds.minY },
      { x: tableBounds.minX + tableBounds.width / 2, y: tableBounds.minY - 4 },
      { x: tableBounds.maxX, y: tableBounds.minY },
      { x: tableBounds.minX, y: tableBounds.maxY },
      { x: tableBounds.minX + tableBounds.width / 2, y: tableBounds.maxY + 4 },
      { x: tableBounds.maxX, y: tableBounds.maxY },
    ];

    pockets.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
      ctx.fillStyle = '#0a0d14';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#334155';
      ctx.stroke();

      // Highlight target pocket
      if (Math.hypot(p.x - scenario.pocket.x, p.y - scenario.pocket.y) < 5) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 26, 0, Math.PI * 2);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 9.5px sans-serif';
        ctx.fillText('⭐ 目标落袋', p.x - 24, p.y < 120 ? p.y + 38 : p.y - 32);
      }
    });

    const start = cueBallPos;
    const obj = objectBallPos;

    if (!isAnimating) {
      const dx = Math.cos(aimAngle);
      const dy = Math.sin(aimAngle);

      // Cue stick design
      const stickLength = 120;
      const stickDistance = 24;
      const stickStartX = start.x - dx * (stickLength + stickDistance);
      const stickStartY = start.y - dy * (stickLength + stickDistance);
      const stickEndX = start.x - dx * stickDistance;
      const stickEndY = start.y - dy * stickDistance;

      ctx.beginPath();
      ctx.moveTo(stickStartX, stickStartY);
      ctx.lineTo(stickEndX, stickEndY);
      ctx.lineWidth = 4.5;
      ctx.strokeStyle = '#e2e8f0';
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(stickEndX - dx * 8, stickEndY - dy * 8);
      ctx.lineTo(stickEndX, stickEndY);
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#3b82f6'; // Tip color
      ctx.stroke();

      // Dashed laser line from cue ball
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      if (physics.isCollision) {
        ctx.lineTo(physics.ghostBall.x, physics.ghostBall.y);
      } else {
        ctx.lineTo(start.x + dx * 300, start.y + dy * 300);
      }
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Ghost sphere at projection spot
      if (physics.isCollision) {
        ctx.beginPath();
        ctx.arc(physics.ghostBall.x, physics.ghostBall.y, cbRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fill();
        ctx.stroke();

        // Contact point marker
        ctx.beginPath();
        ctx.arc(physics.ghostBall.x, physics.ghostBall.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();

        // Trace Object Ball projected path
        ctx.beginPath();
        ctx.moveTo(obj.x, obj.y);
        ctx.lineTo(obj.x + physics.objTargetVector.x * 240, obj.y + physics.objTargetVector.y * 240);
        ctx.strokeStyle = physics.isPocketed ? '#10b981' : '#f59e0b';
        ctx.lineWidth = physics.isPocketed ? 2.5 : 1.5;
        ctx.setLineDash([4, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Trace Cue Ball orthogonal split path
        ctx.beginPath();
        ctx.moveTo(physics.ghostBall.x, physics.ghostBall.y);
        ctx.lineTo(physics.ghostBall.x + physics.cueTargetVector.x * 120, physics.ghostBall.y + physics.cueTargetVector.y * 120);
        ctx.strokeStyle = 'rgba(255,255,255,0.65)';
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }
    } else {
      // Kinematic slide playback
      const t = animationFrame / 80; // 80-frame bounds
      const cb = cueBallPos;

      if (physics.isCollision) {
        const contactX = physics.ghostBall.x;
        const contactY = physics.ghostBall.y;

        if (t < 0.5) {
          const f = t * 2;
          const currentCueX = cb.x + (contactX - cb.x) * f;
          const currentCueY = cb.y + (contactY - cb.y) * f;

          // Draw rolling white cue & static target ball with radial gradients
          drawCueBall(currentCueX, currentCueY, cbRadius);
          drawObjectBall(obj.x, obj.y, ballRadius);
        } else {
          // Split animation phase
          const f = (t - 0.5) * 2;
          const travelScalar = cuePower / 60;

          const currentCueX = contactX + physics.cueTargetVector.x * 80 * travelScalar * f;
          const currentCueY = contactY + physics.cueTargetVector.y * 80 * travelScalar * f;

          const currentObjX = obj.x + physics.objTargetVector.x * 180 * travelScalar * f;
          const currentObjY = obj.y + physics.objTargetVector.y * 180 * travelScalar * f;

          // Draw rolling white cue
          drawCueBall(currentCueX, currentCueY, cbRadius);

          // Draw yellow object ball if not pocketed fully
          if (!physics.isPocketed || f < 0.94) {
            const currentR = physics.isPocketed && f > 0.7 
              ? Math.max(2, ballRadius * (1 - (f - 0.7) / 0.3)) 
              : ballRadius;
            drawObjectBall(currentObjX, currentObjY, currentR);
          }
        }
      } else {
        // Flat miss physics
        const travelScalar = cuePower / 60;
        const currentCueX = cb.x + Math.cos(aimAngle) * 350 * t * travelScalar;
        const currentCueY = cb.y + Math.sin(aimAngle) * 350 * t * travelScalar;

        drawCueBall(currentCueX, currentCueY, cbRadius);
        drawObjectBall(obj.x, obj.y, ballRadius);
      }
    }

    // Static spheres drawing
    if (!isAnimating) {
      drawCueBall(start.x, start.y, cbRadius);
      drawObjectBall(obj.x, obj.y, ballRadius);
    }

  }, [aimAngle, scenario, isAnimating, animationFrame, physics, cueBallPos, objectBallPos]);

  // Handle Dragging / Pointer input to aim
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isAnimating) return;
    const isInteractive = scenario.id === 'a_sc_1' || scenario.id === 'a_sc_2' || scenario.id === 'a_sc_3';
    if (!isInteractive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    setDragTarget('stick');
    canvas.setPointerCapture(e.pointerId);
    calculateAngleFromPointer(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragTarget) return;
    calculateAngleFromPointer(e);
  };

  const handlePointerUp = () => {
    setDragTarget(null);
  };

  const calculateAngleFromPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 720;
    const clickY = ((e.clientY - rect.top) / rect.height) * 360;

    const start = cueBallPos;
    const dx = clickX - start.x;
    const dy = clickY - start.y;

    setAimAngle(Math.atan2(dy, dx));
  };

  const runShotAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimationFrame(0);
    let frame = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      frame++;
      setAnimationFrame(frame);
      if (frame >= 80) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsAnimating(false);
      }
    }, 20); // 50 fps, runs for 1.6s
  };

  // Get overlap ratios and thick descriptions (pure friendly Chinese)
  const getOverlapLabel = (o: number) => {
    if (o <= 0) return '未瞄上 / 无碰撞';
    if (o >= 0.92) return '正面直击 (厚度: 100%)';
    if (o >= 0.72) return '较厚切角 (厚度: 75% ➔ 3/4球重合)';
    if (o >= 0.42) return '对半切角 (厚度: 50% ➔ 1/2球对剖)';
    if (o >= 0.16) return '偏薄切角 (厚度: 25% ➔ 1/4球轻擦)';
    return '极限薄刃 (厚度: 10% ➔ 擦边极微切)';
  };

  // Dynamic separation advice based on current hit angle & spin state
  const getSeparationAdvice = () => {
    if (!physics.isCollision) return '无碰撞，请转动出杆瞄准目标球边缘以产生角度！';
    const angle = Math.round(physics.diffAngleDeg);
    
    let advice = `出杆偏斜角：${angle}°。`;
    if (angle < 12) {
      advice += '此球近乎笔直，属于【直球】。建议直接以中杆平直平稳推射。';
    } else if (angle <= 35) {
      advice += '【轻微斜角】。推荐使用假想影子球瞄法，白球直接重合在9号球背部约 3/4 刻度。';
    } else if (angle <= 58) {
      advice += '【标准切角】。两球分离冲突明显，必须使用 1/2 厚度薄摩擦，出杆极易跑偏，注意身体站位要正。';
    } else {
      advice += '【高难度极限薄切】。重合面积极少，白球会以高速由于切线冲出，实战中极易打空，建议慢推控准。';
    }
    return advice;
  };

  const getSpinSplitAngleDegrees = () => {
    if (cueSpin === 'center') return '标准 90° 分离 (两球滑行完全正交)';
    if (cueSpin === 'top') return '约 35° ~ 45° 分离 (白球前跟顺滑冲出)';
    if (cueSpin === 'bottom') return '约 110° ~ 135° 大角分离 (白球强自转向后吸回)';
    return '约 85° ~ 95° 带自转偏移 (弹起时有偏塞物理膨胀)';
  };

  return (
    <div className="flex flex-col gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6" id="aiming-simulator-container">
      
      {/* Title Header */}
      <div className="flex justify-between items-start gap-4" id="aiming-header">
        <div>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-sky-500/10 text-sky-400 uppercase tracking-widest font-mono">
            {scenario.subtitle}
          </span>
          <h3 className="text-lg md:text-xl font-bold font-sans text-slate-100 tracking-tight mt-1">
            {scenario.title}
          </h3>
          <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
            {scenario.description}
          </p>
        </div>
        <div className="hidden sm:flex flex-col items-end shrink-0 text-right">
          <span className="text-xs text-slate-500">目标底袋</span>
          <span className="text-lg font-bold font-mono text-amber-500">{scenario.pocket.label}</span>
        </div>
      </div>

      {/* Interactive viewport card */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden w-full bg-slate-950 rounded-xl border border-slate-800/80 aspect-[2/1] cursor-crosshair flex justify-center items-center"
      >
        <canvas
          ref={canvasRef}
          width={720}
          height={360}
          className="w-full h-full block"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />

        {/* Lock visual badge for non-interactive files */}
        {!(scenario.id === 'a_sc_1' || scenario.id === 'a_sc_2' || scenario.id === 'a_sc_3') && (
          <div className="absolute top-4 right-4 bg-slate-900/90 border border-amber-500/30 text-amber-400 text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
            <span>名师教研案例 · 最佳瞄角已锁定</span>
          </div>
        )}

        {/* Real-time status badges */}
        {physics.isCollision && !isAnimating && (
          <div className="absolute top-4 left-4 flex flex-col gap-1.5" id="live-metrics">
            <span className="bg-slate-900/90 border border-slate-800 backdrop-blur-sm text-slate-100 text-[10px] sm:text-xs font-sans px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
              <Percent className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{getOverlapLabel(physics.overlapPct)}</span>
            </span>
            
            {physics.isPocketed ? (
              <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] sm:text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-emerald-950/20">
                <Target className="w-3.5 h-3.5 animate-bounce" />
                <span>完美对正 ➔ 球在入袋完美轨道内！</span>
              </span>
            ) : (
              <span className="bg-rose-500/90 backdrop-blur-sm text-white text-[10px] sm:text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                <Eye className="w-3.5 h-3.5" />
                <span>打点有偏 ➔ 会错失口袋 (避袋偏差: {Math.round(physics.distanceToPocketEntrance * 0.61)} 毫米)</span>
              </span>
            )}
          </div>
        )}

        {!physics.isCollision && !isAnimating && (
          <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-800/80 backdrop-blur-sm text-slate-400 text-xs px-3 py-1.5 rounded-full">
            💡 提示：在桌面上任意拖拽滑动旋转球杆，即可对准黄球计算出下球轨道
          </div>
        )}
      </div>

      {/* Advanced Aiming Parameter Controllers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/65">
        
        {/* Left: Shot Angle */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="flex items-center gap-1"><Compass className="w-3.5 h-3.5 text-sky-400" /> 物理出杆偏斜角</span>
            <span className="text-sky-400 font-bold font-mono">{Math.round((aimAngle * 180) / Math.PI)}°</span>
          </div>
          <input
            type="range"
            min={aimAngle - 0.7} 
            max={aimAngle + 0.7}
            step={0.01}
            value={aimAngle}
            onChange={(e) => setAimAngle(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400 focus:outline-none my-auto"
          />
          <p className="text-[10px] text-slate-500 leading-normal">点击台呢旋转，或直接推移该滑条微调物理射向角度。</p>
        </div>

        {/* Center: Interactive Shot Power */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-slate-400 block font-medium">推荐实操力度</span>
          <div className="grid grid-cols-3 gap-1">
            {[
              { label: '轻轻推进 (30%)', value: 30 },
              { label: '温稳定音 (60%)', value: 60 },
              { label: '强力冲弹 (100%)', value: 100 }
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => setCuePower(p.value)}
                className={`text-[11px] py-2 rounded-lg border font-semibold transition ${
                  cuePower === p.value
                    ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850 hover:text-slate-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-500">
            轻轻推适合底沙薄切；大力冲通常用以在碰撞后强力改变母球的反弹走位。
          </p>
        </div>

        {/* Right: Shoot Spin打点 */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-slate-400 block font-medium font-sans">打点法门与偏塞</span>
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
                onClick={() => setCueSpin(s.id as any)}
                className={`flex flex-col items-center py-1 rounded-lg border transition ${
                  cueSpin === s.id
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/30 font-bold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850'
                }`}
                title={s.desc}
              >
                <span className="text-[10px] leading-tight">{s.label}</span>
                <span className="text-[8px] opacity-75">{s.desc}</span>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 font-sans">
            高低杆会使碰撞后白球从理论切线上跟进或后宿缩回。
          </p>
        </div>

      </div>

      {/* STRIKE HUD & VISUAL SUGGESTIONS (杆法, 角度, 力度, 分离角, 击打点) */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col gap-4">
        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
          <Sparkles className="w-4 h-4" /> 冠军导师高精度实操下球指南 (一看就懂)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          
          {/* Column 1: Ball Strike Plate Indicator */}
          <div className="flex flex-col items-center p-3 bg-slate-900 rounded-lg border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 mb-1 font-semibold">白球打点打法示意</span>
            
            {/* Visual Crosshair striking plate circle */}
            <div className="relative w-14 h-14 rounded-full bg-slate-950 border-2 border-slate-700 flex items-center justify-center">
              {/* Grid lines */}
              <div className="absolute w-full h-px bg-slate-800"></div>
              <div className="absolute h-full w-px bg-slate-800"></div>
              
              {/* Render dynamic Strike Tip red-dot representing current chosen cueSpin */}
              <div 
                className={`absolute w-3 h-3 rounded-full bg-rose-500 border border-white shadow-md shadow-rose-950/50 transition-all duration-300 ${
                  cueSpin === 'center' ? 'translate-x-0 translate-y-0' :
                  cueSpin === 'top' ? 'translate-x-0 -translate-y-4' :
                  cueSpin === 'bottom' ? 'translate-x-0 translate-y-4' :
                  cueSpin === 'left' ? '-translate-x-4 translate-y-0' :
                  'translate-x-4 translate-y-0'
                }`}
              />
            </div>

            <span className="text-xs font-extrabold text-amber-500 mt-2">
              {cueSpin === 'center' && '中杆 (碰后定球)'}
              {cueSpin === 'top' && '高杆跟球 (前冲运动)'}
              {cueSpin === 'bottom' && '低杆缩球 (强力后宿)'}
              {cueSpin === 'left' && '加左塞 (反塞折库)'}
              {cueSpin === 'right' && '加右塞 (顺旋借力)'}
            </span>
          </div>

          {/* Columns 2-4: Key physical recommendations table */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-normal">
            
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850">
              <span className="text-slate-400 block font-semibold mb-0.5">🚀 建议实操偏角度：</span>
              <strong className="text-slate-100 block text-[13px]">{Math.round(physics.diffAngleDeg)}° 斜射夹角</strong>
              <p className="text-[10.5px] text-slate-500 mt-1">{getSeparationAdvice()}</p>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850">
              <span className="text-slate-400 block font-semibold mb-0.5">📐 碰撞分离角：</span>
              <strong className="text-sky-400 block text-[13px]">{getSpinSplitAngleDegrees()}</strong>
              <p className="text-[10.5px] text-slate-500 mt-1">撞击的瞬间两球因刚性挤压，轨迹严格遵循分离定理。加入的旋转会由于呢面微动而缩放分离角。</p>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850">
              <span className="text-slate-400 block font-semibold mb-0.5">🎯 击打厚薄点位推荐：</span>
              <strong className="text-amber-500 block text-[13px]">
                {physics.isCollision ? getOverlapLabel(physics.overlapPct) : '暂无接触线'}
              </strong>
              <p className="text-[10.5px] text-slate-500 mt-1">
                {physics.overlapPct >= 0.85 ? '直指9号球中心出杆。' :
                 physics.overlapPct >= 0.55 ? '瞄准时，白球边缘在半个球的位置与黄球靠拢相交。' :
                 physics.overlapPct >= 0.25 ? '属于薄球，出杆时白球中心应该彻底对准9号球外侧一寸的影子虚点。' :
                 '属于极限薄削，眼睛盯着切角边缘一擦而过。'}
              </p>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-850">
              <span className="text-slate-400 block font-semibold mb-0.5">⚡ 力度与速度校准：</span>
              <strong className="text-emerald-400 block text-[13px]">
                实操配置: {cuePower === 30 ? '30% 软推' : cuePower === 60 ? '60% 中度定速' : '100% 暴烈炸裂'}
              </strong>
              <p className="text-[10.5px] text-slate-500 mt-1">
                {cuePower === 30 ? '防守细推，白球在下球后极易保留在原地，是防守局的核心手感。' :
                 cuePower === 60 ? '标准中力量度，白球落位容易计算，最适合大部分实战和培训。' :
                 '高爆发猛力，母球会借弹岸之力高速奔跑4-5米，属于强突群球时所用手法。'}
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* Trigger control buttons bar matches footer layout */}
      <div className="flex justify-between items-center gap-3 bg-slate-950/30 p-2 px-3 rounded-lg border border-slate-800/40">
        <span className="text-xs text-slate-400">
          高精2D几何轨道定位, 出杆校准: <strong className="text-slate-200">【分离角度: ~{Math.round(physics.diffAngleDeg)}° • 打点: {cueSpin === 'center' ? '纯中轴中杆' : cueSpin==='top' ? '高位向前偏塞' : '低位向拉回塞'}】</strong>
        </span>

        <div className="flex gap-2 shrink-0 animate-pulse">
          <button
            onClick={() => {
              setAimAngle(scenario.initialAimAngle);
              setCuePower(60);
              setCueSpin('center');
            }}
            className="flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-200 px-4 py-2.5 rounded-lg border border-slate-705 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重置角度</span>
          </button>
          
          <button
            onClick={runShotAnimation}
            disabled={isAnimating}
            className={`flex items-center justify-center gap-2 text-xs font-extrabold px-6 py-2.5 rounded-lg shadow-lg transition active:scale-95 ${
              physics.isPocketed 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/20' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>开始动画模拟</span>
          </button>
        </div>
      </div>

      {/* Champion Mentor Tip Card */}
      <div className="flex gap-4 items-start bg-slate-950/40 border border-slate-800/60 p-4 rounded-xl" id="mentor-tip">
        <img 
          src={scenario.champion.avatar} 
          alt={scenario.champion.name}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-700 object-cover shrink-0"
          referrerPolicy="no-referrer"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-100">{scenario.champion.name}</span>
            <span className="text-[10px] bg-sky-500/10 text-sky-400 px-1.5 py-0.5 rounded font-medium">
              {scenario.champion.title}
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1.5 italic leading-relaxed">
            {scenario.champion.tip}
          </p>
        </div>
      </div>

    </div>
  );
}
