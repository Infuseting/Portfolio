import { animate, inView } from 'motion';

// The portfolio moves like a set of dossiers being opened: a few decisive
// reveals, each tied to the content it introduces, rather than a page-wide fade.
export function startPageMotion(): () => void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    return () => {};
  }

  const originals = new Map<HTMLElement, string | null>();
  const animations: Array<{ stop: () => void }> = [];
  const observers: Array<() => void> = [];
  const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const compact = window.matchMedia('(max-width: 900px)').matches;

  function prepare(element: HTMLElement | null, styles: Record<string, string>) {
    if (!element) return;
    if (!originals.has(element)) originals.set(element, element.getAttribute('style'));
    for (const [property, value] of Object.entries(styles)) element.style.setProperty(property, value);
  }

  function keep(animation: { stop: () => void }) {
    animations.push(animation);
  }

  function watch(target: HTMLElement | null, enter: () => void, amount = 0.12) {
    if (!target) return;
    const bounds = target.getBoundingClientRect();
    if (bounds.top < window.innerHeight - 48 && bounds.bottom > 0) {
      enter();
      return;
    }
    observers.push(inView(target, enter, { amount, margin: '0px 0px -48px 0px' }));
  }

  function slide(element: HTMLElement | null, from: string, delay = 0, duration = 0.7) {
    if (!element) return;
    keep(animate(element,
      { opacity: [0, 1], transform: [from, 'none'] },
      { duration, delay, ease },
    ));
  }

  function wipe(element: HTMLElement | null, from: string, delay = 0, duration = 0.78) {
    if (!element) return;
    keep(animate(element,
      { opacity: [0, 1], clipPath: [from, 'inset(0 0% 0 0)'] },
      { duration, delay, ease },
    ));
  }

  // Opening scene. On a narrow screen each piece waits for its own viewport
  // entry, so the name cannot finish animating behind the portrait.
  const hero = document.querySelector<HTMLElement>('.hero');
  if (hero) {
    const badge = hero.querySelector<HTMLElement>('.hero__badge');
    const name = hero.querySelector<HTMLElement>('.hero__name');
    const first = hero.querySelector<HTMLElement>('.hero__name-first');
    const last = hero.querySelector<HTMLElement>('.hero__name-last');
    const title = hero.querySelector<HTMLElement>('.hero__title');
    const description = hero.querySelector<HTMLElement>('.hero__description');
    const ctas = hero.querySelector<HTMLElement>('.hero__ctas');
    const portrait = hero.querySelector<HTMLElement>('.hero__photo-frame');

    prepare(badge, { opacity: '0', transform: 'translateX(-18px)' });
    watch(badge, () => slide(badge, 'translateX(-18px)', compact ? 0 : 0.04, 0.48));

    for (const line of [first, last]) prepare(line, { 'clip-path': 'inset(0 0 100% 0)', transform: 'translateY(22px)' });
    watch(name, () => {
      for (const [index, line] of [first, last].entries()) {
        if (!line) continue;
        const delay = compact ? index * 0.1 : 0.12 + index * 0.14;
        keep(animate(line,
          { clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'], transform: ['translateY(22px)', 'none'] },
          { duration: 0.88, delay, ease },
        ));
      }
    });

    prepare(title, { opacity: '0' });
    watch(title, () => wipe(title, 'inset(0 100% 0 0)', compact ? 0 : 0.4, 0.8));

    prepare(description, { opacity: '0', transform: 'translateX(-18px)' });
    watch(description, () => slide(description, 'translateX(-18px)', compact ? 0 : 0.55, 0.58));

    prepare(ctas, { opacity: '0', transform: 'translateY(14px)' });
    watch(ctas, () => slide(ctas, 'translateY(14px)', compact ? 0 : 0.66, 0.56));

    prepare(portrait, { opacity: '0', transform: 'translate(28px, 22px) rotate(3deg) scale(0.94)' });
    watch(portrait, () => {
      if (!portrait) return;
      keep(animate(portrait,
        {
          opacity: [0, 1],
          transform: [
            'translate(28px, 22px) rotate(3deg) scale(0.94)',
            'translate(0px, 0px) rotate(0deg) scale(1)',
          ],
        },
        { duration: 0.92, delay: compact ? 0.04 : 0.24, ease },
      ));
    });
  }

  // Section titles have a quick typographic cut, not a repeated fade-up.
  for (const header of document.querySelectorAll<HTMLElement>(
    '.projects__header, .journey__header, .activity-section__header',
  )) {
    const label = header.querySelector<HTMLElement>('.section-label');
    const heading = header.querySelector<HTMLElement>('h2');
    const note = header.querySelector<HTMLElement>('p');
    prepare(label, { opacity: '0', transform: 'translateX(-16px)' });
    prepare(heading, { opacity: '0' });
    prepare(note, { opacity: '0', transform: 'translateX(18px)' });
    watch(header, () => {
      slide(label, 'translateX(-16px)', 0, 0.42);
      wipe(heading, 'inset(0 0 100% 0)', 0.06, 0.82);
      slide(note, 'translateX(18px)', 0.2, 0.58);
    }, 0.08);
  }

  // Project covers open in the direction of their alternating layout.
  for (const file of document.querySelectorAll<HTMLElement>('.project-file')) {
    const visual = file.querySelector<HTMLElement>('.project-file__visual');
    const content = file.querySelector<HTMLElement>('.project-file__content');
    const reverse = file.classList.contains('project-file--reverse') && !compact;
    const cut = reverse ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)';
    const offset = reverse ? 'translateX(-24px)' : 'translateX(24px)';
    prepare(visual, { opacity: '0' });
    prepare(content, { opacity: '0', transform: offset });
    watch(file, () => {
      wipe(visual, cut, 0, 0.92);
      slide(content, offset, 0.14, 0.7);
    }, 0.16);
  }

  for (const row of document.querySelectorAll<HTMLElement>('.projects__other li')) {
    prepare(row, { opacity: '0' });
    watch(row, () => wipe(row, 'inset(0 100% 0 0)', 0, 0.6));
  }

  // The experience column is a timeline; each period precedes its description.
  for (const item of document.querySelectorAll<HTMLElement>('.experience-item')) {
    const period = item.querySelector<HTMLElement>('.experience-item__period');
    const content = item.querySelector<HTMLElement>('.experience-item__content');
    prepare(period, { opacity: '0', transform: 'translateX(-18px)' });
    prepare(content, { opacity: '0', transform: 'translateX(20px)' });
    watch(item, () => {
      slide(period, 'translateX(-18px)', 0, 0.5);
      slide(content, 'translateX(20px)', 0.1, 0.66);
    }, 0.2);
  }

  for (const diploma of document.querySelectorAll<HTMLElement>('.education-file')) {
    prepare(diploma, { opacity: '0' });
    watch(diploma, () => wipe(diploma, 'inset(0 0 100% 0)', 0, 0.82), 0.14);
  }

  for (const certificate of document.querySelectorAll<HTMLElement>('.certification-card')) {
    prepare(certificate, { opacity: '0', transform: 'translateX(14px)' });
    watch(certificate, () => slide(certificate, 'translateX(14px)', 0, 0.58), 0.14);
  }

  const internship = document.querySelector<HTMLElement>('.internship__file');
  if (internship) {
    const top = internship.querySelector<HTMLElement>('.internship__topline');
    const heading = internship.querySelector<HTMLElement>('h2');
    const copy = internship.querySelector<HTMLElement>('.internship__copy');
    const bottom = internship.querySelector<HTMLElement>('.internship__bottom');
    prepare(top, { opacity: '0' });
    prepare(heading, { opacity: '0' });
    prepare(copy, { opacity: '0', transform: 'translateX(20px)' });
    prepare(bottom, { opacity: '0', transform: 'translateY(14px)' });
    watch(internship, () => {
      wipe(top, 'inset(0 100% 0 0)', 0, 0.54);
      wipe(heading, 'inset(0 0 100% 0)', 0.11, 0.84);
      slide(copy, 'translateX(20px)', 0.22, 0.63);
      slide(bottom, 'translateY(14px)', 0.4, 0.56);
    }, 0.12);
  }

  const contact = document.querySelector<HTMLElement>('.contact');
  if (contact) {
    const title = contact.querySelector<HTMLElement>('.contact__title');
    const cta = contact.querySelector<HTMLElement>('.contact__actions');
    const deco = contact.querySelector<HTMLElement>('.contact__deco');
    prepare(title, { opacity: '0' });
    prepare(cta, { opacity: '0', transform: 'translateX(-20px)' });
    prepare(deco, { opacity: '0', transform: 'translateX(36px)' });
    watch(contact, () => {
      wipe(title, 'inset(0 100% 0 0)', 0, 0.86);
      slide(cta, 'translateX(-20px)', 0.2, 0.6);
      slide(deco, 'translateX(36px)', 0.15, 0.9);
    }, 0.15);
  }

  // Case studies get their own opening scene and quieter in-article reveals.
  const projectPage = document.querySelector<HTMLElement>('.project-page');
  if (projectPage) {
    const back = projectPage.querySelector<HTMLElement>('.project-page__back');
    const intro = projectPage.querySelector<HTMLElement>('.project-page__intro');
    const cover = projectPage.querySelector<HTMLElement>('.project-page__cover');
    const title = intro?.querySelector<HTMLElement>('h1') ?? null;
    const meta = intro?.querySelector<HTMLElement>('.project-page__meta') ?? null;
    const role = intro?.querySelector<HTMLElement>('.project-page__role') ?? null;
    const description = intro?.querySelector<HTMLElement>('.project-page__description') ?? null;
    const links = intro?.querySelector<HTMLElement>('.project-page__links') ?? null;
    prepare(back, { opacity: '0', transform: 'translateX(-12px)' });
    watch(back, () => slide(back, 'translateX(-12px)', 0.04, 0.45));
    prepare(meta, { opacity: '0', transform: 'translateX(-14px)' });
    prepare(title, { opacity: '0' });
    prepare(role, { opacity: '0', transform: 'translateY(12px)' });
    prepare(description, { opacity: '0', transform: 'translateY(12px)' });
    prepare(links, { opacity: '0', transform: 'translateY(12px)' });
    watch(intro ?? null, () => {
      slide(meta, 'translateX(-14px)', 0, 0.45);
      wipe(title, 'inset(0 0 100% 0)', 0.06, 0.9);
      slide(role, 'translateY(12px)', 0.27, 0.52);
      slide(description, 'translateY(12px)', 0.36, 0.52);
      slide(links, 'translateY(12px)', 0.44, 0.52);
    });
    prepare(cover, { opacity: '0' });
    watch(cover, () => wipe(cover, 'inset(0 100% 0 0)', compact ? 0 : 0.17, 1.02));

    const facts = projectPage.querySelector<HTMLElement>('.project-page__facts');
    const factItems = [...(facts?.querySelectorAll<HTMLElement>(':scope > div') ?? [])];
    for (const fact of factItems) prepare(fact, { opacity: '0', transform: 'translateY(12px)' });
    watch(facts, () => factItems.forEach((fact, index) => slide(fact, 'translateY(12px)', index * 0.09, 0.52)));

    for (const heading of projectPage.querySelectorAll<HTMLElement>('.project-content > h2')) {
      prepare(heading, { opacity: '0' });
      watch(heading, () => wipe(heading, 'inset(0 100% 0 0)', 0, 0.72));
    }
    for (const figure of projectPage.querySelectorAll<HTMLElement>('.project-gallery figure')) {
      prepare(figure, { opacity: '0' });
      watch(figure, () => wipe(figure, 'inset(0 100% 0 0)', 0, 0.9));
    }
  }

  const legalTitle = document.querySelector<HTMLElement>('.legal-header__title');
  if (legalTitle) {
    prepare(legalTitle, { opacity: '0' });
    watch(legalTitle, () => wipe(legalTitle, 'inset(0 100% 0 0)', 0.08, 0.75));
  }

  return () => {
    observers.forEach((stop) => stop());
    animations.forEach((animation) => animation.stop());
    for (const [element, original] of originals) {
      if (original === null) element.removeAttribute('style');
      else element.setAttribute('style', original);
    }
  };
}
