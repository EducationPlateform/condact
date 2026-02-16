import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Plus,
  FileText,
  ClipboardCheck,
  CheckCircle,
  Download,
  Info,
  Upload,
  Clock,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";
import TeacherLayout from "@/components/layouts/TeacherLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/useToast";
import { homeworkService } from "@/services/homeworkService";
import { examService } from "@/services/examService";
import { groupService } from "@/services/groupService";
import { lectureService } from "@/services/lectureService";
import { Group, Lecture, Question as ApiQuestion } from "@/types/api";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Question {
  id: number;
  text: string;
  image?: string;
  options: string[];
  correctAnswer: number;
}

const HomeworkEditor = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const lectureIdParam = searchParams.get("lectureId");
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [activeQuestionForImage, setActiveQuestionForImage] = useState<number | null>(null);

  const [assignmentType, setAssignmentType] = useState<"homework" | "exam">("homework");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    lectureId: lectureIdParam || "",
    maxScore: 10,
    timeLimit: 60,
    dueDate: "",
  });

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    },
  ]);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // setFetching(true); // This variable is not defined, removed.
        // Fetch groups for lecture selection
        const groupsData = await groupService.getAll();
        setGroups(groupsData);

        // If editing existing
        if (id) {
          try {
            // Try fetching as homework first
            const hw = await homeworkService.getById(id);
            setAssignmentType("homework");
            setFormData({
              title: hw.title,
              description: hw.description || "",
              lectureId: hw.lectureId,
              maxScore: Number(hw.maxScore),
              timeLimit: 60,
              dueDate: hw.dueDate ? hw.dueDate.split('T')[0] : "",
            });
            setQuestions(hw.questions.map((q: any, idx: number) => ({
              id: idx + 1,
              text: q.question,
              options: q.options || ["", "", "", ""],
              correctAnswer: q.options?.indexOf(q.correctAnswer) ?? 0,
              image: q.image,
            })));

            // Find group for this lecture
            const lecture = await lectureService.getById(hw.lectureId);
            setSelectedGroupId(typeof lecture.groupId === 'string' ? lecture.groupId : lecture.groupId.id);

          } catch (e) {
            try {
              // Try fetching as exam
              const exam = await examService.getById(id);
              setAssignmentType("exam");
              setFormData({
                title: exam.title,
                description: exam.description || "",
                lectureId: exam.lectureId,
                maxScore: Number(exam.maxScore),
                timeLimit: exam.timeLimit,
                dueDate: exam.dueDate ? exam.dueDate.split('T')[0] : "",
              });
              setQuestions(exam.questions.map((q: any, idx: number) => ({
                id: idx + 1,
                text: q.question,
                options: q.options || ["", "", "", ""],
                correctAnswer: q.options?.indexOf(q.correctAnswer) ?? 0,
                image: q.image,
              })));

              // Find group for this lecture
              const lecture = await lectureService.getById(exam.lectureId);
              setSelectedGroupId(typeof lecture.groupId === 'string' ? lecture.groupId : lecture.groupId.id);
            } catch (err) {
              console.error("Failed to load assignment:", err);
              toast({
                title: "خطأ",
                description: "فشل في تحميل بيانات التكليف",
                variant: "destructive"
              });
            }
          }
        }
      } catch (error) {
        console.error("Initialization failed:", error);
      } finally {
        // setFetching(false); // This variable is not defined, removed.
      }
    };
    init();
  }, [id]);

  useEffect(() => {
    const fetchLectures = async () => {
      if (selectedGroupId) {
        try {
          const lecturesData = await lectureService.getByGroup(selectedGroupId);
          setLectures(lecturesData);
        } catch (error) {
          console.error("Failed to fetch lectures:", error);
        }
      }
    };
    fetchLectures();
  }, [selectedGroupId]);

  const addQuestion = (withImage = false) => {
    const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    const newQuestion: Question = {
      id: newId,
      text: "",
      options: ["إجابة واحد", "إجابة اتنين", "إجابة تلاتة", "إجابة أربعه"],
      correctAnswer: 0,
      ...(withImage ? { image: "" } : {}),
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: number, updates: Partial<Question>) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q)),
    );
  };

  const handleImageUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateQuestion(id, { image: event.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const triggerImageUpload = (id: number) => {
    setActiveQuestionForImage(id);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };


  return (
    <TeacherLayout>
      <div className="mx-auto max-w-5xl space-y-8 font-notoSansArabic">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => activeQuestionForImage && handleImageUpload(activeQuestionForImage, e)}
        />

        {/* Assignment Type Tabs */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            variant={assignmentType === "homework" ? "default" : "outline"}
            className={cn(
              "h-14 gap-2 rounded-2xl px-10 text-lg font-bold shadow-lg transition-all hover:scale-105",
              assignmentType === "homework" ? "bg-primary text-white shadow-primary/20" : "border-gray-200 bg-white text-gray-500 hover:text-primary"
            )}
            onClick={() => setAssignmentType("homework")}
          >
            <FileText className="h-5 w-5" />
            إنشاء واجب
          </Button>
          <Button
            size="lg"
            variant={assignmentType === "exam" ? "default" : "outline"}
            className={cn(
              "h-14 gap-3 rounded-2xl px-10 text-lg font-bold shadow-lg transition-all hover:scale-105",
              assignmentType === "exam" ? "bg-primary text-white shadow-primary/20" : "border-gray-200 bg-white text-gray-500 hover:text-primary"
            )}
            onClick={() => setAssignmentType("exam")}
          >
            <ClipboardCheck className="h-5 w-5" />
            إنشاء امتحان
          </Button>
        </div>

        {/* Page Title & Back Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 font-amin">
              {assignmentType === "exam" ? "انشاء امتحان جديد" : "انشاء واجب جديد"}
            </h1>
            <p className="mt-1 text-gray-500">
              قم بتعبئة التفاصيل وإضافة الأسئلة الاختيارية لطلابك
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="h-11 gap-2 rounded-xl border-gray-200 bg-white px-5 font-bold text-gray-700 hover:bg-gray-50"
          >
            رجوع للحصة
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* General Info Section */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Info className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {assignmentType === "exam" ? "معلومات الامتحان العامة" : "معلومات الواجب العامة"}
            </h2>
          </div>
          <Card className="overflow-hidden rounded-[32px] border-none shadow-xl shadow-gray-200/50">
            <CardContent className="p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-700">عنوان التكليف</Label>
                  <Input
                    placeholder="مثال: واجب الدرس الأول - الجبر"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 px-6 focus:bg-white focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-700">الوصف (اختياري)</Label>
                  <Input
                    placeholder="شرح بسيط لمحتوى الواجب أو التعليمات..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 px-6 focus:bg-white focus:ring-primary/20 transition-all font-inter"
                  />
                </div>
              </div>

              <div className="mt-8 grid gap-8 md:grid-cols-3">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-700">الدرجة القصوى</Label>
                  <Input
                    type="number"
                    value={formData.maxScore}
                    onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) || 0 })}
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 px-6 focus:bg-white focus:ring-primary/20 transition-all font-inter"
                  />
                </div>
                {assignmentType === "exam" && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
                    <Label className="text-sm font-bold text-gray-700">مدة الامتحان (دقائق)</Label>
                    <div className="relative">
                      <Clock className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="number"
                        value={formData.timeLimit}
                        onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) || 0 })}
                        className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 px-6 pr-12 focus:bg-white focus:ring-primary/20 transition-all font-inter"
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-700">تاريخ التسليم النهائي</Label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 px-6 focus:bg-white focus:ring-primary/20 transition-all font-inter"
                  />
                </div>
              </div>

              <div className="mt-8 grid gap-8 md:grid-cols-2">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-700">المجموعة</Label>
                  <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                    <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 px-6 focus:bg-white focus:ring-primary/20 transition-all">
                      <SelectValue placeholder="اختر المجموعة..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      {groups.map((g) => (
                        <SelectItem key={g.id} value={g.id} className="rounded-xl">
                          {g.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-gray-700">المحاضرة المرتبطة</Label>
                  <Select
                    value={formData.lectureId}
                    onValueChange={(val: string) => setFormData({ ...formData, lectureId: val })}
                    disabled={!selectedGroupId}
                  >
                    <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 px-6 focus:bg-white focus:ring-primary/20 transition-all">
                      <SelectValue placeholder="اختر المحاضرة..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      {lectures.map((l) => (
                        <SelectItem key={l.id} value={l.id} className="rounded-xl">
                          {l.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Questions Builder Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">بناء الأسئلة</h2>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-bold">إجمالي الأسئلة :</span>
              <span className="text-primary font-bold">{questions.length}</span>
            </div>
          </div>

          <div className="space-y-12">
            {questions.map((question, index) => (
              <div key={question.id} className="space-y-6 relative group/card">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQuestion(question.id)}
                  className="absolute -left-4 top-0 opacity-0 group-hover/card:opacity-100 transition-opacity text-red-400 hover:text-red-500 hover:bg-red-50 rounded-full h-10 w-10 z-10"
                  title="حذف السؤال"
                >
                  <X className="h-5 w-5" />
                </Button>

                {/* Reset Placeholder Button replaced by simple ID indicator */}
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 text-white font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">السؤال #{index + 1}</h3>
                  </div>
                </div>

                {/* Question Content Cards */}
                <Card className="overflow-hidden rounded-[40px] border-none shadow-2xl shadow-gray-200/30 bg-white">
                  <CardContent className="p-10 space-y-8">
                    {/* Question Text & Image Section */}
                    <div className="flex flex-col gap-6 lg:flex-row">
                      <div className="flex-1 space-y-4">
                        <Label className="text-lg font-bold text-gray-700">نص السؤال</Label>
                        <Input
                          placeholder="اكتب السؤال هنا ..."
                          value={question.text}
                          onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                          className="h-16 border-none bg-gray-50/80 text-xl focus:bg-white transition-all shadow-inner rounded-3xl px-8 focus:ring-2 focus:ring-primary/10"
                        />
                      </div>

                      {/* Image Upload Area */}
                      <div className="lg:w-72">
                        <Label className="text-lg font-bold text-gray-700 mb-4 block">صورة السؤال (اختياري)</Label>
                        {question.image ? (
                          <div className="relative group/img rounded-3xl overflow-hidden aspect-video border-2 border-primary/10 bg-gray-50">
                            <img src={question.image} alt="Question" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="rounded-xl h-9"
                                onClick={() => triggerImageUpload(question.id)}
                              >
                                تغيير
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="rounded-xl h-9"
                                onClick={() => updateQuestion(question.id, { image: undefined })}
                              >
                                حذف
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => triggerImageUpload(question.id)}
                            className="w-full aspect-video rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition-all text-gray-400 hover:text-primary"
                          >
                            <Upload className="h-8 w-8" />
                            <span className="text-xs font-bold uppercase tracking-widest">إضافة صورة</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <Label className="text-lg font-bold text-gray-700">الخيارات المتاحة</Label>
                      <div className="grid gap-6 md:grid-cols-2">
                        {question.options?.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={cn(
                              "relative group/opt h-16 rounded-[24px] border-2 transition-all p-1 flex items-center",
                              question.correctAnswer === optIndex
                                ? "border-emerald-500 bg-emerald-50/30"
                                : "border-gray-50 bg-gray-50/50 hover:border-gray-200 hover:bg-white"
                            )}
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm mr-4 text-gray-400 font-bold group-focus-within/opt:text-primary">
                              {optIndex + 1}
                            </span>
                            <input
                              className="h-full w-full bg-transparent px-4 py-2 text-right text-lg font-bold text-gray-700 outline-none"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(question.options || [])];
                                newOptions[optIndex] = e.target.value;
                                updateQuestion(question.id, { options: newOptions });
                              }}
                            />
                            <div
                              onClick={() => updateQuestion(question.id, { correctAnswer: optIndex })}
                              className={cn(
                                "mx-4 h-6 w-6 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all",
                                question.correctAnswer === optIndex
                                  ? "border-emerald-500 bg-emerald-500 shadow-lg shadow-emerald-200"
                                  : "border-gray-200 bg-white"
                              )}
                            >
                              {question.correctAnswer === optIndex && <CheckCircle className="h-4 w-4 text-white" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* New Dashed Buttons Section */}
          <div className="grid gap-6 mt-16 md:grid-cols-2">
            <button
              onClick={() => addQuestion(false)}
              className="group flex h-40 w-full flex-col items-center justify-center gap-4 rounded-[40px] border-4 border-dashed border-gray-100 bg-gray-50/30 transition-all hover:border-primary/40 hover:bg-white hover:shadow-2xl hover:shadow-primary/5"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-white transition-all group-hover:bg-primary group-hover:rotate-90">
                <Plus className="h-8 w-8" />
              </div>
              <span className="text-xl font-bold text-gray-400 group-hover:text-primary">إضافة سؤال جديد</span>
            </button>

            <button
              onClick={() => addQuestion(true)}
              className="group flex h-40 w-full flex-col items-center justify-center gap-4 rounded-[40px] border-4 border-dashed border-gray-100 bg-gray-50/30 transition-all hover:border-primary/40 hover:bg-white hover:shadow-2xl hover:shadow-primary/5"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-white transition-all group-hover:bg-primary group-hover:scale-110">
                <ImageIcon className="h-8 w-8" />
              </div>
              <span className="text-xl font-bold text-gray-400 group-hover:text-primary">إضافة سؤال بصورة</span>
            </button>
          </div>
        </section>

        {/* Submit Actions */}
        <div className="flex flex-col items-center gap-8 py-16">
          <Button
            size="lg"
            className="h-20 gap-4 rounded-[32px] bg-primary px-20 text-2xl font-bold text-white shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95"
            onClick={() => setShowConfirmDialog(true)}
          >
            <Download className="h-8 w-8" />
            {assignmentType === "exam" ? "حفظ الامتحان النهائي" : "حفظ التكليف النهائي"}
          </Button>
          <p className="text-gray-400 font-bold">سيتم إرسال التنبيه لجميع الطلاب المسجلين فور الحفظ</p>
        </div>
      </div>

      {/* Confirmation Dialog Redesign */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md overflow-hidden rounded-[50px] border-none p-0 shadow-2xl">
          <div className="p-12 text-center space-y-8">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-gray-900">
                تأكيد حفظ التكليف
              </h2>
              <p className="text-lg text-gray-500 font-bold">
                أنت على وشك الانتهاء، راجع عدد الأسئلة قبل التأكيد
              </p>
            </div>

            <div className="mx-auto flex items-center justify-center gap-10 rounded-[32px] border-2 border-primary/5 bg-primary/5 p-8">
              <div className="text-center">
                <span className="block text-4xl font-black text-primary">{questions.length}</span>
                <span className="text-sm font-bold text-gray-400 uppercase tracking-tighter">إجمالي الأسئلة</span>
              </div>
              <div className="h-12 w-px bg-primary/10" />
              <div className="text-center">
                <span className="block text-4xl font-black text-primary">{questions.filter(q => q.image).length}</span>
                <span className="text-sm font-bold text-gray-400 uppercase tracking-tighter">أسئلة بصور</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <Button
                className="h-16 gap-4 rounded-3xl bg-emerald-500 text-xl font-bold text-white shadow-xl shadow-emerald-200 hover:bg-emerald-600 transition-all"
                disabled={loading}
                onClick={async () => {
                  try {
                    setLoading(true);
                    const apiQuestions: ApiQuestion[] = questions.map(q => ({
                      question: q.text,
                      type: 'multiple-choice',
                      options: q.options,
                      correctAnswer: q.options[q.correctAnswer],
                      image: q.image,
                      points: 1, // Default points
                    }));

                    if (assignmentType === "homework") {
                      if (id) {
                        await homeworkService.update(id, {
                          ...formData,
                          questions: apiQuestions as any
                        });
                      } else {
                        await homeworkService.create({
                          ...formData,
                          questions: apiQuestions as any
                        });
                      }
                    } else {
                      if (id) {
                        await examService.update(id, {
                          ...formData,
                          questions: apiQuestions as any,
                          isActive: true,
                          dueDate: formData.dueDate
                        });
                      } else {
                        await examService.create({
                          ...formData,
                          questions: apiQuestions as any,
                          isActive: true,
                          dueDate: formData.dueDate
                        });
                      }
                    }

                    toast({
                      title: "تم الحفظ بنجاح",
                      description: "تم حفظ التكليف وإرسال التنبيهات للطلاب",
                    });

                    setShowConfirmDialog(false);
                    navigate(-1);
                  } catch (error: any) {
                    console.error("Failed to save:", error);
                    toast({
                      title: "خطأ في الحفظ",
                      description: error.message || "حدث خطأ أثناء محاولة حفظ التكليف",
                      variant: "destructive"
                    });
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {loading ? "جاري الحفظ..." : "تأكيد وحفظ التكليف"}
                <ArrowRight className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                className="h-14 rounded-3xl text-gray-400 hover:text-gray-600 font-bold"
                onClick={() => setShowConfirmDialog(false)}
              >
                إلغاء والعودة للتعديل
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TeacherLayout>
  );
};

export default HomeworkEditor;
