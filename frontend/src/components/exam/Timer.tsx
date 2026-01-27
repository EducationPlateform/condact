import React, { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { Timer as TimerIcon } from '@mui/icons-material';

interface TimerProps {
  timeLimit: number; // in minutes
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ timeLimit, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // convert to seconds
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        setProgress((newTime / (timeLimit * 60)) * 100);
        if (newTime <= 0) {
          onTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timeLimit, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getColor = () => {
    if (timeLeft < 60) return 'error';
    if (timeLeft < 300) return 'warning';
    return 'primary';
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <TimerIcon color={getColor()} />
        <Typography variant="h6" color={getColor()}>
          Time Remaining: {formatTime(timeLeft)}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        color={getColor()}
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  );
};

export default Timer;
