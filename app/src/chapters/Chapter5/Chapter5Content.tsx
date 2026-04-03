import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { GitBranch, Calculator, TreePine, Layers } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

// Factorial function
const factorial = (n: number): number => {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
};

// Combination: C(n, k) = n! / (k! * (n-k)!)
const combination = (n: number, k: number): number => {
  if (k > n) return 0;
  return factorial(n) / (factorial(k) * factorial(n - k));
};

// Permutation: P(n, k) = n! / (n-k)!
const permutation = (n: number, k: number): number => {
  if (k > n) return 0;
  return factorial(n) / factorial(n - k);
};

const Chapter5Content = () => {
  const { t } = useTranslation();
  const [n, setN] = useState(5);
  const [k, setK] = useState(3);
  const [treeCount, setTreeCount] = useState(5);
  const [treeSpacing, setTreeSpacing] = useState(2);
  const [setA] = useState<number[]>([2, 4, 6, 8, 10, 12]);
  const [setB] = useState<number[]>([3, 6, 9, 12]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vennCanvasRef = useRef<HTMLCanvasElement>(null);

  // Tree planting problem
  const roadLength = (treeCount - 1) * treeSpacing;

  // Set operations
  const intersection = setA.filter((x) => setB.includes(x));
  const union = [...new Set([...setA, ...setB])];

  // Draw tree planting visualization
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

    const startX = 50;
    const endX = rect.width - 50;
    const roadY = rect.height / 2;
    const scale = (endX - startX) / (treeCount - 1 || 1);

    // Draw road
    ctx.beginPath();
    ctx.moveTo(startX, roadY);
    ctx.lineTo(endX, roadY);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw trees
    for (let i = 0; i < treeCount; i++) {
      const x = startX + i * scale;
      
      // Tree trunk
      ctx.beginPath();
      ctx.moveTo(x, roadY);
      ctx.lineTo(x, roadY - 30);
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Tree top (triangle)
      ctx.beginPath();
      ctx.moveTo(x - 15, roadY - 30);
      ctx.lineTo(x, roadY - 60);
      ctx.lineTo(x + 15, roadY - 30);
      ctx.closePath();
      ctx.fillStyle = '#228B22';
      ctx.fill();

      // Tree number
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${i + 1}`, x, roadY - 40);
    }

    // Draw spacing labels
    for (let i = 0; i < treeCount - 1; i++) {
      const x1 = startX + i * scale;
      const x2 = startX + (i + 1) * scale;
      const midX = (x1 + x2) / 2;
      
      ctx.fillStyle = '#666';
      ctx.font = '12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${treeSpacing}m`, midX, roadY + 20);
    }

    // Road length label
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t('chapterContent.chapter5.roadLengthCanvas', { length: roadLength }), rect.width / 2, roadY + 50);
  }, [treeCount, treeSpacing, roadLength, t]);

  // Draw Venn diagram
  useEffect(() => {
    const canvas = vennCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = 80;

    // Draw Set A circle
    ctx.beginPath();
    ctx.arc(centerX - 40, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(244, 208, 63, 0.3)';
    ctx.fill();
    ctx.strokeStyle = '#F4D03F';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw Set B circle
    ctx.beginPath();
    ctx.arc(centerX + 40, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(96, 165, 250, 0.3)';
    ctx.fill();
    ctx.strokeStyle = '#60A5FA';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('A', centerX - 80, centerY - 50);
    ctx.fillText('B', centerX + 80, centerY - 50);

    // Intersection label
    ctx.fillStyle = '#666';
    ctx.font = '12px "Inter", sans-serif';
    ctx.fillText('A ∩ B', centerX, centerY);
    ctx.fillText(t('chapterContent.chapter5.intersectionCount', { count: intersection.length }), centerX, centerY + 15);

    // Count labels
    ctx.fillStyle = '#F4D03F';
    ctx.font = 'bold 14px "Inter", sans-serif';
    ctx.fillText(`A: ${setA.length}`, centerX - 80, centerY + 20);

    ctx.fillStyle = '#60A5FA';
    ctx.fillText(`B: ${setB.length}`, centerX + 80, centerY + 20);
  }, [setA, setB, intersection, t]);

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-pink-50 rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          {t('chapterContent.common.coreConcept')}
        </h4>
        <p className="text-gray-700">
          {t('chapterContent.chapter5.coreConceptDesc')}
        </p>
      </div>

      {/* Tree Planting Problem */}
      <div className="bg-white border rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TreePine className="w-5 h-5" />
          {t('chapterContent.chapter5.treeTitle')}
        </h4>
        <p className="text-sm text-gray-600 mb-6">
          {t('chapterContent.chapter5.treePlantingDesc', { spacing: treeSpacing, count: treeCount })}
        </p>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('chapterContent.chapter5.treeCount')}: {treeCount}</label>
              <Slider
                value={[treeCount]}
                onValueChange={(value) => setTreeCount(value[0])}
                min={2}
                max={10}
                step={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t('chapterContent.chapter5.spacing')}: {treeSpacing}m</label>
              <Slider
                value={[treeSpacing]}
                onValueChange={(value) => setTreeSpacing(value[0])}
                min={1}
                max={10}
                step={1}
              />
            </div>
          </div>

          <canvas
            ref={canvasRef}
            className="w-full bg-gray-50 rounded-xl"
            style={{ width: '100%', height: '150px' }}
          />

          <div className="bg-amber-50 rounded-xl p-4">
            <div className="font-mono text-center">
              {t('chapterContent.chapter5.roadLength')} = ({treeCount} - 1) × {treeSpacing} = <strong>{roadLength}m</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Permutation & Combination */}
      <div className="bg-white border rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          {t('chapterContent.chapter5.calcTitle')}
        </h4>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">{t('chapterContent.chapter5.totalN')} {n}</label>
            <Slider
              value={[n]}
              onValueChange={(value) => setN(value[0])}
              min={1}
              max={10}
              step={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t('chapterContent.chapter5.selectK')} {k}</label>
            <Slider
              value={[k]}
              onValueChange={(value) => setK(Math.min(value[0], n))}
              min={0}
              max={n}
              step={1}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="text-sm text-gray-500 mb-2">{t('chapterContent.chapter5.permutation')} P(n, k)</div>
            <div className="text-2xl font-mono font-bold text-purple-600">
              {permutation(n, k).toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {n}! / ({n}-{k})! = {factorial(n)} / {factorial(n - k)}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {t('chapterContent.chapter5.permutationDesc')}
            </div>
          </div>
          <div className="bg-pink-50 rounded-xl p-4">
            <div className="text-sm text-gray-500 mb-2">{t('chapterContent.chapter5.combination')} C(n, k)</div>
            <div className="text-2xl font-mono font-bold text-pink-600">
              {combination(n, k).toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {n}! / ({k}! × ({n}-{k})!)
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {t('chapterContent.chapter5.combinationDesc')}
            </div>
          </div>
        </div>
      </div>

      {/* Inclusion-Exclusion Principle */}
      <div className="bg-white border rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5" />
          {t('chapterContent.chapter5.inclusionExclusion')}
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          {t('chapterContent.chapter5.inclusionExclusionDesc')}
        </p>

        <div className="flex justify-center mb-6">
          <canvas
            ref={vennCanvasRef}
            className="w-full max-w-md"
            style={{ width: '100%', height: '200px' }}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-amber-50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500">{t('chapterContent.chapter5.setA')}</div>
            <div className="font-mono">{setA.join(', ')}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500">{t('chapterContent.chapter5.setB')}</div>
            <div className="font-mono">{setB.join(', ')}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500">{t('chapterContent.chapter5.intersection')}</div>
            <div className="font-mono">{intersection.join(', ') || '∅'}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500">{t('chapterContent.chapter5.union')}</div>
            <div className="font-mono">{union.join(', ')}</div>
          </div>
        </div>

        <div className="mt-4 bg-gray-50 rounded-xl p-4">
          <div className="font-mono text-center text-sm">
            |A ∪ B| = |A| + |B| - |A ∩ B| = {setA.length} + {setB.length} - {intersection.length} = <strong>{union.length}</strong>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div className="bg-gray-900 rounded-2xl p-6 text-white">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full" />
          {t('chapterContent.common.codeImplementation')}
        </h4>
        <pre className="font-mono text-sm overflow-x-auto">
          <code>{`${t('chapterContent.chapter5.codeComment1')}

${t('chapterContent.chapter5.codeComment2')}
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

${t('chapterContent.chapter5.codeComment3')}
function permutation(n, k) {
  return factorial(n) / factorial(n - k);
}
// P(${n}, ${k}) = ${permutation(n, k)}

${t('chapterContent.chapter5.codeComment4')}
function combination(n, k) {
  return factorial(n) / (factorial(k) * factorial(n - k));
}
// C(${n}, ${k}) = ${combination(n, k)}

${t('chapterContent.chapter5.codeComment5')}
const setA = new Set([${setA.join(', ')}]);
const setB = new Set([${setB.join(', ')}]);

${t('chapterContent.chapter5.codeComment6')}
const union = new Set([...setA, ...setB]);
// size = ${union.length}

${t('chapterContent.chapter5.codeComment7')}
const intersection = new Set(
  [...setA].filter(x => setB.has(x))
);
// size = ${intersection.length}

${t('chapterContent.chapter5.codeComment8')}
const total = setA.size + setB.size - intersection.size;
// ${setA.length} + ${setB.length} - ${intersection.length} = ${union.length}`}</code>
        </pre>
      </div>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-pink-400 to-rose-500 rounded-2xl p-6 text-white">
        <h4 className="text-lg font-semibold mb-2">{t('chapterContent.common.keyInsight')}</h4>
        <p className="opacity-90">
          {t('chapterContent.chapter5.keyInsightDesc')}
        </p>
      </div>
    </div>
  );
};

export default Chapter5Content;
