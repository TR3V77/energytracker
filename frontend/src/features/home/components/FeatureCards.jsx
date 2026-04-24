import React from "react";
import { FEATURES } from "../constants/homeConfig";
import { FeatureCard } from "./FeatureCard";

export const FeatureCards = () => (
  <div className="row g-4 mt-2">
    {FEATURES.map((feature, index) => (
      <FeatureCard key={index} colClass={index < 3 ? "col-md-4" : "col-md-6"} {...feature} />
    ))}
  </div>
);
