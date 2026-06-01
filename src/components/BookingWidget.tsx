import { useState, useEffect, useRef } from "react";
import { Calendar, Users, Plus, Minus, Check, AlertCircle, Sparkles } from "lucide-react";
import { Room } from "../types";
import { ROOMS } from "../data";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

interface BookingWidgetProps {
  rooms?: Room[];
  onInitiateBooking: (room: Room, checkIn: string, checkOut: string, adults: number, children: number) => void;
  selectedRoomPreload: Room | null;
  resetPreload: () => void;
}

export default function BookingWidget({
  rooms,
  onInitiateBooking,
  selectedRoomPreload,
  resetPreload,
}: BookingWidgetProps) {
  // Setup default dates: check-in today, check-out tomorrow
  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const getTomorrowString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [checkIn, setCheckIn] = useState(getTodayString());
  const [checkOut, setCheckOut] = useState(getTomorrowString());
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [nights, setNights] = useState(1);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close guest dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowGuestDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Recalculate nights whenever dates change
  useEffect(() => {
    if (checkIn && checkOut) {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      const diffTime = d2.getTime() - d1.getTime();
      const diffNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffNights > 0) {
        setNights(diffNights);
        setIsError(false);
        setFeedbackMessage(null);
      } else {
        setNights(0);
        setIsError(true);
        setFeedbackMessage("Check-out date must be after check-in date.");
      }
    }
  }, [checkIn, checkOut]);

  // Handle room preload (e.g., when the user clicks 'Book Now' on a room card)
  useEffect(() => {
    if (selectedRoomPreload) {
      setAvailabilityChecked(true);
      setIsError(false);
      setAvailableRooms([selectedRoomPreload]);
      setFeedbackMessage(
        `Selected Suite: <strong>${selectedRoomPreload.title}</strong>. Confirm dates & guest count below, then click "Book Suite" to proceed!`
      );
      resetPreload();
    }
  }, [selectedRoomPreload, resetPreload]);

  const handleCheckAvailability = async () => {
    if (!checkIn || !checkOut) {
      setIsError(true);
      setFeedbackMessage("Please select both check-in and check-out dates.");
      setAvailabilityChecked(false);
      return;
    }

    if (nights <= 0) {
      setIsError(true);
      setFeedbackMessage("Check-out date must be strictly after check-in date.");
      setAvailabilityChecked(false);
      return;
    }

    setIsChecking(true);
    setIsError(false);
    setFeedbackMessage(null);

    try {
      let filtered: Room[] = [];
      if (isSupabaseConfigured) {
        // Fetch bookings with active status 'confirmed' or 'checked-in'
        const { data: bookedItems, error } = await supabase
          .from("bookings")
          .select("cabin_id, room_id, start_date, end_date, check_in, check_out, status")
          .in("status", ["confirmed", "checked-in"]);

        if (error) {
          console.warn("Supabase bookings lookup error:", error);
        }

        // Check date interval overlap (booking_start < selected_end AND booking_end > selected_start)
        const blockedCabinIds = new Set<string>();
        const sStart = new Date(checkIn);
        const sEnd = new Date(checkOut);

        if (bookedItems) {
          bookedItems.forEach((b) => {
            const bStartStr = b.start_date || b.check_in;
            const bEndStr = b.end_date || b.check_out;

            if (bStartStr && bEndStr) {
              const bStart = new Date(bStartStr);
              const bEnd = new Date(bEndStr);

              if (bStart < sEnd && bEnd > sStart) {
                if (b.cabin_id) blockedCabinIds.add(b.cabin_id.toString());
                if (b.room_id) blockedCabinIds.add(b.room_id.toString());
              }
            }
          });
        }

        // Filter all dynamic hotel suites
        const activeRoomsList = rooms && rooms.length > 0 ? rooms : [];
        filtered = activeRoomsList.filter((room) => {
          return !blockedCabinIds.has(room.id.toString());
        });
      } else {
        // Local mode check: compare overlap with mock bookings list from local storage
        const savedBookingsStr = localStorage.getItem("diredawaras_bookings");
        const savedBookings = savedBookingsStr ? JSON.parse(savedBookingsStr) : [];
        
        const blockedRoomIds = new Set<string>();
        const sStart = new Date(checkIn);
        const sEnd = new Date(checkOut);

        savedBookings.forEach((b: any) => {
          if (b.checkIn && b.checkOut) {
            const bStart = new Date(b.checkIn);
            const bEnd = new Date(b.checkOut);

            if (bStart < sEnd && bEnd > sStart) {
              blockedRoomIds.add(b.roomId);
            }
          }
        });

        const activeRoomsList = rooms && rooms.length > 0 ? rooms : [];
        filtered = activeRoomsList.filter((room) => {
          return !blockedRoomIds.has(room.id.toString());
        });
      }

      setAvailableRooms(filtered);
      setAvailabilityChecked(true);

      if (filtered.length === 0) {
        setFeedbackMessage(
          "We are fully booked or have no accommodations available for the selected dates. Please try another range."
        );
      } else {
        setFeedbackMessage(
          `Great news! We found <strong>${filtered.length}</strong> available suite${filtered.length > 1 ? "s" : ""} matching your selection.`
        );
      }
    } catch (err) {
      console.warn("Error checking date availability:", err);
      setIsError(true);
      setFeedbackMessage("We encountered an error verifying room availability. Please check back soon.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="w-full relative z-30 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#1C0D0D]/95 backdrop-blur-xl rounded-[40px] shadow-2xl border border-[#DE9E36]/25 p-6 md:p-8 text-white relative">
        <div className="absolute top-0 right-0 w-[40%] h-[30%] bg-[#DE9E36]/5 rounded-full blur-[80px] pointer-events-none" />
        
        {/* Booking Form Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end relative z-10">
          
          {/* Check-In Date Field */}
          <div className="md:col-span-3 text-left">
            <label htmlFor="checkinDate" className="block text-xs font-bold text-[#ebdacf] uppercase tracking-widest mb-2 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#DE9E36]" />
              <span>Check-In Date</span>
            </label>
            <input
              type="date"
              id="checkinDate"
              min={getTodayString()}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full px-4 py-3 border border-[#DE9E36]/20 rounded-2xl font-medium focus:ring-2 focus:ring-[#DE9E36]/45 focus:border-[#DE9E36] outline-none text-white transition-all bg-[#2A1414]/90 backdrop-blur-md shadow-sm"
            />
          </div>

          {/* Check-Out Date Field */}
          <div className="md:col-span-3 text-left">
            <label htmlFor="checkoutDate" className="block text-xs font-bold text-[#ebdacf] uppercase tracking-widest mb-2 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#DE9E36]" />
              <span>Check-Out Date</span>
            </label>
            <input
              type="date"
              id="checkoutDate"
              min={checkIn || getTodayString()}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full px-4 py-3 border border-[#DE9E36]/20 rounded-2xl font-medium focus:ring-2 focus:ring-[#DE9E36]/45 focus:border-[#DE9E36] outline-none text-white transition-all bg-[#2A1414]/90 backdrop-blur-md shadow-sm"
            />
          </div>

          {/* Guests Popover Selector */}
          <div className={`md:col-span-3 text-left relative ${showGuestDropdown ? "z-30" : "z-10"}`} ref={dropdownRef}>
            <label className="block text-xs font-bold text-[#ebdacf] uppercase tracking-widest mb-2 flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-[#DE9E36]" />
              <span>Guests Count</span>
            </label>

            <button
              onClick={() => setShowGuestDropdown(!showGuestDropdown)}
              className="w-full text-left px-4 py-3 border border-[#DE9E36]/20 rounded-2xl font-semibold outline-none text-white transition-all bg-[#2A1414]/90 backdrop-blur-md shadow-sm flex items-center justify-between hover:bg-[#2A1414]/80 focus:ring-2 focus:ring-[#DE9E36]/45 cursor-pointer"
            >
              <span>
                {adults} Adult{adults > 1 ? "s" : ""}, {children} Child
                {children !== 1 ? "ren" : ""}
              </span>
              <Users className="w-4 h-4 text-[#DE9E36]" />
            </button>

            {/* Luxurious Dropdown Menu */}
            {showGuestDropdown && (
              <div 
                id="guests-dropdown-menu"
                className="md:absolute md:top-full left-0 mt-2 w-full md:min-w-[280px] bg-[#2A1414] border border-[#DE9E36]/25 shadow-2xl rounded-2xl p-4 md:p-5 z-50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 relative"
              >
                {/* Adults row */}
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <div className="pr-2">
                    <h4 className="text-sm font-bold text-[#ebdacf]">Adults</h4>
                    <p className="text-[10px] text-gray-400 whitespace-nowrap">Ages 13 or above</p>
                  </div>
                  <div className="flex items-center space-x-2.5 sm:space-x-4 shrink-0">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      disabled={adults <= 1}
                      className="w-10 h-10 md:w-11 md:h-11 bg-[#DE9E36]/10 hover:bg-[#DE9E36]/25 disabled:opacity-40 rounded-full flex items-center justify-center font-bold text-white transition cursor-pointer select-none active:scale-95 shrink-0"
                    >
                      <Minus className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#DE9E36]" />
                    </button>
                    <span className="font-bold text-sm md:text-base text-white w-5 md:w-6 text-center select-none">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(Math.min(10, adults + 1))}
                      className="w-10 h-10 md:w-11 md:h-11 bg-[#DE9E36]/10 hover:bg-[#DE9E36]/25 rounded-full flex items-center justify-center font-bold text-white transition cursor-pointer select-none active:scale-95 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#DE9E36]" />
                    </button>
                  </div>
                </div>

                {/* Children row */}
                <div className="flex justify-between items-center pt-1">
                  <div className="pr-2">
                    <h4 className="text-sm font-bold text-[#ebdacf]">Children</h4>
                    <p className="text-[10px] text-gray-400 whitespace-nowrap">Ages 0 to 12</p>
                  </div>
                  <div className="flex items-center space-x-2.5 sm:space-x-4 shrink-0">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      disabled={children <= 0}
                      className="w-10 h-10 md:w-11 md:h-11 bg-[#DE9E36]/10 hover:bg-[#DE9E36]/25 disabled:opacity-40 rounded-full flex items-center justify-center font-bold text-white transition cursor-pointer select-none active:scale-95 shrink-0"
                    >
                      <Minus className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#DE9E36]" />
                    </button>
                    <span className="font-bold text-sm md:text-base text-white w-5 md:w-6 text-center select-none">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(Math.min(8, children + 1))}
                      className="w-10 h-10 md:w-11 md:h-11 bg-[#DE9E36]/10 hover:bg-[#DE9E36]/25 rounded-full flex items-center justify-center font-bold text-white transition cursor-pointer select-none active:scale-95 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#DE9E36]" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Checkout/Check Availability Submit Button */}
          <div className="md:col-span-3">
            <button
              onClick={handleCheckAvailability}
              disabled={isChecking}
              className="w-full bg-[#DE9E36] hover:bg-[#c58223] disabled:bg-stone-600 disabled:text-stone-300 shadow-lg text-[#1E1E1E] py-3 px-6 rounded-2xl font-bold text-xs tracking-widest uppercase transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 min-h-[48px] cursor-pointer flex items-center justify-center space-x-1.5"
            >
              {isChecking ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1E1E1E]"></div>
                  <span>Checking...</span>
                </>
              ) : (
                <span>Check Availability</span>
              )}
            </button>
          </div>
        </div>

        {/* Feedback Messages */}
        {feedbackMessage && (
          <div
            className={`mt-6 p-4 rounded-xl flex items-start space-x-3 text-left relative z-10 ${
              isError
                ? "bg-red-950/50 text-red-100 border border-red-800/55"
                : "bg-[#2A1414] text-stone-200 border border-[#DE9E36]/30"
            }`}
          >
            {isError ? (
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="w-5 h-5 text-[#DE9E36] shrink-0 mt-0.5 animate-pulse" />
            )}
            <div className="text-xs md:text-sm font-medium leading-relaxed font-sans" dangerouslySetInnerHTML={{ __html: feedbackMessage }} />
          </div>
        )}

        {/* Available Rooms Grid Panel (Revealed upon clicking Check Availability) */}
        {availabilityChecked && !isError && (
          <div className="mt-8 pt-6 border-t border-[#DE9E36]/25 text-left animate-in fade-in duration-300 relative z-10">
            <h3 className="font-serif text-xl font-bold text-[#DE9E36] mb-4 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
              <span>Available Accommodations for {nights} Night{nights > 1 ? "s" : ""}</span>
            </h3>
            
            <p className="text-xs text-stone-300 mb-6 font-sans">
              Prices calculate base reservation total: Nightly rates × {nights} Nights. Rates exclude local taxes (15% VAT). Complimentary breakfast included.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availableRooms.map((room) => {
                const discountedPrice = room.discount && room.discount > 0 ? (room.price - room.discount) : room.price;
                const totalStayPrice = discountedPrice * nights;
                return (
                  <div key={room.id} className="border border-[#DE9E36]/25 bg-[#2A1414]/95 backdrop-blur-md rounded-[32px] p-6 flex flex-col justify-between hover:border-[#DE9E36]/50 hover:shadow-2xl transition-all duration-300">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-serif text-base font-bold text-[#ebdacf]">{room.title}</h4>
                        <span className="text-[10px] bg-[#DE9E36]/15 text-[#DE9E36] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Comp. Breakfast</span>
                      </div>
                      <p className="text-xs text-stone-350 mb-4 font-sans leading-relaxed line-clamp-2">{room.description}</p>
                      
                      <div className="font-mono text-left mb-6">
                        <div className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold font-sans mb-1">Total Stay Cost</div>
                        <div className="text-lg font-bold text-[#DE9E36]">
                          ETB {totalStayPrice.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-stone-400 font-sans font-medium">
                          {room.discount && room.discount > 0 ? (
                            <>
                              <span className="line-through mr-1.5 text-stone-500">ETB {room.price.toLocaleString()}</span>
                              <span className="text-emerald-400">ETB {discountedPrice.toLocaleString()} / Night</span>
                            </>
                          ) : (
                            <span>ETB {room.price.toLocaleString()} / Night</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onInitiateBooking(room, checkIn, checkOut, adults, children)}
                      className="w-full bg-[#DE9E36] hover:bg-[#c58223] text-[#1E1E1E] py-2.5 px-4 rounded-xl text-xs font-bold tracking-wider uppercase transition flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 text-[#1E1E1E]" />
                      <span>Book Suite</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
