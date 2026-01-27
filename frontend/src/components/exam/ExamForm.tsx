import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import QuestionComponent from '../homework/QuestionComponent';
import Timer from './Timer';
import { Exam } from '../../types/api';
import { submissionService } from '../../services/submissionService';

interface ExamFormProps {
  exam: Exam;
  onSubmit: (score: number) => void;
}

const ExamForm: React.FC<ExamFormProps> = ({ exam, onSubmit }) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [timeUp, setTimeUp] = useState(false);

  useEffect(() => {
    if (timeUp && !submitted) {
      handleSubmit();
    }
  }, [timeUp]);

  const handleAnswerChange = (index: number, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [index.toString()]: value,
    }));
  };

  const handleSubmit = async () => {
    if (submitted) return;

    setLoading(true);
    setError('');

    try {
      const result = await submissionService.submitExam(exam._id, answers);
      setScore(result.score || 0);
      setSubmitted(true);
      onSubmit(result.score || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to submit exam');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUp = () => {
    setTimeUp(true);
  };

  if (submitted && score !== null) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Exam submitted!
        </Alert>
        <Typography variant="h6">
          Your Score: {score} / {exam.maxScore}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          This exam can only be taken once.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {exam.title}
      </Typography>
      {exam.description && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {exam.description}
        </Typography>
      )}

      <Timer timeLimit={exam.timeLimit} onTimeUp={handleTimeUp} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box>
        {exam.questions.map((question, index) => (
          <QuestionComponent
            key={index}
            question={question}
            index={index}
            value={answers[index.toString()]}
            onChange={(value) => handleAnswerChange(index, value)}
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || exam.questions.length === 0}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit Exam'}
        </Button>
      </Box>

      <Dialog open={timeUp && !submitted}>
        <DialogTitle>Time's Up!</DialogTitle>
        <DialogContent>
          <Typography>Your exam is being submitted automatically.</Typography>
        </DialogContent>
        <DialogActions>
          {loading && <CircularProgress size={24} />}
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ExamForm;
