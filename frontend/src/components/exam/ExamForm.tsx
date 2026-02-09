import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, ArrowRight } from "lucide-react";
import StudentLayout from "@/components/layouts/StudentLayout";
import ExamHeader from "./ExamHeader";
import QuestionMap from "./QuestionMap";
import ExamQuestionDisplay from "./ExamQuestionDisplay";
import ProgressIndicator from "./ProgressIndicator";
import NavigationButtons from "./NavigationButtons";
import AutoSaveStatus from "./AutoSaveStatus";
import Timer from "./Timer";
import { Exam } from '../../types/api';
import { submissionService } from '../../services/submissionService';
import { studentStrings } from '../../studentStrings';

interface ExamFormProps {
    exam: Exam;
    onSubmit: (score: number) => void;
}

const ExamForm: React.FC<ExamFormProps> = ({ exam, onSubmit }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [timeUp, setTimeUp] = useState(false);
    const [timeLeft, setTimeLeft] = useState(exam.timeLimit * 60);
    const [autoSaved, setAutoSaved] = useState(false);
    const [showEndExamDialog, setShowEndExamDialog] = useState(false);

    const examId = (exam as { _id?: string })._id ?? exam.id ?? "unknown";
    const storageKey = `exam_${examId}_answers`;

    // Load saved answers from localStorage
    useEffect(() => {
        const savedAnswers = localStorage.getItem(storageKey);
        if (savedAnswers) {
            try {
                const parsed = JSON.parse(savedAnswers);
                setAnswers(parsed);
            } catch (err) {
                console.error("Failed to load saved answers:", err);
            }
        }
    }, [storageKey]);

    // Auto-save answers
    useEffect(() => {
        if (Object.keys(answers).length > 0 && !submitted) {
            localStorage.setItem(storageKey, JSON.stringify(answers));
            setAutoSaved(true);
            const timer = setTimeout(() => setAutoSaved(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [answers, storageKey, submitted]);

    const handleAnswerChange = useCallback((value: any) => {
        setAnswers((prev) => ({
            ...prev,
            [currentIndex.toString()]: value,
        }));
    }, [currentIndex]);

    const handleQuestionClick = (index: number) => {
        setCurrentIndex(index);
    };

    const handleNext = () => {
        if (currentIndex < exam.questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleEndExam = () => {
        setShowEndExamDialog(true);
    };

    const handleConfirmEndExam = async () => {
        await handleSubmit();
        setShowEndExamDialog(false);
    };

    const handleSubmit = async () => {
        if (submitted) return;

        setLoading(true);
        setError('');

        try {
            // For dummy exam, simulate submission
            if (examId === "dummy-exam-1") {
                // Calculate score manually for dummy exam
                let calculatedScore = 0;
                exam.questions.forEach((q, idx) => {
                    const answer = answers[idx.toString()];
                    if (answer === q.correctAnswer) {
                        calculatedScore += q.points;
                    }
                });
                setScore(calculatedScore);
                setSubmitted(true);
                localStorage.removeItem(storageKey);
                onSubmit(calculatedScore);
            } else {
                const result = await submissionService.submitExam(examId, answers);
                setScore(result.score || 0);
                setSubmitted(true);
                localStorage.removeItem(storageKey);
                onSubmit(result.score || 0);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to submit exam');
        } finally {
            setLoading(false);
        }
    };

    const handleTimeUp = () => {
        setTimeUp(true);
        handleSubmit();
    };

    const handleTimeUpdate = (time: number) => {
        setTimeLeft(time);
    };

    // Calculate progress
    const answeredCount = Object.values(answers).filter(
        (answer) => answer !== undefined && answer !== null && answer !== ""
    ).length;
    const progressPercentage = exam.questions.length > 0
        ? Math.round((answeredCount / exam.questions.length) * 100)
        : 0;

    const currentQuestion = exam.questions[currentIndex];
    const hasNext = currentIndex < exam.questions.length - 1;
    const hasPrevious = currentIndex > 0;

    // Show submitted state
    if (submitted && score !== null) {
        return (
            <StudentLayout>
                <Card className="mx-auto max-w-2xl rounded-xl">
                    <CardContent className="p-8 text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="rounded-full bg-green-100 p-4">
                                <AlertCircle className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                        <h2 className="mb-2 text-2xl font-bold text-gray-900">
                            تم تسليم الامتحان بنجاح
                        </h2>
                        <p className="mb-4 text-lg text-gray-600">
                            علامتك: <span className="font-bold text-primary">{score}</span> / {exam.maxScore}
                        </p>
                        <p className="text-sm text-gray-500">
                            {studentStrings.noEditAfterSubmit}
                        </p>
                    </CardContent>
                </Card>
            </StudentLayout>
        );
    }

    // Show time up dialog
    if (timeUp && !submitted && loading) {
        return (
            <StudentLayout>
                <Card className="mx-auto max-w-2xl rounded-xl">
                    <CardContent className="p-8 text-center">
                        <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
                        <h2 className="mb-2 text-xl font-bold text-gray-900">
                            انتهى الوقت!
                        </h2>
                        <p className="text-gray-600">
                            يتم تسليم الامتحان تلقائياً...
                        </p>
                    </CardContent>
                </Card>
            </StudentLayout>
        );
    }

    if (!currentQuestion) {
        return null;
    }

    return (
        <StudentLayout>
            <div className="mx-auto max-w-7xl px-4">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => {
                        // Answers are auto-saved, so we can safely go back
                        onSubmit(0);
                    }}
                    className="mb-4"
                    disabled={submitted}
                >
                    <ArrowRight className="h-4 w-4 ml-2 rotate-180" />
                    العودة إلى الامتحانات
                </Button>

                {/* Exam Header */}
                <ExamHeader examTitle={exam.title} timeLeft={timeLeft} />

                {/* Timer Logic Component */}
                <Timer
                    timeLimit={exam.timeLimit}
                    onTimeUp={handleTimeUp}
                    onTimeUpdate={handleTimeUpdate}
                />

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 flex items-center gap-2 text-red-800">
                        <AlertCircle className="h-5 w-5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Main Content Card */}
                <Card className="rounded-xl shadow-sm">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Question Map Sidebar (1/3 width) - Appears on right in RTL */}
                            <div className="lg:col-span-1">
                                <QuestionMap
                                    questions={exam.questions}
                                    answers={answers}
                                    currentIndex={currentIndex}
                                    onQuestionClick={handleQuestionClick}
                                    onEndExam={handleEndExam}
                                />
                            </div>

                            {/* Main Question Area (2/3 width) - Appears on left in RTL */}
                            <div className="lg:col-span-2">
                                {/* Progress Indicator */}
                                <ProgressIndicator
                                    currentQuestion={currentIndex + 1}
                                    totalQuestions={exam.questions.length}
                                    progress={progressPercentage}
                                />

                                {/* Question Display */}
                                <ExamQuestionDisplay
                                    question={currentQuestion}
                                    answer={answers[currentIndex.toString()]}
                                    onChange={handleAnswerChange}
                                />

                                {/* Navigation Buttons */}
                                <NavigationButtons
                                    onNext={handleNext}
                                    onPrevious={handlePrevious}
                                    hasNext={hasNext}
                                    hasPrevious={hasPrevious}
                                />

                                {/* Auto-Save Status */}
                                <AutoSaveStatus visible={autoSaved} />

                                {/* Support Message */}
                                <div className="mt-6 text-xs text-gray-500">
                                    إذا واجهت أي مشكلة تقنية، يرجى التواصل مع مراقب اللجنة فوراً.
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* End Exam Confirmation Dialog */}
            <Dialog open={showEndExamDialog} onOpenChange={setShowEndExamDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{studentStrings.confirmSubmitTitle}</DialogTitle>
                        <DialogDescription>
                            {studentStrings.confirmSubmitQuestion}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="rounded-lg bg-gray-50 p-4">
                            <p className="mb-2 text-sm font-medium text-gray-700">
                                {studentStrings.answerStatus}
                            </p>
                            <p className="text-sm text-gray-600">
                                {studentStrings.answeredCount(answeredCount, exam.questions.length)}
                            </p>
                            {answeredCount < exam.questions.length && (
                                <p className="mt-2 text-sm text-yellow-600">
                                    {studentStrings.unansweredWarning(exam.questions.length - answeredCount)}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="flex-row-reverse gap-2">
                        <Button
                            onClick={handleConfirmEndExam}
                            disabled={loading}
                            className="bg-primary text-white hover:bg-primary/90"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                                    جاري التسليم...
                                </>
                            ) : (
                                studentStrings.confirmSubmit
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setShowEndExamDialog(false)}
                            disabled={loading}
                        >
                            {studentStrings.returnToReview}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </StudentLayout>
    );
};

export default ExamForm;
