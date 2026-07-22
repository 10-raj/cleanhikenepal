import { NavigateFunction } from 'react-router-dom';

/**
 * Resolves a CTA "link" value to a real navigation action.
 *
 * Supports three shapes, matching the Dynamic Link Dropdown used in the
 * Admin Panel (Banner Manager, and any future CMS-managed button):
 *  - External URL: "https://example.com" -> opens in a new tab
 *  - Internal route with anchor: "/contact#join-as-partner" -> routes to
 *    /contact, then smooth-scrolls to the element with id "join-as-partner"
 *    once it's mounted (works whether or not the target page is currently
 *    active, unlike relying on each page having its own hash listener)
 *  - Internal route only: "/gallery" -> plain client-side navigation
 */
export function navigateToLink(link: string, navigate: NavigateFunction) {
  if (!link) return;

  const isExternal = /^https?:\/\//i.test(link);
  if (isExternal) {
    window.open(link, '_blank', 'noopener,noreferrer');
    return;
  }

  const [pathAndQuery, hash] = link.split('#');

  if (hash) {
    navigate(pathAndQuery || '/');
    // Wait for the target page/section to mount before scrolling.
    setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  } else {
    navigate(pathAndQuery);
  }
}

/** Options shown in the Admin Panel's Dynamic Link Dropdown. */
export const CMS_LINK_OPTIONS: { label: string; value: string }[] = [
  { label: 'Home', value: '/' },
  { label: 'Featured Hikes', value: '/hikes?filter=featured' },
  { label: 'Completed Hikes', value: '/#completed-hikes' },
  { label: 'Hikes', value: '/hikes' },
  { label: 'About', value: '/about' },
  { label: 'Gallery', value: '/gallery' },
  { label: 'Contact', value: '/contact' },
  { label: 'Join Us for Clean Hike', value: '/contact#join-us-for-clean-hike' },
  { label: 'Sponsors', value: '/sponsors' },
  { label: 'Partners', value: '/contact#join-as-partner' },
  { label: 'Donate', value: '/donate' },
  { label: 'Volunteer', value: '/contact#join-as-volunteer' },
  { label: 'External URL', value: '__external__' },
];
