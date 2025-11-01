"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import Modal, { ModalContent } from "@/components/ui/modal";

interface Screenshot {
  id: string;
  src: string;
  alt: string;
  title: string;
  description?: string;
}

interface ScreenshotCarouselProps {
  screenshots: Screenshot[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

export function ScreenshotCarousel({
  screenshots,
  autoPlay = true,
  autoPlayInterval = 4000,
  className = "",
}: ScreenshotCarouselProps) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Screenshot | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play functionality with hover pause
  useEffect(() => {
    if (!autoPlay || screenshots.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === screenshots.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, screenshots.length, isHovered]);

  const goToPrevious = () => {
    setCurrentIndex(
      currentIndex === 0 ? screenshots.length - 1 : currentIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(
      currentIndex === screenshots.length - 1 ? 0 : currentIndex + 1
    );
  };

  const openModal = (screenshot: Screenshot) => {
    setSelectedImage(screenshot);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  if (screenshots.length === 0) {
    return null;
  }

  return (
    <div className={`relative w-full ${className}`}>
      {/* Carousel Container */}
      <div
        className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-64 sm:h-80">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="absolute inset-0 cursor-pointer"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              onClick={() => openModal(screenshots[currentIndex])}
            >
              {/* Half-cut image effect */}
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src={screenshots[currentIndex].src}
                  alt={screenshots[currentIndex].alt}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Gradient overlay for half-cut effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <Maximize2 className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Image info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-white font-semibold text-lg mb-1">
                  {screenshots[currentIndex].title}
                </h3>
                {screenshots[currentIndex].description && (
                  <p className="text-white/80 text-sm">
                    {screenshots[currentIndex].description}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        {screenshots.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 dark:bg-black/20 dark:hover:bg-black/40 text-white border-0"
              onClick={goToPrevious}
              aria-label="Previous screenshot"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 dark:bg-black/20 dark:hover:bg-black/40 text-white border-0"
              onClick={goToNext}
              aria-label="Next screenshot"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Dots Indicator */}
        {screenshots.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {screenshots.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentIndex
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`${t("ui.ariaLabels.goToScreenshot")} ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal for full-size image */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedImage?.title}
        maxWidth="4xl"
        className="max-h-[90vh]"
      >
        <ModalContent className="p-6">
          {selectedImage && (
            <div className="relative w-full max-h-[70vh] rounded-lg overflow-hidden">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={800}
                height={600}
                className="w-full h-auto object-contain max-h-[70vh]"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
            </div>
          )}

          {selectedImage?.description && (
            <p className="mt-4 text-gray-600 dark:text-gray-400 text-center">
              {selectedImage.description}
            </p>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
