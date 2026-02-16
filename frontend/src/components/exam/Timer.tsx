import { useEffect, useState } from 'react';

interface TimerProps {
    timeLimit: number; // in minutes
    onTimeUp: () => void;
    onTimeUpdate?: (timeLeft: number) => void;
}

const Timer: React.FC<TimerProps> = ({ timeLimit, onTimeUp, onTimeUpdate }) => {
    const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // convert to seconds

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                const newTime = prev - 1;
                if (onTimeUpdate) {
                    onTimeUpdate(newTime);
                }
                if (newTime <= 0) {
                    onTimeUp();
                    return 0;
                }
                return newTime;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, timeLimit, onTimeUp, onTimeUpdate]);

    // This component is now just for logic - display is handled by ExamHeader
    return null;
};

export default Timer;
