import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, ChevronLeft } from "lucide-react";

const academicPaths = [
  {
    id: 1,
    title: "المراحل الاعدادية",
    description:
      '"المرحلة الإعدادية... الأساس الحقيقي للرياضيات، افهم صح دلوقتي علشان تريح دماغك بعدين."',
    subtitle: "جميع المراحل الاعدادية",
    stats: "٣٠ وحدة دراسية",
    badge: "المرحلة الاعدادية",
    image: "/engineer1.png",
  },
  {
    id: 2,
    title: "المراحل الثانوية",
    description: "ثانوي مش حفظ قوانين... ثانوي فهم وتحليل وطريقة تفكير.",
    subtitle: "جميع المراحل الثانوية",
    stats: "٣٠ وحدة دراسية",
    badge: "المرحلة الثانوية",
    image: "/engineer2.png",
  },
];

const skillPaths = [
  {
    id: 3,
    title: "مراجعة أكتوبر للصف الاول الثانوية",
    subtitle: "المراحل الثانوية",
    price: "360 جنيه",
    date: "الخميس يوم 15 فبراير 2026",
    lectures: "اول محاضرة بداية من يوم 2/8",
    image: "/images/Sec_1_revision_oct.jpg",
  },
  {
    id: 4,
    title: "مراجعة حساب المثلثات للصف الثالث الإعدادي",
    subtitle: "المراحل الإعدادية",
    price: "360 جنيه",
    date: "الخميس يوم 15 فبراير 2026",
    lectures: "اول محاضرة بداية من يوم 2/8",
    image: "/images/Prep_3_trig_revision_oct.jpg",
  },
  {
    id: 5,
    title: "مراجعة أكتوبر للصف الثاني الثانوي",
    subtitle: "المراحل الثانوية",
    price: "360 جنيه",
    date: "الخميس يوم 15 فبراير 2026",
    lectures: "اول محاضرة بداية من يوم 2/8",
    image: "/images/Sec_2.jpg",
  },
  {
    id: 6,
    title: "مراجعة حساب المثلثات للصف الثالث الإعدادي",
    subtitle: "المراحل الإعدادية",
    price: "360 جنيه",
    date: "الخميس يوم 15 فبراير 2026",
    lectures: "اول محاضرة بداية من يوم 2/8",
    image: "/images/Sec_3.jpg",
  },
];

const PathsSection = () => {
  const [activeTab, setActiveTab] = useState("academic");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      // In RTL, positive scrollLeft is to the left, but behavior can vary by browser.
      // Usually, scrolling "right" means scrollLeft increases (towards 0 if it was negative)
      // or decreases if it was positive. Let's use a simpler approach.
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleArrowClick = (direction: "left" | "right") => {
    if (activeTab === "academic") {
      // If in academic tab, arrows switch to skills
      setActiveTab("skills");
    } else {
      // If in skills tab, arrows scroll the list
      scroll(direction);
    }
  };

  const renderAcademicCards = () => (
    <div className="grid gap-8 md:grid-cols-2 lg:px-12">
      {academicPaths.map((path) => (
        <Card
          key={path.id}
          className="group overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-white transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="relative h-72 overflow-hidden bg-[#3b82f6]">
            <div className="absolute inset-0 bg-math-pattern opacity-10" />
            <div className="absolute inset-0 flex justify-center items-end">
              <img
                src={path.image}
                alt="المهندس"
                className="h-[90%] object-contain"
              />
            </div>
            <div className="absolute right-6 top-6">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none rounded-xl px-6 py-2 text-sm backdrop-blur-md">
                {path.badge}
              </Badge>
            </div>
          </div>
          <CardHeader className="text-right pt-8 pb-4">
            <div className="flex items-center justify-end gap-2 text-[#3b82f6] font-bold mb-3">
              <span className="text-lg font-amin">{path.subtitle}</span>
              <div className="h-6 w-6 bg-transparent border-2 border-[#3b82f6] text-[#3b82f6] flex items-center font-extrabold font-Awesome justify-center text-sm rounded-sm">
                ∑
              </div>
            </div>
            <CardTitle className="text-3xl font-bold font-amin text-[#1a1a1a]">
              {path.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-right">
            <p className="mb-8 text-gray-500 font-medium font-amin text-lg leading-relaxed px-2">
              {path.description}
            </p>
            <div className="flex items-center justify-between border-t border-gray-100 pt-6">
              <Button
                variant="link"
                className="p-0 text-[#3b82f6] font-bold font-amin text-2xl hover:no-underline"
              >
                عرض المنهج
              </Button>
              <span className="text-gray-400 font-medium font-amin text-lg">
                {path.stats}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderSkillCards = () => (
    <div
      ref={scrollRef}
      className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar scroll-smooth px-4 lg:px-12"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {skillPaths.map((path) => (
        <Card
          key={path.id}
          className="group min-w-full md:min-w-[calc(50%-1rem)] snap-start overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-white transition-all duration-300"
        >
          <div className="relative h-auto overflow-hidden">
            <img
              src={path.image}
              alt={path.title}
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader className="text-right pt-6 pb-2">
            <div className="flex items-center justify-end gap-2 text-[#3b82f6] font-bold mb-1">
              <span className="text-base font-amin">{path.subtitle}</span>
              <div className="h-5 w-5 bg-transparent border-2 border-[#3b82f6] text-[#3b82f6] flex items-center font-extrabold font-Awesome justify-center text-xs rounded-sm">
                ∑
              </div>
            </div>
            <CardTitle className="text-2xl font-bold font-amin text-[#1a1a1a]">
              {path.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-right px-6">
            <div className="grid grid-cols-2 gap-y-4 mb-8">
              <div className="text-gray-400 text-sm font-amin order-1">
                الخميس يوم 15 فبراير 2026
              </div>
              <div className="text-[#3b82f6] text-xl font-bold font-amin order-2">
                {path.price}
              </div>
              <div className="text-gray-400 text-sm font-amin order-3">
                الخميس يوم 15 فبراير 2026
              </div>
              <div className="text-gray-400 text-sm font-amin order-4">
                {path.lectures}
              </div>
            </div>

            <div className="flex flex-col gap-3 pb-6">
              <Button className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-2xl py-7 text-xl font-bold font-amin shadow-lg shadow-blue-200">
                الدخول للكورس
              </Button>
              <Button
                variant="outline"
                className="w-full border-[#3b82f6] text-[#3b82f6] hover:bg-blue-50 rounded-2xl py-7 text-xl font-bold font-amin"
              >
                الاشتراك في الكورس !
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <section id="paths" className="bg-[#f8faff] py-20">
      <div className="container relative">
        {/* Navigation Arrows */}
        {activeTab === "skills" && (
          <div className="absolute top-1/3 -left-6 -right-6 flex justify-between items-center z-10 px-4 md:px-0">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-16 w-16 shadow-xl border-none bg-white text-[#3b82f6] hover:bg-blue-50 transition-all"
              onClick={() => handleArrowClick("right")}
            >
              <ChevronRight className="h-8 w-8 text-[#3b82f6]" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-16 w-16 shadow-xl border-none bg-white text-[#3b82f6] hover:bg-blue-50 transition-all"
              onClick={() => handleArrowClick("left")}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          </div>
        )}

        <div className="mb-20">
          {/* Header can be added back if needed, but following image 2's vibe */}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full text-right"
          dir="rtl"
        >
          <TabsList className="hidden">
            <TabsTrigger value="academic">الأكاديمي</TabsTrigger>
            <TabsTrigger value="skills">المهارات</TabsTrigger>
          </TabsList>

          <TabsContent value="academic" className="mt-0 outline-none">
            {renderAcademicCards()}
          </TabsContent>

          <TabsContent value="skills" className="mt-0 outline-none">
            {renderSkillCards()}
          </TabsContent>
        </Tabs>

        {/* Custom Progress-like Tab Switcher */}
        <div className="mt-20 flex justify-center">
          <div className="relative w-full max-w-4xl h-24 bg-white rounded-[3rem] shadow-inner border border-gray-100 overflow-hidden flex cursor-pointer p-2">
            <div
              className={`absolute top-2 bottom-2 w-[48%] bg-[#3b82f6] rounded-[2.5rem] transition-all duration-500 ease-in-out shadow-lg shadow-blue-300 ${
                activeTab === "academic" ? "right-2" : "right-[50%]"
              }`}
            />
            <div
              className="relative z-10 flex-1 flex items-center justify-center text-2xl font-bold font-amin"
              onClick={() => setActiveTab("academic")}
            >
              <span
                className={
                  activeTab === "academic" ? "text-white" : "text-gray-400"
                }
              >
                المراحل الدراسية
              </span>
            </div>
            <div
              className="relative z-10 flex-1 flex items-center justify-center text-2xl font-bold font-amin"
              onClick={() => setActiveTab("skills")}
            >
              <span
                className={
                  activeTab === "skills" ? "text-white" : "text-gray-400"
                }
              >
                المراجعات النهائية
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PathsSection;
