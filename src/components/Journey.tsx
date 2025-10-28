import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Experience {
  id: number;
  title: {
    fr: string;
    en: string;
  };
  company: {
    fr: string;
    en: string;
  };
  period: string;
  description: {
    fr: string;
    en: string;
  };
}

const experiences: Experience[] = [
  {
    id: 2,
    title: {
      fr: 'Développeur Java x Gestion de Projet',
      en: 'Java Developer x Project Management'
    },
    company: {
      fr: 'InvasionZ - Benevole',
      en: 'InvasionZ - Volunteer'
    },
    period: 'June 2024 - Now',
    description: {
      fr: 'Développement de plugin Java pour InvasionZ. Gestion de projet avec un groupe de developpeur. J\'ai notamment travaillé sur la planification, la répartition des tâches, et la communication entre les membres de l\'équipe. Le developpement de plugin inclut des fonctionnalités comme des evénements en jeu ou le rework des IAs des zombies.',
      en: 'Java plugin development for InvasionZ. Project management with a group of developers. I worked on planning, task distribution, and communication between team members. Plugin development includes features like in-game events and reworking zombie AIs.'
    }
  },
  {
    id: 3,
    title: {
      fr: 'BUT Informatique',
      en: 'Bachelor in Computer Science'
    },
    company: {
      fr: 'Université de Caen',
      en: 'University of Caen'
    },
    period: 'Sept 2024 - June 2027',
    description: {
      fr: 'Multiples projets de groupes de développement web, java, c. Ainsi que rappelle des bases de ces 3 langages.',
      en: 'Multiple group projects in web development, Java, C. Also revisiting the basics of these 3 languages.'
    }
  },
  {
    id: 4,
    title: {
      fr: 'Lycée - Bac NSI/Physique-Chimie/Maths Options Maths Expertes',
      en: 'High School - NSI/Physics-Chemistry/Maths with Advanced Maths Options'
    },
    company: {
      fr: 'Lycée Les Fontenelles',
      en: 'Les Fontenelles High School'
    },
    period: 'Sept 2020 - June 2024',
    description: {
      fr: 'Premiers pas en programmation avec Python (malgré des compétences en Java / C / Web / SQL)',
      en: 'First steps in programming with Python (despite skills in Java / C / Web / SQL)'
    }
  },
];

export function Journey() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { language, t } = useLanguage();

  return (
    <section id="parcours" className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-gray-900 mb-4">{t('journey.title')}</h2>
          <p className="text-gray-600">{t('journey.subtitle')}</p>
        </motion.div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="flex gap-6 group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-900 transition-colors duration-300">
                <Calendar className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
              </div>

              <div className="flex-grow pb-8 border-b border-gray-200 last:border-0">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                  <div>
                    <h3 className="text-gray-900 mb-1">{exp.title[language] || exp.title.en}</h3>
                    <p className="text-gray-600">{exp.company[language] || exp.company.en}</p>
                  </div>
                  <span className="text-gray-400 whitespace-nowrap">{exp.period}</span>
                </div>
                <p className="text-gray-600 leading-relaxed">{exp.description[language] || exp.description.en}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
