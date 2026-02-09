import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { studentStrings } from "../../studentStrings";

interface LoadingProps {
  label?: string;
}

export default function Loading({ label }: LoadingProps) {
  const location = useLocation();
  const isStudent = location.pathname.startsWith("/student");
  const displayLabel = label ?? (isStudent ? studentStrings.loading : undefined);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {displayLabel && (
        <span className="text-sm text-muted-foreground">{displayLabel}</span>
      )}
    </div>
  );
}

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export const LoadingScreen = ({ onComplete, duration = 2500 }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete?.(), 300);
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      {/* Official Logo */}
      <div className="mb-5 animate-in fade-in zoom-in duration-1000">
        <div className="relative flex flex-col items-center">
          <img
            src="/logo.png"
            alt="المهندس"
            className="h-64 w-auto object-contain"
          />
        </div>
      </div>

      {/* Math Calculator Icons (Floating) */}
      <div className="mb-8">
        <div className="relative h-32 w-32 rounded-xl bg-transparent p-4">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/icons/Calculator.gif"
              alt="Calculator Icon"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="w-64">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 flex justify-between px-1 text-xs font-medium text-muted-foreground">
          <span>جاري تحميل المنصة...</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};