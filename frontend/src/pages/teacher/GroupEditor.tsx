import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Info,
    Save,
    X,
    Search,
    Plus,
    Users,
    XCircle
} from "lucide-react";
import TeacherLayout from "@/components/layouts/TeacherLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { groupService } from "@/services/groupService";
import { userService } from "@/services/userService";
import { useToast } from "@/hooks/useToast";
import { User } from "@/types/api";

const GroupEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [allStudents, setAllStudents] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudents, setSelectedStudents] = useState<User[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        schedule: [] as string[],
        day: "",
        time: "",
        grade: "",
    });

    // Helper to convert 24h to 12h for display
    const formatTo12Hour = (time24: string): string => {
        if (!time24) return "";
        const [hours, minutes] = time24.split(":").map(Number);
        const period = hours >= 12 ? "م" : "ص";
        const h12 = hours % 12 || 12;
        return `${h12}:${minutes.toString().padStart(2, "0")} ${period}`;
    };

    // Helper to convert 12h back to 24h for input value
    const formatTo24Hour = (time12: string): string => {
        if (!time12) return "";
        const parts = time12.split(" ");
        if (parts.length !== 2) return "";
        const [time, period] = parts;
        let [hours, minutes] = time.split(":").map(Number);
        if (period === "م" && hours < 12) hours += 12;
        if (period === "ص" && hours === 12) hours = 0;
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        if (formData.day && formData.time && formData.grade) {
            setFormData(prev => ({
                ...prev,
                name: `${formData.day} - ${formatTo12Hour(formData.time)} - ${formData.grade}`
            }));
        }
    }, [formData.day, formData.time, formData.grade]);

    useEffect(() => {
        const loadData = async () => {
            setFetching(true);
            try {
                // Fetch all students
                const students = await userService.getStudents();
                setAllStudents(students);

                if (id) {
                    const group = await groupService.getById(id);
                    // Try to parse components from name if it follows the pattern
                    // Pattern: "السبت - 2:30 م - الصف الأول الثانوي"
                    let day = "", time = "", grade = "";
                    if (group.name.includes(" - ")) {
                        const parts = group.name.split(" - ");
                        if (parts.length === 3) {
                            day = parts[0];
                            time = formatTo24Hour(parts[1]);
                            grade = parts[2];
                        }
                    }

                    setFormData({
                        name: group.name,
                        description: group.description || "",
                        schedule: group.schedule || [],
                        day,
                        time,
                        grade,
                    });
                    setSelectedStudents(group.students || []);
                }
            } catch (error) {
                console.error("Failed to load data:", error);
                toast({
                    title: "خطأ",
                    description: "فشل تحميل البيانات اللازمة",
                    variant: "destructive",
                });
                if (id) navigate("/teacher/groups");
            } finally {
                setFetching(false);
            }
        };
        loadData();
    }, [id, navigate, toast]);

    const toggleStudent = (student: User) => {
        const isSelected = selectedStudents.some(s => s.id === student.id);
        if (isSelected) {
            setSelectedStudents(selectedStudents.filter(s => s.id !== student.id));
        } else {
            setSelectedStudents([...selectedStudents, student]);
        }
    };

    const handleSubmit = async () => {
        if (!formData.name) {
            toast({
                title: "خطأ في البيانات",
                description: "يرجى إدخال اسم المجموعة",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                schedule: formData.schedule,
                studentIds: selectedStudents.map(s => s.id)
            };

            if (id) {
                await groupService.update(id, payload);
                toast({ title: "تم التحديث", description: "تم تحديث بيانات المجموعة والطلاب بنجاح" });
            } else {
                await groupService.create(payload);
                toast({ title: "تم الإنشاء", description: "تم إنشاء المجموعة وإضافة الطلاب بنجاح" });
            }
            navigate("/teacher/groups");
        } catch (error) {
            console.error("Failed to save group:", error);
            toast({
                title: "خطأ",
                description: "فشل حفظ بيانات المجموعة",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = allStudents.filter(s =>
        (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
        !selectedStudents.some(sel => sel.id === s.id)
    );

    const days = [
        "السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"
    ];

    const grades = [
        "الصف الأول الثانوي",
        "الصف الثاني الثانوي",
        "الصف الثالث الثانوي",
        "الصف الأول الإعدادي",
        "الصف الثاني الإعدادي",
        "الصف الثالث الإعدادي"
    ];

    if (fetching) {
        return (
            <TeacherLayout>
                <div className="flex h-64 items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            </TeacherLayout>
        );
    }

    return (
        <TeacherLayout>
            <div className="mx-auto max-w-5xl font-notoSansArabic">
                {/* Header */}
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="mb-2 text-3xl font-extrabold text-gray-900 font-amin">
                            {id ? "تعديل المجموعة" : "إنشاء مجموعة جديدة"}
                        </h1>
                        <p className="text-gray-500">
                            {id ? "قم بتحديث بيانات المجموعة، جدول المواعيد، وقائمة الطلاب" : "قم بتعبئة البيانات أدناه وإضافة الطلاب لبناء مجموعتك التعليمية الجديدة"}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => navigate("/teacher/groups")}
                        className="h-12 gap-2 rounded-2xl border-gray-200 bg-white px-6 text-sm font-bold text-gray-600 shadow-sm transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-100"
                    >
                        <X className="h-4 w-4" />
                        إلغاء والعودة
                    </Button>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left Column: Form */}
                    <div className="space-y-8 lg:col-span-2">
                        <div className="rounded-[40px] border border-white bg-white/70 p-10 shadow-xl backdrop-blur-md">
                            <section className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    <h2 className="text-xl font-bold text-gray-900">المعلومات الأساسية</h2>
                                </div>
                                <div className="grid gap-6">
                                    <div className="grid gap-6 md:grid-cols-3">
                                        <div className="space-y-3">
                                            <Label className="text-sm font-black text-gray-700">اليوم <span className="text-red-500">*</span></Label>
                                            <Select
                                                value={formData.day}
                                                onValueChange={(val: string) => setFormData({ ...formData, day: val })}
                                            >
                                                <SelectTrigger className="h-16 rounded-2xl border-gray-100 bg-gray-50/50 px-6 text-lg focus:bg-white transition-all shadow-inner">
                                                    <SelectValue placeholder="اختر اليوم..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {days.map(day => (
                                                        <SelectItem key={day} value={day}>{day}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-sm font-black text-gray-700">الوقت <span className="text-red-500">*</span></Label>
                                            <Input
                                                type="time"
                                                value={formData.time}
                                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                                className="h-16 rounded-2xl border-gray-100 bg-gray-50/50 px-6 text-xl focus:bg-white transition-all shadow-inner [color-scheme:light]"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-sm font-black text-gray-700">الصف الدراسي <span className="text-red-500">*</span></Label>
                                            <Select
                                                value={formData.grade}
                                                onValueChange={(val: string) => setFormData({ ...formData, grade: val })}
                                            >
                                                <SelectTrigger className="h-16 rounded-2xl border-gray-100 bg-gray-50/50 px-6 text-lg focus:bg-white transition-all shadow-inner">
                                                    <SelectValue placeholder="اختر الصف..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {grades.map(grade => (
                                                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-sm font-black text-gray-700">اسم المجموعة (يتم الابتكار تلقائياً)</Label>
                                        <div className="relative">
                                            <Input
                                                placeholder="اسم المجموعة سيظهر هنا..."
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="h-16 rounded-2xl border-dashed border-2 border-primary/20 bg-primary/5 px-6 text-xl font-black text-primary transition-all"
                                                readOnly
                                            />
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold text-primary">
                                                تلقائي
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-sm font-black text-gray-700">وصف المجموعة</Label>
                                        <Textarea
                                            placeholder="اكتب وصفاً مختصراً للمجموعة أو قواعد معينة تساعد الطلاب..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="min-h-[140px] rounded-[32px] border-gray-100 bg-gray-50/50 p-6 text-lg focus:bg-white transition-all shadow-inner"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: Assigned Students */}
                            <section className="mt-10 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        <h2 className="text-xl font-bold text-gray-900">الطلاب المضافون ({selectedStudents.length})</h2>
                                    </div>
                                </div>

                                {selectedStudents.length > 0 ? (
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {selectedStudents.map((student) => (
                                            <div key={student.id} className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-red-100 hover:bg-red-50/30">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-gray-900">{student.name}</h4>
                                                        <p className="text-xs text-gray-500">{student.email}</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => toggleStudent(student)}
                                                    className="h-8 w-8 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50"
                                                >
                                                    <XCircle className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-gray-100 bg-gray-50/50 p-10 text-center">
                                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-gray-300 shadow-sm">
                                            <Users className="h-7 w-7" />
                                        </div>
                                        <p className="text-gray-400 font-bold">لا يوجد طلاب مضافون حالياً</p>
                                        <p className="text-xs text-gray-400 mt-1">استخدم قائمة البحث لإضافة طلابك إلى هذه المجموعة</p>
                                    </div>
                                )}
                            </section>

                            <div className="mt-10 flex flex-col items-center justify-end gap-6 pt-10 border-t border-gray-100 md:flex-row">
                                <Button
                                    variant="ghost"
                                    onClick={() => navigate("/teacher/groups")}
                                    className="h-16 rounded-2xl px-12 text-xl font-bold text-gray-400 hover:bg-gray-100"
                                >
                                    تجاهل التغيير
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="h-16 rounded-2xl px-12 text-xl font-bold text-white shadow-2xl shadow-primary/30 min-w-[240px] hover:scale-105 transition-all"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            <span>جاري الحفظ...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <Save className="h-6 w-6" />
                                            <span>{id ? "تحديث المجموعة" : "حفظ وانطلاق"}</span>
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Student Search */}
                    <div className="space-y-6">
                        <div className="rounded-[40px] border border-white bg-white/70 p-8 shadow-xl backdrop-blur-md sticky top-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-black text-gray-900">إضافة طلاب</h3>
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Plus className="h-4 w-4" />
                                </div>
                            </div>

                            <div className="relative mb-6">
                                <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    placeholder="بحث باسم الطالب أو بريده..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-12 rounded-xl border-gray-100 bg-gray-50/50 pr-10 text-sm focus:bg-white transition-all transition-all shadow-inner"
                                />
                            </div>

                            <div className="max-h-[500px] space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => (
                                        <button
                                            key={student.id}
                                            onClick={() => toggleStudent(student)}
                                            className="group flex w-full items-center justify-between rounded-2xl border border-transparent p-3 text-right transition-all hover:border-primary/20 hover:bg-primary/5 active:scale-[0.98]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-bold text-gray-400 shadow-sm transition-all group-hover:bg-primary group-hover:text-white">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-900 transition-colors group-hover:text-primary">{student.name}</h4>
                                                    <p className="text-[10px] text-gray-400">{student.email}</p>
                                                </div>
                                            </div>
                                            <Plus className="h-4 w-4 text-gray-300 group-hover:text-primary" />
                                        </button>
                                    ))
                                ) : (
                                    <div className="py-10 text-center">
                                        <p className="text-xs font-bold text-gray-400">
                                            {searchQuery ? "لا يوجد طالب بهذا الاسم" : "ابدأ بالبحث لإضافة طلاب"}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 rounded-3xl bg-primary/5 p-6 border border-primary/10">
                                <div className="flex items-center gap-3 mb-2 text-primary">
                                    <Info className="h-4 w-4" />
                                    <h5 className="text-xs font-black">لماذا أضيف الطلاب هنا؟</h5>
                                </div>
                                <p className="text-[10px] font-bold text-gray-500 leading-relaxed italic">
                                    إضافة الطالب للمجموعة تسمح له بمشاهدة الدروس، حل الواجبات، ودخول الاختبارات المرتبطة بهذه المجموعة تلقائيًا.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
};

export default GroupEditor;
