import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calculator } from "lucide-react";

const CTASection = () => {
  return (
    <section className="relative overflow-hidden bg-[#001a33] py-20">
      <div className="container relative z-10 px-4 text-center">
        {/* Floating Icons for CTA */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 opacity-20 hidden lg:block">
           <Calculator className="h-32 w-32 text-white rotate-12" />
        </div>
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-20 hidden lg:block">
           <Calculator className="h-32 w-32 text-white -rotate-12" />
        </div>

        <h2 className="mb-4 text-4xl font-extrabold text-white md:text-5xl font-heading">
          جاهز لاحتراف الرياضيات؟
        </h2>
        <h3 className="mb-6 text-2xl font-bold text-[#3b82f6]">
          في بيت العيلة
        </h3>
        <p className="mb-10 text-lg text-white/70 max-w-2xl mx-auto">
          سجل الآن للحصول على أسبوع مجاني من الدروس المجانية وابدأ رحلتك لاكتشاف التميز في عالم الرياضيات مع أقوى المناهج والأسئلة الشاملة.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="bg-[#3b82f6] text-white hover:bg-[#2563eb] h-14 px-10 text-lg font-bold rounded-xl"
            asChild
          >
            <Link to="/login">
              ابدأ المتابعة الكاملة
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10 h-14 px-10 text-lg font-bold rounded-xl"
          >
            ابدأ تجربتك المجانية
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;