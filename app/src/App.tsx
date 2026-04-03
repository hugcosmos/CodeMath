import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from './sections/Hero';
import ChapterExplorer from './sections/ChapterExplorer';
import type { ChapterExplorerHandle } from './sections/ChapterExplorer';
import CTAFooter from './sections/CTAFooter';
import LanguageSwitcher from './components/LanguageSwitcher';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef<HTMLDivElement>(null);
  const chapterExplorerRef = useRef<ChapterExplorerHandle>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.refresh();
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const handleStartLearning = () => {
    chapterExplorerRef.current?.openFirstChapter();
  };

  return (
    <div ref={mainRef} className="grain min-h-screen bg-[#e8dcc8]">
      <LanguageSwitcher />
      <Hero />
      <ChapterExplorer ref={chapterExplorerRef} />
      <CTAFooter onStartLearning={handleStartLearning} />
    </div>
  );
}

export default App;
