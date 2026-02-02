import { Button } from "@/components/ui/button";
import { MessageCircle, CheckCircle, Youtube, GraduationCap, Monitor } from "lucide-react";

const ExpertSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#001a33] py-20 text-white">
      {/* Math pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/mathematics.png')]" />

      <div className="container relative z-10 px-4">
        <div className="flex flex-col items-center lg:flex-row lg:justify-between lg:gap-16">
          
          {/* Right side: Engineer Image (Visual Left in RTL) */}
          <div className="relative mb-12 lg:mb-0 lg:w-2/5 flex flex-col items-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full border border-dashed border-white/20 animate-spin-slow" />
              <div className="relative h-64 w-64 md:h-80 md:w-80 overflow-hidden rounded-full border-4 border-[#3b82f6] bg-white/5 backdrop-blur-sm">
                <img 
                  src="/engineer.png" 
                  alt="المهندس علي السيد" 
                  className="h-full w-full object-cover object-top mt-4"
                />
              </div>
              
              {/* Floating badges */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-white px-6 py-2 text-center shadow-2xl">
                <p className="text-xl font-bold text-[#003366]">باشمهندس علي السيد</p>
                <p className="text-xs font-bold text-[#3b82f6]">خبير خبراء مناهج الرياضيات</p>
              </div>
            </div>
          </div>

          {/* Left side: Content (Visual Right in RTL) */}
          <div className="lg:w-3/5 text-center lg:text-right">
            <h2 className="mb-6 text-4xl font-extrabold leading-tight text-white md:text-5xl font-heading">
              تعلم الرياضيات بأسلوب خبير 
              <br />
              هندسي متميز
            </h2>
            
            <p className="mb-8 text-lg font-medium text-white/80 leading-relaxed max-w-2xl lg:ml-0 lg:mr-auto">
              بخبرة أكاديمية تمتد لأكثر من 6 أعوام، يقدم المهندس علي السيد محتوى تعليمياً مبسطاً يربط بين الرياضيات والهندسة، ويحول القوانين الصعبة إلى أفكار واضحة وتطبيقات عملية يفهمها الطالب بسهولة.
            </p>

            <div className="mb-10 inline-block rounded-2xl border border-white/20 bg-white/5 px-6 py-3 italic text-[#3b82f6] text-xl font-bold">
              "عيلة المهندس أعظم عيلة كده كده"
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-10">
              <div className="flex items-center gap-3 justify-center lg:justify-start text-white/90">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                   <GraduationCap className="h-5 w-5 text-[#3b82f6]" />
                </div>
                <span className="font-bold">حاصل على بكالوريوس هندسة</span>
              </div>
              <div className="flex items-center gap-3 justify-center lg:justify-start text-white/90">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                   <Youtube className="h-5 w-5 text-[#3b82f6]" />
                </div>
                <span className="font-bold">دروس المجانية على اليوتيوب</span>
              </div>
              <div className="flex items-center gap-3 justify-center lg:justify-start text-white/90">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                   <Monitor className="h-5 w-5 text-[#3b82f6]" />
                </div>
                <span className="font-bold">مدرب معلمين على الطرق الحديثة</span>
              </div>
              <div className="flex items-center gap-3 justify-center lg:justify-start text-white/90">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                   <CheckCircle className="h-5 w-5 text-[#3b82f6]" />
                </div>
                <span className="font-bold">المتابعة الكاملة من هذا المنصة</span>
              </div>
            </div>

            <div className="flex justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-10 h-14 text-lg font-bold rounded-xl shadow-xl gap-2"
              >
                <MessageCircle className="h-5 w-5 fill-current" />
                تواصل مع الدكتور مباشرة
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ExpertSection;