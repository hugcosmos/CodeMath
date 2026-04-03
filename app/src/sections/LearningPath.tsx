import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, Code, FlaskConical, Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

const LearningPath = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      icon: BookOpen,
      title: t('learningPath.step1Title'),
      description: t('learningPath.step1Desc'),
      color: 'bg-amber-400',
    },
    {
      icon: Code,
      title: t('learningPath.step2Title'),
      description: t('learningPath.step2Desc'),
      color: 'bg-blue-400',
    },
    {
      icon: FlaskConical,
      title: t('learningPath.step3Title'),
      description: t('learningPath.step3Desc'),
      color: 'bg-emerald-400',
    },
    {
      icon: Rocket,
      title: t('learningPath.step4Title'),
      description: t('learningPath.step4Desc'),
      color: 'bg-purple-400',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // SVG path drawing animation
      if (pathRef.current) {
        const pathLength = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: 1,
          },
        });
      }

      // Steps entrance animation
      const stepCards = stepsRef.current?.querySelectorAll('.step-card');
      if (stepCards) {
        stepCards.forEach((card, index) => {
          gsap.fromTo(
            card,
            { rotateY: 90, opacity: 0 },
            {
              rotateY: 0,
              opacity: 1,
              duration: 0.8,
              delay: index * 0.2,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            {t('learningPath.title1')}
            <span className="text-gradient-yellow"> {t('learningPath.title2')}</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('learningPath.subtitle')}
          </p>
        </div>

        {/* Path with Steps */}
        <div className="relative" ref={stepsRef}>
          {/* SVG Path - Hidden on mobile */}
          <svg
            className="absolute top-1/2 left-0 w-full h-4 -translate-y-1/2 hidden lg:block"
            viewBox="0 0 1200 20"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F4D03F" />
                <stop offset="33%" stopColor="#60A5FA" />
                <stop offset="66%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#A78BFA" />
              </linearGradient>
            </defs>
            <path
              ref={pathRef}
              d="M 0 10 Q 150 10, 200 10 T 400 10 T 600 10 T 800 10 T 1000 10 T 1200 10"
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="step-card perspective-1000"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                    {/* Step Number */}
                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-6 mx-auto`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-center mb-4">{step.title}</h3>
                    <p className="text-gray-600 text-center text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quote */}
        <div className="mt-20 text-center">
          <blockquote className="text-2xl sm:text-3xl font-light italic text-gray-700 max-w-3xl mx-auto">
            "{t('learningPath.quote1')}
            <span className="font-semibold text-black"> {t('learningPath.quote2')}</span>"
          </blockquote>
          <cite className="block mt-4 text-gray-500">{t('learningPath.quoteSource')}</cite>
        </div>
      </div>
    </section>
  );
};

export default LearningPath;
