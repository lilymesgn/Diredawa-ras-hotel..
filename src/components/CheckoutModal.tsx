import React, { useState } from "react";
import { X, Lock, Users, CalendarCheck, Sparkles, Receipt, Contact, CheckCircle, AlertTriangle } from "lucide-react";
import { Room, Booking } from "../types";
import { supabase } from "../lib/supabaseClient";

interface CheckoutModalProps {
  room: Room | null;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  onClose: () => void;
  onConfirmBooking: (booking: Booking) => void;
}

export default function CheckoutModal({
  room,
  checkIn,
  checkOut,
  adults,
  children,
  onClose,
  onConfirmBooking,
}: CheckoutModalProps) {
  // Contact details states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [hasBreakfast, setHasBreakfast] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successBookingObj, setSuccessBookingObj] = useState<Booking | null>(null);

  if (!room) return null;

  // Calculate nights & prices
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diffTime = d2.getTime() - d1.getTime();
  const totalNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const roomPrice = room.discount && room.discount > 0 ? (room.price - room.discount) : room.price;
  const basePrice = roomPrice * totalNights;
  const taxesAndFees = Math.round(basePrice * 0.15); // 15% VAT
  const totalPrice = basePrice + taxesAndFees;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    let cabinIdNumber: number | null = null;
    const parsedRoomId = parseInt(room.id, 10);
    if (!isNaN(parsedRoomId)) {
      cabinIdNumber = parsedRoomId;
    } else {
      try {
        // Look up cabin from Supabase using name or ID
        const { data: cabinData } = await supabase
          .from("cabins")
          .select("id")
          .eq("name", room.title)
          .limit(1);

        if (cabinData && cabinData[0]) {
          cabinIdNumber = cabinData[0].id;
        } else {
          // Attempt to fetch first cabin as safe fallback
          const { data: fallbackData } = await supabase
            .from("cabins")
            .select("id")
            .limit(1);
          if (fallbackData && fallbackData[0]) {
            cabinIdNumber = fallbackData[0].id;
          }
        }
      } catch (err) {
        console.warn("Error looking up cabin ID:", err);
      }
    }

    if (!cabinIdNumber) {
      setSubmitError("Could not resolve database cabin mapping for this room type. Please ensure cabins exist in Supabase.");
      setIsSubmitting(false);
      return;
    }

    let dbBookingId: string | null = null;

    try {
      // Create a booking record inside `bookings` table as requested
      const { data: insertedRows, error: insertError } = await supabase
        .from("bookings")
        .insert([{
          cabin_id: cabinIdNumber,
          guest_name: name,
          guest_email: email.trim().toLowerCase(),
          start_date: checkIn,
          end_date: checkOut,
          status: "unconfirmed",
          total_price: totalPrice,
          has_breakfast: hasBreakfast,
          is_paid: false
        }])
        .select();

      if (insertError) {
        throw insertError;
      }

      if (insertedRows && insertedRows[0]) {
        dbBookingId = insertedRows[0].id.toString();
      } else {
        throw new Error("Creation completed but no ID returned. Please contact our front desk.");
      }
    } catch (err: any) {
      console.warn("Failed to create Supabase booking:", err);
      setSubmitError(err.message || "Database reservation insertion failed. Please check your connection and try again.");
      setIsSubmitting(false);
      return;
    }

    const code = `DRH-${dbBookingId}`;

    const bookingObj: Booking = {
      id: dbBookingId,
      roomId: room.id,
      roomTitle: room.title,
      roomPrice: room.price,
      checkIn,
      checkOut,
      adults,
      children,
      guestName: name,
      guestEmail: email.trim().toLowerCase(),
      guestPhone: phone,
      specialRequests: specialRequests || undefined,
      totalNights,
      totalPrice,
      confirmationCode: code,
      createdAt: new Date().toISOString(),
    };

    setSuccessBookingObj(bookingObj);
    setIsSubmitting(false);

    // Generate WhatsApp link
    const phoneNumber = "251915320033";
    const textMessage = `Hello Dire Dawa Ras Hotel! I would like to book a room.

*Booking Details:*
• *Room:* ${room.title}
• *Check-in:* ${formatDate(checkIn)}
• *Check-out:* ${formatDate(checkOut)}
• *Stay Duration:* ${totalNights} Night${totalNights > 1 ? "s" : ""}
• *Occupancy:* ${adults} Adult${adults > 1 ? "s" : ""}${children > 0 ? `, ${children} Child${children > 1 ? "ren" : ""}` : ""}
• *Grand Total Cost:* ETB ${totalPrice.toLocaleString()} (including VAT & Complimentary Breakfast)
• *Voucher Code:* ${code}

*Guest Information:*
• *Guest Name:* ${name}
• *Guest Email:* ${email}
• *Contact Phone:* ${phone}
${specialRequests ? `• *Special Requests:* ${specialRequests}` : ""}

Please confirm my booking availability. Thank you!`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textMessage)}`;
    
    // Attempt to auto-open
    try {
      window.open(whatsappUrl, "_blank");
    } catch (err) {
      console.warn("Popup blocked, user can click the button instead", err);
    }
  };

  if (successBookingObj) {
    const phoneNumber = "251915320033";
    const textMessage = `Hello Dire Dawa Ras Hotel! I would like to book a room.

*Booking Details:*
• *Room:* ${successBookingObj.roomTitle}
• *Check-in:* ${formatDate(successBookingObj.checkIn)}
• *Check-out:* ${formatDate(successBookingObj.checkOut)}
• *Stay Duration:* ${successBookingObj.totalNights} Night${successBookingObj.totalNights > 1 ? "s" : ""}
• *Occupancy:* ${successBookingObj.adults} Adult${successBookingObj.adults > 1 ? "s" : ""}${successBookingObj.children > 0 ? `, ${successBookingObj.children} Child${successBookingObj.children > 1 ? "ren" : ""}` : ""}
• *Grand Total Cost:* ETB ${successBookingObj.totalPrice.toLocaleString()} (including VAT & Complimentary Breakfast)
• *Voucher Code:* ${successBookingObj.confirmationCode}

*Guest Information:*
• *Guest Name:* ${successBookingObj.guestName}
• *Guest Email:* ${successBookingObj.guestEmail}
• *Contact Phone:* ${successBookingObj.guestPhone}
${successBookingObj.specialRequests ? `• *Special Requests:* ${successBookingObj.specialRequests}` : ""}

Please confirm my booking availability. Thank you!`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textMessage)}`;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-300 overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="relative bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-stone-100 p-8 text-center animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-black hover:bg-stone-100 rounded-full transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center space-y-6">
            <div className="bg-emerald-50 text-emerald-600 w-16 h-16 flex items-center justify-center rounded-2xl border border-emerald-100 shadow-sm animate-bounce shrink-0">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-black text-gray-950 leading-none">
                Voucher Compiled!
              </h3>
              <p className="text-stone-500 text-xs md:text-sm leading-relaxed max-w-md mx-auto">
                Your guest registration card is compiled. **To complete your booking, you must tap the button below and send it to our desk on WhatsApp.**
              </p>
            </div>

            {/* Micro-Ticket Receipt */}
            <div className="w-full bg-stone-50 border border-stone-200/60 rounded-2xl p-5 text-left text-xs space-y-3 font-sans relative">
              <div className="flex justify-between border-b border-dashed border-stone-200 pb-2.5">
                <span className="font-bold text-gray-800 font-serif text-xs">DIRE DAWA RAS HOTELS</span>
                <span className="font-mono text-[#9C2A2A] font-bold text-[10px] tracking-wider bg-[#D4AF37]/15 px-2 py-0.5 rounded border border-[#D4AF37]/25">
                  {successBookingObj.confirmationCode}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[11px] text-gray-600 font-sans">
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Guest Name</span>
                  <span className="font-bold text-gray-800">{successBookingObj.guestName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Accommodation</span>
                  <span className="font-bold text-gray-800">{successBookingObj.roomTitle}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Check-In</span>
                  <span className="font-bold text-gray-800">{formatDate(successBookingObj.checkIn)}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Check-Out</span>
                  <span className="font-bold text-gray-800">{formatDate(successBookingObj.checkOut)}</span>
                </div>
              </div>
            </div>

            <div className="w-full space-y-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-4 rounded-xl font-bold uppercase tracking-wider text-xs md:text-sm flex items-center justify-center space-x-2.5 shadow-md shadow-emerald-500/10 hover:shadow-lg transition cursor-pointer"
              >
                <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.1 1.449 4.6 1.451 5.4 0 9.8-4.386 9.8-9.778 0-2.617-1.015-5.074-2.861-6.918C16.335 2.062 13.9 1.045 11.9 1.045c-5.4 0-9.8 4.386-9.8 9.778a9.6 9.6 0 0 0 1.5 5.1L2.6 21.4l5.5-1.446-.5.2zM18.1 14.8c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.4-.5-2.7-1.7-.9-.8-1.6-1.9-1.8-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.2.3-.4 0-.2 0-.4-.1-.5-.1-.2-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5-.2 0-.4 0-.6 0s-.6.1-.9.4c-.3.3-1.1 1.1-1.1 2.7 0 1.6 1.1 3.2 1.3 3.4.2.2 2.2 3.4 5.4 4.7 3.2 1.3 3.2.9 3.8.8.6-.1 1.9-.8 2.2-1.6.3-.8.3-1.4.2-1.6s-.3-.2-.6-.3z" />
                </svg>
                <span>OPEN & SEND ON WHATSAPP</span>
              </a>

              <p className="text-[10px] text-stone-400 font-semibold tracking-wider uppercase font-sans animate-pulse">
                IMPORTANT: Make sure to hit "SEND" inside WhatsApp!
              </p>
            </div>

            <button
              onClick={() => {
                onConfirmBooking(successBookingObj);
              }}
              className="w-full border border-stone-200 hover:bg-stone-50 text-stone-600 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Done, save reference voucher
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-4xl rounded-3xl overflow-y-auto md:overflow-hidden shadow-2xl border border-stone-100 flex flex-col md:flex-row max-h-[92vh] md:h-auto text-left animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Left column: Summary Checkout Voucher */}
        <div className="bg-stone-50 md:w-5/12 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-150 shrink-0 md:overflow-y-auto">
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-stone-200">
              <div className="flex items-center space-x-2 text-[#9C2A2A]">
                <Receipt className="w-5 h-5 shrink-0" />
                <h3 className="font-serif text-lg font-bold">Booking Details</h3>
              </div>
              <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            </div>

            {/* Room mini image & specs */}
            <div className="space-y-3">
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-stone-100 select-none">
                <img src={room.imageUrl} alt={room.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-[#9C2A2A]">{room.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-sans mt-0.5">{room.description}</p>
              </div>
            </div>

            {/* Timings summary */}
            <div className="border-t border-stone-200 pt-4 space-y-3 text-xs text-gray-650 font-sans leading-relaxed">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Check-In</div>
                  <div className="font-bold text-gray-800">{formatDate(checkIn)}</div>
                  <div className="text-[10px] text-stone-400">12:00 PM (Midday)</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Check-Out</div>
                  <div className="font-bold text-gray-800">{formatDate(checkOut)}</div>
                  <div className="text-[10px] text-stone-400">11:00 AM (Morning)</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1.5 pt-2 text-[#9C2A2A] font-semibold">
                <Users className="w-4 h-4 shrink-0" />
                <span>
                  {adults} Adult{adults > 1 ? "s" : ""}
                  {children > 0 ? `, ${children} Child${children > 1 ? "ren" : ""}` : ""}
                </span>
                <span className="text-stone-300">•</span>
                <span>{totalNights} Night{totalNights > 1 ? "s" : ""} stay</span>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="border-t border-stone-200 pt-4 space-y-2.5 font-sans">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Room Charges ({totalNights} × ETB {roomPrice.toLocaleString()})</span>
                <span className="font-bold">ETB {basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Local Serves & VAT Taxes (15%)</span>
                <span>ETB {taxesAndFees.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-800 font-medium">
                <span>Complimentary Buffet Breakfast</span>
                <span className="uppercase tracking-wider text-[10px] font-bold">Free</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-800 font-medium pb-2 border-b border-stone-150">
                <span>Complimentary Traditional Coffee lounge</span>
                <span className="uppercase tracking-wider text-[10px] font-bold">Free</span>
              </div>
              <div className="flex justify-between items-center text-sm md:text-base text-[#1E1E1E] font-bold pt-2 font-sans">
                <span>Grand Reservation Total</span>
                <span className="text-[#9C2A2A] font-bold text-lg">ETB {totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Secure lock notice */}
          <div className="flex items-center space-x-2 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl mt-6">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Booking compilation will generate your official referral code.</span>
          </div>
        </div>

        {/* Right column: Guest details Form inputs */}
        <form onSubmit={handleSubmit} className="md:w-7/12 p-6 md:p-8 flex flex-col justify-between md:overflow-y-auto flex-1 text-left">
          <div className="space-y-6">
            
            {/* Header Form Title */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-[#1E1E1E]">
                <Contact className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <h3 className="font-serif text-lg font-bold">Guest Registration Card</h3>
              </div>
              
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-black hover:bg-[#fdf9f4] rounded-full transition cursor-pointer"
                aria-label="Cancel Registration"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              Kindly supply actual guest identifiers to compile your room booking. It will redirect to WhatsApp to send to the hotel reception.
            </p>

            {/* Database Submit Error Banner */}
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 text-red-800 animate-in shake duration-300">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-bold block mb-0.5 font-sans text-red-900 text-xs">Reservation Sync Blocked</span>
                  <span className="font-sans text-[11px] text-red-750">{submitError}</span>
                </div>
              </div>
            )}

            {/* Inputs list */}
            <div className="space-y-4 font-sans text-left">
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <span>Full Guest Name</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Almaz Bekele"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-1.5 focus:ring-[#9C2A2A]/50 focus:border-[#9C2A2A] outline-none text-xs md:text-sm"
                />
              </div>

              {/* Email address */}
              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <span>Guest Email Address</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="email"
                  placeholder="e.g. almaz.b@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-1.5 focus:ring-[#9C2A2A]/50 focus:border-[#9C2A2A] outline-none text-xs md:text-sm"
                />
              </div>

              {/* Telephone number */}
              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <span>Mobile Phone Number</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="tel"
                  placeholder="e.g. +251 911 234 567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-1.5 focus:ring-[#9C2A2A]/50 focus:border-[#9C2A2A] outline-none text-xs md:text-sm"
                />
              </div>

              {/* Traditional Buffet Breakfast Toggle */}
              <div className="flex items-center space-x-3 bg-emerald-50/40 border border-emerald-100 p-3.5 rounded-xl">
                <input
                  type="checkbox"
                  id="has_breakfast_checkbox"
                  checked={hasBreakfast}
                  onChange={(e) => setHasBreakfast(e.target.checked)}
                  className="h-4 w-4 text-[#9C2A2A] border-gray-300 rounded focus:ring-[#9C2A2A] cursor-pointer"
                />
                <label htmlFor="has_breakfast_checkbox" className="text-xs font-bold text-[#1E1E1E] cursor-pointer flex flex-col">
                  <span>Include Complimentary Buffet Breakfast</span>
                  <span className="text-[10px] text-emerald-800 font-medium">Fresh traditional coffee & buffet breakfast daily (Included Free)</span>
                </label>
              </div>

              {/* Special Requirements */}
              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                  Special Accommodation Requests (Optional)
                </label>
                <textarea
                  placeholder="e.g. Ground floor request, extra towels, baby crib..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-1.5 focus:ring-[#9C2A2A]/50 focus:border-[#9C2A2A] outline-none text-xs md:text-sm resize-none"
                />
              </div>
            </div>

          </div>

          {/* Checkout controls footer */}
          <div className="pt-6 border-t border-stone-100 flex items-center justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-6 rounded-xl border border-gray-200 hover:border-gray-400 text-gray-600 font-bold text-xs uppercase tracking-wider transition font-sans"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#D4AF37] hover:bg-[#9C2A2A] hover:text-white disabled:bg-stone-300 text-[#1E1E1E] font-bold text-xs uppercase tracking-widest py-3 px-8 rounded-xl shadow-md transition-all duration-200 flex items-center space-x-2 cursor-pointer font-sans"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>{isSubmitting ? "Compiling..." : "COMPILE & BOOK VIA WHATSAPP"}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
