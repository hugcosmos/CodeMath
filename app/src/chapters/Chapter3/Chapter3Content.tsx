import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Sparkles, Map, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const Chapter3Content = () => {
  const { t } = useTranslation();
  const [days, setDays] = useState<number>(100);
  const [startDay, setStartDay] = useState<number>(1); // Monday
  const [chessBoard, setChessBoard] = useState<boolean[]>(Array(8).fill(false));
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate weekday
  const targetDay = (startDay + days) % 7;

  // Chess magic: calculate parity
  const calculateParity = (board: boolean[]): number => {
    return board.reduce((acc, cell) => {
      return acc ^ (cell ? 1 : 0);
    }, 0);
  };

  const parity = calculateParity(chessBoard);

  // Toggle chess cell
  const toggleChessCell = (index: number) => {
    const newBoard = [...chessBoard];
    newBoard[index] = !newBoard[index];
    setChessBoard(newBoard);
    setFlippedIndex(index);
  };

  // Reset chess board
  const resetChess = () => {
    setChessBoard(Array(8).fill(false));
    setFlippedIndex(null);
  };

  // Randomize chess board
  const randomizeChess = () => {
    const newBoard = Array(8).fill(false).map(() => Math.random() > 0.5);
    setChessBoard(newBoard);
    setFlippedIndex(null);
  };

  // Seven Bridges state
  // Real topology: island A, north B, south C, east D
  // Bridges: A-B (2), A-C (2), A-D (1), B-D (1), C-D (1)
  const [bridges] = useState([
    { id: 0, from: 'A', to: 'B', label: '1' },
    { id: 1, from: 'A', to: 'B', label: '2' },
    { id: 2, from: 'A', to: 'C', label: '3' },
    { id: 3, from: 'A', to: 'C', label: '4' },
    { id: 4, from: 'A', to: 'D', label: '5' },
    { id: 5, from: 'B', to: 'D', label: '6' },
    { id: 6, from: 'C', to: 'D', label: '7' },
  ]);
  const [crossedBridges, setCrossedBridges] = useState<Set<number>>(new Set());
  const [currentRegion, setCurrentRegion] = useState<string | null>(null);
  const [path, setPath] = useState<string[]>([]);
  const [bridgeMessage, setBridgeMessage] = useState<string>('resetBridges');

  const regionDegrees: Record<string, number> = { A: 5, B: 3, C: 3, D: 3 };

  const resetBridges = () => {
    setCrossedBridges(new Set());
    setCurrentRegion(null);
    setPath([]);
    setBridgeMessage('resetBridges');
  };

  const handleRegionClick = (region: string) => {
    if (currentRegion === null) {
      setCurrentRegion(region);
      setPath([region]);
      setBridgeMessage(`${t('chapterContent.chapter3.currentAt')} ${region} ${t('chapterContent.chapter3.clickBridge')}`);
      return;
    }
    if (currentRegion === region) {
      setBridgeMessage(`${t('chapterContent.chapter3.alreadyAt')} ${region} ${t('chapterContent.chapter3.regionSuffix')}`);
      return;
    }
    // Find an uncrossed bridge between currentRegion and region
    const available = bridges.find(
      (b) =>
        !crossedBridges.has(b.id) &&
        ((b.from === currentRegion && b.to === region) ||
          (b.to === currentRegion && b.from === region))
    );
    if (!available) {
      setBridgeMessage(`${t('chapterContent.chapter3.noBridge')} ${currentRegion} → ${region}`);
      return;
    }
    const newCrossed = new Set(crossedBridges);
    newCrossed.add(available.id);
    setCrossedBridges(newCrossed);
    setCurrentRegion(region);
    setPath([...path, `${t('chapterContent.chapter3.bridgeChar')}${available.label}`, region]);

    if (newCrossed.size === 7) {
      setBridgeMessage('impossible');
    } else {
      setBridgeMessage(`${t('chapterContent.chapter3.crossedBridge')}${available.label} → ${region}${t('chapterContent.chapter3.region')} (${t('chapterContent.chapter3.crossed')} ${newCrossed.size}/7)`);
    }
  };

  // Draw seven bridges visualization
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

    // Real topology: island A in center, B north, C south, D east
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const regions: Record<string, { x: number; y: number; label: string }> = {
      A: { x: cx - 80, y: cy, label: t('chapterContent.chapter3.regionA') },
      B: { x: cx - 80, y: cy - 90, label: t('chapterContent.chapter3.regionB') },
      C: { x: cx - 80, y: cy + 90, label: t('chapterContent.chapter3.regionC') },
      D: { x: cx + 100, y: cy, label: t('chapterContent.chapter3.regionD') },
    };

    // Draw river (blue background strip)
    ctx.fillStyle = 'rgba(96, 165, 250, 0.15)';
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = 'rgba(96, 165, 250, 0.2)';
    ctx.beginPath();
    ctx.moveTo(0, cy - 30);
    ctx.bezierCurveTo(cx * 0.3, cy - 50, cx * 0.6, cy - 10, cx, cy - 20);
    ctx.bezierCurveTo(cx * 1.3, cy - 30, rect.width, cy - 40, rect.width, cy - 30);
    ctx.lineTo(rect.width, cy + 30);
    ctx.bezierCurveTo(cx * 1.3, cy + 40, cx * 0.6, cy + 10, cx, cy + 20);
    ctx.bezierCurveTo(cx * 0.3, cy + 50, 0, cy + 30, 0, cy + 30);
    ctx.closePath();
    ctx.fill();

    // Bridge paths with offsets for parallel bridges
    const bridgePaths = [
      { id: 0, from: 'A', to: 'B', offsetY: -12 },  // A-B bridge 1
      { id: 1, from: 'A', to: 'B', offsetY: 12 },   // A-B bridge 2
      { id: 2, from: 'A', to: 'C', offsetY: -12 },  // A-C bridge 3
      { id: 3, from: 'A', to: 'C', offsetY: 12 },   // A-C bridge 4
      { id: 4, from: 'A', to: 'D', offsetY: 0 },    // A-D bridge 5
      { id: 5, from: 'B', to: 'D', offsetY: -8 },   // B-D bridge 6
      { id: 6, from: 'C', to: 'D', offsetY: 8 },    // C-D bridge 7
    ];

    bridgePaths.forEach((bp) => {
      const r1 = regions[bp.from];
      const r2 = regions[bp.to];
      const dx = r2.x - r1.x;
      const dy = r2.y - r1.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const nx = -dy / len;
      const ny = dx / len;

      const x1 = r1.x + nx * bp.offsetY + (dx / len) * 28;
      const y1 = r1.y + ny * bp.offsetY + (dy / len) * 28;
      const x2 = r2.x + nx * bp.offsetY - (dx / len) * 28;
      const y2 = r2.y + ny * bp.offsetY - (dy / len) * 28;

      const isCrossed = crossedBridges.has(bp.id);

      ctx.strokeStyle = isCrossed ? '#34D399' : '#F4D03F';
      ctx.lineWidth = isCrossed ? 4 : 5;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Bridge number label
      const mx = (x1 + x2) / 2 + nx * 8;
      const my = (y1 + y2) / 2 + ny * 8;
      ctx.fillStyle = isCrossed ? '#34D399' : '#F4D03F';
      ctx.font = 'bold 11px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(bp.id + 1 + '', mx, my);
    });

    // Draw regions
    Object.entries(regions).forEach(([key, region]) => {
      const isCurrent = currentRegion === key;

      ctx.beginPath();
      ctx.arc(region.x, region.y, isCurrent ? 28 : 24, 0, Math.PI * 2);
      ctx.fillStyle = isCurrent ? '#F4D03F' : '#333';
      ctx.fill();

      if (isCurrent) {
        ctx.strokeStyle = '#E5B800';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 18px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(key, region.x, region.y);

      // Region description below
      ctx.fillStyle = '#666';
      ctx.font = '10px "Inter", sans-serif';
      ctx.fillText(
        key === 'A' ? t('chapterContent.chapter3.regionIsland') : key === 'B' ? t('chapterContent.chapter3.regionNorth') : key === 'C' ? t('chapterContent.chapter3.regionSouth') : t('chapterContent.chapter3.regionEast'),
        region.x,
        region.y + 38
      );
    });

    // Title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 13px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t('chapterContent.chapter3.canvasTitle'), rect.width / 2, 18);
    ctx.fillStyle = '#999';
    ctx.font = '11px "Inter", sans-serif';
    ctx.fillText(t('chapterContent.chapter3.canvasHint'), rect.width / 2, rect.height - 20);
  }, [currentRegion, crossedBridges, bridges, t]);

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-emerald-50 rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {t('chapterContent.common.coreConcept')}
        </h4>
        <p className="text-gray-700">
          {t('chapterContent.chapter3.coreConceptDesc')}
        </p>
      </div>

      {/* Weekday Calculator */}
      <div className="bg-white border rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          {t('chapterContent.chapter3.weekdayCalculator')}
        </h4>
        <p className="text-sm text-gray-600 mb-6">
          {t('chapterContent.chapter3.weekdayDesc')}
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">{t('chapterContent.chapter3.startDay')}</label>
            <div className="flex flex-wrap gap-2">
              {weekdays.map((day, index) => (
                <Button
                  key={day}
                  variant={startDay === index ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStartDay(index)}
                >
                  {t(`chapterContent.chapter3.${day}`)}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('chapterContent.chapter3.daysPassed')}: <span className="font-mono text-amber-600">{days}</span> {t('chapterContent.chapter3.days')}
            </label>
            <Slider
              value={[days]}
              onValueChange={(value) => setDays(value[0])}
              min={0}
              max={365}
              step={1}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{t('chapterContent.chapter3.sliderMin')}</span>
              <span>{t('chapterContent.chapter3.sliderMax')}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <div className="text-sm text-gray-500 mb-2">{t('chapterContent.chapter3.result')}</div>
            <div className="text-3xl font-bold text-amber-500">
              {t(`chapterContent.chapter3.${weekdays[targetDay]}`)}
            </div>
            <div className="text-sm text-gray-400 mt-2 font-mono">
              ({startDay} + {days}) % 7 = {targetDay}
            </div>
          </div>
        </div>
      </div>

      {/* Chess Magic */}
      <div className="bg-white border rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          {t('chapterContent.chapter3.chessMagic')}
        </h4>
        <p className="text-sm text-gray-600 mb-6">
          {t('chapterContent.chapter3.chessMagicDesc')}
        </p>

        <div className="flex justify-center mb-6">
          <div className="grid grid-cols-4 gap-3">
            {chessBoard.map((isBlack, index) => (
              <button
                key={index}
                onClick={() => toggleChessCell(index)}
                className={`w-16 h-16 rounded-xl transition-all duration-300 ${
                  isBlack
                    ? 'bg-gray-800 shadow-inner'
                    : 'bg-gray-100 shadow-md'
                } ${flippedIndex === index ? 'ring-4 ring-amber-400' : ''}`}
              >
                <span className={`text-2xl ${isBlack ? 'text-white' : 'text-gray-400'}`}>
                  {isBlack ? '●' : '○'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={randomizeChess}>
            {t('chapterContent.chapter3.randomize')}
          </Button>
          <Button variant="outline" size="sm" onClick={resetChess}>
            {t('chapterContent.common.reset')}
          </Button>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-500">{t('chapterContent.chapter3.parity')}:</span>
              <span className={`ml-2 text-2xl font-mono font-bold ${parity ? 'text-amber-500' : 'text-gray-400'}`}>
                {parity}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {t('chapterContent.chapter3.blackPieces')}: {chessBoard.filter(Boolean).length} {' '}
              {chessBoard.filter(Boolean).length % 2 === 0 ? `(${t('chapterContent.chapter3.even')})` : `(${t('chapterContent.chapter3.odd')})`}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {t('chapterContent.chapter3.parityDesc')}
          </p>
        </div>
      </div>

      {/* Seven Bridges */}
      <div className="bg-white border rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Map className="w-5 h-5" />
          {t('chapterContent.chapter3.sevenBridges')}
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          {t('chapterContent.chapter3.sevenBridgesDesc')}
        </p>

        <canvas
          ref={canvasRef}
          className="w-full bg-gray-50 rounded-xl"
          style={{ width: '100%', height: '320px' }}
        />

        {/* Clickable region buttons */}
        <div className="mt-4 flex justify-center gap-3">
          {['A', 'B', 'C', 'D'].map((region) => (
            <Button
              key={region}
              variant={currentRegion === region ? 'default' : 'outline'}
              onClick={() => handleRegionClick(region)}
            >
              {region} {t(`chapterContent.chapter3.region${region}`)}
            </Button>
          ))}
        </div>

        {/* Status */}
        <div className="mt-3 text-center text-sm text-gray-600">
          {bridgeMessage === 'impossible' ? t('chapterContent.chapter3.impossible') : 
           bridgeMessage === 'resetBridges' ? t('chapterContent.chapter3.resetBridges') : 
           bridgeMessage}
        </div>

        {/* Path display */}
        {path.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-1 text-xs">
            {path.map((step, i) => (
              <span key={i} className={
                step.startsWith(t('chapterContent.chapter3.crossedBridge'))
                  ? 'text-amber-500 font-mono'
                  : 'bg-gray-100 px-2 py-0.5 rounded font-mono font-bold'
              }>
                {step}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex justify-center">
          <Button variant="outline" size="sm" onClick={resetBridges}>
            {t('chapterContent.chapter3.retry')}
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2 text-center text-sm">
          {Object.entries(regionDegrees).map(([region, degree]) => (
            <div key={region} className={`rounded-lg p-2 ${degree % 2 === 1 ? 'bg-red-50' : 'bg-gray-50'}`}>
              <div className="font-bold">{region}{t('chapterContent.chapter3.region')}</div>
              <div className={`text-sm ${degree % 2 === 1 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                {degree}{t('chapterContent.chapter3.bridges')} ({degree % 2 === 1 ? t('chapterContent.chapter3.odd') : t('chapterContent.chapter3.even')})
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-amber-50 rounded-xl">
          <p className="text-sm text-amber-800">
            <strong>{t('chapterContent.chapter3.eulerDiscovery')}:</strong> {t('chapterContent.chapter3.eulerDesc')}
          </p>
        </div>
      </div>

      {/* Code Example */}
      <div className="bg-gray-900 rounded-2xl p-6 text-white">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full" />
          {t('chapterContent.common.codeImplementation')}
        </h4>
        <pre className="font-mono text-sm overflow-x-auto">
          <code>{`${t('chapterContent.chapter3.codeComment1')}

${t('chapterContent.chapter3.codeComment2')}
const days = ${days};
const today = ${startDay}; // ${weekdays[startDay]}
const futureDay = (today + days) % 7; // ${targetDay} = ${weekdays[targetDay]}

${t('chapterContent.chapter3.codeComment3')}
const isEven = (n) => n % 2 === 0;
const isOdd = (n) => n % 2 === 1;

${t('chapterContent.chapter3.codeComment4')}
const items = ['a', 'b', 'c'];
const item = items[index % items.length];

${t('chapterContent.chapter3.codeComment5')}
${t('chapterContent.chapter3.codeComment7')}
const hash = (key) => key.length % 16;

${t('chapterContent.chapter3.codeComment6')}
${t('chapterContent.chapter3.codeComment8')}
const totalItems = 100;
const itemsPerPage = 10;
const totalPages = Math.ceil(totalItems / itemsPerPage); // 10`}</code>
        </pre>
      </div>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl p-6 text-white">
        <h4 className="text-lg font-semibold mb-2">{t('chapterContent.common.keyInsight')}</h4>
        <p className="opacity-90">
          {t('chapterContent.chapter3.keyInsightDesc')}
        </p>
      </div>
    </div>
  );
};

export default Chapter3Content;
