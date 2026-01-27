import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import { Quiz } from '@mui/icons-material';
import Layout from '../../components/common/Layout';
import Loading from '../../components/common/Loading';
import ExamForm from '../../components/exam/ExamForm';
import { examService } from '../../services/examService';
import { lectureService } from '../../services/lectureService';
import { submissionService } from '../../services/submissionService';
import { Exam, Lecture, Submission } from '../../types/api';

const Exams: React.FC = () => {
  const [exams, setExams] = useState<{ exam: Exam; lecture: Lecture }[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groups = await import('../../services/groupService').then((m) => m.groupService.getAll());
        const allExams: { exam: Exam; lecture: Lecture }[] = [];

        for (const group of groups) {
          try {
            const lectures = await lectureService.getByGroup(group._id);
            for (const lecture of lectures) {
              try {
                const exam = await examService.getByLecture(lecture._id);
                allExams.push({ exam, lecture });
              } catch (err) {
                // No exam for this lecture
              }
            }
          } catch (err) {
            // Skip
          }
        }

        setExams(allExams);

        const subs = await submissionService.getAll();
        setSubmissions(subs.filter((s) => s.type === 'exam'));
      } catch (error) {
        console.error('Failed to fetch exams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const hasSubmitted = (examId: string) => {
    return submissions.some((s) => s.examId === examId || (typeof s.examId === 'object' && s.examId._id === examId));
  };

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (selectedExam) {
    return (
      <Layout>
        <Button onClick={() => setSelectedExam(null)} sx={{ mb: 2 }}>
          Back to Exams
        </Button>
        <ExamForm
          exam={selectedExam}
          onSubmit={() => {
            setSelectedExam(null);
            // Refresh
          }}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        My Exams
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {exams.map((item) => {
          const submitted = hasSubmitted(item.exam._id);
          return (
            <Grid item xs={12} md={6} key={item.exam._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.exam.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lecture: {typeof item.lecture === 'object' ? item.lecture.title : 'Unknown'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {item.exam.questions.length} questions • Max Score: {item.exam.maxScore} • Time Limit: {item.exam.timeLimit} minutes
                  </Typography>
                  {submitted && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      You have already submitted this exam
                    </Alert>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<Quiz />}
                    onClick={() => setSelectedExam(item.exam)}
                    disabled={submitted || !item.exam.isActive}
                  >
                    {submitted ? 'Already Submitted' : 'Start Exam'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
        {exams.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" align="center">
              No exams available
            </Typography>
          </Grid>
        )}
      </Grid>
    </Layout>
  );
};

export default Exams;
