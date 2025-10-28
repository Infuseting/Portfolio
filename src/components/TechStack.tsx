import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FaReact, FaDatabase, FaDocker, FaPython, FaRust, FaPhp } from 'react-icons/fa';
import { DiJava } from 'react-icons/di';
import { TbBrandTypescript } from "react-icons/tb";
import { BiLogoCPlusPlus } from "react-icons/bi";

const technologies = [
  { name: 'React', icon: <FaReact /> },
  { name: 'Java', icon: <DiJava /> },
  { name: 'SQL', icon: <FaDatabase /> },
  { name: 'Docker', icon: <FaDocker /> },
  { name: 'TypeScript', icon: <TbBrandTypescript /> },
  { name: 'Python', icon: <FaPython /> },
  { name: 'Rust', icon: <FaRust /> },
  { name: 'C', icon: <BiLogoCPlusPlus /> },
  { name: 'PHP' , icon: <FaPhp /> },
];

export function TechStack() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { t } = useLanguage();

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-gray-900 mb-4">{t('techStack.title')}</h2>
          <p className="text-gray-600">{t('techStack.subtitle')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-6"
        >
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="flex flex-col items-center gap-2 p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 min-w-[120px]"
            >
              <span className="text-4xl">{tech.icon}</span>
              <span className="text-gray-700">{tech.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
