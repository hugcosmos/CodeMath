import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

gsap.registerPlugin(ScrollTrigger);

interface CTAFooterProps {
  onStartLearning?: () => void;
}

const CTAFooter = ({ onStartLearning }: CTAFooterProps) => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { backgroundSize: '0% 100%' },
        {
          backgroundSize: '100% 100%',
          duration: 1.5,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={sectionRef} className="bg-black text-white">
      {/* CTA Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8"
            style={{
              background: 'linear-gradient(90deg, #fff 0%, #fff 50%, transparent 50%, transparent 100%)',
              backgroundSize: '0% 100%',
              backgroundRepeat: 'no-repeat',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextStroke: '2px white',
            }}
          >
            {t('footer.title')}
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            {t('footer.subtitle')}
          </p>
          <Button
            size="lg"
            onClick={onStartLearning}
            className="bg-[#F4D03F] text-black hover:bg-[#D4AC0D] px-10 py-7 text-lg rounded-full group"
          >
            {t('footer.button')}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-gray-500 text-sm">
              {t('footer.copyright')}
            </p>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-gray-600 text-xs hover:text-gray-400 transition-colors cursor-help border-b border-dotted border-gray-600 hover:border-gray-400">
                  {t('footer.acknowledgments')}
                </span>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                sideOffset={8}
                className="max-w-sm bg-gray-800 text-gray-200 border border-gray-700 px-4 py-3 text-xs leading-relaxed"
              >
                {t('footer.acknowledgmentsContent')}
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-blue-500 fill-blue-500" /> & Code
          </p>
        </div>
      </div>
    </footer>
  );
};

export default CTAFooter;
