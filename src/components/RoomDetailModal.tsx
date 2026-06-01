import React, { useState, useEffect } from "react";
import { X, CheckCircle, BedDouble, Square, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Room } from "../types";
import AestheticImage from "./AestheticImage";

interface RoomDetailModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onBookDirect: (room: Room) => void;
}

export default function RoomDetailModal({
  room,
  isOpen,
  onClose,
  onBookDirect,
}: RoomDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset index to 0 whenever a new room is loaded
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [room, isOpen]);

  if (!isOpen || !room) return null;

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-300 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-stone-100 flex flex-col max-h-[90vh] text-left animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Feature Illustration Card with Dynamic Image controls */}
        <div className="relative h-48 sm:h-60 w-full shrink-0 select-none bg-stone-100 flex items-center justify-center">
          <AestheticImage
            src={images[currentImageIndex]}
            alt={`${room.title} view ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Slideshow Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-[#9C2A2A] border border-white/10 text-white p-1.5 rounded-full transition-all cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-[#9C2A2A] border border-white/10 text-white p-1.5 rounded-full transition-all cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Dot navigation indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-6 right-6 hidden sm:flex space-x-1.5 bg-black/30 px-2.5 py-1.5 rounded-full border border-white/10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    currentImageIndex === idx ? "bg-[#ebdacf] scale-125" : "bg-white/40"
                  }`}
                  aria-label={`Show photo ${idx + 1}`}
                />
              ))}
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full border border-white/10 transition cursor-pointer z-10"
            aria-label="Dismiss Modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-white z-10">
            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
              {room.title}
            </h3>
            <p className="text-[#ebdacf] text-[9px] uppercase font-bold tracking-[0.2em] mt-1 sm:mt-1.5 flex items-center space-x-1">
              <span>Premium Accommodation Suite ({currentImageIndex + 1}/{images.length})</span>
            </p>
          </div>
        </div>

        {/* Detailed text contents scrollable panel */}
        <div className="p-5 sm:p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-sm text-gray-600">
          
          {/* Spatial Sizing Overview grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4 border-y border-stone-100 font-sans text-[#2c2a29]">
            <div className="flex flex-col items-center justify-center text-center p-3 rounded-xl bg-stone-50 border border-stone-100">
              <Square className="w-5 h-5 text-[#DE9E36] mb-1.5" />
              <div className="text-[10px] uppercase text-gray-400 font-bold tracking-wider leading-none mb-1">Room Area</div>
              <div className="text-xs md:text-sm font-bold mt-1">{room.size}</div>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-3 rounded-xl bg-stone-50 border border-stone-100">
              <Users className="w-5 h-5 text-[#DE9E36] mb-1.5" />
              <div className="text-[10px] uppercase text-gray-400 font-bold tracking-wider leading-none mb-1">Max Guests</div>
              <div className="text-xs md:text-sm font-bold mt-1">{room.maxGuests} Person(s)</div>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-3 rounded-xl bg-stone-50 border border-stone-100">
              <BedDouble className="w-5 h-5 text-[#DE9E36] mb-1.5" />
              <div className="text-[10px] uppercase text-gray-400 font-bold tracking-wider leading-none mb-1">Bed Configuration</div>
              <div className="text-xs md:text-sm font-bold leading-tight mt-1">{room.bedType}</div>
            </div>
          </div>

          {/* Core Overview Description Paragraph */}
          <div className="space-y-2 text-left">
            <h4 className="font-serif text-base font-bold text-[#160e10]">
              Suite Overview
            </h4>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
              {room.overview}
            </p>
          </div>

          {/* Custom Amenities list */}
          <div className="space-y-3 text-left">
            <h4 className="font-serif text-base font-bold text-[#160e10]">
              Included Amenities & Conveniences
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {room.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2.5 text-xs text-stone-600 font-medium">
                  <CheckCircle className="w-4 h-4 text-[#DE9E36] shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Action Panel checkout triggers */}
        <div className="p-6 border-t border-stone-100 bg-stone-50/50 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 font-sans">
          
          <div className="text-center sm:text-left select-none">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Standard Rate</div>
            <div className="text-xl font-bold text-[#9C2A2A]">
              ETB {room.price.toLocaleString()} <span className="text-xs text-stone-500 font-medium">/ Night</span>
            </div>
          </div>

          <div className="flex space-x-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none border border-stone-200 hover:border-stone-400 text-stone-600 font-bold tracking-wider uppercase text-xs px-6 py-3 rounded-xl transition"
            >
              Close
            </button>
            
            <button
              onClick={() => onBookDirect(room)}
              className="flex-1 sm:flex-none bg-[#D4AF37] hover:bg-[#9C2A2A] text-[#1E1E1E] hover:text-white border-2 border-[#D4AF37] hover:border-[#9C2A2A] font-bold tracking-wider uppercase text-xs px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <span>Reserve Suite</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
