import { Tag, Coffee, BadgePercent } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { Promotion } from "../types";

interface OffersProps {
  onGrabOfferClick: () => void;
  promotions?: Promotion[];
}

export default function Offers({ onGrabOfferClick, promotions }: OffersProps) {
  if (promotions !== undefined && promotions.length === 0) {
    return null;
  }
  const activePromo = promotions && promotions.length > 0 ? promotions[0] : null;

  const title = activePromo ? activePromo.title : "Early Bird Discount";
  const discountVal = activePromo ? activePromo.discount_percent : 15;
  const description = activePromo 
    ? activePromo.description 
    : "Plan ahead to guarantee your reservation. Book your accommodations directly with us and enjoy an instant 15% off room rates, complimentary traditional Ethiopian coffee, robust buffet breakfast, and early check-in.";
  const promoCode = activePromo ? activePromo.code : "EARLYBIRD15";

  const bannerImage = activePromo?.banner_image_url || null;

  const whatsappText = encodeURIComponent(
    `Hello Dire Dawa Ras Hotel! I would like to grab the ${title} (${discountVal}% Off) booking offer with promo code: ${promoCode}. Please provide availability details.`
  );
  const whatsappUrl = `https://wa.me/251915320033?text=${whatsappText}`;

  return (
    <section id="offers" className="py-16 md:py-20 bg-transparent select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Outer Visual Container with scroll reveal scale */}
        <ScrollReveal scaleStart={0.94} distance={40}>
          <div className="relative overflow-hidden bg-[#1C0D0D]/90 backdrop-blur-md text-white rounded-[40px] p-8 md:p-16 text-center shadow-2xl border border-[#DE9E36]/20">
            
            {/* Ambient Background Banner image or glowing spots */}
            {bannerImage ? (
              <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
                <img src={bannerImage} alt="Promotion Banner" className="w-full h-full object-cover" />
              </div>
            ) : null}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#DE9E36]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-stone-300/5 rounded-full blur-[80px] pointer-events-none" />

            {/* Centered Content Column */}
            <div className="relative max-w-3xl mx-auto space-y-6 md:space-y-8 z-10">
              
              {/* Promo Badge */}
              <div className="inline-flex items-center space-x-2 bg-[#DE9E36]/10 border border-[#DE9E36]/30 text-[#DE9E36] px-5 py-2 rounded-full text-xs font-bold tracking-[0.25em] uppercase">
                <Tag className="w-3.5 h-3.5 shrink-0" />
                <span>Special Promotion Code: {promoCode}</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                {title} <span className="text-[#DE9E36] italic">{discountVal}% Off</span>
              </h2>

              <p className="text-stone-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                {description}
              </p>

              {/* Bullet Highlights Icon grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 pb-4 max-w-xl mx-auto text-left font-sans">
                <div className="flex items-center space-x-3 text-stone-300">
                  <div className="bg-[#DE9E36]/15 p-2 rounded-lg text-[#DE9E36]">
                    <BadgePercent className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium">{discountVal}% Direct Discount</span>
                </div>
                
                <div className="flex items-center space-x-3 text-stone-300">
                  <div className="bg-[#DE9E36]/15 p-2 rounded-lg text-[#DE9E36]">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium">Complimentary Breakfast</span>
                </div>

                <div className="flex items-center space-x-3 text-stone-300 col-span-2 md:col-span-1">
                  <div className="bg-[#DE9E36]/15 p-2 rounded-lg text-[#DE9E36]">
                    <Tag className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium">Flexible Check-In/Out</span>
                </div>
              </div>

              {/* CTA action grab offer */}
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#DE9E36] hover:bg-[#c58223] text-[#1E1E1E] px-10 py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest shadow-lg hover:shadow-[#DE9E36]/20 hover:-translate-y-0.5 transition-all duration-300 inline-flex items-center space-x-2.5 group cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.1 1.449 4.6 1.451 5.4 0 9.8-4.386 9.8-9.778 0-2.617-1.015-5.074-2.861-6.918C16.335 2.062 13.9 1.045 11.9 1.045c-5.4 0-9.8 4.386-9.8 9.778a9.6 9.6 0 0 0 1.5 5.1L2.6 21.4l5.5-1.446-.5.2zM18.1 14.8c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.4-.5-2.7-1.7-.9-.8-1.6-1.9-1.8-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.2.3-.4 0-.2 0-.4-.1-.5-.1-.2-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5-.2 0-.4 0-.6 0s-.6.1-.9.4c-.3.3-1.1 1.1-1.1 2.7 0 1.6 1.1 3.2 1.3 3.4.2.2 2.2 3.4 5.4 4.7 3.2 1.3 3.2.9 3.8.8.6-.1 1.9-.8 2.2-1.6.3-.8.3-1.4.2-1.6s-.3-.2-.6-.3z" />
                  </svg>
                  <span>Grab Direct Offer</span>
                </a>
              </div>

              <p className="text-[10px] text-stone-500 font-mono tracking-wider uppercase pt-2">
                *Offer code {promoCode} details are stored dynamically. Terms and conditions apply.
              </p>
            </div>

          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
