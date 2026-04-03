import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Binary,
  Brain,
  Calendar,
  Layers,
  GitBranch,
  Zap,
  AlertTriangle,
  Cpu,
  Play,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Chapter1Content from '@/chapters/Chapter1/Chapter1Content';
import Chapter2Content from '@/chapters/Chapter2/Chapter2Content';
import Chapter3Content from '@/chapters/Chapter3/Chapter3Content';
import Chapter4Content from '@/chapters/Chapter4/Chapter4Content';
import Chapter5Content from '@/chapters/Chapter5/Chapter5Content';
import Chapter6Content from '@/chapters/Chapter6/Chapter6Content';
import Chapter7Content from '@/chapters/Chapter7/Chapter7Content';
import Chapter8Content from '@/chapters/Chapter8/Chapter8Content';
import AppendixContent from '@/chapters/Appendix/AppendixContent';

gsap.registerPlugin(ScrollTrigger);

interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  color: string;
  component: React.ComponentType;
}

const getChapters = (t: (key: string) => string): Chapter[] => [
  {
    id: 'chapter1',
    title: t('chapters.list.chapter1.title'),
    subtitle: t('chapters.list.chapter1.subtitle'),
    description: t('chapters.list.chapter1.description'),
    icon: Binary,
    color: 'from-amber-400 to-orange-500',
    component: Chapter1Content,
  },
  {
    id: 'chapter2',
    title: t('chapters.list.chapter2.title'),
    subtitle: t('chapters.list.chapter2.subtitle'),
    description: t('chapters.list.chapter2.description'),
    icon: Brain,
    color: 'from-blue-400 to-indigo-500',
    component: Chapter2Content,
  },
  {
    id: 'chapter3',
    title: t('chapters.list.chapter3.title'),
    subtitle: t('chapters.list.chapter3.subtitle'),
    description: t('chapters.list.chapter3.description'),
    icon: Calendar,
    color: 'from-emerald-400 to-teal-500',
    component: Chapter3Content,
  },
  {
    id: 'chapter4',
    title: t('chapters.list.chapter4.title'),
    subtitle: t('chapters.list.chapter4.subtitle'),
    description: t('chapters.list.chapter4.description'),
    icon: Layers,
    color: 'from-purple-400 to-violet-500',
    component: Chapter4Content,
  },
  {
    id: 'chapter5',
    title: t('chapters.list.chapter5.title'),
    subtitle: t('chapters.list.chapter5.subtitle'),
    description: t('chapters.list.chapter5.description'),
    icon: GitBranch,
    color: 'from-pink-400 to-rose-500',
    component: Chapter5Content,
  },
  {
    id: 'chapter6',
    title: t('chapters.list.chapter6.title'),
    subtitle: t('chapters.list.chapter6.subtitle'),
    description: t('chapters.list.chapter6.description'),
    icon: Zap,
    color: 'from-cyan-400 to-sky-500',
    component: Chapter6Content,
  },
  {
    id: 'chapter7',
    title: t('chapters.list.chapter7.title'),
    subtitle: t('chapters.list.chapter7.subtitle'),
    description: t('chapters.list.chapter7.description'),
    icon: AlertTriangle,
    color: 'from-red-400 to-orange-500',
    component: Chapter7Content,
  },
  {
    id: 'chapter8',
    title: t('chapters.list.chapter8.title'),
    subtitle: t('chapters.list.chapter8.subtitle'),
    description: t('chapters.list.chapter8.description'),
    icon: AlertTriangle,
    color: 'from-gray-600 to-gray-800',
    component: Chapter8Content,
  },
  {
    id: 'appendix',
    title: t('chapters.list.appendix.title'),
    subtitle: t('chapters.list.appendix.subtitle'),
    description: t('chapters.list.appendix.description'),
    icon: Cpu,
    color: 'from-violet-500 to-purple-600',
    component: AppendixContent,
  },
];

interface ChapterExplorerHandle {
  openChapter: (chapter: Chapter) => void;
  openFirstChapter: () => void;
}

const ChapterExplorer = forwardRef<ChapterExplorerHandle>((_, ref) => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const chapters = getChapters(t);

  useImperativeHandle(ref, () => ({
    openChapter: (chapter: Chapter) => setActiveChapter(chapter),
    openFirstChapter: () => chapters.length > 0 && setActiveChapter(chapters[0]),
  }));

  const activeIndex = activeChapter ? chapters.findIndex((c) => c.id === activeChapter.id) : -1;
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === chapters.length - 1;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Grid entrance animation
      gsap.fromTo(
        gridRef.current,
        { rotate: -5, scale: 0.8, opacity: 0 },
        {
          rotate: 0,
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards staggered entrance
      const cards = gridRef.current?.querySelectorAll('.chapter-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Mouse tracking for magnetic effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        setMousePos({
          x: (e.clientX - rect.left - rect.width / 2) / 50,
          y: (e.clientY - rect.top - rect.height / 2) / 50,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      id="chapters"
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-[#e8dcc8]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            {t('chapters.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('chapters.subtitle')}
          </p>
        </div>

        {/* Bento Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{
            transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          {chapters.map((chapter, index) => {
            const Icon = chapter.icon;
            const isLarge = index === 0 || index === 4 || index === 8;
            
            return (
              <div
                key={chapter.id}
                className={`chapter-card group relative overflow-hidden rounded-3xl cursor-pointer card-breathe ${
                  isLarge ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
                onClick={() => setActiveChapter(chapter)}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${chapter.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
                />
                <div className="absolute inset-0 bg-[#f5eedf]/90 backdrop-blur-sm" />
                
                <div className="relative p-8 h-full flex flex-col">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${chapter.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">{chapter.subtitle}</div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-gradient transition-all duration-300">
                      {chapter.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {chapter.description}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="mt-6 flex items-center text-sm font-medium text-gray-900 group-hover:text-gradient-yellow transition-colors">
                    <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    {t('chapters.interactive')}
                    <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>

                {/* Hover border effect */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-black/10 transition-colors duration-300" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Chapter Dialog */}
      <Dialog open={!!activeChapter} onOpenChange={() => setActiveChapter(null)}>
        <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          {activeChapter && (
            <>
              <DialogHeader className="p-6 pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activeChapter.color} flex items-center justify-center`}
                    >
                      <activeChapter.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl">{activeChapter.title}</DialogTitle>
                      <DialogDescription>{activeChapter.subtitle}</DialogDescription>
                    </div>
                  </div>
                  {/* Chapter Navigation */}
                  <div className="flex items-center gap-1">
                    {!isFirst && (
                      <button
                        onClick={() => setActiveChapter(chapters[activeIndex - 1])}
                        className="p-2 rounded-lg hover:bg-black/5 transition-colors"
                        title={t('nav.previous') || 'Previous'}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    )}
                    {!isLast && (
                      <button
                        onClick={() => setActiveChapter(chapters[activeIndex + 1])}
                        className="p-2 rounded-lg hover:bg-black/5 transition-colors"
                        title={t('nav.next') || 'Next'}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </DialogHeader>
              <div className="p-6">
                <activeChapter.component />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
});

ChapterExplorer.displayName = 'ChapterExplorer';

export type { Chapter, ChapterExplorerHandle };
export default ChapterExplorer;
