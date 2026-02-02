"use client";

import { useState, useCallback, memo, useEffect, useRef, lazy, Suspense } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { AboutSection } from '@/components/sections/about-section';
import { PortfolioSection } from '@/components/sections/portfolio-section';
import { SkillsSection } from '@/components/sections/skills-section';
import { ContactSection } from '@/components/sections/contact-section';
import { DesktopHeader } from '@/components/layout/desktop-header';
import type { NavItem } from '@/lib/nav-links';
import { socialLinks, type SocialPlatform } from '@/lib/data';
import { SocialIcon } from '@/components/social-icon';
import { ScrollDownIndicator } from '@/components/ui/scroll-down-indicator';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DesktopContactFooter } from '@/components/layout/footer-desktop-contact';
import { ScrollToTopButton } from '@/components/scroll-to-top-button';
import { CornerFrames } from '@/components/corner-frames';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSectionNavigation } from '@/hooks/use-section-navigation';
import { useTheme } from '@/components/providers/theme-provider';
import { useCursorStyle } from '@/hooks/use-cursor-style';
import { useScrollLock } from '@/hooks/use-scroll-lock';
import { useLoaderAnimation } from '@/hooks/use-loader-animation';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { ScrollRevealSection } from '@/components/scroll-reveal-section';
import '@/styles/loader.css';

// Lazy load componentes pesados que solo se usan en desktop
const SmoothCursor = lazy(() => 
  import('@/components/ui/smooth-cursor').then(mod => ({ default: mod.SmoothCursor }))
);

// ═══════════════════════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════════════════════

interface DesktopViewProps {
  onSectionTransitionChange?: (value: boolean) => void;
  onSectionChange?: (section: number) => void;
  prefersReducedMotion?: boolean;
  contentCanAnimate?: boolean;
}

interface MobileViewProps {
  contentCanAnimate?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════════════════════

const SECTIONS = [
  { id: 'about', component: AboutSection },
  { id: 'portfolio', component: PortfolioSection },
  { id: 'skills', component: SkillsSection },
  { id: 'contact', component: ContactSection },
] as const;

const SOCIAL_PLATFORMS: SocialPlatform[] = ['github', 'whatsapp', 'cv'];

const LOADER_SPANS_COUNT = 15;

// Timing centralizado para animaciones (en segundos, excepto donde se indica)
const ANIMATION_TIMING = {
  // Transiciones de sección (ajustadas para sincronizar con los marcos)
  // Salida del contenido: rápido para que desaparezca antes de que los marcos lleguen al centro.
  CONTENT_EXIT_DURATION: 0.45,
  // Retardo antes de que el contenido vuelva a aparecer (debe coincidir con el retorno de marcos)
  CONTENT_ENTER_DELAY: 0.9,
  // Duración de entrada del contenido
  CONTENT_ENTER_DURATION: 0.6,
  // Tiempo total de la transición (en ms). Debe cubrir: fade-out -> marcos al centro/cruce -> marcos regreso -> fade-in inicio
  TOTAL_TRANSITION_MS: 1400,
  // Delays de contenido inicial
  SOCIAL_ICONS_DELAY: 5.5,
  SCROLL_INDICATOR_DELAY_ABOUT: 7.5,
  SCROLL_INDICATOR_DELAY_MOBILE: 6,
  // Easing curves (cubic-bezier)
  EASE_OUT_EXPO: [0.76, 0, 0.24, 1],
  EASE_OUT_BACK: [0.34, 1.56, 0.64, 1],
  EASE_OUT_QUINT: [0.22, 1, 0.36, 1],
  EASE_OUT_CIRC: [0.25, 0.46, 0.45, 0.94],
} as const;

const COMPACT_THRESHOLD_PX = 540;

// ═══════════════════════════════════════════════════════════════════════════════
// VARIANTES DE ANIMACIÓN (Framer Motion)
// ═══════════════════════════════════════════════════════════════════════════════

const socialContainerVariants: Variants = {
  hidden: { opacity: 0 },
  // Delay children so lateral icons start after main section/form animations
  visible: {
    opacity: 1,
    transition: { delayChildren: 1.8, staggerChildren: 0.08 },
  },
  exit: { opacity: 0, transition: { duration: 0.35 } },
};

const socialIconVariants: Variants = {
  // Start hidden: scaled down and invisible so scale-in + fade-in is noticeable
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: ANIMATION_TIMING.EASE_OUT_BACK },
  },
  // Exit: scale out + fade
  exit: {
    scale: 0,
    opacity: 0,
    transition: { duration: 0.45, ease: ANIMATION_TIMING.EASE_OUT_BACK },
  },
};

const headerSpringTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  restDelta: 0.001,
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════════

/** Renderiza los iconos sociales con animación escalonada */
const AnimatedSocialIcons = memo(function AnimatedSocialIcons({ 
  contentCanAnimate, 
  variant = 'about',
  baseDelay = ANIMATION_TIMING.SOCIAL_ICONS_DELAY,
}: { 
  contentCanAnimate: boolean; 
  variant?: 'about' | 'lateral';
  baseDelay?: number;
}) {
  return (
    <>
      {SOCIAL_PLATFORMS.map((platform, idx) => (
        <motion.div
          key={platform}
          initial={{ opacity: 0, scale: 0 }}
          animate={contentCanAnimate ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{
            duration: 0.6,
            delay: baseDelay + idx * 0.1,
            ease: ANIMATION_TIMING.EASE_OUT_BACK,
          }}
        >
          <SocialIcon platform={platform} url={socialLinks[platform]} variant={variant} />
        </motion.div>
      ))}
    </>
  );
});

/** Loader spans generados programáticamente */
const LoaderSpans = memo(function LoaderSpans() {
  return (
    <>
      {Array.from({ length: LOADER_SPANS_COUNT }, (_, i) => (
        <span key={i} />
      ))}
    </>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// DESKTOP VIEW
// ═══════════════════════════════════════════════════════════════════════════════

const DesktopView = memo(function DesktopView({ 
  onSectionTransitionChange, 
  onSectionChange, 
  prefersReducedMotion, 
  contentCanAnimate = false 
}: DesktopViewProps) {
  const { currentSection, navigate, setBlockNavigation } = useSectionNavigation(SECTIONS.length);
  const { theme } = useTheme();
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeightPx, setContentHeightPx] = useState(0);
  const [sectionContentVisible, setSectionContentVisible] = useState(false);
  const [contactCardEntered, setContactCardEntered] = useState(false);
  const previousSectionRef = useRef(currentSection);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isFirstTransition = useRef(true);
  
  const isInContactSection = currentSection === SECTIONS.length - 1;
  const isCompactLayout = contentHeightPx > 0 && contentHeightPx < COMPACT_THRESHOLD_PX;
  const CurrentComponent = SECTIONS[currentSection].component;
  const contentEnterDelayDynamic = ANIMATION_TIMING.CONTENT_ENTER_DELAY;
  const contentEnterDurationDynamic = ANIMATION_TIMING.CONTENT_ENTER_DURATION;

  // Notificar cambios de sección al padre
  useEffect(() => {
    onSectionChange?.(currentSection);
  }, [currentSection, onSectionChange]);

  // Observar altura del contenedor
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setContentHeightPx(entry.contentRect.height);
    });
    
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, []);

  // Manejar transiciones de sección
  useEffect(() => {
    const previousSection = previousSectionRef.current;
    previousSectionRef.current = currentSection;

    if (isFirstTransition.current) {
      isFirstTransition.current = false;
      return;
    }

    if (currentSection === previousSection) return;

    // Limpiar timeout previo
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    onSectionTransitionChange?.(true);
    
    transitionTimeoutRef.current = setTimeout(() => {
      onSectionTransitionChange?.(false);
    }, ANIMATION_TIMING.TOTAL_TRANSITION_MS);

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [currentSection, onSectionTransitionChange]);

  const handleNavigate = useCallback((href: NavItem["href"]) => {
    const sectionId = href.slice(1); // Más eficiente que substring(1)
    const sectionIndex = SECTIONS.findIndex((s) => s.id === sectionId);
    if (sectionIndex !== -1) {
      navigate(sectionIndex);
    }
  }, [navigate]);

  const handleAnimationStart = useCallback(() => {
    setBlockNavigation(true);
    setSectionContentVisible(false);
    setContactCardEntered(false);
  }, [setBlockNavigation]);

  const handleAnimationComplete = useCallback(() => {
    const shouldBlock = SECTIONS[currentSection]?.id === 'portfolio';
    setBlockNavigation(shouldBlock);
    setSectionContentVisible(true);
  }, [currentSection, setBlockNavigation]);

  const handleScrollDown = useCallback(() => {
    navigate(currentSection + 1);
  }, [navigate, currentSection]);

  return (
    <div className="relative h-dvh w-full flex flex-col cursor-none overflow-hidden">
      {/* Cursor personalizado - lazy loaded */}
      {!prefersReducedMotion && (
        <Suspense fallback={null}>
          <SmoothCursor theme={theme} />
        </Suspense>
      )}

      {/* Header */}
      <motion.div 
        className="relative z-20"
        initial={{ y: -100, opacity: 0 }}
        animate={contentCanAnimate ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
        transition={headerSpringTransition}
      >
        <DesktopHeader onNavigate={handleNavigate} activeSection={currentSection} />
      </motion.div>

      {/* Contenido principal */}
      <div 
        ref={contentRef} 
        className="relative z-10 flex-1 overflow-hidden" 
        style={{ transformStyle: 'preserve-3d' }}
      >
        <AnimatePresence mode="wait" initial>
          <motion.div
            key={currentSection}
            className="absolute inset-0 flex"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                duration: contentEnterDurationDynamic,
                delay: contentEnterDelayDynamic,
                ease: ANIMATION_TIMING.EASE_OUT_EXPO,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.92,
              transition: {
                duration: ANIMATION_TIMING.CONTENT_EXIT_DURATION,
                ease: ANIMATION_TIMING.EASE_OUT_EXPO,
              },
            }}
            onAnimationStart={handleAnimationStart}
            onAnimationComplete={handleAnimationComplete}
          >
            <div className="w-full h-full overflow-hidden">
              <motion.div
                className="w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: contentCanAnimate ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: ANIMATION_TIMING.EASE_OUT_EXPO }}
                style={{ willChange: 'opacity' }}
              >
                {
                  CurrentComponent === PortfolioSection ? (
                    <PortfolioSection
                      isCompact={isCompactLayout}
                      footerVisible={isInContactSection}
                      setBlockNavigation={setBlockNavigation}
                      navigate={navigate}
                      currentSection={currentSection}
                      contentCanAnimate={contentCanAnimate}
                      parentContentVisible={sectionContentVisible}
                      contentEnterDelay={ANIMATION_TIMING.CONTENT_ENTER_DELAY}
                    >
                      {currentSection === 0 && (
                        <motion.div
                          className="flex items-center gap-5 pt-4"
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={contentCanAnimate 
                            ? { opacity: 1, y: 0, scale: 1 } 
                            : { opacity: 0, y: 20, scale: 0.95 }
                          }
                          transition={{ 
                            duration: 0.8, 
                            delay: ANIMATION_TIMING.SOCIAL_ICONS_DELAY, 
                            ease: ANIMATION_TIMING.EASE_OUT_QUINT 
                          }}
                        >
                          <AnimatedSocialIcons 
                            contentCanAnimate={contentCanAnimate} 
                            variant="about" 
                          />
                        </motion.div>
                      )}
                    </PortfolioSection>
                  ) : CurrentComponent === SkillsSection ? (
                    <SkillsSection
                      isCompact={isCompactLayout}
                      footerVisible={isInContactSection}
                      setBlockNavigation={setBlockNavigation}
                      navigate={navigate}
                      currentSection={currentSection}
                      contentCanAnimate={contentCanAnimate}
                      parentContentVisible={sectionContentVisible}
                    />
                  ) : CurrentComponent === ContactSection ? (
                    <ContactSection
                      isCompact={isCompactLayout}
                      footerVisible={isInContactSection}
                      setBlockNavigation={setBlockNavigation}
                      navigate={navigate}
                      currentSection={currentSection}
                      parentContentVisible={sectionContentVisible}
                      onCardEntered={setContactCardEntered}
                    />
                  ) : (
                    <CurrentComponent
                      isCompact={isCompactLayout}
                      footerVisible={isInContactSection}
                      setBlockNavigation={setBlockNavigation}
                      navigate={navigate}
                      currentSection={currentSection}
                      contentCanAnimate={contentCanAnimate}
                      parentContentVisible={sectionContentVisible}
                    >
                      {currentSection === 0 && (
                        <motion.div
                          className="flex items-center gap-5 pt-4"
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={contentCanAnimate 
                            ? { opacity: 1, y: 0, scale: 1 } 
                            : { opacity: 0, y: 20, scale: 0.95 }
                          }
                          transition={{ 
                            duration: 0.8, 
                            delay: ANIMATION_TIMING.SOCIAL_ICONS_DELAY, 
                            ease: ANIMATION_TIMING.EASE_OUT_QUINT 
                          }}
                        >
                          <AnimatedSocialIcons 
                            contentCanAnimate={contentCanAnimate} 
                            variant="about" 
                          />
                        </motion.div>
                      )}
                    </CurrentComponent>
                  )
                }
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Iconos sociales laterales (secciones intermedias) */}
      <AnimatePresence>
        {currentSection > 0 && currentSection < SECTIONS.length - 1 && (
          <motion.div
            className="fixed bottom-1/2 translate-y-1/2 left-4 z-50 flex flex-col gap-4"
            variants={socialContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            // Incremented delay so lateral social icons appear later and don't feel abrupt
            transition={{ delay: 1.8, duration: 0.4 }}
          >
            {SOCIAL_PLATFORMS.map((platform) => (
              <motion.div key={platform} variants={socialIconVariants}>
                <SocialIcon
                  platform={platform}
                  url={socialLinks[platform]}
                  variant="lateral"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Indicador de scroll */}
      <AnimatePresence>
        {currentSection < SECTIONS.length - 1 && (
          <ScrollDownIndicator 
            onClick={handleScrollDown} 
            delay={currentSection === 0 ? ANIMATION_TIMING.SCROLL_INDICATOR_DELAY_ABOUT : 0}
          />
        )}
      </AnimatePresence>

      {/* Footer lateral para sección de contacto */}
      <AnimatePresence>
        {isInContactSection && contactCardEntered && (
          <motion.div
            className="fixed left-4 xl:left-6 2xl:left-8 top-[4rem] bottom-0 z-40 py-8 xl:py-10 flex items-center"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            // Apply a larger extra delay so footer container and its content
            // enter noticeably after the contact card completes.
            transition={{ duration: contentEnterDurationDynamic, delay: 0.5, ease: ANIMATION_TIMING.EASE_OUT_QUINT }}
            // Salida: duración 0.45s para coincidir con ContactSection exit
            exit={{ x: -30, opacity: 0, transition: { duration: ANIMATION_TIMING.CONTENT_EXIT_DURATION, ease: ANIMATION_TIMING.EASE_OUT_QUINT } }}
          >
            <DesktopContactFooter />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// MOBILE VIEW
// ═══════════════════════════════════════════════════════════════════════════════

const MobileView = memo(function MobileView({ contentCanAnimate = false }: MobileViewProps) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showFullAbout, setShowFullAbout] = useState(true);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 5 && !hasScrolled) {
        setHasScrolled(true);
        scrollTimeoutRef.current = setTimeout(() => {
          setShowFullAbout(false);
        }, 300);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [hasScrolled]);

  const handleScrollToPortfolio = useCallback(() => {
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="flex flex-col min-h-[100svh]" style={{ touchAction: 'pan-y' }}>
      {/* Header */}
      <motion.div 
        style={{ touchAction: 'auto' }}
        initial={{ y: -100, opacity: 0 }}
        animate={contentCanAnimate ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
        transition={headerSpringTransition}
      >
        <Header />
      </motion.div>

      <main className="flex-1 flex flex-col gap-6" style={{ touchAction: 'auto' }}>
        {/* About Section - altura condicional */}
        <motion.div
          animate={{
            height: showFullAbout ? '100dvh' : 'auto',
            overflow: showFullAbout ? 'hidden' : 'visible',
          }}
          transition={{ duration: 0.4, ease: ANIMATION_TIMING.EASE_OUT_QUINT }}
        >
          <AboutSection contentCanAnimate={contentCanAnimate}>
            <div className="flex items-center gap-6 pt-4">
              <AnimatedSocialIcons contentCanAnimate={contentCanAnimate} variant="lateral" />
            </div>
          </AboutSection>
        </motion.div>
        
        {/* Secciones restantes con scroll reveal */}
        <ScrollRevealSection delay={0.1}>
          <PortfolioSection isMobileOverride />
        </ScrollRevealSection>
        
        <ScrollRevealSection delay={0.15}>
          <SkillsSection />
        </ScrollRevealSection>
        
        <ScrollRevealSection delay={0.2}>
          <ContactSection />
        </ScrollRevealSection>
      </main>
      
      {/* Indicador de scroll */}
      <AnimatePresence mode="wait">
        {!hasScrolled && (
          <ScrollDownIndicator 
            delay={ANIMATION_TIMING.SCROLL_INDICATOR_DELAY_MOBILE} 
            onClick={handleScrollToPortfolio} 
          />
        )}
      </AnimatePresence>
      
      <Footer />
      <ScrollToTopButton />
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function Home() {
  const isMobileView = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const [sectionTransitioning, setSectionTransitioning] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  
  // Hooks de animación y efectos secundarios
  const { appReady, loaderFramesReleased, loaderFramesToCenter, contentCanAnimate } = useLoaderAnimation();
  useCursorStyle(isMobileView);
  useScrollLock(appReady, isMobileView);

  // Calcular estado de marcos de forma declarativa
  const frameState = (() => {
    if (prefersReducedMotion) return 'rest';
    if (!appReady) {
      if (loaderFramesReleased) return 'aboutFrame';
      if (loaderFramesToCenter) return 'active';
      return 'rest';
    }
    if (sectionTransitioning) return 'active';
    return currentSectionIndex === 0 ? 'aboutFrame' : 'rest';
  })() as 'active' | 'rest' | 'aboutFrame' | 'hidden';

  return (
    <>
      {/* Marcos decorativos (solo desktop ≥1280px) */}
      {!isMobileView && <CornerFrames frameState={frameState} />}

      <div className="relative min-h-screen">
        <AnimatePresence mode="wait" initial>
          {!appReady ? (
            <motion.div
              key="loader"
              className="loader-container fixed inset-0 overflow-hidden bg-background"
              initial={{ opacity: 1 }}
              animate={{ opacity: loaderFramesReleased ? 0 : 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 1.6, ease: ANIMATION_TIMING.EASE_OUT_EXPO }}
            >
              {/* Telón del loader */}
              <motion.div
                className="absolute inset-0 z-0 bg-background"
                style={{ originX: 0.5 }}
                initial={{ scaleX: 1, opacity: 1 }}
                animate={{
                  scaleX: loaderFramesReleased ? 0 : 1,
                  opacity: loaderFramesReleased ? 0 : 1,
                }}
                transition={{ duration: 1.6, ease: ANIMATION_TIMING.EASE_OUT_EXPO }}
              />

              {/* Animación del loader */}
              <motion.div
                className="relative z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: loaderFramesReleased ? 0.95 : 1,
                  opacity: loaderFramesReleased ? 0 : 1,
                }}
                transition={{
                  scale: loaderFramesReleased 
                    ? { duration: 1.4, ease: ANIMATION_TIMING.EASE_OUT_EXPO }
                    : { duration: 1.2, delay: 1.4, ease: ANIMATION_TIMING.EASE_OUT_BACK },
                  opacity: loaderFramesReleased
                    ? { duration: 1.4, ease: ANIMATION_TIMING.EASE_OUT_QUINT }
                    : { duration: 1.2, delay: 1.4, ease: ANIMATION_TIMING.EASE_OUT_QUINT },
                }}
              >
                <div className="loader">
                  <LoaderSpans />
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="app" 
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: contentCanAnimate ? 1 : 0, 
                y: contentCanAnimate ? 0 : 20 
              }}
              transition={{ duration: 0.8, delay: 0.2, ease: ANIMATION_TIMING.EASE_OUT_QUINT }}
            >
              {isMobileView ? (
                <MobileView contentCanAnimate={contentCanAnimate || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('forceAnim') === '1')} />
              ) : (
                <DesktopView
                  onSectionTransitionChange={setSectionTransitioning}
                  onSectionChange={setCurrentSectionIndex}
                  prefersReducedMotion={prefersReducedMotion}
                  contentCanAnimate={contentCanAnimate || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('forceAnim') === '1')}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
