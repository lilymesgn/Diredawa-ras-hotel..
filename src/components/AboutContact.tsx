import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";

export default function AboutContact() {
  const currentYear = new Date().getFullYear();
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElem = document.querySelector(targetId);
    if (targetElem) {
      targetElem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div id="about" className="bg-[#1A0707] text-stone-300 pt-20 pb-10 select-none border-t border-[#DE9E36]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* About Diredawa Ras Hotel Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/5">
          
          <div className="lg:col-span-4 space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#DE9E36] tracking-[0.25em] block">Legacy Hospitality</span>
              <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-[#fdf9f4]">
                Dire Dawa Ras Hotel
              </h2>
            </div>
            
            <p className="text-stone-400 text-sm leading-relaxed">
              Dire Dawa Ras Hotel is established in 1964 E.C. in Dire Dawa, Ethiopia. Offering full-service accommodation for business and leisure travelers. Located in Kezira, it combines convenient access to the city center with traditional hospitality and modern amenities.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono font-semibold">
              <span className="bg-[#DE9E36]/15 border border-[#DE9E36]/35 px-3 py-1 rounded-full text-[#DE9E36]">
                Established 1964 EC
              </span>
              <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-stone-300">
                Dire Dawa, Ethiopia
              </span>
            </div>
          </div>

          {/* Quick Contacts Column */}
          <div className="lg:col-span-4 space-y-6 text-left border-t lg:border-t-0 pt-8 lg:pt-0">
            <h3 className="font-serif text-lg font-bold text-[#fdf9f4] tracking-wide border-b border-white/5 pb-2">
              Contact & Social Channels
            </h3>
            
            <ul className="space-y-4 text-xs text-stone-400 font-sans">
              <li className="flex items-start space-x-3 text-stone-300">
                <MapPin className="w-4 h-4 text-[#DE9E36] shrink-0 mt-0.5" />
                <span>HVQ5+FGV Hotel, Dire Dawa 1487, Ethiopia</span>
              </li>
              
              <li className="flex items-center space-x-3 text-stone-300">
                <Phone className="w-4 h-4 text-[#DE9E36] shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+251251113255" className="hover:text-[#DE9E36] transition-colors leading-none">+251 25 111 3255</a>
                  <a href="tel:+251915320033" className="hover:text-[#DE9E36] transition-colors leading-none mt-2">+251 91 532 0033</a>
                </div>
              </li>
              
              <li className="flex items-center space-x-3 text-stone-300">
                <Mail className="w-4 h-4 text-[#DE9E36] shrink-0" />
                <a href="mailto:ddrashotel1@gmail.com" className="hover:text-[#DE9E36] transition-colors">ddrashotel1@gmail.com</a>
              </li>

              <li className="flex items-center space-x-3 text-stone-300">
                <svg className="w-4 h-4 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.1 1.449 4.6 1.451 5.4 0 9.8-4.386 9.8-9.778 0-2.617-1.015-5.074-2.861-6.918C16.335 2.062 13.9 1.045 11.9 1.045c-5.4 0-9.8 4.386-9.8 9.778a9.6 9.6 0 0 0 1.5 5.1L2.6 21.4l5.5-1.446-.5.2zM18.1 14.8c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.4-.5-2.7-1.7-.9-.8-1.6-1.9-1.8-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.2.3-.4 0-.2 0-.4-.1-.5-.1-.2-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5-.2 0-.4 0-.6 0s-.6.1-.9.4c-.3.3-1.1 1.1-1.1 2.7 0 1.6 1.1 3.2 1.3 3.4.2.2 2.2 3.4 5.4 4.7 3.2 1.3 3.2.9 3.8.8.6-.1 1.9-.8 2.2-1.6.3-.8.3-1.4.2-1.6s-.3-.2-.6-.3z" />
                </svg>
                <a 
                  href="https://wa.me/251915320033" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#DE9E36] transition-colors font-semibold"
                >
                  +251 91 532 0033
                </a>
              </li>

              <li className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-[#DE9E36] shrink-0" />
                <span>24/7 Front Reception Help Desk</span>
              </li>
            </ul>

            {/* Social media connections */}
            <div className="pt-4 flex items-center space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=61570400957998"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook Page"
                className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-[#DE9E36]/20 hover:border-[#DE9E36]/50 hover:text-white text-stone-300 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h3V1h-4c-3.1 0-5 1.9-5 5v2z" />
                </svg>
              </a>

              <a
                href="https://www.youtube.com/@rashoteldiredawa"
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube Channel"
                className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-[#DE9E36]/20 hover:border-[#DE9E36]/50 hover:text-white text-stone-300 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              <a
                href="https://www.tiktok.com/@ras_dire"
                target="_blank"
                rel="noopener noreferrer"
                title="TikTok Account"
                className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-[#DE9E36]/20 hover:border-[#DE9E36]/50 hover:text-white text-stone-300 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31.03 2.5.34 3.53 1a7.71 7.71 0 0 0 2.5 1.05V6.15s-1 .09-2.09-.32c-1-.38-1.74-.94-2.16-1.58-.1-.13-.1-.13-.1.1v9c0 1.25-.26 2.37-.8 3.3a5.55 5.55 0 0 1-5.71 2.8c-2-.32-3.41-1.52-4.13-3.44A6.13 6.13 0 0 1 3.23 12a5.75 5.75 0 0 1 1-3.3c.92-1.31 2.22-2 3.9-2.07 1 0 1.15.08 1.15.08v3.42s-.58-.17-1.15-.11a2.3 2.3 0 0 0-2.07 2.2c-.08 1.17.68 2.05 1.8 2.19 1 .1 1.77-.38 2.07-1.29.11-.3.12-.55.12-1V0h2.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Map Section Row */}
          <div className="lg:col-span-4 space-y-6 text-left border-t lg:border-t-0 pt-8 lg:pt-0">
            <h3 className="font-serif text-lg font-bold text-[#fdf9f4] tracking-wide border-b border-white/5 pb-2">
              Our Location in Dire Dawa
            </h3>
            
            {/* Click to Load Google Map Widget */}
            <div className="relative aspect-video rounded-2xl bg-[#1A0707] border border-white/5 overflow-hidden flex items-center justify-center text-center">
              {isMapLoaded ? (
                <iframe
                  title="Dire Dawa Ras Hotel Location Map"
                  src="https://maps.google.com/maps?q=HVQ5%2BFGV%20Hotel%2C%20Dire%20Dawa%201487%2C%20Ethiopia&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="p-4 flex flex-col items-center space-y-3">
                  <div className="bg-white/5 p-3 rounded-full text-[#DE9E36] border border-white/10">
                    <MapPin className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">HVQ5+FGV Hotel, Dire Dawa, Ethiopia</p>
                    <p className="text-[10px] text-stone-550 mt-1 leading-snug">Click below to load the interactive privacy-friendly Google Map</p>
                  </div>
                  <button
                    onClick={() => setIsMapLoaded(true)}
                    className="bg-[#DE9E36] text-[#1E1E1E] hover:bg-[#c58223] px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition cursor-pointer"
                  >
                    Click to load map
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer copyright block */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500 text-center gap-4">
          <p>
            © {currentYear} DIRE DAWA RAS HOTEL
            <br />
            ድሬዳዋ ራስ ሆቴል • EST. 1964
          </p>
          <div className="flex space-x-4 uppercase tracking-wider font-semibold">
            <a href="#home" onClick={(e) => handleSmoothScroll(e, "#home")} className="hover:text-[#DE9E36] transition">Terms</a>
            <span>•</span>
            <a href="#home" onClick={(e) => handleSmoothScroll(e, "#home")} className="hover:text-[#DE9E36] transition">Privacy</a>
            <span>•</span>
            <a href="#home" onClick={(e) => handleSmoothScroll(e, "#home")} className="hover:text-[#DE9E36] transition">Sitemap</a>
          </div>
        </div>

      </div>
    </div>
  );
}
