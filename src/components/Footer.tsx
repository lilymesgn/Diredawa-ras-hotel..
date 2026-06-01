import { Phone, Mail, Clock, MapPin } from "lucide-react";

interface FooterProps {
  onNavClick: (page: string) => void;
  settings?: any;
  contentBlocks?: Record<string, any>;
}

export default function Footer({ onNavClick, settings, contentBlocks }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const getBlock = (key: string, backup: string): string => {
    if (!contentBlocks || !contentBlocks[key]) return backup;
    const b = contentBlocks[key];
    if (typeof b === "string") return b;
    return b.value || b.content || b.title || backup;
  };

  const supportEmail = settings?.support_email || "ddrashotel1@gmail.com";
  const siteName = settings?.site_name || "Dire Dawa Ras Hotel";
  const copyrightText = getBlock("footer_copyright", `© 2026 ${siteName.toUpperCase()} GROUP • ALL RIGHTS RESERVED`);

  const footerLinks = [
    { label: "Home", val: "home" },
    { label: "Rooms & Suites", val: "rooms" },
    { label: "About Us", val: "about" },
    { label: "Dining", val: "dining" },
    { label: "Gallery", val: "gallery" },
    { label: "Contact Us", val: "contact" }
  ];

  return (
    <footer className="bg-[#1A0707] text-stone-300 pt-16 pb-10 border-t border-[#D4AF37]/25 select-none font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/5 text-left">
          {/* Logo & Brand statement */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3.5">
              <img 
                src="https://i.ibb.co/xS8gGjtb/Picsart-26-05-26-05-22-39-801.png" 
                alt="Official Dire Dawa Ras Hotel Logo" 
                className="h-10 w-auto object-contain rounded-md"
                referrerPolicy="no-referrer"
              />
              <div className="text-left leading-none">
                <span className="block font-serif text-[0.75rem] font-bold text-white tracking-tight uppercase">
                  Dire Dawa
                </span>
                <span className="block font-serif text-[0.9rem] font-black text-[#D4AF37] tracking-wide uppercase">
                  {siteName}
                </span>
              </div>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              Established 1964 E.C. in Kezira sector, {siteName} stands holds generations of memories in its grand estates, delivering pristine legacy accommodation designed with authentic Ethiopian warmth.
            </p>
            <div className="flex space-x-3.5 pt-2">
              <a
                href="https://www.facebook.com/profile.php?id=61570400957998"
                target="_blank"
                rel="noopener noreferrer"
                role="link"
                className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-[#D4AF37]/20 hover:text-white transition-colors cursor-pointer"
                aria-label="Facebook Page"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h3V1h-4c-3.1 0-5 1.9-5 5v2z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@rashoteldiredawa"
                target="_blank"
                rel="noopener noreferrer"
                role="link"
                className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-[#D4AF37]/20 hover:text-white transition-colors cursor-pointer"
                aria-label="YouTube Channel"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@ras_dire"
                target="_blank"
                rel="noopener noreferrer"
                role="link"
                className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-[#D4AF37]/20 hover:text-white transition-colors cursor-pointer"
                aria-label="TikTok Profile"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31.03 2.5.34 3.53 1a7.71 7.71 0 0 0 2.5 1.05V6.15s-1 .09-2.09-.32c-1-.38-1.74-.94-2.16-1.58-.1-.13-.1-.13-.1.1v9c0 1.25-.26 2.37-.8 3.3a5.55 5.55 0 0 1-5.71 2.8c-2-.32-3.41-1.52-4.13-3.44A6.13 6.13 0 0 1 3.23 12a5.75 5.75 0 0 1 1-3.3c.92-1.31 2.22-2 3.9-2.07 1 0 1.15.08 1.15.08v3.42s-.58-.17-1.15-.11a2.3 2.3 0 0 0-2.07 2.2c-.08 1.17.68 2.05 1.8 2.19 1 .1 1.77-.38 2.07-1.29.11-.3.12-.55.12-1V0h2.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Navigation column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-serif text-sm font-bold text-white tracking-wider border-b border-white/5 pb-2">
              Navigation Room
            </h4>
            <ul className="space-y-2.5 text-xs">
              {footerLinks.map((link) => (
                <li key={link.val}>
                  <button
                    onClick={() => {
                      onNavClick(link.val);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:text-[#D4AF37] transition text-left cursor-pointer text-stone-400 capitalize block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact desk snapshot */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-serif text-sm font-bold text-white tracking-wider border-b border-white/5 pb-2">
              Concierge Access
            </h4>
            <ul className="space-y-3.5 text-xs text-stone-400">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>HVQ5+FGV, Kezira, Dire Dawa, Ethiopia</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div className="flex flex-col">
                  <span>+251 25 111 3255</span>
                  <span>+251 91 532 0033 (WhatsApp)</span>
                </div>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{supportEmail}</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Reception Desk Open 24/7</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal licensing statement */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-[11px] text-stone-500 text-center gap-4">
          <p>
            {copyrightText}
          </p>
          <div className="flex space-x-4 uppercase tracking-widest font-semibold text-[10px]">
            <button onClick={() => onNavClick("home")} className="hover:text-[#D4AF37] transition">TERMS</button>
            <span>•</span>
            <button onClick={() => onNavClick("home")} className="hover:text-[#D4AF37] transition">PRIVACY</button>
            <span>•</span>
            <button onClick={() => onNavClick("home")} className="hover:text-[#D4AF37] transition">SITEMAP</button>
          </div>
        </div>

      </div>
    </footer>
  );
}
