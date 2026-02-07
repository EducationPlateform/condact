import React, { useState, useEffect } from "react";
import { UploadCloud, CheckCircle, AlertCircle, FileVideo, Users, BookOpen } from "lucide-react";
import TeacherLayout from "@/components/layouts/TeacherLayout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { videoService } from "@/services/videoService";
import { lectureService } from "@/services/lectureService";
import { groupService } from "@/services/groupService";
import { Lecture, Group } from "@/types/api";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

const VideoUpload: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedLecture, setSelectedLecture] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await groupService.getAll();
        setGroups(data);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchLectures = async () => {
      if (!selectedGroup) {
        setLectures([]);
        return;
      }
      try {
        const data = await lectureService.getByGroup(selectedGroup);
        setLectures(data);
      } catch (error) {
        console.error("Failed to fetch lectures:", error);
      }
    };
    fetchLectures();
  }, [selectedGroup]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedLecture) {
      toast({
        title: "تنبيه",
        description: "يرجى اختيار المحاضرة والملف",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      await videoService.upload(selectedLecture, file);
      toast({
        title: "اكتمل الرفع",
        description: "تم رفع الفيديو بنجاح!",
      });
      setFile(null);
      setSelectedLecture("");
      setProgress(100);
    } catch (err: any) {
      toast({
        title: "خطأ",
        description: err.message || "فشل رفع الفيديو",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <TeacherLayout>
      <div className="mx-auto max-w-3xl font-notoSansArabic">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-3xl font-extrabold text-gray-900 font-amin text-center">
            رفع فيديوهات المحاضرات
          </h1>
          <p className="text-gray-500">
            اختر المجموعة والمحاضرة ثم ارفع ملف الفيديو الخاص بك
          </p>
        </div>

        {/* Upload Form Card */}
        <div className="rounded-[40px] border border-white bg-white/70 p-10 shadow-xl backdrop-blur-md">
          <div className="space-y-8">
            {/* Step 1: Select Group & Lecture */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Users className="h-4 w-4 text-primary" />
                  اختر المجموعة التعليمية
                </label>
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger className="h-14 rounded-2xl bg-gray-50/50 pr-4">
                    <SelectValue placeholder="اختر المجموعة..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {groups.map((group) => (
                      <SelectItem key={group._id} value={group._id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <BookOpen className="h-4 w-4 text-primary" />
                  اختر المحاضرة
                </label>
                <Select
                  value={selectedLecture}
                  onValueChange={setSelectedLecture}
                  disabled={!selectedGroup}
                >
                  <SelectTrigger className="h-14 rounded-2xl bg-gray-50/50 pr-4">
                    <SelectValue placeholder="اختر المحاضرة..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {lectures.map((lecture) => (
                      <SelectItem key={lecture._id} value={lecture._id}>
                        {lecture.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Step 2: File Upload Zone */}
            <div className={cn(
              "group relative flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed py-14 transition-all",
              file
                ? "border-emerald-500 bg-emerald-50/30"
                : "border-primary/20 bg-primary/5 hover:border-primary/40 hover:bg-primary/10"
            )}>
              <div className={cn(
                "mb-4 flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-transform group-hover:scale-110",
                file ? "bg-emerald-500 text-white" : "bg-white text-primary shadow-primary/10"
              )}>
                {file ? <CheckCircle className="h-10 w-10" /> : <UploadCloud className="h-10 w-10" />}
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 mx-4 text-center">
                {file ? file.name : "اسحب ملف الفيديو هنا أو اضغط للاختيار"}
              </h3>
              <p className={cn(
                "text-sm font-bold",
                file ? "text-emerald-600" : "text-primary/60"
              )}>
                {file
                  ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                  : "جميع ملفات الفيديو مدعومة (MP4, MOV, etc.)"}
              </p>
              <input
                type="file"
                accept="video/*"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-sm font-bold text-gray-500">
                  جاري الرفع... {progress}%
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleUpload}
              disabled={!file || !selectedLecture || uploading}
              className="h-16 w-full rounded-2xl text-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {uploading ? "جاري المعالجة..." : "ابدأ الرفع الآن"}
            </Button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">
          <AlertCircle className="h-4 w-4" />
          <p className="text-xs font-bold">يرجى عدم إغلاق الصفحة حتى يكتمل شريط التحميل</p>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default VideoUpload;
