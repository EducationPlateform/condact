import { Button } from "@/components/ui/button";
import { WhatsApp } from "@mui/icons-material";
import {
  MessageCircle,
  Youtube,
  GraduationCap,
  Monitor,
  Lightbulb,
  Hexagon,
} from "lucide-react";

const ExpertSection = () => {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background with Chalkboard and Overlay */}
      <div className="absolute inset-0 z-0 bg-[url('/Hero-bg.png')] bg-cover bg-center opacity-40" />
      <div className="absolute inset-0 z-0 bg-white/60" />

      <div className="container relative z-10 px-4">
        <div className="flex flex-col-reverse items-center lg:flex-row-reverse lg:justify-between lg:gap-16">
          {/* Content (Visual Right in RTL) */}
          <div className="lg:w-3/5 text-center lg:text-right mt-16 lg:mt-0">
            <h2 className="mb-8 text-5xl font-extrabold leading-tight text-[#1a1a1a] font-amin">
              تعلم الرياضيات بأسلوب خبير{" "}
              <span className="text-[#3b82f6]">هندسي متميز</span>
            </h2>

            <p className="mb-6 text-lg/loose font-normal text-[#354152] font-amin leading-relaxed max-w-2xl lg:ml-0 lg:mr-auto">
              بخبرة أكاديمية تمتد لأكثر من 6 أعوام، يقدم المهندس علي السيد محتوى
              تعليمياً مبسطاً يربط بين الرياضيات والهندسة، ويحول القوانين الصعبة
              إلى أفكار واضحة وتطبيقات عملية يفهمها الطالب بسهولة.
            </p>

            <div className="mb-6 inline-block rounded-2xl border border-blue-200 bg-white/80 p-3 italic text-[#3b82f6] text-2xl font-normal font-awesome shadow-sm">
              "عيلة المهندس أعظم عيلة كده كده"
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-12">
              <div className="flex items-center gap-4 justify-between bg-white/70 py-2 px-4 rounded-2xl border border-white shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <GraduationCap className="h-6 w-6 text-[#3b82f6]" />
                </div>
                <span className="font-semibold text-[#1a1a1a] font-notoSansArabic text-sm/tight">
                  حاصل على بكالوريوس هندسة
                </span>
              </div>
              <div className="flex items-center gap-4 justify-between bg-white/70 py-2 px-4 rounded-2xl border border-white shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <Youtube className="h-6 w-6 text-[#3b82f6]" />
                </div>
                <span className="font-semibold text-[#1a1a1a] font-notoSansArabic text-sm/tight">
                  دروس المجانية على اليوتيوب
                </span>
              </div>
              <div className="flex items-center gap-4 justify-between bg-white/70 py-2 px-4 rounded-2xl border border-white shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <Monitor className="h-6 w-6 text-[#3b82f6]" />
                </div>
                <span className="font-semibold text-[#1a1a1a] font-notoSansArabic text-sm/tight">
                  مدرب معلمين على الطرق الحديثة
                </span>
              </div>
              <div className="flex items-center gap-4 justify-between bg-white/70 py-2 px-4 rounded-2xl border border-white shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <Lightbulb className="h-6 w-6 text-[#3b82f6]" />
                </div>
                <span className="font-semibold text-[#1a1a1a] font-notoSansArabic text-sm/tight">
                  المتابعة الكاملة من هنا المنصة
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-12 h-16 text-base font-bold font-notoSansArabic rounded-2xl shadow-xl shadow-blue-200 gap-3"
              >
                <WhatsApp className="h-6 w-6 fill-current" />
                تواصل مع المهندس مباشرة
              </Button>

              <div className="flex gap-4">
                <div className=" z-10 h-16 w-16 rotate-12 rounded-lg bg-transparent text-white">
                  <img
                    src="/icons/Calculator.gif"
                    alt="Calculator Icon"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className=" z-10 h-16 w-16 rotate-12 rounded-lg bg-transparent text-white">
                  <img
                    src="/icons/Calculator.gif"
                    alt="Calculator Icon"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className=" z-10 h-16 w-16 rotate-12 rounded-lg bg-transparent text-white">
                  <img
                    src="/icons/Calculator.gif"
                    alt="Calculator Icon"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Engineer Image with Stylized Frame */}
          <div className="relative lg:w-2/5 flex justify-center">
            <div className="relative z-10">
              {/* Chess-themed background elements */}
              <div className="absolute inset-0 -z-10 flex items-center justify-center scale-150 opacity-20">
                <img
                  src="/images/Chess-Ali-Platform.png"
                  alt="Chess Decor"
                  className="h-125 w-125 object-cover"
                />
              </div>

              <div className="relative overflow-visible">
                {/* Use the Chess-Ali-Platform image as background for engineer if available or styled circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-blue-600 rounded-full -z-10 shadow-2xl opacity-90 border-[15px] border-white/30" />
                <img
                  src="/engineer.png"
                  alt="المهندس علي السيد"
                  className="relative z-20 h-[500px] w-auto drop-shadow-2xl"
                />

                {/* Floating Name Tag */}
                <div className="absolute bottom-10 right-0 z-30 bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 min-w-[280px]">
                  <h3 className="text-2xl font-extrabold text-[#1a1a1a] font-awesome mb-1">
                    باشمهندس علي السيد
                  </h3>
                  <p className="text-sm font-bold text-[#3b82f6] font-notoSansArabic">
                    كبير خبراء مناهج الرياضيات
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertSection;
