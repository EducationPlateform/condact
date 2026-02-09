import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    Calendar,
    Clock,
    Loader2,
    ClipboardList,
    ArrowRight,
} from "lucide-react";
import StudentLayout from "@/components/layouts/StudentLayout";
import { LoadingScreen } from "@/components/common/Loading";
import HomeworkForm from "@/components/homework/HomeworkForm";
import { studentStrings } from "@/studentStrings";
import { homeworkService } from "@/services/homeworkService";
import { lectureService } from "@/services/lectureService";
import { groupService } from "@/services/groupService";
import { Homework, Lecture } from "@/types/api";

const StudentHomework = () => {
    const [homeworks, setHomeworks] = useState<
        { homework: Homework; lecture: Lecture }[]
    >([]);
    const [selectedHomework, setSelectedHomework] = useState<Homework | null>(
        null,
    );
    const [loading, setLoading] = useState(true);
    const [showLoadingScreen, setShowLoadingScreen] = useState(true);

    useEffect(() => {
        const abortController = new AbortController();
        const { signal } = abortController;

        const fetchHomeworks = async () => {
            try {
                const groups = await groupService.getAll(signal);
                const allHomeworks: { homework: Homework; lecture: Lecture }[] = [];

                for (const group of groups) {
                    const gid = (group as { _id?: string })._id ?? group.id;
                    try {
                        const lectures = await lectureService.getByGroup(gid);
                        for (const lecture of lectures) {
                            const lid = (lecture as { _id?: string })._id ?? lecture.id;
                            try {
                                const homework = await homeworkService.getByLecture(lid);
                                allHomeworks.push({ homework, lecture });
                            } catch (err) {
                                // No homework for this lecture
                            }
                        }
                    } catch (err) {
                        // Skip
                    }
                }

                setHomeworks(allHomeworks);
            } catch (error) {
                console.error("Failed to fetch homeworks:", error);
            } finally {
                if (!abortController.signal.aborted) setLoading(false);
            }
        };

        fetchHomeworks();
        return () => abortController.abort();
    }, []);

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

    if (selectedHomework) {
        return (
            <StudentLayout>
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => setSelectedHomework(null)}
                        className="mb-4"
                    >
                        <ArrowRight className="h-4 w-4 ml-2 rotate-180" />
                        العودة إلى قائمة الواجبات
                    </Button>
                    <HomeworkForm
                        homework={selectedHomework}
                        onSubmit={() => {
                            setSelectedHomework(null);
                            // Refresh list
                        }}
                    />
                </div>
            </StudentLayout>
        );
    }

    return (
        <StudentLayout>
            <div className="mx-auto max-w-7xl">
                {/* Page Title */}
                <h1 className="mb-8 text-3xl font-extrabold text-gray-900">
                    {studentStrings.myHomework}
                </h1>

                {/* Homework Cards Grid */}
                {homeworks.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {homeworks.map((item) => {
                            const homeworkId = (item.homework as { _id?: string })._id ?? item.homework.id;
                            const lectureTitle = typeof item.lecture === "object"
                                ? item.lecture.title
                                : "—";

                            return (
                                <Card
                                    key={homeworkId}
                                    className="rounded-xl shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <CardContent className="p-6">
                                        <div className="mb-4 flex items-start justify-between">
                                            <div className="rounded-lg bg-blue-50 p-3">
                                                <ClipboardList className="h-6 w-6 text-primary" />
                                            </div>
                                        </div>

                                        <h3 className="mb-2 text-xl font-bold text-gray-900">
                                            {item.homework.title}
                                        </h3>

                                        <div className="mb-4 space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                <span>
                                                    {studentStrings.myLectures}: {lectureTitle}
                                                </span>
                                            </div>

                                            {item.homework.dueDate && (
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>
                                                        {studentStrings.due}: {new Date(item.homework.dueDate).toLocaleDateString("ar-EG")}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                <span>
                                                    {item.homework.questions.length} أسئلة • العلامة الكاملة: {item.homework.maxScore}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="p-6 pt-0">
                                        <Button
                                            className="w-full bg-primary text-white hover:bg-primary/90"
                                            onClick={() => setSelectedHomework(item.homework)}
                                        >
                                            {studentStrings.viewHomework}
                                            <ArrowRight className="h-4 w-4 ml-2 rotate-180" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                        <ClipboardList className="mb-4 h-16 w-16 text-gray-400" />
                        <p className="text-lg text-gray-500">
                            لا توجد واجبات متاحة
                        </p>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
};

export default StudentHomework;
