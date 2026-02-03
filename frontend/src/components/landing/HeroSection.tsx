import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-12 lg:py-20">
      {/* Hero background image */}
      <div className="absolute inset-0 z-0 bg-[url('/Hero-bg.png')] bg-cover bg-center" />
      <div className="absolute inset-0 z-0 bg-white/80" />

      <div className="container relative z-10 px-4">
        <div className="flex flex-col items-center lg:flex-row-reverse lg:justify-between lg:gap-12">
          {/* Right side: Content (Visual Right in RTL) */}
          <div className="order-1 lg:order-2 lg:w-1/2 text-center lg:text-right">
            <h1 className=" text-4xl font-extrabold tracking-tight text-[#003366] md:text-5xl lg:text-6xl font-amin">
              مع المهندس علي{" "}
              <span className="text-[#3b82f6] text-4xl/normal font-extrabold tracking-tight md:text-5xl/normal lg:text-6xl/normal font-amin">
                الرياضيات مش حفظ.
              </span>
            </h1>

            <p className="mb-8 text-xl font-medium font-Awesome text-gray-600 italic">
              "عيلة المهندس أعظم عيلة كده كده"
            </p>

            <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center lg:justify-end">
              {/* Button 1: Wrapping text + Background Animation */}
              <Button
                size="lg"
                className="relative overflow-hidden bg-[#0056b3] text-white transition-all duration-300 hover:bg-[#3b82f6] hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] px-8 h-auto min-h-14 py-3 text-lg font-bold shadow-lg group max-w-[200px] sm:max-w-none"
                asChild
              >
                <Link to="/login">
                  <span className="relative z-10 whitespace-normal text-center leading-tight">
                    ابدأ المتابعة الكاملة
                  </span>
                  <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Link>
              </Button>

              {/* Button 2: Two arrows on the left + Bouncing animation */}
              <div className="relative flex items-center gap-1 group">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#0056b3] text-[#0056b3] bg-white/50 hover:bg-white px-10 rounded-xl h-14 text-lg font-bold font-NotoSansArabic transition-all duration-300"
                >
                  تصفح الدروس المجانية
                </Button>

                <div className="flex items-center -space-x-7">
                  <ChevronRight className="h-10 w-10 text-[#0056b3] animate-point-left [animation-delay:0.05s]" />
                  <ChevronRight className="h-10 w-10 text-[#0056b3] animate-point-left" />
                </div>
              </div>
            </div>
          </div>

          {/* Left side: Engineer Image (Visual Left in RTL) */}
          <div className="relative order-2 lg:order-1 lg:w-1/2 flex justify-center mt-10 lg:mt-0">
            <div className="relative">
              {/* Floating math icon */}
              <div className="absolute -left-4 top-10 z-10 h-24 w-24 rotate-12 rounded-lg bg-transparent text-white">
                <img
                  src="/icons/Calculator.gif"
                  alt="Calculator Icon"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -right-14 bottom-10 z-10 h-24 w-24 rotate-12 rounded-lg bg-transparent text-white [animation-delay:1s]">
                <img
                  src="/icons/Calculator.gif"
                  alt="Calculator Icon"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Main Image */}
              <div className="relative z-20">
                <img
                  src="/engineer.png"
                  alt="المهندس علي"
                  className="h-[350px] w-auto drop-shadow-2xl md:h-[450px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
