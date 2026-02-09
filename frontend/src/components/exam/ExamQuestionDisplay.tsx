import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Question } from "@/types/api";

interface ExamQuestionDisplayProps {
    question: Question;
    answer: any;
    onChange: (value: any) => void;
}

const ExamQuestionDisplay = ({ question, answer, onChange }: ExamQuestionDisplayProps) => {
    const renderQuestion = () => {
        switch (question.type) {
            case "multiple-choice":
                return (
                    <RadioGroup
                        value={answer || ""}
                        onValueChange={onChange}
                        className="mt-4 space-y-3"
                    >
                        {question.options?.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center space-x-2 space-x-reverse">
                                <RadioGroupItem value={option} id={`option-${optIndex}`} />
                                <Label
                                    htmlFor={`option-${optIndex}`}
                                    className="flex-1 cursor-pointer text-base font-normal text-gray-700"
                                >
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                );

            case "true-false":
                return (
                    <RadioGroup
                        value={answer || ""}
                        onValueChange={onChange}
                        className="mt-4 space-y-3"
                    >
                        <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="true" id="true-option" />
                            <Label htmlFor="true-option" className="cursor-pointer text-base font-normal text-gray-700">
                                صحيح
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value="false" id="false-option" />
                            <Label htmlFor="false-option" className="cursor-pointer text-base font-normal text-gray-700">
                                خطأ
                            </Label>
                        </div>
                    </RadioGroup>
                );

            case "text":
                return (
                    <Textarea
                        value={answer || ""}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="أدخل إجابتك هنا..."
                        className="mt-4 min-h-[120px] resize-none"
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">{question.question}</h2>
            {renderQuestion()}
        </div>
    );
};

export default ExamQuestionDisplay;
