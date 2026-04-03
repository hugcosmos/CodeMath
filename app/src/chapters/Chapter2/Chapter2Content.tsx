import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Lightbulb, Brain, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface LogicGate {
  name: string;
  symbol: string;
  func: (a: boolean, b: boolean) => boolean;
  description: string;
}

const getGates = (t: (key: string) => string): LogicGate[] => [
  {
    name: 'AND',
    symbol: '∧',
    func: (a, b) => a && b,
    description: t('chapterContent.chapter2.gateAnd'),
  },
  {
    name: 'OR',
    symbol: '∨',
    func: (a, b) => a || b,
    description: t('chapterContent.chapter2.gateOr'),
  },
  {
    name: 'XOR',
    symbol: '⊕',
    func: (a, b) => a !== b,
    description: t('chapterContent.chapter2.gateXor'),
  },
  {
    name: 'NAND',
    symbol: '↑',
    func: (a, b) => !(a && b),
    description: t('chapterContent.chapter2.gateNand'),
  },
  {
    name: 'NOR',
    symbol: '↓',
    func: (a, b) => !(a || b),
    description: t('chapterContent.chapter2.gateNor'),
  },
];

const Chapter2Content = () => {
  const { t } = useTranslation();
  const gates = getGates(t);
  const [inputA, setInputA] = useState<boolean>(false);
  const [inputB, setInputB] = useState<boolean>(false);
  const [selectedGate, setSelectedGate] = useState<LogicGate>(gates[0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const output = selectedGate.func(inputA, inputB);

  // Draw circuit visualization
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

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Draw input A line
    ctx.beginPath();
    ctx.moveTo(50, centerY - 40);
    ctx.lineTo(centerX - 60, centerY - 40);
    ctx.lineTo(centerX - 40, centerY - 20);
    ctx.strokeStyle = inputA ? '#F4D03F' : '#E5E5E5';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw input B line
    ctx.beginPath();
    ctx.moveTo(50, centerY + 40);
    ctx.lineTo(centerX - 60, centerY + 40);
    ctx.lineTo(centerX - 40, centerY + 20);
    ctx.strokeStyle = inputB ? '#F4D03F' : '#E5E5E5';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw gate body
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(centerX - 40, centerY + 50);
    ctx.lineTo(centerX - 40, centerY - 50);
    ctx.closePath();
    ctx.fillStyle = '#F8F8F8';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw gate name
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(selectedGate.name, centerX + 10, centerY);

    // Draw output line
    ctx.beginPath();
    ctx.moveTo(centerX + 50, centerY);
    ctx.lineTo(rect.width - 50, centerY);
    ctx.strokeStyle = output ? '#F4D03F' : '#E5E5E5';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw input indicators
    ctx.beginPath();
    ctx.arc(30, centerY - 40, 8, 0, Math.PI * 2);
    ctx.fillStyle = inputA ? '#F4D03F' : '#E5E5E5';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(30, centerY + 40, 8, 0, Math.PI * 2);
    ctx.fillStyle = inputB ? '#F4D03F' : '#E5E5E5';
    ctx.fill();

    // Draw output indicator
    ctx.beginPath();
    ctx.arc(rect.width - 30, centerY, 12, 0, Math.PI * 2);
    ctx.fillStyle = output ? '#F4D03F' : '#E5E5E5';
    ctx.fill();

    // Glow effect for output
    if (output) {
      ctx.beginPath();
      ctx.arc(rect.width - 30, centerY, 20, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(244, 208, 63, 0.3)';
      ctx.fill();
    }

    // Draw labels (after indicators so they render on top)
    ctx.font = 'bold 12px "Fira Code", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // A label: above the A dot
    ctx.fillStyle = inputA ? '#F4D03F' : '#666';
    ctx.fillText('A', 30, centerY - 57);

    // B label: below the B dot
    ctx.fillStyle = inputB ? '#F4D03F' : '#666';
    ctx.fillText('B', 30, centerY + 57);

    // OUT label: above the output dot
    ctx.fillStyle = output ? '#F4D03F' : '#666';
    ctx.fillText('OUT', rect.width - 30, centerY - 22);
  }, [inputA, inputB, output, selectedGate]);

  // Generate truth table
  const truthTable = [
    { a: false, b: false },
    { a: false, b: true },
    { a: true, b: false },
    { a: true, b: true },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Introduction */}
      <div className="bg-blue-50 rounded-2xl p-5">
        <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Brain className="w-5 h-5" />
          {t('chapterContent.common.coreConcept')}
        </h4>
        <p className="text-gray-700 leading-relaxed">
          {t('chapterContent.chapter2.coreConceptDesc')}
        </p>
      </div>

      {/* Gate Selector */}
      <div className="bg-white border rounded-2xl p-5">
        <h4 className="text-base font-semibold mb-3">{t('chapterContent.chapter2.selectGate')}</h4>
        <div className="flex flex-wrap gap-2">
          {gates.map((gate) => (
            <Button
              key={gate.name}
              variant={selectedGate.name === gate.name ? 'default' : 'outline'}
              onClick={() => setSelectedGate(gate)}
              className="font-mono"
            >
              {gate.name}
            </Button>
          ))}
        </div>
        <p className="mt-3 text-sm text-gray-600">{selectedGate.description}</p>
      </div>

      {/* Circuit Visualization */}
      <div className="bg-white border rounded-2xl p-5">
        <h4 className="text-base font-semibold mb-3">{t('chapterContent.chapter2.circuitVisualization')}</h4>

        {/* Controls */}
        <div className="flex justify-center gap-8 mb-4">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-sm">{t('chapterContent.chapter2.inputA')}</span>
            <Switch
              checked={inputA}
              onCheckedChange={setInputA}
            />
            <span className={`font-mono text-sm ${inputA ? 'text-amber-500' : 'text-gray-400'}`}>
              {inputA ? '1' : '0'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-sm">{t('chapterContent.chapter2.inputB')}</span>
            <Switch
              checked={inputB}
              onCheckedChange={setInputB}
            />
            <span className={`font-mono text-sm ${inputB ? 'text-amber-500' : 'text-gray-400'}`}>
              {inputB ? '1' : '0'}
            </span>
          </div>
        </div>

        {/* Circuit Canvas */}
        <div className="mx-auto" style={{ maxWidth: '480px' }}>
          <canvas
            ref={canvasRef}
            className="w-full"
            style={{ width: '100%', height: '180px' }}
          />
        </div>

        {/* Output Display */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-3 bg-gray-50 rounded-full px-5 py-2.5">
            <span className="text-gray-600 text-sm">{t('chapterContent.chapter2.output')}:</span>
            <Lightbulb
              className={`w-6 h-6 transition-all duration-300 ${
                output ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
              }`}
            />
            <span className={`text-xl font-mono font-bold ${output ? 'text-amber-500' : 'text-gray-400'}`}>
              {output ? `1 (${t('chapterContent.chapter2.true')})` : `0 (${t('chapterContent.chapter2.false')})`}
            </span>
          </div>
        </div>
      </div>

      {/* Truth Table */}
      <div className="bg-white border rounded-2xl p-5">
        <h4 className="text-base font-semibold mb-3 flex items-center gap-2">
          <Table className="w-4 h-4" />
          {t('chapterContent.chapter2.truthTable')}
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2.5 px-4 text-left font-mono text-sm">A</th>
                <th className="py-2.5 px-4 text-left font-mono text-sm">B</th>
                <th className="py-2.5 px-4 text-left font-mono text-sm">A {selectedGate.symbol} B</th>
              </tr>
            </thead>
            <tbody>
              {truthTable.map((row, index) => {
                const rowOutput = selectedGate.func(row.a, row.b);
                const isCurrentRow = row.a === inputA && row.b === inputB;

                return (
                  <tr
                    key={index}
                    className={`border-b last:border-b-0 transition-colors ${
                      isCurrentRow ? 'bg-amber-50' : ''
                    }`}
                  >
                    <td className="py-2.5 px-4 font-mono text-sm">{row.a ? '1' : '0'}</td>
                    <td className="py-2.5 px-4 font-mono text-sm">{row.b ? '1' : '0'}</td>
                    <td className="py-2.5 px-4 font-mono text-sm font-bold">
                      <span className={rowOutput ? 'text-amber-500' : 'text-gray-400'}>
                        {rowOutput ? '1' : '0'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Example */}
      <div className="bg-gray-900 rounded-2xl p-5 text-white">
        <h4 className="text-base font-semibold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full" />
          {t('chapterContent.common.codeImplementation')}
        </h4>
        <pre className="font-mono text-sm overflow-x-auto leading-relaxed">
          <code>{`// ${selectedGate.name} ${t('chapterContent.chapter2.selectGate')}
const A = ${inputA};
const B = ${inputB};

const result = A ${
  selectedGate.name === 'AND' ? '&&' :
  selectedGate.name === 'OR' ? '||' :
  selectedGate.name === 'XOR' ? '!==' :
  selectedGate.name === 'NAND' ? '&& !(...)' :
  '|| !(...)'
} B;  // ${output}

// Permission check
const hasReadPermission = true;
const hasWritePermission = false;
const canEdit = hasReadPermission && hasWritePermission;  // false

if (isLoggedIn && isAdmin) {
  showAdminPanel();
}`}</code>
        </pre>
      </div>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl p-5 text-white">
        <h4 className="text-base font-semibold mb-2">{t('chapterContent.common.keyInsight')}</h4>
        <p className="opacity-90 leading-relaxed">
          {t('chapterContent.chapter2.keyInsightDesc')}
        </p>
      </div>
    </div>
  );
};

export default Chapter2Content;
