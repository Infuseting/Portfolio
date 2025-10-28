import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Button } from './ui/button';
import { Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const { t } = useLanguage();

  return (
    <section className="py-32 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-gray-900 mb-6">
            {t('finalCTA.title')}
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('finalCTA.description')}
          </p>
          <Button 
            size="lg"
            className="bg-gray-900 hover:bg-gray-700 text-white transition-all duration-300 px-8"
            onClick={() => window.location.href = 'mailto:arthur.serret@example.com'}
          >
            <Mail className="w-4 h-4 mr-2" />
            {t('finalCTA.cta')}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
