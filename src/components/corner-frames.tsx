"use client";

import { motion, type Transition } from 'framer-motion';
import { memo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

type FrameState = 'active' | 'rest' | 'aboutFrame' | 'hidden';

interface CornerFramesProps {
  frameState: FrameState;
}

// Transición base consistente para todos los estados
// Acortamos duraciones para que los marcos no se queden tanto tiempo en el centro.
const baseTransition: Transition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1] as const,
};

// Transición para el estado active con delay reducido
// Menor delay y duración más rápida para que el centro sea breve y la sensación sea ágil.
const activeTransition: Transition = {
  duration: 0.45,
  // Aumentamos el delay para que el contenido tenga tiempo de desaparecer
  // antes de que los marcos empiecen a moverse al centro.
  delay: 0.4,
  ease: [0.22, 1, 0.36, 1] as const,
};

// Variantes con transición incluida en cada estado
const cornerFrameVariants = {
  topLeft: {
    hidden: {
      x: 0,
      y: 0,
      scale: 0,
      opacity: 0,
      transition: baseTransition,
    },
    rest: {
      x: 0,
      y: 0,
      scale: 1.35,
      opacity: 1,
      transition: baseTransition,
    },
    aboutFrame: {
      x: '20vw',
      y: '15vh',
      scale: 1.6,
      opacity: 1,
      transition: baseTransition,
    },
    active: {
      x: '42vw',
      y: '42vh',
      scale: 2,
      opacity: 1,
      transition: activeTransition,
    },
  },
  bottomRight: {
    hidden: {
      x: 0,
      y: 0,
      scale: 0,
      opacity: 0,
      transition: baseTransition,
    },
    rest: {
      x: 0,
      y: 0,
      scale: 1.35,
      opacity: 1,
      transition: baseTransition,
    },
    aboutFrame: {
      x: '-20vw',
      y: '-15vh',
      scale: 1.6,
      opacity: 1,
      transition: baseTransition,
    },
    active: {
      x: '-42vw',
      y: '-42vh',
      scale: 2,
      opacity: 1,
      transition: activeTransition,
    },
  },
} as const;

// Estilos fuera del render para evitar recrearlos cada vez
const TOP_LEFT_STYLE = { originX: 0, originY: 0, pointerEvents: 'none' } as const;
const BOTTOM_RIGHT_STYLE = { originX: 1, originY: 1, pointerEvents: 'none' } as const;

export const CornerFrames = memo(function CornerFrames({ frameState }: CornerFramesProps) {
  const isMobile = useIsMobile();

  // Don't mount the large decorative frames on mobile to avoid
  // unnecessary renders and motion setup (they're already hidden via CSS).
  if (isMobile) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden xl:block" aria-hidden>
      {/* Marco superior izquierdo */}
      <motion.div
        className="absolute top-0 left-0 h-44 w-44 sm:h-52 sm:w-52"
        variants={cornerFrameVariants.topLeft}
        initial={false}
        layout={false}
        animate={frameState}
        style={TOP_LEFT_STYLE}
      >
        <div className="relative h-full w-full">
          <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-primary/80 via-primary/60 to-transparent" />
          <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-primary/80 via-primary/60 to-transparent" />
        </div>
      </motion.div>

      {/* Marco inferior derecho */}
      <motion.div
        className="absolute bottom-0 right-0 h-44 w-44 sm:h-52 sm:w-52"
        variants={cornerFrameVariants.bottomRight}
        initial={false}
        layout={false}
        animate={frameState}
        style={BOTTOM_RIGHT_STYLE}
      >
        <div className="relative h-full w-full">
          <div className="absolute right-0 bottom-0 h-full w-2 bg-gradient-to-t from-primary/80 via-primary/60 to-transparent" />
          <div className="absolute right-0 bottom-0 h-2 w-full bg-gradient-to-l from-primary/80 via-primary/60 to-transparent" />
        </div>
      </motion.div>
    </div>
  );
});

(CornerFrames as unknown as { displayName?: string }).displayName = 'CornerFrames';
