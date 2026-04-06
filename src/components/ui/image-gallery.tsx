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
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[300px] md:h-[450px]">
        {/* Main image */}
        <div className="col-span-1 md:col-span-3 relative rounded-[2rem] md:rounded-[3.5rem] overflow-hidden group shadow-2xl cursor-zoom-in bg-muted/20 flex items-center justify-center"
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
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
              Vista Exterior
            </span>
          </div>

          {/* Mobile Image Counter / Actions */}
          <div className="md:hidden absolute bottom-6 right-6 flex items-center gap-2">
             <div className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-4 py-2 rounded-full border border-white/10 tracking-widest uppercase shadow-xl">
                1 / {images.length} FOTOS
             </div>
          </div>
        </div>

        {/* Small thumbnails side grid */}
        <div className="hidden md:grid col-span-1 grid-rows-2 gap-4">
          {/* Thumb 1 (Second image or Video if present) */}
          <div 
            className="relative rounded-[2.5rem] overflow-hidden shadow-lg border border-border/10 cursor-pointer group bg-muted/20"
            onClick={videoUrl ? handleVideoClick : () => openLightbox(1)}
          >
            <Image
              src={images[1] || images[0]}
              fill alt={`${altBase} - vista 2`}
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            {videoUrl ? (
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex flex-col items-center justify-center gap-3">
                 <div className="w-12 h-12 rounded-full bg-brand-indigo/90 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 text-white fill-current translate-x-0.5" />
                 </div>
                 <span className="text-white font-black text-[10px] uppercase tracking-widest shadow-xl">Ver video</span>
              </div>
            ) : (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            )}
          </div>

          {/* Thumb 2 (Third image or more) */}
          <div 
            className="relative rounded-[2.5rem] overflow-hidden shadow-lg border border-border/10 cursor-pointer group bg-muted/20"
            onClick={() => openLightbox(Math.min(2, images.length - 1))}
          >
            <Image
              src={images[2] || images[0]}
              fill alt={`${altBase} - vista 3`}
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 group-hover:bg-black/30 transition-colors">
              <span className="text-white font-black text-2xl tracking-tighter">+{images.length > 3 ? images.length - 3 : images.length}</span>
              <span className="text-white/60 font-black text-[9px] uppercase tracking-widest">Fotos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto py-4 scrollbar-hide">
          {images.map((img, i) => (
            <button key={i} onClick={() => openLightbox(i)}
              className="w-24 h-16 md:w-28 md:h-20 relative rounded-2xl overflow-hidden shrink-0 border-2 border-transparent hover:border-brand-indigo transition-all shadow-md group"
            >
              <Image src={img} fill alt="" className="object-cover group-hover:scale-110 transition-transform duration-500" />
            </button>
          ))}
          {videoUrl && (
            <button onClick={handleVideoClick}
              className="w-24 h-16 md:w-28 md:h-20 relative rounded-2xl overflow-hidden shrink-0 border-2 border-transparent hover:border-brand-indigo transition-all shadow-md bg-muted/40 flex items-center justify-center group"
            >
              <Image src={images[0]} fill alt="" className="object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all" />
              <Play className="w-6 h-6 text-white relative z-10 drop-shadow-2xl" />
            </button>
          )}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button className="fixed top-8 right-8 w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white/20 transition-all z-[110] border border-white/10"
              onClick={closeLightbox}>
              <X className="w-8 h-8 text-white" />
            </button>

            {/* Content Container */}
            <motion.div
              key={showVideo ? "video" : lightboxIdx}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-6xl h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {showVideo ? (
                <div className="w-full aspect-video rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl bg-black">
                   <iframe 
                      src={videoUrl!.includes('youtube') 
                        ? videoUrl!.replace('watch?v=', 'embed/').split('&')[0] + '?autoplay=1'
                        : videoUrl!
                      }
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                   />
                </div>
              ) : (
                <Image src={images[lightboxIdx]} fill alt={`${altBase} - ${lightboxIdx + 1}`}
                  className="object-contain" />
              )}
            </motion.div>

            {!showVideo && images.length > 1 && (
              <>
                <button className="fixed left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white/20 transition-all z-10 border border-white/10"
                  onClick={(e) => { e.stopPropagation(); prev(); }}>
                  <ChevronLeft className="w-8 h-8 text-white" />
                </button>
                <button className="fixed right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white/20 transition-all z-10 border border-white/10"
                  onClick={(e) => { e.stopPropagation(); next(); }}>
                  <ChevronRight className="w-8 h-8 text-white" />
                </button>
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl rounded-full px-8 py-2 text-white text-base font-black tracking-widest border border-white/10">
                  {lightboxIdx + 1} / {images.length}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
