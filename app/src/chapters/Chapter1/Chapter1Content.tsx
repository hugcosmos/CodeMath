import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw, Binary } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Chapter1Content = () => {
  const { t } = useTranslation();
  const [decimal, setDecimal] = useState<number>(42);
  const [binary, setBinary] = useState<string>('101010');
  const [hex, setHex] = useState<string>('2A');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Update conversions when decimal changes
  useEffect(() => {
    if (decimal >= 0) {
      setBinary(decimal.toString(2));
      setHex(decimal.toString(16).toUpperCase());
    }
  }, [decimal]);

  // Visualize bit positions
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

    const bitWidth = rect.width / 8;
    const bitHeight = 60;
    const startY = (rect.height - bitHeight) / 2;

    // Draw bit positions
    const bits = decimal.toString(2).padStart(8, '0').split('');
    
    bits.forEach((bit, index) => {
      const x = index * bitWidth + bitWidth / 2;
      const isOne = bit === '1';
      
      // Draw bit box
      ctx.fillStyle = isOne ? '#F4D03F' : '#E5E5E5';
      ctx.fillRect(index * bitWidth + 4, startY, bitWidth - 8, bitHeight);
      
      // Draw bit value
      ctx.fillStyle = isOne ? '#000' : '#666';
      ctx.font = 'bold 24px "Fira Code", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(bit, x, startY + bitHeight / 2);
      
      // Draw power of 2 label
      ctx.fillStyle = '#999';
      ctx.font = '12px "Inter", sans-serif';
      ctx.fillText(`2^${7 - index}`, x, startY + bitHeight + 20);
      
      // Draw value
      if (isOne) {
        ctx.fillStyle = '#F4D03F';
        ctx.font = 'bold 14px "Inter", sans-serif';
        ctx.fillText(`${Math.pow(2, 7 - index)}`, x, startY - 15);
      }
    });
  }, [decimal]);

  const handleDecimalChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0 && num <= 255) {
      setDecimal(num);
    }
  };

  const handleBinaryChange = (value: string) => {
    if (/^[01]*$/.test(value)) {
      const num = parseInt(value, 2);
      if (!isNaN(num)) {
        setDecimal(num);
      }
    }
  };

  const handleHexChange = (value: string) => {
    if (/^[0-9A-Fa-f]*$/.test(value)) {
      const num = parseInt(value, 16);
      if (!isNaN(num)) {
        setDecimal(num);
      }
    }
  };

  const reset = () => {
    setDecimal(42);
  };

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-amber-50 rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Binary className="w-5 h-5" />
          {t('chapterContent.common.coreConcept')}
        </h4>
        <p className="text-gray-700">
          {t('chapterContent.chapter1.coreConceptDesc')}
        </p>
      </div>

      {/* Interactive Converter */}
      <div className="bg-white border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold">{t('chapterContent.chapter1.converter')}</h4>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t('chapterContent.common.reset')}
          </Button>
        </div>

        <Tabs defaultValue="decimal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="decimal">{t('chapterContent.chapter1.decimal')}</TabsTrigger>
            <TabsTrigger value="binary">{t('chapterContent.chapter1.binary')}</TabsTrigger>
            <TabsTrigger value="hex">{t('chapterContent.chapter1.hex')}</TabsTrigger>
          </TabsList>

          <TabsContent value="decimal" className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                type="number"
                value={decimal}
                onChange={(e) => handleDecimalChange(e.target.value)}
                min={0}
                max={255}
                className="text-2xl font-mono"
              />
              <span className="text-gray-500">₁₀</span>
            </div>
            <p className="text-sm text-gray-500">
              {t('chapterContent.chapter1.inputPlaceholder')}
            </p>
          </TabsContent>

          <TabsContent value="binary" className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                value={binary}
                onChange={(e) => handleBinaryChange(e.target.value)}
                className="text-2xl font-mono"
                placeholder={t('chapterContent.chapter1.binaryInputHint')}
              />
              <span className="text-gray-500">₂</span>
            </div>
            <p className="text-sm text-gray-500">
              {t('chapterContent.chapter1.binaryInputHint')}
            </p>
          </TabsContent>

          <TabsContent value="hex" className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                value={hex}
                onChange={(e) => handleHexChange(e.target.value.toUpperCase())}
                className="text-2xl font-mono"
                placeholder={t('chapterContent.chapter1.hexInputHint')}
              />
              <span className="text-gray-500">₁₆</span>
            </div>
            <p className="text-sm text-gray-500">
              {t('chapterContent.chapter1.hexInputHint')}
            </p>
          </TabsContent>
        </Tabs>

        {/* Results */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="text-sm text-gray-500 mb-1">{t('chapterContent.chapter1.decimal')}</div>
            <div className="text-2xl font-mono font-bold">{decimal}</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center">
            <div className="text-sm text-gray-500 mb-1">{t('chapterContent.chapter1.binary')}</div>
            <div className="text-2xl font-mono font-bold text-amber-600">{binary}</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <div className="text-sm text-gray-500 mb-1">{t('chapterContent.chapter1.hex')}</div>
            <div className="text-2xl font-mono font-bold text-purple-600">{hex}</div>
          </div>
        </div>
      </div>

      {/* Bit Visualization */}
      <div className="bg-white border rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-4">{t('chapterContent.chapter1.bitVisualization')}</h4>
        <p className="text-sm text-gray-600 mb-4">
          {t('chapterContent.chapter1.bitDesc')}
        </p>
        <canvas
          ref={canvasRef}
          className="w-full h-40"
          style={{ width: '100%', height: '160px' }}
        />
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500">{t('chapterContent.chapter1.totalValue')}: </span>
          <span className="text-lg font-mono font-bold">
            {decimal.toString(2).padStart(8, '0').split('').map((b, i) => 
              b === '1' ? `2^${7 - i}${i < 7 - decimal.toString(2).padStart(8, '0').split('').reverse().findIndex(x => x === '1') ? ' + ' : ''}` : ''
            ).join('').replace(/\+\s*$/, '')} = {decimal}
          </span>
        </div>
      </div>

      {/* Code Example */}
      <div className="bg-gray-900 rounded-2xl p-6 text-white">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full" />
          {t('chapterContent.common.codeImplementation')}
        </h4>
        <pre className="font-mono text-sm overflow-x-auto">
          <code>{`${t('chapterContent.chapter1.codeComment1')}
const decimal = ${decimal};

// ${t('chapterContent.chapter1.binary')}: decimal.toString(2)
const binary = decimal.toString(2);  // "${binary}"

// ${t('chapterContent.chapter1.hex')}: decimal.toString(16)
const hex = decimal.toString(16);    // "${hex.toLowerCase()}"

parseInt("${binary}", 2);  // ${decimal}

// Bitwise
const shifted = decimal << 1;  // ${decimal << 1}
const masked = decimal & 0x0F; // ${decimal & 0x0F}`}</code>
        </pre>
      </div>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-6 text-white">
        <h4 className="text-lg font-semibold mb-2">{t('chapterContent.common.keyInsight')}</h4>
        <p className="opacity-90">
          {t('chapterContent.chapter1.keyInsightDesc')}
        </p>
      </div>
    </div>
  );
};

export default Chapter1Content;
