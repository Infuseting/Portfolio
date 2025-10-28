import { motion } from 'motion/react';
import { Linkedin } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { TypeWriter } from './TypeWriter';

export function HeroSection() {
  const { t, tArray } = useLanguage();

  const title = t('hero.title');
  const description1 = t('hero.description1');
  const description2 = t('hero.description2');
  const phrases = tArray('hero.phrases');

  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
          
            <div className="mb-4 text-4xl">
              <TypeWriter phrases={phrases} />
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {description1}
            </p>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {description2}
            </p>

            <Button
              className="bg-gray-900 hover:bg-gray-700 text-white transition-all duration-300 px-6"
              onClick={() => window.open(t('footer.social.linkedin') || 'https://linkedin.com/in/serretarthur', '_blank')}
            >
              <Linkedin className="w-4 h-4 mr-2" />
              {t('hero.cta')}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="w-48 h-48 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="70" r="30" fill="#E5E7EB" />
                <rect x="70" y="100" width="60" height="80" rx="30" fill="#E5E7EB" />
                <line x1="70" y1="120" x2="50" y2="160" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
                <line x1="130" y1="120" x2="150" y2="160" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
                <line x1="85" y1="180" x2="85" y2="220" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
                <line x1="115" y1="180" x2="115" y2="220" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
