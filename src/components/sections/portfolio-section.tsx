"use client";

import Image from 'next/image';
import React, { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';
import { projects } from '@/lib/data';
import { placeholderImages } from '@/lib/placeholder-images';
import type { Project } from '@/lib/data';
import { CtaButton } from '../ui/cta-button';
import { motion, useAnimation } from 'framer-motion';
import { TechIcon, type TechName } from '@/components/tech-icon';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

// Motion-wrapped slot components declared at module scope to preserve stable identity
// Use `motion.create()` per framer-motion deprecation notice
const MotionCardTitle = motion.create(CardTitle);
const MotionCardDescription = motion.create(CardDescription);

type PortfolioSectionProps = {
  onMoreInfoClick?: (project: Project) => void;
  setBlockNavigation?: (value: boolean) => void;
  navigate?: (index: number) => void;
  currentSection?: number;
  children?: React.ReactNode;
  isCompact?: boolean;
  footerVisible?: boolean;
  isMobileOverride?: boolean;
  contentCanAnimate?: boolean;
  contentEnterDelay?: number;
  parentContentVisible?: boolean;
};

import { cubicBezier } from 'framer-motion';

const ease = cubicBezier(0.22, 1, 0.36, 1);
const entranceEase = cubicBezier(0.76, 0, 0.24, 1);
const getFieldTransition = (delay = 0.3, duration = 1, baseDelay = 0) => ({ duration, delay: baseDelay + delay, ease: entranceEase });

const MobileProjectCard = React.memo(function MobileProjectCard({ project, baseDelay = 0 }: { project: Project; baseDelay?: number }) {
  const projectImage = useMemo(
    () => placeholderImages.find((p) => p.id === project.image),
    [project.image],
  );

  // Animaciones progresivas solo para móvil/tablet
  const isMobileTablet = typeof window !== 'undefined' ? window.innerWidth < 1024 : true;

  // motion components are defined at module scope

  return (
    <Card className="overflow-hidden border-foreground/10 bg-card/95 shadow-sm">
        {projectImage && (
        <motion.div
          className="relative w-full aspect-[4/3] overflow-hidden bg-[#CED7DE] dark:bg-[#141926]"
          whileInView={isMobileTablet ? { y: 0, opacity: 1 } : undefined}
          initial={isMobileTablet ? { y: 24, opacity: 0 } : undefined}
          viewport={isMobileTablet ? { once: true, amount: 0.35 } : undefined}
          transition={isMobileTablet ? { duration: 0.6, ease } : undefined}
        >
          <Image
            src={projectImage.imageUrl}
            alt={project.title}
            data-ai-hint={projectImage.imageHint}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-contain"
          />
        </motion.div>
      )}

      <CardHeader className="gap-1.5 pt-4">
        {isMobileTablet ? (
          <>
            <MotionCardTitle
              style={{ fontSize: 'clamp(1.35rem, 5vw, 2rem)' }}
              className="font-headline text-foreground relative z-10"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45, ease, delay: baseDelay }}
            >
              {project.title}
            </MotionCardTitle>
            <MotionCardDescription
              style={{ fontSize: 'clamp(0.85rem, 2.3vw, 0.95rem)' }}
              className="text-muted-foreground mt-2 leading-relaxed relative z-0"
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45, ease, delay: baseDelay + 0.08 }}
            >
              {project.description}
            </MotionCardDescription>
          </>
        ) : (
          <>
            <CardTitle
              style={{ fontSize: 'clamp(1.35rem, 5vw, 2rem)' }}
              className="font-headline text-foreground"
            >
              {project.title}
            </CardTitle>
            <CardDescription
              style={{ fontSize: 'clamp(0.85rem, 2.3vw, 0.95rem)' }}
              className="text-muted-foreground mt-0.5 leading-relaxed"
            >
              {project.description}
            </CardDescription>
          </>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="mb-2">
          {isMobileTablet ? (
            <>
              <motion.h4
                className="text-xs sm:text-sm font-semibold text-foreground/90 mb-1.5"
                whileInView={{ y: 0, opacity: 1 }}
                initial={{ y: 16, opacity: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45, ease, delay: baseDelay + 0.12 }}
              >
                Tecnologías
              </motion.h4>
              <div className="flex flex-wrap gap-1.5 max-w-[22.5rem]">
                {project.tags.map((tag, idx) => (
                  <motion.div
                    key={tag}
                    whileInView={{ scale: 1, opacity: 1 }}
                    initial={{ scale: 0.85, opacity: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.35, delay: baseDelay + 0.18 + idx * 0.04, ease }}
                  >
                    <Badge
                      variant="outline"
                      className="gap-1.5 border-primary/30 bg-primary/5 text-[0.68rem] sm:text-xs"
                    >
                      <TechIcon name={tag as TechName} className="h-4 w-4 text-primary" />
                      <span className="text-foreground font-medium">{tag}</span>
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h4 className="text-xs sm:text-sm font-semibold text-foreground/90 mb-1.5">Tecnologías</h4>
              <div className="flex flex-wrap gap-1.5 max-w-[22.5rem]">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="gap-1.5 border-primary/30 bg-primary/5 text-[0.68rem] sm:text-xs"
                  >
                    <TechIcon name={tag as TechName} className="h-4 w-4 text-primary" />
                    <span className="text-foreground font-medium">{tag}</span>
                  </Badge>
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2 justify-end">
        {isMobileTablet ? (
          <motion.div
            whileInView={{ y: 0, opacity: 1 }}
            initial={{ y: 16, opacity: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, ease, delay: baseDelay + 0.22 }}
            whileHover={{ y: -4, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CtaButton
              className="text-primary"
              onClick={() => {
                window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
              }}
            >
              Ver Demo
            </CtaButton>
          </motion.div>
        ) : (
          <CtaButton
            className="text-primary"
            onClick={() => {
              window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
            }}
          >
            Ver Demo
          </CtaButton>
        )}
      </CardFooter>
    </Card>
  );
});

const SplitViewCard = React.memo(function SplitViewCard({ 
  project,
  isActive,
  baseDelay = 0,
  contentCanAnimate = true,
  parentContentVisible = false,
}: { 
  project: Project;
  isActive: boolean;
  baseDelay?: number;
  contentCanAnimate?: boolean;
  parentContentVisible?: boolean;
}) {
  const projectImage = useMemo(() => placeholderImages.find(p => p.id === project.image), [project.image]);

  // Variants to orchestrate entrance each time `isActive` changes
  const containerVariants = {
    hidden: {},
    visible: () => ({
      transition: { staggerChildren: 0.06, delayChildren: 0 },
    }),
  } as const;

  // Controls to explicitly trigger entrance when parent section becomes active
  const controls = useAnimation();

  useEffect(() => {
    let t: number | undefined;
    // Only start visible when the section's parent content is visible as well
    if (isActive && contentCanAnimate && parentContentVisible) {
      // Parent content is visible; start the card animation immediately
      t = window.setTimeout(() => controls.start('visible'), 0);
    } else {
      controls.start('hidden');
    }

    return () => {
      if (t) window.clearTimeout(t);
    };
  }, [isActive, contentCanAnimate, controls, baseDelay, parentContentVisible]);

  const titleVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: entranceEase } },
  } as const;

  const imageVariants = {
    hidden: { y: 24, opacity: 0, scale: 0.98 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.7, ease: entranceEase } },
  } as const;

  const contentVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: entranceEase } },
  } as const;

  const textLeftVariants = {
    hidden: { x: -24, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: entranceEase } },
  } as const;

  const badgeVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.35, ease: entranceEase } },
  } as const;

  return (
    <motion.div
      className="w-full h-full grid grid-cols-2 gap-6 lg:gap-8"
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      custom={0}
      style={{ pointerEvents: isActive ? 'auto' : 'none' }}
    >
      {/* Columna izquierda - Imagen con tecnologías en la parte inferior */}
      <motion.div
        className="relative flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-[#CED7DE] dark:bg-[#141926]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease }}
      >
        {/* Número de proyecto en esquina superior izquierda - Detrás de la imagen */}
        <motion.div
          className="absolute top-4 left-4 text-6xl lg:text-7xl font-bold text-foreground/10 select-none z-0"
          variants={contentVariants}
          style={{ pointerEvents: 'none' }}
        >
          {String(projects.findIndex(p => p.id === project.id) + 1).padStart(2, '0')}
        </motion.div>

        {/* Imagen */}
        {projectImage && (
          <motion.div className="relative flex-1 overflow-hidden z-10" variants={imageVariants}>
            <div className="relative w-full h-full">
              <Image
                src={projectImage.imageUrl}
                alt={project.title}
                data-ai-hint={projectImage.imageHint}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-contain object-bottom"
              />
            </div>
          </motion.div>
        )}

        {/* Tecnologías en la parte inferior */}
        <motion.div 
          className="p-4 bg-card/95 backdrop-blur-sm border-t border-foreground/10 z-10 relative" 
          variants={contentVariants}
        >
          <h4 className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">Tecnologías Utilizadas</h4>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <motion.div key={tag} variants={badgeVariants}>
                <Badge
                  variant="outline"
                  className="gap-1.5 border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors px-2 py-1"
                >
                  <TechIcon name={tag as TechName} className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium text-foreground">{tag}</span>
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Columna derecha - Información sin tecnologías */}
      <div className="relative flex flex-col justify-center overflow-hidden">
        <motion.div className="space-y-6" variants={containerVariants} custom={baseDelay}>
          {/* Título de la card: slide-up */}
          <motion.div className="space-y-3" variants={titleVariants}>
            <h3 className="text-4xl lg:text-5xl xl:text-6xl font-bold font-headline text-foreground leading-tight">
              {project.title}
            </h3>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
          </motion.div>

          {/* Descripción */}
          <motion.div variants={contentVariants}>
            <motion.p className="text-base lg:text-lg text-muted-foreground leading-relaxed whitespace-pre-line" variants={textLeftVariants}>
              {project.description}
            </motion.p>
          </motion.div>

          {/* Botón CTA */}
          <motion.div className="pt-4" variants={textLeftVariants}>
            <CtaButton
              className="text-primary text-base"
              onClick={() => {
                window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
              }}
            >
              Ver Demo
            </CtaButton>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
});

export const PortfolioSection = memo(function PortfolioSection({ setBlockNavigation, navigate, currentSection, isMobileOverride, contentCanAnimate, contentEnterDelay, parentContentVisible }: PortfolioSectionProps) {
  // `projects` is an imported static array — it's safe to memoize once with an empty deps array
  const visibleProjects = useMemo(() => projects.slice(0, 3), []);
  const [activeIdx, setActiveIdx] = useState(0);
  const animatingRef = useRef(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [handoffDir, setHandoffDir] = useState<1 | -1 | null>(null);
  const hookIsMobile = useIsMobile();
  const isMobile = typeof isMobileOverride === 'boolean' ? isMobileOverride : hookIsMobile;

  const maxIdx = visibleProjects.length - 1;
  const animMs = 300;

  const safeStep = useCallback((dir: 1 | -1) => {
    if (isMobile) return; // En móvil/tablet no usamos navegación de stack
    if (animatingRef.current) return;
    animatingRef.current = true;

    setActiveIdx((prev) => {
      const next = prev + dir;
      if (next < 0) { setHandoffDir(-1); return prev; }
      if (next > maxIdx) { setHandoffDir(1); return prev; }
      return next;
    });

    window.setTimeout(() => {
      animatingRef.current = false;
    }, animMs);
  }, [animMs, isMobile, maxIdx]);

  useEffect(() => {
    if (isMobile) return; // En móvil no bloqueamos navegación global ni usamos teclado
    setBlockNavigation?.(true);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') { e.preventDefault(); safeStep(-1); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); safeStep(1); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      setBlockNavigation?.(false);
    };
  }, [isMobile, safeStep, setBlockNavigation]);

  // Capturar rueda SOLO en desktop real (>=1280px); en móvil/tablet NO interferir
  useEffect(() => {
    // Doble verificación: hook + media query en tiempo real
    if (isMobile) return;
    
    const mediaQuery = window.matchMedia('(min-width: 1280px)');
    if (!mediaQuery.matches) return; // Extra seguridad para tablets
    
    const el = sectionRef.current;
    if (!el) return;
    
    const onWheelCapture = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY > 0) safeStep(1); else safeStep(-1);
    };
    
    el.addEventListener('wheel', onWheelCapture, { passive: false, capture: true });
    return () => el.removeEventListener('wheel', onWheelCapture, { capture: true });
  }, [isMobile, safeStep]);

  useEffect(() => {
    if (handoffDir === null) return;
    const nextIndex = (currentSection ?? 1) + handoffDir;
    // Asegurar que la navegación ocurra post-render para evitar warnings
    requestAnimationFrame(() => {
      navigate?.(nextIndex);
      setHandoffDir(null);
    });
  }, [handoffDir, navigate, currentSection]);

  const sectionClass = useMemo(() => 'w-full h-full flex flex-col items-center justify-center pt-8 pb-24 sm:py-12 md:pt-16 md:pb-24 lg:pt-16 lg:pb-24 scroll-mt-16', []);

  const baseDelay = typeof contentEnterDelay === 'number' ? contentEnterDelay : 0;
  const parentVisible = Boolean(parentContentVisible);

  const handleIndicatorClick = useCallback((i: number) => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    setActiveIdx(i);
    window.setTimeout(() => {
      animatingRef.current = false;
    }, animMs);
  }, [animMs]);

  return (
    <section ref={sectionRef} id="portfolio" className={sectionClass}>
      <div className="w-full px-4 sm:px-8 md:px-8 ipadpro:px-16 lg:px-12 xl:px-16 2xl:px-20">
        <motion.div className="flex flex-col items-center justify-center space-y-1 text-center mb-8 sm:mb-10 max-w-6xl mx-auto ipadpro:max-w-7xl" initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease }}>
          <motion.div style={{ overflow: 'hidden' }}>
            <motion.h2
              style={{ fontSize: 'clamp(1.875rem, 5vw, 3.125rem)' }}
              className="font-bold tracking-tighter font-headline text-foreground relative z-20"
              initial={{ y: 20, opacity: 0 }}
              animate={parentVisible ? { y: 0, opacity: 1 } : undefined}
              whileInView={!parentVisible ? { y: 0, opacity: 1 } : undefined}
              viewport={!parentVisible ? { once: true, amount: 0.35 } : undefined}
              transition={getFieldTransition(0, 0.45, baseDelay)}
            >
              Proyectos
            </motion.h2>
          </motion.div>
        </motion.div>

        {/* Layout responsive: lista vertical en móvil/tablet, stack con parallax en desktop */}
        {isMobile ? (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 ipadpro:grid-cols-2 gap-6 max-w-6xl mx-auto ipadpro:max-w-7xl">
            {visibleProjects.map((project, idx) => (
              <div key={project.id} className="w-full">
                <MobileProjectCard project={project} baseDelay={baseDelay + idx * 0.12} />
              </div>
            ))}
          </div>
        ) : (
          // Desktop: Split View con navegación vertical
          <div className="relative w-full max-w-7xl mx-auto">
            <div className="relative" style={{ height: 'clamp(420px, 55vh, 550px)' }}>
              {/* Contenedor principal */}
              <div className="h-full">
                {visibleProjects.map((project, i) => (
                  <div
                    key={project.id}
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{
                      opacity: i === activeIdx ? 1 : 0,
                      pointerEvents: i === activeIdx ? 'auto' : 'none',
                      zIndex: i === activeIdx ? 10 : 0,
                    }}
                  >
                    <SplitViewCard project={project} isActive={i === activeIdx} baseDelay={baseDelay} contentCanAnimate={Boolean(contentCanAnimate)} parentContentVisible={parentVisible} />
                  </div>
                ))}
              </div>

              {/* Navegación con flechas verticales a la derecha */}
              <div className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-20">
                {/* Botón anterior */}
                <button
                  type="button"
                  onClick={() => safeStep(-1)}
                  disabled={activeIdx === 0}
                  className="rounded-full border border-foreground/20 bg-card/95 backdrop-blur-sm text-foreground/80 p-3 disabled:opacity-30 disabled:cursor-not-allowed hover:text-primary hover:border-primary/60 hover:bg-primary/5 transition-all shadow-lg"
                  aria-label="Proyecto anterior"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>

                {/* Indicadores de proyecto */}
                <div className="flex flex-col gap-2 py-2">
                  {visibleProjects.map((_, i) => (
                    <button key={i} onClick={() => handleIndicatorClick(i)} className="group relative" aria-label={`Ir al proyecto ${i + 1}`}>
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeIdx ? 'bg-primary scale-125' : 'bg-foreground/20 group-hover:bg-foreground/40 group-hover:scale-110'}`} />
                    </button>
                  ))}
                </div>

                {/* Botón siguiente */}
                <button
                  type="button"
                  onClick={() => safeStep(1)}
                  disabled={activeIdx === maxIdx}
                  className="rounded-full border border-foreground/20 bg-card/95 backdrop-blur-sm text-foreground/80 p-3 disabled:opacity-30 disabled:cursor-not-allowed hover:text-primary hover:border-primary/60 hover:bg-primary/5 transition-all shadow-lg"
                  aria-label="Proyecto siguiente"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
});
