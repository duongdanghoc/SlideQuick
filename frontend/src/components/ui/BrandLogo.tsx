import React from "react";

interface BrandLogoProps {
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = "h-12 w-auto" }) => (
  <img
    src="/logo.jpg"
    alt="EduArt AI"
    className={`block object-contain ${className}`}
  />
);
