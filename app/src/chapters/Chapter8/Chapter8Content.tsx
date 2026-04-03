import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Play, RotateCcw, Code, Infinity, FastForward, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const getExamplePrograms = (t: (key: string) => string): Record<string, { name: string; code: string }> => ({
  simple: {
    name: t('chapterContent.chapter8.exampleSimple'),
    code: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

factorial(5);`,
  },
  loop: {
    name: t('chapterContent.chapter8.exampleLoop'),
    code: `function infiniteLoop() {
  while (true) {
    console.log('never stops...');
  }
}

infiniteLoop();`,
  },
  collatz: {
    name: t('chapterContent.chapter8.exampleCollatz'),
    code: `function collatz(n) {
  if (n === 1) return 1;
  if (n % 2 === 0) return collatz(n / 2);
  return collatz(3 * n + 1);
}

// Try n = 27
collatz(27);`,
  },
});

const Chapter8Content = () => {
  const { t } = useTranslation();
  const [code, setCode] = useState(getExamplePrograms(() => '').simple.code);
  const examplePrograms = getExamplePrograms(t);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [detectedResult, setDetectedResult] = useState<'halt' | 'loop' | 'collatz' | 'unknown' | null>(null);

  // Collatz visualizer state
  const [collatzInput, setCollatzInput] = useState(27);
  const [collatzSteps, setCollatzSteps] = useState<number[]>([]);
  const [collatzRunning, setCollatzRunning] = useState(false);

  // Diagonal argument state
  const [gridSize, setGridSize] = useState(5);
  const [grid, setGrid] = useState<number[][]>([]);
  const [highlightDiag, setHighlightDiag] = useState(false);
  const [showNewNumber, setShowNewNumber] = useState(false);
  const [diagonalDigits, setDiagonalDigits] = useState<number[]>([]);
  const [newDigits, setNewDigits] = useState<number[]>([]);

  // Turing machine state
  const [tapeInput, setTapeInput] = useState('1011');
  const [tape, setTape] = useState<string[]>([]);
  const [headPos, setHeadPos] = useState(0);
  const [tmState, setTmState] = useState('q0');
  const [stepCount, setStepCount] = useState(0);
  const [tmHalted, setTmHalted] = useState(false);
  const [tmExample, setTmExample] = useState(0);

  // Binary incrementer transitions
  const tmExamples = [
    {
      name: t('chapterContent.chapter8.tmBinary'),
      desc: t('chapterContent.chapter8.tmBinaryShortDesc'),
      blank: '_',
      start: 'q0',
      accept: 'qAccept',
      transitions: [
        { from: 'q0', read: '0', to: 'q0', write: '0', move: 'R' },
        { from: 'q0', read: '1', to: 'q0', write: '1', move: 'R' },
        { from: 'q0', read: '_', to: 'q1', write: '_', move: 'L' },
        { from: 'q1', read: '0', to: 'qAccept', write: '1', move: 'R' },
        { from: 'q1', read: '1', to: 'q1', write: '0', move: 'L' },
      ],
    },
    {
      name: t('chapterContent.chapter8.tmZeroOne'),
      desc: t('chapterContent.chapter8.tmZeroOneShortDesc'),
      blank: '_',
      start: 'q0',
      accept: 'qAccept',
      transitions: [
        // q0: skip already-matched Xs, find next 0 to mark
        { from: 'q0', read: 'X', to: 'q0', write: 'X', move: 'R' },
        { from: 'q0', read: '0', to: 'q1', write: 'X', move: 'R' },
        // q0: skip already-matched Ys (past the 0-region), check for remaining 1s
        { from: 'q0', read: 'Y', to: 'q0', write: 'Y', move: 'R' },
        { from: 'q0', read: '_', to: 'qAccept', write: '_', move: 'R' },
        // q1: scan right over unmatched 0s and matched Ys to find next unmatched 1
        { from: 'q1', read: '0', to: 'q1', write: '0', move: 'R' },
        { from: 'q1', read: 'Y', to: 'q1', write: 'Y', move: 'R' },
        { from: 'q1', read: '1', to: 'q2', write: 'Y', move: 'L' },
        // q2: return left to the X-marked start position
        { from: 'q2', read: '0', to: 'q2', write: '0', move: 'L' },
        { from: 'q2', read: '1', to: 'q2', write: '1', move: 'L' },
        { from: 'q2', read: 'Y', to: 'q2', write: 'Y', move: 'L' },
        { from: 'q2', read: 'X', to: 'q0', write: 'X', move: 'R' },
      ],
    },
    {
      name: t('chapterContent.chapter8.tmBeaver'),
      desc: t('chapterContent.chapter8.tmBeaverShortDesc'),
      blank: '0',
      start: 'A',
      accept: 'HALT',
      transitions: [
        { from: 'A', read: '0', to: 'B', write: '1', move: 'R' },
        { from: 'A', read: '1', to: 'B', write: '1', move: 'L' },
        { from: 'B', read: '0', to: 'A', write: '1', move: 'L' },
        { from: 'B', read: '1', to: 'HALT', write: '1', move: 'R' },
      ],
    },
  ];

  // Initialize diagonal grid
  useEffect(() => {
    generateGrid(5);
  }, []);

  // Initialize Turing machine tape
  useEffect(() => {
    resetTM();
  }, []);

  // === HALTING PROBLEM ANALYZER ===
  const analyzeCode = () => {
    setIsRunning(true);
    setOutput([]);
    setDetectedResult(null);

    const lines: string[] = [];

    setTimeout(() => {
      lines.push(t('chapterContent.chapter8.analyzingStructure'));
      setOutput([...lines]);
    }, 500);

    setTimeout(() => {
      lines.push(t('chapterContent.chapter8.detectingRecursion'));
      setOutput([...lines]);
    }, 1000);

    setTimeout(() => {
      lines.push(t('chapterContent.chapter8.checkingTermination'));
      setOutput([...lines]);
    }, 1500);

    setTimeout(() => {
      if (code.includes('while(true)') || code.includes('while (true)') || code.includes('for(;;)') || code.includes('for (;;)')) {
        lines.push(t('chapterContent.chapter8.detectLoop'));
        lines.push(t('chapterContent.chapter8.conclusionLoop'));
        setDetectedResult('loop');
      } else if (code.includes('collatz') || code.includes('3 * n + 1') || code.includes('3*n+1')) {
        lines.push(t('chapterContent.chapter8.detectCollatz'));
        lines.push(t('chapterContent.chapter8.collatzReach'));
        lines.push(t('chapterContent.chapter8.collatzUnproven'));
        lines.push(t('chapterContent.chapter8.conclusionCollatz'));
        setDetectedResult('collatz');
      } else if (code.includes('factorial') || code.includes('n - 1') || code.includes('n <=')) {
        lines.push(t('chapterContent.chapter8.detectRecursion'));
        lines.push(t('chapterContent.chapter8.detectBase'));
        lines.push(t('chapterContent.chapter8.conclusionHalt'));
        setDetectedResult('halt');
      } else {
        lines.push(t('chapterContent.chapter8.unknownBehavior'));
        lines.push(t('chapterContent.chapter8.conclusionUnknown'));
        setDetectedResult('unknown');
      }
      setOutput([...lines]);
      setIsRunning(false);
    }, 2000);
  };

  const resetAnalysis = () => {
    setIsRunning(false);
    setOutput([]);
    setDetectedResult(null);
  };

  const loadExample = (key: string) => {
    const prog = examplePrograms[key];
    if (prog) {
      setCode(prog.code);
      resetAnalysis();
    }
  };

  // === COLLATZ VISUALIZER ===
  const runCollatz = () => {
    const n = collatzInput;
    if (n < 1 || n > 100000 || !Number.isInteger(n)) return;
    setCollatzRunning(true);
    const steps = [n];
    let current = n;
    let iter = 0;
    const maxIter = 500;
    while (current !== 1 && iter < maxIter) {
      current = current % 2 === 0 ? current / 2 : 3 * current + 1;
      steps.push(current);
      iter++;
    }
    setCollatzSteps(steps);
    setCollatzRunning(false);
  };

  // === DIAGONAL ARGUMENT ===
  const generateGrid = (size: number) => {
    const g: number[][] = [];
    for (let i = 0; i < size; i++) {
      const row: number[] = [];
      for (let j = 0; j < size; j++) {
        row.push(Math.floor(Math.random() * 10));
      }
      g.push(row);
    }
    setGrid(g);
    const diag = g.map((row, i) => row[i]);
    setDiagonalDigits(diag);
    setNewDigits(diag.map(d => (d + 1) % 10));
    setHighlightDiag(false);
    setShowNewNumber(false);
  };

  // === TURING MACHINE ===
  const resetTM = () => {
    const example = tmExamples[tmExample];
    const inputStr = tmExample === 2 ? '' : tapeInput; // Busy Beaver starts blank
    const blank = example.blank;
    const tapeArr = inputStr.split('');
    // Pad tape with blanks on both sides (fewer blanks to fit dialog)
    const padded = [...Array(3).fill(blank), ...tapeArr, ...Array(6).fill(blank)];
    setTape(padded);
    setHeadPos(3); // start at first input char
    setTmState(example.start);
    setStepCount(0);
    setTmHalted(false);
  };

  const stepTM = () => {
    if (tmHalted) return;
    const example = tmExamples[tmExample];
    const currentSymbol = tape[headPos] || example.blank;

    const transition = example.transitions.find(
      t => t.from === tmState && t.read === currentSymbol
    );

    if (!transition || transition.to === example.accept || transition.to === 'HALT' || transition.to === 'qReject') {
      if (transition) {
        // Write and move
        const newTape = [...tape];
        newTape[headPos] = transition.write;
        setTape(newTape);
        setHeadPos(transition.move === 'R' ? headPos + 1 : Math.max(0, headPos - 1));
      }
      setTmHalted(true);
      setStepCount(stepCount + 1);
      return;
    }

    const newTape = [...tape];
    newTape[headPos] = transition.write;
    setTape(newTape);
    setHeadPos(transition.move === 'R' ? headPos + 1 : Math.max(0, headPos - 1));
    setTmState(transition.to);
    setStepCount(stepCount + 1);
  };

  const switchTMExample = (idx: number) => {
    setTmExample(idx);
    const input = idx === 2 ? '' : idx === 1 ? '000111' : '1011';
    setTapeInput(input);
  };

  // Reset TM when example changes
  useEffect(() => {
    resetTM();
  }, [tmExample]);

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      {/* Introduction */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="text-base font-semibold mb-1 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {t('chapterContent.common.coreConcept')}
        </h4>
        <p className="text-sm text-gray-700">
          {t('chapterContent.chapter8.coreConceptDesc')}
        </p>
      </div>

      {/* Halting Problem Simulator */}
      <div className="bg-white border rounded-xl p-4">
        <h4 className="text-base font-semibold mb-2 flex items-center gap-2">
          <Code className="w-4 h-4" />
          {t('chapterContent.chapter8.haltingTitle')}
        </h4>
        <p className="text-xs text-gray-600 mb-3">
          {t('chapterContent.chapter8.haltingDesc')}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {Object.entries(examplePrograms).map(([key, prog]) => (
            <Button
              key={key}
              variant={code === prog.code ? 'default' : 'outline'}
              size="sm"
              className="text-xs h-7"
              onClick={() => loadExample(key)}
            >
              {prog.name}
            </Button>
          ))}
        </div>

        <Textarea
          value={code}
          onChange={(e) => { setCode(e.target.value); resetAnalysis(); }}
          className="font-mono text-xs mb-3"
          rows={8}
        />

        <div className="flex gap-2 mb-3">
          <Button onClick={analyzeCode} disabled={isRunning} size="sm" className="text-xs h-7">
            <Play className="w-3 h-3 mr-1" />
            {isRunning ? t('chapterContent.chapter8.analyzing') : t('chapterContent.chapter8.analyze')}
          </Button>
          <Button variant="outline" onClick={resetAnalysis} size="sm" className="text-xs h-7">
            <RotateCcw className="w-3 h-3 mr-1" />
            {t('chapterContent.common.reset')}
          </Button>
        </div>

        {output.length > 0 && (
          <div className="bg-gray-900 rounded-lg p-3">
            {output.map((line, i) => (
              <div key={i} className={`font-mono text-xs ${line.includes('⚠') ? 'text-yellow-400' : line.includes('✓') ? 'text-green-400' : 'text-gray-300'}`}>
                {line}
              </div>
            ))}
            {detectedResult && (
              <div className={`mt-2 p-2 rounded text-center text-xs font-bold ${
                detectedResult === 'halt' ? 'bg-green-100 text-green-700' :
                detectedResult === 'loop' ? 'bg-red-100 text-red-700' :
                detectedResult === 'collatz' ? 'bg-amber-100 text-amber-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {detectedResult === 'halt' && t('chapterContent.chapter8.resultHalt')}
                {detectedResult === 'loop' && t('chapterContent.chapter8.resultLoop')}
                {detectedResult === 'collatz' && t('chapterContent.chapter8.resultCollatz')}
                {detectedResult === 'unknown' && t('chapterContent.chapter8.resultUnknown')}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Collatz Visualizer */}
      <div className="bg-white border rounded-xl p-4">
        <h4 className="text-base font-semibold mb-2 flex items-center gap-2">
          <Infinity className="w-4 h-4" />
          {t('chapterContent.chapter8.collatzTitle')}
        </h4>
        <p className="text-xs text-gray-600 mb-3">
          {t('chapterContent.chapter8.collatzDescFull')}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-600">n =</span>
          <Input
            type="number"
            value={collatzInput}
            onChange={(e) => { setCollatzSteps([]); setCollatzInput(parseInt(e.target.value) || 1); }}
            className="w-24 font-mono text-xs h-7"
            min={1}
            max={100000}
          />
          <Button onClick={runCollatz} disabled={collatzRunning} size="sm" className="text-xs h-7">
            <Play className="w-3 h-3 mr-1" />
            {t('chapterContent.chapter8.runButton')}
          </Button>
        </div>

        {collatzSteps.length > 0 && (
          <div>
            <div className="bg-gray-50 rounded-lg p-3 mb-2 max-h-32 overflow-y-auto">
              <div className="flex flex-wrap gap-0.5 items-center">
                {collatzSteps.map((val, i) => (
                  <span key={i} className="flex items-center">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      val === 1 ? 'bg-green-100 text-green-700 font-bold' :
                      val % 2 === 0 ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {val.toLocaleString()}
                    </span>
                    {i < collatzSteps.length - 1 && <span className="text-gray-400 text-[8px]">→</span>}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-blue-50 rounded-lg">
                <div className="text-gray-500">{t('chapterContent.chapter8.stepsLabel')}</div>
                <div className="text-lg font-mono font-bold text-blue-600">{collatzSteps.length - 1}</div>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <div className="text-gray-500">{t('chapterContent.chapter8.peakLabel')}</div>
                <div className="text-lg font-mono font-bold text-orange-600">{Math.max(...collatzSteps).toLocaleString()}</div>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <div className="text-gray-500">{t('chapterContent.chapter8.finalValueLabel')}</div>
                <div className="text-lg font-mono font-bold text-green-600">{collatzSteps[collatzSteps.length - 1]}</div>
              </div>
            </div>
            {collatzSteps.length >= 500 && (
              <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                {t('chapterContent.chapter8.collatzWarning')}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Diagonal Argument - Interactive */}
      <div className="bg-white border rounded-xl p-4">
        <h4 className="text-base font-semibold mb-2 flex items-center gap-2">
          <Table className="w-4 h-4" />
          {t('chapterContent.chapter8.cantor')}
        </h4>
        <p className="text-xs text-gray-600 mb-3">
          {t('chapterContent.chapter8.diagonalDesc')}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-600">{t('chapterContent.chapter8.size')}:</span>
          <div className="flex gap-1">
            {[3, 4, 5, 6, 7].map(s => (
              <button
                key={s}
                onClick={() => { setGridSize(s); generateGrid(s); }}
                className={`px-2 py-0.5 rounded text-xs font-mono ${gridSize === s ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {grid.length > 0 && (
          <div>
            <table className="mx-auto border-collapse">
              <tbody>
                {grid.map((row, i) => (
                  <tr key={i}>
                    <td className="pr-1 text-[10px] text-gray-400 font-mono text-right">r<sub>{i + 1}</sub></td>
                    {row.map((digit, j) => (
                      <td
                        key={j}
                        className={`w-7 h-7 text-center font-mono text-sm border transition-all duration-300 ${
                          highlightDiag && i === j
                            ? 'bg-yellow-300 font-bold'
                            : 'border-gray-200'
                        }`}
                      >
                        {digit}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-center gap-1.5 mt-3">
          <Button variant="outline" size="sm" onClick={() => generateGrid(gridSize)} className="text-xs h-7">
            <RotateCcw className="w-3 h-3 mr-1" />
            {t('chapterContent.chapter8.regenerate')}
          </Button>
          <Button size="sm" onClick={() => setHighlightDiag(true)} disabled={highlightDiag} className="text-xs h-7">
            {t('chapterContent.chapter8.highlightDiag')}
          </Button>
          <Button size="sm" onClick={() => setShowNewNumber(true)} disabled={!highlightDiag || showNewNumber} className="text-xs h-7">
            {t('chapterContent.chapter8.constructNew')}
          </Button>
        </div>

        {showNewNumber && (
          <div className="mt-3 p-3 bg-green-50 rounded-lg text-center">
            <div className="text-xs text-gray-500 mb-0.5">
              {t('chapterContent.chapter8.diagonalResult', { digits: diagonalDigits.join(', ') })}
            </div>
            <div className="font-mono text-lg font-bold text-green-700">
              0.{newDigits.join('')}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {t('chapterContent.chapter8.diagonalExplanation')}
            </div>
          </div>
        )}
      </div>

      {/* Turing Machine Simulator */}
      <div className="bg-white border rounded-xl p-4">
        <h4 className="text-base font-semibold mb-2 flex items-center gap-2">
          <FastForward className="w-4 h-4" />
          {t('chapterContent.chapter8.tmTitle')}
        </h4>
        <p className="text-xs text-gray-600 mb-3">
          {t('chapterContent.chapter8.tmDesc')}
        </p>

        {/* Concept explanation - only show current */}
        <div className="mb-3">
          {tmExample === 0 && (
            <div className="p-2 bg-blue-50 rounded-lg text-xs">
              <strong className="text-blue-700">{t('chapterContent.chapter8.tmBinaryLabel')}</strong>
              <span className="text-blue-600"> — {t('chapterContent.chapter8.tmBinaryDesc')}</span>
            </div>
          )}
          {tmExample === 1 && (
            <div className="p-2 bg-amber-50 rounded-lg text-xs">
              <strong className="text-amber-700">{t('chapterContent.chapter8.tmZeroOneLabel')}</strong>
              <span className="text-amber-600"> — {t('chapterContent.chapter8.tmZeroOneDesc')}</span>
            </div>
          )}
          {tmExample === 2 && (
            <div className="p-2 bg-purple-50 rounded-lg text-xs">
              <strong className="text-purple-700">{t('chapterContent.chapter8.tmBeaverLabel')}</strong>
              <span className="text-purple-600"> — {t('chapterContent.chapter8.tmBeaverDesc')}</span>
            </div>
          )}
        </div>

        {/* Example selector */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tmExamples.map((ex, i) => (
            <Button
              key={i}
              variant={tmExample === i ? 'default' : 'outline'}
              size="sm"
              className="text-xs h-7"
              onClick={() => switchTMExample(i)}
            >
              {ex.name}
            </Button>
          ))}
        </div>

        {/* Tape input */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-600">{t('chapterContent.chapter8.tape')}:</span>
          {tmExample === 2 ? (
            <span className="text-xs text-gray-400 italic">{t('chapterContent.chapter8.blankTape')}</span>
          ) : (
            <>
              <Input
                value={tapeInput}
                onChange={(e) => setTapeInput(e.target.value)}
                className="w-28 font-mono text-xs h-7"
              />
              <Button variant="outline" size="sm" onClick={resetTM} className="text-xs h-7">
                {t('chapterContent.chapter8.initialize')}
              </Button>
            </>
          )}
        </div>

        {/* Tape visualization - compact */}
        <div className="bg-gray-50 rounded-lg p-2 mb-3">
          <div className="flex justify-center items-start gap-px py-1">
            {tape.map((cell, i) => (
              <div key={i} className="relative flex flex-col items-center">
                <div className={`w-6 h-7 flex items-center justify-center font-mono text-[11px] border-2 rounded transition-all ${
                  i === headPos
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700'
                }`}>
                  {cell}
                </div>
                {i === headPos && (
                  <div className="text-[8px] text-blue-500 font-bold mt-0.5">
                    ▼{tmState}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>{t('chapterContent.chapter8.stepCountLabel', { count: stepCount })}</span>
            <span className={tmHalted ? 'text-green-600 font-bold' : ''}>
              {tmHalted ? t('chapterContent.chapter8.halted') : t('chapterContent.chapter8.running')}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-1.5 mb-3">
          <Button onClick={stepTM} disabled={tmHalted} size="sm" className="text-xs h-7">
            <FastForward className="w-3 h-3 mr-1" />
            {t('chapterContent.chapter8.step')}
          </Button>
          <Button variant="outline" size="sm" onClick={resetTM} className="text-xs h-7">
            <RotateCcw className="w-3 h-3 mr-1" />
            {t('chapterContent.common.reset')}
          </Button>
        </div>

        {/* Transition table - compact */}
        <p className="text-[10px] text-gray-400 mb-1">{t('chapterContent.chapter8.transitionRules')}</p>
        <div>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-1.5 border text-center">{t('chapterContent.chapter8.tableState')}</th>
                <th className="p-1.5 border text-center">{t('chapterContent.chapter8.tableRead')}</th>
                <th className="p-1.5 border text-center">{t('chapterContent.chapter8.tableWrite')}</th>
                <th className="p-1.5 border text-center">{t('chapterContent.chapter8.tableMove')}</th>
                <th className="p-1.5 border text-center">{t('chapterContent.chapter8.tableNextState')}</th>
              </tr>
            </thead>
            <tbody>
              {tmExamples[tmExample].transitions.map((t, i) => (
                <tr key={i} className={`${
                  !tmHalted && t.from === tmState && t.read === (tape[headPos] || tmExamples[tmExample].blank)
                    ? 'bg-yellow-100 font-bold' : ''
                }`}>
                  <td className="p-1.5 border text-center">{t.from}</td>
                  <td className="p-1.5 border text-center font-mono">{t.read}</td>
                  <td className="p-1.5 border text-center font-mono">{t.write}</td>
                  <td className="p-1.5 border text-center">{t.move === 'L' ? '←' : '→'}</td>
                  <td className="p-1.5 border text-center">{t.to}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Example - compact */}
      <div className="bg-gray-900 rounded-xl p-4 text-white">
        <h4 className="text-xs font-semibold mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
          {t('chapterContent.common.codeImplementation')}
        </h4>
        <pre className="font-mono text-[11px] leading-relaxed whitespace-pre-wrap break-all">
          <code>{`${t('chapterContent.chapter8.codeComment1')}
function halts(program, input) {
  ${t('chapterContent.chapter8.codeComment2')}
  return true;
}

function paradox(program) {
  if (halts(program, program)) {
    while (true) {} ${t('chapterContent.chapter8.codeComment3')}
  } else {
    return; ${t('chapterContent.chapter8.codeComment4')}
  }
}
${t('chapterContent.chapter8.codeComment5')}`}</code>
        </pre>
      </div>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl p-4 text-white">
        <h4 className="text-xs font-semibold mb-1">{t('chapterContent.common.keyInsight')}</h4>
        <p className="text-xs opacity-90">
          {t('chapterContent.chapter8.keyInsightDesc')}
        </p>
      </div>
    </div>
  );
};

export default Chapter8Content;
