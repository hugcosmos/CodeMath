import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Play, Pause, RotateCcw, StepForward, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface Disk {
  id: number;
  size: number;
}

interface Tower {
  id: number;
  disks: Disk[];
}

const Chapter6Content = () => {
  const { t } = useTranslation();
  const [diskCount, setDiskCount] = useState(3);
  const [towers, setTowers] = useState<Tower[]>([
    { id: 0, disks: [] },
    { id: 1, disks: [] },
    { id: 2, disks: [] },
  ]);
  const [moves, setMoves] = useState<{ from: number; to: number }[]>([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [callStack, setCallStack] = useState<string[]>([]);
  const [fractalDepth, setFractalDepth] = useState(4);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fractalCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const movesRef = useRef<{ from: number; to: number }[]>([]);

  // Keep movesRef in sync with moves
  useEffect(() => { movesRef.current = moves; }, [moves]);

  // Initialize towers
  useEffect(() => {
    const initialDisks: Disk[] = Array.from({ length: diskCount }, (_, i) => ({
      id: diskCount - i,
      size: diskCount - i,
    }));
    setTowers([
      { id: 0, disks: initialDisks },
      { id: 1, disks: [] },
      { id: 2, disks: [] },
    ]);
    setMoves([]);
    setCurrentMove(0);
    setCallStack([]);
    generateMoves(diskCount, 0, 2, 1);
  }, [diskCount]);

  // Generate Hanoi moves
  const generateMoves = (n: number, from: number, to: number, aux: number) => {
    const newMoves: { from: number; to: number }[] = [];
    
    const hanoi = (n: number, from: number, to: number, aux: number) => {
      if (n === 1) {
        newMoves.push({ from, to });
        return;
      }
      hanoi(n - 1, from, aux, to);
      newMoves.push({ from, to });
      hanoi(n - 1, aux, to, from);
    };
    
    hanoi(n, from, to, aux);
    setMoves(newMoves);
  };

  // Execute a single move
  const executeMove = (from: number, to: number) => {
    setTowers((prev) => {
      const newTowers = [...prev];
      const disk = newTowers[from].disks[newTowers[from].disks.length - 1];
      if (disk) {
        newTowers[from] = { ...newTowers[from], disks: newTowers[from].disks.slice(0, -1) };
        newTowers[to] = { ...newTowers[to], disks: [...newTowers[to].disks, disk] };
      }
      return newTowers;
    });
  };

  // Start animation
  const startAnimation = () => {
    if (isAnimating || currentMove >= moves.length) return;

    setIsAnimating(true);

    animationRef.current = setInterval(() => {
      setCurrentMove((prev) => {
        const currentMoves = movesRef.current;
        if (prev >= currentMoves.length) {
          stopAnimation();
          return prev;
        }

        const move = currentMoves[prev];
        executeMove(move.from, move.to);

        // Update call stack visualization
        setCallStack([
          `hanoi(${diskCount}, 0, 2, 1)`,
          `  hanoi(${diskCount - 1}, 0, 1, 2)`,
          `    hanoi(${diskCount - 2}, 0, 2, 1)`,
          `      move disk from ${move.from} to ${move.to}`,
        ]);

        return prev + 1;
      });
    }, animationSpeed);
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }
    setIsAnimating(false);
  };

  const resetAnimation = () => {
    stopAnimation();
    const initialDisks: Disk[] = Array.from({ length: diskCount }, (_, i) => ({
      id: diskCount - i,
      size: diskCount - i,
    }));
    setTowers([
      { id: 0, disks: initialDisks },
      { id: 1, disks: [] },
      { id: 2, disks: [] },
    ]);
    setCurrentMove(0);
    setCallStack([]);
  };

  const stepForward = () => {
    if (currentMove < moves.length) {
      const move = moves[currentMove];
      executeMove(move.from, move.to);
      setCurrentMove((prev) => prev + 1);
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

  // Draw Hanoi towers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);

    const towerWidth = rect.width / 3;
    const baseY = rect.height - 30;
    const towerHeight = rect.height - 60;
    const diskHeight = 20;
    const maxDiskWidth = towerWidth * 0.7;
    const diskWidthStep = maxDiskWidth / diskCount;

    // Draw towers
    for (let i = 0; i < 3; i++) {
      const towerX = i * towerWidth + towerWidth / 2;
      
      // Tower base
      ctx.fillStyle = '#333';
      ctx.fillRect(towerX - 40, baseY, 80, 10);
      
      // Tower pole
      ctx.fillStyle = '#666';
      ctx.fillRect(towerX - 5, baseY - towerHeight, 10, towerHeight);
      
      // Tower label
      ctx.fillStyle = '#999';
      ctx.font = '14px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(String.fromCharCode(65 + i), towerX, baseY + 25);

      // Draw disks
      towers[i].disks.forEach((disk, diskIndex) => {
        const diskWidth = disk.size * diskWidthStep + 30;
        const diskY = baseY - (diskIndex + 1) * diskHeight;
        
        // Disk shadow
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(towerX - diskWidth / 2 + 2, diskY + 2, diskWidth, diskHeight - 2);
        
        // Disk body
        const gradient = ctx.createLinearGradient(towerX - diskWidth / 2, diskY, towerX + diskWidth / 2, diskY);
        gradient.addColorStop(0, '#F4D03F');
        gradient.addColorStop(0.5, '#F7DC6F');
        gradient.addColorStop(1, '#D4AC0D');
        ctx.fillStyle = gradient;
        ctx.fillRect(towerX - diskWidth / 2, diskY, diskWidth, diskHeight - 2);
        
        // Disk border
        ctx.strokeStyle = '#B7950B';
        ctx.lineWidth = 1;
        ctx.strokeRect(towerX - diskWidth / 2, diskY, diskWidth, diskHeight - 2);
        
        // Disk number
        ctx.fillStyle = '#333';
        ctx.font = 'bold 12px "Fira Code", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(disk.id), towerX, diskY + diskHeight / 2);
      });
    }
  }, [towers, diskCount]);

  // Draw Sierpinski triangle
  useEffect(() => {
    const canvas = fractalCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);

    const drawTriangle = (x: number, y: number, size: number, depth: number) => {
      if (depth === 0) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x + size / 2, y - size * Math.sin(Math.PI / 3));
        ctx.closePath();
        ctx.fillStyle = '#F4D03F';
        ctx.fill();
        return;
      }

      const newSize = size / 2;
      const height = size * Math.sin(Math.PI / 3) / 2;

      drawTriangle(x, y, newSize, depth - 1);
      drawTriangle(x + newSize, y, newSize, depth - 1);
      drawTriangle(x + newSize / 2, y - height, newSize, depth - 1);
    };

    const size = Math.min(rect.width, rect.height) * 0.8;
    const x = (rect.width - size) / 2;
    const y = rect.height - (rect.height - size * Math.sin(Math.PI / 3)) / 2;

    drawTriangle(x, y, size, fractalDepth);
  }, [fractalDepth]);

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-cyan-50 rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          {t('chapterContent.common.coreConcept')}
        </h4>
        <p className="text-gray-700">
          {t('chapterContent.chapter6.coreConceptDesc')}
        </p>
      </div>

      {/* Hanoi Tower */}
      <div className="bg-white border rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-4">{t('chapterContent.chapter6.hanoiTitle')}</h4>
        <p className="text-sm text-gray-600 mb-6">
          {t('chapterContent.chapter6.hanoiDesc', { disks: diskCount, moves: Math.pow(2, diskCount) - 1 })}
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">{t('chapterContent.chapter6.diskCount')}: {diskCount}</label>
            <Slider
              value={[diskCount]}
              onValueChange={(value) => setDiskCount(value[0])}
              min={1}
              max={6}
              step={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('chapterContent.chapter6.animationSpeed')}: {animationSpeed}ms</label>
            <Slider
              value={[animationSpeed]}
              onValueChange={(value) => setAnimationSpeed(value[0])}
              min={200}
              max={2000}
              step={200}
            />
          </div>
        </div>

        {/* Tower Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full bg-gray-50 rounded-xl mb-4"
          style={{ width: '100%', height: '250px' }}
        />

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <Button onClick={isAnimating ? stopAnimation : startAnimation}>
            {isAnimating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isAnimating ? t('chapterContent.chapter6.pause') : t('chapterContent.chapter6.autoPlay')}
          </Button>
          <Button variant="outline" onClick={stepForward}>
            <StepForward className="w-4 h-4 mr-2" />
            {t('chapterContent.chapter6.step')}
          </Button>
          <Button variant="outline" onClick={resetAnimation}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t('chapterContent.common.reset')}
          </Button>
        </div>

        {/* Progress */}
        <div className="text-center text-sm text-gray-500">
          {t('chapterContent.chapter6.moveProgress')}: {currentMove} / {moves.length}
        </div>

        {/* Call Stack */}
        {callStack.length > 0 && (
          <div className="mt-4 bg-gray-900 rounded-xl p-4 text-white">
            <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              {t('chapterContent.chapter6.callStack')}
            </h5>
            <pre className="font-mono text-xs overflow-x-auto">
              {callStack.join('\n')}
            </pre>
          </div>
        )}
      </div>

      {/* Fractal */}
      <div className="bg-white border rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-4">{t('chapterContent.chapter6.fractalTitle')}</h4>
        <p className="text-sm text-gray-600 mb-4">
          {t('chapterContent.chapter6.fractalDesc')}
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">{t('chapterContent.chapter6.recursionDepth')}: {fractalDepth}</label>
          <Slider
            value={[fractalDepth]}
            onValueChange={(value) => setFractalDepth(value[0])}
            min={0}
            max={6}
            step={1}
          />
        </div>

        <canvas
          ref={fractalCanvasRef}
          className="w-full bg-gray-50 rounded-xl"
          style={{ width: '100%', height: '250px' }}
        />

        <div className="mt-4 text-center text-sm text-gray-500">
          {t('chapterContent.chapter6.triangleCount')}: {Math.pow(3, fractalDepth)}
        </div>
      </div>

      {/* Code Example */}
      <div className="bg-gray-900 rounded-2xl p-6 text-white">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full" />
          {t('chapterContent.common.codeImplementation')}
        </h4>
        <pre className="font-mono text-sm overflow-x-auto">
          <code>{`${t('chapterContent.chapter6.codeComment1')}

${t('chapterContent.chapter6.codeComment2')}
function hanoi(n, from, to, aux) {
  if (n === 1) {
    console.log(\`Move disk 1 from \${from} to \${to}\`);
    return;
  }

  ${t('chapterContent.chapter6.codeComment3')}
  hanoi(n - 1, from, aux, to);

  ${t('chapterContent.chapter6.codeComment4')}
  console.log(\`Move disk \${n} from \${from} to \${to}\`);

  ${t('chapterContent.chapter6.codeComment5')}
  hanoi(n - 1, aux, to, from);
}

${t('chapterContent.chapter6.codeComment6', { count: diskCount })}
hanoi(${diskCount}, 'A', 'C', 'B');
${t('chapterContent.chapter6.codeComment7', { moves: Math.pow(2, diskCount) - 1 })}

${t('chapterContent.chapter6.codeComment8')}
${t('chapterContent.chapter6.codeComment9')}

${t('chapterContent.chapter6.codeComment10')}
function drawTriangle(x, y, size, depth) {
  if (depth === 0) {
    ${t('chapterContent.chapter6.codeComment11')}
    fillTriangle(x, y, size);
    return;
  }

  const newSize = size / 2;
  const height = size * Math.sin(Math.PI / 3) / 2;

  ${t('chapterContent.chapter6.codeComment12')}
  drawTriangle(x, y, newSize, depth - 1);
  drawTriangle(x + newSize, y, newSize, depth - 1);
  drawTriangle(x + newSize / 2, y - height, newSize, depth - 1);
}`}</code>
        </pre>
      </div>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-cyan-400 to-sky-500 rounded-2xl p-6 text-white">
        <h4 className="text-lg font-semibold mb-2">{t('chapterContent.common.keyInsight')}</h4>
        <p className="opacity-90">
          {t('chapterContent.chapter6.keyInsightDesc')}
        </p>
      </div>
    </div>
  );
};

export default Chapter6Content;
