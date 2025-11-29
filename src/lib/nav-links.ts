export const navItems = [
  { label: 'Sobre Mí', href: '#about' },
  { label: 'Proyectos', href: '#portfolio' },
  { label: 'Habilidades', href: '#skills' },
  { label: 'Contacto', href: '#contact' },
] as const;

export type NavItem = typeof navItems[number];