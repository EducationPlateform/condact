import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Award } from "lucide-react";
import StudentLayout from "@/components/layouts/StudentLayout";
import { LoadingScreen } from "@/components/common/Loading";
import { studentStrings } from "@/studentStrings";
import { Score } from "@/types/api";
import api from "@/services/api";

const Scores = () => {
    const [scores, setScores] = useState<Score[]>([]);
    const [loading, setLoading] = useState(true);
    const [showLoadingScreen, setShowLoadingScreen] = useState(true);

    useEffect(() => {
        const abortController = new AbortController();
        const { signal } = abortController;

        const fetchScores = async () => {
            try {
                const response = await api.get("scores", { signal });
                if (response.data.success && response.data.data) {
                    setScores(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch scores:", error);
            } finally {
                if (!abortController.signal.aborted) setLoading(false);
            }
        };

        fetchScores();
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

    return (
        <StudentLayout>
            <div className="mx-auto max-w-7xl">
                {/* Page Title */}
                <h1 className="mb-8 text-3xl font-extrabold text-gray-900">
                    {studentStrings.myScores}
                </h1>

                {/* Scores Table */}
                <Card className="rounded-xl shadow-sm">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                                            {studentStrings.myLectures}
                                        </th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                                            درجة الواجب
                                        </th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                                            درجة الامتحان
                                        </th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                                            المجموع
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {scores.length > 0 ? (
                                        scores.map((score) => {
                                            const scoreId = score.id || (score as any)._id;
                                            const lectureTitle = score.lectureTitle || (typeof score.lectureId === "object"
                                                ? score.lectureId.title
                                                : "—");

                                            return (
                                                <tr
                                                    key={scoreId}
                                                    className="transition-colors hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {lectureTitle}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-sm text-gray-600">
                                                        {score.homeworkScore ?? 0}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-sm text-gray-600">
                                                        {score.examScore ?? 0}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className="text-lg font-bold text-primary">
                                                            {score.totalScore}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-6 py-12 text-center"
                                            >
                                                <div className="flex flex-col items-center justify-center">
                                                    <Award className="mb-2 h-12 w-12 text-gray-400" />
                                                    <p className="text-gray-500">
                                                        لا توجد درجات متاحة
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </StudentLayout>
    );
};

export default Scores;
