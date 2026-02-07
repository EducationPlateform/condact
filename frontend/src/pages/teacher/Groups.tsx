import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Users,
  MoreVertical,
  Edit2,
  Trash2,
  Search,
  LayoutGrid,
  List,
  ChevronLeft,
  Calendar,
} from "lucide-react";
import TeacherLayout from "@/components/layouts/TeacherLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { groupService } from "@/services/groupService";
import { Group } from "@/types/api";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

const Groups: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const data = await groupService.getAll();
      setGroups(data);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
      toast({
        title: "خطأ",
        description: "فشل تحميل المجموعات. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditor = (group?: Group) => {
    if (group) {
      navigate(`/teacher/groups/${group.id}/edit`);
    } else {
      navigate("/teacher/groups/new");
    }
  };

  const handleDelete = async () => {
    if (!groupToDelete) return;

    try {
      await groupService.delete(groupToDelete);
      toast({ title: "تم الحذف", description: "تم حذف المجموعة بنجاح" });
      setIsDeleteDialogOpen(false);
      setGroupToDelete(null);
      fetchGroups();
    } catch (error) {
      console.error("Failed to delete group:", error);
      toast({
        title: "خطأ",
        description: "فشل حذف المجموعة",
        variant: "destructive",
      });
    }
  };

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TeacherLayout>
      <div className="mx-auto max-w-7xl space-y-8 font-notoSansArabic">
        {/* Header Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900 font-amin">المجموعات التعليمية</h1>
            <p className="mt-2 text-lg font-bold text-gray-500">إدارة المجموعات، الطلاب، والمواعيد الخاصة بك</p>
          </div>
          <Button
            size="lg"
            onClick={() => handleOpenEditor()}
            className="h-16 gap-3 rounded-[24px] bg-primary px-10 text-xl font-bold text-white shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="h-6 w-6 stroke-[3px]" />
            إنشاء مجموعة جديدة
          </Button>
        </div>

        {/* Filters & Search */}
        <Card className="overflow-hidden rounded-[32px] border-none shadow-xl shadow-gray-200/40 bg-white/70 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="ابحث عن مجموعة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 rounded-2xl border-none bg-gray-50/50 pr-12 text-lg focus:bg-white transition-all shadow-inner"
                />
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-gray-100 p-1.5 shadow-inner">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "h-11 w-11 rounded-xl transition-all",
                    viewMode === "grid" ? "bg-white text-primary shadow-sm" : "text-gray-400"
                  )}
                >
                  <LayoutGrid className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "h-11 w-11 rounded-xl transition-all",
                    viewMode === "list" ? "bg-white text-primary shadow-sm" : "text-gray-400"
                  )}
                >
                  <List className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Groups Content */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filteredGroups.length > 0 ? (
          <div className={cn(
            "grid gap-8",
            viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}>
            {filteredGroups.map((group) => (
              <Card
                key={group.id}
                className="group relative overflow-hidden rounded-[40px] border-none shadow-xl shadow-gray-200/50 transition-all hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
              >
                <CardContent className="p-0">
                  <div className="h-32 w-full bg-gradient-to-br from-primary/10 to-primary/5 transition-all group-hover:from-primary/20" />
                  <div className="relative p-8">
                    <div className="absolute -top-12 left-8 flex h-16 w-16 items-center justify-center rounded-[24px] bg-white text-primary shadow-xl shadow-primary/5">
                      <Users className="h-8 w-8" />
                    </div>

                    <div className="mb-6 flex items-start justify-between mt-2">
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary transition-colors">{group.name}</h3>
                        <p className="mt-1 line-clamp-2 text-sm font-bold text-gray-400 leading-relaxed">
                          {group.description || "لا يوجد وصف لهذه المجموعة"}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-gray-400 hover:text-primary">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[160px]">
                          <DropdownMenuItem
                            onClick={() => handleOpenEditor(group)}
                            className="gap-3 rounded-xl py-3 px-4 font-bold text-gray-600 focus:text-primary focus:bg-primary/5 cursor-pointer"
                          >
                            <Edit2 className="h-4 w-4" />
                            تعديل البيانات
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/teacher/groups/${group.id}/edit`)} // Or schedule page
                            className="gap-3 rounded-xl py-3 px-4 font-bold text-gray-600 focus:text-primary focus:bg-primary/5 cursor-pointer"
                          >
                            <Calendar className="h-4 w-4" />
                            تعديل الجدول
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setGroupToDelete(group.id);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="gap-3 rounded-xl py-3 px-4 font-bold text-red-500 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                            حذف المجموعة
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-gray-50 p-4 transition-colors group-hover:bg-primary/5">
                        <span className="block text-2xl font-black text-gray-900">{Array.isArray(group.students) ? group.students.length : 0}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">طالب مسجل</span>
                      </div>
                      <div className="rounded-2xl bg-gray-50 p-4 transition-colors group-hover:bg-primary/5 text-left">
                        <span className="block text-2xl font-black text-gray-900">0</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">حصة مكتملة</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handleOpenEditor(group)}
                      className="mt-6 h-12 w-full gap-2 rounded-2xl border-gray-100 bg-white font-bold text-primary shadow-sm transition-all hover:bg-primary hover:text-white hover:border-primary"
                    >
                      عرض تفاصيل المجموعة
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/5 text-primary">
              <Users className="h-12 w-12" />
            </div>
            <h2 className="text-2xl font-black text-gray-900">لا يوجد مجموعات حالياً</h2>
            <p className="mt-2 text-gray-500 font-bold max-w-sm">قم بإنشاء مجموعتك الأولى لتبدأ في إضافة الطلاب والمحاضرات</p>
            <Button
              className="mt-8 h-14 rounded-2xl px-10 text-lg font-bold"
              onClick={() => handleOpenEditor()}
            >
              ابدأ بإنشاء مجموعة
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md overflow-hidden rounded-[40px] border-none p-0 shadow-2xl font-notoSansArabic">
          <div className="p-12 text-center space-y-8">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-50 text-red-500 mb-2">
              <Trash2 className="h-12 w-12" />
            </div>
            <div className="space-y-3">
              <DialogTitle className="text-3xl font-black text-gray-900">هل أنت متأكد من الحذف؟</DialogTitle>
              <p className="text-lg font-bold text-gray-400">
                لا يمكن التراجع عن هذا الإجراء وسيتم حذف جميع بيانات المجموعة والطلاب المرتبطين بها.
              </p>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <Button
                onClick={handleDelete}
                className="h-16 w-full rounded-2xl bg-red-500 text-xl font-bold text-white hover:bg-red-600 shadow-xl shadow-red-100 transition-all"
              >
                نعم، احذف المجموعة
              </Button>
              <Button
                onClick={() => setIsDeleteDialogOpen(false)}
                variant="ghost"
                className="h-14 w-full rounded-2xl text-gray-400 font-bold hover:text-gray-600"
              >
                إلغاء والعودة
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TeacherLayout>
  );
};

export default Groups;
