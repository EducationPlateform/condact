import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ChevronLeft, ChevronRight, Trophy } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "أحمد العبدي",
    grade: "الصف الثالث الثانوي",
    rating: 5,
    text: "كنت تايه في الرياضيات. بالضبط مش فاهم حاجة ليها. بس مع المهندس الأمور اتغيرت 180 درجة. الطريقة مختلفة والتمارين كثير.",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "ليلى الراشد",
    grade: "الصف الثاني الثانوي",
    rating: 5,
    text: "أطيلة كتير من أحسن القرارات. بالحساب مانا مفيش مجتهدة. الريافة جعلت الحساب عليه. يقضي من السهول، ديات، تنظيم وقت مختلفة",
    image: "/placeholder.svg",
  },
];

const SuccessStoriesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    <section id="success-stories" className="bg-muted/50 py-16">
      <div className="container">
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4">
            <Trophy className="ml-1 h-4 w-4" />
            قصص نجاح عباقرتنا
          </Badge>
          <h2 className="text-3xl font-bold text-foreground">
            قصص نجاح عباقرتنا
          </h2>
        </div>

        <div className="relative">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={prevSlide}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={testimonial.id}
                  className={`transition-all ${
                    index === currentIndex
                      ? "scale-100 opacity-100"
                      : "scale-95 opacity-70"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10" />
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.grade}
                        </p>
                      </div>
                    </div>
                    <div className="mb-3 flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-warning text-warning"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "{testimonial.text}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={nextSlide}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* CTA Button */}
          <div className="mt-8 text-center">
            <Button className="bg-primary">بيت العيلة</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
