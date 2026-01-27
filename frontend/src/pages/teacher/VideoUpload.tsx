import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Alert,
} from '@mui/material';
import { Upload } from '@mui/icons-material';
import Layout from '../../components/common/Layout';
import { videoService } from '../../services/videoService';
import { lectureService } from '../../services/lectureService';
import { groupService } from '../../services/groupService';
import { Lecture, Group } from '../../types/api';

const VideoUpload: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedLecture, setSelectedLecture] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedLecture) {
      setError('Please select a lecture and video file');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess(false);
    setProgress(0);

    try {
      await videoService.upload(selectedLecture, file);
      setSuccess(true);
      setFile(null);
      setSelectedLecture('');
      setProgress(100);
    } catch (err: any) {
      setError(err.message || 'Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Upload Video
      </Typography>
      <Paper sx={{ p: 3, maxWidth: 800 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Video uploaded successfully!
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

          <Button variant="outlined" component="label" startIcon={<Upload />}>
            Select Video File
            <input type="file" accept="video/*" hidden onChange={handleFileChange} />
          </Button>

          {file && (
            <Typography variant="body2" color="text.secondary">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </Typography>
          )}

          {uploading && (
            <Box>
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Uploading... {progress}%
              </Typography>
            </Box>
          )}

          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!file || !selectedLecture || uploading}
            fullWidth
          >
            Upload Video
          </Button>
        </Box>
      </Paper>
    </Layout>
  );
};

export default VideoUpload;
