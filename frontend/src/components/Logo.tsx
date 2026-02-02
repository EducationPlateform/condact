import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className, size = "md" }: LogoProps) => {
  const heights = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <Link to="/" className={cn("flex items-center gap-2", className)}>
      <img 
        src="/logo.png" 
        alt="المهندس" 
        className={cn(heights[size], "w-auto object-contain")}
      />
      <span className={cn("font-bold text-[#003366] whitespace-nowrap", textSizes[size])}>
        منصة الرياضيات
      </span>
    </Link>
  );
};

export default Logo;