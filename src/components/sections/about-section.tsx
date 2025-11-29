"use client";

import { ReactNode, useEffect, useState, useRef } from 'react';
import { cubicBezier } from 'framer-motion';
import { AnimatePresence, motion } from 'framer-motion';
import { TypingAnimation } from '@/registry/magicui/typing-animation';
import { SignatureEduardo } from '@/components/ui/signature-eduardo';

import { useCallback, memo } from 'react';

const AnimatedHeading = memo(function AnimatedHeading({ contentCanAnimate = true, shouldAnimate = true }: { contentCanAnimate?: boolean; shouldAnimate?: boolean }) {
  const title = "Hey, Soy Eduardo";
  const subtitle = "Desarrollador Frontend Jr.";
  const [showTyping, setShowTyping] = useState(shouldAnimate);

  const handleTypingDone = useCallback(() => setShowTyping(false), []);

  return (
    <div className="text-center">
      <h1 className="sr-only" aria-label={`${title} ${subtitle}`}>
        {title}
      </h1>
      <div style={{ minHeight: '120px' }} className="flex items-center justify-center">
        {contentCanAnimate && (
          shouldAnimate ? (
            <SignatureEduardo startDelay={800} key="signature-animate" />
          ) : (
            <SignatureEduardo startDelay={0} skipAnimation key="signature-static" />
          )
        )}
      </div>
      <div className="mt-1" style={{ minHeight: '3rem' }}>
        <span
          style={{ fontSize: 'clamp(1.25rem, 4vw, 2rem)' }}
          className="inline-block font-semibold text-foreground"
        >
          {showTyping && shouldAnimate ? (
            <TypingAnimation
              className="text-foreground"
              speedMsPerChar={80}
              startDelayMs={2800}
              showCursorDelayMs={2500}
              onDone={handleTypingDone}
            >
              {subtitle}
            </TypingAnimation>
          ) : (
            subtitle
          )}
        </span>
      </div>
    </div>
  );
});

type AboutSectionProps = {
  children?: ReactNode;
  isCompact?: boolean;
  footerVisible?: boolean;
  setBlockNavigation?: (value: boolean) => void;
  navigate?: (index: number) => void;
  currentSection?: number;
  contentCanAnimate?: boolean;
};

const description = "Me gusta construir soluciones digitales que tengan sentido desde la base. Me interesa la etapa previa al código, ordenar ideas, definir la arquitectura, analizar pros y contras y pensar en soluciones claras antes de mover una sola línea. El objetivo es que lo que ves en pantalla se sienta fluido, útil y respaldado por una estructura sólida.";

const easeCurve = cubicBezier(0.22, 1, 0.36, 1);
const headingMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, delay: 0.2, ease: easeCurve },
};
const descriptionMotion = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay: 4.5, ease: easeCurve },
};

export const AboutSection = memo(function AboutSection({ children, contentCanAnimate = true }: AboutSectionProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (contentCanAnimate && !hasAnimated) {
      const timer = window.setTimeout(() => setHasAnimated(true), 7000);
      return () => window.clearTimeout(timer);
    }
  }, [contentCanAnimate, hasAnimated]);

  const shouldAnimate = !hasAnimated;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="w-full h-full min-h-dvh lg:min-h-0 flex flex-col items-center justify-center pb-10 sm:pb-12 md:pb-16 lg:pb-20 scroll-mt-16"
      aria-labelledby="about-heading"
    >
      <motion.div 
        className="w-full px-4 sm:px-8 md:px-12 lg:px-40 xl:px-40 2xl:px-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: contentCanAnimate ? 1 : 0 }}
        transition={{ duration: 0.01 }}
      >
        <motion.div
          className="flex flex-col items-center text-center space-y-4 sm:space-y-6 max-w-4xl mx-auto"
          initial="hidden"
          animate={contentCanAnimate ? "visible" : "hidden"}
        >
          <motion.div
            initial={headingMotion.initial}
            animate={contentCanAnimate ? headingMotion.animate : { opacity: 0 }}
            transition={headingMotion.transition}
          >
            <AnimatedHeading contentCanAnimate={contentCanAnimate} shouldAnimate={shouldAnimate} />
          </motion.div>
          <motion.div style={{ overflow: 'hidden' }} className="max-w-2xl mx-auto">
            <motion.p
              className="text-foreground/85 leading-loose"
              style={{ fontSize: 'clamp(1rem, 2.2vw, 1.25rem)' }}
              initial={descriptionMotion.initial}
              animate={contentCanAnimate ? descriptionMotion.animate : descriptionMotion.initial}
              transition={descriptionMotion.transition}
            >
              {description}
            </motion.p>
          </motion.div>
          <AnimatePresence>
            {children}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
});
