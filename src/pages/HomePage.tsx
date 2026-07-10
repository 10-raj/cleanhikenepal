import { HeroSection } from '../components/sections/HeroSection';
import { FeaturedPhotoSection } from '../components/sections/FeaturedPhotoSection';
import { AboutSection } from '../components/sections/AboutSection';
import { CompletedHikesSection } from '../components/sections/CompletedHikesSection';
import { EnvironmentalMissionSection } from '../components/sections/EnvironmentalMissionSection';
import { FeaturedVideoSection } from '../components/sections/FeaturedVideoSection';
import { SponsorsSection } from '../components/sections/SponsorsSection';
import { GalleryPreviewSection } from '../components/sections/GalleryPreviewSection';
import { ContactSection } from '../components/sections/ContactSection';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedPhotoSection />
      <AboutSection />
      <CompletedHikesSection />
      <EnvironmentalMissionSection />
      <FeaturedVideoSection />
      <SponsorsSection />
      <GalleryPreviewSection />
      <ContactSection />
    </>
  );
}
