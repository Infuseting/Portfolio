import { Github, Linkedin, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function FooterSimple() {
  const { t } = useLanguage();

  const copyright = t('footer.copyright');
  const github = t('footer.social.github') || 'https://github.com/serretarthur';
  const linkedin = t('footer.social.linkedin') || 'https://linkedin.com/in/serretarthur';
  const email = t('footer.social.email') || 'arthur.serret@example.com';

  return (
    <footer className="py-12 px-6 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500">
            {copyright}
          </p>

          <div className="flex gap-6">
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-900 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-900 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${email}`}
              className="text-gray-400 hover:text-gray-900 transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
