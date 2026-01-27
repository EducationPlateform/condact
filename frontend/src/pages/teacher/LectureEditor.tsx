import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControlLabel,
  Switch,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import Layout from '../../components/common/Layout';
import { lectureService } from '../../services/lectureService';
import { groupService } from '../../services/groupService';
import { Lecture, Group } from '../../types/api';

const LectureEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [formData, setFormData] = useState({
    groupId: '',
    title: '',
    description: '',
    scheduledDate: '',
    isPublished: false,
    order: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupsData = await groupService.getAll();
        setGroups(groupsData);

        if (id) {
          const lecture = await lectureService.getById(id);
          setFormData({
            groupId: typeof lecture.groupId === 'object' ? lecture.groupId._id : lecture.groupId,
            title: lecture.title,
            description: lecture.description || '',
            scheduledDate: lecture.scheduledDate ? new Date(lecture.scheduledDate).toISOString().split('T')[0] : '',
            isPublished: lecture.isPublished,
            order: lecture.order,
          });
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    try {
      if (id) {
        await lectureService.update(id, formData);
      } else {
        await lectureService.create(formData);
      }
      navigate('/teacher/lectures');
    } catch (error) {
      console.error('Failed to save lecture:', error);
    }
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        {id ? 'Edit Lecture' : 'Create Lecture'}
      </Typography>
      <Paper sx={{ p: 3, maxWidth: 800 }}>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Group</InputLabel>
            <Select
              value={formData.groupId}
              label="Group"
              onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
              required
            >
              {groups.map((group) => (
                <MenuItem key={group._id} value={group._id}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            fullWidth
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            multiline
            rows={3}
            fullWidth
          />
          <TextField
            label="Scheduled Date"
            type="date"
            value={formData.scheduledDate}
            onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            fullWidth
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              />
            }
            label="Published"
          />
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/teacher/lectures')}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              {id ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Layout>
  );
};

export default LectureEditor;
