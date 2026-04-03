import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Cpu, Play, RotateCcw, TrendingDown, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface DataPoint {
  x: number;
  y: number;
  label: 0 | 1;
}

const ChapterAppendixContent = () => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<DataPoint[]>([
    { x: 0.3, y: 0.3, label: 0 },
    { x: 0.4, y: 0.2, label: 0 },
    { x: 0.2, y: 0.4, label: 0 },
    { x: 0.7, y: 0.7, label: 1 },
    { x: 0.8, y: 0.6, label: 1 },
    { x: 0.6, y: 0.8, label: 1 },
  ]);
  const [weights, setWeights] = useState({ w0: 0, w1: 0, w2: 0 });
  const [isTraining, setIsTraining] = useState(false);
  const [learningRate, setLearningRate] = useState(0.1);
  const [epochs, setEpochs] = useState(0);
  const [loss, setLoss] = useState(0);
  const [addingLabel, setAddingLabel] = useState<0 | 1>(0);
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Perceptron prediction
  const predict = useCallback((x: number, y: number) => {
    const sum = weights.w0 + weights.w1 * x + weights.w2 * y;
    return sum >= 0 ? 1 : 0;
  }, [weights]);

  // Calculate loss
  const calculateLoss = useCallback(() => {
    let totalLoss = 0;
    points.forEach((point) => {
      const prediction = predict(point.x, point.y);
      if (prediction !== point.label) {
        totalLoss += 1;
      }
    });
    return totalLoss;
  }, [points, predict]);

  // Draw canvas
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

    // Draw grid
    ctx.strokeStyle = '#E5E5E5';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const pos = (i / 10) * rect.width;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, rect.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(rect.width, pos);
      ctx.stroke();
    }

    // Draw decision boundary - only when weights are meaningful
    if (weights.w2 !== 0) {
      const x1 = 0;
      const y1 = (-weights.w0 - weights.w1 * x1) / weights.w2;
      const x2 = 1;
      const y2 = (-weights.w0 - weights.w1 * x2) / weights.w2;

      // Only draw if coordinates are finite (no NaN/Infinity artifacts)
      if (isFinite(y1) && isFinite(y2)) {
        ctx.strokeStyle = '#F4D03F';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x1 * rect.width, (1 - y1) * rect.height);
        ctx.lineTo(x2 * rect.width, (1 - y2) * rect.height);
        ctx.stroke();
      }
    }

    // Draw regions
    ctx.fillStyle = 'rgba(244, 208, 63, 0.1)';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw points
    points.forEach((point) => {
      const x = point.x * rect.width;
      const y = (1 - point.y) * rect.height;

      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = point.label === 1 ? '#F4D03F' : '#60A5FA';
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Prediction indicator
      const prediction = predict(point.x, point.y);
      if (prediction === point.label) {
        ctx.fillStyle = '#22C55E';
        ctx.font = '12px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✓', x, y - 15);
      } else {
        ctx.fillStyle = '#EF4444';
        ctx.font = '12px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✗', x, y - 15);
      }
    });

    // Update loss
    setLoss(calculateLoss());
  }, [points, weights, predict, calculateLoss]);

  // Training
  const train = () => {
    if (isTraining) return;
    setIsTraining(true);

    let currentEpoch = 0;
    const maxEpochs = 500;

    animationRef.current = setInterval(() => {
      if (currentEpoch >= maxEpochs) {
        stopTraining();
        return;
      }

      let converged = false;

      setWeights((prevWeights) => {
        const w = { ...prevWeights };
        let hasError = false;

        points.forEach((point) => {
          const sum = w.w0 + w.w1 * point.x + w.w2 * point.y;
          const prediction = sum >= 0 ? 1 : 0;
          const error = point.label - prediction;

          if (error !== 0) {
            hasError = true;
            w.w0 += learningRate * error;
            w.w1 += learningRate * error * point.x;
            w.w2 += learningRate * error * point.y;
          }
        });

        // Check convergence: all points classified correctly?
        if (!hasError) {
          converged = true;
        }

        return w;
      });

      currentEpoch++;
      setEpochs(currentEpoch);

      if (converged) {
        stopTraining();
        return;
      }
    }, 100);
  };

  const stopTraining = () => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }
    setIsTraining(false);
  };

  const reset = () => {
    stopTraining();
    setWeights({ w0: 0, w1: 0, w2: 0 });
    setEpochs(0);
    setPoints([
      { x: 0.3, y: 0.3, label: 0 },
      { x: 0.4, y: 0.2, label: 0 },
      { x: 0.2, y: 0.4, label: 0 },
      { x: 0.7, y: 0.7, label: 1 },
      { x: 0.8, y: 0.6, label: 1 },
      { x: 0.6, y: 0.8, label: 1 },
    ]);
  };

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1 - (e.clientY - rect.top) / rect.height;

    setPoints([...points, { x, y, label: addingLabel }]);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-violet-50 rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Cpu className="w-5 h-5" />
          {t('chapterContent.appendix.title')}
        </h4>
        <p className="text-gray-700">
          {t('chapterContent.appendix.coreConceptDesc')}
        </p>
      </div>

      {/* Perceptron Visualization */}
      <div className="bg-white border rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-4">{t('chapterContent.appendix.perceptronTitle')}</h4>
        <p className="text-sm text-gray-600 mb-4">
          {t('chapterContent.appendix.perceptronDesc')}
        </p>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant={addingLabel === 0 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAddingLabel(0)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {t('chapterContent.appendix.addBlue')}
            </Button>
            <Button
              variant={addingLabel === 1 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAddingLabel(1)}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              {t('chapterContent.appendix.addYellow')}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={train} disabled={isTraining}>
              <Play className="w-4 h-4 mr-2" />
              {isTraining ? t('chapterContent.appendix.training') : t('chapterContent.appendix.startTraining')}
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              {t('chapterContent.common.reset')}
            </Button>
          </div>
        </div>

        {/* Learning rate */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            {t('chapterContent.appendix.learningRate')}: {learningRate}
          </label>
          <Slider
            value={[learningRate]}
            onValueChange={(value) => setLearningRate(value[0])}
            min={0.01}
            max={0.5}
            step={0.01}
          />
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full bg-gray-50 rounded-xl cursor-crosshair"
          style={{ width: '100%', height: '350px' }}
        />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-sm text-gray-500">{t('chapterContent.appendix.epochs')}</div>
            <div className="text-xl font-mono font-bold">{epochs}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-sm text-gray-500">{t('chapterContent.appendix.errors')}</div>
            <div className={`text-xl font-mono font-bold ${loss === 0 ? 'text-green-500' : 'text-red-500'}`}>
              {loss}
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-sm text-gray-500">{t('chapterContent.appendix.accuracy')}</div>
            <div className="text-xl font-mono font-bold">
              {((points.length - loss) / points.length * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Weights Display */}
      <div className="bg-white border rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          {t('chapterContent.appendix.currentWeights')}
        </h4>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-violet-50 rounded-xl p-4 text-center">
            <div className="text-sm text-gray-500 mb-1">{t('chapterContent.appendix.bias')} w₀</div>
            <div className="text-2xl font-mono font-bold text-violet-600">
              {weights.w0.toFixed(3)}
            </div>
          </div>
          <div className="bg-pink-50 rounded-xl p-4 text-center">
            <div className="text-sm text-gray-500 mb-1">{t('chapterContent.appendix.weight')} w₁</div>
            <div className="text-2xl font-mono font-bold text-pink-600">
              {weights.w1.toFixed(3)}
            </div>
          </div>
          <div className="bg-cyan-50 rounded-xl p-4 text-center">
            <div className="text-sm text-gray-500 mb-1">{t('chapterContent.appendix.weight')} w₂</div>
            <div className="text-2xl font-mono font-bold text-cyan-600">
              {weights.w2.toFixed(3)}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
          <div className="font-mono text-center">
            {t('chapterContent.appendix.decisionBoundary')} {weights.w0.toFixed(2)} + {weights.w1.toFixed(2)}x + {weights.w2.toFixed(2)}y = 0
          </div>
        </div>
      </div>

      {/* Gradient Descent */}
      <div className="bg-white border rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingDown className="w-5 h-5" />
          {t('chapterContent.appendix.gradientDescent')}
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          {t('chapterContent.appendix.gradientDescentDesc')}
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              1
            </div>
            <div>
              <div className="font-semibold">{t('chapterContent.appendix.forward')}</div>
              <div className="text-sm text-gray-600">{t('chapterContent.appendix.forwardDesc')}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              2
            </div>
            <div>
              <div className="font-semibold">{t('chapterContent.appendix.calcError')}</div>
              <div className="text-sm text-gray-600">{t('chapterContent.appendix.errorDesc')}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              3
            </div>
            <div>
              <div className="font-semibold">{t('chapterContent.appendix.updateWeights')}</div>
              <div className="text-sm text-gray-600">{t('chapterContent.appendix.updateDesc')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Neural Network */}
      <div className="bg-white border rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-4">{t('chapterContent.appendix.neuralNetwork')}</h4>
        <p className="text-sm text-gray-600 mb-4">
          {t('chapterContent.appendix.neuralNetworkDesc')}
        </p>

        <div className="flex justify-center">
          <svg viewBox="0 0 400 200" className="w-full max-w-md">
            {/* Input layer */}
            <circle cx="50" cy="50" r="20" fill="#60A5FA" />
            <text x="50" y="55" textAnchor="middle" fill="white" fontSize="12">x₁</text>
            <circle cx="50" cy="150" r="20" fill="#60A5FA" />
            <text x="50" y="155" textAnchor="middle" fill="white" fontSize="12">x₂</text>

            {/* Hidden layer */}
            <circle cx="200" cy="50" r="20" fill="#F4D03F" />
            <circle cx="200" cy="100" r="20" fill="#F4D03F" />
            <circle cx="200" cy="150" r="20" fill="#F4D03F" />

            {/* Output layer */}
            <circle cx="350" cy="100" r="20" fill="#A78BFA" />
            <text x="350" y="105" textAnchor="middle" fill="white" fontSize="12">y</text>

            {/* Connections */}
            <line x1="70" y1="50" x2="180" y2="50" stroke="#ccc" strokeWidth="2" />
            <line x1="70" y1="50" x2="180" y2="100" stroke="#ccc" strokeWidth="2" />
            <line x1="70" y1="50" x2="180" y2="150" stroke="#ccc" strokeWidth="2" />
            <line x1="70" y1="150" x2="180" y2="50" stroke="#ccc" strokeWidth="2" />
            <line x1="70" y1="150" x2="180" y2="100" stroke="#ccc" strokeWidth="2" />
            <line x1="70" y1="150" x2="180" y2="150" stroke="#ccc" strokeWidth="2" />

            <line x1="220" y1="50" x2="330" y2="100" stroke="#ccc" strokeWidth="2" />
            <line x1="220" y1="100" x2="330" y2="100" stroke="#ccc" strokeWidth="2" />
            <line x1="220" y1="150" x2="330" y2="100" stroke="#ccc" strokeWidth="2" />

            {/* Labels */}
            <text x="50" y="190" textAnchor="middle" fontSize="12" fill="#666">{t('chapterContent.appendix.inputLayer')}</text>
            <text x="200" y="190" textAnchor="middle" fontSize="12" fill="#666">{t('chapterContent.appendix.hiddenLayer')}</text>
            <text x="350" y="190" textAnchor="middle" fontSize="12" fill="#666">{t('chapterContent.appendix.outputLayer')}</text>
          </svg>
        </div>
      </div>

      {/* Code Example */}
      <div className="bg-gray-900 rounded-2xl p-6 text-white">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full" />
          {t('chapterContent.common.codeImplementation')}
        </h4>
        <pre className="font-mono text-sm overflow-x-auto">
          <code>{`${t('chapterContent.appendix.codeComment1')}

class Perceptron {
  constructor(learningRate = 0.1) {
    ${t('chapterContent.appendix.codeComment2')}
    this.weights = {
      w0: Math.random() - 0.5,  ${t('chapterContent.appendix.codeComment3')}
      w1: Math.random() - 0.5,  ${t('chapterContent.appendix.codeComment4')}
      w2: Math.random() - 0.5   ${t('chapterContent.appendix.codeComment5')}
    };
    this.learningRate = learningRate;
  }

  ${t('chapterContent.appendix.codeComment6')}
  predict(x, y) {
    const sum = this.weights.w0
                + this.weights.w1 * x
                + this.weights.w2 * y;
    return sum >= 0 ? 1 : 0;
  }

  ${t('chapterContent.appendix.codeComment7')}
  train(data, epochs = 100) {
    for (let epoch = 0; epoch < epochs; epoch++) {
      data.forEach(point => {
        const prediction = this.predict(point.x, point.y);
        const error = point.label - prediction;

        ${t('chapterContent.appendix.codeComment8')}
        this.weights.w0 += this.learningRate * error;
        this.weights.w1 += this.learningRate * error * point.x;
        this.weights.w2 += this.learningRate * error * point.y;
      });
    }
  }
}

${t('chapterContent.appendix.codeComment9')}
const perceptron = new Perceptron(0.1);
perceptron.train(trainingData);
const prediction = perceptron.predict(0.5, 0.5);`}</code>
        </pre>
      </div>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 text-white">
        <h4 className="text-lg font-semibold mb-2">{t('chapterContent.common.keyInsight')}</h4>
        <p className="opacity-90">
          {t('chapterContent.appendix.keyInsightDesc')}
        </p>
      </div>
    </div>
  );
};

export default ChapterAppendixContent;
