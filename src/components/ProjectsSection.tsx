import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Project {
  id: number;
  name: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
  stack: string;
  image: string;
  link?: string;
}

const projects: Project[] = [
  {
    id: 1,
    name: {
      fr: 'UnicaenEDT',
      en: 'UnicaenEDT'
    },
    description: {
      fr: 'Application Dart / Flutter pour consulter son emploi du temps universitaire de l\'Université de Caen. Synchronisation avec le portail étudiant et notifications personnalisées pour ne jamais manquer un cours.',
      en: 'Dart / Flutter app to view your university timetable from the University of Caen. Syncs with the student portal and offers personalized notifications to never miss a class.'
    },
    stack: 'Dart • PHP (Back-end)',
    image: '/assets/projets/unicaen.png',
    link: 'https://edt.infuseting.fr/'
  },
  {
    id: 2,
    name: {
      fr: 'Jan.AI',
      en: 'Jan.AI'
    },
    description: {
      fr: 'J\'ai contribué au développement de Jan.AI, un chatbot intelligent utilisant l\'IA pour assister les utilisateurs dans diverses tâches. Mon rôle principal a été de développer un agent builder, facilitant la création et la personnalisation d\'agents conversationnels adaptés aux besoins spécifiques des utilisateurs. En parallèle, j\'ai travaillé sur l\'intégration d\'un Hub de MCP permettant de connecter facilement des services externes au chatbot, enrichissant ainsi ses capacités et son utilité.',
      en: 'I contributed to the development of Jan.AI, an intelligent chatbot using AI to assist users in various tasks. My main role was to develop an agent builder, facilitating the creation and customization of conversational agents tailored to specific user needs. Additionally, I worked on integrating an MCP Hub that allows easy connection of external services to the chatbot, thereby enhancing its capabilities and usefulness.'
    },
    stack: 'React • Rust (Tauri)',
    image: '/assets/projets/jan.png',
    link: 'https://github.com/Infuseting/jan'
  },
  {
    id: 3,
    name: {
      fr: 'UnicaenEDT MCP',
      en: 'UnicaenEDT MCP'
    },
    description: {
      fr: 'Serveur MCP (Model Context Protocol) pour intégrer UnicaenEDT et rendre le service compatible avec les assistants IA pour pouvoir interagir vocalement / textuellement avec son emploi du temps universitaire.',
      en: 'Model Context Protocol (MCP) server to integrate UnicaenEDT and make the service compatible with AI assistants, allowing users to interact with their university timetable via voice or text.'
    },
    stack: 'Python • FastMCP (PY)',
    image: '/assets/projets/mcp.png',
    link: 'https://github.com/Infuseting/MCPEdtUnicaen'
  },
  {
    id: 4,
    name: {
      fr: 'InvasionZ - Minecraft Serveur',
      en: 'InvasionZ - Minecraft Server'
    },
    description: {
      fr: 'Serveur Minecraft qui reproduit l\'experience de DayZ avec des mécaniques de survie avancées, un système économique dynamique, et des événements PvP/PvE réguliers pour une immersion totale dans un monde post-apocalyptique.',
      en: 'Minecraft server that recreates the DayZ experience with advanced survival mechanics, a dynamic economy system, and regular PvP/PvE events for total immersion in a post-apocalyptic world.'
    },
    stack: 'Java (Spigot) • SQL',
    image: '/assets/projets/invasionz.png',
    link: 'https://invasionz.net/'
  },
  {
    id: 5,
    name: {
      fr: 'Portfolio - Sarah Mahe',
      en: 'Portfolio - Sarah Mahe'
    },
    description: {
      fr: 'Un portfolio que j\'ai développé pour une amie surtout dans l\'objectif de m\'entrainer dans la creation de sites web modernes et responsives en utilisant les dernières technologies web.',
      en: 'A portfolio I developed for a friend mainly to practice creating modern and responsive websites using the latest web technologies.'
    },
    stack: 'React',
    image: '/assets/projets/sarah.png',
    link: 'https://sarah-portfolio-beta.vercel.app/'
  },
  {
    id: 5,
    name: {
      fr: 'Geoshare - Projet Étudiant',
      en: 'Geoshare - Student Project'
    },
    description: {
      fr: 'Geoshare est une application qui à pour but de placer sur une carte des infrastructures publiques. L\'application a été développée dans le cadre d\'un projet universitaire qui avait pour objectif de construire une application dans un temps limité. Il y a aussi une page d\'administration pour gérer les infrastructures mais qui n\'a pas été fait par moi. (Je me suis occupé de toutes les fonctionnalités sur le /map) ',
      en: 'Geoshare is an application that aims to place public infrastructures on a map. The application was developed as part of a university project that aimed to build an application in a limited time. There is also an administration page to manage the infrastructures but it was not made by me. (I took care of all the features on the /map)'
    },
    stack: 'React • SQL',
    image: '/assets/projets/geoshare.png',
    link: 'https://infraster-r310.vercel.app/'
  },

  
];

function ProjectItem({ project, index }: { project: Project; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const isEven = index % 2 === 0;
  const { language, t } = useLanguage();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="grid lg:grid-cols-2 gap-12 items-center mb-32"
    >
      <div className={isEven ? 'lg:order-1' : 'lg:order-2'}>
        <div className="bg-gray-50 rounded-lg p-1 border border-gray-200">
          <ImageWithFallback
            src={project.image}
            alt={project.name[language] || project.name.en}
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>

      <div className={isEven ? 'lg:order-2' : 'lg:order-1'}>
        <h3 className="mb-4 text-gray-900">{project.name[language] || project.name.en}</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">{project.description[language] || project.description.en}</p>
        <p className="text-gray-400 mb-6">{project.stack}</p>
        {project.link && (
          <a 
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-gray-900 hover:text-gray-600 transition-colors"
          >
            {t('projects.viewProject')} <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { t } = useLanguage();

  return (
    <section id="projects" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-gray-900 mb-4">{t('projects.title')}</h2>
          <p className="text-gray-600">{t('projects.subtitle')}</p>
        </motion.div>

        {projects.map((project, index) => (
          <ProjectItem key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
