import React, { useState, useEffect } from "react";
import { Phone, Menu, X } from "lucide-react";

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onBookClick: () => void;
}

export default function Navbar({ activePage, setActivePage, onBookClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "HOME", val: "home" },
    { label: "ROOMS & SUITES", val: "rooms" },
    { label: "ABOUT US", val: "about" },
    { label: "DINING", val: "dining" },
    { label: "GALLERY", val: "gallery" },
    { label: "CONTACT US", val: "contact" }
  ];

  const handlePageSelect = (pageVal: string) => {
    setActivePage(pageVal);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      id="navbar-header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-md border-b ${
        isScrolled
          ? "bg-[#9C2A2A] border-b border-[#D4AF37]/35 shadow-xl py-2.5"
          : "bg-[#9C2A2A]/95 py-4 border-b border-[#D4AF37]/15"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo / Brand */}
          <button 
            onClick={() => handlePageSelect("home")} 
            className="site-logo flex items-center space-x-3.5 group select-none shrink-0 text-left cursor-pointer"
          >
            {/* Brand Logo - Designed for Website Integration */}
            <div className="relative h-12 flex items-center justify-center overflow-hidden py-0.5">
              <img 
                src="https://i.ibb.co/xS8gGjtb/Picsart-26-05-26-05-22-39-801.png" 
                alt="Dire Dawa Ras Hotel Logo" 
                className="h-full w-auto object-contain max-h-[44px] block rounded-md"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-left flex flex-col justify-center">
              <span className="block font-serif text-[0.75rem] sm:text-[0.95rem] font-black tracking-wide uppercase whitespace-nowrap">
                <span className="text-white group-hover:text-[#D4AF37] transition-colors font-bold">Dire Dawa</span> <span className="text-[#D4AF37]">Ras Hotel</span>
              </span>
              <span className="block font-sans text-[0.55rem] sm:text-[0.6rem] leading-none mt-1 text-white/75 font-medium tracking-tight whitespace-nowrap">
                ድሬዳዋ ራስ ሆቴል • EST. 1964
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handlePageSelect(item.val)}
                className={`text-xs font-semibold tracking-wider transition-colors duration-200 py-2 border-b-2 cursor-pointer uppercase ${
                  activePage === item.val
                    ? "text-[#D4AF37] border-[#D4AF37]"
                    : "text-white/95 hover:text-[#D4AF37] border-transparent hover:border-[#D4AF37]/45"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Interactive Telephone & CTA Book Button */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex flex-col text-right font-medium">
              <a
                href="tel:+251251113255"
                className="flex items-center space-x-2 text-xs text-white/85 hover:text-[#D4AF37] transition-colors duration-200"
              >
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="font-semibold tracking-wide font-sans">+251 25 111 3255</span>
              </a>
              <a
                href="tel:+251915320033"
                className="flex items-center space-x-2 text-xs text-white/85 hover:text-[#D4AF37] transition-colors duration-200 mt-1"
              >
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="font-semibold tracking-wide font-sans">+251 91 532 0033</span>
              </a>
            </div>

            <button
              onClick={onBookClick}
              className="bg-[#D4AF37] text-[#1E1E1E] hover:bg-[#FAF2E3] px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center space-x-2 border-2 border-[#D4AF37]"
            >
              <span>Book Now</span>
            </button>
          </div>

          {/* Mobile Actions Panel (Phone + Hamburger) */}
          <div className="flex items-center space-x-4 lg:hidden">
            <a
              href="tel:+251915320033"
              className="p-2 text-white/95 hover:text-[#D4AF37] transition-colors"
              title="Call Reception"
            >
              <Phone className="w-5 h-5 text-[#D4AF37]" />
            </a>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-white/95 hover:bg-white/10 hover:text-white transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 top-[72px] bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Drawer Panel */}
      <div
        className={`fixed right-0 top-[72px] h-[calc(100vh-72px)] w-4/5 max-w-sm bg-[#FAF2E3]/95 backdrop-blur-xl border-l border-[#D4AF37]/30 z-40 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex-1 flex flex-col justify-between overflow-y-auto">
          {/* Navigation Items */}
          <nav className="flex flex-col space-y-4">
            {menuItems.map((item, idx) => (
              <button
                key={item.label}
                onClick={() => handlePageSelect(item.val)}
                className={`text-base font-serif font-bold text-left border-b border-gray-150 pb-3 transition-colors block cursor-pointer uppercase ${
                  activePage === item.val
                    ? "text-[#9C2A2A]"
                    : "text-gray-800 hover:text-[#9C2A2A]"
                }`}
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Call / Action panel for mobile */}
          <div className="border-t border-gray-150 pt-6 space-y-4">
            <div className="space-y-2">
              <a
                href="tel:+251251113255"
                className="flex items-center space-x-3 text-gray-750 hover:text-[#9C2A2A] justify-center p-3 rounded-xl bg-gray-50 hover:bg-stone-50 transition-colors"
              >
                <Phone className="w-5 h-5 text-[#9C2A2A]" />
                <span className="font-semibold">+251 25 111 3255</span>
              </a>
              <a
                href="tel:+251915320033"
                className="flex items-center space-x-3 text-gray-750 hover:text-[#9C2A2A] justify-center p-3 rounded-xl bg-gray-50 hover:bg-stone-50 transition-colors"
              >
                <Phone className="w-5 h-5 text-[#9C2A2A]" />
                <span className="font-semibold">+251 91 532 0033</span>
              </a>
            </div>

            <button
              onClick={() => {
                setIsOpen(false);
                onBookClick();
              }}
              className="w-full bg-[#D4AF37] text-[#1E1E1E] hover:bg-[#9C2A2A] hover:text-white py-3.5 rounded-xl font-bold text-center shadow-md select-none tracking-wider text-sm flex justify-center items-center space-x-2 border-2 border-[#D4AF37]"
            >
              <span>BOOK YOUR STAY NOW</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
