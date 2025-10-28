import { useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
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
  // Home component renders the landing page sections
  function Home() {
    const navigate = useNavigate();

    const handleViewAllBlogs = () => {
      navigate('/blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSelectPost = (postId: string) => {
      navigate(`/blog/${postId}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
      <>
        <main>
          <HeroSection />
          <ProjectsSection />
          <BlogSection onViewAll={handleViewAllBlogs} onSelectPost={handleSelectPost} />
          <TechStack />
          <Journey />
          <FinalCTA />
        </main>
      </>
    );
  }

  function BlogPageRoute() {
    const navigate = useNavigate();
    const handleBackToHome = () => {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleSelectPost = (postId: string) => {
      navigate(`/blog/${postId}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return <BlogPage onBack={handleBackToHome} onSelectPost={handleSelectPost} />;
  }

  function BlogPostRoute() {
    const { id } = useParams();
    const navigate = useNavigate();
    const handleBackToBlog = () => {
      navigate('/blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return <BlogPostPage postId={id ?? ''} onBack={handleBackToBlog} />;
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogPageRoute />} />
          <Route path="/blog/:id" element={<BlogPostRoute />} />
        </Routes>

        <FooterSimple />
      </div>
    </LanguageProvider>
  );
}
