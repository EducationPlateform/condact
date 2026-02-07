import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Video,
  Radio,
  FileQuestion,
  FileText,
  UploadCloud,
  Eye,
  Calendar,
  Clock,
  Info,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import TeacherLayout from "@/components/layouts/TeacherLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { lectureService } from "@/services/lectureService";
import { groupService } from "@/services/groupService";
import { Group } from "@/types/api";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

import { videoService } from "@/services/videoService";

const LectureEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [existingVideo, setExistingVideo] = useState<{ id: string; name: string } | null>(null);

  const [formData, setFormData] = useState({
    groupId: "",
    title: "",
    description: "",
    scheduledDate: "",
    startTime: "",
    duration: 45,
    isPublished: false,
    order: 0,
    contentType: "video", // video, live, quiz, homework
    grade: "", // first_middle, second_middle, etc.
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupsData = await groupService.getAll();
        setGroups(groupsData);

        if (id) {
          const lecture = await lectureService.getById(id);
          const date = lecture.scheduledDate ? new Date(lecture.scheduledDate) : null;

          setFormData({
            ...formData,
            groupId: typeof lecture.groupId === "object" ? lecture.groupId.id : lecture.groupId,
            title: lecture.title,
            description: lecture.description || "",
            scheduledDate: date ? date.toISOString().split("T")[0] : "",
            startTime: date ? date.toTimeString().split(" ")[0].slice(0, 5) : "",
            grade: lecture.grade || "",
            isPublished: lecture.isPublished,
            order: lecture.order || 0,
          });

          if (lecture.videoId) {
            setExistingVideo({
              id: typeof lecture.videoId === "object" ? lecture.videoId.id : lecture.videoId,
              name: typeof lecture.videoId === "object" ? lecture.videoId.fileName : "فيديو مرفوع مسبقاً",
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!formData.groupId) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى اختيار المجموعة التعليمية أولاً",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى إدخال عنوان الحصة",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let lectureId = id;
      // Combine date and time for backend
      const combinedScheduledDate = formData.scheduledDate && formData.startTime
        ? `${formData.scheduledDate}T${formData.startTime}:00`
        : formData.scheduledDate || undefined;

      const payload = {
        ...formData,
        scheduledDate: combinedScheduledDate
      };

      if (id) {
        await lectureService.update(id, payload);
        toast({ title: "تم التحديث", description: "تم تحديث بيانات المحاضرة بنجاح" });
      } else {
        const newLecture = await lectureService.create(payload);
        lectureId = newLecture.id;
        toast({ title: "تم الإنشاء", description: "تم إنشاء المحاضرة بنجاح" });
      }

      // Handle video upload if provided
      if (file && lectureId) {
        toast({ title: "جاري الرفع", description: "بدأ رفع الفيديو، يرجى الانتظار..." });
        await videoService.upload(lectureId, file);
        toast({ title: "اكتمل الرفع", description: "تم رفع الفيديو بنجاح" });
      }

      navigate("/teacher/lectures");
    } catch (error) {
      console.error("Failed to save lecture:", error);
      toast({
        title: "خطأ",
        description: "فشل حفظ المحاضرة أو رفع الفيديو. قد يكون حجم الفيديو كبيراً جداً أو هناك مشكلة في الاتصال.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const contentTypes = [
    { id: "video", label: "فيديو", icon: Video },
    { id: "live", label: "بث مباشر", icon: Radio },
    { id: "quiz", label: "اختبار", icon: FileQuestion },
    { id: "homework", label: "واجب", icon: FileText },
  ];

  const middleGrades = [
    { id: "1m", label: "أولى" },
    { id: "2m", label: "ثانية" },
    { id: "3m", label: "ثالثة" },
  ];

  const highGrades = [
    { id: "1h", label: "أولى" },
    { id: "2h", label: "ثانية" },
    { id: "3h", label: "ثالثة" },
  ];

  return (
    <TeacherLayout>
      <div className="mx-auto max-w-5xl font-notoSansArabic">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-extrabold text-gray-900 font-amin">
              إضافة حصة جديدة
            </h1>
            <p className="text-gray-500">
              قم بتعبئة البيانات أدناه لإنشاء حصة تعليمية جديدة لطلابك
            </p>
          </div>
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-full border-gray-200 bg-white px-4 text-sm font-bold text-gray-600 shadow-sm"
          >
            <Eye className="h-4 w-4" />
            عرض المسودة
          </Button>
        </div>

        {/* Main Form Card */}
        <div className="space-y-8 rounded-[40px] border border-white bg-white/70 p-10 shadow-xl backdrop-blur-md">
          {/* Section 1: Basic Info */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <h2 className="text-xl font-bold text-gray-900">المعلومات الأساسية</h2>
            </div>
            <div className="grid gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">عنوان الحصة <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="مثال: مقدمة في الجبر الخطي"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 px-6 text-lg focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700">المجموعة التعليمية <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.groupId}
                    onValueChange={(value: string) => setFormData({ ...formData, groupId: value })}
                  >
                    <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 px-6 text-lg">
                      <SelectValue placeholder="اختر المجموعة..." />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">وصف الحصة</Label>
                <Textarea
                  placeholder="اشرح باختصار ما سيتعلمه الطلاب في هذه الحصة..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[120px] rounded-2xl border-gray-100 bg-gray-50/50 p-6 text-lg focus:bg-white transition-all"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Classification */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <h2 className="text-xl font-bold text-gray-900">التصنيف</h2>
            </div>
            <div className="grid gap-10 md:grid-cols-2">
              <div className="space-y-4">
                <Label className="text-sm font-bold text-gray-400 block text-center">المرحلة الاعدادية</Label>
                <div className="flex justify-between rounded-2xl bg-gray-50/50 p-1">
                  {middleGrades.map((grade) => (
                    <button
                      key={grade.id}
                      onClick={() => setFormData({ ...formData, grade: grade.id })}
                      className={cn(
                        "flex-1 rounded-xl py-3 text-sm font-bold transition-all",
                        formData.grade === grade.id
                          ? "bg-white text-primary shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      {grade.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-sm font-bold text-gray-400 block text-center">المرحلة الثانوية</Label>
                <div className="flex justify-between rounded-2xl bg-gray-50/50 p-1">
                  {highGrades.map((grade) => (
                    <button
                      key={grade.id}
                      onClick={() => setFormData({ ...formData, grade: grade.id })}
                      className={cn(
                        "flex-1 rounded-xl py-3 text-sm font-bold transition-all",
                        formData.grade === grade.id
                          ? "bg-white text-primary shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      {grade.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Content Type */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <h2 className="text-xl font-bold text-gray-900">نوع المحتوى</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {contentTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.contentType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setFormData({ ...formData, contentType: type.id })}
                    className={cn(
                      "flex flex-col items-center justify-center gap-3 rounded-[24px] border-2 py-6 transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-100 bg-gray-50/50 text-gray-400 hover:bg-white"
                    )}
                  >
                    <div className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full transition-all",
                      isSelected ? "bg-primary text-white" : "bg-white text-gray-300 shadow-sm"
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-bold">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Video Upload Area */}
          {formData.contentType === "video" && (
            <div className={cn(
              "group relative flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed py-12 transition-all",
              (file || existingVideo)
                ? "border-emerald-500 bg-emerald-50/30"
                : "border-primary/20 bg-primary/5 hover:border-primary/40 hover:bg-primary/10"
            )}>
              <div className={cn(
                "mb-4 flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-transform group-hover:scale-110",
                (file || existingVideo) ? "bg-emerald-500 text-white" : "bg-white text-primary shadow-primary/10"
              )}>
                {(file || existingVideo) ? <CheckCircle className="h-8 w-8" /> : <UploadCloud className="h-8 w-8" />}
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 mx-4 text-center">
                {file ? file.name : (existingVideo ? existingVideo.name : "اسحب الفيديو هنا أو اضغط للرفع")}
              </h3>
              <p className={cn(
                "text-xs font-bold",
                (file || existingVideo) ? "text-emerald-600" : "text-primary/60"
              )}>
                {file
                  ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                  : (existingVideo ? "فيديو مرفوع مسبقاً - انقر لتغييره" : "بدعم ملفات MP4, MOV بحد أقصى 500 ميجابايت")}
              </p>
              <input
                type="file"
                className="absolute inset-0 cursor-pointer opacity-0"
                accept="video/*"
                onChange={handleFileChange}
              />
            </div>
          )}

          {/* Section 4: Scheduling */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <h2 className="text-xl font-bold text-gray-900">الجدولة والتوقيت</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">مدة الحصة (بالدقائق)</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="مثال: 45"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 px-6 pr-18 text-lg"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold text-primary">دقيقة</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">التاريخ</Label>
                <div className="relative">
                  <Calendar className="absolute right-6 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
                  <Input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 pr-14 pl-6 text-lg [color-scheme:light]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">وقت البدء</Label>
                <div className="relative">
                  <Clock className="absolute right-6 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 pr-14 pl-6 text-lg [color-scheme:light]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Footer Controls */}
          <div className="flex flex-col items-center justify-between gap-6 pt-10 border-t border-gray-100 md:flex-row">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-700">حالة النشر:</span>
              <div className="flex items-center gap-3">
                <span className={cn("text-xs font-bold", !formData.isPublished ? "text-orange-500" : "text-gray-400")}>مسودة</span>
                <Switch
                  checked={formData.isPublished}
                  onCheckedChange={(checked: boolean) => setFormData({ ...formData, isPublished: checked })}
                />
                <span className={cn("text-xs font-bold", formData.isPublished ? "text-emerald-500" : "text-gray-400")}>منشورة</span>
              </div>
            </div>
            <div className="flex w-full items-center gap-4 md:w-auto">
              <Button
                variant="ghost"
                onClick={() => navigate("/teacher/lectures")}
                className="h-14 rounded-2xl px-12 text-lg font-bold text-gray-500 hover:bg-gray-100"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="h-14 rounded-2xl px-12 text-lg font-bold shadow-lg shadow-primary/20"
              >
                {loading ? "جاري الحفظ..." : "حفظ الحصة"}
              </Button>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="flex items-start gap-4 rounded-[32px] bg-blue-50/50 p-6 border border-blue-50">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-blue-500 shadow-sm">
              <Info className="h-6 w-6" />
            </div>
            <div>
              <h4 className="mb-1 text-sm font-extrabold text-blue-900 font-inter">نصيحة سريعة</h4>
              <p className="text-xs font-bold text-blue-700/70 leading-relaxed">إضافة وصف تفصيلي يساعد الطلاب على التحضير بشكل أفضل للحصة وزيادة التفاعل.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-[32px] bg-emerald-50/50 p-6 border border-emerald-50">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-emerald-500 shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="mb-1 text-sm font-extrabold text-emerald-900 font-inter">الخصوصية والأمان</h4>
              <p className="text-xs font-bold text-emerald-700/70 leading-relaxed">يتم تشفير جميع الفيديوهات المرفوعة ولا يمكن الوصول إليها إلا من قبل الطلاب المسجلين.</p>
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default LectureEditor;
