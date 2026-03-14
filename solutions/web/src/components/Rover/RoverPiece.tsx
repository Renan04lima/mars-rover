import { motion } from 'framer-motion';
import { type Direction } from '../../types/rover';
import { Bot } from 'lucide-react';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const RoverPiece = ({
  orientation,
  isCollecting
}: {
  orientation: Direction;
  isCollecting: boolean;
}) => {
  const rotationMap: Record<Direction, number> = {
    N: 0,
    E: 90,
    S: 180,
    W: -90 // Ensure it wraps the shortest path visually if we calculate it (Framer Motion handles most wrapping via layout)
  };

  return (
    <motion.div
      initial={{ rotate: rotationMap['E'] }}
      animate={{ 
        rotate: rotationMap[orientation],
        scale: isCollecting ? [1, 1.2, 1] : 1
      }}
      transition={{ 
        rotate: { type: "spring", bounce: 0.2, duration: 0.5 },
        scale: { duration: 0.4 }
      }}
      className={cn(
        "relative w-full h-full flex items-center justify-center text-white rounded-md",
        isCollecting ? "bg-amber-500 shadow-xl shadow-amber-500/50 z-20" : "bg-blue-600 z-10",
      )}
    >
      <Bot className="w-8 h-8" />
      {isCollecting && (
        <motion.div 
          className="absolute inset-0 rounded-full border-4 border-amber-400"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.div>
  );
};
