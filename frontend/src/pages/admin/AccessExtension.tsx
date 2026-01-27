import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import Layout from '../../components/common/Layout';
import { accessService } from '../../services/accessService';
import { userService } from '../../services/userService';
import { lectureService } from '../../services/lectureService';
import { groupService } from '../../services/groupService';
import { User, Lecture, Group } from '../../types/api';

const AccessExtension: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedLecture, setSelectedLecture] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [additionalViews, setAdditionalViews] = useState(1);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupsData = await groupService.getAll();
        setGroups(groupsData);

        const studentsData = await userService.getAll();
        setStudents(studentsData.filter((s) => s.role === 'student'));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
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

  const handleExtend = async () => {
    if (!selectedStudent || !selectedLecture) {
      alert('Please select a student and lecture');
      return;
    }

    try {
      await accessService.extendAccess(selectedStudent, selectedLecture, additionalViews);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setSelectedStudent('');
      setSelectedLecture('');
      setAdditionalViews(1);
    } catch (error) {
      console.error('Failed to extend access:', error);
      alert('Failed to extend access');
    }
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Extend Student Access
      </Typography>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Access extended successfully!
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                <MenuItem key={group._id} value={group._id}>
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
                <MenuItem key={lecture._id} value={lecture._id}>
                  {lecture.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Student</InputLabel>
            <Select
              value={selectedStudent}
              label="Student"
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              {students.map((student) => (
                <MenuItem key={student._id} value={student._id}>
                  {student.name} ({student.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Additional Views"
            type="number"
            value={additionalViews}
            onChange={(e) => setAdditionalViews(parseInt(e.target.value) || 1)}
            fullWidth
            inputProps={{ min: 1 }}
          />

          <Button
            variant="contained"
            onClick={handleExtend}
            fullWidth
            disabled={!selectedStudent || !selectedLecture}
          >
            Extend Access
          </Button>
        </Box>
      </Paper>
    </Layout>
  );
};

export default AccessExtension;
