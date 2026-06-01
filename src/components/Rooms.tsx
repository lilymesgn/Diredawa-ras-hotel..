import React, { useState, useEffect } from "react";
import { Eye, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { Room } from "../types";
import { ROOMS } from "../data";
import ScrollParallaxImage from "./ScrollParallaxImage";
import { ScrollReveal, ScrollRevealContainer, ScrollRevealItem } from "./ScrollReveal";

interface RoomsProps {
  rooms?: Room[];
  loading?: boolean;
  onSelectRoomPreload: (room: Room) => void;
  onOpenDetailModal: (room: Room) => void;
}

function RoomCard({ 
  room, 
  onSelectRoomPreload, 
  onOpenDetailModal 
}: { 
  room: Room; 
  onSelectRoomPreload: (room: Room) => void; 
  onOpenDetailModal: (room: Room) => void; 
  key?: string | number;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = room.imageUrls || [room.imageUrl];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      className="bg-white/30 backdrop-blur-md rounded-[40px] overflow-hidden shadow-lg hover:shadow-2xl border border-white/60 transition-all duration-350 ease-out group flex flex-col justify-between"
      id={`room-card-${room.id}`}
    >
      {/* Dynamic Image Preview with Controls */}
      <div className="relative h-64 overflow-hidden select-none bg-stone-100">
        <ScrollParallaxImage
          src={images[currentImageIndex]}
          alt={`${room.title} view ${currentImageIndex + 1}`}
          className="w-full h-full"
          width={400}
          height={256}
        />

        {/* Dynamic Navigational Arrows Overlay */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 hover:bg-[#9C2A2A] border border-white/10 text-white transition-all cursor-pointer opacity-80 hover:opacity-100"
              aria-label="Previous room photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 hover:bg-[#9C2A2A] border border-white/10 text-white transition-all cursor-pointer opacity-80 hover:opacity-100"
              aria-label="Next room photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Dots indicators overlay */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 flex space-x-1.5 bg-black/20 backdrop-blur-md px-2 py-1 rounded-full border border-white/5">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(idx);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                  currentImageIndex === idx ? "bg-[#ebdacf] scale-125" : "bg-white/40"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Nightly Price Badge Overlay */}
        <div className="absolute bottom-4 left-4 bg-white/70 backdrop-blur-md px-4 py-2 rounded-2xl shadow-md border border-white/60">
          <span className="text-[10px] uppercase font-bold text-[#9C2A2A] tracking-widest block leading-none mb-1">Nightly rate</span>
          <span className="font-serif text-lg font-bold text-[#9C2A2A]">ETB {room.price.toLocaleString()}</span>
          <span className="text-xs text-stone-600 font-medium"> / Night</span>
        </div>

        {/* Top Corner Details */}
        <div className="absolute top-4 right-4 bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center space-x-1.5 text-white border border-white/10">
          <Shield className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
          <span className="font-mono text-[9px] font-bold tracking-wider uppercase">Best Rate Confirmed</span>
        </div>
      </div>

      {/* Informational Details */}
      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between text-left">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#9C2A2A] group-hover:text-[#D4AF37] transition-colors mb-2">
            {room.title}
          </h3>
          
          <div className="flex items-center space-x-4 mb-4 font-sans text-xs text-gray-400 font-semibold uppercase tracking-wider">
            <span>{room.size}</span>
            <span className="text-stone-300">•</span>
            <span>Max {room.maxGuests} Guests</span>
          </div>

          <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-6">
            {room.description}
          </p>

          {/* Highlights Bullet List snippets */}
          <div className="flex flex-wrap gap-2 mb-6">
            {room.amenities.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="text-[10px] font-medium text-stone-700 bg-white/45 border border-white/55 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm"
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 4 && (
              <span className="text-[10px] font-bold text-[#9C2A2A] px-2 py-1">
                +{room.amenities.length - 4} More
              </span>
            )}
          </div>
        </div>

        {/* Card CTA Handlers */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={() => onOpenDetailModal(room)}
            className="w-full border border-[#9C2A2A]/30 hover:border-[#9C2A2A] text-[#9C2A2A] hover:bg-stone-50/50 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center space-x-1.5 cursor-pointer min-h-[44px]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Specs</span>
          </button>

          <button
            onClick={() => onSelectRoomPreload(room)}
            className="w-full bg-[#D4AF37] hover:bg-[#9C2A2A] text-[#1E1E1E] hover:text-white py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-sm hover:shadow-md cursor-pointer min-h-[44px]"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.1 1.449 4.6 1.451 5.4 0 9.8-4.386 9.8-9.778 0-2.617-1.015-5.074-2.861-6.918C16.335 2.062 13.9 1.045 11.9 1.045c-5.4 0-9.8 4.386-9.8 9.778a9.6 9.6 0 0 0 1.5 5.1L2.6 21.4l5.5-1.446-.5.2zM18.1 14.8c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.4-.5-2.7-1.7-.9-.8-1.6-1.9-1.8-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.2.3-.4 0-.2 0-.4-.1-.5-.1-.2-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5-.2 0-.4 0-.6 0s-.6.1-.9.4c-.3.3-1.1 1.1-1.1 2.7 0 1.6 1.1 3.2 1.3 3.4.2.2 2.2 3.4 5.4 4.7 3.2 1.3 3.4.9 3.8.8.6-.1 1.9-.8 2.2-1.6.3-.8.3-1.4.2-1.6s-.3-.2-.6-.3z" />
            </svg>
            <span>Book Room</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Rooms({ rooms, loading, onSelectRoomPreload, onOpenDetailModal }: RoomsProps) {
  const activeRooms = rooms !== undefined ? rooms : ROOMS;

  return (
    <section id="rooms" className="py-20 md:py-28 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with Luxury Ornaments */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="flex items-center justify-center space-x-2 text-xs font-bold text-[#9C2A2A] uppercase tracking-[0.3em]">
            <span className="w-8 h-[1px] bg-[#9C2A2A]/40" />
            <span>Discover Elegance</span>
            <span className="w-8 h-[1px] bg-[#9C2A2A]/40" />
          </div>
          
          <h2 className="font-serif text-3xl md:text-5xl font-extrabold text-[#9C2A2A] leading-tight">
            Our Rooms & Suites
          </h2>
          
          <p className="text-gray-650 text-sm md:text-base font-normal max-w-2xl mx-auto">
            Choose from our premium accommodations, styled with traditional warmth and modern features. Enjoy stunning mountain vistas, plush Italian linens, and 24/7 dedicated service.
          </p>
        </ScrollReveal>

        {/* Rooms Grid with staggered container reveal */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9C2A2A]"></div>
          </div>
        ) : activeRooms.length === 0 ? (
          <div className="text-center py-16 bg-white/45 backdrop-blur-md rounded-[32px] border border-[#D4AF37]/20 max-w-xl mx-auto space-y-4 shadow-xl">
            <Shield className="w-12 h-12 mx-auto text-[#D4AF37]" />
            <h3 className="font-serif text-xl font-bold text-[#9C2A2A]">Rooms will be available soon</h3>
            <p className="text-stone-600 text-sm max-w-md mx-auto px-6">
              Please check back later. Our suite registries are being configured to receive bookings online.
            </p>
          </div>
        ) : (
          <ScrollRevealContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {activeRooms.map((room) => (
              <ScrollRevealItem key={room.id} className="flex flex-col h-full">
                <RoomCard
                  room={room}
                  onSelectRoomPreload={onSelectRoomPreload}
                  onOpenDetailModal={onOpenDetailModal}
                />
              </ScrollRevealItem>
            ))}
          </ScrollRevealContainer>
        )}

      </div>
    </section>
  );
}
