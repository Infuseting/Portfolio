import { motion } from 'motion/react';
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from '../contexts/LanguageContext';
import { blogPosts } from '../data/blogData';

interface BlogPageProps {
  onBack: () => void;
  onSelectPost: (postId: string) => void;
}

export function BlogPage({ onBack, onSelectPost }: BlogPageProps) {
  const { language, t } = useLanguage();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = language === 'fr' ? 'fr-FR' : 'en-US';
    return date.toLocaleDateString(locale, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('blog.backToHome')}
          </Button>
          
          <h1 className="text-gray-900 mb-4">{t('blog.allArticles')}</h1>
          <p className="text-gray-600">
            {blogPosts.length} {blogPosts.length > 1 ? t('blog.articleCountPlural') : t('blog.articleCount')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
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
    </div>
  );
}
