import { Camera } from "lucide-react";
import { useState } from "react";

interface AestheticImageProps {
  src: string;
  alt: string;
  className?: string;
  height?: number | string;
  width?: number | string;
}

export default function AestheticImage({ src, alt, className = "", height, width }: AestheticImageProps) {
  const [error, setError] = useState(false);
  
  // Fallback to "Image coming soon" only when there is an actual loading error or no source is provided
  const isStockImage = !src || error;

  if (isStockImage) {
    return (
      <div 
        className={`bg-stone-100 flex flex-col items-center justify-center p-6 border border-stone-200 text-center space-y-3 min-h-[220px] h-full w-full select-none ${className}`}
        style={{ contentVisibility: "auto" }}
      >
        <div className="bg-white p-3.5 rounded-full text-[#D4AF37] border border-stone-200 shadow-sm animate-pulse">
          <Camera className="w-6 h-6" />
        </div>
        <div>
          <p className="font-serif text-[#9C2A2A] text-sm font-bold">Image coming soon</p>
          <p className="text-[10px] text-[#9C2A2A] font-mono tracking-widest uppercase mt-1">Dire Dawa Ras Hotel Archive</p>
          <p className="text-[9px] text-[#9C2A2A]/80 font-mono tracking-wider mt-0.5">Established 1964 EC</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover w-full h-full ${className}`}
      loading="lazy"
      onError={() => setError(true)}
      referrerPolicy="no-referrer"
      width={width}
      height={height}
    />
  );
}
