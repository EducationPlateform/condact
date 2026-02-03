import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "أحمد العمري",
    grade: "طالب هندسة، الصف الثاني عشر",
    rating: 5,
    text: "كنت أعاني من رهاب الرياضيات، ولكن مع هذه المنصة أصبحت المادة المفضلة لدي. حققت الدرجة الكاملة في اختبار القدرات بفضل الله.",
    image: "/testimonals/test1.jpg",
  },
  {
    id: 2,
    name: "ليلى الراشد",
    grade: "متفوقة المسار العلمي، الصف الحادي عشر",
    rating: 5,
    text: "طريقة شرح التفاضل والتكامل هنا لا توصف. الرسوم البيانية التفاعلية جعلت من السهل تخيل الدوال المعقدة وفهمها بعمق.",
    image: "/testimonals/test2.jpg",
  },
  {
    id: 3,
    name: "ياسين محمد",
    grade: "طالب متفوق، الصف الثالث الثانوي",
    rating: 5,
    text: "المنصة خلت الرياضيات مادة ممتعة جداً بالنسبة لي. الشرح بسيط والتمارين شاملة لكل أفكار الامتحان.",
    image: "/testimonals/test3.jpg",
  },
];

const SuccessStoriesSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="success-stories"
      className="bg-[#fcfdff] py-20 overflow-hidden"
    >
      <div className="container px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row-reverse items-center justify-between mb-16 gap-8">
          {/* Arrows */}
          <div className="flex gap-4 order-3 md:order-1">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-14 w-14 shadow-lg border-none bg-[#3b82f6] text-white hover:bg-[#2563eb]"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-14 w-14 shadow-lg border-blue-100 text-[#3b82f6] hover:bg-blue-50"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>

          {/* Badge */}
          <div className="order-2">
            <div className="bg-[#3b82f6] text-white px-16 py-6 rounded-[3rem] text-2xl font-extrabold font-awesome shadow-xl shadow-blue-200">
              بيت العيلة
            </div>
          </div>

          {/* Title */}
          <div className="order-1 md:order-3 text-center md:text-right">
            <h2 className="text-4xl font-extrabold text-[#1a1a1a] font-awesome">
              قصص نجاح عباقرتنا
            </h2>
          </div>
        </div>

        {/* Scrollable Testimonials */}
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar scroll-smooth rtl px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="group w-[85vw] md:w-[75vw] lg:w-[850px] shrink-0 snap-start border-none shadow-[0_20px_50px_rgba(0,0,0,0.03)] rounded-[2.5rem] bg-white transition-all duration-300"
            >
              <CardContent className="p-10">
                <div className="flex flex-col sm:flex-row items-center gap-10">
                  {/* Image */}
                  <div className="shrink-0">
                    <div className="relative h-48 w-48 overflow-hidden rounded-[2rem] border-8 border-blue-50 shadow-inner">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-right">
                    <div className="flex justify-end gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-6 w-6 fill-[#ff9800] text-[#ff9800]"
                        />
                      ))}
                    </div>

                    <p className="text-xl md:text-2xl text-gray-500 font-medium font-amin leading-relaxed mb-8">
                      "{testimonial.text}"
                    </p>

                    <div>
                      <h4 className="text-3xl font-bold text-[#1a1a1a] font-amin mb-2">
                        {testimonial.name}
                      </h4>
                      <p className="text-lg text-gray-400 font-medium font-amin">
                        {testimonial.grade}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
