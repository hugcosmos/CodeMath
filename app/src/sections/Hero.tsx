import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Code, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

// Mathematical symbols for the background
const mathSymbols = ['π', '∑', '∫', '∞', '√', 'Δ', 'θ', 'λ', '∀', '∃', '∈', '⊂', '∪', '∩', '∂', '∇'];

interface Particle {
  x: number;
  y: number;
  symbol: string;
  size: number;
  speed: number;
  opacity: number;
  rotation: number;
}

const Hero = () => {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [decodedSubtitle, setDecodedSubtitle] = useState('');
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let noiseCanvas: HTMLCanvasElement | null = null;

    const generateNoiseTexture = (w: number, h: number) => {
      const nc = document.createElement('canvas');
      nc.width = w;
      nc.height = h;
      const nctx = nc.getContext('2d')!;
      const imgData = nctx.createImageData(w, h);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 30;
        d[i] = 210 + v;
        d[i + 1] = 190 + v;
        d[i + 2] = 160 + v;
        d[i + 3] = 255;
      }
      nctx.putImageData(imgData, 0, 0);
      return nc;
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      noiseCanvas = generateNoiseTexture(canvas.width, canvas.height);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    const particleCount = Math.floor((canvas.width * canvas.height) / 25000);
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      symbol: mathSymbols[Math.floor(Math.random() * mathSymbols.length)],
      size: Math.random() * 20 + 14,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.15 + 0.05,
      rotation: Math.random() * 360,
    }));

    const animate = () => {
      // Paper texture base
      if (noiseCanvas) {
        ctx.drawImage(noiseCanvas, 0, 0);
      }

      particlesRef.current.forEach((particle) => {
        particle.y += particle.speed;
        particle.rotation += 0.2;

        if (particle.y > canvas.height + 50) {
          particle.y = -50;
          particle.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        ctx.font = `${particle.size}px 'Times New Roman'`;
        ctx.fillStyle = `rgba(0, 0, 0, ${particle.opacity})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(particle.symbol, 0, 0);
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Text decode effect for subtitle
  useEffect(() => {
    const subtitle = t('hero.subtitle');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let iteration = 0;
    const maxIterations = subtitle.length * 3;

    const interval = setInterval(() => {
      setDecodedSubtitle(
        subtitle
          .split('')
          .map((char, index) => {
            if (char === ' ' || char === '。' || char === '，') return char;
            if (index < iteration / 3) return subtitle[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      iteration++;
      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDecodedSubtitle(subtitle);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [t, i18n.language]);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { rotateX: 90, y: 50, opacity: 0 },
        {
          rotateX: 0,
          y: 0,
          opacity: 1,
          duration: 1.2,
          delay: 0.2,
          ease: 'expo.out',
        }
      );

      // Buttons animation
      gsap.fromTo(
        buttonsRef.current?.children || [],
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          delay: 1.0,
          stagger: 0.1,
          ease: 'elastic.out(1, 0.5)',
        }
      );

      // Scroll-triggered exit animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '50% top',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to(titleRef.current, {
            scale: 1 + progress * 2,
            opacity: 1 - progress,
            z: progress * 500,
            duration: 0.1,
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToChapters = () => {
    const chaptersSection = document.getElementById('chapters');
    if (chaptersSection) {
      chaptersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden perspective-1000"
    >
      {/* Formula Rain Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto preserve-3d">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 mb-8 opacity-0 animate-fade-in"
          style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          <Code className="w-4 h-4" />
          <span className="text-sm font-medium">{t('hero.badge')}</span>
        </div>

        {/* Main Title */}
        <h1
          ref={titleRef}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight float"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <span className="block">{t('hero.title.line1')}</span>
          <span className="block text-gradient-yellow">{t('hero.title.line2')}</span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto font-light"
        >
          {decodedSubtitle}
        </p>

        {/* CTA Buttons */}
        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={scrollToChapters}
            className="magnetic-button bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-full group"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            {t('hero.buttons.startLearning')}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="magnetic-button border-2 border-black text-black hover:bg-black hover:text-white px-8 py-6 text-lg rounded-full transition-all duration-300"
            onClick={() => window.open('https://github.com/hugcosmos/CodeMath', '_blank')}
          >
            <Code className="w-5 h-5 mr-2" />
            {t('hero.buttons.viewSource')}
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto opacity-0 animate-fade-in"
          style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
          <div>
            <div className="text-3xl font-bold">8</div>
            <div className="text-sm text-gray-500">{t('hero.stats.chapters')}</div>
          </div>
          <div>
            <div className="text-3xl font-bold">50+</div>
            <div className="text-sm text-gray-500">{t('hero.stats.experiments')}</div>
          </div>
          <div>
            <div className="text-3xl font-bold">∞</div>
            <div className="text-sm text-gray-500">{t('hero.stats.fun')}</div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#e8dcc8] to-transparent pointer-events-none" />

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Hero;
