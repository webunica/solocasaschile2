"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface Props {
  images: string[];
  altBase: string;
}

export function ImageGallery({ images, altBase }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  if (!images.length) return null;

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const prev = () => setLightboxIdx((prev) => (prev! - 1 + images.length) % images.length);
  const next = () => setLightboxIdx((prev) => (prev! + 1) % images.length);

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[300px] md:h-[450px]">
        <div className="col-span-1 md:col-span-3 relative rounded-[2rem] md:rounded-[3rem] overflow-hidden group shadow-2xl cursor-zoom-in bg-muted/20 flex items-center justify-center"
          onClick={() => openLightbox(0)}>
          <Image 
            src={images[0]} 
            alt={`${altBase} - vista 1`} 
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-[2s]" 
            priority
          />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 md:group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-5 h-5 text-white" />
          </div>
          {/* Mobile Image Counter */}
          <div className="md:hidden absolute bottom-6 right-6 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full border border-white/10 tracking-widest uppercase shadow-xl">
             1 / {images.length}
          </div>
        </div>
        <div className="hidden md:grid col-span-1 grid-rows-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i}
              className="relative rounded-[2rem] overflow-hidden shadow-lg border border-border/10 cursor-zoom-in group bg-muted/20 flex items-center justify-center"
              onClick={() => openLightbox(Math.min(i, images.length - 1))}
            >
              <Image
                src={images[i] || images[0]}
                fill alt={`${altBase} - vista ${i + 1}`}
                className="object-cover hover:scale-110 transition-transform duration-700"
              />
              {i === 2 && images.length > 3 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-black text-xl">+{images.length - 3}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Thumbnails strip */}
      {images.length > 3 && (
        <div className="flex gap-3 overflow-x-auto py-2">
          {images.map((img, i) => (
            <button key={i} onClick={() => openLightbox(i)}
              className="w-20 h-16 relative rounded-xl overflow-hidden shrink-0 border-2 border-transparent hover:border-primary transition-all"
            >
              <Image src={img} fill alt="" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
              onClick={closeLightbox}>
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Prev */}
            {images.length > 1 && (
              <button className="absolute left-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); prev(); }}>
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={lightboxIdx}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-5xl max-h-[85vh] aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={images[lightboxIdx]} fill alt={`${altBase} - ${lightboxIdx + 1}`}
                className="object-contain" />
            </motion.div>

            {/* Next */}
            {images.length > 1 && (
              <button className="absolute right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); next(); }}>
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 rounded-full px-4 py-1 text-white text-sm font-bold">
              {lightboxIdx + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
