export const languages = {
  fr: 'Français',
  en: 'English',
};

export const defaultLang = 'fr';

export const ui = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.activity': 'Activité',
    'nav.contact': 'Contact',
    'nav.projects': 'Projets',
    'nav.journey': 'Parcours',
    'nav.aria_label': 'Navigation principale',
    'nav.menu': 'Menu',
    'a11y.skip': 'Aller au contenu',
    'loading.page': 'Chargement de la page',
    'error.not_translated': "La traduction n'existe pas.",
    'button.back_home': "Retour à l'accueil",
    'breadcrumb.label': "Fil d'Ariane",
    'projects.live': 'Voir en direct',
    'projects.source': 'Code source',
    
    // 404
    '404.title': 'Page Introuvable',
    '404.description': "La page que vous recherchez n'existe pas ou a été déplacée.",
    '404.message': "Oops ! La page que vous cherchez a disparu dans le cyberespace.",

    // Site & Meta
    'site.tagline': 'Software Engineer · Alternant',
    'site.locale': 'fr_FR',
    'site.meta_description': "Arthur SERRET | Software Engineer en alternance (Sopra Steria & ENSICAEN). À la recherche d'un stage à l'étranger (min. 9 semaines) avant 2029.",

    // Hero
    'hero.badge': "Alternant · stage à l'étranger recherché",
    'hero.title.1': 'Software',
    'hero.title.2': 'Engineer',
    'hero.description': "Ingénieur logiciel en alternance chez Sopra Steria et étudiant à l'ENSICAEN en cybersécurité et monétique. Je travaille sur des applications métier, des interfaces et des projets open source.",
    'hero.cv': 'CV ↓',
    'hero.contact': 'Me contacter →',
    'hero.internship': 'Mon projet de stage →',
    
    // Activity Section
    'activity.section_label': 'Activité & Algorithmes',
    'activity.title': 'Contributions & Algorithmes',

    // Metrics | Communs
    'metrics.days': 'jours',
    'metrics.day': 'jour',

    // Metrics | Git Activity Card
    'metrics.git.total_global': 'Total global',
    'metrics.git.avg_per_week': 'Moy. / semaine',
    'metrics.git.active_streak': 'Streak actif',
    'metrics.git.max': 'Max',
    'metrics.git.active_days': 'Jours actifs',
    'metrics.git.peak': 'Record',
    'metrics.git.contributions': 'Contributions',
    'metrics.git.today': " (Aujourd'hui)",
    'metrics.git.hover_day': 'Survolez un jour',
    'metrics.git.in_year': 'en',
    'metrics.git.per_month': '/ mois',
    'metrics.git.less': 'Moins',
    'metrics.git.more': 'Plus',

    // Metrics | LeetCode Card
    'metrics.leetcode.global_rank': 'Rang mondial',
    'metrics.leetcode.solved': 'résolus',
    'metrics.leetcode.acceptance_rate': 'Taux de succès',
    'metrics.leetcode.active_streak': 'Streak actif',

    // Projects
    'projects.section_label': 'Projets sélectionnés',
    'projects.title': "Des projets, pas une liste de technos",
    'projects.intro': "Chaque projet est documenté par son contexte, mon rôle et les décisions techniques qui lui donnent sa forme.",
    'projects.open': 'Ouvrir le dossier',
    'projects.back': 'Retour aux projets',
    'projects.other': 'Autres travaux',
    'projects.gallery': 'Images du projet',
    'projects.technologies': 'Technologies',
    'projects.status.live': 'Disponible',
    'projects.status.wip': 'En construction',
    'projects.status.archived': 'Archivé',
    'projects.empty': 'Les projets arrivent bientôt.',
    'projects.footer': 'Retrouvez mes autres projets sur',
    'projects.footer.github': 'mon GitHub',
    
    // Stack
    'stack.heading': 'Mon stack',
    'stack.title': 'Technologies',

    // Journey
    'journey.section_label': 'Parcours',
    'journey.title': 'Expériences & formation',
    'journey.experience': 'Expériences',
    'journey.education': 'Diplômes',
    'journey.education_and_certifications': 'Diplômes et certifications',
    'journey.current': 'En cours',
    'journey.in_progress': 'En cours',
    'journey.subjects': 'Domaines étudiés',
    'journey.certifications': 'Certifications',
    'journey.certification_example': 'Exemple — non obtenue',
    'journey.credential_id': 'ID :',
    'journey.expires': 'Expiration :',
    'journey.verify': 'Vérifier la certification',
    
    // Contact
    'contact.badge': 'Contact',
    'contact.title': 'Travaillons ensemble',
    'contact.description': "Une opportunité de stage, un projet ou une question ? Écrivez-moi directement, je serai ravi d'en discuter.",
    'contact.email': 'serretarthur@gmail.com',
    'contact.linkedin': 'LinkedIn',
    'contact.github': 'GitHub',

    // Projects badges
    'project.wip': 'En cours',
    'project.featured': 'À la une',
    // Footer
    'footer.role': 'Software Engineer · Alternant',
    'footer.cv': 'CV ↓',
    'footer.rights': 'Tous droits réservés.',
    'footer.built': 'Construit avec',
    'footer.socials_label': 'Réseaux sociaux',
    'footer.legal': 'Mentions légales',
    'footer.privacy': 'Confidentialité',
    'footer.accessibility': 'Accessibilité : partiellement conforme',
    'footer.telemetry.title': 'Télémétrie en direct',
    'footer.telemetry.analytics': 'Web Analytics',
    'footer.telemetry.analytics_active': 'Actif · Cookieless',
    'footer.telemetry.analytics_tooltip': 'Vercel Web Analytics : Télémétrie anonymisée sans cookies conforme RGPD',
    'footer.telemetry.speed_insights': 'Speed Insights',
    'footer.telemetry.views': 'vues',
    'footer.telemetry.visitors': 'visiteurs',
    'footer.telemetry.analytics_data_tooltip': 'Statistiques Vercel Web Analytics (pages vues et visiteurs uniques)',
    'footer.telemetry.ttfb_title': 'Time to First Byte (Temps de réponse serveur)',
    'footer.telemetry.lcp_title': 'Largest Contentful Paint (Temps de chargement principal)',
    'footer.telemetry.cls_title': 'Cumulative Layout Shift (Stabilité visuelle)',
    'footer.telemetry.inp_title': 'Interaction to Next Paint (Réactivité aux interactions)',
    'footer.telemetry.good': 'Bon',
    'footer.telemetry.needs_improvement': 'Améliorable',
    'footer.telemetry.poor': 'Médiocre',
    'footer.telemetry.measuring': 'Mesure...',
    'footer.telemetry.waiting_interaction': 'En attente d’interaction',

    // Legal & Compliance
    'legal.breadcrumb_home': 'Accueil',
    'legal.last_updated': 'Dernière mise à jour :',
    'legal.date': 'Octobre 2026',
    'legal.table_of_contents': 'Sommaire de la page',
    'legal.back_to_top': 'Haut de page ↑',
    'legal.page_title': 'Mentions Légales',
    'legal.page_desc': 'Mentions légales obligatoires régissant le site infuseting.fr conformément à la loi LCEN.',
    'privacy.page_title': 'Politique de Confidentialité',
    'privacy.page_desc': 'Protection des données personnelles et respect de la vie privée (RGPD & directive ePrivacy).',
    'accessibility.page_title': "Déclaration d'Accessibilité",
    'accessibility.page_desc': "Déclaration de conformité aux normes d'accessibilité numérique (European Accessibility Act & RGAA).",
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.activity': 'Activity',
    'nav.contact': 'Contact',
    'nav.projects': 'Projects',
    'nav.journey': 'Journey',
    'nav.aria_label': 'Main navigation',
    'nav.menu': 'Menu',
    'a11y.skip': 'Skip to content',
    'loading.page': 'Loading page',
    'error.not_translated': 'The translation does not exist.',
    'button.back_home': 'Back to Home',
    'breadcrumb.label': 'Breadcrumb',
    'projects.live': 'Live Demo',
    'projects.source': 'Source Code',

    // 404
    '404.title': 'Page Not Found',
    '404.description': "The page you're looking for doesn't exist or has been moved.",
    '404.message': "Oops! The page you're looking for has vanished into cyberspace.",

    // Site & Meta
    'site.tagline': 'Software Engineer · Apprentice',
    'site.locale': 'en_GB',
    'site.meta_description': 'Arthur SERRET | Apprentice Software Engineer (Sopra Steria & ENSICAEN). Seeking an international internship (9+ weeks) before 2029.',

    // Hero
    'hero.badge': 'Software engineering apprentice · seeking an internship abroad',
    'hero.title.1': 'Software',
    'hero.title.2': 'Engineer',
    'hero.description': "Software engineering apprentice at Sopra Steria and ENSICAEN, studying cybersecurity and payment systems. I work on business applications, interfaces, and open-source projects.",
    'hero.cv': 'Resume ↓',
    'hero.contact': 'Contact me →',
    'hero.internship': 'My internship brief →',
    
    // Activity Section
    'activity.section_label': 'Activity & Algorithms',
    'activity.title': 'Contributions & Algorithms',

    // Metrics | Common
    'metrics.days': 'days',
    'metrics.day': 'day',

    // Metrics | Git Activity Card
    'metrics.git.total_global': 'All-time total',
    'metrics.git.avg_per_week': 'Avg / week',
    'metrics.git.active_streak': 'Streak',
    'metrics.git.max': 'Max',
    'metrics.git.active_days': 'Active days',
    'metrics.git.peak': 'Peak',
    'metrics.git.contributions': 'Contributions',
    'metrics.git.today': ' (Today)',
    'metrics.git.hover_day': 'Hover a day',
    'metrics.git.in_year': 'in',
    'metrics.git.per_month': '/ month',
    'metrics.git.less': 'Less',
    'metrics.git.more': 'More',

    // Metrics | LeetCode Card
    'metrics.leetcode.global_rank': 'Global rank',
    'metrics.leetcode.solved': 'solved',
    'metrics.leetcode.acceptance_rate': 'Acceptance rate',
    'metrics.leetcode.active_streak': 'Active streak',

    // Projects
    'projects.section_label': 'Selected work',
    'projects.title': 'Projects, not a technology list',
    'projects.intro': 'Each project documents its context, my role and the technical decisions that shaped it.',
    'projects.open': 'Open case file',
    'projects.back': 'Back to projects',
    'projects.other': 'Other work',
    'projects.gallery': 'Project images',
    'projects.technologies': 'Technologies',
    'projects.status.live': 'Available',
    'projects.status.wip': 'In progress',
    'projects.status.archived': 'Archived',
    'projects.empty': 'Projects coming soon.',
    'projects.footer': 'Find my other projects on',
    'projects.footer.github': 'my GitHub',
    
    // Stack
    'stack.heading': 'My stack',
    'stack.title': 'Technologies',

    // Journey
    'journey.section_label': 'Journey',
    'journey.title': 'Experience & education',
    'journey.experience': 'Experience',
    'journey.education': 'Degrees',
    'journey.education_and_certifications': 'Degrees and certifications',
    'journey.current': 'Current',
    'journey.in_progress': 'In progress',
    'journey.subjects': 'Subjects',
    'journey.certifications': 'Certifications',
    'journey.certification_example': 'Example — not earned',
    'journey.credential_id': 'ID:',
    'journey.expires': 'Expires:',
    'journey.verify': 'Verify credential',
    
    // Contact
    'contact.badge': 'Contact',
    'contact.title': "Let's connect",
    'contact.description': "Have an internship opportunity, a project, or a question? Send me a note and let's talk.",
    'contact.email': 'serretarthur@gmail.com',
    'contact.linkedin': 'LinkedIn',
    'contact.github': 'GitHub',

    // Projects badges
    'project.wip': 'In progress',
    'project.featured': 'Featured',
    // Footer
    'footer.role': 'Software Engineer · Apprentice',
    'footer.cv': 'Resume ↓',
    'footer.rights': 'All rights reserved.',
    'footer.built': 'Built with',
    'footer.socials_label': 'Social media',
    'footer.legal': 'Legal Notice',
    'footer.privacy': 'Privacy Policy',
    'footer.accessibility': 'Accessibility: partially compliant',
    'footer.telemetry.title': 'Live Telemetry',
    'footer.telemetry.analytics': 'Web Analytics',
    'footer.telemetry.analytics_active': 'Active · Cookieless',
    'footer.telemetry.analytics_tooltip': 'Vercel Web Analytics: Anonymized cookieless telemetry complying with GDPR',
    'footer.telemetry.speed_insights': 'Speed Insights',
    'footer.telemetry.views': 'views',
    'footer.telemetry.visitors': 'visitors',
    'footer.telemetry.analytics_data_tooltip': 'Vercel Web Analytics stats (page views and unique visitors)',
    'footer.telemetry.ttfb_title': 'Time to First Byte (Server response latency)',
    'footer.telemetry.lcp_title': 'Largest Contentful Paint (Main content render latency)',
    'footer.telemetry.cls_title': 'Cumulative Layout Shift (Visual stability)',
    'footer.telemetry.inp_title': 'Interaction to Next Paint (UI responsiveness)',
    'footer.telemetry.good': 'Good',
    'footer.telemetry.needs_improvement': 'Needs improvement',
    'footer.telemetry.poor': 'Poor',
    'footer.telemetry.measuring': 'Measuring...',
    'footer.telemetry.waiting_interaction': 'Waiting for interaction',

    // Legal & Compliance
    'legal.breadcrumb_home': 'Home',
    'legal.last_updated': 'Last updated:',
    'legal.date': 'October 2026',
    'legal.table_of_contents': 'Table of contents',
    'legal.back_to_top': 'Back to top ↑',
    'legal.page_title': 'Legal Notice',
    'legal.page_desc': 'Mandatory legal notices governing infuseting.fr in compliance with French LCEN regulations.',
    'privacy.page_title': 'Privacy Policy',
    'privacy.page_desc': 'Personal data protection and privacy policy (GDPR & ePrivacy directive).',
    'accessibility.page_title': 'Accessibility Statement',
    'accessibility.page_desc': 'Digital accessibility compliance statement (European Accessibility Act & WCAG).',
  },
} as const;
