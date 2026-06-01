import { useState } from "react";
import { Maximize2, X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { GALLERY } from "../data";
import { GalleryImage } from "../types";
import ScrollParallaxImage from "./ScrollParallaxImage";
import { ScrollReveal, ScrollRevealContainer, ScrollRevealItem } from "./ScrollReveal";
import AestheticImage from "./AestheticImage";

interface GalleryProps {
  gallery?: GalleryImage[];
}

export default function Gallery({ gallery }: GalleryProps = {}) {
  const galleryImages = gallery || [];
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filters = [
    { label: "ALL", val: "all" },
    { label: "ROOMS & SUITES", val: "rooms" },
    { label: "EXTERIOR", val: "exterior" },
  ];

  const filteredImages = activeFilter === "all"
    ? galleryImages
    : galleryImages.filter(img => img.category === activeFilter);

  const handlePrev = () => {
    if (selectedImage !== null) {
      setSelectedImage(prev => (prev !== null && prev > 0 ? prev - 1 : filteredImages.length - 1));
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(prev => (prev !== null && prev < filteredImages.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <section id="gallery" className="py-20 md:py-28 bg-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Gallery Section Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-12 space-y-3 font-sans">
          <div className="flex items-center justify-center space-x-2 text-xs font-bold text-[#9C2A2A] uppercase tracking-[0.3em]">
            <span className="w-8 h-[1px] bg-[#9C2A2A]/35" />
            <span>Visual Tour</span>
            <span className="w-8 h-[1px] bg-[#9C2A2A]/35" />
          </div>
          
          <h2 className="font-serif text-3xl md:text-5xl font-extrabold text-[#9C2A2A] leading-tight">
            Our Gallery
          </h2>
          
          <p className="text-gray-600 text-sm md:text-base font-normal max-w-2xl mx-auto">
            Take a visual walk through our majestic property and pristine suites. Every frame tells a story of unmatched Ethiopian hospitality.
          </p>
        </ScrollReveal>

        {/* Filter Selection Chips */}
        {galleryImages.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10 md:mb-12">
            {filters.map((filter) => (
              <button
                key={filter.val}
                onClick={() => setActiveFilter(filter.val)}
                className={`px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                  activeFilter === filter.val
                    ? "bg-[#D4AF37] text-[#1E1E1E] shadow-md shadow-[#D4AF37]/10"
                    : "bg-stone-50 text-[#1E1E1E] border border-stone-200/60 hover:bg-stone-100"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        {/* Dynamic Image Cards Grid with staggered entry and scroll parallax */}
        {filteredImages.length > 0 ? (
          <ScrollRevealContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <ScrollRevealItem
                key={image.id}
                className="relative aspect-[4/3] group overflow-hidden rounded-[32px] cursor-pointer bg-white/30 backdrop-blur-md shadow-md border border-white/45 flex items-center justify-center bg-stone-50"
              >
                {/* Click handler overlay */}
                <div 
                  onClick={() => setSelectedImage(index)}
                  className="absolute inset-0 w-full h-full z-20 cursor-pointer"
                />

                <ScrollParallaxImage
                  src={image.url}
                  alt={image.caption}
                  className="w-full h-full"
                  width={300}
                  height={225}
                />

                {/* Tinted Overlay & Details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 text-left z-30 pointer-events-none">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 space-y-2">
                    <span className="text-[9px] font-bold text-amber-300 uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {image.category === "lounge" ? "Premium Lounge" : image.category}
                    </span>
                    
                    <h4 className="font-serif text-lg font-bold text-white leading-tight">
                      {image.caption}
                    </h4>
                    
                    <div className="flex items-center space-x-1.5 text-stone-300 text-xs">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Expand Gallery</span>
                    </div>
                  </div>
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollRevealContainer>
        ) : (
          <div className="text-center py-16 bg-stone-50 rounded-[32px] border border-stone-200/60 max-w-md mx-auto">
            <Camera className="w-12 h-12 text-[#9C2A2A]/40 mx-auto mb-4" />
            <h3 className="text-stone-800 font-serif font-bold text-lg mb-1">No images yet</h3>
            <p className="text-stone-500 text-xs">Our gallery is currently being curated. Please check back soon.</p>
          </div>
        )}

        {/* Lightbox Immersive Modal */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left controller */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-6 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer hidden sm:block"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Expanded Content View */}
            <div className="max-w-4xl w-full text-center space-y-4" onClick={(e) => e.stopPropagation()}>
              <div className="relative overflow-hidden rounded-2xl max-h-[70vh] flex items-center justify-center">
                <AestheticImage
                  src={filteredImages[selectedImage].url}
                  alt={filteredImages[selectedImage].caption}
                  className="max-h-[70vh] max-w-full rounded-2xl object-contain border border-white/5 bg-stone-900"
                />
              </div>

              <div className="space-y-1 text-center">
                <p className="text-white font-serif text-lg md:text-xl font-bold">
                  {filteredImages[selectedImage].caption}
                </p>
                <div className="flex justify-center items-center space-x-3 text-xs text-stone-400 uppercase tracking-widest">
                  <span className="flex items-center space-x-1">
                    <Camera className="w-3.5 h-3.5 text-stone-400" />
                    <span>
                      DIRE DAWA RAS HOTEL
                      <br />
                      ድሬዳዋ ራስ ሆቴል • EST. 1964
                    </span>
                  </span>
                  <span>•</span>
                  <span>{selectedImage + 1} of {filteredImages.length}</span>
                </div>
              </div>
            </div>

            {/* Right controller */}
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-6 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer hidden sm:block"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
