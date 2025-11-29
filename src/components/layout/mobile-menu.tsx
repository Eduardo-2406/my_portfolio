"use client";

import React, { memo, useCallback } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { AnimatedHamburger } from '../ui/animated-hamburger';
import type { NavItem } from '@/lib/nav-links';

type MobileMenuProps = {
  navItems: readonly NavItem[];
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
};

const contentVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
} as const;

const motionTransition = { duration: 0.28, ease: 'easeInOut' } as const;

type MenuContentProps = {
  isOpen: boolean;
  navItems: readonly NavItem[];
  setIsOpen: (isOpen: boolean) => void;
};

const MenuContent = memo(function MenuContent({ isOpen, navItems, setIsOpen }: MenuContentProps) {
  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="mobile-menu"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={motionTransition}
          className="w-full overflow-hidden lg:hidden border-b"
          aria-hidden={!isOpen}
        >
          <nav className="flex flex-col items-center space-y-1 text-center p-4" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleClose}
                className="text-lg font-medium text-foreground p-3 rounded-md w-full"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

const MobileMenuRoot = memo(function MobileMenu({ isMenuOpen, setIsMenuOpen }: Omit<MobileMenuProps, 'navItems'>) {
  const toggle = useCallback(() => setIsMenuOpen(!isMenuOpen), [setIsMenuOpen, isMenuOpen]);

  return (
    <div className="lg:hidden">
      <AnimatedHamburger isOpen={isMenuOpen} onClick={toggle} aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'} />
    </div>
  );
});

type MenuWithContent = typeof MobileMenuRoot & { Content: typeof MenuContent };
const MobileMenu = MobileMenuRoot as MenuWithContent;
MobileMenu.Content = MenuContent;

export { MobileMenu };
