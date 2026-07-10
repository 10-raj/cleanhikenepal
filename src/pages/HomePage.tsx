import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { CompletedHikesSection } from '../components/sections/CompletedHikesSection';
import { EnvironmentalMissionSection } from '../components/sections/EnvironmentalMissionSection';
import { SponsorsSection } from '../components/sections/SponsorsSection';
import { GalleryPreviewSection } from '../components/sections/GalleryPreviewSection';
import { ContactSection } from '../components/sections/ContactSection';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <CompletedHikesSection />
      <EnvironmentalMissionSection />
      <SponsorsSection />
      <GalleryPreviewSection />
      <ContactSection />
    </>
  );
}
