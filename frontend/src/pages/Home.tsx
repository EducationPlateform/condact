import { useState } from "react";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import PathsSection from "@/components/landing/PathsSection";
import RoadmapSection from "@/components/landing/RoadmapSection";
import SuccessStoriesSection from "@/components/landing/SuccessStoriesSection";
import ExpertSection from "@/components/landing/ExpertSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import { LoadingScreen } from "@/components/common/Loading";

const Landing = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <LoadingScreen onComplete={() => setIsLoading(false)} duration={2500} />
      )}

      <div className={`min-h-screen ${isLoading ? "hidden" : "block"}`}>
        <Header />
        <main>
          <HeroSection />
          <StatsSection />
          <PathsSection />
          <RoadmapSection />
          <SuccessStoriesSection />
          <ExpertSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Landing;
