import type { Course } from "@/components/course-platform"

export const coursesData: Course[] = [
  {
    id: "1",
    title: "React Avançado: Hooks, Context e Performance",
    description: "Domine os conceitos avançados do React e construa aplicações de alta performance",
    instructor: "Lucas Monteiro",
    thumbnail: "/react-programming-code-blue.jpg",
    progress: 75,
    totalLessons: 42,
    completedLessons: 31,
    category: "Desenvolvimento",
    modules: [
      {
        id: "m1",
        title: "Fundamentos de Hooks",
        lessons: [
          { id: "l1", title: "Introdução aos Hooks", duration: "12:30", completed: true },
          { id: "l2", title: "useState na prática", duration: "18:45", completed: true },
          { id: "l3", title: "useEffect e ciclo de vida", duration: "22:10", completed: true },
          { id: "l4", title: "useRef e manipulação do DOM", duration: "15:20", completed: false },
        ],
      },
      {
        id: "m2",
        title: "Context API",
        lessons: [
          { id: "l5", title: "Criando Contexts", duration: "14:00", completed: false },
          { id: "l6", title: "useContext hook", duration: "16:30", completed: false },
          { id: "l7", title: "Patterns de Context", duration: "20:15", completed: false },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "TypeScript Completo: Do Básico ao Avançado",
    description: "Aprenda TypeScript do zero e eleve a qualidade do seu código JavaScript",
    instructor: "Marina Costa",
    thumbnail: "/typescript-programming-blue-dark.jpg",
    progress: 45,
    totalLessons: 38,
    completedLessons: 17,
    category: "Desenvolvimento",
    modules: [
      {
        id: "m1",
        title: "Introdução ao TypeScript",
        lessons: [
          { id: "l1", title: "O que é TypeScript?", duration: "10:00", completed: true },
          { id: "l2", title: "Configurando o ambiente", duration: "15:30", completed: true },
          { id: "l3", title: "Tipos básicos", duration: "18:20", completed: true },
          { id: "l4", title: "Interfaces e Types", duration: "22:45", completed: false },
        ],
      },
      {
        id: "m2",
        title: "Tipos Avançados",
        lessons: [
          { id: "l5", title: "Generics", duration: "25:00", completed: false },
          { id: "l6", title: "Utility Types", duration: "20:30", completed: false },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "Next.js 14: Aplicações Full Stack",
    description: "Construa aplicações modernas com Next.js, Server Components e App Router",
    instructor: "Rafael Oliveira",
    thumbnail: "/nextjs-web-development-dark.jpg",
    progress: 20,
    totalLessons: 56,
    completedLessons: 11,
    category: "Desenvolvimento",
    modules: [
      {
        id: "m1",
        title: "Fundamentos do Next.js",
        lessons: [
          { id: "l1", title: "Introdução ao Next.js 14", duration: "14:00", completed: true },
          { id: "l2", title: "App Router vs Pages Router", duration: "18:30", completed: true },
          { id: "l3", title: "Server Components", duration: "24:15", completed: false },
        ],
      },
    ],
  },
  {
    id: "4",
    title: "UI/UX Design: Criando Interfaces Incríveis",
    description: "Aprenda os princípios de design e crie interfaces que encantam usuários",
    instructor: "Camila Duarte",
    thumbnail: "/ui-ux-design-colorful-modern.jpg",
    progress: 0,
    totalLessons: 48,
    completedLessons: 0,
    category: "Design",
    modules: [
      {
        id: "m1",
        title: "Fundamentos de UX",
        lessons: [
          { id: "l1", title: "O que é UX Design?", duration: "12:00", completed: false },
          { id: "l2", title: "Pesquisa com usuários", duration: "20:30", completed: false },
          { id: "l3", title: "Personas e jornadas", duration: "18:45", completed: false },
        ],
      },
    ],
  },
  {
    id: "5",
    title: "Marketing Digital para Desenvolvedores",
    description: "Aprenda a promover seus projetos e construir sua marca pessoal",
    instructor: "Fernanda Lima",
    thumbnail: "/digital-marketing-social-media.png",
    progress: 0,
    totalLessons: 32,
    completedLessons: 0,
    category: "Marketing",
    modules: [
      {
        id: "m1",
        title: "Marca Pessoal",
        lessons: [
          { id: "l1", title: "Construindo sua presença online", duration: "16:00", completed: false },
          { id: "l2", title: "LinkedIn para devs", duration: "14:30", completed: false },
        ],
      },
    ],
  },
  {
    id: "6",
    title: "Node.js: APIs RESTful com Express",
    description: "Crie APIs robustas e escaláveis com Node.js e Express",
    instructor: "André Santos",
    thumbnail: "/nodejs-server-api-green.jpg",
    progress: 0,
    totalLessons: 44,
    completedLessons: 0,
    category: "Desenvolvimento",
    modules: [
      {
        id: "m1",
        title: "Introdução ao Node.js",
        lessons: [
          { id: "l1", title: "O que é Node.js?", duration: "10:00", completed: false },
          { id: "l2", title: "NPM e gerenciamento de pacotes", duration: "12:30", completed: false },
        ],
      },
    ],
  },
]
