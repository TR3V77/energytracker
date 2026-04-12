import React from "react";
import { HeroSection } from "./HeroSection";
import { FeatureCards } from "./FeatureCards";
import { HowItWorks } from "./HowItWorks";
import { TechStack } from "./TechStack";

export const HomePage = () => (
  <div className="home-page py-4">
    <HeroSection />
    <FeatureCards />
    
    <div className="row g-4 mt-2">
      <div className="col-md-6">
        <HowItWorks />
      </div>
      <div className="col-md-6">
        <TechStack />
      </div>
    </div>
  </div>
);

export default HomePage;