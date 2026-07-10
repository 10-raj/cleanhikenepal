import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';

import { MainLayout } from './components/layout/MainLayout';
import { AdminLayout } from './components/admin/AdminLayout';

import { HomePage } from './pages/HomePage';
import { HikesPage } from './pages/HikesPage';
import { HikeDetailPage } from './pages/HikeDetailPage';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { DonatePage } from './pages/DonatePage';
import { SponsorsPage } from './pages/SponsorsPage';

import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminDonationsPage } from './pages/admin/AdminDonationsPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminHikesPage } from './pages/admin/AdminHikesPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminSponsorsPage } from './pages/admin/AdminSponsorsPage';
import { AdminCampaignsPage } from './pages/admin/AdminCampaignsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

function App() {
  return (
    <BrowserRouter>
      {/* ✅ ADD THIS */}
      <ScrollToTop />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="hikes" element={<HikesPage />} />
          <Route path="hikes/:id" element={<HikeDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="donate" element={<DonatePage />} />
          <Route path="sponsors" element={<SponsorsPage />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="hikes" element={<AdminHikesPage />} />
          <Route path="gallery" element={<AdminGalleryPage />} />
          <Route path="sponsors" element={<AdminSponsorsPage />} />
          <Route path="campaigns" element={<AdminCampaignsPage />} />
          <Route path="donations" element={<AdminDonationsPage />} />
          <Route path="messages" element={<AdminMessagesPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;