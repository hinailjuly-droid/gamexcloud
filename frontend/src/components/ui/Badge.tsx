interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "success" | "warning" | "outline";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variants = {
    default: "bg-primary-lighter text-gray-300",
    accent: "bg-accent/10 text-accent border border-accent/20",
    success: "bg-green-500/10 text-green-500 border border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
    outline: "bg-transparent border border-white/20 text-gray-400",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
