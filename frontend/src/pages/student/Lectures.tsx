import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Clock,
    FileText,
    Lock,
    Plus,
    ArrowLeft,
    Loader2,
    BookOpen,
} from "lucide-react";
import StudentLayout from "@/components/layouts/StudentLayout";
import { LoadingScreen } from "@/components/common/Loading";
import { groupService } from "@/services/groupService";
import { lectureService } from "@/services/lectureService";
import { accessService } from "@/services/accessService";
import { studentStrings } from "@/studentStrings";
import { useAuth } from "@/context/AuthContext";
import { Group, Lecture, StudentAccess } from "@/types/api";

interface CourseData {
    group: Group;
    lectures: Lecture[];
    totalLectures: number;
    completedLectures: number;
    progressPercentage: number;
    lastAccessedLecture: Lecture | null;
    lastAccessedDate: Date | null;
    hasAccess: boolean;
    isLocked: boolean;
}

const Lectures = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [showLoadingScreen, setShowLoadingScreen] = useState(true);
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [summary, setSummary] = useState({
        totalLearningHours: 42.5,
        completedCourses: 0,
        remainingLessons: 0,
    });

    useEffect(() => {
        const abortController = new AbortController();
        const { signal } = abortController;

        const fetchData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const groups = await groupService.getAll(signal);
                const coursesData: CourseData[] = [];
                let completedCoursesCount = 0;
                let remainingLessonsCount = 0;

                for (const group of groups) {
                    const gid = group.id || (group as any)._id;
                    try {
                        const groupLectures = await lectureService.getByGroup(gid);

                        if (groupLectures.length === 0) continue;

                        // Check access for each lecture
                        const lectureAccessMap = new Map<string, StudentAccess | null>();
                        let hasAnyAccess = false;
                        let completedCount = 0;
                        let lastAccessed: { lecture: Lecture; date: Date } | null = null;

                        for (const lecture of groupLectures) {
                            const lid = lecture.id || (lecture as any)._id;
                            try {
                                const access = await accessService.checkAccess(lid);
                                lectureAccessMap.set(lid, access);
                                hasAnyAccess = true;

                                if (access.currentViews > 0) {
                                    completedCount++;
                                }

                                if (access.lastViewedAt) {
                                    const viewedDate = new Date(access.lastViewedAt);
                                    if (!lastAccessed || viewedDate > lastAccessed.date) {
                                        lastAccessed = { lecture, date: viewedDate };
                                    }
                                }
                            } catch {
                                lectureAccessMap.set(lid, null);
                            }
                        }

                        const totalLectures = groupLectures.length;
                        const progressPercentage = totalLectures > 0
                            ? Math.round((completedCount / totalLectures) * 100)
                            : 0;

                        const isLocked = !hasAnyAccess;

                        if (progressPercentage > 0) {
                            completedCoursesCount++;
                        }

                        // Count remaining lessons (unpublished or not accessed)
                        const remaining = groupLectures.filter(l => {
                            const lid = l.id || (l as any)._id;
                            const access = lectureAccessMap.get(lid);
                            return !l.isPublished || (access && access.currentViews === 0);
                        }).length;
                        remainingLessonsCount += remaining;

                        coursesData.push({
                            group,
                            lectures: groupLectures,
                            totalLectures,
                            completedLectures: completedCount,
                            progressPercentage,
                            lastAccessedLecture: lastAccessed?.lecture || null,
                            lastAccessedDate: lastAccessed?.date || null,
                            hasAccess: hasAnyAccess,
                            isLocked,
                        });
                    } catch (err) {
                        // Skip groups without lectures
                    }
                }

                // Sort courses by last accessed date (most recent first), then by progress
                coursesData.sort((a, b) => {
                    if (a.lastAccessedDate && b.lastAccessedDate) {
                        return b.lastAccessedDate.getTime() - a.lastAccessedDate.getTime();
                    }
                    if (a.lastAccessedDate) return -1;
                    if (b.lastAccessedDate) return 1;
                    return b.progressPercentage - a.progressPercentage;
                });

                setCourses(coursesData);
                setSummary({
                    totalLearningHours: 42.5, // Placeholder - can be calculated from video durations
                    completedCourses: completedCoursesCount,
                    remainingLessons: remainingLessonsCount,
                });
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                if (!abortController.signal.aborted) setLoading(false);
            }
        };

        fetchData();
        return () => abortController.abort();
    }, [user]);

    const getNextLecture = (course: CourseData): Lecture | null => {
        // Find first lecture that hasn't been completed
        for (const lecture of course.lectures) {
            // For now, return first published lecture
            if (lecture.isPublished) {
                return lecture;
            }
        }
        return course.lectures[0] || null;
    };

    const handleCourseClick = (course: CourseData) => {
        if (course.isLocked) {
            // Handle locked course - could show subscription modal
            return;
        }
        const nextLecture = getNextLecture(course);
        if (nextLecture) {
            const lid = nextLecture.id || (nextLecture as any)._id;
            navigate(`/student/lectures/${lid}`);
        }
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

    return (
        <StudentLayout>
            {/* Main Content Wrapper */}
            <div className="mx-auto max-w-7xl">
                {/* White Container with Blue Top Border */}
                <div className="rounded-2xl bg-white shadow-sm border-t-4 border-primary">
                    {/* Page Header Section */}
                    <div className="px-8 pt-8 pb-6">
                        <h1 className="mb-2 text-3xl font-extrabold font-inter text-gray-900 text-center">
                            {studentStrings.myCourses}
                        </h1>
                        <p className="text-center text-gray-500 text-base font-inter mb-4">
                            {user ? studentStrings.welcome(user.name) : "مرحباً بك"}
                        </p>
                        {/* Dashed Blue Separator */}
                        <div className="border-t-2 border-dashed border-primary/30"></div>
                    </div>

                    {/* Course Cards Grid */}
                    <div className="px-8 pb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Summary Card */}
                            <Card className="bg-primary text-primary-foreground border-none shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <p className="text-sm opacity-90 mb-2">
                                                {studentStrings.totalLearningHours}
                                            </p>
                                            <p className="text-4xl font-extrabold mb-2">
                                                {summary.totalLearningHours}
                                            </p>
                                        </div>
                                        <div className="space-y-1 text-sm">
                                            <p>{studentStrings.completedCourses(summary.completedCourses)}</p>
                                            <p>{studentStrings.lessonsRemainingThisWeek(summary.remainingLessons)}</p>
                                        </div>
                                        <Button
                                            variant="secondary"
                                            className="w-full bg-white text-primary hover:bg-white/90 mt-2"
                                            onClick={() => navigate("/student/scores")}
                                        >
                                            {studentStrings.viewCertificates}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Explore New Courses Card */}
                            <Card className="border-2 border-dashed border-gray-300 hover:border-primary transition-colors cursor-pointer">
                                <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                                    <div className="mb-4 rounded-full bg-primary/10 p-6">
                                        <Plus className="h-12 w-12 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {studentStrings.discoverNewCourses}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {studentStrings.discoverSubtext}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Course Cards */}
                            {courses.map((course) => {
                                const groupId = course.group.id || (course.group as any)._id;

                                return (
                                    <Card
                                        key={groupId}
                                        className={`rounded-2xl shadow-sm transition-shadow hover:shadow-md overflow-hidden ${course.isLocked ? "opacity-75" : "cursor-pointer"
                                            }`}
                                        onClick={() => !course.isLocked && handleCourseClick(course)}
                                    >
                                        {/* Course Thumbnail */}
                                        <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 relative overflow-hidden">
                                            {course.isLocked && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                    <Lock className="h-16 w-16 text-white" />
                                                </div>
                                            )}
                                        </div>

                                        <CardContent className="p-6">
                                            {/* Course Title */}
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {course.group.name}
                                            </h3>

                                            {/* Course Description */}
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                {course.group.description ||
                                                    (course.lectures[0]?.title || "لا يوجد وصف")}
                                            </p>

                                            {/* Progress Section */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-gray-600">
                                                        {studentStrings.progressInCourse}
                                                    </span>
                                                    <span className="text-lg font-bold text-primary">
                                                        {course.progressPercentage}%
                                                    </span>
                                                </div>
                                                {/* Progress Bar */}
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className="bg-primary h-2.5 rounded-full transition-all duration-500"
                                                        style={{ width: `${course.progressPercentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* Meta Information */}
                                            <div className="space-y-2 mb-4">
                                                {course.lastAccessedLecture ? (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Clock className="h-4 w-4" />
                                                        <span>
                                                            {studentStrings.lastSession}: {course.lastAccessedLecture.title}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                                        <Clock className="h-4 w-4" />
                                                        <span>لم يتم الوصول بعد</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <FileText className="h-4 w-4" />
                                                    <span>
                                                        {studentStrings.lessonsCount(
                                                            course.completedLectures,
                                                            course.totalLectures
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            {course.isLocked ? (
                                                <Button
                                                    className="w-full bg-primary text-white"
                                                    disabled
                                                >
                                                    <Lock className="h-4 w-4 ml-2" />
                                                    اشترك الآن للبدء
                                                </Button>
                                            ) : (
                                                <Button
                                                    className="w-full bg-primary text-white hover:bg-primary/90"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCourseClick(course);
                                                    }}
                                                >
                                                    {studentStrings.continueCourse}
                                                    <ArrowLeft className="h-4 w-4 ml-2" />
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}

                            {/* Empty State */}
                            {courses.length === 0 && (
                                <div className="col-span-full text-center py-12">
                                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">
                                        لا توجد دورات متاحة حالياً
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

export default Lectures;
