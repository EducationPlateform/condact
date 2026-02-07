import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Plus,
    Search,
    MoreVertical,
    Edit2,
    Trash2,
    Clock,
    FileText,
    Layers,
    GraduationCap,
    ChevronLeft,
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
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import { homeworkService } from "@/services/homeworkService";
import { examService } from "@/services/examService";
import { groupService } from "@/services/groupService";
import { lectureService } from "@/services/lectureService";
import { Group, Homework as ApiHomework, Exam as ApiExam, Lecture } from "@/types/api";

// Mock data based on the structure we saw in Lectures
interface Assignment {
    id: string;
    title: string;
    description?: string;
    groupName: string;
    questionCount: number;
    isPublished: boolean;
    createdAt: string;
    type: "homework" | "exam";
    lectureId: string;
    grade: string;
}

const TeacherHomeworks: React.FC = () => {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const { toast } = useToast();

    const [selectedGrade, setSelectedGrade] = useState("all");

    const grades = [
        { id: "all", name: "كل الصفوف" },
        { id: "1h", name: "الصف الأول الثانوي" },
        { id: "2h", name: "الصف الثاني الثانوي" },
        { id: "3h", name: "الصف الثالث الثانوي" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch groups, assignments, and lectures in parallel
                const [groups, homeworks, exams, lectures] = await Promise.all([
                    groupService.getAll(),
                    homeworkService.getAll(),
                    examService.getAll(),
                    lectureService.getAll()
                ]);

                const groupMap = new Map(groups.map((g: Group) => [g.id, g.name]));
                const lectureMap = new Map(lectures.map((l: Lecture) => [l.id, l]));

                const getGroupName = (lectureId: string) => {
                    const lecture = lectureMap.get(lectureId);
                    if (!lecture) return "مجموعة غير معروفة";
                    const groupId = typeof lecture.groupId === 'string' ? lecture.groupId : (lecture.groupId as any).id;
                    return groupMap.get(groupId) || "مجموعة غير معروفة";
                };

                const mappedExams: Assignment[] = exams.map((e: ApiExam) => ({
                    id: e.id,
                    title: e.title,
                    description: e.description,
                    groupName: getGroupName(e.lectureId),
                    questionCount: e.questions.length,
                    isPublished: true,
                    createdAt: e.createdAt || new Date().toISOString(),
                    type: "exam",
                    lectureId: e.lectureId,
                    grade: lectureMap.get(e.lectureId)?.grade || "all"
                }));

                const finalHomeworks: Assignment[] = homeworks.map((h: ApiHomework) => ({
                    id: h.id,
                    title: h.title,
                    description: h.description,
                    groupName: getGroupName(h.lectureId),
                    questionCount: h.questions.length,
                    isPublished: true,
                    createdAt: h.createdAt || new Date().toISOString(),
                    type: "homework",
                    lectureId: h.lectureId,
                    grade: lectureMap.get(h.lectureId)?.grade || "all"
                }));

                // Combine and sort by date
                const combined = [...finalHomeworks, ...mappedExams].sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );

                setAssignments(combined);
            } catch (error) {
                console.error("Failed to fetch assignments:", error);
                toast({
                    title: "خطأ",
                    description: "فشل في تحميل التكليفات",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id: string, type: "homework" | "exam") => {
        if (window.confirm("هل أنت متأكد من حذف هذا التكليف؟")) {
            try {
                if (type === "homework") {
                    await homeworkService.delete(id);
                } else {
                    await examService.delete(id);
                }
                setAssignments(assignments.filter((a) => a.id !== id));
                toast({
                    title: "تم الحذف",
                    description: "تم حذف التكليف بنجاح",
                });
            } catch (error) {
                toast({
                    title: "خطأ في الحذف",
                    description: "فشل في حذف التكليف. يرجى المحاولة مرة أخرى.",
                    variant: "destructive"
                });
            }
        }
    };

    const filteredAssignments = assignments.filter((a) => {
        const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGrade = selectedGrade === "all" || a.grade === selectedGrade;
        return matchesSearch && matchesGrade;
    });

    return (
        <TeacherLayout>
            <div className="flex flex-col gap-8 lg:flex-row font-notoSansArabic">
                {/* Sidebar Filter */}
                <aside className="w-full shrink-0 space-y-4 lg:w-64">
                    <div className="flex items-center gap-2 px-2 text-primary">
                        <Layers className="h-5 w-5" />
                        <h2 className="text-lg font-bold">المراحل الدراسية</h2>
                    </div>
                    <div className="flex flex-col gap-2">
                        {grades.map((grade) => (
                            <Button
                                key={grade.id}
                                variant="ghost"
                                onClick={() => setSelectedGrade(grade.id)}
                                className={cn(
                                    "h-12 justify-start gap-3 rounded-2xl px-4 font-bold transition-all",
                                    selectedGrade === grade.id
                                        ? "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary"
                                        : "text-gray-500 hover:bg-white hover:text-primary"
                                )}
                            >
                                <GraduationCap className={cn("h-5 w-5", selectedGrade === grade.id ? "text-white" : "text-gray-400")} />
                                {grade.name}
                            </Button>
                        ))}
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 space-y-8">
                    {/* Header Section */}
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 font-amin">
                                إدارة التكليفات والواجبات
                            </h1>
                            <p className="text-gray-500">
                                تنظيم ومتابعة الواجبات والاختبارات المنزلية لطلابك
                            </p>
                        </div>
                        <Button
                            onClick={() => navigate("/teacher/homework/new")}
                            className="h-12 gap-2 rounded-2xl bg-primary px-8 text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105"
                        >
                            <Plus className="h-5 w-5" />
                            إضافة تكليف جديد
                        </Button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="البحث عن تكليف بالاسم..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-16 rounded-3xl border-none bg-white pr-14 text-lg shadow-sm focus-visible:ring-primary/20"
                        />
                    </div>

                    {/* Content Grid */}
                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        </div>
                    ) : filteredAssignments.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2">
                            {filteredAssignments.map((assignment) => (
                                <div
                                    key={assignment.id}
                                    className="group relative flex flex-col rounded-[32px] border border-white bg-white/70 p-7 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:shadow-2xl"
                                >
                                    {/* Card Header: Badges & Menu */}
                                    <div className="mb-6 flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <Badge
                                                className={cn(
                                                    "rounded-lg px-3 py-1 text-xs font-bold border-none",
                                                    assignment.type === "exam"
                                                        ? "bg-purple-50 text-purple-600"
                                                        : "bg-emerald-50 text-emerald-600"
                                                )}
                                            >
                                                {assignment.type === "exam" ? "امتحان" : "واجب"}
                                            </Badge>
                                            <Badge className="bg-blue-50 text-blue-600 rounded-lg px-3 py-1 text-xs font-bold border-none">
                                                {assignment.groupName}
                                            </Badge>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreVertical className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 font-notoSansArabic">
                                                <DropdownMenuItem onClick={() => navigate(`/teacher/${assignment.type === 'exam' ? 'exams' : 'homework'}/${assignment.id}/edit`)} className="rounded-xl gap-3 h-11 px-4 font-bold text-gray-600">
                                                    <Edit2 className="h-4 w-4" />
                                                    تعديل التكليف
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(assignment.id, assignment.type)} className="rounded-xl gap-3 h-11 px-4 font-bold text-red-600 focus:text-red-700">
                                                    <Trash2 className="h-4 w-4" />
                                                    حذف التكليف
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {/* Card Main Info */}
                                    <div className="mb-8 flex-1">
                                        <div className={cn(
                                            "mb-5 flex h-16 w-16 items-center justify-center rounded-[20px]",
                                            assignment.type === 'exam' ? "bg-purple-50 text-purple-600" : "bg-primary/5 text-primary"
                                        )}>
                                            {assignment.type === 'exam' ? <Clock className="h-8 w-8" /> : <FileText className="h-8 w-8" />}
                                        </div>
                                        <h3 className="mb-2 text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                                            {assignment.title}
                                        </h3>
                                        <p className="text-gray-500 line-clamp-2 leading-relaxed">
                                            {assignment.description}
                                        </p>
                                    </div>

                                    {/* Question Counts & Footer */}
                                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-6">
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                                                <Layers className="h-3.5 w-3.5" />
                                                {assignment.questionCount} سؤال
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            className="h-10 rounded-xl px-4 font-black text-primary hover:bg-primary/5"
                                            onClick={() => navigate(`/teacher/${assignment.type === 'exam' ? 'exams' : 'homework'}/${assignment.id}/edit`)}
                                        >
                                            عرض التفاصيل
                                            <ChevronLeft className="mr-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-[48px] border-2 border-dashed border-gray-200 bg-gray-50/50 p-20 text-center">
                            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl shadow-gray-200/50">
                                <FileText className="h-10 w-10 text-gray-300" />
                            </div>
                            <h3 className="mb-2 text-2xl font-bold text-gray-900">لا توجد تكليفات</h3>
                            <p className="mb-10 text-gray-500 max-w-sm">لم تقم بإضافة أي واجبات أو تكليفات منزلية لهذه المجموعة بعد</p>
                            <Button
                                onClick={() => navigate("/teacher/homework/new")}
                                className="h-14 gap-2 rounded-2xl bg-primary px-10 text-lg font-bold shadow-xl shadow-primary/20"
                            >
                                <Plus className="h-5 w-5" />
                                ابدأ بإضافة أول تكليف
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </TeacherLayout>
    );
};

export default TeacherHomeworks;
