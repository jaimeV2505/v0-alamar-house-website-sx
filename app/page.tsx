import Navbar from '@/components/shared/navbar'
import Footer from '@/components/shared/footer'
import HeroSection from '@/components/home/hero-section'
import ExperienceSection from '@/components/home/experience-section'
import GallerySection from '@/components/home/gallery-section'
import RoomsSection from '@/components/home/rooms-section'
import AmenitiesSection from '@/components/home/amenities-section'
import PricingSection from '@/components/home/pricing-section'
import RulesSection from '@/components/home/rules-section'
import LocationSection from '@/components/home/location-section'
import TestimonialsSection from '@/components/home/testimonials-section'
import FaqSection from '@/components/home/faq-section'
import FinalCtaSection from '@/components/home/final-cta-section'

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ExperienceSection />
      <GallerySection />
      <RoomsSection />
      <AmenitiesSection />
      <PricingSection />
      <RulesSection />
      <LocationSection />
      <TestimonialsSection />
      <FaqSection />
      <FinalCtaSection />
      <Footer />
    </main>
  )
}
