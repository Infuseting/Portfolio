import { motion } from 'motion/react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { blogPosts } from '../data/blogData';

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-gray-900 hover:text-gray-600 transition-colors"
        >
          {t('hero.name')}
        </button>
        
        <nav className="flex gap-6 items-center">
          <button 
            onClick={() => scrollToSection('projects')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            {t('nav.projects')}
          </button>
          {blogPosts.length > 0 && (
            <button 
              onClick={() => scrollToSection('blog')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t('nav.blog')}
            </button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Languages className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50">
              <DropdownMenuItem onClick={() => setLanguage('fr')}>
                🇫🇷 Français
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                🇬🇧 English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
        </nav>
      </div>
    </motion.header>
  );
}
