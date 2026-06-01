import { Play, CalendarCheck, Navigation } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useIsMobile } from "./useIsMobile";
import { ScrollReveal, ScrollRevealContainer, ScrollRevealItem } from "./ScrollReveal";

interface HeroProps {
  onBookClick: () => void;
  onWatchVideo: () => void;
  settings?: any;
  contentBlocks?: Record<string, any>;
}

export default function Hero({ onBookClick, onWatchVideo, settings, contentBlocks }: HeroProps) {
  const isMobile = useIsMobile();
  const { scrollY } = useScroll();

  // Fine-tuned parallax value linked directly to scroll position
  // Uses translate3d under the hood for buttery smooth 60fps
  const yParallax = useTransform(scrollY, [0, 800], isMobile ? [0, 60] : [0, 180]);

  // Read content_blocks value dynamically with robust backups
  const getBlock = (key: string, backup: string): string => {
    if (!contentBlocks || !contentBlocks[key]) return backup;
    const b = contentBlocks[key];
    if (typeof b === "string") return b;
    return b.value || b.content || b.title || backup;
  };

  const heroDesktopImage = settings?.hero_image_url || "";
  const heroMobileImage = settings?.hero_mobile_image_url || settings?.hero_image_url || "";

  const heroSubtitleText = getBlock("hero_subtitle", "Welcome to Dire Dawa");
  const heroTitleText = getBlock("hero_title", "DIRE DAWA\nRAS HOTEL");
  const siteTaglineText = getBlock("site_tagline", "Stay a Cool Place in a Warmer City");
  const heroDescriptionText = getBlock("hero_description", "Experience authentic Ethiopian hospitality combined with classic heritage comfort in the historic heart of Dire Dawa. Where grand tradition blends with modern ease.");

  // Split title manually on \n to allow gorgeous multi-tiered stacked text in the layout
  const titleParts = heroTitleText.split("\n");

  return (
    <section
      id="home"
      className="relative min-h-[90vh] md:min-h-screen pt-28 pb-12 flex items-center overflow-hidden bg-stone-950"
    >
      {/* Absolute Parallax Background Image Container with WebP optimized sources */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        <motion.div
          style={{ y: yParallax, scale: isMobile ? 1.02 : 1.12 }}
          className="absolute inset-0 w-full h-[120%] -top-[10%] origin-center will-change-transform"
        >
          {heroDesktopImage || heroMobileImage ? (
            <picture>
              {heroMobileImage && (
                <source
                  type="image/webp"
                  srcSet={`${heroMobileImage} 600w, ${heroDesktopImage} 1900w`}
                  sizes="100vw"
                />
              )}
              <img
                src={heroDesktopImage || heroMobileImage}
                alt="Dire Dawa Ras Hotel"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </picture>
          ) : (
            <div className="w-full h-full bg-[#1a0c0c] flex items-center justify-center text-[#D4AF37]/45 text-sm uppercase font-bold tracking-widest">
              No images yet
            </div>
          )}
        </motion.div>
        
        {/* Double-layered overlay for high contrast text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/35 z-10" />
        <div className="absolute inset-0 bg-black/30 z-10" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Explanatory Content Panel with premium stagger additions */}
          <ScrollRevealContainer className="lg:col-span-7 space-y-6 md:space-y-8 text-white text-left">
            <ScrollRevealItem direction="up" distance={30}>
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center space-x-2 bg-[#9C2A2A]/20 border border-[#D4AF37]/50 px-4 py-1.5 rounded-full text-[#D4AF37] text-xs font-bold tracking-widest uppercase transition-all duration-300">
                  <span>{heroSubtitleText}</span>
                </div>
              </div>
            </ScrollRevealItem>

            <ScrollRevealItem direction="up" distance={40}>
              <h1 className="leading-[1.05] tracking-tight uppercase">
                {titleParts.map((part, idx) => (
                  <span
                    key={idx}
                    className={
                      idx === 0
                        ? "font-sans font-light text-3xl sm:text-4xl md:text-5xl tracking-[0.18em] text-stone-200 block"
                        : "font-serif font-black text-5xl sm:text-7xl md:text-8xl text-[#D4AF37] block mt-2"
                    }
                  >
                    {part}
                  </span>
                ))}
              </h1>
            </ScrollRevealItem>

            <ScrollRevealItem direction="up" distance={30}>
              <div className="border-l-4 border-[#D4AF37] pl-4 space-y-1">
                <span className="block text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-mono font-bold">{heroSubtitleText}</span>
                <p className="font-serif text-lg sm:text-xl font-semibold text-[#f2ebe4] italic leading-none">
                  "{siteTaglineText}"
                </p>
              </div>
            </ScrollRevealItem>

            <ScrollRevealItem direction="up" distance={35}>
              <p className="text-[#f2ebe4]/95 text-sm sm:text-base md:text-lg max-w-xl font-normal leading-relaxed">
                {heroDescriptionText}
              </p>
            </ScrollRevealItem>

            <ScrollRevealItem direction="up" distance={30}>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onBookClick}
                  className="bg-[#D4AF37] text-[#1E1E1E] hover:bg-[#9C2A2A] hover:text-white hover:border-[#9C2A2A] border-2 border-[#D4AF37] px-8 py-4 rounded-full text-xs sm:text-sm font-bold tracking-widest uppercase shadow-xl hover:shadow-[#D4AF37]/10 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2.5 group cursor-pointer"
                >
                  <CalendarCheck className="w-5 h-5 shrink-0" />
                  <span>BOOK NOW</span>
                </button>

                <button
                  onClick={onWatchVideo}
                  className="bg-white/10 hover:bg-white/20 text-white hover:text-[#ebdacf] px-8 py-4 rounded-full text-xs sm:text-sm font-bold tracking-widest uppercase border border-white/20 hover:border-[#ebdacf]/40 backdrop-blur-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2.5 group cursor-pointer"
                >
                  <div className="bg-white/20 group-hover:bg-[#9C2A2A] w-7 h-7 rounded-full flex items-center justify-center transition-colors">
                    <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                  </div>
                  <span>Play Virtual Tour</span>
                </button>
              </div>
            </ScrollRevealItem>

            <ScrollRevealItem direction="up" distance={20}>
              <div className="flex items-center space-x-6 pt-2 text-xs tracking-wider text-white/75 font-mono uppercase">
                <div className="flex items-center space-x-2">
                  <Navigation className="w-3.5 h-3.5 text-[#ebdacf]" />
                  <span>Kezira, Dire Dawa, Ethiopia</span>
                </div>
              </div>
            </ScrollRevealItem>
          </ScrollRevealContainer>

          {/* Quick Informational Highlights card widget */}
          <div className="hidden lg:block lg:col-span-5 relative mt-6">
            <ScrollReveal direction="left" distance={70} delay={0.25} scaleStart={0.94}>
              <div className="bg-gradient-to-br from-[#2D1111]/90 to-[#1A0707]/95 backdrop-blur-xl rounded-[40px] p-8 border border-[#D4AF37]/35 shadow-2xl relative overflow-hidden text-left">
                {/* Decorative accent lines */}
                <div className="absolute top-0 left-0 w-2.5 h-full bg-[#D4AF37]" />
                
                <h3 className="font-serif text-2xl font-bold text-[#ebdacf] mb-4">
                  Historic Hospitality
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  Established as a cornerstone of Dire Dawa's golden age, Ras Hotel has hosted presidents, artists, and international travelers for generations. Explore our lush imperial estate and beautiful architectural columns.
                </p>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#D4AF37]/20 font-sans">
                  <div>
                    <div className="text-xs text-stone-400 font-semibold tracking-widest uppercase mb-1">Check-in from</div>
                    <div className="text-sm font-bold text-white">12:00 PM (Midday)</div>
                  </div>
                  <div>
                    <div className="text-xs text-stone-400 font-semibold tracking-widest uppercase mb-1">Check-out before</div>
                    <div className="text-sm font-bold text-white">11:00 AM (Morning)</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
