/**
 * animations.ts — Central GSAP animation controller
 * Imported once in BaseLayout. Handles all page animations
 * and properly integrates with Astro View Transitions.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Utilities ────────────────────────────────────────────────────────────────

function q(selector: string, ctx: Element | Document = document): Element | null {
  return ctx.querySelector(selector);
}

function qa(selector: string, ctx: Element | Document = document): Element[] {
  return Array.from(ctx.querySelectorAll(selector));
}

// ── Cleanup ───────────────────────────────────────────────────────────────────

function cleanup(): void {
  ScrollTrigger.getAll().forEach((t) => t.kill());
  gsap.killTweensOf('*');
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function animateHero(): void {
  const hero = q('#hero');
  if (!hero) return;

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  // Badge
  tl.fromTo('#hero .hero__badge',
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.6 },
  );

  // Name — split first / last lines
  tl.fromTo('#hero-name .hero__name-first',
    { opacity: 0, x: -40 },
    { opacity: 1, x: 0, duration: 0.9 },
    '-=0.3',
  );
  tl.fromTo('#hero-name .hero__name-last',
    { opacity: 0, x: 40 },
    { opacity: 1, x: 0, duration: 0.9 },
    '-=0.75',
  );

  // Make name wrapper visible after children animated
  tl.set('#hero-name', { opacity: 1 }, '<');

  // Title
  tl.fromTo('#hero-title',
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.7 },
    '-=0.5',
  );

  // Description
  tl.fromTo('#hero-desc',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.7 },
    '-=0.4',
  );

  // CTAs stagger
  tl.fromTo('#hero-ctas',
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.6 },
    '-=0.4',
  );

  // Photo — slide from right
  tl.fromTo('#hero-photo',
    { opacity: 0, x: 40 },
    { opacity: 1, x: 0, duration: 1, ease: 'power3.out' },
    '-=1.0',
  );
}

// ── Projects ──────────────────────────────────────────────────────────────────

function animateProjects(): void {
  const cards = qa('#projects .project-card');
  if (!cards.length) return;

  gsap.fromTo(
    cards,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#projects',
        start: 'top 78%',
        once: true,
      },
    },
  );

  // Section header
  gsap.fromTo(
    '#projects .projects__header',
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#projects',
        start: 'top 85%',
        once: true,
      },
    },
  );
}

// ── Stack ─────────────────────────────────────────────────────────────────────

function animateStack(): void {
  const items = qa('#stack .stack__item');
  if (!items.length) return;

  gsap.fromTo(
    '#stack .stack__category',
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#stack',
        start: 'top 80%',
        once: true,
      },
    },
  );

  gsap.fromTo(
    items,
    { opacity: 0, x: -16 },
    {
      opacity: 1,
      x: 0,
      duration: 0.5,
      stagger: 0.04,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#stack',
        start: 'top 70%',
        once: true,
      },
    },
  );
}

// ── Blog Preview ──────────────────────────────────────────────────────────────

function animateBlog(): void {
  const cards = qa('#blog .blog-card');
  if (!cards.length) return;

  gsap.fromTo(
    '#blog .blog-preview__header',
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#blog',
        start: 'top 85%',
        once: true,
      },
    },
  );

  gsap.fromTo(
    cards,
    { opacity: 0, y: 32 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#blog',
        start: 'top 75%',
        once: true,
      },
    },
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────

function animateContact(): void {
  const section = q('#contact');
  if (!section) return;

  gsap.fromTo(
    '#contact .contact__inner > *',
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 80%',
        once: true,
      },
    },
  );
}

// ── Header scroll class ───────────────────────────────────────────────────────

function animateHeader(): void {
  // Handled by inline JS in Header.astro
  // ScrollTrigger version as progressive enhancement
  const header = q('#site-header');
  if (!header) return;

  ScrollTrigger.create({
    start: 'top -60px',
    onUpdate: (self) => {
      header.classList.toggle('header--scrolled', self.progress > 0);
    },
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────

function init(): void {
  // Refresh ScrollTrigger after DOM update
  ScrollTrigger.refresh();

  animateHero();
  animateProjects();
  animateStack();
  animateBlog();
  animateContact();
  animateHeader();
}

// Astro View Transitions: cleanup before swap, re-init after load
document.addEventListener('astro:before-swap', cleanup);
document.addEventListener('astro:page-load', init);

// Initial page load (no View Transition on first visit)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
