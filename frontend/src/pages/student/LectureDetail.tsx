import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    CheckCircle2,
    Lock,
    Play,
    FileText,
    Download,
    Headphones,
    ChevronLeft,
    Loader2,
    Clock,
} from "lucide-react";
import StudentLayout from "@/components/layouts/StudentLayout";
import { LoadingScreen } from "@/components/common/Loading";
import SecureVideoPlayer from "@/components/video/SecureVideoPlayer";
import { lectureService } from "@/services/lectureService";
import { videoService } from "@/services/videoService";
import { accessService } from "@/services/accessService";
import { groupService } from "@/services/groupService";
import { homeworkService } from "@/services/homeworkService";
import { studentStrings } from "@/studentStrings";
import { useAuth } from "@/context/AuthContext";
import { Lecture, StudentAccess, Video, Group, Homework } from "@/types/api";

interface ProcessedLecture {
    lecture: Lecture;
    access: StudentAccess | null;
    isCompleted: boolean;
    isLocked: boolean;
    video?: Video;
}

const LectureDetail = () => {
    const { id } = useParams<{ id: string }>();
    useAuth();
    const navigate = useNavigate();
    const [lecture, setLecture] = useState<Lecture | null>(null);
    const [video, setVideo] = useState<Video | null>(null);
    const [group, setGroup] = useState<Group | null>(null);
    const [access, setAccess] = useState<StudentAccess | null>(null);
    const [homework, setHomework] = useState<Homework | null>(null);
    const [groupLectures, setGroupLectures] = useState<ProcessedLecture[]>([]);
    const [loading, setLoading] = useState(true);
    const [showLoadingScreen, setShowLoadingScreen] = useState(true);
    const [activeTab, setActiveTab] = useState("description");

    useEffect(() => {
        const abortController = new AbortController();

        const fetchData = async () => {
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // Fetch current lecture
                const lectureData = await lectureService.getById(id);
                setLecture(lectureData);

                const lectureId = (lectureData as { _id?: string })._id ?? lectureData.id;

                // Fetch video if exists
                if (lectureData.videoId) {
                    try {
                        const videoId = typeof lectureData.videoId === "string"
                            ? lectureData.videoId
                            : lectureData.videoId._id || lectureData.videoId.id;
                        const videoData = await videoService.getById(videoId);
                        setVideo(videoData);
                    } catch (err) {
                        console.error("Failed to fetch video:", err);
                    }
                }

                // Fetch access
                try {
                    const accessData = await accessService.checkAccess(lectureId);
                    setAccess(accessData);
                } catch (err) {
                    // No access yet
                }

                // Fetch group
                const groupId = typeof lectureData.groupId === "string"
                    ? lectureData.groupId
                    : lectureData.groupId.id || (lectureData.groupId as { _id?: string })._id;
                
                if (groupId) {
                    try {
                        const groupData = await groupService.getById(groupId);
                        setGroup(groupData);

                        // Fetch all lectures in group
                        const allLectures = await lectureService.getByGroup(groupId);

                        // Process each lecture
                        const processed: ProcessedLecture[] = await Promise.all(
                            allLectures.map(async (lec) => {
                                const lid = (lec as { _id?: string })._id ?? lec.id;
                                let access = null;
                                let isCompleted = false;
                                let isLocked = false;
                                let videoData: Video | undefined;

                                try {
                                    access = await accessService.checkAccess(lid);
                                    isCompleted = access.currentViews > 0;
                                } catch {
                                    isLocked = true;
                                }

                                // Fetch video if exists
                                if (lec.videoId) {
                                    try {
                                        const vid = typeof lec.videoId === "string"
                                            ? lec.videoId
                                            : lec.videoId._id || lec.videoId.id;
                                        videoData = await videoService.getById(vid);
                                    } catch {
                                        // Video not available
                                    }
                                }

                                return {
                                    lecture: lec,
                                    access,
                                    isCompleted,
                                    isLocked,
                                    video: videoData,
                                };
                            })
                        );

                        // Sort by order field
                        processed.sort((a, b) => a.lecture.order - b.lecture.order);
                        setGroupLectures(processed);
                    } catch (err) {
                        console.error("Failed to fetch group:", err);
                    }
                }

                // Fetch homework if exists
                try {
                    const homeworkData = await homeworkService.getByLecture(lectureId);
                    setHomework(homeworkData);
                } catch {
                    // No homework
                }
            } catch (error) {
                console.error("Failed to fetch lecture:", error);
            } finally {
                if (!abortController.signal.aborted) setLoading(false);
            }
        };

        fetchData();
        return () => abortController.abort();
    }, [id]);

    const handleViewRecorded = async () => {
        if (!id) return;
        try {
            const accessData = await accessService.checkAccess(id);
            setAccess(accessData);
        } catch (err) {
            console.error("Failed to refresh access:", err);
        }
    };

    const handleHomeworkClick = () => {
        if (homework) {
            navigate(`/student/homework`);
        } else {
            // Show message or navigate to homework list
            navigate("/student/homework");
        }
    };

    const formatViewCount = (count: number): string => {
        const thousands = count / 1000;
        return thousands >= 1 ? `${thousands.toFixed(1)} ألف مشاهدة` : `${count} مشاهدة`;
    };

    const formatDuration = (seconds?: number): string => {
        if (!seconds) return "00:00 دقيقة";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')} دقيقة`;
    };

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

    if (!lecture) {
        return (
            <StudentLayout>
                <div className="flex h-[80vh] w-full items-center justify-center">
                    <p className="text-gray-500 text-lg">{studentStrings.lectureNotFound}</p>
                </div>
            </StudentLayout>
        );
    }

    const lectureId = (lecture as { _id?: string })._id ?? lecture.id;

    return (
        <StudentLayout>
            <div className="container mx-auto px-8">
                {/* Breadcrumbs */}
                <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600">
                    <Link
                        to="/student/lectures"
                        className="hover:text-primary transition-colors"
                    >
                        {studentStrings.trainingCourses}
                    </Link>
                    <ChevronLeft className="h-4 w-4" />
                    {group && (
                        <>
                            <span className="text-gray-900 font-medium">
                                {group.name}
                            </span>
                            <ChevronLeft className="h-4 w-4" />
                        </>
                    )}
                    <span className="text-gray-900 font-medium">{lecture.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - 2/3 width */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Video Player */}
                        {video && (
                            <div className="rounded-xl overflow-hidden bg-gray-900 aspect-video">
                                <SecureVideoPlayer
                                    videoId={video.id}
                                    lectureId={lectureId}
                                    maxViews={access?.maxViews || 0}
                                    currentViews={access?.currentViews || 0}
                                    onViewRecorded={handleViewRecorded}
                                    useDrm={video.securityConfig?.drmEnabled || false}
                                />
                            </div>
                        )}
                        {!video && (
                            <div className="rounded-xl overflow-hidden bg-gray-900 aspect-video flex items-center justify-center">
                                <p className="text-white">لا يوجد فيديو متاح لهذه المحاضرة</p>
                            </div>
                        )}

                        {/* Start Homework Button */}
                        <Button
                            className="w-full bg-primary text-white hover:bg-primary/90 rounded-xl h-12 text-base font-semibold"
                            onClick={handleHomeworkClick}
                        >
                            <FileText className="h-5 w-5 ml-2" />
                            {studentStrings.startHomework}
                        </Button>

                        {/* Lecture Title & Metadata */}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-3">
                                {lecture.title}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                {lecture.createdAt && (
                                    <span>
                                        {studentStrings.uploadDate}: {new Date(lecture.createdAt).toLocaleDateString("ar-EG")}
                                    </span>
                                )}
                                {access && (
                                    <span>
                                        {formatViewCount(access.currentViews * 1000)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Tabs */}
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                                <TabsTrigger
                                    value="description"
                                    className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary"
                                >
                                    {studentStrings.lessonDescription}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="resources"
                                    className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary"
                                >
                                    {studentStrings.educationalResources}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="comments"
                                    className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary"
                                >
                                    {studentStrings.comments} (24)
                                </TabsTrigger>
                            </TabsList>

                            {/* Description Tab */}
                            <TabsContent value="description" className="mt-6">
                                <div className="space-y-4">
                                    {lecture.description && (
                                        <p className="text-gray-700 leading-relaxed">
                                            {lecture.description}
                                        </p>
                                    )}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                                            {studentStrings.whatYouWillLearn}
                                        </h3>
                                        <ul className="list-disc list-inside space-y-2 text-gray-700 pr-4">
                                            <li>قوانين الأسس والجذور والتعامل معها.</li>
                                            <li>تحليل المقادير الجبرية بأنواعها المختلفة.</li>
                                            <li>الفرق بين المعادلة والمتطابقة.</li>
                                            <li>أساسيات حل معادلات الدرجة الأولى والثانية.</li>
                                        </ul>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Educational Resources Tab */}
                            <TabsContent value="resources" className="mt-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                                        {studentStrings.availableResources}
                                    </h3>
                                    {lecture.pdfFiles && lecture.pdfFiles.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {lecture.pdfFiles.map((pdf, index) => {
                                                const filename = pdf.split('/').pop() || `PDF ${index + 1}`;
                                                const fileSize = "2.4 MB"; // Placeholder - would need actual file size from API
                                                return (
                                                    <Card key={index} className="hover:shadow-md transition-shadow">
                                                        <CardContent className="p-4 flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="rounded-lg bg-blue-50 p-3">
                                                                    <FileText className="h-6 w-6 text-primary" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-gray-900">{filename}</p>
                                                                    <p className="text-sm text-gray-500">{fileSize}</p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                asChild
                                                            >
                                                                <a
                                                                    href={lectureService.downloadPDF(lectureId, filename)}
                                                                    download
                                                                    className="text-primary hover:text-primary/80"
                                                                >
                                                                    <Download className="h-5 w-5" />
                                                                </a>
                                                            </Button>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">
                                            لا توجد مصادر تعليمية متاحة
                                        </p>
                                    )}
                                </div>
                            </TabsContent>

                            {/* Comments Tab */}
                            <TabsContent value="comments" className="mt-6">
                                <div className="text-center py-12">
                                    <p className="text-gray-500">
                                        نظام التعليقات قيد التطوير
                                    </p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Sidebar - 1/3 width */}
                    <aside className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <CardContent className="p-6">
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-gray-900 mb-2">
                                        {studentStrings.courseContent}
                                    </h2>
                                    {group && (
                                        <p className="text-sm text-gray-600">
                                            {studentStrings.unitOne(group.name)}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 mb-6">
                                    {groupLectures.map((item) => {
                                        const lid = (item.lecture as { _id?: string })._id ?? item.lecture.id;
                                        const isActive = lid === lectureId;
                                        const duration = item.video?.duration || 0;

                                        return (
                                            <div
                                                key={lid}
                                                onClick={() => {
                                                    if (!item.isLocked) {
                                                        navigate(`/student/lectures/${lid}`);
                                                    }
                                                }}
                                                className={`
                                                    p-3 rounded-lg transition-all cursor-pointer
                                                    ${isActive
                                                        ? "bg-blue-50 border-2 border-primary"
                                                        : item.isLocked
                                                        ? "bg-gray-50 opacity-60 cursor-not-allowed"
                                                        : "bg-white hover:bg-gray-50 border border-gray-200"
                                                    }
                                                `}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {item.isCompleted && !isActive ? (
                                                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                                    ) : item.isLocked ? (
                                                        <Lock className="h-5 w-5 text-gray-400 shrink-0" />
                                                    ) : isActive ? (
                                                        <Play className="h-5 w-5 text-primary shrink-0" />
                                                    ) : (
                                                        <div className="h-5 w-5 shrink-0" />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p
                                                            className={`
                                                                text-sm font-medium truncate
                                                                ${isActive ? "text-primary" : item.isLocked ? "text-gray-400" : "text-gray-900"}
                                                            `}
                                                        >
                                                            {item.lecture.title}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Clock className="h-3 w-3 text-gray-400" />
                                                            <span className="text-xs text-gray-500">
                                                                {formatDuration(duration)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Contact Support Button */}
                                <Button
                                    variant="outline"
                                    className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                                    onClick={() => navigate("/contact")}
                                >
                                    <Headphones className="h-4 w-4 ml-2" />
                                    {studentStrings.contactSupport}
                                </Button>
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </div>
        </StudentLayout>
    );
};

export default LectureDetail;
