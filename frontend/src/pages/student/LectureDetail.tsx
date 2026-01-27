import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Description, VideoLibrary, ArrowBack } from '@mui/icons-material';
import Layout from '../../components/common/Layout';
import Loading from '../../components/common/Loading';
import { lectureService } from '../../services/lectureService';
import { accessService } from '../../services/accessService';
import { Lecture, StudentAccess } from '../../types/api';

const LectureDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [access, setAccess] = useState<StudentAccess | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const lectureData = await lectureService.getById(id);
        setLecture(lectureData);

        try {
          const accessData = await accessService.checkAccess(id);
          setAccess(accessData);
        } catch (err) {
          // No access yet
        }
      } catch (error) {
        console.error('Failed to fetch lecture:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (!lecture) {
    return (
      <Layout>
        <Typography>Lecture not found</Typography>
      </Layout>
    );
  }

  return (
    <Layout>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/student/lectures')}
        sx={{ mb: 2 }}
      >
        Back to Lectures
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {lecture.title}
        </Typography>
        {lecture.description && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {lecture.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          {lecture.isPublished && (
            <Chip label="Published" color="success" />
          )}
          {lecture.scheduledDate && (
            <Chip
              label={`Scheduled: ${new Date(lecture.scheduledDate).toLocaleDateString()}`}
            />
          )}
        </Box>

        {lecture.videoId && (
          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<VideoLibrary />}
              onClick={() => navigate(`/student/video/${lecture._id}`)}
              disabled={!lecture.isPublished}
            >
              Watch Video
            </Button>
            {access && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Views: {access.currentViews} / {access.maxViews}
              </Typography>
            )}
          </Box>
        )}

        {lecture.pdfFiles && lecture.pdfFiles.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Study Materials
            </Typography>
            <List>
              {lecture.pdfFiles.map((pdf, index) => {
                const filename = pdf.split('/').pop() || `PDF ${index + 1}`;
                return (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Description />
                    </ListItemIcon>
                    <ListItemText primary={filename} />
                    <Button
                      size="small"
                      href={lectureService.downloadPDF(lecture._id, filename)}
                      download
                    >
                      Download
                    </Button>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        )}
      </Paper>
    </Layout>
  );
};

export default LectureDetail;
