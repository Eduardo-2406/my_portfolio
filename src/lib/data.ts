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
      'Proyecto académico de práctica profesional: plataforma de inventario diseñada para optimizar la gestión interna de la empresa Kolping, reducir errores derivados del manejo manual de información y ofrecer una visión más clara y confiable de sus operaciones.',
    image: 'project1',
    tags: ['C#', 'SQL Server'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 'proj2',
    title: 'Cafetería Web',
    description:
      'Proyecto académico de cafetería web que digitaliza pedidos y facturación: donde los clientes realizan sus pedidos en línea y reciben su factura en PDF por correo electrónico, mientras el personal administra y actualiza el estado de cada pedido desde un panel centralizado.',
    image: 'project2',
    tags: ['PHP', 'Sass', 'JavaScript', 'MySQL'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 'proj3',
    title: 'Plataforma de Ciberseguridad',
    description:
      'Plataforma educativa de ciberseguridad desarrollada como proyecto de tesis para una empresa, enfocada en vulnerabilidades, fortalecer el conocimiento, la conciencia y la cultura de ciberseguridad de los empleados, ayudando a la empresa a reforzar la infraestructura tecnológica, inspirada en buenas prácticas como el marco NIST.',
    image: 'project3',
    tags: ['React', 'Tailwind CSS', 'Firebase', 'JavaScript', 'HTML5', 'CSS', 'Framer Motion'],
    liveUrl: '#',
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
  github: '#',
  linkedin: '#',
  whatsapp: '#',
  cv: '/cv.pdf',
} as const;

export type SocialPlatform = keyof typeof socialLinks;
