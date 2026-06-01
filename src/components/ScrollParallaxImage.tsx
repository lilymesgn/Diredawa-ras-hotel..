import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useIsMobile } from "./useIsMobile";
import AestheticImage from "./AestheticImage";

interface ScrollParallaxImageProps {
  src: string;
  alt: string;
  className?: string; // Applied to the outer wrapper container
  imageClassName?: string; // Applied to the image element
  width?: number | string;
  height?: number | string;
  intensity?: number; // Override default scroll translate shift factor (1 is default)
}

export default function ScrollParallaxImage({
  src,
  alt,
  className = "",
  imageClassName = "",
  width,
  height,
  intensity = 1,
}: ScrollParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Track the element's entrance and exit relative to the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Calculate parallax translation.
  // We translate the image inside its overflow-hidden container.
  // Non-mobile gets substantial shift; mobile gets negligible shift to keep it perfectly 60fps.
  const yShift = isMobile ? 12 * intensity : 50 * intensity;
  const y = useTransform(scrollYProgress, [0, 1], [-yShift, yShift]);

  // Noticeable premium scale-up (e.g. 1.15x down to 1x and back up to 1.15x as you pass by, or deep mapping).
  // Settle at middle of screen (progress 0.5) to original 1.0 or snug scale,
  // scaling up on entry (0) and exit (1).
  const scaleValue = isMobile ? [1.04, 1.0, 1.04] : [1.14, 1.01, 1.14];
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], scaleValue);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ contentVisibility: "auto" }}
    >
      <motion.div
        style={{
          y,
          scale,
          width: "100%",
          height: "116%", // Extra height to allow room for the vertical translation inside overflow-hidden
          position: "absolute",
          top: "-8%",
          left: 0,
        }}
        className="will-change-transform"
      >
        <AestheticImage
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${imageClassName}`}
          width={width}
          height={height}
        />
      </motion.div>
    </div>
  );
}
