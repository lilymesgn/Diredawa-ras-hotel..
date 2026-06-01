import { useState, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { Sparkles, X, Check, ArrowRight, ShieldAlert, ExternalLink, Lock } from "lucide-react";
import { supabase, isSupabaseConfigured } from "./lib/supabaseClient";
import Navbar from "./Navbar";
import Hero from "./components/Hero";
import BookingWidget from "./components/BookingWidget";
import Rooms from "./components/Rooms";
import Gallery from "./components/Gallery";
import Offers from "./components/Offers";
import BookingHistory from "./components/BookingHistory";
import RoomDetailModal from "./components/RoomDetailModal";
import CheckoutModal from "./components/CheckoutModal";
import VideoModal from "./components/VideoModal";

// Modular Page components & Helpers
import AboutUsPage from "./components/AboutUsPage";
import Dining from "./components/Dining";
import ContactPage from "./components/ContactPage";
import Footer from "./components/Footer";
import SkeletonLoader from "./components/SkeletonLoader";
import { Room, Booking } from "./types";

const DEFAULT_SETTINGS = {
  site_name: "Dire Dawa Ras Hotel",
  support_email: "ddrashotel1@gmail.com",
  banner_text: "Welcome to Dire Dawa Ras Hotel! Enjoy coordinate suites & traditional hospitality since 1964 EC in Kezira, Ethiopia. \"Stay a cool place in warmer city\".",
  maintenance_mode: false,
  hero_image_url: "",
  hero_mobile_image_url: ""
};

const DEFAULT_PROMOTIONS = [
  {
    id: "p1",
    title: "Early Bird Discount",
    description: "Plan ahead to guarantee your reservation. Book your accommodations directly with us and enjoy an instant 15% off room rates.",
    discount_percent: 15,
    code: "EARLYBIRD15",
    is_active: true
  }
];

export default function App() {
  const location = useLocation();

  // Render segregated page when on /404 route
  const is404Route = location.pathname === "/404";

  // Dynamic settings and layout values
  const [settings, setSettings] = useState<any>(DEFAULT_SETTINGS);
  const [isMaintenance, setIsMaintenance] = useState(false);

  // Dynamic collections
  const [promotions, setPromotions] = useState<any[]>(DEFAULT_PROMOTIONS);
  const [contentBlocks, setContentBlocks] = useState<Record<string, any>>({});
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isRoomsLoading, setIsRoomsLoading] = useState(true);
  const [gallery, setGallery] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!isSupabaseConfigured) {
        setSettings(DEFAULT_SETTINGS);
        
        // Static data import / settings
        const { ROOMS: staticRooms, GALLERY: staticGallery } = await import("./data");
        setRooms(staticRooms);
        const mappedGallery = staticGallery.map((img) => ({
          id: img.id?.toString() || Math.random().toString(),
          url: img.url,
          caption: img.caption || "",
          category: (img.category || "exterior").toLowerCase()
        }));
        setGallery(mappedGallery);
        setPromotions(DEFAULT_PROMOTIONS);
        setIsRoomsLoading(false);
        return;
      }

      try {
        // 1. Fetch settings (explicitly row with id = 1)
        let { data: settingsData, error: settingsError } = await supabase
          .from("settings")
          .select("*")
          .eq("id", 1)
          .limit(1);

        if (settingsError || !settingsData || settingsData.length === 0) {
          console.warn("Could not fetch settings with id=1, trying general fetch...");
          const generalFetch = await supabase
            .from("settings")
            .select("*")
            .limit(1);
          settingsData = generalFetch.data;
          settingsError = generalFetch.error;
        }

        if (settingsData && settingsData[0]) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...settingsData[0]
          });
          if (settingsData[0].site_name) {
            document.title = settingsData[0].site_name;
          }
          if (settingsData[0].maintenance_mode) {
            setIsMaintenance(true);
          }
        }
      } catch (err) {
        console.warn("Error fetching admin settings from Supabase:", err);
      }

      try {
        // 2. Fetch content_blocks
        const { data: blocksData } = await supabase
          .from("content_blocks")
          .select("*");
        if (blocksData && blocksData.length > 0) {
          const mapped: Record<string, any> = {};
          blocksData.forEach((b) => {
            mapped[b.key] = b.value;
          });
          setContentBlocks(mapped);
        }
      } catch (err) {
        console.warn("Error fetching content blocks:", err);
      }

      try {
        // 3. Fetch cabins
        setIsRoomsLoading(true);
        const { data: cabinsData, error: cabinsError } = await supabase
          .from("cabins")
          .select("*");
        if (cabinsError) {
          throw cabinsError;
        }
        if (cabinsData && cabinsData.length > 0) {
          const mappedRooms: Room[] = cabinsData.map((cabin) => ({
            id: cabin.id?.toString() || Math.random().toString(),
            title: cabin.name || "Pristine Luxury Cabin",
            description: cabin.description || "",
            price: cabin.regular_price || 0,
            discount: cabin.discount || 0,
            imageUrl: cabin.image || "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1000&auto=format",
            imageUrls: cabin.image ? [cabin.image] : ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1000&auto=format"],
            amenities: [
              "Comfort and Privacy",
              "Complimentary Breakfast Served Daily",
              "Free dual-band high-speed Wi-Fi",
              "Fully Air-Conditioned Suite",
              "Scenic Mountain & Kezira City Vistas",
              "Double Cushion Bedding & Linens",
              "Espresso Coffeemaker & Teas"
            ],
            size: "32 m²",
            maxGuests: cabin.max_capacity || 2,
            bedType: cabin.max_capacity > 2 ? "King Bed + Single Bed" : "Double Bed",
            overview: cabin.description || "Designed to maximize authentic comfort with custom layouts."
          }));
          setRooms(mappedRooms);
        } else {
          // If empty array, fallback to static
          const { ROOMS: staticRooms } = await import("./data");
          setRooms(staticRooms);
        }
      } catch (err) {
        console.warn("Error fetching cabins, falling back to static data:", err);
        try {
          const { ROOMS: staticRooms } = await import("./data");
          setRooms(staticRooms);
        } catch (staticErr) {
          console.error("Static data fallback failed:", staticErr);
        }
      } finally {
        setIsRoomsLoading(false);
      }

      try {
        // 5. Fetch gallery ordered by sort_order
        let { data: galleryData, error: galleryError } = await supabase
          .from("gallery")
          .select("*")
          .order("sort_order", { ascending: true });

        if (galleryError) {
          console.warn("Failed fetching from gallery ordered by sort_order. Retrying display_order.", galleryError);
          const fallbackQuery1 = await supabase
            .from("gallery")
            .select("*")
            .order("display_order", { ascending: true });
          galleryData = fallbackQuery1.data;
          galleryError = fallbackQuery1.error;
          
          if (galleryError) {
            const fallbackQuery2 = await supabase
              .from("gallery")
              .select("*");
            galleryData = fallbackQuery2.data;
            galleryError = fallbackQuery2.error;
          }
        }

        if (galleryError) {
          throw galleryError;
        }

        if (galleryData && galleryData.length > 0) {
          const mappedGallery = galleryData.map((img) => {
            let cat = (img.category || "exterior").toLowerCase();
            if (!["rooms", "dining", "exterior", "lounge"].includes(cat)) {
              cat = "exterior";
            }
            return {
              id: img.id?.toString() || Math.random().toString(),
              url: img.image_url || "",
              caption: img.title || "",
              category: cat as "rooms" | "dining" | "exterior" | "lounge"
            };
          });
          setGallery(mappedGallery);
        } else {
          setGallery([]);
        }
      } catch (err) {
        console.warn("Error fetching gallery images:", err);
        setGallery([]);
      }

      try {
        // 6. Fetch promotions
        const { data: promosData, error: promosError } = await supabase
          .from("promotions")
          .select("*")
          .eq("is_active", true);
        if (promosError) {
          throw promosError;
        }
        if (promosData && promosData.length > 0) {
          const nowStr = new Date().toISOString();
          const activePromos = promosData.filter((promo) => {
            const fromValid = promo.valid_from ? nowStr >= promo.valid_from : true;
            const toValid = promo.valid_until ? nowStr <= promo.valid_until : true;
            return fromValid && toValid;
          });
          setPromotions(activePromos);
        } else {
          setPromotions(DEFAULT_PROMOTIONS);
        }
      } catch (err) {
        console.warn("Error fetching promotions, using default promotions:", err);
        setPromotions(DEFAULT_PROMOTIONS);
      }
    };
    fetchAllData();
  }, []);

  // Active Navigation Screen page state
  const [activePage, setActivePage] = useState("home");
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Booking database real-time state filtered by guest email
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [isFetchingBookings, setIsFetchingBookings] = useState(false);
  const [fetchBookingsError, setFetchBookingsError] = useState<string | null>(null);

  const fetchUserBookings = async (email: string) => {
    if (!email) {
      setBookings([]);
      return;
    }
    setIsFetchingBookings(true);
    setFetchBookingsError(null);
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          cabin_id,
          guest_name,
          guest_email,
          start_date,
          end_date,
          status,
          total_price,
          has_breakfast,
          is_paid,
          created_at,
          cabins (
            id,
            name,
            regular_price,
            image,
            description
          )
        `)
        .eq("guest_email", email.trim().toLowerCase())
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      const mappedBookings: Booking[] = (data || []).map((b: any) => {
        const cabinInfo = Array.isArray(b.cabins) ? b.cabins[0] : b.cabins;
        const matchedRoom = rooms.find(r => r.id === b.cabin_id?.toString()) || {
          title: cabinInfo?.name || `Cabin #${b.cabin_id}`,
          price: cabinInfo?.regular_price || b.total_price || 0,
        };

        const d1 = new Date(b.start_date);
        const d2 = new Date(b.end_date);
        const diffTime = d2.getTime() - d1.getTime();
        const totalNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

        return {
          id: b.id.toString(),
          roomId: b.cabin_id?.toString(),
          roomTitle: matchedRoom.title,
          roomPrice: matchedRoom.price,
          checkIn: b.start_date,
          checkOut: b.end_date,
          adults: 2,
          children: 0,
          guestName: b.guest_name || "",
          guestEmail: b.guest_email || "",
          guestPhone: "",
          specialRequests: undefined,
          totalNights,
          totalPrice: b.total_price || 0,
          confirmationCode: `DRH-${b.id}`,
          createdAt: b.created_at || new Date().toISOString()
        };
      });

      setBookings(mappedBookings);
    } catch (err: any) {
      console.warn("Error fetching user bookings:", err);
      setFetchBookingsError(err.message || "Failed to retrieve real-time reservation details.");
    } finally {
      setIsFetchingBookings(false);
    }
  };

  useEffect(() => {
    if (guestEmail) {
      fetchUserBookings(guestEmail);
    } else {
      setBookings([]);
    }
  }, [guestEmail, rooms]);


  // Flow control states
  const [selectedRoomPreload, setSelectedRoomPreload] = useState<Room | null>(null);
  const [activeDetailRoom, setActiveDetailRoom] = useState<Room | null>(null);
  const [activeCheckoutRoom, setActiveCheckoutRoom] = useState<Room | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Buffer variables to carry selections from Booking widget to Checkout modal
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);

  // Success Notification banner configs
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);

  // Trigger skeleton loader animation whenever the page swings
  useEffect(() => {
    setIsPageLoading(true);
    const handler = setTimeout(() => {
      setIsPageLoading(false);
    }, 450);
    return () => clearTimeout(handler);
  }, [activePage]);


  // Handle smooth scroll to booking card section
  const handleScrollToBooking = () => {
    setActivePage("home");
    setTimeout(() => {
      const banner = document.getElementById("booking-anchor-section");
      if (banner) {
        banner.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);
  };

  // Actions when room card triggers 'Book Room'
  const handleSelectRoomPreload = (room: Room) => {
    setSelectedRoomPreload(room);
    if (activePage !== "home" && activePage !== "rooms") {
      setActivePage("home");
      setTimeout(() => {
        handleScrollToBooking();
      }, 150);
    } else {
      handleScrollToBooking();
    }
  };

  // Actions when clicking Spec 'Expand' button on room card
  const handleOpenDetailModal = (room: Room) => {
    setActiveDetailRoom(room);
  };

  // Triggered when clicking 'Reserve Suite' from within Room details spec modal
  const handleBookFromSpecs = (room: Room) => {
    setActiveDetailRoom(null);
    setSelectedRoomPreload(room);
    handleScrollToBooking();
  };

  // Initiating full booking checkout form (from BookingWidget results grid)
  const handleInitiateBooking = (
    room: Room,
    checkIn: string,
    checkOut: string,
    adults: number,
    children: number
  ) => {
    setCheckInDate(checkIn);
    setCheckOutDate(checkOut);
    setAdultsCount(adults);
    setChildrenCount(children);
    setActiveCheckoutRoom(room);
  };

  // Final confirmation receipt callback
  const handleConfirmBooking = async (newBooking: Booking) => {
    if (newBooking.guestEmail) {
      setGuestEmail(newBooking.guestEmail);
      await fetchUserBookings(newBooking.guestEmail);
    } else {
      setBookings((prev) => [newBooking, ...prev]);
    }
    setActiveCheckoutRoom(null);
    setSuccessBooking(newBooking);

    // Auto dismiss checkouts
    setTimeout(() => {
      setSuccessBooking(null);
    }, 10000);

    // Scroll smoothly to reservation portal timeline
    setTimeout(() => {
      const historyView = document.getElementById("bookings-history");
      if (historyView) {
        historyView.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 800);
  };

  // Cancel reservation callback
  const handleCancelBooking = async (id: string) => {
    try {
      const targetBooking = bookings.find((bk) => bk.id === id);
      const emailToUse = (targetBooking?.guestEmail || guestEmail || "").trim().toLowerCase();

      const { error } = await supabase.rpc('cancel_booking', {
        booking_id: parseInt(id, 10),
        guest_email: emailToUse
      });

      if (error) {
        console.error(error);
        alert(error.message || "Failed to cancel this reservation. Please verify your guest email.");
      } else {
        alert('Booking cancelled successfully');
        // Refresh bookings or filter deleted from view (since status changed to cancelled in DB, matching current query status filter)
        // Let's filter it out of active list if we want, or re-fetch to reflect "cancelled" status or remove it.
        // Actually, let's filter it from active view so the cancellation feels instantaneous.
        setBookings((prev) => prev.filter((bk) => bk.id !== id));
      }
    } catch (err: any) {
      console.warn("Error cancelling booking:", err);
      alert("Failed to cancel this reservation. Please contact hotel staff at +251 251 111 223.");
    }
  };

  if (is404Route) {
    return (
      <div className="min-h-screen bg-[#FAF2E3] text-stone-800 font-sans flex flex-col justify-between py-12 px-6 relative overflow-hidden select-none">
        {/* Ambient Glowing Spot */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#9C2A2A]/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/5 rounded-full blur-[140px]" />
        </div>

        {/* Header Branding */}
        <div className="max-w-4xl mx-auto w-full z-10 flex justify-between items-center border-b border-stone-200 pb-5">
          <div className="flex items-center space-x-3 text-left">
            <img 
              src="https://i.ibb.co/xS8gGjtb/Picsart-26-05-26-05-22-39-801.png" 
              alt="Official Dire Dawa Ras Hotel Logo" 
              className="h-10 w-auto object-contain rounded-md"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="block font-serif text-[11px] font-bold text-stone-500 tracking-wider uppercase">DIRE DAWA</span>
              <span className="block font-serif text-sm font-black text-[#9C2A2A] tracking-widest uppercase">RAS HOTEL</span>
            </div>
          </div>
        </div>

        {/* Main Content Box */}
        <div className="max-w-md w-full mx-auto my-auto z-10 bg-[#FFFDF9] border border-stone-200/60 rounded-[32px] p-8 md:p-12 shadow-xl text-center space-y-6">
          <div className="space-y-3">
            <h2 className="font-serif text-3xl font-black text-[#9C2A2A] tracking-tight">
              Page Not Found
            </h2>
            <p className="text-stone-500 text-xs uppercase font-bold tracking-[0.2em] font-mono">
              Error Code 404
            </p>
          </div>

          <p className="text-stone-600 text-sm leading-relaxed text-center">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <div className="pt-2">
            <button 
              onClick={() => {
                window.location.href = "/";
              }}
              className="px-6 py-3 bg-[#9C2A2A] hover:bg-[#802222] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition shadow-lg cursor-pointer inline-flex items-center space-x-2"
            >
              <span>Return Home</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="max-w-4xl mx-auto w-full z-10 text-center border-t border-stone-200/60 pt-6">
          <p className="text-stone-500 text-[10px] uppercase font-bold tracking-widest font-mono">
            © 2026 Dire Dawa Ras Hotel Group • All Rights Reserved
          </p>
        </div>
      </div>
    );
  }

  if (isMaintenance) {
    return (
      <div className="min-h-screen bg-[#FAF2E3] text-[#9C2A2A] font-sans flex flex-col justify-between py-12 px-6 relative overflow-hidden select-none">
        {/* Ambient Glowing Spot */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#9C2A2A]/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/5 rounded-full blur-[140px]" />
        </div>

        {/* Header Branding */}
        <div className="max-w-4xl mx-auto w-full z-10 flex justify-between items-center border-b border-stone-200 pb-5">
          <div className="flex items-center space-x-3 text-left">
            <img 
              src="https://i.ibb.co/xS8gGjtb/Picsart-26-05-26-05-22-39-801.png" 
              alt="Brand Logo" 
              className="h-10 w-auto object-contain rounded-md"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="block font-serif text-[11px] font-bold text-stone-500 tracking-wider uppercase">
                {settings?.site_name || "DIRE DAWA RAS HOTEL"}
              </span>
              <span className="block font-serif text-sm font-black text-[#9C2A2A] tracking-widest uppercase">
                MAINTENANCE ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Box */}
        <div className="max-w-md w-full mx-auto my-auto z-10 bg-[#FFFDF9] border border-stone-200/60 rounded-[32px] p-8 md:p-12 shadow-xl text-center space-y-6">
          <div className="space-y-3">
            <ShieldAlert className="w-12 h-12 mx-auto text-[#D4AF37]" />
            <h2 className="font-serif text-3xl font-black text-[#9C2A2A] tracking-tight">
              Under Maintenance
            </h2>
            <p className="text-stone-500 text-xs uppercase font-bold tracking-[0.2em] font-mono">
              Temporarily Offline
            </p>
          </div>

          <p className="text-stone-600 text-sm leading-relaxed text-center">
            {settings?.banner_text || "The digital guest directory is undergoing scheduled routine performance updates to ensure lightning fast load speeds. Operations will restore immediately."}
          </p>

          {settings?.support_email && (
            <div className="pt-2 text-xs text-stone-500">
              Operations Support Terminal Email: <strong className="text-stone-700">{settings.support_email}</strong>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="max-w-4xl mx-auto w-full z-10 text-center border-t border-stone-200/60 pt-6">
          <p className="text-stone-500 text-[10px] uppercase font-bold tracking-widest font-mono">
            © 2026 {settings?.site_name || "Dire Dawa Ras Hotel Group"} • All Rights Reserved
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF2E3] selection:bg-[#D4AF37]/30 selection:text-[#9C2A2A] relative overflow-x-hidden" id="app-root-layout">
        {/* Absolute Ambient Glowing Light Spots */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[5%] left-[-10%] w-[50%] h-[35%] bg-[#9C2A2A]/12 rounded-full blur-[120px]" />
          <div className="absolute top-[35%] right-[-15%] w-[60%] h-[40%] bg-[#D4AF37]/10 rounded-full blur-[160px]" />
          <div className="absolute top-[65%] left-[-20%] w-[55%] h-[45%] bg-[#9C2A2A]/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-[2%] right-[-10%] w-[50%] h-[30%] bg-[#9C2A2A]/10 rounded-full blur-[130px]" />
        </div>

        {/* Visual Success Booking Toast HUD Notification */}
        {successBooking && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md w-full p-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-6 duration-300">
            <div className="bg-white rounded-xl p-5 text-left border border-white/10 flex items-start space-x-4">
            <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600 shrink-0">
              <Check className="w-5 h-5 shrink-0" />
            </div>
            
            <div className="flex-1 space-y-2.5 text-xs md:text-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-serif font-extrabold text-base text-gray-800 leading-none">
                    Booking Finalized!
                  </h4>
                  <p className="text-[10px] text-[#9C2A2A] font-bold tracking-widest uppercase mt-1">
                    Voucher Code: {successBooking.confirmationCode}
                  </p>
                </div>
                <button
                  onClick={() => setSuccessBooking(null)}
                  className="p-1 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-gray-500 leading-relaxed text-xs">
                Congratulations, <strong>{successBooking.guestName}</strong>! Your stay for <strong>{successBooking.roomTitle}</strong> ({successBooking.totalNights} Nights) is successfully logged. Take a screenshot or show this voucher at reception upon arrival.
              </p>

              <button
                onClick={() => {
                  setSuccessBooking(null);
                  const h = document.getElementById("bookings-history");
                  if (h) h.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-[#9C2A2A] hover:text-[#802222] font-bold inline-flex items-center space-x-1 hover:translate-x-0.5 transition-all text-xs"
              >
                <span>View Voucher Records</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Corporate Header Navigation */}
      <Navbar activePage={activePage} setActivePage={setActivePage} onBookClick={handleScrollToBooking} />

      {/* Main Page Swapper with Skeletons */}
      {isPageLoading ? (
        <SkeletonLoader type={activePage === "rooms" ? "rooms" : "page"} />
      ) : (
        <>
          {activePage === "home" && (
            <>
              {/* Hero Visual intro scroll pane */}
              <Hero
                onBookClick={handleScrollToBooking}
                onWatchVideo={() => setIsVideoOpen(true)}
                settings={settings}
                contentBlocks={contentBlocks}
              />

              {/* Availability check segment anchors */}
              <div id="booking-anchor-section" className="scroll-mt-24">
                <BookingWidget
                  rooms={rooms}
                  onInitiateBooking={handleInitiateBooking}
                  selectedRoomPreload={selectedRoomPreload}
                  resetPreload={() => setSelectedRoomPreload(null)}
                />
              </div>

              {/* Dynamic rooms catalog */}
              <Rooms
                rooms={rooms}
                loading={isRoomsLoading}
                onSelectRoomPreload={handleSelectRoomPreload}
                onOpenDetailModal={handleOpenDetailModal}
              />

              {/* Visual Image masonry Grid */}
              <Gallery gallery={gallery.filter((img) => ["exterior", "rooms"].includes(img.category))} />

              {/* Booking Offers promotion card */}
              <Offers onGrabOfferClick={handleScrollToBooking} promotions={promotions} />

              {/* Member Interactive Local reservations log */}
              <BookingHistory
                bookings={bookings}
                onCancelBooking={handleCancelBooking}
                onScrollToBooking={handleScrollToBooking}
                guestEmail={guestEmail}
                setGuestEmail={setGuestEmail}
                isFetching={isFetchingBookings}
                fetchError={fetchBookingsError}
                onRefresh={() => fetchUserBookings(guestEmail)}
              />
            </>
          )}

          {activePage === "rooms" && (
            <div className="pt-20">
              <Rooms
                rooms={rooms}
                loading={isRoomsLoading}
                onSelectRoomPreload={handleSelectRoomPreload}
                onOpenDetailModal={handleOpenDetailModal}
              />
              <div id="booking-anchor-section" className="scroll-mt-24">
                <BookingWidget
                  rooms={rooms}
                  onInitiateBooking={handleInitiateBooking}
                  selectedRoomPreload={selectedRoomPreload}
                  resetPreload={() => setSelectedRoomPreload(null)}
                />
              </div>
              <BookingHistory
                bookings={bookings}
                onCancelBooking={handleCancelBooking}
                onScrollToBooking={handleScrollToBooking}
                guestEmail={guestEmail}
                setGuestEmail={setGuestEmail}
                isFetching={isFetchingBookings}
                fetchError={fetchBookingsError}
                onRefresh={() => fetchUserBookings(guestEmail)}
              />
            </div>
          )}

          {activePage === "about" && (
            <div className="pt-20">
              <AboutUsPage />
            </div>
          )}

          {activePage === "dining" && (
            <div className="pt-20">
              <Dining gallery={gallery.filter((img) => img.category === "dining")} />
            </div>
          )}

          {activePage === "gallery" && (
            <div className="pt-20">
              <Gallery gallery={gallery.filter((img) => ["exterior", "rooms"].includes(img.category))} />
            </div>
          )}

          {activePage === "contact" && (
            <div className="pt-20">
              <ContactPage />
            </div>
          )}
        </>
      )}

      {/* Corporate footer block serving all navigation page scopes */}
      <Footer onNavClick={setActivePage} settings={settings} contentBlocks={contentBlocks} />

      {/* ========================================= MODALS ========================================= */}

      {/* Immersive Room Details walkthrough modal */}
      <RoomDetailModal
        room={activeDetailRoom}
        isOpen={activeDetailRoom !== null}
        onClose={() => setActiveDetailRoom(null)}
        onBookDirect={handleBookFromSpecs}
      />

      {/* Interactive Guest checkout details form */}
      <CheckoutModal
        room={activeCheckoutRoom}
        checkIn={checkInDate}
        checkOut={checkOutDate}
        adults={adultsCount}
        children={childrenCount}
        onClose={() => setActiveCheckoutRoom(null)}
        onConfirmBooking={handleConfirmBooking}
      />

      {/* Immersive play tour video modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />
    </div>
  );
}
