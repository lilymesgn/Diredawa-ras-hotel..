import { Landmark, Award, ShieldCheck, History, Heart } from "lucide-react";
import ScrollParallaxImage from "./ScrollParallaxImage";
import { ScrollReveal, ScrollRevealContainer, ScrollRevealItem } from "./ScrollReveal";

export default function AboutUsPage() {
  const brandMilestones = [
    {
      year: "1964 E.C.",
      title: "Establishment & Golden Opening",
      desc: "Founded durign a glorious transformative era, Dire Dawa Ras Hotel opened as the premiere luxury property serving royal, business, and international tourists."
    },
    {
      year: "1980s G.C.",
      title: "Cultural Hub of Kezira",
      desc: "Grew as the definitive intellectual, political, and cultural node of Kezira, serving as a sanctuary for musicians, international diplomats, and historical travelers."
    },
    {
      year: "Modern Era",
      title: "Conserving Heritage Comforts",
      desc: "Carefully updated to feature essential contemporary tech amenities while preserving the grand architectural masonry, wooden headboards, and lush tropical gardens."
    }
  ];

  return (
    <div className="py-24 bg-[#FAF2E3]/60 font-sans selection:bg-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Title Hero Header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-[0.25em] block">
            Our Historic Story
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-extrabold text-[#9C2A2A] leading-tight">
            A Journey of Grand Tradition Since 1964 E.C.
          </h2>
          <div className="h-0.5 w-16 bg-[#D4AF37] mx-auto my-4" />
          <p className="text-[#3a352d]/85 text-sm md:text-base leading-relaxed">
            Nestled in Kezira's historic commercial streets, Dire Dawa Ras Hotel is a living hallmark of genuine hospitality, carrying generations of memories inside its majestic corridors.
          </p>
        </ScrollReveal>

        {/* Story Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Elegant Image Column with double offsets */}
          <ScrollReveal direction="right" distance={40} className="relative">
            <div className="absolute inset-0 bg-[#9C2A2A] rounded-[40px] transform rotate-3" />
            <div className="relative z-10 aspect-[4/3] rounded-[40px] overflow-hidden border border-[#D4AF37]/30 shadow-2xl">
              <ScrollParallaxImage 
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&auto=format" 
                alt="Pristine garden path and vintage architectural exterior" 
                className="w-full h-full"
              />
            </div>
            {/* Embedded Accent Badge */}
            <div className="absolute -bottom-6 -right-6 md:right-4 bg-[#9C2A2A] text-[#D4AF37] border-2 border-[#D4AF37] p-6 rounded-3xl shadow-xl z-20 text-center space-y-1">
              <div className="text-2xl font-serif font-black">1964 E.C.</div>
              <div className="text-[9px] uppercase font-bold tracking-widest text-white leading-none">Established Year</div>
            </div>
          </ScrollReveal>

          {/* Narrative Text */}
          <ScrollReveal direction="left" distance={40} className="space-y-6 text-left">
            <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-[0.2em] flex items-center space-x-2">
              <History className="w-4 h-4 text-[#9C2A2A]" />
              <span>Vintage Legacy & Columns</span>
            </span>
            <h3 className="font-serif text-3xl font-extrabold text-[#9C2A2A] leading-none">
              Traditional Warmth & Modern Comforts
            </h3>
            <p className="text-stone-600 text-xs md:text-sm leading-relaxed">
              Dire Dawa Ras Hotel was established in 1964 E.C. in the heart of Dire Dawa, Ethiopia. For half a century, it has continuously welcomed international dignitaries, diplomats, and families seeking a serene oasis in the warmer, vibrant trade hub city.
            </p>
            <p className="text-stone-600 text-xs md:text-sm leading-relaxed">
              Our guest rooms are thoughtfully updated, featuring traditional woodcraft details combined with modern high-speed internet, premium air conditioning, and plush linens. We believe in providing an immersive hospitality experience that pays absolute homage to Ethiopia's deep, generous coffee traditions and warm heritage.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-stone-200">
              <div className="flex items-start space-x-3.5">
                <div className="bg-[#9C2A2A]/10 p-2.5 rounded-xl text-[#9C2A2A] border border-[#9C2A2A]/15 shrink-0">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-850 text-xs">Architectural Gems</h4>
                  <p className="text-[10px] text-stone-500 mt-1">Preserved post-classical pillars and wooden window sills.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="bg-[#9C2A2A]/10 p-2.5 rounded-xl text-[#9C2A2A] border border-[#9C2A2A]/15 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-850 text-xs">Royal Service</h4>
                  <p className="text-[10px] text-stone-500 mt-1">Authentic attention to detail, customized local itineraries.</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Milestone Timeline Segment with scale and reveal */}
        <ScrollReveal scaleStart={0.94} className="bg-[#9C2A2A] rounded-[40px] p-8 md:p-16 text-white text-left relative overflow-hidden shadow-2xl border border-[#D4AF37]/30">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="max-w-2xl mb-12 space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-[0.25em]">Our Milestones</span>
            <h3 className="font-serif text-3xl font-extrabold text-white">Chronicle of Heritage Achievements</h3>
          </div>

          <ScrollRevealContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {brandMilestones.map((stone, sIdx) => (
              <ScrollRevealItem key={sIdx} className="space-y-4 border-l-2 border-[#D4AF37]/45 pl-6 py-2">
                <span className="font-mono text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-full border border-[#D4AF37]/20 inline-block">
                  {stone.year}
                </span>
                <h4 className="font-serif text-lg font-bold text-white leading-tight">
                  {stone.title}
                </h4>
                <p className="text-stone-200 text-xs leading-relaxed">
                  {stone.desc}
                </p>
              </ScrollRevealItem>
            ))}
          </ScrollRevealContainer>
        </ScrollReveal>

        {/* Hospitality Pledge Card */}
        <ScrollReveal scaleStart={0.93} distance={50} className="mt-20 flex flex-col items-center justify-center p-8 bg-white border border-stone-200 rounded-[32px] text-center shadow-lg max-w-2xl mx-auto space-y-4">
          <div className="bg-[#FAF2E3] p-3 rounded-full text-[#9C2A2A] border border-[#D4AF37]/35">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h4 className="font-serif text-xl font-bold text-[#9C2A2A]">Our Genuine Hospitality Guarantee</h4>
          <p className="text-stone-500 text-xs md:text-sm leading-relaxed">
            "When you cross our wooden thresholds, you aren't merely checking into a room; you are becoming an esteemed house guest in our legacy. We pledge to make your visit cooler, safer, and filled with the rich warmth of Dire Dawa's golden sun."
          </p>
          <div className="flex items-center justify-center space-x-1.5 text-xs text-[#9C2A2A] font-bold">
            <Heart className="w-4 h-4 text-[#D4AF37] fill-current" />
            <span>Management & Recpetion Team</span>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
