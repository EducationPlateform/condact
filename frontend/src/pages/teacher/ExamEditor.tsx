import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import Layout from '../../components/common/Layout';
import { examService } from '../../services/examService';
import { lectureService } from '../../services/lectureService';
import { groupService } from '../../services/groupService';
import { useNavigate } from 'react-router-dom';
import { Question, Lecture, Group } from '../../types/api';

const ExamEditor: React.FC = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedLecture, setSelectedLecture] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [maxScore, setMaxScore] = useState(100);
  const [timeLimit, setTimeLimit] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await groupService.getAll();
        setGroups(data);
      } catch (error) {
        console.error('Failed to fetch groups:', error);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchLectures = async () => {
      if (!selectedGroup) {
        setLectures([]);
        return;
      }
      try {
        const data = await lectureService.getByGroup(selectedGroup);
        setLectures(data);
      } catch (error) {
        console.error('Failed to fetch lectures:', error);
      }
    };
    fetchLectures();
  }, [selectedGroup]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        type: 'multiple-choice',
        options: ['', '', '', ''],
        correctAnswer: '',
        points: 1,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    if (!selectedLecture || !title || questions.length === 0) {
      alert('Please fill all required fields');
      return;
    }

    try {
      await examService.create({
        lectureId: selectedLecture,
        title,
        description,
        questions,
        maxScore,
        timeLimit,
        isActive: true,
      });
      navigate('/teacher/exams');
    } catch (error) {
      console.error('Failed to create exam:', error);
    }
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Create Exam
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Group</InputLabel>
            <Select
              value={selectedGroup}
              label="Group"
              onChange={(e) => {
                setSelectedGroup(e.target.value);
                setSelectedLecture('');
              }}
            >
              {groups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Lecture</InputLabel>
            <Select
              value={selectedLecture}
              label="Lecture"
              onChange={(e) => setSelectedLecture(e.target.value)}
              disabled={!selectedGroup}
            >
              {lectures.map((lecture) => (
                <MenuItem key={lecture.id} value={lecture.id}>
                  {lecture.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
          <TextField
            label="Max Score"
            type="number"
            value={maxScore}
            onChange={(e) => setMaxScore(parseInt(e.target.value) || 100)}
            fullWidth
          />
          <TextField
            label="Time Limit (minutes)"
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(parseInt(e.target.value) || 60)}
            fullWidth
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Button variant="outlined" startIcon={<Add />} onClick={addQuestion}>
            Add Question
          </Button>
        </Box>

        {questions.map((q, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Question {index + 1}</Typography>
              <IconButton color="error" onClick={() => removeQuestion(index)}>
                <Delete />
              </IconButton>
            </Box>
            <TextField
              label="Question"
              value={q.question}
              onChange={(e) => updateQuestion(index, 'question', e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={q.type}
                label="Type"
                onChange={(e) => updateQuestion(index, 'type', e.target.value)}
              >
                <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                <MenuItem value="true-false">True/False</MenuItem>
                <MenuItem value="text">Text</MenuItem>
              </Select>
            </FormControl>
            {q.type === 'multiple-choice' && (
              <Box sx={{ mb: 2 }}>
                {q.options?.map((opt, optIndex) => (
                  <TextField
                    key={optIndex}
                    label={`Option ${optIndex + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const newOptions = [...(q.options || [])];
                      newOptions[optIndex] = e.target.value;
                      updateQuestion(index, 'options', newOptions);
                    }}
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                ))}
                <TextField
                  label="Correct Answer"
                  value={q.correctAnswer}
                  onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                  fullWidth
                  sx={{ mt: 2 }}
                />
              </Box>
            )}
            {(q.type === 'true-false' || q.type === 'text') && (
              <TextField
                label="Correct Answer"
                value={q.correctAnswer}
                onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            )}
            <TextField
              label="Points"
              type="number"
              value={q.points}
              onChange={(e) => updateQuestion(index, 'points', parseInt(e.target.value) || 1)}
              fullWidth
            />
          </Paper>
        ))}

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button variant="outlined" onClick={() => navigate('/teacher/exams')}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Create Exam
          </Button>
        </Box>
      </Paper>
    </Layout>
  );
};

export default ExamEditor;
