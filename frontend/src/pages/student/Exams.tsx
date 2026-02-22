import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    FileQuestion,
    Clock,
    Loader2,
    ClipboardCheck,
    CheckCircle2,
    ArrowRight,
    AlertCircle,
} from "lucide-react";
import StudentLayout from "@/components/layouts/StudentLayout";
import { LoadingScreen } from "@/components/common/Loading";
import ExamForm from "@/components/exam/ExamForm";
import { studentStrings } from "@/studentStrings";
import { examService } from "@/services/examService";
import { lectureService } from "@/services/lectureService";
import { submissionService } from "@/services/submissionService";
import { groupService } from "@/services/groupService";
import { createDummyExam } from "@/utils/dummyExam";
import { Exam, Lecture, Submission } from "@/types/api";

const Exams = () => {
    const [exams, setExams] = useState<{ exam: Exam; lecture: Lecture }[]>([]);
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [showLoadingScreen, setShowLoadingScreen] = useState(true);

    useEffect(() => {
        const abortController = new AbortController();
        const { signal } = abortController;

        const fetchData = async () => {
            try {
                const groups = await groupService.getAll(signal);
                const allExams: { exam: Exam; lecture: Lecture }[] = [];

                for (const group of groups) {
                    const gid = group.id || (group as any)._id;
                    try {
                        const lectures = await lectureService.getByGroup(gid);
                        for (const lecture of lectures) {
                            const lid = lecture.id || (lecture as any)._id;
                            try {
                                const exam = await examService.getByLecture(lid);
                                allExams.push({ exam, lecture });
                            } catch (err) {
                                // No exam for this lecture
                            }
                        }
                    } catch (err) {
                        // Skip
                    }
                }

                setExams(allExams);

                const subs = await submissionService.getAll();
                setSubmissions(subs.filter((s) => s.type === "exam"));
            } catch (error) {
                console.error("Failed to fetch exams:", error);
            } finally {
                if (!abortController.signal.aborted) setLoading(false);
            }
        };

        fetchData();
        return () => abortController.abort();
    }, []);

    const hasSubmitted = (examId: string) => {
        return submissions.some(
            (s) =>
                s.examId === examId ||
                (typeof s.examId === "object" && ((s.examId as any).id || (s.examId as any)._id) === examId),
        );
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

    if (selectedExam) {
        return (
            <ExamForm
                exam={selectedExam}
                onSubmit={() => {
                    setSelectedExam(null);
                    // Refresh
                }}
            />
        );
    }

    return (
        <StudentLayout>
            <div className="mx-auto max-w-7xl">
                {/* Page Title */}
                <h1 className="mb-8 text-3xl font-extrabold text-gray-900">
                    {studentStrings.myExams}
                </h1>

                {/* Dummy Exam Card for Testing */}
                <Card className="mb-6 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="mb-1 text-lg font-bold text-gray-900">
                                    اختبار تجريبي
                                </h3>
                                <p className="text-sm text-gray-600">
                                    اختبار تجريبي مع 20 سؤال للتعرف على واجهة الامتحان
                                </p>
                            </div>
                            <Button
                                onClick={() => setSelectedExam(createDummyExam())}
                                className="bg-primary text-white hover:bg-primary/90"
                            >
                                {studentStrings.startExam}
                                <ArrowRight className="h-4 w-4 ml-2 rotate-180" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Exam Cards Grid */}
                {exams.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {exams.map((item) => {
                            const examId = item.exam.id || (item.exam as any)._id;
                            const submitted = hasSubmitted(examId);
                            const lectureTitle = typeof item.lecture === "object"
                                ? item.lecture.title
                                : "—";

                            return (
                                <Card
                                    key={examId}
                                    className="rounded-xl shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <CardContent className="p-6">
                                        <div className="mb-4 flex items-start justify-between">
                                            <div className="rounded-lg bg-blue-50 p-3">
                                                <FileQuestion className="h-6 w-6 text-primary" />
                                            </div>
                                            {submitted && (
                                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                                    <CheckCircle2 className="h-3 w-3 ml-1" />
                                                    تم التسليم
                                                </Badge>
                                            )}
                                            {!item.exam.isActive && (
                                                <Badge variant="secondary">
                                                    غير نشط
                                                </Badge>
                                            )}
                                        </div>

                                        <h3 className="mb-2 text-xl font-bold text-gray-900">
                                            {item.exam.title}
                                        </h3>

                                        <div className="mb-4 space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <ClipboardCheck className="h-4 w-4" />
                                                <span>
                                                    {studentStrings.myLectures}: {lectureTitle}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <FileQuestion className="h-4 w-4" />
                                                <span>
                                                    {item.exam.questions.length} أسئلة • العلامة الكاملة: {item.exam.maxScore}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                <span>
                                                    الوقت المحدد: {item.exam.timeLimit} دقيقة
                                                </span>
                                            </div>
                                        </div>

                                        {submitted && (
                                            <div className="mb-4 flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                                                <AlertCircle className="h-4 w-4" />
                                                <span>لقد قمت بتسليم هذا الامتحان مسبقاً</span>
                                            </div>
                                        )}
                                    </CardContent>

                                    <CardFooter className="p-6 pt-0">
                                        <Button
                                            className="w-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => setSelectedExam(item.exam)}
                                            disabled={submitted || !item.exam.isActive}
                                        >
                                            {submitted ? "تم التسليم" : studentStrings.startExam}
                                            {!submitted && item.exam.isActive && (
                                                <ArrowRight className="h-4 w-4 ml-2 rotate-180" />
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                        <FileQuestion className="mb-4 h-16 w-16 text-gray-400" />
                        <p className="text-lg text-gray-500">
                            لا توجد امتحانات متاحة
                        </p>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
};

export default Exams;
