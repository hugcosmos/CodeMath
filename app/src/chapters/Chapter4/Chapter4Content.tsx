import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Layers, Play, Pause, RotateCcw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const Chapter4Content = () => {
  const { t } = useTranslation();
  const [dominoes, setDominoes] = useState<boolean[]>(Array(10).fill(false));
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  const [showError, setShowError] = useState(false);
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Domino falling animation
  const startAnimation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDominoes(Array(10).fill(false));
    setCurrentStep(0);
    setShowError(false);

    let step = 0;
    animationRef.current = setInterval(() => {
      if (step >= 10) {
        stopAnimation();
        return;
      }

      setDominoes((prev) => {
        const newDominoes = [...prev];
        newDominoes[step] = true;
        return newDominoes;
      });
      setCurrentStep(step);
      step++;
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
    setDominoes(Array(10).fill(false));
    setCurrentStep(0);
    setShowError(false);
  };

  // Show the "all horses are the same color" error proof
  const showErrorProof = () => {
    setShowError(true);
    stopAnimation();
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

  // Sum formula: 1 + 2 + ... + n = n(n+1)/2
  const [n, setN] = useState(5);
  const sum = (n * (n + 1)) / 2;
  const manualSum = Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-purple-50 rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Layers className="w-5 h-5" />
          {t('chapterContent.common.coreConcept')}
        </h4>
        <p className="text-gray-700">
          {t('chapterContent.chapter4.coreConceptDesc')}
        </p>
      </div>

      {/* Domino Animation */}
      <div className="bg-white border rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-4">{t('chapterContent.chapter4.dominoTitle')}</h4>
        <p className="text-sm text-gray-600 mb-6">
          {t('chapterContent.chapter4.dominoDesc')}
        </p>

        {/* Dominoes */}
        <div className="flex justify-center items-end gap-2 mb-8 h-40">
          {dominoes.map((isFallen, index) => (
            <div
              key={index}
              className={`relative transition-all duration-300 ${
                isFallen ? 'transform rotate-90 translate-y-4' : ''
              }`}
              style={{
                transitionDelay: `${index * 50}ms`,
              }}
            >
              <div
                className={`w-8 h-24 rounded-lg border-2 flex items-center justify-center ${
                  isFallen
                    ? 'bg-amber-400 border-amber-500'
                    : 'bg-white border-gray-300'
                }`}
              >
                <span className="font-mono font-bold">{index + 1}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          <Button
            onClick={isAnimating ? stopAnimation : startAnimation}
            variant={isAnimating ? 'secondary' : 'default'}
          >
            {isAnimating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isAnimating ? t('chapterContent.chapter4.pause') : t('chapterContent.chapter4.start')}
          </Button>
          <Button variant="outline" onClick={resetAnimation}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t('chapterContent.common.reset')}
          </Button>
        </div>

        {/* Speed Control */}
        <div className="max-w-md mx-auto">
          <label className="block text-sm font-medium mb-2 text-center">
            {t('chapterContent.chapter4.animationSpeed')}: {animationSpeed}ms
          </label>
          <Slider
            value={[animationSpeed]}
            onValueChange={(value) => setAnimationSpeed(value[0])}
            min={100}
            max={1000}
            step={100}
          />
        </div>

        {/* Current Step */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-4 bg-gray-50 rounded-full px-6 py-3">
            <span className="text-gray-600">{t('chapterContent.chapter4.currentStep')}:</span>
            <span className="text-2xl font-mono font-bold text-amber-500">
              {currentStep + 1} / 10
            </span>
          </div>
        </div>
      </div>

      {/* Sum Formula */}
      <div className="bg-white border rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-4">{t('chapterContent.chapter4.sumTitle')}</h4>
        <p className="text-sm text-gray-600 mb-6">
          {t('chapterContent.chapter4.sumDesc')}
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              n = <span className="font-mono text-amber-600">{n}</span>
            </label>
            <Slider
              value={[n]}
              onValueChange={(value) => setN(value[0])}
              min={1}
              max={20}
              step={1}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">{t('chapterContent.chapter4.manualCalc')}</div>
              <div className="font-mono text-lg">
                {Array.from({ length: n }, (_, i) => i + 1).join(' + ')} = {manualSum}
              </div>
            </div>
            <div className="bg-amber-50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">{t('chapterContent.chapter4.formulaCalc')}</div>
              <div className="font-mono text-lg text-amber-600">
                {n} × {n + 1} / 2 = {sum}
              </div>
            </div>
          </div>

          <div className={`text-center p-4 rounded-xl ${sum === manualSum ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {sum === manualSum ? t('chapterContent.chapter4.verifyPass') : t('chapterContent.chapter4.verifyFail')}
          </div>
        </div>

        {/* Proof Steps */}
        <div className="mt-6 space-y-3">
          <h5 className="font-semibold">{t('chapterContent.chapter4.proofTitle')}:</h5>
          <div className="space-y-2 text-sm">
            <div className="p-3 bg-blue-50 rounded-lg">
              <strong>{t('chapterContent.chapter4.baseCase')}</strong>
              <p className="mt-1 text-gray-600">{t('chapterContent.chapter4.baseCaseDesc')}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <strong>{t('chapterContent.chapter4.inductiveHypothesis')}</strong>
              <p className="mt-1 text-gray-600">{t('chapterContent.chapter4.hypothesisDesc')}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <strong>{t('chapterContent.chapter4.inductiveStep')}</strong>
              <p className="mt-1 text-gray-600">{t('chapterContent.chapter4.stepDesc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Proof */}
      <div className="bg-white border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            {t('chapterContent.chapter4.errorProof')}
          </h4>
          <Button variant="outline" size="sm" onClick={showErrorProof}>
            {t('chapterContent.chapter4.viewError')}
          </Button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          {t('chapterContent.chapter4.errorProofDesc')}
        </p>

        {showError && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
              <h5 className="font-semibold text-red-800 mb-2">{t('chapterContent.chapter4.proofTitle2')}</h5>
              <ol className="list-decimal list-inside space-y-2 text-sm text-red-700">
                <li>{t('chapterContent.chapter4.proofBaseCase')}</li>
                <li>{t('chapterContent.chapter4.proofHypothesis')}</li>
                <li>{t('chapterContent.chapter4.proofStep')}</li>
              </ol>
            </div>

            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <h5 className="font-semibold text-green-800 mb-2">{t('chapterContent.chapter4.errorAnalysisTitle')}</h5>
              <p className="text-sm text-green-700">
                {t('chapterContent.chapter4.errorAnalysisDesc')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Code Example */}
      <div className="bg-gray-900 rounded-2xl p-6 text-white">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full" />
          {t('chapterContent.common.codeImplementation')}
        </h4>
        <pre className="font-mono text-sm overflow-x-auto">
          <code>{`${t('chapterContent.chapter4.codeComment1')}

${t('chapterContent.chapter4.codeComment2')}
function sum(n) {
  ${t('chapterContent.chapter4.codeComment3')}
  if (n === 1) return 1;
  ${t('chapterContent.chapter4.codeComment4')}
  return sum(n - 1) + n;
}

${t('chapterContent.chapter4.codeComment5')}
function sumIterative(n) {
  let result = 0;
  for (let i = 1; i <= n; i++) {
    result += i;  ${t('chapterContent.chapter4.codeComment6')}
  }
  return result;
}

${t('chapterContent.chapter4.codeComment7')}
function sumFormula(n) {
  return n * (n + 1) / 2;
}

${t('chapterContent.chapter4.codeComment8')}
console.log(sum(${n}));           // ${sum}
console.log(sumIterative(${n}));  // ${sum}
console.log(sumFormula(${n}));    // ${sum}

${t('chapterContent.chapter4.codeComment9')}
${t('chapterContent.chapter4.codeComment10')}`}</code>
        </pre>
      </div>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-purple-400 to-violet-500 rounded-2xl p-6 text-white">
        <h4 className="text-lg font-semibold mb-2">{t('chapterContent.common.keyInsight')}</h4>
        <p className="opacity-90">
          {t('chapterContent.chapter4.keyInsightDesc')}
        </p>
      </div>
    </div>
  );
};

export default Chapter4Content;
