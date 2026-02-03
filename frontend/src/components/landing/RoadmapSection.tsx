const steps = [
  {
    number: "١",
    title: "التشخيص المعرفي",
    description:
      "اختبار تحديد مستوى ذكي لكشف الثغرات المعرفية والمهارات الأساسية.",
  },
  {
    number: "٢",
    title: "التعلم التفاعلي",
    description:
      "شروحات فيديو عالية الجودة مع نماذج بصرية ثلاثية الأبعاد للهندسة.",
  },
  {
    number: "٣",
    title: "التدريب المكثف",
    description: "حل آلاف المسائل المتدرجة الصعوبة مع تصحيح تلقائي وشرح فوري.",
  },
  {
    number: "٤",
    title: "المحاكاة والتقييم",
    description:
      "نماذج امتحانات نهائية تحاكي الاختبارات الوزارية لضمان التفوق.",
  },
];

const RoadmapSection = () => {
  return (
    <section className="bg-white py-24 overflow-hidden">
      <div className="container px-4">
        <div className="mb-20 text-center">
          <h2 className="text-4xl font-extrabold text-[#003366] font-heading mb-4">
            خارطة التميز الرياضي
          </h2>
          <p className="text-xl text-gray-400 font-medium font-notoSansArabic">
            من الفهم الأساسي إلى الإتقان الكامل للمهارات التحليلية
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-[3px] bg-[#e6f0ff] -translate-y-1/2 hidden lg:block" />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 relative z-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group relative rounded-[2rem] bg-white p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] text-center"
              >
                {/* Number Circle */}
                <div className="mx-auto mb-10 flex h-20 w-20 items-center justify-center rounded-full bg-[#3b82f6] text-2xl font-bold text-white shadow-[0_10px_20px_rgba(59,130,246,0.3)] font-notoSansArabic">
                  {step.number}
                </div>

                <h3 className="mb-6 text-2xl font-extrabold text-[#1a1a1a] font-amin">
                  {step.title}
                </h3>
                <p className="text-base leading-relaxed text-gray-400 font-medium font-notoSansArabic px-2">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
