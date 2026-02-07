import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Clock,
  CheckCircle,
  Video,
  FileText,
  Calendar,
} from "lucide-react";
import TeacherLayout from "@/components/layouts/TeacherLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { lectureService } from "@/services/lectureService";
import { groupService } from "@/services/groupService";
import { Lecture } from "@/types/api";
import { useToast } from "@/hooks/useToast";

const TeacherLectures: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupsData = await groupService.getAll();
        const allLectures: Lecture[] = [];
        for (const group of groupsData) {
          try {
            const groupLectures = await lectureService.getByGroup(group.id);
            allLectures.push(...groupLectures);
          } catch (err) {
            // Skip
          }
        }
        setLectures(allLectures);
      } catch (error) {
        console.error("Failed to fetch lectures:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذه المحاضرة؟")) {
      try {
        await lectureService.delete(id);
        setLectures(lectures.filter((l) => l.id !== id));
        toast({
          title: "تم الحذف",
          description: "تم حذف المحاضرة بنجاح",
        });
      } catch (error) {
        console.error("Failed to delete lecture:", error);
        toast({
          title: "خطأ",
          description: "فشل حذف المحاضرة",
          variant: "destructive",
        });
      }
    }
  };

  const filteredLectures = lectures.filter((lecture) =>
    lecture.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TeacherLayout>
      <div className="flex flex-col gap-8 font-notoSansArabic">
        {/* Header Section */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-2 text-3xl font-extrabold text-gray-900 font-amin">
              إدارة المحاضرات
            </h1>
            <p className="text-gray-500">
              شاهد ونظم جميع حصصك التعليمية ومحاضراتك في مكان واحد
            </p>
          </div>
          <Button
            onClick={() => navigate("/teacher/lectures/new")}
            className="h-12 gap-2 rounded-xl px-6 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            إضافة حصة جديدة
          </Button>
        </div>

        {/* Stats & Search */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="البحث عن محاضرة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 rounded-2xl border-none bg-white pr-12 text-lg shadow-sm focus-visible:ring-primary/20"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="h-10 rounded-xl bg-white px-4 text-sm font-medium text-gray-600 shadow-sm border-none">
              إجمالي المحاضرات: {lectures.length}
            </Badge>
          </div>
        </div>

        {/* Lectures Grid */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-sm"></div>
          </div>
        ) : filteredLectures.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredLectures.map((lecture) => (
              <div
                key={lecture.id}
                className="group relative flex flex-col rounded-[32px] border border-white bg-white/70 p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:shadow-xl"
              >
                {/* Status Badge */}
                <div className="mb-4 flex items-center justify-between">
                  <Badge
                    variant={lecture.isPublished ? "default" : "secondary"}
                    className={`rounded-lg px-2 py-0.5 text-xs font-bold ${lecture.isPublished
                      ? "bg-emerald-50 text-emerald-600 border-none"
                      : "bg-orange-50 text-orange-600 border-none"
                      }`}
                  >
                    {lecture.isPublished ? (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        منشورة
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        مسودة
                      </div>
                    )}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-400 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-none shadow-xl">
                      <DropdownMenuItem
                        onClick={() => navigate(`/teacher/lectures/${lecture.id}/edit`)}
                        className="gap-2 text-gray-600"
                      >
                        <Edit2 className="h-4 w-4" />
                        تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(lecture.id)}
                        className="gap-2 text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Content */}
                <div className="mb-6 flex-1">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-primary">
                    <Video className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900 line-clamp-1">
                    {lecture.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {lecture.description || "لا يوجد وصف لهذه المحاضرة"}
                  </p>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100/50">
                  <div className="flex items-center gap-2 text-xs font-bold font-inter text-gray-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {lecture.scheduledDate
                      ? new Date(lecture.scheduledDate).toLocaleDateString("ar-EG", {
                        day: "numeric",
                        month: "short",
                      })
                      : "غير مجدول"}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/teacher/lectures/${lecture.id}/edit`)}
                    className="h-8 rounded-lg text-primary hover:bg-primary/5 font-bold"
                  >
                    عرض التفاصيل
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-gray-200 bg-gray-50/50 p-20 text-center">
            <div className="mb-6 rounded-full bg-gray-100 p-6">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">لا توجد محاضرات</h3>
            <p className="mb-8 text-gray-500">ابدأ بإنشاء أول محاضرة تعليمية لطلابك الآن</p>
            <Button
              onClick={() => navigate("/teacher/lectures/new")}
              className="h-12 gap-2 rounded-xl px-8"
            >
              <Plus className="h-5 w-5" />
              إضافة أول حصة
            </Button>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
};

export default TeacherLectures;
