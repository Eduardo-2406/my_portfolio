"use client";

import { memo, useMemo, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SocialIcon } from '../social-icon';
import { socialLinks, type SocialPlatform } from '@/lib/data';
import { motion } from 'framer-motion';
import type { NavItem } from '@/lib/nav-links';

const CURRENT_YEAR = new Date().getFullYear();

const columnAnim = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.45, delay } } });

// removed unused social variants

type FooterProps = { onNavigate?: (href: NavItem['href']) => void };

export const Footer = memo(function Footer({ onNavigate }: FooterProps = {}) {
  const navLinks = useMemo(() => [
    { label: 'Sobre Mí', href: '#about' as const },
    { label: 'Proyectos', href: '#portfolio' as const },
    { label: 'Habilidades', href: '#skills' as const },
    { label: 'Contacto', href: '#contact' as const },
  ], []);

  const platforms = useMemo(() => Object.keys(socialLinks) as Array<keyof typeof socialLinks>, []);

  const handleNavClick = useCallback((href: NavItem['href']) => (e: React.MouseEvent) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  }, [onNavigate]);

  const isMobile = useIsMobile();
  return (
    <footer className="relative h-full border-t border-foreground/10 bg-[#DFE5EA] dark:bg-[#0E1016]">
      <div className="w-full h-full mx-auto px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20 py-8 md:py-10 flex flex-col justify-center gap-8 md:gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 items-start">
          {/* Columna 1: Info */}
          <motion.div
            initial={isMobile ? { opacity: 0, y: 24 } : columnAnim(0).initial}
            whileInView={isMobile ? { opacity: 1, y: 0 } : undefined}
            viewport={isMobile ? { once: true, amount: 0.18 } : undefined}
            animate={!isMobile ? columnAnim(0).animate : undefined}
            transition={{ duration: 0.45, delay: isMobile ? 0.04 : 0 }}
            className="space-y-6 md:space-y-4"
          >
            <motion.h3 initial={isMobile ? { opacity: 0, y: 18 } : undefined} whileInView={isMobile ? { opacity: 1, y: 0 } : undefined} viewport={isMobile ? { once: true, amount: 0.18 } : undefined} transition={{ duration: 0.38, delay: isMobile ? 0.08 : 0 }} className="text-lg font-bold font-headline text-foreground">Eduardo R.</motion.h3>
            <motion.p initial={isMobile ? { opacity: 0, y: 18 } : undefined} whileInView={isMobile ? { opacity: 1, y: 0 } : undefined} viewport={isMobile ? { once: true, amount: 0.18 } : undefined} transition={{ duration: 0.38, delay: isMobile ? 0.14 : 0 }} className="text-xs text-foreground max-w-xs">Me gusta pensar en cómo debería funcionar un sistema antes de construirlo. Analizo flujos, defino reglas y valido que todo tenga sentido.</motion.p>
            <motion.p initial={isMobile ? { opacity: 0, y: 18 } : undefined} whileInView={isMobile ? { opacity: 1, y: 0 } : undefined} viewport={isMobile ? { once: true, amount: 0.18 } : undefined} transition={{ duration: 0.38, delay: isMobile ? 0.18 : 0 }} className="text-xs text-foreground/80">¿Tienes un proyecto en mente? ¡Hablemos!</motion.p>
          </motion.div>

          {/* Columna 2: Navegación */}
          <motion.div
            initial={isMobile ? { opacity: 0, y: 24 } : columnAnim(0.08).initial}
            whileInView={isMobile ? { opacity: 1, y: 0 } : undefined}
            viewport={isMobile ? { once: true, amount: 0.18 } : undefined}
            animate={!isMobile ? columnAnim(0.08).animate : undefined}
            transition={{ duration: 0.45, delay: isMobile ? 0.12 : 0.08 }}
            className="space-y-6 md:space-y-4"
          >
            <motion.h4 initial={isMobile ? { opacity: 0, y: 18 } : undefined} whileInView={isMobile ? { opacity: 1, y: 0 } : undefined} viewport={isMobile ? { once: true, amount: 0.18 } : undefined} transition={{ duration: 0.38, delay: isMobile ? 0.16 : 0 }} className="text-sm font-semibold text-foreground uppercase tracking-wider">Navegación</motion.h4>
            <nav className="flex flex-col space-y-3 md:space-y-2" aria-label="Enlaces rápidos">
              {navLinks.map((item, idx) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick(item.href)}
                  initial={isMobile ? { opacity: 0, y: 16 } : undefined}
                  whileInView={isMobile ? { opacity: 1, y: 0 } : undefined}
                  viewport={isMobile ? { once: true, amount: 0.18 } : undefined}
                  transition={{ duration: 0.32, delay: isMobile ? 0.18 + idx * 0.08 : 0 }}
                  className="text-sm text-foreground/80 hover:text-foreground transition-colors w-fit cursor-pointer"
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>

          {/* Columna 3: Social */}
          <motion.div
            initial={isMobile ? { opacity: 0, y: 24 } : columnAnim(0.16).initial}
            whileInView={isMobile ? { opacity: 1, y: 0 } : undefined}
            viewport={isMobile ? { once: true, amount: 0.18 } : undefined}
            animate={!isMobile ? columnAnim(0.16).animate : undefined}
            transition={{ duration: 0.45, delay: isMobile ? 0.18 : 0.16 }}
            className="space-y-5 md:space-y-3"
          >
            <motion.h4 initial={isMobile ? { opacity: 0, y: 18 } : undefined} whileInView={isMobile ? { opacity: 1, y: 0 } : undefined} viewport={isMobile ? { once: true, amount: 0.18 } : undefined} transition={{ duration: 0.38, delay: isMobile ? 0.22 : 0 }} className="text-sm font-semibold text-foreground uppercase tracking-wider">Conecta Conmigo</motion.h4>
            <motion.ul className="flex items-center gap-4 md:gap-3 flex-wrap" aria-label="Redes sociales">
              {platforms.map((platform, idx) => (
                <motion.li
                  key={platform}
                  initial={isMobile ? { opacity: 0, scale: 0.8, y: 12 } : undefined}
                  whileInView={isMobile ? { opacity: 1, scale: 1, y: 0 } : undefined}
                  viewport={isMobile ? { once: true, amount: 0.18 } : undefined}
                  transition={{ duration: 0.32, delay: isMobile ? 0.24 + idx * 0.08 : 0 }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="lg:w-auto w-auto"
                >
                  <SocialIcon 
                    platform={platform as SocialPlatform} 
                    url={socialLinks[platform]} 
                    variant="lateral"
                    className="lg:hidden"
                  />
                  <SocialIcon 
                    platform={platform as SocialPlatform} 
                    url={socialLinks[platform]} 
                    variant="footer"
                    className="hidden lg:block"
                  />
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>

        <motion.div
          initial={isMobile ? { opacity: 0, y: 18 } : { opacity: 0 }}
          whileInView={isMobile ? { opacity: 1, y: 0 } : undefined}
          viewport={isMobile ? { once: true, amount: 0.18 } : undefined}
          animate={!isMobile ? { opacity: 1 } : undefined}
          transition={{ duration: 0.45, delay: isMobile ? 0.32 : 0.28 }}
          className="border-t border-foreground/10 pt-6 md:pt-4"
        >
          <div className="flex flex-col md:flex-row items-center md:justify-center justify-between gap-2 text-xs text-foreground/60">
            <motion.p initial={isMobile ? { opacity: 0, y: 10 } : undefined} whileInView={isMobile ? { opacity: 1, y: 0 } : undefined} viewport={isMobile ? { once: true, amount: 0.18 } : undefined} transition={{ duration: 0.32, delay: isMobile ? 0.34 : 0 }}>
              © {CURRENT_YEAR} Eduardo R.
            </motion.p>
            <motion.p initial={isMobile ? { opacity: 0, y: 10 } : undefined} whileInView={isMobile ? { opacity: 1, y: 0 } : undefined} viewport={isMobile ? { once: true, amount: 0.18 } : undefined} transition={{ duration: 0.32, delay: isMobile ? 0.38 : 0 }}>
              Desarrollado con Next.js, React y Tailwind CSS
            </motion.p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
});
