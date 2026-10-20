import { Navbar } from "@/components/navbar";
import { LandingHero } from "@/components/landing-hero";
import { BentoFeatures } from "@/components/bento-features";
import { ComparisonSection } from "@/components/comparison-section";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <LandingHero />
        <BentoFeatures />
        <ComparisonSection />
      </div>
      <Footer />
    </main>
  );
}
