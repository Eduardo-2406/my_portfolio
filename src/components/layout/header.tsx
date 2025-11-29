"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import Link from 'next/link';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { cn } from '@/lib/utils';
import { MobileMenu } from './mobile-menu';
import { navItems } from '@/lib/nav-links';
import { CrossedLLogo } from '@/components/ui/crossed-l-logo';

export const Header = memo(function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;
    window.requestAnimationFrame(() => {
      setIsScrolled(window.scrollY > 10);
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // initialize state based on current scroll position without causing a sync setState
    const rafId = window.requestAnimationFrame(() => setIsScrolled(window.scrollY > 10));
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.cancelAnimationFrame(rafId);
    };
  }, [handleScroll]);

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-colors duration-300',
        isScrolled || isMenuOpen ? 'bg-background/80 backdrop-blur-sm' : 'bg-transparent'
      )}
    >
      <div
        className={cn(
          'container mx-auto flex h-16 items-center justify-between px-4 md:px-6',
          isMenuOpen ? '' : 'border-b'
        )}
      >
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <span className="xl:hidden">
            <CrossedLLogo size={32} />
          </span>
          <span className="hidden xl:inline text-xl font-bold tracking-tighter text-foreground font-headline">
            Junior R.
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="text-[#5C9993] dark:text-primary">
            <ThemeToggleButton />
          </div>

          <div className="lg:hidden">
            <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          </div>
        </div>
      </div>

      <MobileMenu.Content isOpen={isMenuOpen} navItems={navItems} setIsOpen={setIsMenuOpen} />
    </header>
  );
});
