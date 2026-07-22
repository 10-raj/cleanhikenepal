import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';

import { MainLayout } from './components/layout/MainLayout';
import { AdminLayout } from './components/admin/AdminLayout';

// Home is kept eager since it's the most common entry point and we
// want the fastest possible first paint there. Everything else is
// code-split so a visitor never downloads admin (or other-page) JS
// they don't need.
import { HomePage } from './pages/HomePage';

const HikesPage = lazy(() => import('./pages/HikesPage').then(m => ({ default: m.HikesPage })));
const HikeDetailPage = lazy(() => import('./pages/HikeDetailPage').then(m => ({ default: m.HikeDetailPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const GalleryPage = lazy(() => import('./pages/GalleryPage').then(m => ({ default: m.GalleryPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const DonatePage = lazy(() => import('./pages/DonatePage').then(m => ({ default: m.DonatePage })));
const SponsorsPage = lazy(() => import('./pages/SponsorsPage').then(m => ({ default: m.SponsorsPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));

const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminMessagesPage = lazy(() => import('./pages/admin/AdminMessagesPage').then(m => ({ default: m.AdminMessagesPage })));
const AdminDonationsPage = lazy(() => import('./pages/admin/AdminDonationsPage').then(m => ({ default: m.AdminDonationsPage })));
const AdminBookingsPage = lazy(() => import('./pages/admin/AdminBookingsPage').then(m => ({ default: m.AdminBookingsPage })));
const AdminHikesPage = lazy(() => import('./pages/admin/AdminHikesPage').then(m => ({ default: m.AdminHikesPage })));
const AdminGalleryPage = lazy(() => import('./pages/admin/AdminGalleryPage').then(m => ({ default: m.AdminGalleryPage })));
const AdminSponsorsPage = lazy(() => import('./pages/admin/AdminSponsorsPage').then(m => ({ default: m.AdminSponsorsPage })));
const AdminCampaignsPage = lazy(() => import('./pages/admin/AdminCampaignsPage').then(m => ({ default: m.AdminCampaignsPage })));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage })));
const AdminTeamPage = lazy(() => import('./pages/admin/AdminTeamPage').then(m => ({ default: m.AdminTeamPage })));
const AdminHomepageManagerPage = lazy(() => import('./pages/admin/AdminHomepageManagerPage').then(m => ({ default: m.AdminHomepageManagerPage })));
const AdminCompletedHikesPage = lazy(() => import('./pages/admin/AdminCompletedHikesPage').then(m => ({ default: m.AdminCompletedHikesPage })));
const AdminAboutPage = lazy(() => import('./pages/admin/AdminAboutPage').then(m => ({ default: m.AdminAboutPage })));
const AdminBannersPage = lazy(() => import('./pages/admin/AdminBannersPage').then(m => ({ default: m.AdminBannersPage })));
const AdminLogoPage = lazy(() => import('./pages/admin/AdminLogoPage').then(m => ({ default: m.AdminLogoPage })));

function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="hikes" element={<HikesPage />} />
          <Route path="hikes/:id" element={<HikeDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="donate" element={<DonatePage />} />
          <Route path="sponsors" element={<SponsorsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="homepage" element={<AdminHomepageManagerPage />} />
          <Route path="hikes" element={<AdminHikesPage />} />
          <Route path="gallery" element={<AdminGalleryPage />} />
          <Route path="sponsors" element={<AdminSponsorsPage />} />
          <Route path="campaigns" element={<AdminCampaignsPage />} />
          <Route path="donations" element={<AdminDonationsPage />} />
          <Route path="messages" element={<AdminMessagesPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="team" element={<AdminTeamPage />} />
          <Route path="completed-hikes" element={<AdminCompletedHikesPage />} />
          <Route path="about" element={<AdminAboutPage />} />
          <Route path="banners" element={<AdminBannersPage />} />
          <Route path="logo" element={<AdminLogoPage />} />
        </Route>
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
