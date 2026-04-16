"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  isLoading,
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-accent hover:bg-accent-dark text-white shadow-lg shadow-accent/20",
    outline: "bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/5 text-white",
    ghost: "bg-transparent hover:bg-white/5 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-sm rounded-md",
    md: "px-6 py-2.5 rounded-lg",
    lg: "px-8 py-3.5 text-lg rounded-xl",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      disabled={isLoading || props.disabled}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        Icon && <Icon size={size === "sm" ? 16 : 20} />
      )}
      {children}
    </motion.button>
  );
}
