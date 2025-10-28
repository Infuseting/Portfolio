import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { blogPosts } from '../data/blogData';
import ReactMarkdown from 'react-markdown';

interface BlogPostPageProps {
  postId: string;
  onBack: () => void;
}

export function BlogPostPage({ postId, onBack }: BlogPostPageProps) {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();
  
  const post = blogPosts.find(p => p.id === postId);

  useEffect(() => {
    if (post) {
      setLoading(true);
      const mdFile = post.mdFile[language] || post.mdFile.en;
      fetch(mdFile)
        .then(response => response.text())
        .then(text => {
          setMarkdownContent(text);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error loading markdown:', error);
          if (language !== 'en' && post.mdFile.en) {
            fetch(post.mdFile.en)
              .then(response => response.text())
              .then(text => {
                setMarkdownContent(text);
                setLoading(false);
              })
              .catch(() => {
                setMarkdownContent(`# ${t('blog.errorLoading')}\n\n${t('blog.errorMessage')}`);
                setLoading(false);
              });
          } else {
            setMarkdownContent(`# ${t('blog.errorLoading')}\n\n${t('blog.errorMessage')}`);
            setLoading(false);
          }
        });
    }
  }, [post, language, t]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = language === 'fr' ? 'fr-FR' : 'en-US';
    return date.toLocaleDateString(locale, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('blog.backToBlog')}
          </Button>
          <p className="text-gray-600">{t('blog.notFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-8 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('blog.backToBlog')}
          </Button>

          <div className="mb-8">
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 mb-4">
              {post.category[language] || post.category.en}
            </Badge>
            <h1 className="text-gray-900 mb-4">{post.title[language] || post.title.en}</h1>
            <p className="text-gray-600 mb-6">{post.description[language] || post.description.en}</p>
            
            <div className="flex items-center gap-6 text-gray-500 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{post.readTime} {t('blog.readTime')}</span>
              </div>
              <span className="text-sm">{t('blog.by')} {post.author}</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('blog.loading')}</p>
            </div>
          ) : (
            <div className="prose prose-gray max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-3xl mt-8 mb-4 text-gray-900">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-2xl mt-6 mb-3 text-gray-900">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl mt-4 mb-2 text-gray-900">{children}</h3>,
                  p: ({ children }) => <p className="mb-4 text-gray-600 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="mb-4 ml-6 list-disc text-gray-600">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-4 ml-6 list-decimal text-gray-600">{children}</ol>,
                  li: ({ children }) => <li className="mb-2">{children}</li>,
                  code: ({ className, children, ...props }: any) => {
                    const inline = !className;
                    return inline ? (
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-800" {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4" {...props}>
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => <pre className="mb-4">{children}</pre>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">
                      {children}
                    </blockquote>
                  ),
                  a: ({ children, href }) => (
                    <a href={href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                }}
              >
                {markdownContent}
              </ReactMarkdown>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
