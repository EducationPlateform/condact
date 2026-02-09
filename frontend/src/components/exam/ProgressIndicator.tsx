interface ProgressIndicatorProps {
    currentQuestion: number;
    totalQuestions: number;
    progress: number; // percentage
}

const ProgressIndicator = ({ currentQuestion, totalQuestions, progress }: ProgressIndicatorProps) => {
    return (
        <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                    السؤال {currentQuestion} من {totalQuestions}
                </span>
                <span className="text-sm font-bold text-primary">
                    {progress}% مكتمل
                </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressIndicator;
