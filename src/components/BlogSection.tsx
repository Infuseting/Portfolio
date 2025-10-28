import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from '../contexts/LanguageContext';
import { blogPosts } from '../data/blogData';

interface BlogSectionProps {
  onViewAll: () => void;
  onSelectPost: (postId: string) => void;
}

export function BlogSection({ onViewAll, onSelectPost }: BlogSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { language, t } = useLanguage();

  // Afficher seulement les 3 derniers articles (triés par date décroissante)
  const recentPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = language === 'fr' ? 'fr-FR' : 'en-US';
    return date.toLocaleDateString(locale, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  if (recentPosts.length === 0) {
    return null; 
  }
  return (
    <section id="blog" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">{t('blog.title')}</h2>
            <Button
              variant="ghost"
              onClick={onViewAll}
              className="hover:bg-gray-100"
            >
              {t('blog.viewAll')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <p className="text-gray-600">{t('blog.latestSubtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
            >
              <Card 
                className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group border-gray-200 h-full flex flex-col"
                onClick={() => onSelectPost(post.id)}
              >
                <div className="overflow-hidden">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title[language] || post.title.en}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      <Tag className="w-3 h-3 mr-1" />
                      {post.category[language] || post.category.en}
                    </Badge>
                  </div>
                  <CardTitle className="group-hover:text-gray-600 transition-colors">
                    {post.title[language] || post.title.en}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {post.description[language] || post.description.en}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{post.readTime} {t('blog.readTime')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
