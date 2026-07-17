import { matchFAQ } from '../data/aiFAQ';

/** Special marker that AIChatbox will render as a "Join Upcoming Clean Hike" button */
export const JOIN_HIKE_BUTTON_MARKER = '__JOIN_HIKE_BUTTON__';

export function processUserQuery(query: string): string {
  const normalizedQuery = query.toLowerCase().trim();

  // Try local FAQ match first
  const localResponse = matchFAQ(query);
  if (localResponse) {
    return localResponse;
  }

  // ── JOIN / HIKE PARTICIPATION ──────────────────────────────────────────
  const joinKeywords = [
    'join', 'how can i join', 'how to join', 'sign up', 'register',
    'participate', 'upcoming hike', 'next hike', 'clean hike',
    'where is next hike', 'when is next hike', 'next clean hike',
    'join hike', 'join clean hike', 'community hike',
  ];
  if (joinKeywords.some(kw => normalizedQuery.includes(kw))) {
    return `Great news — you can join our next **Community Clean Hike** this Saturday! 🏔️\n\nOur hikes are free and open to everyone. We meet at the trailhead, hike together, and clean up as we go.\n\n${JOIN_HIKE_BUTTON_MARKER}\n\n- **Every Saturday** — 7:00 AM\n- **Meeting Point:** Pharping Bus Park\n- **Difficulty:** Easy\n- All are welcome — bring friends!`;
  }

  // ── GALLERY ────────────────────────────────────────────────────────────
  if (normalizedQuery.includes('gallery') || normalizedQuery.includes('photo') || normalizedQuery.includes('picture')) {
    return 'Our gallery showcases stunning photos from our expeditions across Nepal\'s beautiful trails!\n\n➡️ [View Gallery](/gallery)';
  }

  // ── DONATE ────────────────────────────────────────────────────────────
  if (normalizedQuery.includes('donate') || normalizedQuery.includes('donation') || normalizedQuery.includes('support us') || normalizedQuery.includes('contribute')) {
    return 'Thank you for wanting to support us! Your donation helps preserve Nepal\'s natural trails.\n\n➡️ [Donate Now](/donate)';
  }

  // ── HIKES / TREKS ─────────────────────────────────────────────────────
  if (normalizedQuery.includes('hike') || normalizedQuery.includes('trek') || normalizedQuery.includes('upcoming')) {
    return `Check out our upcoming treks and join us for our next clean hike adventure!\n\n${JOIN_HIKE_BUTTON_MARKER}\n\n➡️ [View All Hikes](/hikes)`;
  }

  // ── SPONSORS ─────────────────────────────────────────────────────────
  if (normalizedQuery.includes('sponsor') || normalizedQuery.includes('partner')) {
    return 'Meet the amazing sponsors and partners who support our environmental mission!\n\n➡️ [View Sponsors](/sponsors)';
  }

  // ── CONTACT ──────────────────────────────────────────────────────────
  if (normalizedQuery.includes('contact') || normalizedQuery.includes('email') || normalizedQuery.includes('phone') || normalizedQuery.includes('reach')) {
    return 'Get in touch with our team — we respond within 24 hours!\n\n➡️ [Contact Page](/contact)\n\n- **Email:** [acharyaraj2005@gmail.com](mailto:acharyaraj2005@gmail.com)\n- **Phone:** [98767262762](tel:+9779876726276)';
  }

  // ── ABOUT / MISSION ──────────────────────────────────────────────────
  if (normalizedQuery.includes('about') || normalizedQuery.includes('who') || normalizedQuery.includes('mission') || normalizedQuery.includes('team')) {
    return 'Learn about CleanHike Nepal\'s mission, team, and our environmental impact.\n\n➡️ [About Us](/about)';
  }

  // ── PROGRAMMING / TECH (redirect) ────────────────────────────────────
  if (normalizedQuery.includes('javascript') || normalizedQuery.includes('react') || normalizedQuery.includes('coding') || normalizedQuery.includes('programming')) {
    return 'I\'m specialized in helping with CleanHike Nepal information. For technical support, please contact our team:\n\n- **Email:** [acharyaraj2005@gmail.com](mailto:acharyaraj2005@gmail.com)';
  }

  // ── REDIRECT TOPICS ──────────────────────────────────────────────────
  const redirectTopics = [
    ['booking', 'price', 'cost', 'reservation'],
    ['custom', 'private', 'group tour'],
    ['complaint', 'issue', 'problem', 'refund'],
    ['legal', 'contract', 'insurance'],
  ];

  for (const topics of redirectTopics) {
    if (topics.some(t => normalizedQuery.includes(t))) {
      return `For specific inquiries about ${topics[0]}, please contact us directly:\n\n- **Email:** [acharyaraj2005@gmail.com](mailto:acharyaraj2005@gmail.com)\n- **Phone:** [98767262762](tel:+9779876726276)\n\n➡️ [Contact Page](/contact)`;
    }
  }

  // ── DEFAULT FALLBACK ─────────────────────────────────────────────────
  return `I couldn't find that information. Please contact our team for further assistance:\n\n- **Email:** [acharyaraj2005@gmail.com](mailto:acharyaraj2005@gmail.com)\n- **Phone:** [98767262762](tel:+9779876726276)\n\nOr explore the site:\n- [Home](/)\n- [Hikes](/hikes)\n- [Gallery](/gallery)\n- [Donate](/donate)\n- [Contact](/contact)`;
}
