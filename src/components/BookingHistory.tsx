import React, { useState, useEffect } from "react";
import { Trash2, Calendar, ClipboardCheck, Tag, TicketCheck, ShieldAlert, Search } from "lucide-react";
import { Booking } from "../types";
import { ScrollReveal, ScrollRevealContainer, ScrollRevealItem } from "./ScrollReveal";

interface BookingHistoryProps {
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
  onScrollToBooking: () => void;
  guestEmail: string;
  setGuestEmail: (email: string) => void;
  isFetching: boolean;
  fetchError: string | null;
  onRefresh: () => void;
}

export default function BookingHistory({
  bookings,
  onCancelBooking,
  onScrollToBooking,
  guestEmail,
  setGuestEmail,
  isFetching,
  fetchError,
  onRefresh
}: BookingHistoryProps) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [typedEmail, setTypedEmail] = useState(guestEmail);

  // Sync state if parent guestEmail changes (e.g., after booking completion)
  useEffect(() => {
    setTypedEmail(guestEmail);
  }, [guestEmail]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGuestEmail(typedEmail.trim());
  };
  
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="bookings-history" className="py-16 md:py-24 bg-transparent text-left border-t border-white/20 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title with scroll lift */}
        <ScrollReveal className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.25em] block mb-1 font-sans">
              Your Member Portal
            </span>
            <h2 className="font-serif text-2xl md:text-4xl font-extrabold text-[#9C2A2A] leading-none">
              My Reservations
            </h2>
          </div>
          
          <p className="text-gray-500 text-xs md:text-sm max-w-md md:text-right">
            Manage your accommodation records directly from our servers in real-time. Enter your registered guest email to search and verify your live vouchers.
          </p>
        </ScrollReveal>

        {/* Real-time Reservation Search Bar */}
        <ScrollReveal className="mb-12 max-w-xl">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="email"
                placeholder="Enter registered email address (e.g. guest@example.com)"
                value={typedEmail || ""}
                onChange={(e) => setTypedEmail(e.target.value)}
                className="w-full bg-white/50 backdrop-blur-sm border border-stone-200 focus:bg-white focus:border-[#9C2A2A] rounded-full px-5 py-3 text-xs md:text-sm outline-none transition text-stone-800"
                required
              />
              {guestEmail && (
                <button
                  type="button"
                  onClick={() => {
                    setTypedEmail("");
                    setGuestEmail("");
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-stone-700 text-xs font-bold uppercase transition"
                >
                  Clear
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isFetching}
              className="bg-[#9C2A2A] hover:bg-[#802222] disabled:bg-stone-300 text-white font-bold uppercase tracking-widest text-[10px] sm:text-xs px-6 py-3.5 rounded-full transition shadow-md shrink-0 cursor-pointer flex items-center justify-center space-x-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isFetching ? "Searching..." : "Search"}</span>
            </button>
          </form>
          {fetchError && (
            <p className="text-red-600 text-[11px] font-medium mt-2">{fetchError}</p>
          )}
        </ScrollReveal>
        
        {!guestEmail ? (
          /* Prompts to input email */
          <ScrollReveal scaleStart={0.97}>
            <div className="bg-white/25 backdrop-blur-md rounded-[32px] border border-dashed border-white/55 p-12 text-center max-w-2xl mx-auto space-y-6 shadow-sm">
              <div className="bg-white/40 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center text-stone-400 mx-auto border border-white/50">
                <Search className="w-8 h-8 text-stone-500" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-serif text-lg md:text-xl font-bold text-stone-750">Lookup Reservations</h3>
                <p className="text-stone-500 text-xs max-w-md mx-auto leading-relaxed">
                  Enter your guest email address above to view, filter, and manage your live booking vouchers synced directly from our database.
                </p>
              </div>

              <button
                onClick={onScrollToBooking}
                className="mt-2 bg-[#D4AF37] hover:bg-[#9C2A2A] text-[#1E1E1E] hover:text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition cursor-pointer inline-flex items-center space-x-1.5 animate-pulse"
              >
                <Calendar className="w-4 h-4 text-[#1E1E1E]" />
                <span>Book Your Suite Now</span>
              </button>
            </div>
          </ScrollReveal>
        ) : bookings.length === 0 ? (
          /* Elegant Placeholder Empty state */
          <ScrollReveal scaleStart={0.97}>
            <div className="bg-white/25 backdrop-blur-md rounded-[32px] border border-dashed border-white/55 p-12 text-center max-w-2xl mx-auto space-y-6 shadow-sm">
              <div className="bg-white/40 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center text-stone-400 mx-auto border border-white/50">
                <ClipboardCheck className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-serif text-lg md:text-xl font-bold text-stone-700">No Reservations Found</h3>
                <p className="text-stone-450 text-xs max-w-md mx-auto leading-relaxed">
                  We couldn't find any confirmed accommodation bookings under the email <strong className="text-stone-700 font-bold">{guestEmail}</strong> in our systems.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={onRefresh}
                  disabled={isFetching}
                  className="bg-white/60 hover:bg-white text-stone-700 border border-stone-200 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition cursor-pointer"
                >
                  {isFetching ? "Syncing..." : "Sync / Refresh"}
                </button>
                <button
                  onClick={onScrollToBooking}
                  className="bg-[#D4AF37] hover:bg-[#9C2A2A] text-[#1E1E1E] hover:text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition cursor-pointer inline-flex items-center justify-center space-x-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Your Suite Now</span>
                </button>
              </div>
            </div>
          </ScrollReveal>
        ) : (
          /* Interactive Confirmation Voucher List */
          <ScrollRevealContainer className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-stone-500 font-medium">
                Found {bookings.length} reservation{bookings.length > 1 ? "s" : ""} under <strong className="text-stone-700">{guestEmail}</strong>
              </span>
              <button
                onClick={onRefresh}
                disabled={isFetching}
                className="text-[11px] font-bold uppercase tracking-widest text-[#9C2A2A] hover:underline"
              >
                {isFetching ? "Syncing Server..." : "Refresh List"}
              </button>
            </div>
            {bookings.map((booking) => (
              <ScrollRevealItem
                key={booking.id}
                className="bg-white/35 backdrop-blur-md rounded-[32px] overflow-hidden border border-white/60 shadow-lg hover:shadow-xl transition flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/25 text-[#2c2a29]"
              >
                {/* Left Block - Voucher header badge */}
                <div className="p-6 md:p-8 md:w-1/4 bg-white/20 flex flex-col justify-between items-start text-left select-none relative">
                  <div>
                    <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-widest inline-block mb-3.5">
                      Stay Confirmed
                    </span>
                    <h4 className="font-serif text-xl font-bold text-[#9C2A2A] mb-1 leading-none">
                      {booking.roomTitle}
                    </h4>
                    <p className="text-stone-400 text-[11px] font-sans font-medium">
                      Reserved on {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="mt-6 md:mt-0 pt-4 md:pt-0">
                    <div className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold font-sans mb-1.5 flex items-center space-x-1">
                      <TicketCheck className="w-3.5 h-3.5 text-stone-400 animate-bounce" />
                      <span>Confirmation Code</span>
                    </div>
                    <div className="font-mono text-base font-bold text-[#9C2A2A] tracking-wider select-all bg-[#D4AF37]/15 px-3 py-1.5 rounded-lg border border-[#D4AF37]/25 inline-block font-sans">
                      {booking.confirmationCode}
                    </div>
                  </div>
                </div>

                {/* Center Block - Stay timings */}
                <div className="p-6 md:p-8 md:w-1/2 grid grid-cols-2 md:grid-cols-3 gap-6 text-left items-center font-sans">
                  
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Check-In Date</div>
                    <div className="text-xs md:text-sm font-bold text-stone-800">{formatDate(booking.checkIn)}</div>
                    <div className="text-[10px] text-stone-450 font-medium">12:00 PM (Midday)</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Check-Out Date</div>
                    <div className="text-xs md:text-sm font-bold text-stone-800">{formatDate(booking.checkOut)}</div>
                    <div className="text-[10px] text-stone-450 font-medium">11:00 AM (Morning)</div>
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Reservations occupancy</div>
                    <div className="text-xs font-bold flex items-center space-x-1 text-stone-700">
                      <span>{booking.adults} Adult{booking.adults > 1 ? "s" : ""}</span>
                      {booking.children > 0 && (
                        <>
                          <span className="text-stone-300">•</span>
                          <span>{booking.children} Child{booking.children > 1 ? "ren" : ""}</span>
                        </>
                      )}
                    </div>
                    <div className="text-[10px] text-[#9C2A2A] font-semibold">{booking.totalNights} Nightly duration</div>
                  </div>

                </div>

                {/* Right Block - Stay Total + Cancellation Trigger */}
                <div className="p-6 md:p-8 md:w-1/4 bg-white/10 flex flex-col justify-between items-stretch text-left font-sans">
                  
                  <div className="mb-4 md:mb-0">
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1 flex items-center space-x-1">
                      <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Total Stay Price</span>
                    </div>
                    <div className="text-xl font-bold text-[#1E1E1E] leading-none mb-1">
                      ETB {booking.totalPrice.toLocaleString()}
                    </div>
                    <p className="text-[10px] text-stone-400">
                      Incl. taxes & complimentary breakfast
                    </p>
                  </div>

                  {cancellingId === booking.id ? (
                     <div className="flex flex-col space-y-2 select-none border border-red-200 bg-red-50/50 p-2.5 rounded-xl text-center">
                      <span className="text-[10px] text-red-700 font-bold uppercase tracking-wider">Confirm Cancellation?</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            onCancelBooking(booking.id);
                            setCancellingId(null);
                          }}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
                        >
                          Yes, Cancel
                        </button>
                        <button
                          onClick={() => setCancellingId(null)}
                          className="flex-1 border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setCancellingId(booking.id)}
                      className="border border-red-200 text-red-700 hover:bg-red-50 hover:border-red-400 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Cancel Booking</span>
                    </button>
                  )}

                </div>
              </ScrollRevealItem>
            ))}

            {/* General Advice Badge warning */}
            <ScrollReveal className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start space-x-3 max-w-3xl mx-auto">
              <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-[#5e5044] leading-relaxed">
                Please note: cancellations require <strong>at least 48 hours notice</strong> prior to your scheduled check-in arrival time. For urgent changes or specific requests (e.g. airport taxi shuttles, extra pillows), call direct line at <a href="tel:+251251111223" className="font-bold underline">+251 251 111 223</a>.
              </p>
            </ScrollReveal>
          </ScrollRevealContainer>
        )}

      </div>
    </section>
  );
}
