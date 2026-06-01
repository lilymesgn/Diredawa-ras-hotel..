import { motion } from "motion/react";
import React, { ReactNode } from "react";
import { useIsMobile } from "./useIsMobile";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  scaleStart?: number;
  distance?: number;
  className?: string;
  key?: React.Key;
}

export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.85,
  direction = "up",
  scaleStart = 0.93,
  distance = 60,
  className = "",
}: ScrollRevealProps) {
  const isMobile = useIsMobile();

  // Optimizations for mobile screens to feel lightweight and maintain a solid 60fps
  const animDistance = isMobile ? Math.min(distance, 15) : distance;
  const animScale = isMobile ? Math.max(scaleStart, 0.98) : scaleStart;
  const animDuration = isMobile ? Math.min(duration, 0.65) : duration;
  const animDelay = isMobile ? Math.min(delay, 0.1) : delay;

  let x = 0;
  let y = 0;
  if (direction === "up") y = animDistance;
  else if (direction === "down") y = -animDistance;
  else if (direction === "left") x = animDistance;
  else if (direction === "right") x = -animDistance;

  return (
    <motion.div
      initial={{ opacity: 0, x, y, scale: scaleStart === 1 ? 1 : animScale }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: isMobile ? "-4%" : "-10%" }}
      transition={{
        duration: animDuration,
        delay: animDelay,
        ease: [0.16, 1, 0.3, 1], // Elegant luxury cubic bezier curve
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ScrollRevealContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
  viewportMargin?: string;
  key?: React.Key;
}

export function ScrollRevealContainer({
  children,
  staggerDelay = 0.12,
  className = "",
  viewportMargin = "-8%",
}: ScrollRevealContainerProps) {
  const isMobile = useIsMobile();
  const margin = isMobile ? "-3%" : viewportMargin;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: isMobile ? staggerDelay * 0.5 : staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ScrollRevealItemProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  scaleStart?: number;
  className?: string;
  key?: React.Key;
}

export function ScrollRevealItem({
  children,
  direction = "up",
  distance = 60,
  scaleStart = 0.93,
  className = "",
}: ScrollRevealItemProps) {
  const isMobile = useIsMobile();

  const animDistance = isMobile ? Math.min(distance, 15) : distance;
  const animScale = isMobile ? Math.max(scaleStart, 0.98) : scaleStart;

  let x = 0;
  let y = 0;
  if (direction === "up") y = animDistance;
  else if (direction === "down") y = -animDistance;
  else if (direction === "left") x = animDistance;
  else if (direction === "right") x = -animDistance;

  const itemVariants = {
    hidden: {
      opacity: 0,
      x,
      y,
      scale: scaleStart === 1 ? 1 : animScale,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: isMobile ? 0.55 : 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
