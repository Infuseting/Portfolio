import { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProjectsSection } from './components/ProjectsSection';
import { BlogSection } from './components/BlogSection';
import { BlogPage } from './components/BlogPage';
import { BlogPostPage } from './components/BlogPostPage';
import { TechStack } from './components/TechStack';
import { Journey } from './components/Journey';
import { FinalCTA } from './components/FinalCTA';
import { FooterSimple } from './components/FooterSimple';

type Page = 'home' | 'blog' | 'blog-post';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedPostId, setSelectedPostId] = useState<string>('');

  const handleViewAllBlogs = () => {
    setCurrentPage('blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPost = (postId: string) => {
    setSelectedPostId(postId);
    setCurrentPage('blog-post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToBlog = () => {
    setCurrentPage('blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentPage === 'blog') {
    return (
      <LanguageProvider>
        <div className="min-h-screen bg-white">
          <Header />
          <BlogPage onBack={handleBackToHome} onSelectPost={handleSelectPost} />
          <FooterSimple />
        </div>
      </LanguageProvider>
    );
  }

  if (currentPage === 'blog-post') {
    return (
      <LanguageProvider>
        <div className="min-h-screen bg-white">
          <Header />
          <BlogPostPage postId={selectedPostId} onBack={handleBackToBlog} />
          <FooterSimple />
        </div>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white">
        <Header />
        
        <main>
          <HeroSection />
          <ProjectsSection />
          <BlogSection 
            onViewAll={handleViewAllBlogs}
            onSelectPost={handleSelectPost}
          />
          <TechStack />
          <Journey />
          <FinalCTA />
        </main>
        
        <FooterSimple />
      </div>
    </LanguageProvider>
  );
}
