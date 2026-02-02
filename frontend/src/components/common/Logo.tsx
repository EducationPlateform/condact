import { Link } from "react-router-dom";
import { Calculator } from "lucide-react";

interface LogoProps {
  variant?: "default" | "light" | "dark";
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const Logo = ({
  variant = "default",
  showText = true,
  size = "md",
}: LogoProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const colorClasses = {
    default: "bg-primary text-primary-foreground",
    light: "bg-white text-primary",
    dark: "bg-primary text-white",
  };

  const textColorClasses = {
    default: "text-foreground",
    light: "text-white",
    dark: "text-foreground",
  };

  return (
    <Link to="/" className="flex items-center gap-2">
      <div
        className={`flex items-center justify-center rounded-lg ${sizeClasses[size]} ${colorClasses[variant]}`}
      >
        <Calculator className="h-5 w-5" />
      </div>
      {showText && (
        <span
          className={`font-bold ${textSizeClasses[size]} ${textColorClasses[variant]}`}
        >
          منصة الرياضيات
        </span>
      )}
    </Link>
  );
};

export default Logo;
