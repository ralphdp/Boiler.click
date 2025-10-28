"use client";

import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  sizes?: string;
  quality?: number;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  placeholder = "empty",
  blurDataURL,
  sizes,
  quality = 75,
}: OptimizedImageProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [hasImageError, setHasImageError] = useState(false);

  const handleLoad = () => {
    setIsImageLoading(false);
  };

  const handleError = () => {
    setHasImageError(true);
    setIsImageLoading(false);
  };

  if (hasImageError) {
    return (
      <div
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          Image failed to load
        </span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isImageLoading && (
        <div
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"
          style={{ width, height }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={sizes}
        quality={quality}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isImageLoading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}

// Predefined optimized image configurations
export const ImageConfigs = {
  hero: {
    quality: 90,
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  },
  thumbnail: {
    quality: 75,
    sizes: "(max-width: 768px) 50vw, 25vw",
  },
  avatar: {
    quality: 80,
    sizes: "64px",
  },
  og: {
    quality: 95,
    sizes: "1200px",
  },
} as const;
