import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Question } from "@/types/api";
import { studentStrings } from "@/studentStrings";

interface QuestionMapProps {
    questions: Question[];
    answers: Record<string, any>;
    currentIndex: number;
    onQuestionClick: (index: number) => void;
    onEndExam: () => void;
}

const QuestionMap = ({
    questions,
    answers,
    currentIndex,
    onQuestionClick,
    onEndExam,
}: QuestionMapProps) => {
    const getQuestionStatus = (index: number): "active" | "solved" | "remaining" => {
        if (index === currentIndex) return "active";
        const answer = answers[index.toString()];
        if (answer !== undefined && answer !== null && answer !== "") {
            return "solved";
        }
        return "remaining";
    };

    const getQuestionButtonClass = (status: "active" | "solved" | "remaining") => {
        switch (status) {
            case "active":
                return "bg-primary text-white hover:bg-primary/90";
            case "solved":
                return "border-2 border-green-500 bg-white text-gray-900 hover:bg-green-50";
            case "remaining":
                return "bg-gray-200 text-gray-700 hover:bg-gray-300";
        }
    };

    return (
        <Card className="sticky top-24 rounded-xl shadow-sm">
            <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                    {studentStrings.questionMap}
                </h3>

                {/* Legend */}
                <div className="mb-4 flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full border-2 border-green-500 bg-white"></div>
                        <span className="text-gray-600">{studentStrings.solved}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-gray-200"></div>
                        <span className="text-gray-600">{studentStrings.remaining}</span>
                    </div>
                </div>

                {/* Question Grid - Responsive: 3 columns on mobile, 5 on desktop */}
                <div className="mb-6 grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-5">
                    {questions.map((_, index) => {
                        const status = getQuestionStatus(index);
                        return (
                            <button
                                key={index}
                                onClick={() => onQuestionClick(index)}
                                className={`
                                    flex h-10 w-10 items-center justify-center rounded-lg font-semibold transition-colors
                                    ${getQuestionButtonClass(status)}
                                `}
                            >
                                {index + 1}
                            </button>
                        );
                    })}
                </div>

                {/* End Exam Button */}
                <Button
                    onClick={onEndExam}
                    variant="outline"
                    className="w-full border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                    {studentStrings.endExam}
                </Button>
            </CardContent>
        </Card>
    );
};

export default QuestionMap;
