import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, TrendingUp, Search, Layers, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const Chapter7Content = () => {
  const { t } = useTranslation();
  const [targetNumber, setTargetNumber] = useState(50);
  const [guessRange, setGuessRange] = useState({ min: 1, max: 100 });
  const [guessHistory, setGuessHistory] = useState<number[]>([]);
  const [isLogScale, setIsLogScale] = useState(false);
  const [binarySteps, setBinarySteps] = useState(0);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);

  // Paper folding: milestone-based navigation
  // initialThickness = 0.1mm
  const initialThickness = 0.1; // mm

  const milestones = [
    { n: 0,   emoji: '📄', label: t('chapterContent.chapter7.milestone_0') },
    { n: 14,  emoji: '🧒', label: t('chapterContent.chapter7.milestone_14') },
    { n: 18,  emoji: '🏙️', label: t('chapterContent.chapter7.milestone_18') },
    { n: 23,  emoji: '🏙️', label: t('chapterContent.chapter7.milestone_23') },
    { n: 25,  emoji: '🌋', label: t('chapterContent.chapter7.milestone_25') },
    { n: 30,  emoji: '🚀', label: t('chapterContent.chapter7.milestone_30') },
    { n: 34,  emoji: '🛫', label: t('chapterContent.chapter7.milestone_34') },
    { n: 37,  emoji: '🌍', label: t('chapterContent.chapter7.milestone_37') },
    { n: 42,  emoji: '🌕', label: t('chapterContent.chapter7.milestone_42') },
    { n: 50,  emoji: '☀️', label: t('chapterContent.chapter7.milestone_50') },
    { n: 84,  emoji: '🌌', label: t('chapterContent.chapter7.milestone_84') },
    { n: 103, emoji: '🔭', label: t('chapterContent.chapter7.milestone_103') },
  ];

  const [folds, setFolds] = useState(0);

  const thickness = initialThickness * Math.pow(2, folds);
  const thicknessInMeters = thickness / 1000;
  const thicknessInKilometers = thicknessInMeters / 1000;

  const formatThickness = () => {
    const LY = 9.461e12; // 1 light-year ≈ 9.461 trillion km
    const ly = thicknessInKilometers / LY;
    if (ly >= 1e8) return `${(ly / 1e8).toFixed(0)} ${t('chapterContent.chapter7.unitBillionLy')}`;
    if (ly >= 1e4) return `${(ly / 1e4).toFixed(0)} ${t('chapterContent.chapter7.unitTenThousandLy')}`;
    if (ly >= 1) return `${Math.round(ly).toLocaleString()} ${t('chapterContent.chapter7.unitLightYear')}`;
    if (thicknessInKilometers >= 1e8) return `${(thicknessInKilometers / 1e8).toFixed(2)} ${t('chapterContent.chapter7.unitBillionKm')}`;
    if (thicknessInKilometers >= 1e4) return `${(thicknessInKilometers / 1e4).toFixed(2)} ${t('chapterContent.chapter7.unitTenThousandKm')}`;
    if (thicknessInKilometers >= 1) return `${thicknessInKilometers.toFixed(2)} km`;
    if (thicknessInMeters >= 1) return `${thicknessInMeters.toFixed(1)} m`;
    return `${thickness.toFixed(1)} mm`;
  };

  const currentMilestone = milestones.find(m => m.n === folds);
  const scaleProgress = folds / 103;

  const getGradient = () => {
    if (folds >= 84) return 'from-purple-600 to-indigo-700';
    if (folds >= 50) return 'from-red-500 to-orange-600';
    if (folds >= 42) return 'from-blue-500 to-indigo-600';
    if (folds >= 30) return 'from-emerald-500 to-teal-600';
    if (folds >= 19) return 'from-cyan-500 to-blue-500';
    if (folds >= 14) return 'from-amber-500 to-orange-500';
    return 'from-amber-400 to-yellow-500';
  };

  // Draw comparison chart
  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);

    const padding = 40;
    const chartWidth = rect.width - padding * 2;
    const chartHeight = rect.height - padding * 2;
    const startX = padding;
    const startY = rect.height - padding;

    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + chartWidth, startY);
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX, startY - chartHeight);
    ctx.stroke();

    const maxN = 20;
    const nValues = Array.from({ length: maxN }, (_, i) => i + 1);
    const linearData = nValues.map(n => n);
    const logData = nValues.map(n => Math.log2(n) + 1);
    const exponentialData = nValues.map(n => Math.pow(2, n));

    if (isLogScale) {
      const maxVal = 19;
      const getY = (val: number) => startY - (Math.log2(Math.max(val, 1)) / maxVal) * chartHeight;

      ctx.strokeStyle = '#e5e5e5';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        const y = startY - (i / 4) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(startX + chartWidth, y);
        ctx.stroke();
      }

      ctx.strokeStyle = '#60A5FA';
      ctx.lineWidth = 3;
      ctx.beginPath();
      linearData.forEach((val, i) => {
        const x = startX + (i / (maxN - 1)) * chartWidth;
        const y = getY(val);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();

      ctx.strokeStyle = '#34D399';
      ctx.lineWidth = 3;
      ctx.beginPath();
      logData.forEach((val, i) => {
        const x = startX + (i / (maxN - 1)) * chartWidth;
        const y = getY(val);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();

      ctx.strokeStyle = '#F87171';
      ctx.lineWidth = 3;
      ctx.beginPath();
      exponentialData.forEach((val, i) => {
        const x = startX + (i / (maxN - 1)) * chartWidth;
        const y = getY(val);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
    } else {
      const maxVal = linearData[maxN - 1];
      const getY = (val: number) => {
        const ratio = val / maxVal;
        return startY - Math.min(ratio, 1) * chartHeight;
      };

      ctx.strokeStyle = '#e5e5e5';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        const y = startY - (i / 4) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(startX + chartWidth, y);
        ctx.stroke();
        ctx.fillStyle = '#999';
        ctx.font = '9px "Inter", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(String(Math.round(maxVal * i / 4)), startX - 4, y + 3);
      }

      ctx.strokeStyle = '#34D399';
      ctx.lineWidth = 3;
      ctx.beginPath();
      logData.forEach((val, i) => {
        const x = startX + (i / (maxN - 1)) * chartWidth;
        const y = getY(val);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();

      ctx.strokeStyle = '#60A5FA';
      ctx.lineWidth = 3;
      ctx.beginPath();
      linearData.forEach((val, i) => {
        const x = startX + (i / (maxN - 1)) * chartWidth;
        const y = getY(val);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();

      ctx.strokeStyle = '#F87171';
      ctx.lineWidth = 3;
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < maxN; i++) {
        const x = startX + (i / (maxN - 1)) * chartWidth;
        const val = exponentialData[i];
        const y = getY(val);
        const clampedY = Math.max(y, startY - chartHeight);
        if (!started) { ctx.moveTo(x, clampedY); started = true; }
        else ctx.lineTo(x, clampedY);
        if (val > maxVal) break;
      }
      ctx.stroke();

      ctx.fillStyle = '#F87171';
      ctx.font = 'bold 11px "Inter", sans-serif';
      ctx.textAlign = 'center';
      const arrowX = startX + ((Math.ceil(Math.log2(maxVal)) - 1) / (maxN - 1)) * chartWidth;
      ctx.fillText(t('chapterContent.chapter7.chartExploding'), arrowX + 40, startY - chartHeight + 15);
    }

    ctx.font = '12px "Inter", sans-serif';
    ctx.textAlign = 'left';

    ctx.fillStyle = '#60A5FA';
    ctx.fillRect(startX + chartWidth - 100, 20, 15, 3);
    ctx.fillStyle = '#333';
    ctx.fillText(t('chapterContent.chapter7.chartLinear'), startX + chartWidth - 80, 24);

    ctx.fillStyle = '#34D399';
    ctx.fillRect(startX + chartWidth - 100, 35, 15, 3);
    ctx.fillStyle = '#333';
    ctx.fillText(t('chapterContent.chapter7.chartLogarithmic'), startX + chartWidth - 80, 39);

    ctx.fillStyle = '#F87171';
    ctx.fillRect(startX + chartWidth - 100, 50, 15, 3);
    ctx.fillStyle = '#333';
    ctx.fillText(t('chapterContent.chapter7.chartExponential'), startX + chartWidth - 80, 54);

    ctx.fillStyle = '#666';
    ctx.font = '10px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t('chapterContent.chapter7.chartInputSize'), startX + chartWidth / 2, startY + 30);
    for (let i = 0; i <= 4; i++) {
      const n = 1 + Math.round(i * (maxN - 1) / 4);
      const x = startX + ((n - 1) / (maxN - 1)) * chartWidth;
      ctx.fillText(String(n), x, startY + 15);
    }

    ctx.save();
    ctx.translate(12, startY - chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(isLogScale ? t('chapterContent.chapter7.chartLogOperations') : t('chapterContent.chapter7.chartOperations'), 0, 0);
    ctx.restore();
  }, [isLogScale, t]);

  // Binary search game
  const makeGuess = (guess: number) => {
    setGuessHistory([...guessHistory, guess]);
    setBinarySteps(binarySteps + 1);
    if (guess === targetNumber) return;
    if (guess < targetNumber) {
      setGuessRange({ min: guess + 1, max: guessRange.max });
    } else {
      setGuessRange({ min: guessRange.min, max: guess - 1 });
    }
  };

  const resetGame = () => {
    const newTarget = Math.floor(Math.random() * 100) + 1;
    setTargetNumber(newTarget);
    setGuessRange({ min: 1, max: 100 });
    setGuessHistory([]);
    setBinarySteps(0);
  };

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-red-50 rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {t('chapterContent.common.coreConcept')}
        </h4>
        <p className="text-gray-700">
          {t('chapterContent.chapter7.coreConceptDesc')}
        </p>
      </div>

      {/* Paper Folding */}
      <div className="bg-white border rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5" />
          {t('chapterContent.chapter7.paperFolding')}
        </h4>
        <p className="text-sm text-gray-600 mb-5">
          {t('chapterContent.chapter7.paperFoldingDesc')}
        </p>

        {/* Sticky hero + milestones layout */}
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          {/* Hero display card - sticky on desktop */}
          <div className={`sticky top-4 shrink-0 sm:w-64 w-full rounded-2xl transition-all duration-500 bg-gradient-to-br ${getGradient()} text-white`}>
            <div className="p-6 text-center">
              <div className="mb-3 flex items-center justify-center gap-4">
                <div className="w-12 h-14 rounded-sm border-2 border-white/40 bg-white/10 flex items-center justify-center text-2xl">
                  📄
                </div>
                <div className="text-white/60 text-xs leading-tight text-center">
                  {folds === 0 ? t('chapterContent.chapter7.paperInHand') : t('chapterContent.chapter7.afterFolds', { count: folds })}
                </div>
                <div className="w-12 h-14 rounded-sm border-2 border-white/60 bg-white/20 flex items-center justify-center text-2xl">
                  {currentMilestone?.emoji || '📄'}
                </div>
              </div>
              <div className="text-white/70 text-sm mb-1">{t('chapterContent.chapter7.foldsCount', { count: folds })}</div>
              <div className="text-3xl font-mono font-bold mb-3 break-all">{formatThickness()}</div>
              {currentMilestone && (
                <div className="text-sm font-bold leading-tight">{currentMilestone.emoji} {currentMilestone.label}</div>
              )}
              {/* Mini progress bar */}
              <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${folds === 0 ? 'bg-white/50' : 'bg-white/80'}`}
                  style={{ width: `${Math.max(scaleProgress * 100, 2)}%` }}
                />
              </div>
              <div className="mt-1.5 text-[10px] text-white/40">{t('chapterContent.chapter7.toObservableUniverseShort')}</div>
            </div>
          </div>

          {/* Milestone selector - compact, fold count only */}
          <div className="flex-1 grid grid-cols-4 sm:grid-cols-4 gap-1.5">
            {milestones.map((m) => (
              <button
                key={m.n}
                onClick={() => setFolds(m.n)}
                className={`py-2 px-1 rounded-lg text-center transition-all ${
                  folds === m.n
                    ? 'bg-amber-50 border-2 border-amber-400 shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="text-base">{m.emoji}</div>
                <div className={`font-mono font-bold text-xs mt-0.5 ${folds === m.n ? 'text-amber-600' : 'text-gray-700'}`}>
                  {m.n} {t('chapterContent.chapter7.foldTimes')}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 p-4 bg-amber-50 rounded-xl">
          <p className="text-sm text-amber-800">
            {t('chapterContent.chapter7.paperInsight')}
          </p>
        </div>
      </div>

      {/* Algorithm Comparison */}
      <div className="bg-white border rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          {t('chapterContent.chapter7.complexityTitle')}
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          {isLogScale
            ? t('chapterContent.chapter7.logScaleDesc')
            : t('chapterContent.chapter7.linearScaleDesc')}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">{t('chapterContent.chapter7.logScale')}</span>
          <Switch checked={isLogScale} onCheckedChange={setIsLogScale} />
        </div>

        <canvas
          ref={chartCanvasRef}
          className="w-full bg-gray-50 rounded-xl mb-4"
          style={{ width: '100%', height: '250px' }}
        />

        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="font-semibold text-blue-600">{t('chapterContent.chapter7.linear')}</div>
            <div className="text-gray-500">{t('chapterContent.chapter7.linearDesc')}</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="font-semibold text-green-600">{t('chapterContent.chapter7.logarithmic')}</div>
            <div className="text-gray-500">{t('chapterContent.chapter7.logarithmicDesc')}</div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="font-semibold text-red-600">{t('chapterContent.chapter7.exponential')}</div>
            <div className="text-gray-500">{t('chapterContent.chapter7.exponentialDesc')}</div>
          </div>
        </div>
      </div>

      {/* Binary Search Game */}
      <div className="bg-white border rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Search className="w-5 h-5" />
          {t('chapterContent.chapter7.guessingGame')}
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          {t('chapterContent.chapter7.guessingGameDesc')}
        </p>

        <div className="bg-gray-50 rounded-xl p-6 mb-4">
          <div className="text-center mb-4">
            <span className="text-gray-500">{t('chapterContent.chapter7.targetRange')}: </span>
            <span className="font-mono font-bold">{guessRange.min} - {guessRange.max}</span>
          </div>

          <div className="flex justify-center gap-2 mb-4">
            {guessHistory.map((guess, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded-full text-sm font-mono ${
                  guess === targetNumber
                    ? 'bg-green-500 text-white'
                    : guess < targetNumber
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {guess}
              </span>
            ))}
          </div>

          <div className="flex justify-center gap-2">
            {Array.from({ length: 10 }, (_, i) => {
              const guess = guessRange.min + Math.floor((guessRange.max - guessRange.min + 1) / 2) - 5 + i;
              if (guess < guessRange.min || guess > guessRange.max) return null;
              return (
                <Button
                  key={guess}
                  variant="outline"
                  size="sm"
                  onClick={() => makeGuess(guess)}
                  disabled={guessHistory.includes(guess)}
                >
                  {guess}
                </Button>
              );
            }).filter(Boolean)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-sm text-gray-500">{t('chapterContent.chapter7.binarySearchSteps')}</div>
            <div className="text-2xl font-mono font-bold text-blue-600">{binarySteps}</div>
          </div>
          <div className="text-center p-4 bg-gray-100 rounded-xl">
            <div className="text-sm text-gray-500">{t('chapterContent.chapter7.linearSearchSteps')}</div>
            <div className="text-2xl font-mono font-bold text-gray-600">{targetNumber} {t('chapterContent.chapter7.steps')}</div>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={resetGame}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t('chapterContent.chapter7.restart')}
          </Button>
        </div>
      </div>

      {/* Code Example */}
      <div className="bg-gray-900 rounded-2xl p-6 text-white">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full" />
          {t('chapterContent.common.codeImplementation')}
        </h4>
        <pre className="font-mono text-sm overflow-x-auto">
          <code>{`${t('chapterContent.chapter7.codeComment1')}

${t('chapterContent.chapter7.codeComment2')}
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
${t('chapterContent.chapter7.codeComment3')}

${t('chapterContent.chapter7.codeComment4')}
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
${t('chapterContent.chapter7.codeComment5')}
${t('chapterContent.chapter7.codeComment6')}

${t('chapterContent.chapter7.codeComment7')}
function exponentialGrowth(n) {
  return Math.pow(2, n);
}
// n=10 → 1,024
// n=20 → 1,048,576
// n=30 → 1,073,741,824

${t('chapterContent.chapter7.codeComment8')}
function paperThickness(folds) {
  const initial = 0.1; // mm
  return initial * Math.pow(2, folds);
}
${t('chapterContent.chapter7.codeComment9', { count: folds, thickness: formatThickness() })}`}</code>
        </pre>
      </div>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-red-400 to-orange-500 rounded-2xl p-6 text-white">
        <h4 className="text-lg font-semibold mb-2">{t('chapterContent.common.keyInsight')}</h4>
        <p className="opacity-90">
          {t('chapterContent.chapter7.keyInsightDesc')}
        </p>
      </div>
    </div>
  );
};

export default Chapter7Content;
