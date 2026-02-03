import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="relative overflow-hidden bg-[url('/CTA-bg.png')] bg-cover bg-no-repeat bg-center my-20 py-4 mx-24 rounded-2xl">
      <div className="absolute bottom-0 left-0 z-0 ">
        <img src="/Overlay1.png" alt="overlay and blur" className="h-64 w-64" />
      </div>
      <div className="absolute top-0 right-0 z-0 ">
        <img src="/Overlay2.png" alt="overlay and blur" className="h-64 w-64" />
      </div>
      <div className="container relative z-10 px-4 text-center flex flex-col gap-4">
        {/* Diamond Icons on sides */}
        <div className="absolute left-11 top-12 z-10 h-36 w-36 rotate-12 rounded-lg bg-transparent text-white">
          <img
            src="/icons/Calculator.gif"
            alt="Calculator Icon"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute right-11 top-12 z-10 h-36 w-36 rotate-12 rounded-lg bg-transparent text-white">
          <img
            src="/icons/Calculator.gif"
            alt="Calculator Icon"
            className="h-full w-full object-cover"
          />
        </div>

        <h2 className="text-4xl font-normal text-white font-amin">
          جاهز لاحتراف الرياضيات؟
        </h2>
        <h3 className="text-2xl font-normal text-white font-amin">
          في بيت العيلة
        </h3>
        <p className="text-lg text-gray-400 font-medium font-notoSansArabic max-w-3xl mx-auto leading-relaxed">
          سجل الآن للحصول على أسبوع مجاني من الدروس التفاعلية وبنك الأسئلة
          الشامل.
        </p>

        <div className="flex flex-col justify-center gap-6 mt-4 sm:flex-row">
          <Button
            size="lg"
            className="relative overflow-hidden bg-[#2B7CEE] text-white transition-all duration-300 hover:bg-[#3b82f6] hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] px-10 py-4 h-20 text-base font-extrabold rounded-2xl font-notoSansArabic shadow-lg group sm:max-w-none"
            asChild
          >
            <Link to="/login">
              <span className="relative z-10 whitespace-normal text-center leading-tight">
                ابدأ المتابعة الكاملة
              </span>
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent border-2 border-[#3b82f6] text-white transition-all duration-300 hover:bg-white hover:text-[#3b82f6] h-20 px-10 py-4 text-base font-extrabold rounded-2xl font-notoSansArabic"
          >
            ابدأ تجربتك المجانية
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
