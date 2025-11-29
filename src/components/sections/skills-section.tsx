"use client";

import React, { useMemo, memo, type ReactNode } from 'react';
import { skills, type Skill } from '@/lib/data';
import { TechIcon } from '../tech-icon';
import { motion, cubicBezier, useAnimation } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const ease = cubicBezier(0.22, 1, 0.36, 1);
const entranceEase = cubicBezier(0.25, 0.46, 0.45, 0.94);
// hoverEase removed: icon hover now uses CSS transform transitions (Tailwind) instead of framer-motion ease

// Categorización de habilidades (constante estática)
const skillCategories: Record<'frontend'|'backend', string[]> = {
  frontend: ['JavaScript', 'React', 'Next.js', 'Tailwind CSS', 'HTML5', 'CSS'],
  backend: ['Node.js', 'Firebase', 'PostgreSQL', 'C#', 'SQL Server'],
};

const getSkillLevel = (level: number): string => {
  if (level >= 50) return 'Intermedio';
  if (level >= 30) return 'Básico+';
  return 'Básico';
};

// helper removed: delays handled per-group via `groupDelay` passed to SkillCard

const cardItemVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: cubicBezier(0.34, 1.56, 0.64, 1) } },
} as const;

// containerVariants removed (unused)

const headerContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0 } },
} as const;

const headerItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: entranceEase } },
} as const;

const SkillCard = memo(function SkillCard({ name, level, parentVisible = false, entryDelay }: Skill & { parentVisible?: boolean } & { entryDelay?: number }) {
  const levelLabel = getSkillLevel(level);
  const isMobile = useIsMobile();
  // groupDelay available for future tuning; not used directly here
  return (
    <motion.div
      className="group relative"
      initial={'hidden'}
      variants={cardItemVariants}
      animate={!isMobile ? (parentVisible ? 'visible' : 'hidden') : undefined}
      transition={!isMobile && entryDelay !== undefined ? { delay: entryDelay, duration: 0.34, ease: cubicBezier(0.34, 1.56, 0.64, 1) } : undefined}
      whileInView={isMobile ? 'visible' : undefined}
      viewport={isMobile ? { once: true, amount: 0.18 } : undefined}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="relative h-full rounded-lg border border-foreground/10 bg-card/50 p-3">
        {/* Progress bar en el borde superior */}
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg overflow-hidden bg-foreground/5">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-primary to-primary/70"
            variants={{ hidden: { width: 0 }, visible: { width: `${level}%`, transition: { duration: 1.0, ease: entranceEase } } }}
          />
        </div>

        {/* No hover beam: solo movimiento del icono en hover */}
        
        <div className="relative flex flex-col items-center gap-3 text-center group">
          {/* Icono: animación activada al hacer hover en la card (clase group) */}
          <div className="relative transform transition-transform duration-300 group-hover:-translate-y-1">
            <TechIcon name={name} className="h-9 w-9 text-foreground transition-transform duration-300" />
          </div>

          {/* Nombre de la tecnología y badge: centrados y sin hover que afecte al layout */}
          <div className="space-y-1 text-center py-1">
            <h3 className={`font-semibold text-foreground transition-colors duration-200 ${name === 'Node.js' ? 'text-lg lg:text-xl' : 'text-base'}`}>{name}</h3>
            <span className={`inline-block px-2 py-0.5 ${levelLabel === 'Básico' ? 'text-sm' : 'text-[10px]'} font-medium rounded-md bg-foreground/5 text-foreground/60`}>{levelLabel}</span>
          </div>
        </div>

        {/* Decorative bottom line removed to avoid persistent 'glow' look */}
      </div>
    </motion.div>
  );
});

type SkillsSectionProps = {
  children?: ReactNode;
  isCompact?: boolean;
  footerVisible?: boolean;
  setBlockNavigation?: (value: boolean) => void;
  navigate?: (index: number) => void;
  currentSection?: number;
  parentContentVisible?: boolean;
  contentCanAnimate?: boolean;
};

export const SkillsSection = memo(function SkillsSection({ parentContentVisible }: SkillsSectionProps) {
  // Organizar skills por categoría (skills es un import estático)
  const frontendSkills = useMemo(() => skills.filter(skill => skillCategories.frontend.includes(skill.name as string)), []);
  const backendSkills = useMemo(() => skills.filter(skill => skillCategories.backend.includes(skill.name as string)), []);

  // (Removed old timeout-based states — sequencing handled with animation controls below)

  // Controls and sequence using framer-motion's useAnimation so we can replicate
  // the portfolio desktop sequencing: title -> frontend header/sub -> frontend cards -> backend header/sub -> backend cards
  const isMobile = useIsMobile();
  const mainTitleControls = useAnimation();
  const frontendHeaderControls = useAnimation();
  const frontendCardsControls = useAnimation();
  const backendHeaderControls = useAnimation();
  const backendCardsControls = useAnimation();
  const [frontendCardsStart, setFrontendCardsStart] = React.useState(false);
  const [backendCardsStart, setBackendCardsStart] = React.useState(false);
  // timing constants (sharply reduced for snappier entry)
  const headerDuration = 0.18; // duration used for headerItemVariants
  const cardDuration = 0.34; // duration for card entry
  const cardStagger = 0.035; // per-card stagger
  const titleToCardsBase = 0.04; // base delay between header and first card

  // removed containerVariants (unused)

  // Sequence when parentContentVisible becomes true (desktop)
  React.useEffect(() => {
    (async () => {
      if (!parentContentVisible || isMobile) {
        // reset
        await mainTitleControls.start('hidden');
        await frontendHeaderControls.start('hidden');
        await frontendCardsControls.start('hidden');
        await backendHeaderControls.start('hidden');
        await backendCardsControls.start('hidden');
        return;
      }

      // 1) Main title
      await mainTitleControls.start('visible');

      // 2) Frontend header (title + subtitle)
      await frontendHeaderControls.start('visible');
      // allow frontend cards to start (cards themselves use parentVisible and entryDelay)
      setFrontendCardsStart(true);
      // wait until frontend cards complete before showing backend header
      const frontendCount = Math.max(0, frontendSkills.length);
      const lastFrontendDelay = (headerDuration + titleToCardsBase) + (Math.max(0, frontendCount - 1) * cardStagger);
      const frontendFinishMs = Math.ceil((lastFrontendDelay + cardDuration) * 1000 + 40);
      await new Promise((r) => setTimeout(r, frontendFinishMs));

      // 4) Backend header
      await backendHeaderControls.start('visible');

      // allow backend cards to start
      setBackendCardsStart(true);
      // wait a short moment to let header animation begin
      await new Promise((r) => setTimeout(r, Math.ceil(headerDuration * 1000)));
    })();

    // include animation control instances in deps to satisfy hooks lint rule
  }, [parentContentVisible, isMobile, frontendSkills.length, backendSkills.length, mainTitleControls, frontendHeaderControls, frontendCardsControls, backendHeaderControls, backendCardsControls]);

  return (
    <section id="skills" className="w-full h-full flex flex-col items-center justify-center pt-8 pb-32 sm:pt-12 sm:pb-32 md:pt-16 md:pb-32 lg:pt-16 lg:pb-32 scroll-mt-16">
      <div className="w-full px-4 sm:px-8 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        {/* Título principal */}
        <motion.div className="flex flex-col items-center justify-center space-y-1 text-center mb-12 sm:mb-16 max-w-4xl mx-auto">
          <motion.div style={{ overflow: 'hidden' }}>
            <motion.h2
              style={{ fontSize: 'clamp(1.875rem, 5vw, 3.125rem)' }}
              className="font-bold tracking-tighter font-headline text-foreground z-20"
              initial={{ y: '100%', opacity: 0 }}
              variants={{ hidden: { y: '100%', opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease } } }}
              animate={!isMobile ? mainTitleControls : undefined}
              whileInView={isMobile ? { y: 0, opacity: 1 } : undefined}
              viewport={isMobile ? { once: true, amount: 0.18 } : undefined}
            >
              Habilidades
            </motion.h2>
          </motion.div>
        </motion.div>

        <div className="max-w-7xl mx-auto space-y-12 lg:space-y-16">
          {/* Frontend Section */}
          <div>
            <div className="mb-6">
                <motion.div
                  initial="hidden"
                  variants={headerContainerVariants}
                  animate={!isMobile ? frontendHeaderControls : undefined}
                  whileInView={isMobile ? 'visible' : undefined}
                  viewport={isMobile ? { once: true, amount: 0.18 } : undefined}
                >
                  <motion.div className="text-2xl lg:text-3xl font-bold text-foreground mb-2 flex items-center gap-3" variants={headerItemVariants}>
                    <span className="inline-block w-1 h-6 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
                    Frontend Development
                  </motion.div>
                  <motion.div className="text-base lg:text-lg text-muted-foreground ml-7" variants={headerItemVariants} transition={{ duration: 0.38, delay: 0.06, ease }}>
                    Diseño y desarrollo de interfaces de usuario
                  </motion.div>
                </motion.div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6">
              {frontendSkills.map((skill, idx) => (
                  // entryDelay: base + idx*stagger (base chosen to follow header timing)
                  <SkillCard key={skill.name} {...skill} parentVisible={frontendCardsStart} entryDelay={(headerDuration + titleToCardsBase) + idx * cardStagger} />
                ))}
            </div>
          </div>

          {/* Backend Section */}
          <div>
            <div className="mb-6">
              <motion.div
                initial="hidden"
                variants={headerContainerVariants}
                animate={!isMobile ? backendHeaderControls : undefined}
                whileInView={isMobile ? 'visible' : undefined}
                viewport={isMobile ? { once: true, amount: 0.18 } : undefined}
              >
                <motion.div className="text-2xl lg:text-3xl font-bold text-foreground mb-2 flex items-center gap-3" variants={headerItemVariants} transition={{ duration: 0.36, delay: 0.06 }}>
                  <span className="inline-block w-1 h-6 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
                  Backend & Database
                </motion.div>
                <motion.div className="text-base lg:text-lg text-muted-foreground ml-7" variants={headerItemVariants} transition={{ duration: 0.38, delay: 0.08 }}
                  whileInView={isMobile ? 'visible' : undefined}
                  viewport={isMobile ? { once: true, amount: 0.18 } : undefined}
                >
                  Servidores, APIs y gestión de datos
                </motion.div>
              </motion.div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
              {backendSkills.map((skill, idx) => (
                // backend entryDelay base later than frontend (to keep sequence)
                <SkillCard key={skill.name} {...skill} parentVisible={backendCardsStart} entryDelay={(headerDuration + titleToCardsBase) + (frontendSkills.length * cardStagger) + idx * cardStagger} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
