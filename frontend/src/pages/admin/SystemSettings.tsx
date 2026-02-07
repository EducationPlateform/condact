import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import { announcementService } from "@/services/announcementService";
import { Announcement } from "@/types/api";
import { useToast } from "@/hooks/useToast";
import Layout from "@/components/common/Layout";

const SystemSettings = () => {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info" as "info" | "warning" | "success",
    isActive: true,
    expiresAt: "",
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await announcementService.getAll();
      setAnnouncements(data);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل الإعلانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await announcementService.create(formData);
      toast({
        title: "نجح",
        description: "تم إنشاء الإعلان بنجاح",
      });
      setShowNewForm(false);
      setFormData({
        title: "",
        message: "",
        type: "info",
        isActive: true,
        expiresAt: "",
      });
      fetchAnnouncements();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إنشاء الإعلان",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await announcementService.update(id, formData);
      toast({
        title: "نجح",
        description: "تم تحديث الإعلان بنجاح",
      });
      setEditingId(null);
      fetchAnnouncements();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحديث الإعلان",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الإعلان؟")) return;

    try {
      await announcementService.delete(id);
      toast({
        title: "نجح",
        description: "تم حذف الإعلان بنجاح",
      });
      fetchAnnouncements();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حذف الإعلان",
        variant: "destructive",
      });
    }
  };

  const startEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
      isActive: announcement.isActive ?? true,
      expiresAt: announcement.expiresAt || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: "",
      message: "",
      type: "info",
      isActive: true,
      expiresAt: "",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">إعدادات النظام</h1>
          <Button onClick={() => setShowNewForm(!showNewForm)}>
            {showNewForm ? <X className="ml-2 h-4 w-4" /> : <Plus className="ml-2 h-4 w-4" />}
            {showNewForm ? "إلغاء" : "إعلان جديد"}
          </Button>
        </div>

        {showNewForm && (
          <Card>
            <CardHeader>
              <CardTitle>إنشاء إعلان جديد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">العنوان</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="عنوان الإعلان"
                />
              </div>
              <div>
                <Label htmlFor="message">الرسالة</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="محتوى الإعلان"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="type">النوع</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "info" | "warning" | "success") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">معلومات</SelectItem>
                    <SelectItem value="warning">تحذير</SelectItem>
                    <SelectItem value="success">نجاح</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="expiresAt">تاريخ الانتهاء (اختياري)</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>
              <Button onClick={handleCreate} className="w-full">
                إنشاء الإعلان
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-gray-500">جاري التحميل...</p>
          ) : announcements.length === 0 ? (
            <p className="text-center text-gray-500">لا توجد إعلانات حالياً</p>
          ) : (
            announcements.map((announcement) => (
              <Card key={announcement.id}>
                <CardContent className="pt-6">
                  {editingId === announcement.id ? (
                    <div className="space-y-4">
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="العنوان"
                      />
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="الرسالة"
                        rows={3}
                      />
                      <Select
                        value={formData.type}
                        onValueChange={(value: "info" | "warning" | "success") =>
                          setFormData({ ...formData, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">معلومات</SelectItem>
                          <SelectItem value="warning">تحذير</SelectItem>
                          <SelectItem value="success">نجاح</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button onClick={() => handleUpdate(announcement.id)} className="flex-1">
                          <Save className="ml-2 h-4 w-4" />
                          حفظ
                        </Button>
                        <Button onClick={cancelEdit} variant="outline" className="flex-1">
                          <X className="ml-2 h-4 w-4" />
                          إلغاء
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{announcement.title}</h3>
                            <Badge
                              variant={
                                announcement.type === "warning"
                                  ? "destructive"
                                  : announcement.type === "success"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {announcement.type === "info"
                                ? "معلومات"
                                : announcement.type === "warning"
                                  ? "تحذير"
                                  : "نجاح"}
                            </Badge>
                            {announcement.isActive && (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                نشط
                              </Badge>
                            )}
                          </div>
                          <p className="mt-2 text-gray-600">{announcement.message}</p>
                          {announcement.expiresAt && (
                            <p className="mt-1 text-sm text-gray-500">
                              ينتهي في: {new Date(announcement.expiresAt).toLocaleString("ar-EG")}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => startEdit(announcement)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(announcement.id)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SystemSettings;
