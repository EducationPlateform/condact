const steps = [
  {
    number: "١",
    title: "التشخيص المعرفي",
    description: "اختبار تحديد مستوى ذكي لكشف الثغرات المعرفية والمهارات الأساسية.",
  },
  {
    number: "٢",
    title: "التعلم التفاعلي",
    description: "شروحات فيديو عالية الجودة مع نماذج بصرية ثلاثية الأبعاد للهندسة.",
  },
  {
    number: "٣",
    title: "التدريب المكثف",
    description: "حل آلاف المسائل المتدرجة الصعوبة مع تصحيح تلقائي وشرح فوري.",
  },
  {
    number: "٤",
    title: "المحاكاة والتقييم",
    description: "نماذج امتحانات نهائية تحاكي الاختبارات الوزارية لضمان التفوق.",
  },
];

const RoadmapSection = () => {
  return (
    <section className="bg-white py-16">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-[#003366] md:text-4xl font-heading">
            خارطة التميز الرياضي
          </h2>
          <p className="mt-2 text-gray-500 font-medium">
            من الفهم الأساسي إلى الإتقان الكامل للمهارات التحليلية
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-md text-center"
            >
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#3b82f6] text-xl font-bold text-white">
                {step.number}
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#003366]">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;