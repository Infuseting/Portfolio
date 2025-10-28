export interface BlogPost {
  id: string;
  title: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
  date: string;
  author: string;
  category: {
    fr: string;
    en: string;
  };
  readTime: string;
  image: string;
  mdFile: {
    fr: string;
    en: string;
  };
}

export const blogPosts: BlogPost[] = [
  {
    id: "how-create-mcp-server",
    title: {
      fr: "Comment j'ai crée mon premier serveur MCP",
      en: "How I Created My First MCP Server",
    },
    description: {
      fr: "Découvrez les étapes que j'ai suivies pour créer et déployer mon propre serveur MCP, de la configuration initiale à la mise en ligne.",
      en: "Discover the steps I took to create and deploy my own MCP server, from initial setup to going live.",
    },
    date: "2025-10-28",
    author: "Serret Arthur",
    category: {
      fr: "MCP",
      en: "MCP",
    },
    readTime: "10",
    image: "/assets/posts/images/how-create-mcp-server.png",
    mdFile: {
      fr: "/assets/posts/fr/how-create-mcp-server.md",
      en: "/assets/posts/en/how-create-mcp-server.md",
    },
  }
  /*{
    id: "intro-react-hooks",
    title: {
      fr: "Introduction aux React Hooks",
      en: "Introduction to React Hooks"
    },
    description: {
      fr: "Découvrez comment les hooks ont révolutionné la façon d'écrire des composants React et pourquoi ils sont devenus indispensables.",
      en: "Discover how hooks revolutionized the way we write React components and why they have become essential."
    },
    date: "2024-10-15",
    author: "Serret Arthur",
    category: {
      fr: "React",
      en: "React"
    },
    readTime: "5",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    mdFile: {
      fr: "/assets/posts/intro-react-hooks.md",
      en: "/assets/posts/en/intro-react-hooks.md"
    }
  },
  {
    id: "spring-boot-api-rest",
    title: {
      fr: "Créer une API REST avec Spring Boot",
      en: "Building a REST API with Spring Boot"
    },
    description: {
      fr: "Guide complet pour construire une API REST performante et sécurisée avec Spring Boot et Spring Security.",
      en: "Complete guide to building a performant and secure REST API with Spring Boot and Spring Security."
    },
    date: "2024-09-28",
    author: "Serret Arthur",
    category: {
      fr: "Backend",
      en: "Backend"
    },
    readTime: "8",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    mdFile: {
      fr: "/assets/posts/spring-boot-api-rest.md",
      en: "/assets/posts/en/spring-boot-api-rest.md"
    }
  },
  {
    id: "typescript-best-practices",
    title: {
      fr: "TypeScript : Bonnes pratiques 2024",
      en: "TypeScript: Best Practices 2024"
    },
    description: {
      fr: "Les meilleures pratiques pour écrire du code TypeScript maintenable et type-safe dans vos projets modernes.",
      en: "Best practices for writing maintainable and type-safe TypeScript code in your modern projects."
    },
    date: "2024-08-12",
    author: "Serret Arthur",
    category: {
      fr: "TypeScript",
      en: "TypeScript"
    },
    readTime: "6",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
    mdFile: {
      fr: "/assets/posts/typescript-best-practices.md",
      en: "/assets/posts/en/typescript-best-practices.md"
    }
  },
  {
    id: "docker-pour-debutants",
    title: {
      fr: "Docker pour les débutants",
      en: "Docker for Beginners"
    },
    description: {
      fr: "Comprendre les concepts de base de Docker et comment containeriser vos applications facilement.",
      en: "Understanding the basics of Docker and how to easily containerize your applications."
    },
    date: "2024-07-05",
    author: "Serret Arthur",
    category: {
      fr: "DevOps",
      en: "DevOps"
    },
    readTime: "7",
    image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800",
    mdFile: {
      fr: "/assets/posts/docker-pour-debutants.md",
      en: "/assets/posts/en/docker-pour-debutants.md"
    }
  }*/
];
