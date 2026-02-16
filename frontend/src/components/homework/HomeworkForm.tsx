import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import QuestionComponent from './QuestionComponent';
import { Homework } from '../../types/api';
import { submissionService } from '../../services/submissionService';

interface HomeworkFormProps {
  homework: Homework;
  onSubmit: (score: number) => void;
}

const HomeworkForm: React.FC<HomeworkFormProps> = ({ homework, onSubmit }) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleAnswerChange = (index: number, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [index.toString()]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await submissionService.submitHomework(homework._id ?? homework.id, answers);
      setScore(result.score || 0);
      setSubmitted(true);
      onSubmit(result.score || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to submit homework');
    } finally {
      setLoading(false);
    }
  };

  if (submitted && score !== null) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Homework submitted successfully!
        </Alert>
        <Typography variant="h6">
          Your Score: {score} / {homework.maxScore}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          You can submit again to improve your score.
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setSubmitted(false);
            setScore(null);
            setAnswers({});
          }}
          sx={{ mt: 2 }}
        >
          Submit Again
        </Button>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {homework.title}
      </Typography>
      {homework.description && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {homework.description}
        </Typography>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box>
        {homework.questions.map((question, index) => (
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
          disabled={loading || homework.questions.length === 0}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit Homework'}
        </Button>
      </Box>
    </Paper>
  );
};

export default HomeworkForm;
