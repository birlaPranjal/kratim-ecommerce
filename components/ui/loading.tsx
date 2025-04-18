"use client";

import React from "react";
import { motion } from "framer-motion";

type LoadingProps = {
  isLoading?: boolean;
  text?: string;
  fullScreen?: boolean;
  transparent?: boolean;
};

const Loading: React.FC<LoadingProps> = ({
  isLoading = true,
  text = "Loading...",
  fullScreen = false,
  transparent = false,
}) => {
  if (!isLoading) return null;

  const containerClass = fullScreen
    ? "fixed inset-0 z-50"
    : "absolute inset-0 z-30";

  const bgClass = transparent
    ? "bg-white/70 backdrop-blur-sm"
    : "bg-[#faf5ee]";

  return (
    <div className={`${containerClass} ${bgClass} flex items-center justify-center`}>
      <div className="flex flex-col items-center">
        <motion.div
          className="w-12 h-12 border-4 border-[#5e7d77] border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        {text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-[#1d503a] font-coconat"
          >
            {text}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default Loading; 