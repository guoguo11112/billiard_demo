export interface KnowledgeNode {
  id: string;
  title: string;
  type: 'kicking' | 'aiming';
  section: string; // The group category description, e.g. '解球基础原理'
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  isUnlocked: boolean;
  scenarioIndex?: number; // Maps to the interactive demo index (0, 1, or 2)
  championTip?: string; // Special tip from Stephen Hendry, Pan Xiaoting, or Kong Dejing
}

export interface KickingScenario {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cushions: number; // Number of cushions
  cueBall: { x: number; y: number };
  targetBall: { x: number; y: number };
  obstacleBalls: { x: number; y: number; r: number }[];
  initialCushionAim: { x: number; y: number }; // Initial cushion aim coordinate/index
  diamonds: { x: number; y: number; label: string }[];
  champion: {
    name: string;
    avatar: string;
    title: string;
    tip: string;
  };
}

export interface AimingScenario {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cueBall: { x: number; y: number };
  objectBall: { x: number; y: number };
  pocket: { x: number; y: number; r: number; label: string };
  initialAimAngle: number; // in radians
  champion: {
    name: string;
    avatar: string;
    title: string;
    tip: string;
  };
}
