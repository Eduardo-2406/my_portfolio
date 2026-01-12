import type { TechName } from '@/components/tech-icon';

export type Skill = {
  name: TechName;
  level: number;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: TechName[];
  liveUrl: string;
  githubUrl: string;
};

export const projects: Project[] = [
  {
    id: 'proj1',
    title: 'Sistema de Inventario Kolping',
    description:
      'Proyecto académico de práctica profesional\n\nSistema de inventario general desarrollado como práctica profesional, enfocado en digitalizar procesos que antes se manejaban en Excel. El sistema permite gestionar materiales, equipos, mobiliario, eventos y viajes desde una sola plataforma, con distintos niveles de acceso según el usuario.\n\nMi participación estuvo centrada en el análisis del funcionamiento interno, la definición de flujos, reglas de negocio y la lógica general del sistema.',
    image: 'project1',
    tags: ['C#', 'SQL Server'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 'proj2',
    title: 'Cafetería Web',
    description:
      'Proyecto académico\n\nSistema web para la gestión de pedidos y facturación de una cafetería. Los clientes pueden realizar pedidos en línea y recibir su factura en PDF por correo electrónico, mientras el personal administra y actualiza el estado de los pedidos desde un panel centralizado.\n\nEl proyecto se enfocó en definir flujos claros, validaciones y una experiencia sencilla tanto para clientes como para empleados.',
    image: 'project2',
    tags: ['PHP', 'Sass', 'JavaScript', 'MySQL'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 'proj3',
    title: 'Plataforma de Ciberseguridad',
    description:
      'Proyecto de tesis\n\nPlataforma web educativa desarrollada como proyecto de tesis, orientada a capacitar empleados en temas de ciberseguridad. La plataforma cuenta con módulos de aprendizaje, evaluaciones, sistema de progreso, certificados y elementos de gamificación como puntos y logros.\n\nMi rol se centró en el diseño de la estructura, la lógica de avance, las reglas de aprobación y la experiencia del usuario dentro de la plataforma.',
    image: 'project3',
    tags: ['React', 'Tailwind CSS', 'Firebase', 'JavaScript', 'HTML5', 'CSS', 'Framer Motion'],
    liveUrl: 'https://proyecto-plataforma-ciberseguridad.vercel.app',
    githubUrl: '#',
  },
];

export const skills: Skill[] = [
  // Mapping de niveles:
  // básico = 30, básico→intermedio = 45, intermedio = 60
  { name: 'JavaScript', level: 30 },      // básico llegando a intermedio
  { name: 'React', level: 15 },           // básico
  { name: 'Next.js', level: 15 },         // básico
  { name: 'Node.js', level: 15 },         // básico
  { name: 'Tailwind CSS', level: 45 },    // básico llegando a intermedio
  { name: 'Firebase', level: 15 },        // básico
  { name: 'HTML5', level: 60 },           // intermedio
  { name: 'CSS', level: 60 },            // intermedio
  { name: 'PostgreSQL', level: 25 },      // entre básico e intermedio
  { name: 'C#', level: 20 },              // básico
  { name: 'SQL Server', level: 25 },      // entre básico e intermedio
] as const;

export const socialLinks = {
  github: 'https://github.com/Eduardo-2406',
  linkedin: '#',
  whatsapp: 'https://wa.me/50432056298',
  cv: '/cv.pdf',
} as const;

export type SocialPlatform = keyof typeof socialLinks;
