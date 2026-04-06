"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, Play } from "lucide-react";

interface Props {
  images: string[];
  altBase: string;
  videoUrl?: string | null;
}

export function ImageGallery({ images, altBase, videoUrl }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  if (!images.length) return null;

  const openLightbox = (idx: number) => {
    setShowVideo(false);
    setLightboxIdx(idx);
  };
  const closeLightbox = () => {
    setLightboxIdx(null);
    setShowVideo(false);
  };
  
  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowVideo(true);
    setLightboxIdx(0); 
  };

  const prev = () => setLightboxIdx((p) => (p! - 1 + images.length) % images.length);
  const next = () => setLightboxIdx((p) => (p! + 1) % images.length);

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Main image */}
        <div className="relative aspect-[16/9] md:aspect-video rounded-[2rem] md:rounded-[3rem] overflow-hidden group shadow-2xl cursor-zoom-in bg-muted/20"
          onClick={() => openLightbox(0)}>
          <Image 
            src={images[0]} 
            alt={`${altBase} - vista 1`} 
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-[2s]" 
            priority
          />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute top-6 right-6 w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-6 h-6 text-white" />
          </div>
          
          <div className="absolute top-6 left-6 flex flex-wrap gap-2">
            <span className="px-4 py-2 bg-black/40 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
               Vista Principal
            </span>
          </div>
        </div>

        {/* Bottom thumbnails grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {images.slice(1, 7).map((img, i) => (
             <div 
               key={i}
               className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border border-border/10 cursor-pointer group bg-muted/20"
               onClick={() => openLightbox(i + 1)}
             >
               <Image
                 src={img}
                 fill alt={`${altBase} - vista ${i + 2}`}
                 className="object-cover group-hover:scale-110 transition-transform duration-700"
               />
               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
             </div>
          ))}
          {videoUrl && (
             <div 
               className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border border-brand-indigo/30 cursor-pointer group bg-brand-indigo/10 flex flex-col items-center justify-center gap-2"
               onClick={handleVideoClick}
             >
                <Play className="w-6 h-6 text-brand-indigo fill-current" />
                <span className="text-[8px] font-black uppercase tracking-widest text-brand-indigo">Video</span>
             </div>
          )}
        </div>
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center select-none"
            onClick={closeLightbox}
          >
            <button className="absolute top-8 right-8 w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors">
              <X className="w-8 h-8" />
            </button>

            <div className="relative w-full max-w-7xl aspect-video mx-8" onClick={(e) => e.stopPropagation()}>
              {showVideo && videoUrl ? (
                <iframe src={getYoutubeEmbedUrl(videoUrl)!} className="w-full h-full rounded-2xl md:rounded-[3rem] shadow-2xl" allowFullScreen />
              ) : (
                <Image src={images[lightboxIdx]} fill className="object-contain" alt="Lightbox" />
              )}

              {!showVideo && images.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
                    <ChevronLeft className="w-10 h-10" />
                  </button>
                  <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all">
                    <ChevronRight className="w-10 h-10" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function getYoutubeEmbedUrl(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : null;
}
