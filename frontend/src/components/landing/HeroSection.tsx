import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#e6f0ff] py-12 lg:py-20">
      {/* Math formulas background pattern */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/mathematics.png')]" />
      
      <div className="container relative z-10 px-4">
        <div className="flex flex-col items-center lg:flex-row lg:justify-between lg:gap-12">
          
          {/* Right side: Engineer Image (Visual Left in RTL) */}
          <div className="relative order-2 lg:order-1 lg:w-1/2 flex justify-center mt-10 lg:mt-0">
            <div className="relative">
              {/* Floating math icon */}
              <div className="absolute -left-4 top-10 z-20 h-12 w-12 rotate-12 rounded-lg bg-[#4267B2] p-2 text-white shadow-xl animate-float">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="text-[10px]">+</div>
                  <div className="text-[10px]">-</div>
                  <div className="text-[10px]">x</div>
                  <div className="text-[10px]">=</div>
                </div>
              </div>
              <div className="absolute -right-4 bottom-20 z-20 h-10 w-10 -rotate-12 rounded-lg bg-[#4267B2] p-2 text-white shadow-xl animate-float [animation-delay:1s]">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="text-[10px]">∑</div>
                  <div className="text-[10px]">π</div>
                  <div className="text-[10px]">√</div>
                  <div className="text-[10px]">∫</div>
                </div>
              </div>

              {/* Main Image */}
              <div className="relative z-10">
                <img 
                  src="/engineer.png" 
                  alt="المهندس علي" 
                  className="h-[350px] w-auto drop-shadow-2xl md:h-[450px]"
                />
              </div>
            </div>
          </div>

          {/* Left side: Content (Visual Right in RTL) */}
          <div className="order-1 lg:order-2 lg:w-1/2 text-center lg:text-right">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-[#003366] md:text-5xl lg:text-6xl font-title">
              مع المهندس علي 
              <br />
              <span className="text-[#3b82f6]">الرياضيات مش حفظ.</span>
            </h1>

            <p className="mb-8 text-xl font-medium text-gray-600 italic">
              "عيلة المهندس أعظم عيلة كده كده"
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-end">
              <Button
                size="lg"
                className="bg-[#0056b3] text-white hover:bg-[#004494] px-10 h-14 text-lg font-bold shadow-lg"
                asChild
              >
                <Link to="/login">ابدأ المتابعة الكاملة</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#0056b3] text-[#0056b3] hover:bg-white/50 px-10 h-14 text-lg font-bold"
              >
                تصفح الدروس المجانية
                <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#0056b3]/10">
                  <Play className="h-3 w-3 fill-current" />
                </div>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;