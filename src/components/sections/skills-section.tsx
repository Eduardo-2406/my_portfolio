"use client";

import React, { memo } from 'react';
import { TechIcon } from '../tech-icon';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { wrap } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { CheckCircle2, Workflow, Bug, User, FolderTree, Shield, Database, Boxes, ChevronLeft, ChevronRight } from 'lucide-react';

const analysisSkills = [
  { name: 'Análisis funcional', icon: CheckCircle2 },
  { name: 'Definición de flujos de usuario', icon: Workflow },
  { name: 'Validación de funcionalidades', icon: CheckCircle2 },
  { name: 'Detección de errores lógicos', icon: Bug },
  { name: 'Pensamiento orientado al usuario', icon: User },
];

const systemsDesignSkills = [
  { name: 'Estructuración de proyectos', icon: FolderTree },
  { name: 'Organización de carpetas', icon: FolderTree },
  { name: 'Definición de roles y permisos', icon: Shield },
  { name: 'Reglas de negocio', icon: Database },
  { name: 'Arquitectura básica de aplicaciones', icon: Boxes },
];

const technologies = [
  { name: 'HTML5' },
  { name: 'CSS' },
  { name: 'JavaScript' },
  { name: 'TypeScript' },
  { name: 'React' },
  { name: 'Next.js' },
  { name: 'Tailwind CSS' },
  { name: 'Firebase' },
  { name: 'SQL Server' },
  { name: 'C#' },
  { name: 'PostgreSQL' },
  { name: 'MySQL' },
  { name: 'Git' },
  { name: 'GitHub' },
];

type SkillsSectionProps = {
  parentContentVisible?: boolean;
  contentCanAnimate?: boolean;
};

// Item de lista simple para habilidades
const SkillListItem = memo(function SkillListItem({ 
  name, 
  icon: Icon, 
  index
}: { 
  name: string; 
  icon: React.ComponentType<{ className?: string }>; 
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 + (index * 0.05), duration: 0.4 }}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-foreground/5 transition-colors group"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-base sm:text-lg text-foreground/90 font-medium leading-tight">{name}</p>
    </motion.div>
  );
});

// Item simple para tecnologías
const TechItem = memo(function TechItem({ 
  name 
}: { 
  name: string; 
}) {
  return (
    <div className="flex flex-col items-center gap-2 group p-2 rounded-xl transition-colors duration-300">
      <div className="p-3 rounded-2xl bg-foreground/5 group-hover:bg-foreground/10 transition-colors duration-300 backdrop-blur-sm shadow-sm">
        <TechIcon name={name as import('../tech-icon').TechName} className="h-8 w-8 text-foreground/80 group-hover:text-foreground transition-all duration-300 group-hover:scale-110" />
      </div>
      <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center">{name}</span>
    </div>
  );
});

const carouselVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
    scale: 0.98
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0,
    scale: 0.98
  })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export const SkillsSection = memo(function SkillsSection({ parentContentVisible }: SkillsSectionProps) {
  const isMobile = useIsMobile();
  const mainTitleControls = useAnimation();
  
  // Carousel State
  const [[page, direction], setPage] = React.useState([0, 0]);
  const slidesCount = 3;
  const slideIndex = wrap(0, slidesCount, page);

  const [isMounted, setIsMounted] = React.useState(false);
  const animationRef = React.useRef<boolean>(false);
  const autoplayRef = React.useRef<NodeJS.Timeout | null>(null);

  // Define autoplay functions before useEffect
  const startAutoplay = React.useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setPage(prev => [prev[0] + 1, 1]);
    }, 12000); // 12 seconds
  }, []);

  const stopAutoplay = React.useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  }, []);

  const resetAutoplay = React.useCallback(() => {
    stopAutoplay();
    startAutoplay();
  }, [stopAutoplay, startAutoplay]);

  React.useEffect(() => {
    setIsMounted(true);
    if (!isMobile) {
      startAutoplay();
    }
    return () => stopAutoplay();
  }, [isMobile, startAutoplay, stopAutoplay]);

  const paginate = React.useCallback((newDirection: number) => {
    setPage([page + newDirection, newDirection]);
    resetAutoplay();
  }, [page, resetAutoplay]);

  React.useEffect(() => {
    if (!isMounted) return;
    animationRef.current = true;
    (async () => {
      if (!parentContentVisible || isMobile) {
        if (animationRef.current) await mainTitleControls.start('hidden');
        return;
      }
      if (animationRef.current) await mainTitleControls.start('visible');
    })();
    return () => { animationRef.current = false; };
  }, [isMounted, parentContentVisible, isMobile, mainTitleControls]);

  // Slides Content
  const renderAnalysisSlide = () => (
    <div className="w-full h-full flex flex-col justify-center items-start max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-3xl font-bold text-foreground">Análisis y QA</h3>
          <p className="text-muted-foreground text-lg">Enfoque en validación y experiencia de usuario</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 px-4 md:px-12 w-full">
        {analysisSkills.map((skill, idx) => (
          <SkillListItem key={skill.name} name={skill.name} icon={skill.icon} index={idx} />
        ))}
      </div>
    </div>
  );

  const renderDesignSlide = () => (
    <div className="w-full h-full flex flex-col justify-center items-start max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
          <FolderTree className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-3xl font-bold text-foreground">Diseño de Sistemas</h3>
          <p className="text-muted-foreground text-lg">Estructura y organización de proyectos</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 px-4 md:px-12 w-full">
        {systemsDesignSkills.map((skill, idx) => (
          <SkillListItem key={skill.name} name={skill.name} icon={skill.icon} index={idx} />
        ))}
      </div>
    </div>
  );

  const renderTechSlide = () => (
    <div className="w-full h-full flex flex-col justify-center items-start max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
          <Database className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-3xl font-bold text-foreground">Tecnologías Utilizadas</h3>
          <p className="text-muted-foreground text-lg">Stack técnico en proyectos académicos</p>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 px-4 w-full justify-items-center">
        {technologies.map((tech) => (
          <TechItem key={tech.name} name={tech.name} />
        ))}
      </div>
    </div>
  );

  const slides = [renderAnalysisSlide, renderDesignSlide, renderTechSlide];

  return (
    <section id="skills" className="w-full min-h-screen sm:min-h-0 flex flex-col items-center justify-center pt-8 pb-20 sm:pt-16 sm:pb-32 scroll-mt-16 overflow-hidden">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        
        {/* Título */}
        <motion.div className="flex flex-col items-center justify-center space-y-1 text-center mb-12 sm:mb-16">
          <motion.div style={{ overflow: 'hidden' }}>
            <motion.h2
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
              className="font-bold tracking-tighter font-headline text-foreground z-20"
              initial={{ y: '100%', opacity: 0 }}
              animate={!isMobile ? mainTitleControls : undefined}
              whileInView={isMobile ? { y: 0, opacity: 1 } : undefined}
              viewport={isMobile ? { once: true, amount: 0.3 } : undefined}
              variants={{ hidden: { y: '100%', opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
            >
              Habilidades
            </motion.h2>
          </motion.div>
        </motion.div>

        {isMobile ? (
          /* Mobile: Vertical Stack */
          <div className="flex flex-col gap-8 pb-12">
            {[renderAnalysisSlide(), renderDesignSlide(), renderTechSlide()].map((content, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-secondary/10 backdrop-blur-sm rounded-3xl p-6 border border-foreground/5 shadow-sm"
              >
                {content}
              </motion.div>
            ))}
          </div>
        ) : (
          /* Desktop: Carousel */
          <div className="relative w-full max-w-5xl mx-auto h-[480px] flex items-center justify-center">
            
            {/* Main Content Area */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-3xl bg-secondary/10 backdrop-blur-md border border-foreground/5 shadow-xl">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={page}
                  custom={direction}
                  variants={carouselVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);
                    if (swipe < -swipeConfidenceThreshold) paginate(1);
                    else if (swipe > swipeConfidenceThreshold) paginate(-1);
                  }}
                  className="absolute w-full h-full flex items-center justify-center p-8 sm:p-12 cursor-grab active:cursor-grabbing"
                >
                  {slides[slideIndex]()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute inset-y-0 left-[-60px] flex items-center justify-center z-10 w-16">
              <button
                className="p-3 rounded-full bg-secondary/20 hover:bg-secondary/40 text-foreground transition-all transform hover:scale-110 backdrop-blur-sm shadow-lg border border-foreground/5"
                onClick={() => paginate(-1)}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-[-60px] flex items-center justify-center z-10 w-16">
              <button
                className="p-3 rounded-full bg-secondary/20 hover:bg-secondary/40 text-foreground transition-all transform hover:scale-110 backdrop-blur-sm shadow-lg border border-foreground/5"
                onClick={() => paginate(1)}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>

            {/* Pagination Indicators */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-10">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const newDir = idx > slideIndex ? 1 : -1;
                    if (idx !== slideIndex) {
                       setPage([page + (idx - slideIndex), newDir]);
                       resetAutoplay();
                    }
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === slideIndex ? 'bg-primary w-8' : 'bg-foreground/20 hover:bg-foreground/40 w-2'
                  }`}
                />
              ))}
            </div>

          </div>
        )}
      </div>
    </section>
  );
});
