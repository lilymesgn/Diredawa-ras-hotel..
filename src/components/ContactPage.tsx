import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, ShieldAlert } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

export default function ContactPage() {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Room Reservation",
    message: ""
  });
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setFormData({ name: "", email: "", subject: "Room Reservation", message: "" });
      setTimeout(() => setIsSent(false), 5000);
    }, 1200);
  };

  return (
    <div className="py-24 bg-[#FAF2E3]/65 font-sans selection:bg-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Header Descriptor with scroll reveal */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-[0.25em] block">
            Get In Touch
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-extrabold text-[#9C2A2A] leading-tight">
            Connect With Our Concierge Desk
          </h2>
          <div className="h-0.5 w-16 bg-[#D4AF37] mx-auto my-4" />
          <p className="text-stone-600 text-sm md:text-base leading-relaxed">
            Have a special accommodation request? Planning an imperial wedding on our luxury lawns, or setting up a corporate meeting? Reach out to us 24/7 or send us a fast feedback note.
          </p>
        </ScrollReveal>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          
          {/* Column A: Information Directory */}
          <ScrollReveal direction="right" distance={40} className="lg:col-span-5 space-y-8 text-left">
            {/* Standard Directory Card */}
            <div className="bg-white rounded-[32px] p-8 border border-stone-200/70 shadow-sm space-y-6">
              <h3 className="font-serif text-xl font-bold text-[#9C2A2A] border-b border-stone-100 pb-3">
                Official Directory
              </h3>
              
              <ul className="space-y-6 text-xs md:text-sm">
                
                <li className="flex items-start space-x-4">
                  <div className="bg-[#9C2A2A]/10 p-3 rounded-2xl text-[#9C2A2A] shrink-0 border border-[#9C2A2A]/15">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold text-gray-400 tracking-wider">Our Address</div>
                    <p className="text-stone-700 font-medium mt-1 leading-relaxed">
                      HVQ5+FGV Hotel, Kezira Commercial District, Dire Dawa 1487, Ethiopia
                    </p>
                  </div>
                </li>

                <li className="flex items-start space-x-4">
                  <div className="bg-[#9C2A2A]/10 p-3 rounded-2xl text-[#9C2A2A] shrink-0 border border-[#9C2A2A]/15">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold text-gray-400 tracking-wider">Phone Lines</div>
                    <div className="flex flex-col mt-1 font-sans text-stone-700 font-bold">
                      <a href="tel:+251251113255" className="hover:text-[#D4AF37] transition-colors font-sans">+251 25 111 3255 (Reception)</a>
                      <a href="tel:+251915320033" className="hover:text-[#D4AF37] transition-colors mt-1 font-sans">+251 91 532 0033 (Mobile & WhatsApp)</a>
                    </div>
                  </div>
                </li>

                <li className="flex items-start space-x-4">
                  <div className="bg-[#9C2A2A]/10 p-3 rounded-2xl text-[#9C2A2A] shrink-0 border border-[#9C2A2A]/15">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold text-gray-400 tracking-wider">Email Letters</div>
                    <p className="font-semibold text-stone-700 mt-1">
                      <a href="mailto:ddrashotel1@gmail.com" className="hover:text-[#D4AF37] transition-colors">ddrashotel1@gmail.com</a>
                    </p>
                  </div>
                </li>

                <li className="flex items-start space-x-4">
                  <div className="bg-[#9C2A2A]/10 p-3 rounded-2xl text-[#9C2A2A] shrink-0 border border-[#9C2A2A]/15">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold text-gray-400 tracking-wider">Checkin details</div>
                    <p className="text-stone-700 font-medium mt-1">
                      Reception Desk open 24/7. Check-in starts 12:00 PM. Check-out by 11:00 AM.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Support Highlight Frame */}
            <div className="bg-[#9C2A2A] text-white rounded-[32px] p-6 border border-[#D4AF37]/20 flex items-center space-x-4">
              <div className="bg-[#D4AF37] text-[#1E1E1E] p-3 rounded-xl shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-serif font-bold text-sm text-stone-100">Instantly Book via WhatsApp</h4>
                <p className="text-[11px] text-stone-200 mt-0.5">Need a faster answer? Text our concierge on WhatsApp at +251 91 532 0033.</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Column B: Interactive Contact Inquiry Form */}
          <ScrollReveal direction="left" distance={40} className="lg:col-span-7 bg-white rounded-[40px] p-8 md:p-10 border border-stone-200/70 shadow-md text-left">
            <h3 className="font-serif text-2xl font-bold text-[#9C2A2A] mb-2 leading-none">
              Inquiry Submission Card
            </h3>
            <p className="text-stone-500 text-xs mb-8">
              Fill out the details below, and our guest operations director will respond to your registered email address within 12 hours.
            </p>

            {isSent && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center space-x-3.5 animate-in fade-in duration-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="font-medium">Thank you for your message! Our concierge representative has compiled your request.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block mb-2">Guest Full Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full text-xs font-medium p-3.5 bg-stone-50/80 border border-stone-200 rounded-xl focus:border-[#9C2A2A]/60 focus:bg-white outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full text-xs font-medium p-3.5 bg-stone-50/80 border border-stone-200 rounded-xl focus:border-[#9C2A2A]/60 focus:bg-white outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block mb-2">Inquiry Intent Tag</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full text-xs font-medium p-3.5 bg-stone-50/80 border border-stone-200 rounded-xl focus:border-[#9C2A2A]/60 focus:bg-white outline-none transition"
                >
                  <option>Room Reservation</option>
                  <option>Lawn Weddings & celebrations</option>
                  <option>Catering & Private Dinners</option>
                  <option>Corporate Events & meetings</option>
                  <option>Feedback & General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block mb-2">Your Message *</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your requested dates, guests details, or specifications..."
                  className="w-full text-xs font-medium p-3.5 bg-stone-50/80 border border-stone-200 rounded-xl focus:border-[#9C2A2A]/60 focus:bg-white outline-none transition resize-none"
                />
              </div>

              <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-medium">
                <ShieldAlert className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Your privacy is protected. We never sell or share communication logs.</span>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full md:w-auto bg-[#9C2A2A] text-white hover:bg-[#802222] px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center space-x-2.5"
              >
                <Send className="w-4 h-4 text-[#D4AF37]" />
                <span>{isSending ? "Transmitting..." : "Send Letter to Concierge"}</span>
              </button>
            </form>
          </ScrollReveal>
        </div>

        {/* Dedicated Interactive Maps block with scroll reveal */}
        <ScrollReveal scaleStart={0.95} className="space-y-4 text-left">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-[#9C2A2A]" />
            <h3 className="font-serif text-xl font-bold text-[#9C2A2A]">Interactive Google Map</h3>
          </div>
          
          <div className="relative aspect-[21/9] min-h-[350px] rounded-[40px] bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center text-center shadow-md">
            {isMapLoaded ? (
              <iframe
                title="Google Map location widget"
                src="https://maps.google.com/maps?q=HVQ5%2BFGV%20Hotel%2C%20Dire%20Dawa%201487%2C%20Ethiopia&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="p-8 flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-full text-[#9C2A2A] border border-stone-250 shadow-sm">
                  <MapPin className="w-7 h-7 text-[#D4AF37] animate-bounce" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-gray-800">Ready to Load Address Panel</h4>
                  <p className="text-stone-500 text-xs max-w-sm mt-1 leading-normal">Click the launcher below to load the secure, high-speed regional Google Map frame of Kezira, Dire Dawa Ras Hotel.</p>
                </div>
                <button
                  onClick={() => setIsMapLoaded(true)}
                  className="bg-[#D4AF37] text-[#1E1E1E] hover:bg-[#c3a030] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition cursor-pointer shadow-md"
                >
                  Load Interactive Map
                </button>
              </div>
            )}
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
