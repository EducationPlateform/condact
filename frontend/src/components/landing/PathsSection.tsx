import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

const paths = [
  {
    id: 1,
    title: "المراحل الاعدادية",
    description: "\"المرحلة الاعدادية.. الأساس الحقيقي للرياضيات، افهم صح دلوقتي عشان ترتاح بعدين.\"",
    subtitle: "جميع المراحل الاعدادية",
    stats: "٣٠ وحدة دراسية",
    badge: "المرحلة الاعدادية",
  },
  {
    id: 2,
    title: "المراحل الثانوية",
    description: "ثانوي مش حفظ قوانين.. ثانوي فهم وتحليل وطريقة تفكير.",
    subtitle: "جميع المراحل الثانوية",
    stats: "٣٠ وحدة دراسية",
    badge: "المرحلة الثانوية",
  },
];

const PathsSection = () => {
  return (
    <section id="paths" className="bg-white py-16">
      <div className="container">
        <div className="mb-12 flex items-end justify-between border-r-4 border-[#003366] pr-4">
          <div>
            <h2 className="text-3xl font-bold text-[#003366] font-heading">
              مسارات التميز الأكاديمي
            </h2>
            <p className="text-gray-500">
              مناهج متكاملة من المرحلة الاعدادية الى الثانوية
            </p>
          </div>
          <Button variant="link" className="text-[#3b82f6] font-bold">
            عرض كافة المستويات
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:px-12">
          {paths.map((path) => (
            <Card
              key={path.id}
              className="group overflow-hidden border-none shadow-xl rounded-2xl"
            >
              <div className="relative h-64 overflow-hidden bg-[#3b82f6]">
                <div className="absolute inset-0 bg-math-pattern opacity-10" />
                
                {/* Engineer image in path card */}
                <div className="absolute inset-0 flex justify-center items-end">
                  <img src="/engineer.png" alt="المهندس" className="h-full object-contain" />
                </div>
                
                <div className="absolute right-4 top-4">
                  <Badge className="bg-[#003366] text-white rounded-md px-4 py-1">
                    {path.badge}
                  </Badge>
                </div>
              </div>
              <CardHeader className="text-right">
                <div className="flex items-center gap-2 text-xs text-primary font-bold mb-1">
                  <div className="h-4 w-4 bg-primary text-white flex items-center justify-center text-[10px]">∑</div>
                  {path.subtitle}
                </div>
                <CardTitle className="text-2xl font-bold text-[#003366]">{path.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-right">
                <p className="mb-6 text-gray-600 font-medium">
                  {path.description}
                </p>
                <div className="flex items-center justify-between border-t pt-4">
                  <span className="text-xs text-gray-400 font-medium">{path.stats}</span>
                  <Button variant="link" className="p-0 text-[#003366] font-extrabold text-lg">
                    عرض المنهج
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PathsSection;