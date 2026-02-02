import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Calculator,
  Search,
  Bell,
  MessageSquare,
  BookOpen,
  Users,
  FileText,
  ClipboardList,
  Plus,
  Clock,
  AlertCircle,
  Info,
  LogOut,
  Zap,
  TrendingUp,
  Headphones,
} from "lucide-react";

const TeacherDashboard = () => {
  const [academicYear] = useState("2024");
  const [semester] = useState("الفصل الأول");

  const stats = [
    {
      icon: BookOpen,
      value: "12",
      label: "عدد الكورسات",
      change: "+2 هذا الشهر",
      changeType: "positive" as const,
      color: "text-primary bg-primary/10",
    },
    {
      icon: Users,
      value: "450",
      label: "عدد الطلبة",
      change: "+45 طالب جديد",
      changeType: "positive" as const,
      color: "text-success bg-success/10",
    },
    {
      icon: FileText,
      value: "8",
      label: "الواجبات النشطة",
      change: "3 تنتهي قريباً",
      changeType: "warning" as const,
      color: "text-warning bg-warning/10",
    },
    {
      icon: ClipboardList,
      value: "3",
      label: "الامتحانات",
      change: "آخر تحديث: أمس",
      changeType: "neutral" as const,
      color: "text-primary bg-primary/10",
    },
  ];

  const todaySchedule = [
    {
      time: "10:00 صباحاً",
      subject: "جبر - الصف الثالث الثانوي",
      topic: "الوحدة الثانية: الأعداد المركبة",
      status: "live",
    },
    {
      time: "12:30 ظهراً",
      subject: "هندسة - الصف الثاني الثانوي",
      topic: "مراجعة عامة على المثلثات",
      status: "scheduled",
    },
    {
      time: "03:00 مساءً",
      subject: "إحصاء - الصف الأول الثانوي",
      topic: "مقدمة في الاحتمالات",
      status: "scheduled",
    },
  ];

  const notifications = [
    {
      type: "warning",
      title: "تصحيح واجبات",
      description: "توجد 15 مشاركة لم يتم تصحيحها في كورس الجبر",
      icon: AlertCircle,
      color: "bg-warning/10 border-warning/30",
    },
    {
      type: "info",
      title: "تحديث المنصة",
      description: "تم إضافة مميزات جديدة لنظام الامتحانات الأسبوع القادم",
      icon: Info,
      color: "bg-primary/10 border-primary/30",
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Calculator className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">التعليم الذكي</span>
          </div>

          {/* Search */}
          <div className="hidden flex-1 max-w-md mx-8 md:block">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="البحث عن دروس، طلاب، أو نتائج..."
                className="pr-10"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-destructive text-[10px] text-destructive-foreground flex items-center justify-center">
                3
              </span>
            </Button>
            <div className="flex items-center gap-2 border-r pr-4">
              <span className="text-sm text-muted-foreground">
                العام الدراسي {academicYear}
              </span>
              <Badge variant="outline">{semester}</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  لوحة تحكم المعلم
                </h1>
                <p className="text-muted-foreground">
                  مرحباً بك مجدداً. إليك نظرة عامة على نشاطك اليوم والأداء العام
                </p>
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">تاريخ اليوم</p>
                <p className="font-semibold">الثلاثاء، 24 أكتوبر 2023</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p
                        className={`mt-1 text-xs flex items-center gap-1 ${
                          stat.changeType === "positive"
                            ? "text-success"
                            : stat.changeType === "warning"
                              ? "text-warning"
                              : "text-muted-foreground"
                        }`}
                      >
                        {stat.changeType === "positive" && (
                          <TrendingUp className="h-3 w-3" />
                        )}
                        {stat.changeType === "warning" && (
                          <Clock className="h-3 w-3" />
                        )}
                        {stat.change}
                      </p>
                    </div>
                    <div className={`rounded-lg p-3 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">إجراءات سريعة</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Button size="lg" className="h-14 gap-2" asChild>
                <Link to="/teacher/homework/create">
                  <Plus className="h-5 w-5" />
                  إضافة حصة جديدة
                </Link>
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="h-14 gap-2"
                asChild
              >
                <Link to="/teacher/homework/create">
                  <FileText className="h-5 w-5" />
                  إنشاء تكليف
                </Link>
              </Button>
            </div>
          </div>

          {/* Schedule & Notifications */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Today's Schedule */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>جدول حصص اليوم</CardTitle>
                <Button variant="link" size="sm">
                  عرض الجدول الكامل
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {todaySchedule.map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-lg border p-4"
                  >
                    <div className="text-center">
                      <p className="text-sm font-semibold text-foreground">
                        {session.time.split(" ")[0]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.time.split(" ")[1]}
                      </p>
                    </div>
                    <div className="h-12 w-px bg-border" />
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        {session.subject}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.topic}
                      </p>
                    </div>
                    <Badge
                      className={
                        session.status === "live"
                          ? "bg-success text-success-foreground"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {session.status === "live" ? "مباشر الآن" : "مجدولة"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Notifications & Support */}
            <div className="space-y-6">
              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>تنبيهات هامة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {notifications.map((notification, index) => (
                    <div
                      key={index}
                      className={`rounded-lg border p-3 ${notification.color}`}
                    >
                      <div className="flex items-start gap-2">
                        <notification.icon
                          className={`h-5 w-5 ${
                            notification.type === "warning"
                              ? "text-warning"
                              : "text-primary"
                          }`}
                        />
                        <div>
                          <p className="font-medium text-foreground">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Support Card */}
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <Headphones className="mb-3 h-8 w-8" />
                  <h3 className="mb-2 font-bold">الدعم الفني</h3>
                  <p className="mb-4 text-sm text-primary-foreground/80">
                    هل تواجه أي مشكلة في إدارة الفصول؟ فريقنا هنا لمساعدتك
                    دائماً.
                  </p>
                  <Button variant="secondary" className="w-full">
                    تواصل معنا
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden w-64 border-r bg-background p-4 lg:block">
          <div className="flex flex-col items-center border-b pb-4">
            <div className="mb-3 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-foreground">أ/ علي السيد</h3>
            <p className="text-sm text-muted-foreground">معلم أول رياضيات</p>
          </div>

          <div className="mt-auto pt-4">
            <Button
              variant="outline"
              className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
              asChild
            >
              <Link to="/">
                <LogOut className="h-4 w-4" />
                تسجيل الخروج
              </Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TeacherDashboard;
