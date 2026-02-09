import { Clock, User, GraduationCap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ExamHeaderProps {
    examTitle: string;
    timeLeft: number; // in seconds
}

const ExamHeader = ({ examTitle, timeLeft }: ExamHeaderProps) => {
    const { user } = useAuth();
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimerColor = () => {
        if (timeLeft < 60) return "text-red-600";
        if (timeLeft < 300) return "text-yellow-600";
        return "text-green-600";
    };

    return (
        <header className="sticky top-0 z-40 mb-6 flex flex-row-reverse items-center justify-between rounded-xl bg-gray-100 px-6 py-4">
            {/* Right Side (RTL) - Exam Title */}
            <div className="flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-gray-900">{examTitle}</h1>
            </div>

            {/* Left Side (RTL) - User Info & Timer */}
            <div className="flex items-center gap-4">
                {/* Timer */}
                <div className={`flex items-center gap-2 ${getTimerColor()}`}>
                    <Clock className="h-5 w-5" />
                    <span className="text-lg font-bold">{formatTime(timeLeft)}</span>
                </div>

                {/* User Avatar & Label */}
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-200 bg-white">
                        <User className="h-6 w-6 text-gray-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">الامتحان</span>
                </div>
            </div>
        </header>
    );
};

export default ExamHeader;
