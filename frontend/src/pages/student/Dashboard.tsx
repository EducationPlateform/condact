import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Video,
    FileText,
    ClipboardList,
    TrendingUp,
    Clock,
    AlertCircle,
    Zap,
    History,
    Loader2,
    CheckCircle,
    Headphones,
    Play,
} from "lucide-react";
import StudentLayout from "@/components/layouts/StudentLayout";
import { LoadingScreen } from "@/components/common/Loading";
import { groupService } from "@/services/groupService";
import { lectureService } from "@/services/lectureService";
import { homeworkService } from "@/services/homeworkService";
import { examService } from "@/services/examService";
import { announcementService } from "@/services/announcementService";
import { studentStrings } from "@/studentStrings";
import { Announcement, Lecture } from "@/types/api";

function formatTimeAgo(createdAt: string): string {
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays >= 2) return studentStrings.timeAgoDays(diffDays);
    if (diffDays === 1) return studentStrings.timeAgoYesterday;
    if (diffHours >= 2) return studentStrings.timeAgoHours(2);
    if (diffHours >= 1) return studentStrings.timeAgoHours(1);
    return studentStrings.timeAgoHours(0);
}

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [showLoadingScreen, setShowLoadingScreen] = useState(true);
    const [data, setData] = useState({
        lectureCount: 0,
        homeworkCount: 0,
        examCount: 0,
        todaySchedule: [] as any[],
        announcements: [] as Announcement[],
    });

    useEffect(() => {
        const abortController = new AbortController();
        const { signal } = abortController;

        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [groups, announcements] = await Promise.all([
                    groupService.getAll(signal),
                    announcementService.getActive(),
                ]);

                let totalLectures = 0;
                let hwCount = 0;
                let exCount = 0;
                const allLectures: Lecture[] = [];

                for (const group of groups) {
                    const gid = (group as { _id?: string })._id ?? group.id;
                    try {
                        const lectures = await lectureService.getByGroup(gid);
                        totalLectures += lectures.length;
                        allLectures.push(...lectures);
                        for (const lec of lectures) {
                            const lid = (lec as { _id?: string })._id ?? lec.id;
                            try {
                                await homeworkService.getByLecture(lid);
                                hwCount += 1;
                            } catch {
                                //
                            }
                            try {
                                await examService.getByLecture(lid);
                                exCount += 1;
                            } catch {
                                //
                            }
                        }
                    } catch {
                        //
                    }
                }

                // Filter today's schedule
                const now = new Date();
                const todayStr = now.toISOString().split("T")[0];
                const schedule = allLectures
                    .filter((l: Lecture) => l.scheduledDate?.startsWith(todayStr))
                    .map((l: Lecture) => {
                        const date = l.scheduledDate ? new Date(l.scheduledDate) : null;
                        return {
                            time: date ? date.toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit', hour12: true }) : "غير محدد",
                            subject: l.title,
                            topic: l.description || "لا يوجد وصف",
                            status: l.isPublished ? "live" : "scheduled",
                            grade: l.grade
                        };
                    })
                    .sort((a, b) => a.time.localeCompare(b.time));

                setData({
                    lectureCount: totalLectures,
                    homeworkCount: hwCount,
                    examCount: exCount,
                    todaySchedule: schedule,
                    announcements: announcements || [],
                });
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                if (!abortController.signal.aborted) setLoading(false);
            }
        };

        fetchDashboardData();
        return () => abortController.abort();
    }, []);

    const stats = [
        {
            icon: Video,
            value: data.lectureCount.toString(),
            label: "المحاضرات",
            change: "إجمالي الحصص المتاحة",
            changeType: "positive" as const,
            color: "text-primary",
            bg: "bg-blue-50",
        },
        {
            icon: FileText,
            value: data.homeworkCount.toString(),
            label: "الواجبات",
            change: "واجبات قيد الحل",
            changeType: "warning" as const,
            color: "text-orange-500",
            bg: "bg-orange-50",
        },
        {
            icon: ClipboardList,
            value: data.examCount.toString(),
            label: "الامتحانات",
            change: "إجمالي الاختبارات المتاحة",
            changeType: "neutral" as const,
            color: "text-purple-500",
            bg: "bg-purple-50",
        },
        {
            icon: TrendingUp,
            value: studentStrings.reportsStat,
            label: "التقارير",
            change: "عرض الأداء الشهري",
            changeType: "positive" as const,
            color: "text-success",
            bg: "bg-green-50",
        },
    ];

    const notifications = [];

    // Add system announcements first
    data.announcements.forEach((announcement) => {
        const iconMap = {
            info: CheckCircle,
            warning: AlertCircle,
            success: CheckCircle,
        };
        const colorMap = {
            info: { bg: "bg-blue-50 border-blue-100", icon: "text-blue-500" },
            warning: { bg: "bg-yellow-50 border-yellow-100", icon: "text-yellow-500" },
            success: { bg: "bg-green-50 border-green-100", icon: "text-green-500" },
        };

        notifications.push({
            type: announcement.type,
            title: announcement.title,
            description: announcement.message,
            icon: iconMap[announcement.type] || CheckCircle,
            color: colorMap[announcement.type]?.bg || "bg-blue-50 border-blue-100",
            iconColor: colorMap[announcement.type]?.icon || "text-blue-500",
        });
    });

    if (notifications.length === 0) {
        notifications.push({
            type: "info",
            title: "لا توجد تنبيهات",
            description: "منصتك تعمل بشكل مثالي، لا توجد مهام معلقة حالياً",
            icon: CheckCircle,
            color: "bg-emerald-50 border-emerald-100",
            iconColor: "text-emerald-500",
        });
    }

    const today = new Date().toLocaleDateString("ar-EG", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    if (showLoadingScreen || loading) {
        if (showLoadingScreen) {
            return <LoadingScreen duration={5000} onComplete={() => setShowLoadingScreen(false)} />;
        }
        return (
            <StudentLayout>
                <div className="flex h-[80vh] w-full items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            </StudentLayout>
        );
    }

    return (
        <StudentLayout>
            {/* Page Title & Date */}
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <h1 className="mb-2 text-3xl font-extrabold font-inter text-gray-900">
                        لوحة تحكم الطالب
                    </h1>
                    <p className="text-gray-500 text-base font-inter">
                        مرحباً بك مجدداً. إليك نظرة عامة على نشاطك اليوم والأداء العام
                    </p>
                </div>
                <div className="text-right rtl:text-right">
                    <p className="mb-1 text-xs text-gray-400 font-bold font-inter">تاريخ اليوم</p>
                    <p className="text-sm font-bold font-inter text-gray-800">
                        {today}
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="mb-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card
                        key={index}
                        className="border-none shadow-sm transition-shadow hover:shadow-md cursor-pointer"
                        onClick={() => {
                            if (index === 0) window.location.href = "/student/lectures";
                            else if (index === 1) window.location.href = "/student/homework";
                            else if (index === 2) window.location.href = "/student/exams";
                            else if (index === 3) window.location.href = "/student/scores";
                        }}
                    >
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start justify-between">
                                    <div className={`rounded-xl p-3 ${stat.bg} ${stat.color}`}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[#4C6C9A]">
                                        {stat.label}
                                    </p>
                                    <p className="text-3xl font-extrabold font-inter text-gray-900 mb-1">
                                        {stat.value}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-xs">
                                    {stat.changeType === "positive" && (
                                        <TrendingUp className="h-3 w-3 text-green-600" />
                                    )}
                                    {stat.changeType === "warning" && (
                                        <Clock className="h-3 w-3 text-orange-600" />
                                    )}
                                    {stat.changeType === "neutral" && (
                                        <History className="h-3 w-3 text-purple-600" />
                                    )}
                                    <span
                                        className={`font-medium ${stat.changeType === "positive"
                                            ? "text-green-600"
                                            : stat.changeType === "warning"
                                                ? "text-orange-600"
                                                : "text-purple-500"
                                            }`}
                                    >
                                        {stat.change}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-10">
                <div className="mb-5 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold font-inter text-gray-900">إجراءات سريعة</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <Button
                        size="lg"
                        className="h-16 gap-3 rounded-2xl text-lg shadow-lg shadow-primary/20"
                        asChild
                    >
                        <Link to="/student/lectures">
                            <Play className="h-6 w-6" />
                            بدء درس جديد
                        </Link>
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="h-16 gap-3 rounded-2xl border-2 bg-white text-lg text-primary hover:bg-blue-50 hover:text-primary"
                        asChild
                    >
                        <Link to="/student/homework">
                            <FileText className="h-6 w-6" />
                            عرض الواجبات
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Schedule */}
                <div className="lg:col-span-2">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">جدول حصص اليوم</h2>
                        <Button variant="link" className="text-primary" asChild>
                            <Link to="/student/lectures">عرض الجدول الكامل</Link>
                        </Button>
                    </div>
                    <Card className="border-none shadow-sm">
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {data.todaySchedule.length > 0 ? (
                                    data.todaySchedule.map((session, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center"
                                        >
                                            <div className={`flex min-w-[100px] flex-col items-center justify-center rounded-2xl p-3 ${session.status === "live" ? "bg-blue-50 text-blue-500" : "bg-gray-100 text-gray-500"}`}>
                                                <span className="text-lg font-bold">
                                                    {session.time.split(" ")[0]}
                                                </span>
                                                <span className="text-xs">
                                                    {session.time.split(" ")[1]}
                                                </span>
                                            </div>

                                            <div className="flex-1 space-y-1">
                                                <h4 className="text-lg font-bold text-gray-900">
                                                    {session.subject}
                                                </h4>
                                                <p className="text-sm text-gray-500 line-clamp-1">{session.topic}</p>
                                            </div>

                                            <div>
                                                {session.status === "live" ? (
                                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-1">
                                                        منشورة
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-gray-100 text-gray-500 hover:bg-gray-200 px-4 py-1"
                                                    >
                                                        مجدولة
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-10 text-center text-gray-500">
                                        لا توجد حصص مجدولة لليوم
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Notifications & Support */}
                <div className="space-y-6">
                    <div>
                        <h2 className="mb-5 text-xl font-bold text-gray-900">
                            تنبيهات هامة
                        </h2>
                        <div className="space-y-4">
                            {notifications.map((notification, index) => (
                                <div
                                    key={index}
                                    className={`relative overflow-hidden rounded-2xl border p-4 ${notification.color}`}
                                >
                                    <div className="flex gap-4">
                                        <div
                                            className={`rounded-full bg-white p-2 ${notification.iconColor}`}
                                        >
                                            <notification.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">
                                                {notification.title}
                                            </h4>
                                            <p className="mt-1 text-sm text-gray-600">
                                                {notification.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Card className="overflow-hidden border-none bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                        <CardContent className="relative p-6">
                            <div className="relative z-10">
                                <div className="mb-4 inline-flex rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                                    <Headphones className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold">الدعم الفني</h3>
                                <p className="mb-6 text-primary-foreground/90">
                                    هل تواجه أي مشكلة في التعلم؟ فريقنا هنا لمساعدتك دائماً.
                                </p>
                                <Button className="w-full bg-white text-primary hover:bg-white/90">
                                    تواصل معنا
                                </Button>
                            </div>
                            {/* Decorative circles */}
                            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                            <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </StudentLayout>
    );
};

export default Dashboard;
